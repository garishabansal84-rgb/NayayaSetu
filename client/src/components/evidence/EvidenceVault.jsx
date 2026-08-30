import React, { useState, useEffect } from 'react';
import { useCase } from '../../context/CaseContext';
import { useLanguage } from '../../context/LanguageContext';
import { OCRInspector } from './OCRInspector';
import { BSACertificateModal } from './BSACertificateModal';
import { EvidenceClaimMap } from './EvidenceClaimMap';
import { WhyNeeded } from '../common/WhyNeeded';
import { analyzeEvidenceOCR, computeClientSHA256 } from '../../services/api';
import { 
  Camera, Upload, FileText, CheckCircle2, AlertTriangle, 
  Sparkles, Eye, ShieldCheck, ArrowRight, RefreshCw, FileSearch,
  KeyRound, Award, Copy, Check, Layers
} from 'lucide-react';

export const EvidenceVault = () => {
  const { evidenceData, setEvidenceData, setActiveTab, showToast, currentGrievance, currentReferenceId } = useCase();
  const { language, t } = useLanguage();
  const isHi = language === 'hi';
  const [analyzing, setAnalyzing] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [showBSAModal, setShowBSAModal] = useState(false);
  const [sha256Hash, setSha256Hash] = useState('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  const [copiedHash, setCopiedHash] = useState(false);

  const sampleBills = [
    {
      id: 'hospital-ayushman-sample',
      title: language === 'hi' ? 'आयुष्मान अस्पताल अग्रिम मांग रसीद (₹50,000)' : 'Hospital PM-JAY Cash Advance Receipt (₹50,000)',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80',
      data: {
        vendorName: "Lifeline Multi-Speciality Hospital (PM-JAY Empanelled)",
        merchant: "Lifeline Multi-Speciality Hospital (PM-JAY Empanelled)",
        gstin: "Reg No: MED-DEL-77810 / NHA-EHCP",
        invoiceNumber: "ADM-EMRG-2026-9041",
        date: "15/01/2026",
        totalAmount: "₹50,000.00",
        amount: "₹50,000.00",
        productDescription: "Emergency Trauma Stabilization & Admission Advance Deposit Demand",
        items: [{ desc: "Emergency Trauma Stabilization Advance Deposit", amount: "₹50,000.00" }],
        sha256Hash: "7754d9827bab3948e50a98216c4f039184561029384756abcdef0192837465aa",
        bsa63Admissible: true,
        keyFindings: [
          "Hospital demanded ₹50,000 advance deposit prior to emergency trauma stabilization",
          "Patient possesses valid Ayushman Bharat PM-JAY Golden Card entitled to 100% cashless treatment",
          "Demanding cash advance violates Section 134(a) Motor Vehicles Act and NHA Clause 7.2"
        ],
        keyFacts: [
          "Hospital demanded ₹50,000 advance deposit prior to emergency trauma stabilization",
          "Patient possesses valid Ayushman Bharat PM-JAY Golden Card entitled to 100% cashless treatment",
          "Demanding cash advance violates Section 134(a) Motor Vehicles Act and NHA Clause 7.2"
        ],
        breachPoint: "Unlawful ₹50,000 cash advance demanded before emergency trauma stabilization, violating Section 134(a) Motor Vehicles Act, Section 12(2) Clinical Establishments Act, and NHA PM-JAY Clause 7.2 cashless mandate."
      }
    },
    {
      id: 'upi-rent-deposit-sample',
      title: language === 'hi' ? 'यूपीआई मकान सुरक्षा जमा रसीद (₹20,000)' : 'UPI Security Deposit Receipt (₹20,000)',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop&q=80',
      data: {
        vendorName: "Property Owner – Mr. Prakash Kumar",
        merchant: "Property Owner – Mr. Prakash Kumar",
        gstin: "UPI UTR: 624781039856",
        invoiceNumber: "UTR: 624781039856 / Txn ID: T2501151137219876543210",
        date: "15/01/2026",
        totalAmount: "₹20,000.00",
        amount: "₹20,000.00",
        productDescription: "Security Deposit Consideration for Flat – 2B, Green View Apartments",
        items: [{ desc: "Security Deposit for Flat – 2B, Green View Apartments", amount: "₹20,000.00" }],
        sha256Hash: "f4b892a0e41768c6e289bf65d836b9e27c1a84f3e6d52c1b98a7102e3456789a",
        bsa63Admissible: true,
        keyFindings: [
          "Verifiable UPI transaction establishing ₹20,000 security deposit remittance to landlord Mr. Prakash Kumar",
          "Arbitrary deduction for painting and general cleaning without providing itemized repair bills or contractor receipts",
          "Section 11 Model Tenancy Act mandates full return of security deposit within statutory window upon handover"
        ],
        keyFacts: [
          "Verifiable UPI transaction establishing ₹20,000 security deposit remittance to landlord Mr. Prakash Kumar",
          "Arbitrary deduction for painting and general cleaning without providing itemized repair bills or contractor receipts",
          "Section 11 Model Tenancy Act mandates full return of security deposit within statutory window upon handover"
        ],
        breachPoint: "Unlawful retention and arbitrary deduction of ₹20,000 security deposit for painting and cleaning without contractor bills or prior notice, violating Section 11 Model Tenancy Act."
      }
    },
    {
      id: 'flipkart-sample',
      title: language === 'hi' ? 'फ्लिपकार्ट स्मार्टफोन इनवॉइस (₹19,999)' : 'Flipkart Smartphone Invoice (₹19,999)',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80',
      data: {
        vendorName: "FLIPKART INDIA PVT LTD",
        merchant: "FLIPKART INDIA PVT LTD",
        gstin: "09AAACH7409R1ZZ",
        invoiceNumber: "IN-2024-88491",
        date: "12/01/2025",
        totalAmount: "₹19,999.00",
        amount: "₹19,999.00",
        items: [{ desc: "Smartphone 5G (8GB/128GB)", amount: "₹19,999.00" }],
        sha256Hash: "d2983b4c10ef89a12c45e67890bfa321567489ab1034e5678cd90123ef456789",
        bsa63Admissible: true,
        keyFindings: [
          "Valid GSTIN matches official MCA records.",
          "Payment cleared via UPI; statutory transaction completed.",
          "Warranty period explicitly states 1 Year Manufacturer Warranty.",
          "Return window rejection violates Section 2(47) CPA 2019 (Unfair Trade Practice)."
        ],
        keyFacts: [
          "Valid GSTIN matches official MCA records.",
          "Payment cleared via UPI; statutory transaction completed.",
          "Warranty period explicitly states 1 Year Manufacturer Warranty.",
          "Return window rejection violates Section 2(47) CPA 2019 (Unfair Trade Practice)."
        ],
        breachPoint: "Defective hardware delivered within 7-day statutory trial period. Unfair refusal to replace."
      }
    },
    {
      id: 'rent-bond-sample',
      title: language === 'hi' ? 'किराया समझौता स्टाम्प पेपर (₹50,000)' : 'Rental Agreement Stamp Paper (₹50,000)',
      image: 'https://images.unsplash.com/photo-1554415707-9e49017a421b?w=600&auto=format&fit=crop&q=80',
      data: {
        vendorName: "S. K. Sharma (Landlord)",
        merchant: "S. K. Sharma (Landlord)",
        gstin: "Stamp Duty Ref: UP-ST-99120",
        invoiceNumber: "LEASE-BOND-2024",
        date: "01/04/2024",
        totalAmount: "₹50,000.00 (Deposit)",
        amount: "₹50,000.00",
        items: [{ desc: "Refundable Security Deposit Consideration", amount: "₹50,000.00" }],
        sha256Hash: "b89012c45e67890bfa321567489ab1034e5678cd90123ef456789d2983b4c10e",
        bsa63Admissible: true,
        keyFindings: [
          "Clause 4 explicitly states: Security deposit refundable within 30 days of vacation.",
          "Zero outstanding electricity or maintenance dues confirmed on exit clearance.",
          "Violation of Model Tenancy Act 2021 Section 11(2)."
        ],
        keyFacts: [
          "Clause 4 explicitly states: Security deposit refundable within 30 days of vacation.",
          "Zero outstanding electricity or maintenance dues confirmed on exit clearance.",
          "Violation of Model Tenancy Act 2021 Section 11(2)."
        ],
        breachPoint: "Unlawful retention of security deposit beyond statutory 30-day window."
      }
    }
  ];

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Calculate real-time SHA-256 hash
    const computedHash = await computeClientSHA256(file);
    setSha256Hash(computedHash);

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
      processOCR(file, computedHash);
    };
    reader.readAsDataURL(file);
  };

  const processOCR = async (file, computedHash = null) => {
    setAnalyzing(true);
    try {
      const result = await analyzeEvidenceOCR(file, currentGrievance || '', currentReferenceId || '');
      if (result && (result.success || result.data || result.extractedData || result.ocrResult)) {
        const data = result.data?.ocrResult || result.data?.extractedData || result.extractedData || result.ocrResult;
        if (data) {
          if (computedHash) data.sha256Hash = computedHash;
          if (result.sha256Hash) setSha256Hash(result.sha256Hash);
          setEvidenceData(data);
          showToast('Document evidence extracted successfully with AI Vision.', 'success');
        } else {
          throw new Error('No structured facts found in OCR output.');
        }
      } else {
        throw new Error('OCR extraction returned empty response.');
      }
    } catch (err) {
      console.error('Evidence OCR live extraction error:', err.message);
      showToast(`AI OCR Error: ${err.message}. You can use 'Edit Details' to enter particulars manually.`, 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  const loadSample = async (sample) => {
    setPreviewImage(sample.image);
    setEvidenceData(sample.data);
    if (sample.data.sha256Hash) {
      setSha256Hash(sample.data.sha256Hash);
    } else {
      const h = await computeClientSHA256(sample.title);
      setSha256Hash(h);
    }
    showToast(`Loaded benchmark sample: ${sample.title}`, 'info');
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(sha256Hash);
    setCopiedHash(true);
    showToast('SHA-256 Checksum copied to clipboard.', 'info');
    setTimeout(() => setCopiedHash(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in text-slate-800">
      
      {/* Header Card */}
      <div className="gov-card p-6 bg-gradient-to-r from-slate-50 to-slate-100/60 border-slate-300">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
            Multimodal Evidence Forensics & Document Audit
          </span>
          <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded bg-[#0A2540] text-emerald-300 border border-slate-700 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>BSA 2023 SEC 63 COMPLIANT</span>
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#0A2540]">
          {t.evidenceTitle}
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          {t.evidenceSub}
        </p>
      </div>

      {/* Main Grid: Upload Area vs Forensic Analysis Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Upload & Document Selector */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="gov-card p-6 space-y-4 border-slate-300 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A2540]">
                {isHi ? 'बिल, इनवॉइस या रेंट एग्रीमेंट अपलोड करें' : 'Upload Bill, Invoice, or Legal Agreement'}
              </h3>
              <WhyNeeded code="PROOF_OF_PAYMENT" variant="button" />
            </div>


            <label className="border-2 border-dashed border-slate-300 hover:border-[#1E3A8A] rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50 hover:bg-blue-50/30 block text-center">
              <Upload className="w-8 h-8 text-slate-500 mb-2" />
              <span className="text-xs sm:text-sm font-bold text-[#0A2540] block">
                {t.uploadPrompt}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Supports JPG, PNG, PDF receipts up to 15MB
              </span>
              <input 
                type="file" 
                accept="image/*,application/pdf" 
                onChange={handleFileUpload} 
                className="hidden" 
              />
            </label>

            {/* Benchmark Samples */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-700 block">
                {t.sampleInvoicesLabel}
              </span>
              <div className="space-y-2">
                {sampleBills.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => loadSample(sample)}
                    className="w-full text-left p-3 rounded-md border border-slate-200 hover:border-[#0A2540] bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 flex items-center justify-between shadow-2xs transition-colors cursor-pointer"
                  >
                    <span className="truncate">{sample.title}</span>
                    <FileSearch className="w-4 h-4 text-slate-500" />
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* SHA-256 Cryptographic Evidence Integrity Card */}
          <div className="gov-card p-4 bg-slate-900 text-white rounded-lg space-y-3 border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wide">
                <KeyRound className="w-4 h-4" />
                <span>BSA 2023 Sec 63 SHA-256 Integrity Seal</span>
              </div>
              <button
                onClick={handleCopyHash}
                className="flex items-center gap-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded border border-slate-700 cursor-pointer"
              >
                {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedHash ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="p-2 bg-slate-950 rounded border border-slate-800 font-mono text-[10px] text-emerald-300 break-all select-all">
              {sha256Hash}
            </div>

            <button
              onClick={() => setShowBSAModal(true)}
              className="w-full py-2 px-3 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>Generate BSA Section 63 Court Certificate</span>
            </button>
          </div>

          {/* Document Preview Image */}
          {previewImage && (
            <div className="gov-card p-4 space-y-2 border-slate-300 bg-white shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Document Preview
              </span>
              <div className="rounded overflow-hidden border border-slate-200 max-h-64 flex items-center justify-center bg-slate-950">
                <img src={previewImage} alt="Preview" className="object-contain max-h-64 w-full" />
              </div>
            </div>
          )}

          {/* Citizen Privacy & Banking Security Shield Card */}
          <div className="gov-card p-4 bg-slate-900 text-white rounded-lg space-y-2.5 border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4" />
              <span>{language === 'hi' ? 'नागरिक डेटा सुरक्षा एवं साक्ष्य संप्रभुता' : 'Citizen Privacy & Evidentiary Sovereignty'}</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {language === 'hi'
                ? 'DPDP अधिनियम 2023 एवं भारतीय साक्ष्य अधिनियम 2023 (धारा 63): डिजिटल साक्ष्य को SHA-256 हैश द्वारा सील किया जाता है। बैंक विवरण केवल कानूनी नोटिस में रिफंड गंतव्य के लिए उपयोग किए जाते हैं।'
                : 'Under DPDP Act 2023 & Bharatiya Sakshya Adhiniyam 2023 (Section 63): Digital evidence is cryptographically sealed with SHA-256 digests. Bank/ID data is strictly purpose-bound for statutory claim notices.'}
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1 text-[10px] text-slate-400 border-t border-slate-800">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>TLS 1.3 In-Transit Encryption</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Zero Card/CVV Storage</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>DPDP Act 2023 Purpose Bound</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>BSA 2023 Sec 63 Certified</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Col: Forensic OCR Inspector */}
        <div className="lg:col-span-7">
          <OCRInspector 
            evidenceData={evidenceData} 
            analyzing={analyzing}
            sha256Hash={sha256Hash}
            onOpenBSAModal={() => setShowBSAModal(true)}
          />
        </div>

      </div>

      {/* FEATURE 2: EVIDENCE -> CLAIM INTELLIGENCE MAP */}
      <EvidenceClaimMap />

      {/* BSA Section 63 Certificate Modal */}

      <BSACertificateModal
        isOpen={showBSAModal}
        onClose={() => setShowBSAModal(false)}
        evidenceData={evidenceData}
        sha256Hash={sha256Hash}
      />

    </div>
  );
};
export default EvidenceVault;

