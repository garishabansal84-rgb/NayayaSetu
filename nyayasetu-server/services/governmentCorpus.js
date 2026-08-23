import { ingestGovernmentDocument } from './ingestionService.js';
import { SourceRepository } from '../models/Source.js';

export const OFFICIAL_GOVERNMENT_DOCUMENTS = [
  {
    sourceName: "National Health Authority (Ministry of Health & Family Welfare)",
    rootUrl: "https://beneficiary.nha.gov.in",
    authorityType: "CENTRAL_MINISTRY",
    state: "ALL",
    schemeCode: "PM_JAY",
    schemeName: "Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PM-JAY)",
    hindiName: "आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना",
    documentType: "PORTAL_GUIDELINE",
    metadata: {
      category: "HEALTH",
      state: "ALL",
      maxAnnualIncome: 250000,
      financialAmount: 500000,
      targetOccupations: ["Laborer", "Farmer", "Unemployed", "Informal Worker", "All"],
      sourceUrl: "https://beneficiary.nha.gov.in/guidelines_pmjay.pdf",
      officialAuthority: "National Health Authority, Govt of India",
      requiredDocuments: ["Aadhaar Card", "Ration Card (NFSA / BPL)", "Income Certificate (< 2.5L)"]
    },
    rawText: `
    Pradhan Mantri Jan Arogya Yojana (PM-JAY) Official Guidelines.
    PM-JAY is the world's largest government-funded healthcare assurance scheme. It provides a cashless health cover of ₹5,00,000 per family per year for secondary and tertiary care hospitalization across all empaneled public and private healthcare providers in India.
    Eligibility Criteria:
    1. Households categorized under SECC 2011 occupational criteria in rural and urban areas (such as landless agricultural laborers, street vendors, ragpickers, construction workers, and families with no earning adult member aged 16-59).
    2. Families holding NFSA Antyodaya Anna Yojana (AAY) or Below Poverty Line (BPL) ration cards.
    3. Annual family income generally under ₹2,50,000 per annum.
    Benefits & Scope:
    - Pre-hospitalization coverage up to 3 days (diagnostic tests, physician consultation).
    - Post-hospitalization coverage up to 15 days (medicines, follow-up care).
    - Covers approximately 1,949 medical and surgical packages including oncology, cardiology, neurosurgery, and joint replacements.
    - Completely cashless and paperless at all Ayushman Empaneled Hospitals (Arogya Mitra desks).
    Required Documentation:
    - Aadhaar Card with biometric verification.
    - Verified NFSA Ration Card or SECC Family ID Letter.
    - Income Certificate issued by competent Tehsildar / Sub-Divisional Magistrate.
    Application Process:
    Citizens can verify their eligibility on beneficiary.nha.gov.in or visit the nearest Common Service Centre (CSC) or District Hospital Ayushman Kiosk to generate their Ayushman Card (Golden Card).
    `
  },
  {
    sourceName: "Social Welfare Department, Government of Uttar Pradesh",
    rootUrl: "https://scholarship.up.gov.in",
    authorityType: "STATE_DEPARTMENT",
    state: "Uttar Pradesh",
    schemeCode: "UP_POST_MATRIC",
    schemeName: "UP Post-Matric Scholarship and Fee Reimbursement Scheme",
    hindiName: "उत्तर प्रदेश दशमोत्तर छात्रवृत्ति एवं शुल्क प्रतिपूर्ति योजना",
    documentType: "OFFICIAL_GAZETTE",
    metadata: {
      category: "EDUCATION",
      state: "Uttar Pradesh",
      maxAnnualIncome: 200000,
      financialAmount: 65000,
      targetOccupations: ["Student"],
      sourceUrl: "https://scholarship.up.gov.in/rules_2026.pdf",
      officialAuthority: "Social Welfare Department, Government of Uttar Pradesh",
      requiredDocuments: ["Aadhaar Card", "UP Domicile (Niwas)", "Caste Certificate", "Income Certificate (< 2L)", "College Fee Receipt"]
    },
    rawText: `
    Uttar Pradesh Post-Matric Scholarship & Tuition Fee Reimbursement Scheme Official Notification.
    The Government of Uttar Pradesh provides 100% tuition fee reimbursement and monthly maintenance allowances to students of UP domiciled pursuing post-matriculation, graduation, post-graduation, and professional degree courses (such as B.Tech, MBBS, MBA, Polytechnic, and Diploma).
    Eligibility Conditions:
    1. The student must be a permanent bonafide resident (domicile) of Uttar Pradesh.
    2. For General, OBC, and Minority candidates: Annual family income must not exceed ₹2,00,000.
    3. For SC/ST candidates: Annual family income must not exceed ₹2,50,000.
    4. Must be enrolled in a recognized university or institute approved by UGC / AICTE / State Technical Board (such as IIITA, AKTU, or state universities).
    Financial Entitlements:
    - 100% waiver/refund of non-refundable course tuition fee (credited directly via Aadhaar-seeded DBT).
    - Maintenance allowance of ₹3,000 to ₹12,000 per annum depending on course tier.
    Mandatory Documentation:
    - Aadhaar card mapped to active bank account via NPCI Aadhaar Seeding.
    - Verified UP Domicile Certificate (Niwas Praman Patra) issued on UP e-District portal.
    - Valid Income Certificate from local Tehsildar (validity 3 years).
    - Caste certificate (Jati Praman Patra) for OBC/SC/ST/EWS reservation.
    - Institute non-refundable fee structure breakdown and original payment receipt.
    Filing Procedure:
    Applications must be submitted online on scholarship.up.gov.in within the prescribed session timeline and physically verified by the College Verification Officer.
    `
  },
  {
    sourceName: "Department of Agriculture and Farmers Welfare, Govt of India",
    rootUrl: "https://pmkisan.gov.in",
    authorityType: "CENTRAL_MINISTRY",
    state: "ALL",
    schemeCode: "PM_KISAN",
    schemeName: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    hindiName: "प्रधानमंत्री किसान सम्मान निधि",
    documentType: "PORTAL_GUIDELINE",
    metadata: {
      category: "AGRICULTURE",
      state: "ALL",
      maxAnnualIncome: 500000,
      financialAmount: 6000,
      targetOccupations: ["Farmer", "Agriculture"],
      sourceUrl: "https://pmkisan.gov.in/guidelines.aspx",
      officialAuthority: "Ministry of Agriculture & Farmers Welfare",
      requiredDocuments: ["Aadhaar Card", "Land Khatauni (Bhulekh)", "Bank Passbook with e-KYC"]
    },
    rawText: `
    Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) Scheme Operational Guidelines.
    PM-KISAN is a Central Sector scheme with 100% funding from the Government of India. Under the scheme, direct income support of ₹6,000 per year is transferred in three equal installments of ₹2,000 every 4 months directly into the bank accounts of all landholding farmer families across the country.
    Eligibility Criteria:
    1. All landholding farmer families having cultivable land in their names as per state land records (Bhulekh / Khatauni).
    2. Small and marginal farmers as well as medium landholders.
    Exclusions:
    - Institutional landholders, constitutional post holders, serving/retired government officers, doctors, engineers, lawyers, and income tax payees in the previous assessment year.
    Mandatory Requirements for Fund Transfer:
    - Mandatory Aadhaar authentication on the PM-KISAN portal.
    - Land record digitization and seeding with Aadhaar on state Bhulekh portal.
    - Active Bank Account linked to NPCI Aadhaar Bridge Payment System (ABPS).
    - Completion of facial/biometric e-KYC on the PM-KISAN mobile app or portal.
    How to Register:
    Farmers can self-register on pmkisan.gov.in under 'Farmers Corner' or visit the nearest Jan Seva Kendra / Agriculture Department office.
    `
  },
  {
    sourceName: "Department of Consumer Affairs, Government of India",
    rootUrl: "https://e-jagriti.gov.in",
    authorityType: "STATUTORY_BODY",
    state: "ALL",
    schemeCode: "CONSUMER_PROTECTION_ACT_2019",
    schemeName: "Consumer Protection Act 2019 — Redressal Guidelines",
    hindiName: "उपभोक्ता संरक्षण अधिनियम 2019",
    documentType: "STATUTE_SECTION",
    metadata: {
      category: "CONSUMER",
      state: "ALL",
      sourceUrl: "https://consumeraffairs.nic.in/acts-and-rules/consumer-protection-act-2019",
      officialAuthority: "National Consumer Disputes Redressal Commission (NCDRC)",
      requiredDocuments: ["Purchase Invoice / Bill", "Proof of Payment", "Communication / Rejection Record", "Legal Notice Copy"]
    },
    rawText: `
    Consumer Protection Act, 2019 Statutory Provisions & Rights Guide.
    The Consumer Protection Act, 2019 (Act No. 35 of 2019) replaces the 1986 Act, introducing robust consumer protections against deficiency in service, defective products, and unfair trade practices (including e-commerce platforms).
    Key Statutory Protections:
    1. Section 2(7): Defines a consumer as anyone who buys goods or hires services offline or online for valuable consideration.
    2. Section 2(11): Deficiency of service includes any fault, imperfection, or inadequacy in quality, nature, and manner of performance required by contract or statutory standards.
    3. Section 2(47): Unfair Trade Practices specifically prohibit refusing to refund or replace defective goods within the warranty/return window or failing to issue formal tax invoices.
    4. Section 35: Filing Complaint before the District Consumer Disputes Redressal Commission (DCDRC). Complaints can be filed in the district where the consumer resides, works, or where the transaction occurred.
    Pecuniary Jurisdiction:
    - District Commission: Claims up to ₹50 Lakhs.
    - State Commission: Claims from ₹50 Lakhs to ₹2 Crores.
    - National Commission: Claims exceeding ₹2 Crores.
    Redressal Pathway:
    Step 1: Issue formal 15-day statutory legal notice to opposite party.
    Step 2: Lodge complaint with National Consumer Helpline (1915 / consumerhelpline.gov.in).
    Step 3: File digital petition on e-Jagriti (e-jagriti.gov.in / formerly e-Daakhil) or physical complaint before District Commission.
    `
  },
  {
    sourceName: "Central Information Commission / DoPT, Government of India",
    rootUrl: "https://rtionline.gov.in",
    authorityType: "STATUTORY_BODY",
    state: "ALL",
    schemeCode: "RTI_ACT_2005",
    schemeName: "Right to Information Act, 2005 — Statutory Filing Guide",
    hindiName: "सूचना का अधिकार अधिनियम 2005",
    documentType: "STATUTE_SECTION",
    metadata: {
      category: "RTI",
      state: "ALL",
      sourceUrl: "https://rti.gov.in/RTI_Act_2005.pdf",
      officialAuthority: "Central Information Commission / State Information Commissions",
      requiredDocuments: ["Identity Proof", "Application Fee Receipt (₹10)", "RTI Application Copy"]
    },
    rawText: `
    Right to Information Act, 2005 (Act No. 22 of 2005) Statutory Manual.
    An Act to empower citizens, promote transparency and accountability in the working of every Public Authority, and contain corruption in government administration.
    Key Statutory Sections:
    1. Section 6(1): Right of any Indian citizen to request information in writing or through electronic means in English or Hindi or the official language of the area to the designated Central/State Public Information Officer (CPIO/SPIO).
    2. Section 7(1): Statutory Time Limit for Disposal: The PIO must provide the requested information within 30 days of receiving the application. If the information sought concerns the life or liberty of a person, it must be provided within 48 hours.
    3. Section 19(1): First Appeal: If no response is received within 30 days, or if the citizen is aggrieved by the PIO's decision, an appeal can be filed within 30 days to the designated First Appellate Authority (FAA).
    4. Section 19(3): Second Appeal before the Central or State Information Commission within 90 days of FAA disposal.
    5. Section 20(1): Imposition of Penalty: A penalty of ₹250 per day (up to a maximum of ₹25,000) shall be imposed on the errant PIO for refusing to receive an application, delaying without reasonable cause, or malafidely denying information.
    Application Fee:
    Standard fee of ₹10 per application (payable online or via Postal Order/Court Fee Stamp). Below Poverty Line (BPL) cardholders are 100% exempt from all fees.
    `
  },
  {
    sourceName: "Ministry of Road Transport and Highways (MoRTH), Govt of India",
    rootUrl: "https://morth.nic.in",
    authorityType: "CENTRAL_MINISTRY",
    state: "ALL",
    schemeCode: "MVA_ACCIDENT_EMERGENCY_134",
    schemeName: "Motor Vehicles Act 1988 (Sec 134) & Emergency Trauma Treatment Mandate",
    hindiName: "मोटर वाहन अधिनियम (धारा 134) - आपातकालीन दुर्घटना उपचार अधिकार",
    documentType: "STATUTE_SECTION",
    metadata: {
      category: "HEALTHCARE_TRAUMA",
      state: "ALL",
      sourceUrl: "https://morth.nic.in/motor-vehicles-amendment-act-2019",
      officialAuthority: "Ministry of Road Transport & Highways / State Health Directorates",
      requiredDocuments: ["Emergency Admission Note / MLC Record", "Hospital Cash Receipt / Demand Slip", "Identity Card"]
    },
    rawText: `
    Motor Vehicles Act, 1988 (as amended by Motor Vehicles Amendment Act, 2019).
    Section 134 & 134A: Statutory Duty of Doctors and Hospitals to Provide Immediate Emergency Medical Treatment to Road Accident Victims.
    Key Legal Provisions:
    1. Section 134(a): Absolute statutory duty of every registered medical practitioner or hospital on duty to immediately attend to injured road accident victims and render emergency life-saving medical aid without waiting for police reports, FIR registration, or demanding upfront cash deposits.
    2. Section 134A (Good Samaritan Protection): Any bystander or Good Samaritan who transports an injured victim to a hospital is protected from civil or criminal liability and cannot be forced to pay money, disclose personal details, or become a witness against their will.
    3. Landmark Supreme Court Ruling in Pt. Parmanand Katara vs Union of India (1989 SCR (3) 997): Preservation of human life is paramount; every doctor and hospital (government or private) has an overriding professional, constitutional, and statutory obligation to extend medical assistance immediately.
    4. Section 161 & 166: Motor Accidents Claims Tribunal (MACT) compensation for road accident injuries and cashless treatment scheme for golden hour emergency care.
    Redressal & Penalties:
    - Demanding advance deposit or denying trauma stabilization attracts immediate disciplinary cancellation of medical council registration, fine under Clinical Establishments Act Section 41, and prosecution under Section 2(11) Consumer Protection Act 2019 for gross deficiency of service.
    `
  },
  {
    sourceName: "Ministry of Health & Family Welfare, Government of India",
    rootUrl: "https://clinicalestablishments.gov.in",
    authorityType: "CENTRAL_MINISTRY",
    state: "ALL",
    schemeCode: "CLINICAL_ESTABLISHMENTS_ACT_2010",
    schemeName: "Clinical Establishments (Registration and Regulation) Act, 2010 — Emergency Medical Stabilization",
    hindiName: "नैदानिक स्थापना अधिनियम 2010 (आपातकालीन उपचार)",
    documentType: "STATUTE_SECTION",
    metadata: {
      category: "HEALTHCARE_CLINICAL",
      state: "ALL",
      sourceUrl: "https://clinicalestablishments.gov.in/En/Act_Rules.aspx",
      officialAuthority: "National Council for Clinical Establishments / State Health Authorities",
      requiredDocuments: ["Hospital Admission Slip", "Demand Note / Receipt", "Patient Identity Proof"]
    },
    rawText: `
    Clinical Establishments (Registration and Regulation) Act, 2010 (Act No. 23 of 2010).
    Statutory Framework for Patient Rights and Emergency Medical Stabilization.
    Key Statutory Provisions:
    1. Section 12(2): Every clinical establishment (including private nursing homes, multi-specialty hospitals, and trust hospitals) shall provide such medical examination and treatment as may be required to stabilize the emergency medical condition of any individual who comes or is brought to such clinical establishment.
    2. Zero Advance Payment Demand: Hospitals are legally prohibited from withholding emergency life-saving treatment, ICU admission, or trauma stabilization due to the patient's inability to pay an upfront cash advance.
    3. Section 41 & 42 Penalties: Any clinical establishment that violates emergency stabilization mandates or overcharges patients shall be punished with a fine of up to ₹5,00,000 and faces cancellation of hospital registration.
    4. Integration with Ayushman Bharat PM-JAY: Under NHA Empanelment Guidelines Clause 7.2, empanelled private hospitals must provide 100% cashless hospitalization. Demanding cash advance results in immediate de-empanelment and recovery of 5 times the demanded amount.
    Redressal Pathway:
    Step 1: Contact 24x7 NHA Helpline 14555 or National Emergency 112.
    Step 2: Lodge complaint with District Medical Officer (CMO) and State Health Agency (SHA).
    Step 3: File emergency petition before District Consumer Forum under Section 35 Consumer Protection Act.
    `
  },
  {
    sourceName: "Ministry of Housing and Urban Affairs / State RERA Authorities",
    rootUrl: "https://up-rera.in",
    authorityType: "STATUTORY_BODY",
    state: "ALL",
    schemeCode: "RERA_ACT_2016",
    schemeName: "Real Estate (Regulation and Development) Act, 2016 (RERA) — Homebuyer Rights",
    hindiName: "रियल एस्टेट (विनियमन और विकास) अधिनियम 2016 (रेरा)",
    documentType: "STATUTE_SECTION",
    metadata: {
      category: "HOUSING_PROPERTY",
      state: "ALL",
      sourceUrl: "https://mohua.gov.in/upload/uploadfiles/files/Real_Estate_Act_2016.pdf",
      officialAuthority: "State Real Estate Regulatory Authority (RERA)",
      requiredDocuments: ["Builder-Buyer Agreement (BBA)", "Allotment Letter", "Payment Receipts / Bank Statements", "Demand Letters"]
    },
    rawText: `
    Real Estate (Regulation and Development) Act, 2016 (Act No. 16 of 2016).
    Statutory Framework Protecting Homebuyers against Builder Delay and Unfair Clauses.
    Key Statutory Provisions:
    1. Section 18: If a promoter fails to complete or is unable to give possession of the apartment/plot in accordance with the terms of the agreement for sale by the specified date:
       - The allottee has the right to withdraw from the project and demand full refund of all amounts paid along with interest at the State Bank of India MCLR + 2%.
       - If the allottee does not withdraw, the promoter must pay monthly interest for every month of delay until the handing over of possession.
    2. Section 14(3): Structural Defect Guarantee: Any structural defect or defect in workmanship brought to the notice of the promoter within 5 years from date of possession must be rectified by the promoter without further charge within 30 days.
    3. Section 31: Any aggrieved homebuyer can file a complaint with the RERA Authority or Adjudicating Officer against any registered or unregistered promoter.
    4. Section 59 & 63: Imposition of severe financial penalties (up to 10% of total project cost) and imprisonment for non-compliance with RERA orders.
    `
  },
  {
    sourceName: "Ministry of Power / State Electricity Regulatory Commissions (SERC)",
    rootUrl: "https://powermin.gov.in",
    authorityType: "CENTRAL_MINISTRY",
    state: "ALL",
    schemeCode: "ELECTRICITY_ACT_2003",
    schemeName: "Electricity Act 2003 & Electricity (Rights of Consumers) Rules — Disconnection & Billing Protections",
    hindiName: "विद्युत अधिनियम 2003 एवं उपभोक्ता अधिकार नियम",
    documentType: "STATUTE_SECTION",
    metadata: {
      category: "UTILITIES_CIVIC",
      state: "ALL",
      sourceUrl: "https://powermin.gov.in/en/content/electricity-act-2003",
      officialAuthority: "Consumer Grievance Redressal Forum (CGRF) / Electricity Ombudsman",
      requiredDocuments: ["Electricity Bill / Meter Reading Record", "Payment Slips", "Disconnection Notice", "Complaint Receipt"]
    },
    rawText: `
    Electricity Act, 2003 (Act No. 36 of 2003) & Electricity (Rights of Consumers) Rules.
    Statutory Protections for Power Consumers against Arbitrary Surge Billing and Sudden Disconnections.
    Key Statutory Provisions:
    1. Section 56(1): Mandatory 15-Day Prior Written Notice: Power distribution companies (DISCOMs) are strictly prohibited from disconnecting power supply without issuing a minimum 15 clear days' prior notice in writing stating the specific grounds.
    2. Section 56(2): Limitation Bar: No sum due from any consumer shall be recoverable after a period of 2 years from the date when such sum became first due unless shown continuously as recoverable arrears.
    3. Section 126 & Meter Testing Right: Consumers facing sudden surge billing have the statutory right to demand lab testing of electronic meters within 15 days; bill adjustments must follow standard calibration reports.
    4. Section 42(5): Every DISCOM must maintain an independent Consumer Grievance Redressal Forum (CGRF), and decisions can be appealed before the State Electricity Ombudsman.
    `
  },
  {
    sourceName: "Ministry of Law & Justice / Ministry of Home Affairs",
    rootUrl: "https://www.mha.gov.in",
    authorityType: "CENTRAL_MINISTRY",
    state: "ALL",
    schemeCode: "BNS_DOWRY_DEATH_CRUELTY",
    schemeName: "Bharatiya Nyaya Sanhita (BNS) & Dowry Prohibition Act — Dowry Death & Cruelty Statutes",
    hindiName: "भारतीय न्याय संहिता (धारा 80 एवं 85) - दहेज मृत्यु एवं क्रूरता निवारण कानून",
    documentType: "STATUTE_SECTION",
    metadata: {
      category: "WOMEN_RIGHTS_CRIMINAL",
      state: "ALL",
      sourceUrl: "https://mha.gov.in/sites/default/files/BNS_2023.pdf",
      officialAuthority: "Court of Session / Judicial Magistrate / National Commission for Women (NCW)",
      requiredDocuments: ["Marriage Certificate / Wedding Card", "Post-Mortem & Inquest Report", "Communication / WhatsApp / Audio Proof of Dowry Demands", "Bank / Cash Transfer Records", "Complaint to Police Station / SP"]
    },
    rawText: `
    Bharatiya Nyaya Sanhita, 2023 (BNS) & Dowry Prohibition Act, 1961.
    Statutory Framework Protecting Women and Families against Dowry Demands, Cruelty, and Dowry Death.
    Key Statutory Provisions:
    1. Section 80 BNS (Corresponding to Section 304B IPC) - Dowry Death:
       - Where the death of a woman is caused by burns or bodily injury or occurs otherwise than under normal circumstances within seven years of her marriage, and it is shown that soon before her death she was subjected to cruelty or harassment by her husband or in-laws for or in connection with any demand for dowry, such death shall be deemed a 'Dowry Death'.
       - Punishment: Mandatory minimum 7 years imprisonment extending up to Life Imprisonment. Non-bailable and cognizable offence.
    2. Section 118 Bharatiya Sakshya Adhiniyam, 2023 (BSA / Section 113B Evidence Act) - Mandatory Statutory Presumption:
       - When the prosecution shows that a woman died within 7 years of marriage and was subjected to cruelty for dowry soon before death, the Court SHALL presume that the husband and in-laws caused the dowry death. The burden of proof shifts entirely onto the accused.
    3. Section 85 & 86 BNS (Corresponding to Section 498A IPC) - Cruelty by Husband or Relatives:
       - Subjecting a woman to physical or mental cruelty, driving her to suicide, or harassing her with unlawful demands for property or valuable security is punishable with up to 3 years imprisonment and fine.
    4. Dowry Prohibition Act, 1961:
       - Section 3 & 4: Demanding or taking dowry (cash, car, property, gold) attracts minimum 5 years imprisonment.
       - Section 6 (Stridhan): Any dowry/presents received must be transferred to the woman within 3 months; failure attracts imprisonment and properties belong exclusively to the woman or her legal heirs.
    5. Section 196 BNSS (Section 176 CrPC) - Mandatory SDM Inquest:
       - Death of a woman within 7 years of marriage MUST be investigated by an Executive Magistrate / Sub-Divisional Magistrate (SDM), who must personally record statements of the parents and conduct the inquest.
    6. Section 12 Legal Services Authorities Act, 1987 (NALSA 14468):
       - All women and victims of dowry cruelty are entitled to 100% free legal representation by government advocates at zero cost.
    `
  },
  {
    sourceName: "Ministry of Home Affairs / Bureau of Police Research & Development",
    rootUrl: "https://www.mha.gov.in",
    authorityType: "CENTRAL_MINISTRY",
    state: "ALL",
    schemeCode: "BNSS_MANDATORY_FIR",
    schemeName: "Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023 — Mandatory FIR Registration & Zero FIR",
    hindiName: "भारतीय नागरिक सुरक्षा संहिता (धारा 173) - अनिवार्य एफआईआर एवं जीरो एफआईआर अधिकार",
    documentType: "STATUTE_SECTION",
    metadata: {
      category: "CRIMINAL_JUSTICE",
      state: "ALL",
      sourceUrl: "https://mha.gov.in/sites/default/files/BNSS_2023.pdf",
      officialAuthority: "Station House Officer (SHO) / Superintendent of Police / Judicial Magistrate First Class",
      requiredDocuments: ["Written Complaint Signed by Informant", "Identity Proof", "Evidence / Audio / Photos / Medical Injury Slip"]
    },
    rawText: `
    Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS) & Landmark Precedent Lalita Kumari v. Govt of UP.
    Statutory Framework Enforcing Citizen Rights to Mandatory Police FIR Registration.
    Key Statutory Provisions:
    1. Section 173 BNSS (Corresponding to Section 154 CrPC) - Mandatory Registration of FIR:
       - Every information disclosing the commission of a cognizable offence MUST be registered as an FIR by the Station House Officer (SHO) immediately.
       - Zero FIR Mandate: A citizen can lodge a Zero FIR at ANY police station in India irrespective of jurisdiction, and the police station must register it and transfer it to the jurisdictional station.
    2. Section 175(3) BNSS: If the Station House Officer refuses to record the FIR, the aggrieved citizen can send the substance of the complaint in writing by speed post to the Superintendent of Police (SP).
    3. Section 175(4) BNSS (Corresponding to Section 156(3) CrPC): If the SP fails to act, the citizen has the absolute statutory right to file an application before the Judicial Magistrate First Class (JMFC), who can order the police to immediately register the FIR and investigate.
    `
  },
  {
    sourceName: "Ministry of Women and Child Development",
    rootUrl: "https://wcd.nic.in",
    authorityType: "CENTRAL_MINISTRY",
    state: "ALL",
    schemeCode: "PWDVA_DOMESTIC_VIOLENCE",
    schemeName: "Protection of Women from Domestic Violence Act 2005 (PWDVA) — Emergency Protection & Residence",
    hindiName: "घरेलू हिंसा से महिलाओं का संरक्षण अधिनियम 2005",
    documentType: "STATUTE_SECTION",
    metadata: {
      category: "WOMEN_RIGHTS",
      state: "ALL",
      sourceUrl: "https://wcd.nic.in/act/protection-women-domestic-violence-act-2005",
      officialAuthority: "Protection Officer (PO) / Judicial Magistrate First Class / One Stop Centre",
      requiredDocuments: ["Domestic Incident Report (DIR)", "Marriage Documents", "Medical Records of Injury", "Proof of Shared Household"]
    },
    rawText: `
    Protection of Women from Domestic Violence Act, 2005 (PWDVA).
    Statutory Reliefs and Emergency Protective Injunctions for Women in Domestic Relationships.
    Key Statutory Provisions:
    1. Section 12: Direct application before Judicial Magistrate for emergency protection, maintenance, residence, and custody.
    2. Section 17 & 19: Right to Reside in Shared Household: The woman cannot be evicted or excluded from the matrimonial home without due process of law.
    3. Section 18: Protection Orders: Magistrate can restrain the respondent from committing acts of domestic violence, entering the workplace, or communicating with the aggrieved woman.
    4. Section 20 & 22: Monetary relief for medical expenses, loss of earnings, monthly maintenance, and compensation for emotional distress.
    5. Section 23: Power to grant Ex-Parte Interim Relief within 3 days of filing.
    `
  },
  {
    sourceName: "Ministry of Law & Justice / Department of Legal Affairs",
    rootUrl: "https://legislative.gov.in",
    authorityType: "CENTRAL_MINISTRY",
    state: "ALL",
    schemeCode: "HINDU_SUCCESSION_DAUGHTERS",
    schemeName: "Hindu Succession Act 1956 (Section 6) — Equal Coparcenary Property Rights for Daughters",
    hindiName: "हिंदू उत्तराधिकार अधिनियम (धारा 6) - बेटियों का पैतृक संपत्ति में समान अधिकार",
    documentType: "STATUTE_SECTION",
    metadata: {
      category: "PROPERTY_SUCCESSION",
      state: "ALL",
      sourceUrl: "https://legislative.gov.in/actsofparliamentfromtheyear/hindu-succession-act-1956",
      officialAuthority: "Civil Court / Tehsildar Revenue Court",
      requiredDocuments: ["Family Tree / Pedigree Chart", "Khatoni / Land Record (ROR)", "Death Certificate of Ancestor", "Registered Partition Deed / Will if any"]
    },
    rawText: `
    Hindu Succession Act, 1956 (Amended by Act No. 39 of 2005) & Supreme Court Landmark Vineeta Sharma v. Rakesh Sharma (2020).
    Statutory Guarantee of Equal Coparcenary and Inheritance Rights to Daughters.
    Key Statutory Provisions:
    1. Section 6: Daughters are coparceners by birth with equal rights, liabilities, and shares in ancestral property identical to sons.
    2. Retroactive Application: Daughters have equal coparcenary rights irrespective of whether their father was alive on 9 September 2005.
    3. Section 8 & 15: General rules of intestate succession for ancestral and self-acquired properties.
    4. Right to Partition: Daughters have the full legal entitlement to institute a civil suit for partition, separate possession, and injunction against alienation of family properties.
    `
  },
  {
    sourceName: "Ministry of Social Justice and Empowerment, Government of India",
    rootUrl: "https://socialjustice.gov.in",
    authorityType: "CENTRAL_MINISTRY",
    state: "ALL",
    schemeCode: "SC_ST_POA_ACT_1989",
    schemeName: "Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act 1989 & Rules",
    hindiName: "अनुसूचित जाति और अनुसूचित जनजाति (अत्याचार निवारण) अधिनियम 1989",
    documentType: "STATUTE_SECTION",
    metadata: {
      category: "SOCIAL_JUSTICE",
      state: "ALL",
      sourceUrl: "https://www.india.gov.in/my-government/acts-and-rules?ministry=Ministry%20of%20Social%20Justice%20and%20Empowerment",
      officialAuthority: "Special Court (SC/ST Act) / National Commission for Scheduled Castes (NCSC)",
      requiredDocuments: ["Caste Certificate", "Medical MLC Report if injured", "Police Complaint Copy", "Identity Proof"]
    },
    rawText: `
    The Scheduled Castes and the Scheduled Tribes (Prevention of Atrocities) Act, 1989 (Act No. 33 of 1989) as Amended by Act 27 of 2018.
    Statutory Framework for Protection of SC/ST Citizens from Atrocities, Discrimination, and Land Dispossession.
    Key Provisions:
    1. Section 3(1) & 3(2): Specifies penal offences for intentionally insulting, humiliating in public view, assaulting, boycotting, or dispossessing members of SC/ST communities. Punishable with minimum 6 months up to 5 years imprisonment or Life Imprisonment for capital offences.
    2. Section 18 & 18A: Bar on Anticipatory Bail and Section 438 of Code of Criminal Procedure / BNSS. Preliminary inquiry is NOT required before registering FIR, and no prior approval is required for the arrest of accused persons.
    3. Section 14: Mandates establishment of Exclusive Special Courts at district level for speedy trial (to be disposed of within two months).
    4. Statutory Victim Compensation: Direct DBT compensation relief ranging from ₹85,000 to ₹8,25,000 to victims under the First Schedule of PoA Rules.
    5. National Helpline for Prevention of Atrocities (NHPA): 14566 (24x7 Toll-Free).
    `
  },
  {
    sourceName: "Ministry of Social Justice and Empowerment, Government of India",
    rootUrl: "https://socialjustice.gov.in",
    authorityType: "CENTRAL_MINISTRY",
    state: "ALL",
    schemeCode: "SENIOR_CITIZENS_ACT_2007",
    schemeName: "Maintenance and Welfare of Parents and Senior Citizens Act 2007",
    hindiName: "माता-पिता और वरिष्ठ नागरिकों का भरण-पोषण तथा कल्याण अधिनियम 2007",
    documentType: "STATUTE_SECTION",
    metadata: {
      category: "SOCIAL_JUSTICE_SENIOR_CITIZENS",
      state: "ALL",
      sourceUrl: "https://socialjustice.gov.in/common/acts",
      officialAuthority: "Maintenance Tribunal (Sub-Divisional Magistrate SDM)",
      requiredDocuments: ["Age Proof / Senior Citizen Card", "Property Transfer Deed / Gift Deed", "Bank Passbook", "Medical Prescription Records"]
    },
    rawText: `
    Maintenance and Welfare of Parents and Senior Citizens Act, 2007 (Act No. 56 of 2007).
    Statutory Guarantee of Monthly Maintenance and Protection of Property Rights of Senior Citizens.
    Key Provisions:
    1. Section 4 & 5: Senior citizen or parent unable to maintain themselves can apply to Maintenance Tribunal (presided by Sub-Divisional Magistrate / SDM) for monthly maintenance allowance from children or relatives possessing inheritances.
    2. Section 23: TRANSFER OF PROPERTY TO BE VOID IN CERTAIN CIRCUMSTANCES — Where a senior citizen has transferred property by gift or otherwise with condition of basic care, and transferee fails to provide amenities, the transfer of property SHALL BE DEEMED TO HAVE BEEN MADE BY FRAUD OR COERCION AND DECLARED VOID by the Tribunal.
    3. Section 24: Penal action and imprisonment for abandoning a senior citizen.
    4. National Senior Citizen Helpline (Elder Line): 14567 (24x7).
    `
  },
  {
    sourceName: "Ministry of Law and Justice, Government of India",
    rootUrl: "https://legislative.gov.in",
    authorityType: "CENTRAL_MINISTRY",
    state: "ALL",
    schemeCode: "CONSTITUTION_FUNDAMENTAL_RIGHTS",
    schemeName: "Constitution of India (Part III Fundamental Rights & Writ Jurisdiction)",
    hindiName: "भारत का संविधान (भाग 3 - मौलिक अधिकार एवं रिट क्षेत्राधिकार)",
    documentType: "STATUTE_SECTION",
    metadata: {
      category: "CONSTITUTIONAL_RIGHTS",
      state: "ALL",
      sourceUrl: "https://legislative.gov.in/constitution-of-india",
      officialAuthority: "Supreme Court of India / High Courts / District Legal Services Authority",
      requiredDocuments: ["Affidavit of Grievance", "Representation to Public Authority", "Proof of Administrative Breach"]
    },
    rawText: `
    Constitution of India — Supreme Law of the Land.
    Fundamental Rights under Part III enforceable against State Arbitrariness.
    Key Articles:
    1. Article 14: Right to Equality and Equal Protection of the Laws before all judicial and administrative bodies.
    2. Article 15: Prohibition of Discrimination on grounds of religion, race, caste, sex, or place of birth.
    3. Article 17: Abolition of Untouchability; practice in any form is forbidden and punishable by law.
    4. Article 21: Protection of Life and Personal Liberty. The Supreme Court has ruled that Article 21 includes the Right to Health & Emergency Treatment (Pt. Parmanand Katara), Right to Livelihood, Right to Privacy (K.S. Puttaswamy), and Right to Live with Dignity.
    5. Article 32 & Article 226: Power of Supreme Court and High Courts to issue prerogative Writs (Habeas Corpus, Mandamus, Prohibition, Quo Warranto, Certiorari) for the immediate enforcement of Fundamental Rights.
    6. Article 39A: Constitutional guarantee of Equal Justice and Free Legal Aid via NALSA (14468).
    `
  }
];

export const seedOfficialKnowledgeCorpus = async () => {
  const summary = [];
  for (const doc of OFFICIAL_GOVERNMENT_DOCUMENTS) {
    const source = await SourceRepository.create({
      name: doc.sourceName,
      rootUrl: doc.rootUrl,
      authorityType: doc.authorityType,
      state: doc.state
    });

    const result = await ingestGovernmentDocument({
      sourceId: source.sourceId,
      schemeCode: doc.schemeCode,
      schemeName: doc.schemeName,
      hindiName: doc.hindiName,
      documentType: doc.documentType,
      rawText: doc.rawText,
      metadata: doc.metadata
    });

    summary.push({
      scheme: doc.schemeName,
      sourceId: source.sourceId,
      indexedChunks: result.newChunksIndexed,
      skipped: result.unchangedChunksSkipped
    });
  }
  return summary;
};