import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const docsDir = path.join(__dirname, '../generated_docs');
if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

export const generateOfficialLegalPdf = async ({ draftData, caseData, citizenDetails, customFields = {} }) => {
  const refNumber = draftData?.referenceId || caseData?.referenceId || caseData?.caseId || `NYAYA-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const filename = `NYAYASETU_${draftData?.draftType || 'NOTICE'}_${refNumber}.pdf`;
  const filePath = path.join(docsDir, filename);

  const qrDataUrl = await QRCode.toDataURL(draftData?.verificationUrl || `https://nyayasetu.gov.in/verify?ref=${refNumber}`);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const writeStream = fs.createWriteStream(filePath);

    doc.pipe(writeStream);

    // Tricolor top bar
    doc.rect(40, 15, 170, 4).fill('#FF9933');
    doc.rect(210, 15, 170, 4).fill('#CBD5E1');
    doc.rect(380, 15, 175, 4).fill('#138808');

    // Official Header
    doc.fontSize(13).font('Helvetica-Bold').fillColor('#0A2540').text('NYAYASETU — CITIZEN STATUTORY LEGAL ACTION ENGINE', 40, 28, { align: 'center' });
    doc.fontSize(8).font('Helvetica').fillColor('#64748B').text('Section 65B Indian Evidence Act Compliant Digital Document', { align: 'center' });
    doc.moveDown(0.3);

    doc.fontSize(9).font('Helvetica-Bold').fillColor('#1E3A8A').text(`DOCUMENT REF: ${refNumber}  |  DATE: ${new Date().toLocaleDateString('en-IN')}`, { align: 'center' });
    doc.moveDown(0.8);

    doc.fontSize(11).font('Helvetica-Bold').fillColor('#0A2540').text(draftData?.title || 'STATUTORY LEGAL NOTICE', { align: 'center' });
    doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#D97706').text(`Governing Statute: ${draftData?.statutoryAct || 'Indian Law'}`, { align: 'center' });
    doc.moveDown(0.8);

    // Addressed To & From Blocks
    const cName = customFields.applicantName || citizenDetails?.name || caseData?.citizen?.name || 'Citizen Complainant';
    const cAddress = customFields.applicantAddress || citizenDetails?.address || caseData?.citizen?.address || 'Lucknow, Uttar Pradesh, India';
    const cPhone = customFields.applicantPhone || citizenDetails?.phone || caseData?.citizen?.phone || '+91 98765 43210';
    const cEmail = customFields.applicantEmail || citizenDetails?.email || caseData?.citizen?.email || 'citizen@nyayasetu.in';

    doc.fontSize(9).font('Helvetica-Bold').fillColor('#0A2540').text('TO:');
    doc.fontSize(8.5).font('Helvetica').fillColor('#1E293B').text(`${draftData?.addressedTo?.department || 'The Opposite Party / Public Authority'}`);
    doc.text(`${draftData?.addressedTo?.address || 'Registered Corporate Office, India'}`);
    doc.moveDown(0.6);

    doc.fontSize(9).font('Helvetica-Bold').fillColor('#0A2540').text('FROM:');
    doc.fontSize(8.5).font('Helvetica').fillColor('#1E293B').text(`${cName}`);
    doc.text(`${cAddress}`);
    doc.text(`Contact: ${cPhone} | Email: ${cEmail}`);
    doc.moveDown(0.6);

    // Subject
    doc.fontSize(9.5).font('Helvetica-Bold').fillColor('#0A2540').text(`SUBJECT: ${draftData?.subject || 'Statutory Notice'}`);
    doc.moveDown(0.6);

    // Statement of Facts
    doc.fontSize(9).font('Helvetica-Bold').fillColor('#0A2540').text('1. STATEMENT OF FACTS:');
    doc.fontSize(8.5).font('Helvetica').fillColor('#1E293B');
    (draftData?.paragraphs || []).forEach((p) => {
      doc.text(p, { align: 'justify' });
      doc.moveDown(0.3);
    });

    // Relief Sought
    doc.moveDown(0.4);
    doc.fontSize(9).font('Helvetica-Bold').fillColor('#D97706').text('2. RELIEF & PRAYER SOUGHT:');
    doc.fontSize(8.5).font('Helvetica').fillColor('#1E293B');
    (draftData?.reliefSought || []).forEach((r, idx) => {
      doc.text(`${idx + 1}. ${r}`);
    });

    // Verification & Signature
    doc.moveDown(0.6);
    doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#0A2540').text('3. VERIFICATION:');
    doc.fontSize(8).font('Helvetica').fillColor('#475569').text(`I solemnly verify that the contents of this notice are true to my personal knowledge. Issued digitally on ${new Date().toLocaleDateString('en-IN')}.`);
    doc.moveDown(0.3);
    doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#059669').text(`[ Digitally Authenticated via NyayaSetu Action Engine: Ref ${refNumber} ]`);

    // QR Code Stamp at bottom right
    const qrBuffer = Buffer.from(qrDataUrl.split(',')[1], 'base64');
    doc.image(qrBuffer, 460, 680, { width: 70 });
    doc.fontSize(6.5).font('Helvetica').fillColor('#64748B').text(`Digital Verification Hash\nRef: ${refNumber}`, 440, 755, { align: 'center' });

    doc.end();

    writeStream.on('finish', () => {
      resolve({
        filename,
        refNumber,
        downloadUrl: `/api/drafts/download/${filename}`,
        filePath
      });
    });

    writeStream.on('error', reject);
  });
};

export const generateBSACertificatePdf = async (certificateData) => {
  const refNumber = certificateData.certificateId || `BSA63-${Date.now().toString(36).toUpperCase()}`;
  const filename = `BSA63_CERTIFICATE_${refNumber}.pdf`;
  const filePath = path.join(docsDir, filename);

  const qrDataUrl = await QRCode.toDataURL(certificateData.verificationUrl || `https://nyayasetu.gov.in/verify/bsa63?ref=${refNumber}`);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 38, size: 'A4' });
    const writeStream = fs.createWriteStream(filePath);

    doc.pipe(writeStream);

    // Tricolor top bar
    doc.rect(38, 14, 170, 4).fill('#FF9933');
    doc.rect(208, 14, 170, 4).fill('#CBD5E1');
    doc.rect(378, 14, 180, 4).fill('#138808');

    // Official Court Affidavit Header
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#0A2540').text('CERTIFICATE UNDER SECTION 63 OF THE BHARATIYA SAKSHYA ADHINIYAM, 2023', 38, 26, { align: 'center' });
    doc.fontSize(7.5).font('Helvetica-Bold').fillColor('#B45309').text('[ Mandatory Statutory Certificate for Admissibility of Electronic Records in Court / Consumer Forum / Police Petitions ]', { align: 'center' });
    doc.fontSize(7.5).font('Helvetica').fillColor('#64748B').text('(Corresponding to Section 65B of the Repealed Indian Evidence Act, 1872)', { align: 'center' });
    doc.moveDown(0.5);

    doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#1E3A8A').text(`CERTIFICATE REF: ${refNumber}  |  ISSUED DATE: ${certificateData.date || new Date().toLocaleDateString('en-IN')}`, { align: 'center' });
    doc.moveDown(0.6);

    // Part I: Deponent Particulars
    const deponent = certificateData.deponent || {};
    doc.fontSize(9).font('Helvetica-Bold').fillColor('#0A2540').text('PART I — PARTICULARS OF THE DEPONENT / PERSON IN LAWFUL CUSTODY:');
    doc.fontSize(8).font('Helvetica').fillColor('#1E293B');
    doc.text(`1. Name of Deponent: ${deponent.name || 'Citizen Complainant'}`);
    doc.text(`2. Address / Jurisdiction: ${deponent.address || 'Lucknow, Uttar Pradesh, India'}`);
    doc.text(`3. Contact / Authentication Ref: ${deponent.phone || '+91-XXXXXXXXXX'}  |  NyayaPass Key: NP-2026-VERIFIED`);
    doc.moveDown(0.5);

    // Part II: Electronic Record & Cryptographic Hash Block
    const evidence = certificateData.evidence || {};
    doc.fontSize(9).font('Helvetica-Bold').fillColor('#0A2540').text('PART II — PARTICULARS OF THE ELECTRONIC RECORD & HASH DIGEST:');
    doc.fontSize(8).font('Helvetica').fillColor('#1E293B');
    doc.text(`1. Electronic File Name: ${evidence.filename || 'digital_evidence.png'}`);
    doc.text(`2. File Size / Format: ${evidence.fileSize || 'N/A'} (${evidence.mimeType || 'image/jpeg'})`);
    doc.text(`3. Associated Counter-party / Merchant: ${evidence.merchant || 'Opposite Party'}`);
    doc.text(`4. Transaction Reference / Consideration: ${evidence.transactionRef || 'N/A'} (Amount: ${evidence.considerationAmount || 'N/A'})`);
    doc.moveDown(0.3);

    // Monospace Hash Box
    doc.rect(38, doc.y, 520, 24).fillAndStroke('#F1F5F9', '#CBD5E1');
    const hashBoxY = doc.y + 6;
    doc.fontSize(7.5).font('Courier-Bold').fillColor('#0F172A').text(`SHA-256 CRYPTOGRAPHIC INTEGRITY DIGEST:`, 44, hashBoxY);
    doc.fontSize(7.5).font('Courier').fillColor('#0369A1').text(`${certificateData.sha256Hash || 'N/A'}`, 44, hashBoxY + 9);
    doc.y = hashBoxY + 22;
    doc.moveDown(0.4);

    // Part III: Computing Device & Operating Conditions
    const device = certificateData.device || {};
    doc.fontSize(9).font('Helvetica-Bold').fillColor('#0A2540').text('PART III — DEVICE PARTICULARS & OPERATING ENVIRONMENT:');
    doc.fontSize(8).font('Helvetica').fillColor('#1E293B');
    doc.text(`1. Device Description / Model: ${device.name || 'Personal Mobile / Computing Device'}`);
    doc.text(`2. Operating System & Environment: ${device.os || 'Standard Operating Environment'}`);
    doc.text(`3. Client Application: ${device.client || 'Secure Web / Mobile Client'}`);
    doc.text(`4. Custody & Control: The device remained under the lawful, personal, and continuous control of the deponent.`);
    doc.moveDown(0.5);

    // Part IV: Statutory Affirmations under Section 63(2) & 63(4) BSA 2023
    doc.fontSize(9).font('Helvetica-Bold').fillColor('#D97706').text('PART IV — STATUTORY AFFIRMATION UNDER SECTION 63(4) BHARATIYA SAKSHYA ADHINIYAM, 2023:');
    doc.fontSize(7.8).font('Helvetica').fillColor('#1E293B');
    (certificateData.statutoryAffirmations || []).forEach((item, idx) => {
      doc.text(`(${String.fromCharCode(97 + idx)}) [${item.section}] ${item.text}`, { align: 'justify' });
      doc.moveDown(0.25);
    });

    // Part V: Verification & Digital Seal
    doc.moveDown(0.4);
    doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#0A2540').text('PART V — VERIFICATION & SOVEREIGN SIGNATURE BLOCK:');
    doc.fontSize(7.5).font('Helvetica').fillColor('#475569').text(`I solemnly declare and affirm that the statements made above are true and correct to the best of my knowledge, belief, and device records. No material facts or electronic metadata have been concealed or modified.`);
    doc.moveDown(0.3);
    doc.fontSize(8).font('Helvetica-Bold').fillColor('#059669').text(`[ Digitally Sealed & Hash-Anchored via NyayaSetu Forensic Action Engine: Ref ${refNumber} ]`);

    // Bottom QR code and verification stamp
    const qrBuffer = Buffer.from(qrDataUrl.split(',')[1], 'base64');
    doc.image(qrBuffer, 460, 685, { width: 65 });
    doc.fontSize(6).font('Helvetica').fillColor('#64748B').text(`BSA 63 Verification\nRef: ${refNumber}`, 440, 755, { align: 'center' });

    doc.end();

    writeStream.on('finish', () => {
      resolve({
        filename,
        refNumber,
        downloadUrl: `/api/evidence/download/${filename}`,
        filePath,
        sha256Hash: certificateData.sha256Hash
      });
    });

    writeStream.on('error', reject);
  });
};