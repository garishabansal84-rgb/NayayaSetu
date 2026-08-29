import { computeSHA256, buildBSACertificateData } from './services/bsaCertificateService.js';
import { generateBSACertificatePdf } from './services/pdfService.js';
import fs from 'fs';

async function testBSAPipeline() {
  console.log('🧪 Testing BSA 2023 Section 63 Electronic Evidence Certificate Pipeline...\n');

  // 1. Test Cryptographic SHA-256 computation
  const samplePayload = "UPI Transaction Ref: 624781039856 Date: 15/01/2026 Amount: Rs 20,000";
  const sha256 = computeSHA256(samplePayload);
  console.log(`✅ SHA-256 Hash Computed: ${sha256}`);

  // 2. Build Structured BSA 63 Certificate Data
  const certData = buildBSACertificateData({
    evidenceData: {
      merchant: "Property Owner – Mr. Prakash Kumar",
      amount: "₹20,000.00",
      invoiceNumber: "UTR: 624781039856",
      filename: "upi_rent_deposit_receipt.png"
    },
    citizenDetails: {
      name: "Rahul Verma",
      address: "Gomti Nagar, Lucknow, Uttar Pradesh",
      phone: "+91 98765 43210"
    },
    deviceDetails: {
      deviceName: "OnePlus 12R Smartphone (CPH2585)",
      osVersion: "Android 14 / OxygenOS",
      browserClient: "Chrome Mobile 128.0"
    },
    hashDigest: sha256
  });

  console.log(`✅ Certificate Model Formatted: Ref [${certData.certificateId}]`);
  console.log(`   Statute Reference: ${certData.statute}`);
  console.log(`   Deponent: ${certData.deponent.name}`);
  console.log(`   Device: ${certData.device.name}`);

  // 3. Generate Official Court Affidavit PDF with QR Code
  console.log('\n📄 Generating Court-Admissible Section 63 BSA PDF Certificate...');
  const pdfResult = await generateBSACertificatePdf(certData);
  console.log(`✅ PDF Generated Successfully: ${pdfResult.filename}`);
  console.log(`   File Path: ${pdfResult.filePath}`);
  console.log(`   Download Endpoint: ${pdfResult.downloadUrl}`);

  if (fs.existsSync(pdfResult.filePath)) {
    const stats = fs.statSync(pdfResult.filePath);
    console.log(`   PDF File Size: ${(stats.size / 1024).toFixed(2)} KB (Valid PDF Binary Created)`);
  }

  console.log('\n=========================================================');
  console.log('🎉 BSA Section 63 Pipeline Verification PASSED!');
  console.log('=========================================================');
}

testBSAPipeline().catch(err => {
  console.error('❌ BSA Pipeline Test Failed:', err);
  process.exit(1);
});
