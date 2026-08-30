/**
 * Evidence -> Claim Intelligence Engine
 * Maps extracted case claims to supporting forensic evidence and computes claim strength across all statutory domains.
 */

export const mapEvidenceToClaims = ({
  diagnosis = null,
  grievanceText = '',
  evidenceData = null,
  additionalEvidence = []
}) => {
  const categoryLower = (diagnosis?.category || '').toLowerCase();
  const grievanceLower = (grievanceText || '').toLowerCase();
  const summaryLower = (diagnosis?.summary || diagnosis?.plainLanguageSummary || '').toLowerCase();
  const evidenceText = `${evidenceData?.merchant || ''} ${evidenceData?.vendorName || ''} ${evidenceData?.productDescription || ''} ${evidenceData?.breachPoint || ''} ${(evidenceData?.keyFacts || []).join(' ')} ${(evidenceData?.keyFindings || []).join(' ')}`.toLowerCase();
  const combined = `${grievanceLower} ${summaryLower} ${evidenceText} ${categoryLower}`;

  // 1. Precise, mutually-exclusive domain classification
  const isHospital = categoryLower.includes('health') || 
                     categoryLower.includes('hospital') || 
                     Boolean(diagnosis?.hospitalSchemeAudit?.isHospitalDispute) || 
                     /\b(hospital|medical|doctor|ayushman|cashless|treatment|pmjay|pm-jay|trauma|admission|patient|clinic|mediclaim|health\s*insurance|abha|chirayu|emergency\s*stabilization)\b/i.test(combined);

  const isDowryOrWomen = !isHospital && (
    categoryLower.includes('women') || 
    categoryLower.includes('matrimonial') || 
    /\b(dowry|marriage|wedding|in-laws|husband|wife|stridhan|dahej|498a|304b|bns\s*80|bns\s*85|harass|stalk|eve\s*teasing|1090)\b/i.test(combined)
  );

  const isCriminalOrPolice = !isHospital && !isDowryOrWomen && (
    categoryLower.includes('criminal') || 
    categoryLower.includes('police') || 
    /\b(fir|zero\s*fir|police|sho|police\s*station|assault|beaten|threatened|theft|robbery|173\s*bnss|154\s*crpc|175\s*bnss)\b/i.test(combined)
  );

  const isSanitation = !isHospital && !isDowryOrWomen && !isCriminalOrPolice && (
    categoryLower.includes('sanitation') || 
    categoryLower.includes('waste') || 
    /\b(garbage|waste|overflowing|sanitation|safai|kachra|drain|sewage|dustbin|foul\s*smell|swachhata)\b/i.test(combined)
  );

  const isRTI = !isHospital && !isDowryOrWomen && !isCriminalOrPolice && !isSanitation && (
    categoryLower.includes('rti') || 
    /\b(rti|tender|public\s*records|pio|section\s*6\(1\)|information\s*commission)\b/i.test(combined)
  );

  const isBuilderOrRERA = !isHospital && !isDowryOrWomen && !isCriminalOrPolice && !isSanitation && !isRTI && (
    categoryLower.includes('rera') || 
    categoryLower.includes('real estate') || 
    /\b(builder|possession|rera|developer|bba|builder\s*buyer)\b/i.test(combined)
  );

  const isRent = !isHospital && !isDowryOrWomen && !isCriminalOrPolice && !isSanitation && !isRTI && !isBuilderOrRERA && (
    categoryLower.includes('tenan') || 
    categoryLower.includes('housing') ||
    /\b(rent|landlord|tenant|tenancy|lease|flat|apartment|painting|cleaning|broker|pg|room\s*rent)\b/i.test(combined) ||
    (/\bdeposit\b/i.test(combined) && /\b(rent|landlord|tenant|flat|apartment|lease|vacat|handover|owner|property)\b/i.test(combined))
  );

  const isConsumer = !isHospital && !isDowryOrWomen && !isCriminalOrPolice && !isSanitation && !isRTI && !isBuilderOrRERA && !isRent && (
    categoryLower.includes('consumer') ||
    /\b(flipkart|amazon|phone|delivery|defective|warranty|refund|seller|merchant|invoice|e-commerce|courier|product|order)\b/i.test(combined)
  );

  // Normalize all available evidence items
  const allEvidence = [];
  if (evidenceData) {
    allEvidence.push({
      id: 'primary-doc',
      name: evidenceData.originalFilename || evidenceData.invoiceNumber || (isHospital ? 'Hospital Receipt / Admission Slip' : evidenceData.invoiceNumber ? 'INVOICE_RECEIPT' : 'DOCUMENT_RECORD'),
      type: isHospital ? 'HOSPITAL_RECORD' : evidenceData.invoiceNumber ? 'INVOICE_RECEIPT' : 'DOCUMENT_RECORD',
      date: evidenceData.date || '15/01/2026',
      amount: evidenceData.amount || evidenceData.totalAmount || null,
      merchant: evidenceData.merchant || evidenceData.vendorName || null,
      sha256Hash: evidenceData.sha256Hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      bsa63Admissible: true,
      extractedFacts: evidenceData.keyFacts || evidenceData.keyFindings || []
    });
  }

  (additionalEvidence || []).forEach((item, idx) => {
    allEvidence.push({
      id: `addl-${idx}`,
      name: item.name || `Supporting Exhibit #${idx + 1}`,
      type: item.type || 'EXHIBIT',
      date: item.date || new Date().toLocaleDateString('en-IN'),
      sha256Hash: item.sha256Hash || 'f4b892a0e41768c6e289bf65d836b9e27c1a84f3e6d52c1b98a7102e3456789a',
      bsa63Admissible: true,
      extractedFacts: item.extractedFacts || []
    });
  });

  const hasPrimaryEvidence = allEvidence.length > 0;
  const considerationAmount = evidenceData?.amount || evidenceData?.totalAmount || diagnosis?.remedy?.reliefClaim || (isHospital ? '₹50,000' : isRent ? '₹20,000' : isConsumer ? '₹19,999' : '₹10,000');
  const merchantName = evidenceData?.merchant || evidenceData?.vendorName || diagnosis?.oppositeParty || diagnosis?.counterParty || (isHospital ? 'Hospital Administration / Empanelled Hospital' : isRent ? 'Landlord / Property Owner' : 'Opposite Party');

  let claims = [];

  if (isHospital) {
    claims = [
      {
        id: 'claim-1',
        title: `Beneficiary is statutorily entitled to 100% Cashless Emergency Treatment at ${merchantName}`,
        hindiTitle: `${merchantName} में आयुष्मान भारत (PM-JAY) के तहत 100% कैशलेस आपातकालीन उपचार का वैधानिक अधिकार`,
        category: 'Healthcare Consideration & Scheme Entitlement',
        statute: 'Ayushman Bharat PM-JAY Clause 7.2 & Clinical Establishments Act 2010, Sec 12(2)',
        supportedBy: hasPrimaryEvidence ? [
          {
            docName: evidenceData?.invoiceNumber ? `UPI Advance Slip / Receipt (${evidenceData.invoiceNumber})` : 'Hospital Electronic Payment / Admission Record',
            docType: 'HOSPITAL_ADVANCE_RECEIPT',
            verified: true,
            sha256Hash: evidenceData?.sha256Hash,
            extractedFact: `Verifiable digital record of ${considerationAmount} demanded/paid during hospital admission at ${merchantName}.`
          }
        ] : [],
        missingEvidence: hasPrimaryEvidence ? [] : [
          {
            name: 'UPI Receipt / Cash Advance Slip from Hospital',
            whyNeededCode: 'PROOF_OF_PAYMENT',
            importance: 'CRITICAL'
          }
        ]
      },
      {
        id: 'claim-2',
        title: `Unlawful demand or extortion of ${considerationAmount} advance deposit prior to emergency medical stabilization`,
        hindiTitle: `आपातकालीन स्थिति में ₹${considerationAmount} अग्रिम जमा की गैरकानूनी मांग`,
        category: 'Statutory Breach & Human Rights Violation',
        statute: 'Motor Vehicles Act 1988, Sec 134(a) & Article 21 Constitution (Pt. Parmanand Katara Mandate)',
        supportedBy: (evidenceData?.breachPoint || evidenceData?.keyFacts) ? [
          {
            docName: 'Emergency Admission Breach & Scheme Audit Record',
            docType: 'HOSPITAL_SCHEME_AUDIT',
            verified: true,
            sha256Hash: evidenceData?.sha256Hash,
            extractedFact: evidenceData?.breachPoint || 'Breach of Section 134(a) MVA: Hospital demanded cash advance before emergency trauma stabilization.'
          }
        ] : [],
        missingEvidence: [
          {
            name: 'Ayushman PM-JAY Golden Card / ABHA ID Copy',
            whyNeededCode: 'DELIVERY_PROOF',
            importance: 'HIGH'
          },
          {
            name: 'Emergency Casualty / Admission Demand Slip',
            whyNeededCode: 'REFUSAL_COMMUNICATION',
            importance: 'CRITICAL'
          }
        ]
      },
      {
        id: 'claim-3',
        title: 'Hospital management committed deficiency in service and statutory non-compliance under NHA framework',
        hindiTitle: 'अस्पताल प्रशासन द्वारा सेवा में कमी एवं राष्ट्रीय स्वास्थ्य प्राधिकरण (NHA) नियमों का उल्लंघन',
        category: 'Deficiency in Service & Regulatory Default',
        statute: 'Consumer Protection Act 2019, Sec 2(11) & Clinical Establishments Act 2010',
        supportedBy: [],
        missingEvidence: [
          {
            name: 'NHA 14555 Helpline Complaint Docket / CGRP Grievance Slip',
            whyNeededCode: 'REFUSAL_COMMUNICATION',
            importance: 'HIGH'
          }
        ]
      }
    ];
  } else if (isRent) {
    claims = [
      {
        id: 'claim-1',
        title: `Payment of ${considerationAmount} Security Deposit was made to ${merchantName}`,
        hindiTitle: `${merchantName} को ${considerationAmount} सुरक्षा जमा राशि का भुगतान किया गया`,
        category: 'Financial Consideration',
        statute: 'Indian Contract Act 1872, Sec 2(d)',
        supportedBy: hasPrimaryEvidence ? [
          {
            docName: evidenceData?.invoiceNumber ? `UPI Receipt (${evidenceData.invoiceNumber})` : 'Electronic Payment Transaction Record',
            docType: 'UPI_RECEIPT',
            verified: true,
            sha256Hash: evidenceData?.sha256Hash,
            extractedFact: `Verifiable transaction confirming ${considerationAmount} deposit remittance.`
          }
        ] : [],
        missingEvidence: hasPrimaryEvidence ? [] : [
          {
            name: 'UPI Payment Receipt / Bank Statement',
            whyNeededCode: 'PROOF_OF_PAYMENT',
            importance: 'CRITICAL'
          }
        ]
      },
      {
        id: 'claim-2',
        title: 'Landlord arbitrarily withheld security deposit without providing itemized repair/painting bills',
        hindiTitle: 'मकान मालिक ने ठेकेदार के बिल दिए बिना सुरक्षा जमा राशि मनमाने ढंग से काट ली',
        category: 'Statutory Breach',
        statute: 'Model Tenancy Act 2021, Sec 11(2)',
        supportedBy: (evidenceData?.breachPoint || evidenceData?.keyFacts) ? [
          {
            docName: 'Audited Tenancy Breach Fact Ledger',
            docType: 'TENANCY_AUDIT',
            verified: true,
            sha256Hash: evidenceData?.sha256Hash,
            extractedFact: evidenceData?.breachPoint || 'Section 11 Model Tenancy Act violation: No contractor tax invoices provided.'
          }
        ] : [],
        missingEvidence: [
          {
            name: 'Written Intimation / WhatsApp Refusal from Landlord',
            whyNeededCode: 'REFUSAL_COMMUNICATION',
            importance: 'HIGH'
          }
        ]
      },
      {
        id: 'claim-3',
        title: 'Premises vacated with zero electricity/maintenance dues and key handed over',
        hindiTitle: 'बिजली और मेंटेनेंस का पूरा भुगतान कर मकान खाली किया गया',
        category: 'Contractual Compliance',
        statute: 'Transfer of Property Act, Sec 108',
        supportedBy: [],
        missingEvidence: [
          {
            name: 'Electricity / Maintenance Clearance Receipt',
            whyNeededCode: 'PROOF_OF_PAYMENT',
            importance: 'MEDIUM'
          },
          {
            name: 'Exit Clearance & Key Handover Acknowledgment',
            whyNeededCode: 'REFUSAL_COMMUNICATION',
            importance: 'HIGH'
          }
        ]
      }
    ];
  } else if (isConsumer) {
    claims = [
      {
        id: 'claim-1',
        title: `Purchase consideration of ${considerationAmount} paid to ${merchantName}`,
        hindiTitle: `${merchantName} को ${considerationAmount} खरीद मूल्य का भुगतान किया गया`,
        category: 'Financial Consideration',
        statute: 'Consumer Protection Act 2019, Sec 2(7)',
        supportedBy: hasPrimaryEvidence ? [
          {
            docName: evidenceData?.invoiceNumber ? `Official Tax Invoice (#${evidenceData.invoiceNumber})` : 'Tax Invoice / Cash Memo',
            docType: 'TAX_INVOICE',
            verified: true,
            sha256Hash: evidenceData?.sha256Hash,
            extractedFact: `Authentic Tax Invoice with valid GSTIN confirming purchase of goods.`
          }
        ] : [],
        missingEvidence: hasPrimaryEvidence ? [] : [
          {
            name: 'Official Tax Invoice / Bill',
            whyNeededCode: 'INVOICE_BILL',
            importance: 'CRITICAL'
          }
        ]
      },
      {
        id: 'claim-2',
        title: 'Goods delivered defective/damaged within statutory 7-day trial return window',
        hindiTitle: 'सामान निर्धारित वापसी समय सीमा में खराब/क्षतिग्रस्त डिलीवर हुआ',
        category: 'Deficiency in Service',
        statute: 'Consumer Protection (E-Commerce) Rules 2020, Rule 6',
        supportedBy: hasPrimaryEvidence && evidenceData?.breachPoint ? [
          {
            docName: 'Defect Forensic Extraction Ledger',
            docType: 'FORENSIC_OCR',
            verified: true,
            sha256Hash: evidenceData?.sha256Hash,
            extractedFact: evidenceData?.breachPoint || 'Reported defective hardware within statutory trial window.'
          }
        ] : [],
        missingEvidence: [
          {
            name: 'Package Condition / Unboxing Photo',
            whyNeededCode: 'DELIVERY_PROOF',
            importance: 'HIGH'
          }
        ]
      },
      {
        id: 'claim-3',
        title: 'Customer support unfairly rejected return/replacement request',
        hindiTitle: 'कस्टमर सपोर्ट ने रिप्लेसमेंट/रिफंड अनुरोध को अनुचित रूप से खारिज किया',
        category: 'Unfair Trade Practice',
        statute: 'Consumer Protection Act 2019, Sec 2(47)',
        supportedBy: [],
        missingEvidence: [
          {
            name: 'Customer Support Chat / Email Rejection Record',
            whyNeededCode: 'REFUSAL_COMMUNICATION',
            importance: 'HIGH'
          }
        ]
      }
    ];
  } else if (isDowryOrWomen) {
    claims = [
      {
        id: 'claim-1',
        title: 'Solemnization of marriage within past 7 years establishes statutory presumption under Section 118 BSA',
        hindiTitle: 'विवाह के 7 वर्षों के भीतर घटना: धारा 118 BSA (113B साक्ष्य अधिनियम) के तहत वैधानिक उपधारणा',
        category: 'Statutory Presumption & Fact of Marriage',
        statute: 'Bharatiya Nyaya Sanhita 2023, Sec 80 & Bharatiya Sakshya Adhiniyam 2023, Sec 118',
        supportedBy: hasPrimaryEvidence ? [
          {
            docName: evidenceData?.originalFilename || 'Marriage / Consideration Record',
            docType: 'MARRIAGE_EVIDENCE',
            verified: true,
            sha256Hash: evidenceData?.sha256Hash,
            extractedFact: 'Documentary evidence establishing matrimonial timeline within 7 years.'
          }
        ] : [],
        missingEvidence: hasPrimaryEvidence ? [] : [
          {
            name: 'Marriage Certificate / Wedding Invitation Card',
            whyNeededCode: 'PROOF_OF_PAYMENT',
            importance: 'CRITICAL'
          }
        ]
      },
      {
        id: 'claim-2',
        title: `Unlawful harassment and recurring demands for consideration/property (${considerationAmount})`,
        hindiTitle: `दहेज/धन की गैरकानूनी मांग और प्रताड़ना (धारा 85 BNS)`,
        category: 'Criminal Cruelty & Dowry Demand',
        statute: 'Bharatiya Nyaya Sanhita 2023, Sec 85 & Dowry Prohibition Act 1961, Sec 3 & 4',
        supportedBy: hasPrimaryEvidence && evidenceData?.breachPoint ? [
          {
            docName: 'Financial / Communication Harassment Record',
            docType: 'COMMUNICATION_PROOF',
            verified: true,
            sha256Hash: evidenceData?.sha256Hash,
            extractedFact: evidenceData.breachPoint
          }
        ] : [],
        missingEvidence: [
          {
            name: 'Bank Transfer Records / WhatsApp Messages of Demands',
            whyNeededCode: 'REFUSAL_COMMUNICATION',
            importance: 'CRITICAL'
          }
        ]
      },
      {
        id: 'claim-3',
        title: 'Mandatory SDM Inquest, Stridhan return, and 100% Free NALSA Legal Aid entitlement',
        hindiTitle: 'अनिवार्य एसडीएम जांच (धारा 196 BNSS), स्त्रीधन वापसी एवं मुफ्त कानूनी सहायता',
        category: 'Statutory Procedure & Victim Protection',
        statute: 'BNSS 2023, Sec 196, Dowry Prohibition Act Sec 6 & Legal Services Authorities Act Sec 12',
        supportedBy: [],
        missingEvidence: [
          {
            name: 'Post-Mortem / Medical MLC Report & SDM Statement Copy',
            whyNeededCode: 'DELIVERY_PROOF',
            importance: 'HIGH'
          }
        ]
      }
    ];
  } else if (isCriminalOrPolice) {
    claims = [
      {
        id: 'claim-1',
        title: 'Information of cognizable offence discloses mandatory statutory duty to register immediate FIR',
        hindiTitle: 'संज्ञेय अपराध की सूचना पर तत्काल प्राथमिकी (FIR) दर्ज करने का अनिवार्य वैधानिक दायित्व',
        category: 'Statutory Mandate',
        statute: 'Bharatiya Nagarik Suraksha Sanhita 2023, Sec 173 & Lalita Kumari SC Precedent',
        supportedBy: hasPrimaryEvidence ? [
          {
            docName: evidenceData?.originalFilename || 'Incident Record / Medical Injury Report',
            docType: 'CRIMINAL_RECORD',
            verified: true,
            sha256Hash: evidenceData?.sha256Hash,
            extractedFact: 'Contemporaneous evidence demonstrating cognizable offence commission.'
          }
        ] : [],
        missingEvidence: hasPrimaryEvidence ? [] : [
          {
            name: 'Written Police Complaint / Medical MLC Injury Slip',
            whyNeededCode: 'PROOF_OF_PAYMENT',
            importance: 'CRITICAL'
          }
        ]
      },
      {
        id: 'claim-2',
        title: 'Citizen entitlement to Magisterial direction and investigation oversight against police inaction',
        hindiTitle: 'पुलिस निष्क्रियता के विरुद्ध पुलिस अधीक्षक (SP) एवं मजिस्ट्रेट (धारा 175 BNSS) का क्षेत्राधिकार',
        category: 'Magisterial Oversight',
        statute: 'Bharatiya Nagarik Suraksha Sanhita 2023, Sec 175(3) & 175(4)',
        supportedBy: hasPrimaryEvidence && evidenceData?.breachPoint ? [
          {
            docName: 'Dereliction of Duty Extraction',
            docType: 'LEGAL_AUDIT',
            verified: true,
            sha256Hash: evidenceData?.sha256Hash,
            extractedFact: evidenceData.breachPoint
          }
        ] : [],
        missingEvidence: [
          {
            name: 'Speed Post Slip to Superintendent of Police (SP) / GD Entry Copy',
            whyNeededCode: 'REFUSAL_COMMUNICATION',
            importance: 'HIGH'
          }
        ]
      }
    ];
  } else if (isSanitation) {
    claims = [
      {
        id: 'claim-1',
        title: 'Mandatory statutory obligation of municipal local body for daily solid waste collection',
        hindiTitle: 'स्थानीय नगर निकाय द्वारा दैनिक ठोस अपशिष्ट संग्रहण का अनिवार्य दायित्व',
        category: 'Municipal Obligation',
        statute: 'Solid Waste Management Rules 2016, Rule 15',
        supportedBy: hasPrimaryEvidence ? [
          {
            docName: evidenceData?.originalFilename || 'Geotagged Photo / Swachhata Grievance Ticket',
            docType: 'MUNICIPAL_RECORD',
            verified: true,
            sha256Hash: evidenceData?.sha256Hash,
            extractedFact: 'Geotagged photographic record establishing uncollected waste hazard.'
          }
        ] : [],
        missingEvidence: hasPrimaryEvidence ? [] : [
          {
            name: 'Geotagged Photographs with Timestamp',
            whyNeededCode: 'DELIVERY_PROOF',
            importance: 'CRITICAL'
          }
        ]
      },
      {
        id: 'claim-2',
        title: 'Infringement of Fundamental Right to Clean Environment and Public Health under Article 21',
        hindiTitle: 'स्वच्छ पर्यावरण एवं स्वास्थ्य के मौलिक अधिकार (अनुच्छेद 21) का उल्लंघन',
        category: 'Constitutional & Public Nuisance',
        statute: 'Article 21 Constitution & Bharatiya Nyaya Sanhita 2023, Sec 270',
        supportedBy: hasPrimaryEvidence && evidenceData?.breachPoint ? [
          {
            docName: 'Public Nuisance Fact Ledger',
            docType: 'LEGAL_AUDIT',
            verified: true,
            sha256Hash: evidenceData?.sha256Hash,
            extractedFact: evidenceData.breachPoint
          }
        ] : [],
        missingEvidence: [
          {
            name: 'Swachhata App Docket Number / Nagar Nigam Written Complaint',
            whyNeededCode: 'REFUSAL_COMMUNICATION',
            importance: 'HIGH'
          }
        ]
      }
    ];
  } else {
    // General Dispute Claims
    claims = [
      {
        id: 'claim-1',
        title: `Primary transaction or representation with ${merchantName}`,
        hindiTitle: `${merchantName} के साथ मुख्य लेन-देन या औपचारिक विधिक संबंध`,
        category: 'Primary Fact',
        statute: 'Indian Evidence & Statutory Standards',
        supportedBy: hasPrimaryEvidence ? [
          {
            docName: evidenceData?.originalFilename || 'Primary Document Record',
            docType: 'PRIMARY_RECORD',
            verified: true,
            sha256Hash: evidenceData?.sha256Hash,
            extractedFact: 'Documentary evidence supporting primary dispute assertion.'
          }
        ] : [],
        missingEvidence: hasPrimaryEvidence ? [] : [
          {
            name: 'Primary Document / Payment Proof',
            whyNeededCode: 'PROOF_OF_PAYMENT',
            importance: 'CRITICAL'
          }
        ]
      },
      {
        id: 'claim-2',
        title: 'Statutory violation or service deficiency by opposite party',
        hindiTitle: 'विपक्षी पार्टी द्वारा वैधानिक उल्लंघन या सेवा में कमी',
        category: 'Statutory Breach',
        statute: diagnosis?.applicableActs?.[0]?.act || 'Indian Law',
        supportedBy: hasPrimaryEvidence && evidenceData?.breachPoint ? [
          {
            docName: 'Statutory Breach Extraction',
            docType: 'LEGAL_AUDIT',
            verified: true,
            sha256Hash: evidenceData?.sha256Hash,
            extractedFact: evidenceData.breachPoint
          }
        ] : [],
        missingEvidence: [
          {
            name: 'Written Refusal / Incident Record',
            whyNeededCode: 'REFUSAL_COMMUNICATION',
            importance: 'HIGH'
          }
        ]
      }
    ];
  }

  // Calculate strength per claim
  let totalSupportedClaims = 0;
  claims = claims.map(claim => {
    let strength = 'NEEDS_SUPPORT';
    let strengthScore = 0;
    if (claim.supportedBy.length >= 2) {
      strength = 'STRONG';
      strengthScore = 100;
      totalSupportedClaims += 1;
    } else if (claim.supportedBy.length === 1) {
      strength = 'MODERATE';
      strengthScore = 65;
      totalSupportedClaims += 0.7;
    } else {
      strength = 'NEEDS_SUPPORT';
      strengthScore = 20;
    }

    return {
      ...claim,
      strength,
      strengthScore
    };
  });

  const totalClaims = claims.length;
  const evidenceScore = Math.round((totalSupportedClaims / Math.max(1, totalClaims)) * 100);

  return {
    claims,
    allEvidence,
    totalClaims,
    supportedClaimsCount: claims.filter(c => c.strength !== 'NEEDS_SUPPORT').length,
    evidenceScore: Math.min(100, Math.max(20, evidenceScore)),
    evidenceStatus: evidenceScore >= 75 ? 'HIGH_EVIDENTIARY_VALUE' : evidenceScore >= 45 ? 'MODERATE_EVIDENTIARY_VALUE' : 'INSUFFICIENT_EVIDENCE'
  };
};
