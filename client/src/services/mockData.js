export const SAMPLE_GRIEVANCES = [
  {
    id: "g1",
    title: "E-Commerce Defective Phone Refund Rejection",
    hindiTitle: "ई-कॉमर्स खराब फोन रिफंड अस्वीकार",
    category: "Consumer Dispute",
    icon: "ShoppingBag",
    badgeColor: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    text: "I bought a OnePlus smartphone for ₹19,999 on Flipkart. The screen came shattered in the box. When I requested return within 24 hours, customer support arbitrarily closed the ticket stating 'physical damage not covered'. I want my full refund immediately.",
    district: "lucknow",
    amount: "₹19,999",
    targetAuthority: "Flipkart Internet Pvt Ltd & RetailNet Seller",
    diagnosis: {
      category: "Consumer Dispute",
      counterParty: "Flipkart Internet Pvt Ltd & Seller",
      summary: "You are legally protected under the Consumer Protection Act, 2019. Arbitrary rejection of return within standard replacement window for delivered defective goods constitutes 'Deficiency of Service' and 'Unfair Trade Practice'.",
      statutes: [
        {
          act: "Consumer Protection Act, 2019",
          section: "Section 35(1)(a)",
          title: "Filing Consumer Complaint before District Commission",
          relevance: "Empowers you to file a petition before DCDRC for recovery of ₹19,999 + harassment damages."
        },
        {
          act: "Consumer Protection (E-Commerce) Rules, 2020",
          section: "Rule 4(4) & Rule 5",
          title: "Mandatory Grievance Redressal & Ban on Unfair Cancellation",
          relevance: "E-commerce marketplace cannot refuse returns on goods delivered in damaged condition."
        },
        {
          act: "Consumer Protection Act, 2019",
          section: "Section 2(47)",
          title: "Unfair Trade Practice",
          relevance: "Misleading warranty representation or refusing replacement is punishable under law."
        }
      ],
      remedyPathway: [
        {
          step: 1,
          title: "Serve 15-Day Formal Statutory Legal Notice",
          description: "Issue formal notice to Grievance Officer & Seller demanding refund of ₹19,999 + ₹10,000 mental harassment damages within 15 days.",
          authority: "Nodal Grievance Officer, Flipkart India",
          timeline: "15 Days Notice Period"
        },
        {
          step: 2,
          title: "Lodge Complaint on National Consumer Helpline (NCH)",
          description: "Call toll-free 1915 or submit docket on consumerhelpline.gov.in for government mediation.",
          authority: "Department of Consumer Affairs",
          timeline: "3 to 7 Days"
        },
        {
          step: 3,
          title: "File E-Daakhil / e-Jagriti Petition before District Consumer Forum",
          description: "If unheeded, file online petition on e-jagriti.gov.in without requiring an expensive advocate.",
          authority: "District Consumer Disputes Redressal Commission (DCDRC)",
          timeline: "90-Day Summary Adjudication"
        }
      ],
      urgencyLevel: "HIGH",
      estimatedCompensation: "₹19,999 Refund + ₹10,000 Harassment & Litigation Costs",
      successProbability: 94,
      statutoryDeadlineDays: 15,
      keyEvidenceNeeded: ["Tax Invoice", "Unboxing photograph/video", "Customer support chat transcript", "Bank debit confirmation"]
    }
  },
  {
    id: "g2",
    title: "Landlord Illegally Deducting Security Deposit (₹50,000)",
    hindiTitle: "मकान मालिक द्वारा सिक्योरिटी डिपॉजिट की अवैध कटौती",
    category: "Tenancy & Housing",
    icon: "Home",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    text: "I vacated my rental apartment in Indiranagar, Lucknow after giving 1-month prior written notice. The flat was handed over in perfect spotless condition. The landlord is refusing to return my ₹50,000 security deposit making false claims of repainting costs without producing any GST bills.",
    district: "lucknow",
    amount: "₹50,000",
    targetAuthority: "Property Owner / Landlord",
    diagnosis: {
      category: "Tenancy & Housing",
      counterParty: "Landlord / Property Owner",
      summary: "Under Section 11 of the Model Tenancy Act, 2021, landlords must refund security deposit upon handover after deducting only agreed valid dues. Arbitrary deductions without itemized bills or receipts is unlawful.",
      statutes: [
        {
          act: "Model Tenancy Act, 2021",
          section: "Section 11",
          title: "Security Deposit Cap & Refund Mandate",
          relevance: "Deposit must be refunded within 30 days of handover; normal wear-and-tear painting is landlord's statutory maintenance duty."
        },
        {
          act: "Model Tenancy Act, 2021",
          section: "Section 30",
          title: "Jurisdiction of Rent Authority & Tribunal",
          relevance: "Authorizes Rent Authority (SDM) to order recovery of withheld deposit with penalty interest."
        }
      ],
      remedyPathway: [
        {
          step: 1,
          title: "Send Formal Demand Notice for Security Refund",
          description: "Serve a 15-day statutory demand letter attaching handover pictures, meter readings, and bank IFSC details.",
          authority: "Landlord",
          timeline: "15 Days"
        },
        {
          step: 2,
          title: "File Summary Petition before Rent Authority / SDM",
          description: "Initiate summary recovery proceedings before the local Rent Authority under the Tenancy Act.",
          authority: "Sub-Divisional Magistrate (Rent Authority)",
          timeline: "30 Days"
        }
      ],
      urgencyLevel: "HIGH",
      estimatedCompensation: "₹50,000 + 12% p.a. Interest + Legal Notice Expenses",
      successProbability: 89,
      statutoryDeadlineDays: 15,
      keyEvidenceNeeded: ["Rent agreement copy", "Bank UPI deposit transfer slips", "Handover video & NOC whatsapp chats"]
    }
  },
  {
    id: "g3",
    title: "RTI Application for Substandard Public Road Tender",
    hindiTitle: "खराब सड़क निर्माण व टेंडर विवरण हेतु RTI आवेदन",
    category: "RTI Application",
    icon: "FileText",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    text: "The main PWD link road constructed 4 months ago in Gomti Nagar has developed massive potholes. I want certified copies of the contractor tender, sanctioned budget amount, quality test reports, and names of supervising junior engineers under RTI Act 2005.",
    district: "lucknow",
    amount: "Public Work Inspection",
    targetAuthority: "Public Information Officer, Public Works Department (PWD)",
    diagnosis: {
      category: "RTI Application",
      counterParty: "Public Information Officer (PIO), PWD",
      summary: "Under Section 6(1) of the RTI Act 2005, you have an unhindered statutory right to inspect public works, obtain certified copies of tender agreements, contractor bills, and material inspection records within 30 days.",
      statutes: [
        {
          act: "Right to Information Act, 2005",
          section: "Section 6(1)",
          title: "Application for Seeking Information",
          relevance: "Right to request specific records with ₹10 court fee stamp or online payment."
        },
        {
          act: "Right to Information Act, 2005",
          section: "Section 7(1)",
          title: "Mandatory 30-Day Response Timeline",
          relevance: "PIO is legally bound to furnish information within 30 days of receipt."
        },
        {
          act: "Right to Information Act, 2005",
          section: "Section 20(1)",
          title: "Penalties on Defaulting PIO",
          relevance: "Information Commission can impose ₹250 per day personal penalty on the officer for delays."
        }
      ],
      remedyPathway: [
        {
          step: 1,
          title: "File Section 6(1) RTI Application",
          description: "Submit 5 pointed, numbered queries to PIO with ₹10 fee via rtionline.gov.in or registered speed post.",
          authority: "Public Information Officer (PIO), PWD Division",
          timeline: "30 Days Response Window"
        },
        {
          step: 2,
          title: "File Section 19(1) First Appeal if Delayed",
          description: "If PIO does not reply in 30 days or gives evasive replies, escalate to First Appellate Authority (Superintending Engineer).",
          authority: "First Appellate Authority (FAA)",
          timeline: "Within 30 Days of Default"
        }
      ],
      urgencyLevel: "MEDIUM",
      estimatedCompensation: "Mandatory Certified Records + Remedial Road Repair",
      successProbability: 95,
      statutoryDeadlineDays: 30,
      keyEvidenceNeeded: ["Geotagged road pothole photos", "Exact road stretch name & ward number"]
    }
  },
  {
    id: "g4",
    title: "Hospital Refusing Emergency Admission without Cash Deposit",
    hindiTitle: "अस्पताल द्वारा बिना अग्रिम जमा आपातकालीन इलाज से इंकार",
    category: "Healthcare & Emergency Rights",
    icon: "ShieldAlert",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
    text: "A private multi-specialty hospital in Delhi refused to admit an accident victim under Ayushman Bharat (PM-JAY) and demanded ₹50,000 cash advance before starting emergency trauma stabilization.",
    district: "delhi",
    amount: "₹50,000 Illegal Advance",
    targetAuthority: "Hospital Medical Superintendent & National Health Authority (NHA)",
    diagnosis: {
      category: "Healthcare & Emergency Rights",
      counterParty: "Private Empanelled Hospital Management",
      summary: "Under Section 134(a) of the Motor Vehicles Act 1988, Section 12(2) of the Clinical Establishments Act 2010, and Supreme Court precedent (Pt. Parmanand Katara), no hospital (public or private) can deny emergency life-saving treatment or demand cash advance. Empanelled PM-JAY hospitals are strictly cashless with zero advance deposit permissible.",
      applicableActs: [
        {
          act: "Motor Vehicles Act, 1988 (Amended 2019)",
          section: "Section 134(a) & 134A",
          summary: "Mandatory statutory duty of doctor and hospital to immediately attend and treat road accident victims without procedural delay or demanding advance payment.",
          fullText: "It shall be the duty of every doctor or hospital on duty to immediately attend to the injured person and render medical aid or treatment without waiting for any procedural formalities or police report."
        },
        {
          act: "Clinical Establishments (Registration and Regulation) Act, 2010",
          section: "Section 12(2)",
          summary: "Mandatory emergency medical stabilization of all individuals brought to clinical establishments without requiring advance cash deposits.",
          fullText: "Every clinical establishment shall provide such medical examination and treatment as may be required to stabilize the emergency medical condition of any individual who comes or is brought to such clinical establishment."
        },
        {
          act: "Constitution of India",
          section: "Article 21",
          summary: "Fundamental Right to Life & Emergency Healthcare as declared in landmark Supreme Court ruling Pt. Parmanand Katara vs Union of India.",
          fullText: "No person shall be deprived of his life or personal liberty except according to procedure established by law. Preservation of human life is paramount."
        },
        {
          act: "Ayushman Bharat PM-JAY Framework",
          section: "Clause 7.2 & 14",
          summary: "100% Cashless treatment guarantee; demanding cash deposits attracts immediate de-empanelment and 5x penalty under NHA anti-fraud framework.",
          fullText: "Empanelled Healthcare Providers (EHCP) shall not charge any money, advance, or deposit from the beneficiary under any circumstances."
        }
      ],
      hospitalSchemeAudit: {
        isHospitalDispute: true,
        hospitalName: "Private Multi-Specialty Hospital (Delhi)",
        city: "Delhi / NCR",
        state: "Delhi",
        empanelmentStatus: "VERIFIED_EMPANELLED_HEALTHCARE_PROVIDER",
        matchedScheme: {
          schemeCode: "PM_JAY",
          schemeName: "Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PM-JAY)",
          empanelmentCode: "NHA-EHCP-DEL-9011",
          status: "EMPANELLED",
          cashlessMandatory: true,
          specialties: ["Emergency Trauma", "Critical Care", "Surgery"]
        },
        isCashlessScheme: true,
        violationSeverity: "CRITICAL_STATUTORY_BREACH",
        violationSummary: "ILLEGAL CASH ADVANCE DEMAND ON CASHLESS PM-JAY SCHEME: Demanding ₹50,000 cash advance violates NHA Clause 7.2 cashless mandate, Section 12(2) Clinical Establishments Act, and Section 134(a) Motor Vehicles Act.",
        arogyaMitraDesk: "Ground Floor Emergency Wing • 24x7 NHA Helpline: 14555",
        cashlessPolicy: "Strictly Cashless for all approved PM-JAY packages. Zero advance deposit permissible.",
        emergencyHelplines: [
          { name: "National Health Authority (NHA) PM-JAY Hotline", phone: "14555", type: "24x7 Cashless Emergency Redressal" },
          { name: "National Emergency Ambulance Service", phone: "108 / 112", type: "24x7 Emergency Trauma Response" },
          { name: "National Consumer Helpline (NCH)", phone: "1915", type: "Deficiency of Service Complaint" },
          { name: "NALSA Free Legal Aid", phone: "14468", type: "Emergency Free Legal Representation" }
        ],
        immediateActionSteps: [
          { step: 1, title: "Trigger Immediate NHA 14555 Emergency Intervention", description: "Call 14555 immediately; State Health Agency (SHA) grievance team will call the hospital Arogya Mitra on duty to enforce instant cashless admission." },
          { step: 2, title: "Quote Section 134(a) Motor Vehicles Act & Clinical Establishments Act", description: "Present the statutory notice informing the hospital administration that denying emergency trauma treatment is a punishable offence attracting license cancellation." },
          { step: 3, title: "File Grievance on NHA Central Grievance Redressal Portal (CGRP)", description: "Submit hospital admission refusal docket on cgrms.pmjay.gov.in for punitive audit and 5x refund penalty." },
          { step: 4, title: "Lodge Formal Petition before District Consumer Forum (DCDRC)", description: "Claim compensation for medical negligence, harassment, and deficiency of service under Section 35 Consumer Protection Act 2019." }
        ]
      },
      remedyPathway: [
        {
          step: 1,
          title: "Trigger Immediate NHA 14555 Emergency Intervention",
          description: "Call toll-free 14555 immediately; the State Health Agency (SHA) emergency cell will contact the on-duty Arogya Mitra for instant cashless admission.",
          authority: "National Health Authority NHA Hotline (14555)",
          timeline: "Immediate / 1 Hour"
        },
        {
          step: 2,
          title: "Serve Emergency Notice Invoking Section 134(a) MVA & Clinical Establishments Act",
          description: "Hand over formal statutory notice warning management that denial of trauma stabilization attracts criminal prosecution and license cancellation.",
          authority: "Hospital Medical Superintendent",
          timeline: "Immediate"
        },
        {
          step: 3,
          title: "Lodge Petition before District Consumer Commission (DCDRC) & Medical Council",
          description: "File a claim on e-jagriti.gov.in under Section 35 CPA 2019 claiming compensation for medical negligence and distress.",
          authority: "District Consumer Commission & State Medical Council",
          timeline: "15 Days"
        }
      ],
      urgencyLevel: "CRITICAL",
      estimatedCompensation: "100% Cashless Admission + ₹1,00,000 Negligence Damages + Punitive Hospital Penalty",
      successProbability: 96,
      statutoryDeadlineDays: 2,
      keyEvidenceNeeded: ["Hospital admission slip / cash demand receipt", "Ayushman PM-JAY card copy", "Emergency medical casualty record"]
    }
  },
  {
    id: "g5",
    title: "Builder Delayed Flat Possession by 24 Months (RERA Claim)",
    hindiTitle: "बिल्डर द्वारा फ्लैट पजेशन में 24 महीने की देरी (रेरा क्लेम)",
    category: "Real Estate & RERA",
    icon: "Home",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    text: "The real estate builder promised handover of my 3BHK flat in Noida by December 2024 as per registered agreement for sale. The project is incomplete, and builder is refusing to pay monthly delay compensation or refund my ₹45,00,000 principal investment under Section 18 of RERA Act.",
    district: "noida",
    amount: "₹45,00,000",
    targetAuthority: "Real Estate Infrastructure Developer & UP RERA Authority",
    diagnosis: {
      category: "Real Estate & RERA",
      counterParty: "Real Estate Promoter / Builder",
      summary: "Under Section 18 of the Real Estate (Regulation and Development) Act (RERA), 2016, if a promoter fails to give possession by the agreed date, the allottee has the absolute right to withdraw from the project and demand full refund with interest (SBI MCLR + 2%) or claim monthly delay interest.",
      applicableActs: [
        {
          act: "Real Estate (Regulation and Development) Act (RERA), 2016",
          section: "Section 18",
          summary: "Mandatory refund of full principal investment along with prescribed interest upon promoter's failure to hand over possession.",
          fullText: "If the promoter fails to complete or give possession in accordance with agreement for sale, he shall be liable on demand to return the amount received with interest."
        },
        {
          act: "Real Estate (Regulation and Development) Act (RERA), 2016",
          section: "Section 31 & Section 59",
          summary: "Direct online complaint before State RERA Authority and recovery certificate execution against builder assets.",
          fullText: "Any aggrieved person may file a complaint with the Authority or the Adjudicating Officer for any violation of the Act."
        }
      ],
      remedyPathway: [
        {
          step: 1,
          title: "Serve 30-Day Statutory Demand Notice under Section 18 RERA",
          description: "Send formal notice invoking RERA delay clauses attaching BBA and payment receipts.",
          authority: "Builder Management",
          timeline: "30 Days"
        },
        {
          step: 2,
          title: "File Section 31 Complaint before State RERA Authority",
          description: "Submit digital petition on state RERA portal (up-rera.in) for recovery certificate execution.",
          authority: "State RERA Authority",
          timeline: "60 Days"
        }
      ],
      urgencyLevel: "HIGH",
      estimatedCompensation: "Full ₹45,00,000 Refund + SBI MCLR+2% Interest (~₹9,50,000)",
      successProbability: 95,
      statutoryDeadlineDays: 30,
      keyEvidenceNeeded: ["Registered Builder-Buyer Agreement (BBA)", "Bank transaction receipts", "Possession demand letters"]
    }
  },
  {
    id: "g6",
    title: "Dowry Death within 7 Years of Marriage & Demand of ₹5 Lakh and Car",
    hindiTitle: "विवाह के 7 वर्षों में दहेज मृत्यु, ₹5 लाख व कार की मांग (धारा 80 BNS / 304B IPC)",
    category: "Matrimonial & Women's Rights",
    icon: "ShieldAlert",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
    text: "A woman dies within seven years of marriage. Her family alleges that her husband and in-laws repeatedly demanded ₹5 lakh and a car. The husband's family claims that the money was actually a voluntary financial gift and that the woman died by suicide because of marital disputes unrelated to dowry.",
    district: "delhi",
    amount: "₹5,00,000 + Car Demands",
    targetAuthority: "Station House Officer (SHO), Sub-Divisional Magistrate (SDM) & Court of Session",
    diagnosis: {
      category: "Matrimonial & Women's Rights (Criminal Justice)",
      counterParty: "Husband & In-Laws (Accused Persons)",
      summary: "Under Section 80 of the Bharatiya Nyaya Sanhita, 2023 (Section 304B IPC), where a woman dies within seven years of marriage under abnormal circumstances and was subjected to dowry harassment, it is statutorily deemed a 'Dowry Death' (punishable with 7 years to Life Imprisonment). Crucially, under Section 118 of the Bharatiya Sakshya Adhiniyam, 2023 (Section 113B Indian Evidence Act), there is a MANDATORY STATUTORY PRESUMPTION: the Court SHALL presume the husband and in-laws caused the dowry death. The husband's defense that the money was a 'voluntary gift' or that she died by suicide due to unrelated disputes is legally untenable. Under Section 196 BNSS, a mandatory SDM Inquest is required, and all women/victims are entitled to 100% Free Legal Aid under Section 12 of the Legal Services Authorities Act (NALSA 14468).",
      applicableActs: [
        {
          act: "Bharatiya Nyaya Sanhita, 2023 (BNS) [Section 304B IPC]",
          section: "Section 80",
          summary: "Dowry Death: Death of a woman within 7 years of marriage under abnormal circumstances with dowry cruelty. Minimum 7 years to Life Imprisonment (Non-Bailable).",
          fullText: "Where the death of a woman is caused by any burns or bodily injury or occurs otherwise than under normal circumstances within seven years of her marriage and it is shown that soon before her death she was subjected to cruelty or harassment by her husband or any relative of her husband for, or in connection with, any demand for dowry, such death shall be called 'dowry death', and such husband or relative shall be deemed to have caused her death."
        },
        {
          act: "Bharatiya Sakshya Adhiniyam, 2023 (BSA) [Section 113B Evidence Act]",
          section: "Section 118",
          summary: "Mandatory Statutory Presumption as to Dowry Death: Court SHALL presume the accused caused the dowry death. Rebuttal burden shifts entirely to husband/in-laws.",
          fullText: "When the question is whether a person has committed the dowry death of a woman and it is shown that soon before her death such woman had been subjected by such person to cruelty or harassment for, or in connection with, any demand for dowry, the court shall presume that such person had caused the dowry death."
        },
        {
          act: "Bharatiya Nyaya Sanhita, 2023 (BNS) [Section 498A IPC]",
          section: "Section 85 & 86",
          summary: "Cruelty by Husband or Relatives: Subjecting a woman to physical or mental cruelty, driving her to suicide, or harassing her for property/cash.",
          fullText: "Whoever, being the husband or the relative of the husband of a woman, subjects such woman to cruelty shall be punished with imprisonment for a term which may extend to three years and shall also be liable to fine."
        },
        {
          act: "Dowry Prohibition Act, 1961",
          section: "Section 3, 4 & 6",
          summary: "Prohibition on demanding/taking dowry. Section 6 mandates immediate transfer of all Stridhan to woman's legal heirs.",
          fullText: "If any person demands, directly or indirectly, from the parents or other relatives of a bride or bridegroom any dowry, he shall be punishable with imprisonment. All property received as dowry shall be held for the benefit of the woman or her heirs."
        },
        {
          act: "Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS) [Section 176 CrPC]",
          section: "Section 196",
          summary: "Mandatory Inquest & Inquiry by Sub-Divisional Magistrate (SDM) in unnatural death of woman within 7 years of marriage.",
          fullText: "In the case of death of a woman within seven years of her marriage, the nearest Executive Magistrate empowered to hold inquests shall hold an inquiry into the cause of death."
        },
        {
          act: "Legal Services Authorities Act, 1987 (NALSA Framework)",
          section: "Section 12",
          summary: "Statutory guarantee of 100% Free Legal Aid, government advocate representation, and zero-cost litigation for all women and victims in India.",
          fullText: "Every woman, child, or victim of crime is entitled to free legal services under this Act before any court, tribunal, or authority in India."
        }
      ],
      remedyPathway: [
        {
          step: 1,
          title: "Lodge Immediate FIR under Section 80 & 85 BNS & Dowry Prohibition Act",
          description: "Submit written complaint to the Station House Officer (SHO). In case of refusal, send by speed post to Superintendent of Police under Sec 175(3) BNSS or call 112.",
          authority: "Local Police Station / SP Office",
          timeline: "Immediate / 24 Hours"
        },
        {
          step: 2,
          title: "Ensure Mandatory SDM Inquest under Section 196 BNSS",
          description: "Appear before the Sub-Divisional Magistrate (SDM) to record parent statements and secure videographed post-mortem and forensic chemical reports.",
          authority: "Sub-Divisional Magistrate (SDM) Inquest Cell",
          timeline: "24 Hours"
        },
        {
          step: 3,
          title: "Appoint Free State Advocate via NALSA Helpline (14468)",
          description: "Approach District Legal Services Authority (DLSA) under Section 12 of LSA Act for a 100% free senior advocate to represent the family in Sessions Court.",
          authority: "District Legal Services Authority (DLSA)",
          timeline: "3 Days"
        },
        {
          step: 4,
          title: "Trigger National Commission for Women (NCW) Emergency Oversight",
          description: "Register complaint on NCW 24x7 Helpline (7827170170 / 1091) for state-level monitoring and protection.",
          authority: "National Commission for Women (NCW)",
          timeline: "Immediate"
        }
      ],
      urgencyLevel: "CRITICAL",
      estimatedCompensation: "Immediate Non-Bailable Arrest under Sec 80 & 85 BNS + Mandatory SDM Inquest + 100% Stridhan Recovery + NALSA Free Legal Aid",
      successProbability: 98,
      statutoryDeadlineDays: 1,
      keyEvidenceNeeded: ["Marriage Certificate / Invitation Card", "Post-Mortem & Inquest Report", "Bank transaction & cash transfer slips", "WhatsApp / Call recordings of dowry demands"]
    }
  },
  {
    id: "g7",
    title: "Police Refusal to Register FIR for Cognizable Offence (Section 173 BNSS)",
    hindiTitle: "थाना प्रभारी द्वारा संज्ञेय अपराध में एफआईआर दर्ज करने से इनकार (धारा 173 BNSS)",
    category: "Criminal Justice & Police Redressal",
    icon: "ShieldAlert",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    text: "I went to the local police station to report a cognizable assault and criminal intimidation by local goons with medical injury slip, but the Station House Officer (SHO) refused to file an FIR or give me a GD entry number.",
    district: "lucknow",
    amount: "Statutory FIR Mandate",
    targetAuthority: "Superintendent of Police & Judicial Magistrate First Class (JMFC)",
    diagnosis: {
      category: "Criminal Justice & Police Redressal",
      counterParty: "Station House Officer (SHO) & Accused Persons",
      summary: "Under Section 173 of the Bharatiya Nagarik Suraksha Sanhita, 2023 (Section 154 CrPC) and the landmark Supreme Court ruling in Lalita Kumari v. Govt of UP, police are legally mandated to register an FIR immediately for any cognizable offence. If the SHO refuses, citizens have the absolute statutory right to escalate to the Superintendent of Police under Section 175(3) BNSS or obtain a Magistrate court order under Section 175(4) BNSS.",
      applicableActs: [
        {
          act: "Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS) [Sec 154 CrPC]",
          section: "Section 173",
          summary: "Mandatory registration of FIR in cognizable offences and universal Zero FIR jurisdiction.",
          fullText: "Every information relating to the commission of a cognizable offence, irrespective of the area where the offence is committed, may be given orally or by electronic communication (Zero FIR)."
        },
        {
          act: "Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS) [Sec 156(3) CrPC]",
          section: "Section 175(3) & 175(4)",
          summary: "Remedy against police refusal: Direct escalation to Superintendent of Police (SP) and Magisterial direction to investigate.",
          fullText: "Any person aggrieved by a refusal of police may send complaint to Superintendent of Police, or make an application to the Magistrate who may order an investigation."
        }
      ],
      remedyPathway: [
        {
          step: 1,
          title: "Submit Written Complaint under Section 173 BNSS",
          description: "Demand official GD entry number or free certified copy of FIR from SHO.",
          authority: "Local Police Station",
          timeline: "Immediate"
        },
        {
          step: 2,
          title: "Escalate to Superintendent of Police under Section 175(3) BNSS",
          description: "Send written complaint by registered speed post to District SP/Police Commissioner.",
          authority: "Superintendent of Police (SP) Office",
          timeline: "24 Hours"
        },
        {
          step: 3,
          title: "File Section 175(4) BNSS Application before Judicial Magistrate",
          description: "Obtain judicial direction commanding police to register FIR and submit chargesheet.",
          authority: "Judicial Magistrate First Class (JMFC)",
          timeline: "7 Days"
        }
      ],
      urgencyLevel: "HIGH",
      estimatedCompensation: "Mandatory FIR Registration within 24 Hours & Fair Criminal Investigation",
      successProbability: 95,
      statutoryDeadlineDays: 1,
      keyEvidenceNeeded: ["Written signed complaint copy", "Speed post tracking receipt to SP", "Medical MLC / injury slip", "Audio/video/photo proof"]
    }
  },
  {
    id: "g8",
    title: "Daughter Denied Equal Share in Ancestral Property (Hindu Succession Act)",
    hindiTitle: "पैतृक संपत्ति में बेटी को हिस्से से वंचित करना (हिंदू उत्तराधिकार अधिनियम धारा 6)",
    category: "Property & Succession Rights",
    icon: "Home",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    text: "My brothers and paternal relatives are refusing to give me my equal 1/3 share in my deceased father's ancestral agricultural land and residential house, claiming daughters have no right to ancestral property.",
    district: "lucknow",
    amount: "1/3 Equal Partition Share",
    targetAuthority: "Civil Judge (Senior Division) & Tehsildar Revenue Court",
    diagnosis: {
      category: "Property & Succession Rights",
      counterParty: "Opposing Co-sharers / Brothers",
      summary: "Under Section 6 of the Hindu Succession Act, 1956 (Amended 2005) and Supreme Court precedent (Vineeta Sharma v. Rakesh Sharma), daughters have equal coparcenary rights by birth in ancestral property identical to sons. State Revenue Codes mandate 30-day land record mutation.",
      applicableActs: [
        {
          act: "Hindu Succession Act, 1956 (Amended 2005)",
          section: "Section 6",
          summary: "Daughters are coparceners by birth with equal rights and liabilities identical to sons.",
          fullText: "The daughter of a coparcener shall by birth become a coparcener in her own right in the same manner as the son."
        },
        {
          act: "Specific Relief Act, 1963 & State Revenue Code",
          section: "Section 6 SRA & Mutation Rules",
          summary: "Summary suit for possession against unlawful dispossession and mandatory 30-day mutation in land records.",
          fullText: "If any person is dispossessed without his consent of immovable property otherwise than in due course of law, he may recover possession."
        }
      ],
      remedyPathway: [
        {
          step: 1,
          title: "Apply for Revenue Mutation before Tehsildar Court",
          description: "Submit application with family pedigree and ROR for mandatory 30-day land record entry.",
          authority: "Tehsildar Revenue Court",
          timeline: "30 Days"
        },
        {
          step: 2,
          title: "Institute Civil Suit for Partition & Injunction",
          description: "File civil suit claiming equal coparcenary share with interim injunction against third-party sale.",
          authority: "Civil Judge Senior Division",
          timeline: "60 Days"
        }
      ],
      urgencyLevel: "HIGH",
      estimatedCompensation: "Equal Coparcenary Partition Share, Injunction & 30-Day Revenue Record Mutation",
      successProbability: 98,
      statutoryDeadlineDays: 30,
      keyEvidenceNeeded: ["Family pedigree chart (Parivar Register)", "Khatoni / Land Record ROR", "Death Certificate of father", "Aadhaar Card showing parentage"]
    }
  },
  {
    id: "g9",
    title: "Casteist Harassment, Humiliation & Land Dispossession (SC/ST PoA Act)",
    hindiTitle: "एससी/एसटी अत्याचार, जातिगत उत्पीड़न व भूमि से बेदखली (अत्याचार निवारण अधिनियम)",
    category: "Social Justice & SC/ST Protection",
    icon: "ShieldAlert",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
    text: "A dominant caste group hurled casteist slurs at an SC family, assaulted them, and illegally occupied their agricultural land allotted by the government.",
    district: "lucknow",
    amount: "Immediate Arrest & Statutory Victim Relief",
    targetAuthority: "Special Court (SC/ST Act) & Superintendent of Police",
    diagnosis: {
      category: "Social Justice & SC/ST Protection",
      counterParty: "Accused Dominant Group / Encroachers",
      summary: "Under Section 18A of the Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act 1989 (Amended 2018), preliminary inquiry is strictly barred and police must register an immediate non-bailable FIR without prior approval. Victims are entitled to mandatory DBT financial relief under PoA Rules.",
      applicableActs: [
        {
          act: "SC & ST (Prevention of Atrocities) Act, 1989 (Amended 2018)",
          section: "Section 3(1), 3(2) & Section 18A",
          summary: "Mandatory immediate non-bailable FIR and arrest without preliminary inquiry; total bar on anticipatory bail.",
          fullText: "Preliminary enquiry shall not be required for registration of a First Information Report; the investigating officer shall not require approval for arrest."
        },
        {
          act: "Constitution of India",
          section: "Article 17 & Article 21",
          summary: "Fundamental right against untouchability and right to live with human dignity.",
          fullText: "Untouchability is abolished and its practice in any form is forbidden."
        }
      ],
      remedyPathway: [
        {
          step: 1,
          title: "Register Non-Bailable FIR under Section 18A PoA Act",
          description: "Demand immediate FIR registration from SHO without preliminary inquiry delay.",
          authority: "Local Police Station / DSP Special Cell",
          timeline: "Immediate"
        },
        {
          step: 2,
          title: "Report to National Helpline for Prevention of Atrocities (14566)",
          description: "Call 14566 toll-free for Ministry of Social Justice escalation.",
          authority: "National Helpline (14566)",
          timeline: "Immediate"
        },
        {
          step: 3,
          title: "Claim Statutory DBT Victim Compensation from District Magistrate",
          description: "Submit FIR copy to District Social Welfare Officer for immediate relief.",
          authority: "District Social Welfare Officer",
          timeline: "7 Days"
        }
      ],
      urgencyLevel: "CRITICAL",
      estimatedCompensation: "Immediate Arrest under Sec 18A + ₹85,000 to ₹8,25,000 DBT Victim Relief",
      successProbability: 99,
      statutoryDeadlineDays: 1,
      keyEvidenceNeeded: ["Caste Certificate", "Medical MLC Report", "Written complaint", "Witness statements"]
    }
  },
  {
    id: "g10",
    title: "Elderly Parents Abandoned after Gift Deed (Senior Citizens Act Sec 23)",
    hindiTitle: "बुजुर्ग माता-पिता की उपेक्षा एवं गिफ्ट डीड रद्दीकरण (वरिष्ठ नागरिक अधिनियम धारा 23)",
    category: "Senior Citizens & Parents Welfare Rights",
    icon: "HeartHandshake",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    text: "An elderly couple transferred their house to their son via gift deed on the condition that he would look after them. The son has now abandoned them and refused food, medical treatment, and basic maintenance.",
    district: "lucknow",
    amount: "Gift Deed Cancellation & Monthly Maintenance",
    targetAuthority: "Maintenance Tribunal (Sub-Divisional Magistrate SDM)",
    diagnosis: {
      category: "Senior Citizens & Parents Welfare Rights",
      counterParty: "Defaulting Children / Son",
      summary: "Under Section 23 of the Maintenance and Welfare of Parents and Senior Citizens Act 2007, where property was transferred by gift/will to children who fail to provide basic care, the SDM Maintenance Tribunal has the statutory power to declare the transfer VOID as made by fraud/coercion.",
      applicableActs: [
        {
          act: "Maintenance and Welfare of Parents and Senior Citizens Act, 2007",
          section: "Section 23 & Section 4",
          summary: "Power of Maintenance Tribunal to declare property transfer VOID and order monthly maintenance allowance.",
          fullText: "Where any senior citizen has transferred by way of gift or otherwise his property, and transferee fails to provide basic amenities, the transfer shall be deemed to have been made by fraud or coercion and declared void by Tribunal."
        }
      ],
      remedyPathway: [
        {
          step: 1,
          title: "File Section 23 Application before SDM Maintenance Tribunal",
          description: "Submit property transfer copy and proof of neglect to revoke the deed.",
          authority: "SDM Maintenance Tribunal",
          timeline: "30 Days"
        },
        {
          step: 2,
          title: "Call National Elder Line Helpline (14567)",
          description: "Access free legal counseling and rescue services via Ministry of Social Justice.",
          authority: "Elder Line (14567)",
          timeline: "Immediate"
        }
      ],
      urgencyLevel: "HIGH",
      estimatedCompensation: "Section 23 Gift Deed Cancellation + Monthly Maintenance Allowance",
      successProbability: 97,
      statutoryDeadlineDays: 30,
      keyEvidenceNeeded: ["Registered Gift Deed copy", "Senior Citizen ID", "Medical bills", "Affidavit of neglect"]
    }
  },
  {
    id: "g11",
    title: "Harassment near Public Transit & Police Inaction",
    hindiTitle: "सार्वजनिक परिवहन स्टॉप के पास छेड़छाड़ व पुलिस निष्क्रियता",
    category: "Criminal Justice & Women Safety",
    icon: "ShieldAlert",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
    text: "A college student repeatedly reported harassment near a public transport stop, but no effective action was taken. The local authorities claim regular patrols are conducted and no formal complaint identifying specific accused was initially received.",
    district: "lucknow",
    amount: "Statutory Prosecution & Police Patrolling Mandate",
    targetAuthority: "Station House Officer (SHO), Local Police Station & Commissioner of Police",
    diagnosis: {
      category: "Criminal Justice & Women Safety",
      counterParty: "Local Police Station / SHO & Unknown Perpetrators",
      summary: "Under Sections 74, 75, 78, and 79 of Bharatiya Nyaya Sanhita 2023 (Sections 354, 354D, 509 IPC) and Section 173 BNSS (Section 154 CrPC), police are statutorily mandated to register an FIR upon receipt of any cognizable complaint of harassment or stalking against women, even against unknown persons (Zero FIR). Official inaction constitutes dereliction of duty under Section 199 BNS. Victims are entitled to 100% Free Legal Aid under Section 12 NALSA Act and immediate UP Women Power Line 1090 / 112 escalation.",
      statutes: [
        {
          act: "Bharatiya Nyaya Sanhita, 2023 (BNS)",
          section: "Sections 74, 75, 78 & 79",
          title: "Assault, Sexual Harassment, Stalking & Word/Gesture Outraging Modesty",
          relevance: "Strict criminal liability against perpetrators with mandatory non-bailable FIR registration."
        },
        {
          act: "Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)",
          section: "Section 173 & Section 175(3)",
          title: "Mandatory Registration of FIR & Judicial Magistrate Direction",
          relevance: "Mandatory FIR registration on information of cognizable offence. Incase of refusal by SHO, application before Judicial Magistrate for FIR order."
        },
        {
          act: "Constitution of India",
          section: "Article 21 & Article 39A",
          title: "Right to Safe Public Spaces & Free Legal Aid (NALSA)",
          relevance: "Constitutional right to personal safety and 100% free legal representation for all women."
        }
      ],
      remedyPathway: [
        {
          step: 1,
          title: "Call UP Women Power Line (1090) & Emergency 112",
          description: "Lodge an instant grievance docket with 1090. Dedicated women officers will initiate covert surveillance and identify perpetrators without forcing victim exposure.",
          authority: "UP Women Power Line (1090) / Dial 112",
          timeline: "Immediate / 24 Hours"
        },
        {
          step: 2,
          title: "Submit Written Representation under Section 173(4) BNSS to Police Commissioner / SP",
          description: "If SHO refuses to act, send the written grievance via Speed Post to the Superintendent of Police / Commissioner of Police.",
          authority: "Superintendent of Police (SP) / Police Commissioner",
          timeline: "48 Hours"
        },
        {
          step: 3,
          title: "File Section 175(3) BNSS Application before Judicial Magistrate",
          description: "Direct the police to register FIR and submit investigation status report with CCTV footage preservation.",
          authority: "Chief Judicial Magistrate (CJM Court)",
          timeline: "7 Days"
        }
      ],
      urgencyLevel: "CRITICAL",
      estimatedCompensation: "Mandatory Zero FIR Registration + Targeted Pink Patrols + CCTV Surveillance",
      successProbability: 98,
      statutoryDeadlineDays: 2,
      keyEvidenceNeeded: ["Detailed log of dates, times, and location descriptions", "Call records to 1090/112", "CCTV camera locations at transit stop", "Written representation copy"]
    }
  },
  {
    id: "g12",
    title: "Overflowing Garbage & Uncollected Solid Waste Crisis",
    hindiTitle: "कचरा भराव एवं ठोस अपशिष्ट प्रबंधन विफलता",
    category: "Sanitation & Public Health",
    icon: "AlertCircle",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    text: "Garbage has not been collected in our locality for weeks. Waste is overflowing, causing foul smell and severe health hazards. Complaints to local authorities yielded no action.",
    district: "lucknow",
    amount: "Immediate Waste Clearance & Route Sanitization",
    targetAuthority: "Municipal Commissioner & Nagar Nigam Sanitation Division",
    diagnosis: {
      category: "Sanitation & Public Health",
      counterParty: "Municipal Corporation / Nagar Nigam",
      summary: "Under Rule 15 of Solid Waste Management Rules 2016 and Article 21 Constitution of India (Ratlam Municipality Landmark), urban local bodies have a mandatory duty to ensure daily door-to-door waste collection. Public nuisance is punishable under Section 270 BNS and Section 152 BNSS.",
      statutes: [
        {
          act: "Solid Waste Management Rules, 2016",
          section: "Rule 15(a)",
          title: "Mandatory Door-to-Door Daily Collection",
          relevance: "Local bodies bear strict legal duty to arrange segregated collection and transit."
        },
        {
          act: "Constitution of India",
          section: "Article 21 (Ratlam Precedent)",
          title: "Fundamental Right to Clean Environment",
          relevance: "Supreme Court ruled financial deficit cannot be an excuse for municipal sanitary negligence."
        }
      ],
      remedyPathway: [
        {
          step: 1,
          title: "Log Ticket on Swachhata MoHUA App & Dial 1533 / 1076",
          description: "Submit geotagged photos to get an official grievance tracking code.",
          authority: "Nagar Nigam Control Room (1533)",
          timeline: "24 Hours"
        },
        {
          step: 2,
          title: "File Section 152 BNSS Nuisance Petition before SDM",
          description: "Command the municipal executive engineer to clear the dump within 24 hours under penalty of contempt.",
          authority: "Sub-Divisional Magistrate (SDM)",
          timeline: "48 Hours"
        }
      ],
      urgencyLevel: "HIGH",
      estimatedCompensation: "Immediate 24-Hour Clearance + Daily Sanitization Route",
      successProbability: 96,
      statutoryDeadlineDays: 2,
      keyEvidenceNeeded: ["Geotagged photographs with GPS timestamp", "Swachhata app ticket numbers", "Joint representation of residents"]
    }
  }
];

export const SAMPLE_INVOICES = [
  {
    id: "inv1",
    name: "Flipkart Smartphone Bill (Damaged Delivery)",
    merchant: "RetailNet / Flipkart India Pvt Ltd",
    amount: "₹19,999.00",
    date: "12/08/2026",
    gstin: "09AAECF1234F1Z8",
    invoiceNo: "FK-2026-881920",
    breach: "Delivered physically broken; replacement denied in violation of 7-day guarantee.",
    strength: "High (95% Evidentiary Score)"
  },
  {
    id: "inv2",
    name: "Indiranagar Flat Lease Agreement (Deposit Bond)",
    merchant: "Residential Tenancy Agreement",
    amount: "₹50,000.00",
    date: "01/08/2025",
    gstin: "Stamp Duty Ref: UP-ST-99120",
    invoiceNo: "RENT-AGR-2025-LKO",
    breach: "Section 11 Model Tenancy Act violation; arbitrary security deposit retention.",
    strength: "High (92% Evidentiary Score)"
  },
  {
    id: "inv3",
    name: "Electricity Board Faulty Meter Assessment",
    merchant: "UP Power Corporation Ltd (UPPCL)",
    amount: "₹18,450.00",
    date: "05/08/2026",
    gstin: "09AAACU0091K1Z2",
    invoiceNo: "BILL-UPPCL-8921",
    breach: "Arbitrary 10x meter surge billing without mandatory lab test inspection.",
    strength: "High (88% Evidentiary Score)"
  }
];

export const LEGAL_WIKI = [
  {
    id: "w1",
    title: "How to File a Zero-Cost RTI Application (Section 6(1))",
    category: "Right to Information",
    badge: "RTI Act 2005",
    readTime: "3 min read",
    summary: "Any citizen can file an RTI with just ₹10. BPL citizens pay ₹0. Learn the magic 4-step structure to extract government tender records and road budgets."
  },
  {
    id: "w2",
    title: "Consumer Rights Against E-Commerce Refusals",
    category: "Consumer Protection",
    badge: "CPA 2019",
    readTime: "4 min read",
    summary: "Did an online seller send a fake or damaged item and refuse refund? Here is how Section 35 and E-Daakhil guarantee you 100% refund plus harassment compensation."
  },
  {
    id: "w3",
    title: "Tenant Protection & Security Deposit Recovery",
    category: "Housing Law",
    badge: "Model Tenancy Act",
    readTime: "3 min read",
    summary: "Landlords cannot cut your electricity or deduct painting charges arbitrarily. Know how Section 11 protects your hard-earned security deposit."
  },
  {
    id: "w4",
    title: "Zero FIR & Police Complaint Rights under BNSS",
    category: "Criminal & Civic Rights",
    badge: "BNSS / CrPC",
    readTime: "5 min read",
    summary: "A police station cannot refuse to file a Zero FIR regardless of territorial jurisdiction. Learn your rights when filing cognizable crime reports."
  }
];
