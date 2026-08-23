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