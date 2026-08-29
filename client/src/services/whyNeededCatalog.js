/**
 * Why Needed Explanation Catalog for NyayaSetu
 * Citizen-friendly statutory explanations for documents, evidence, and case requirements.
 */

export const WHY_NEEDED_CATALOG = {
  // Evidence & Financial Documents
  PROOF_OF_PAYMENT: {
    title: 'Proof of Payment (UPI / Bank Receipt / Invoice)',
    hindiTitle: 'भुगतान का प्रमाण (UPI / बैंक रसीद / इनवॉइस)',
    whyNeeded: 'This establishes that the financial transaction or consideration actually occurred between you and the opposite party, proving contractual relationship under Contract Act Section 2(d).',
    hindiWhyNeeded: 'यह साबित करता है कि आपके और विपक्षी पार्टी के बीच वास्तविक वित्तीय लेन-देन हुआ था, जो अनुबंध अधिनियम की धारा 2(d) के तहत कानूनी संबंध स्थापित करता है।',
    statute: 'Indian Contract Act 1872 & Consumer Protection Act 2019',
    impactOnCase: '+15% Evidence Strength & Unlocks Financial Restitution Claim',
    recommendedFormats: 'UPI Screenshot with UTR, Bank Statement PDF, Cash Receipt with Revenue Stamp'
  },
  INVOICE_BILL: {
    title: 'Tax Invoice / Cash Memo',
    hindiTitle: 'टैक्स इनवॉइस / बिल',
    whyNeeded: 'Serves as authentic primary proof of purchase, item specifications, warranty terms, and merchant GSTIN identification for e-Daakhil and Consumer Commission filing.',
    hindiWhyNeeded: 'यह खरीद, उत्पाद विनिर्देश, वारंटी शर्तों और विक्रेता के GSTIN पहचान का आधिकारिक प्राथमिक प्रमाण है।',
    statute: 'Consumer Protection Act 2019, Section 2(47)',
    impactOnCase: 'Mandatory for Consumer Forum petition maintainability',
    recommendedFormats: 'Official PDF Invoice or clear photo showing GSTIN and serial number'
  },
  RENTAL_AGREEMENT: {
    title: 'Registered / Notarized Rental Agreement',
    hindiTitle: 'किराया समझौता / रेंट एग्रीमेंट',
    whyNeeded: 'Establishes the tenancy terms, agreed monthly rent, security deposit amount, and vacation covenants under the Model Tenancy Act.',
    hindiWhyNeeded: 'यह मॉडल टेनेंसी एक्ट के तहत किराये की अवधि, सुरक्षा जमा राशि और मकान खाली करने की शर्तों को कानूनी रूप से प्रमाणित करता है।',
    statute: 'Model Tenancy Act 2021, Section 4 & Section 11',
    impactOnCase: 'Enables statutory 2x penalty claim for deposit withholding',
    recommendedFormats: 'Stamp Paper Agreement or Notarized Lease Deed copy'
  },
  REFUSAL_COMMUNICATION: {
    title: 'Communication with Opposite Party (Email / WhatsApp / Letter)',
    hindiTitle: 'विपक्षी पार्टी के साथ संचार (ईमेल / व्हाट्सएप / पत्र)',
    whyNeeded: 'Proves that the opposite party was duly notified of the grievance, defect, or breach, and explicitly refused, delayed, or ignored your statutory cure request.',
    hindiWhyNeeded: 'यह साबित करता है कि आपने विपक्षी पार्टी को समस्या की सूचना दी थी और उन्होंने आपकी मांग को अस्वीकार या अनदेखा किया।',
    statute: 'Bharatiya Sakshya Adhiniyam 2023, Section 63',
    impactOnCase: 'Eliminates opponent defense of "lack of prior notice"',
    recommendedFormats: 'Exported WhatsApp Chat, Email PDF with headers, Speed Post AD Slip'
  },
  DELIVERY_PROOF: {
    title: 'Delivery Proof / Unboxing Condition',
    hindiTitle: 'डिलीवरी प्रमाण / अनबॉक्सिंग स्थिति',
    whyNeeded: 'Establishes the exact date and condition of transit arrival, mathematically proving that your return or replacement request was initiated within the statutory return window.',
    hindiWhyNeeded: 'यह डिलीवरी की सटीक तारीख और स्थिति साबित करता है, जिससे तय होता है कि आपने निर्धारित समय सीमा में शिकायत दर्ज की।',
    statute: 'Consumer Protection (E-Commerce) Rules 2020, Rule 6',
    impactOnCase: 'Neutralizes corporate safe harbor and transit damage denials',
    recommendedFormats: 'Delivery SMS/Email, Timestamped photo/video of damaged package'
  },
  CONTRACTOR_REPAIR_BILLS: {
    title: 'Itemized Contractor Bills for Deductions',
    hindiTitle: 'मरम्मत / पुताई के बिल',
    whyNeeded: 'Demolishes arbitrary landlord deductions by legally requiring third-party GSTIN contractor receipts rather than subjective verbal estimates.',
    hindiWhyNeeded: 'मकान मालिक द्वारा मनमानी कटौती को रोकने के लिए अधिकृत ठेकेदार के पक्के जीएसटी बिल की मांग करता है।',
    statute: 'Model Tenancy Act 2021, Section 11(2)',
    impactOnCase: 'Mandatory to recover withheld rental deposits',
    recommendedFormats: 'Itemized Tax Invoice of repairs or written quotation'
  },

  // Identity & Legal Aid Documents
  DOC_AADHAAR: {
    title: 'Aadhaar Identity Proof',
    hindiTitle: 'आधार कार्ड पहचान प्रमाण',
    whyNeeded: 'Verifies the citizen applicant identity using Verhoeff checksum validation to generate the official NyayaPass without storing sensitive biometric records.',
    hindiWhyNeeded: 'नागरिक पहचान का सत्यापन करता है और बायोमेट्रिक डेटा सुरक्षित रखते हुए डिजिटल न्यायपास जारी करता है।',
    statute: 'Aadhaar Act 2016 & e-Courts Filing Protocols',
    impactOnCase: 'Unlocks authorized e-filing and legal dispatch relay',
    recommendedFormats: 'Masked Aadhaar Card (Last 4 Digits visible)'
  },
  DOC_INCOME: {
    title: 'Income Certificate / Self-Declaration',
    hindiTitle: 'आय प्रमाण पत्र (< ₹2.5 लाख/वर्ष)',
    whyNeeded: 'Determines statutory eligibility for 100% Free Legal Aid under NALSA Section 12, PM-JAY Ayushman Bharat health coverage, and court fee waivers.',
    hindiWhyNeeded: 'नालसा धारा 12 के तहत मुफ्त सरकारी वकील, आयुष्मान भारत और अदालती शुल्क छूट की पात्रता तय करता है।',
    statute: 'Legal Services Authorities Act 1987, Section 12',
    impactOnCase: 'Entitles citizen to free Legal Aid advocate and waived court fee',
    recommendedFormats: 'Tehsildar issued Income Certificate or BPL Ration Card'
  },
  DOC_RATION: {
    title: 'Ration Card (NFSA / Antyodaya / BPL)',
    hindiTitle: 'राशन कार्ड (राष्ट्रीय खाद्य सुरक्षा / बीपीएल)',
    whyNeeded: 'Provides immediate socio-economic category verification for priority welfare scheme disbursement and civil assistance.',
    hindiWhyNeeded: 'प्राथमिकता कल्याण योजनाओं और खाद्य सुरक्षा सहायता के लिए पात्रता प्रमाणित करता है।',
    statute: 'National Food Security Act 2013',
    impactOnCase: 'Automatic qualification for BPL Legal Aid schemes',
    recommendedFormats: 'NFSA Ration Card copy or e-Ration digital slip'
  },
  DOC_BANK_PASSBOOK: {
    title: 'Bank Passbook (NPCI / DBT Seeded)',
    hindiTitle: 'बैंक पासबुक (डीबीटी / आधार से लिंक)',
    whyNeeded: 'Ensures direct statutory compensation, penalty refunds, or welfare scheme grants are deposited directly into your verified bank account.',
    hindiWhyNeeded: 'यह सुनिश्चित करता है कि अदालत द्वारा दी गई मुआवजा राशि या सरकारी सहायता सीधे आपके बैंक खाते में जमा हो।',
    statute: 'Direct Benefit Transfer (DBT) Guidelines & RBI KYC Norms',
    impactOnCase: 'Required for execution of monetary relief awards',
    recommendedFormats: 'First page of Passbook showing Account No and IFSC or Cancelled Cheque'
  },
  DOC_DOMICILE: {
    title: 'Domicile / Residence Certificate',
    hindiTitle: 'निवास प्रमाण पत्र',
    whyNeeded: 'Confirms territorial jurisdiction for state-specific legal tribunals, State Consumer Commissions, and district welfare quotas.',
    hindiWhyNeeded: 'राज्य उपभोक्ता आयोग, जिला अदालतों और स्थानीय योजनाओं के लिए क्षेत्रीय अधिकार क्षेत्र स्थापित करता है।',
    statute: 'Code of Civil Procedure 1908, Section 20',
    impactOnCase: 'Fixes territorial jurisdiction without forum transfer objections',
    recommendedFormats: 'Tehsildar / SDO issued Niwas Praman Patra'
  },
  DOC_CASTE: {
    title: 'Caste Certificate (SC / ST / OBC)',
    hindiTitle: 'जाति प्रमाण पत्र (SC / ST / OBC)',
    whyNeeded: 'Verifies eligibility for special affirmative legal aid schemes, social justice commissions, and SC/ST Prevention of Atrocities statutory relief.',
    hindiWhyNeeded: 'अनुसूचित जाति/जनजाति अत्याचार निवारण अधिनियम और विशेष कानूनी सहायता योजनाओं की पात्रता प्रमाणित करता है।',
    statute: 'SC & ST (Prevention of Atrocities) Act 1989 & NALSA Guidelines',
    impactOnCase: 'Enables Section 12(a) free legal counsel regardless of income',
    recommendedFormats: 'Competent Authority issued Caste Certificate'
  },
  DOC_LAND_KHATAUNI: {
    title: 'Land Record (Khatauni / RoR / Sale Deed)',
    hindiTitle: 'भू-अभिलेख (खतौनी / खसरा / रजिस्ट्री)',
    whyNeeded: 'Establishes title, ownership, boundary demarcation, and agricultural survey numbers for revenue and mutation dispute resolution.',
    hindiWhyNeeded: 'जमीन के स्वामित्व, रकबा, खसरा संख्या और नामांतरण विवादों के लिए राजस्व रिकॉर्ड प्रमाणित करता है।',
    statute: 'State Land Revenue Code & Transfer of Property Act 1882',
    impactOnCase: 'Primary evidence for Revenue Court and Tehsildar proceedings',
    recommendedFormats: 'Certified Bhulekh / RoR copy or Registered Sale Deed'
  }
};

/**
 * Helper to retrieve explanation object with fallback
 */
export const getWhyNeededInfo = (code) => {
  if (!code) return WHY_NEEDED_CATALOG.PROOF_OF_PAYMENT;
  const upper = String(code).toUpperCase().trim();
  return WHY_NEEDED_CATALOG[upper] || {
    title: code,
    hindiTitle: code,
    whyNeeded: 'This document establishes key factual assertions in your case record, ensuring that claims made in your legal notice are supported by verifiable evidence.',
    hindiWhyNeeded: 'यह दस्तावेज़ आपके मामले में प्रमुख तथ्यों को प्रमाणित करता है ताकि आपकी विधिक मांग मजबूत साक्ष्यों पर आधारित रहे।',
    statute: 'Indian Evidence & Statutory Procedure Standards',
    impactOnCase: 'Strengthens claim veracity and prevents pre-trial dismissals',
    recommendedFormats: 'Clear PDF or High-Resolution Image'
  };
};
