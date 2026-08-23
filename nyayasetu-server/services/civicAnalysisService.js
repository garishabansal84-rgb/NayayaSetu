import { GoogleGenerativeAI } from '@google/generative-ai';
import { resolveJurisdiction } from './knowledgeBase.js';

const apiKey = process.env.GEMINI_API_KEY || '';
let genAI = null;
if (apiKey && apiKey !== 'your_gemini_api_key_here') {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
  } catch (e) {
    console.warn('Could not initialize GoogleGenerativeAI for civic analysis:', e.message);
  }
}

const parseCleanJSON = (rawText) => {
  try {
    const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    return null;
  }
};

/**
 * High-Fidelity Sovereign Dynamic Fallback Engine for Civic Complaints
 * Covers all 16 domains (Sanitation, Corruption, Public Safety, Consumer, Environment, Housing, etc.)
 */
export const dynamicFallbackCivicAnalysis = (rawComplaint, district = 'Lucknow', state = 'Uttar Pradesh', language = 'en') => {
  const text = (rawComplaint || '').trim();
  const textLower = text.toLowerCase();
  const juris = resolveJurisdiction(district, state);
  const isHi = language === 'hi';
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  // 1. Garbage / Sanitation / Waste / Drainage
  if (/\b(garbage|waste|trash|kachra|safai|sanitation|sewage|drain|drainage|foul\s*smell|stagnant|nalas?|clearing|filth|dump|dumping)\b/i.test(textLower)) {
    return {
      summary: isHi 
        ? ('नागरिक शिकायत: ' + district + ' में कूड़ा-कचरा न उठने, नालियों के अवरुद्ध होने एवं दुर्गंध से उत्पन्न जन-स्वास्थ्य संकट का मामला।')
        : ('Citizen Complaint regarding uncollected garbage, overflowing municipal waste, and severe public health risks in ' + district + '.'),
      categories: ["Sanitation", "Public Safety", "Environmental Issues", "Government Services"],
      severity: "High",
      keyConcerns: [
        "Accumulation of hazardous municipal solid waste without timely collection",
        "Risk of vector-borne epidemic diseases (Dengue, Malaria, Typhoid, Cholera)",
        "Breach of statutory municipal duty under Solid Waste Management Rules 2016",
        "Violation of constitutional Right to Clean and Hygienic Environment (Article 21)"
      ],
      rightsAndLaws: [
        {
          lawOrArticle: "Article 21, Constitution of India",
          provision: "Right to Life & Pollution-Free Environment",
          explanation: "The Supreme Court of India in Subhash Kumar v. State of Bihar held that Right to Life includes the fundamental right to enjoyment of pollution-free water and air."
        },
        {
          lawOrArticle: "Solid Waste Management Rules, 2016 (Rule 15)",
          provision: "Mandatory Duties of Local Authorities / Urban Local Bodies",
          explanation: "Mandates municipal corporations to establish daily door-to-door waste collection, prevent open littering, and clean community bins at regular intervals."
        },
        {
          lawOrArticle: "Section 270 & 271, Bharatiya Nyaya Sanhita (BNS) / Sec 269 & 270 IPC",
          provision: "Negligent act likely to spread infection of disease dangerous to life",
          explanation: "Criminal liability for public servants or entities whose negligence creates hazardous disease vector conditions."
        },
        {
          lawOrArticle: "Section 152, Bharatiya Nagarik Suraksha Sanhita (BNSS) / Sec 133 CrPC",
          provision: "Conditional order for removal of public nuisance",
          explanation: "Empowers the Sub-Divisional Magistrate (SDM) to order immediate administrative clearance of any public filth or nuisance."
        }
      ],
      responsibleAuthorities: [
        {
          name: 'Municipal Corporation / Nagar Nigam (' + district + ')',
          department: "Health & Solid Waste Management Department",
          portalOrContact: 'Swachhata Mobile App / Helpline: ' + (juris.cmHelpline || '1533'),
          role: "Primary civic body mandated for daily waste collection and ward sanitization"
        },
        {
          name: state + ' State Pollution Control Board (SPCB)',
          department: "Solid Waste & Civic Compliance Division",
          portalOrContact: "spcb.gov.in / cpcb.nic.in",
          role: "Statutory environmental regulator for imposing environmental compensation on erring civic bodies"
        },
        {
          name: 'District Magistrate (DM) / SDM Office (' + district + ')',
          department: "Revenue & Civic Grievance Cell",
          portalOrContact: 'DM Office, Collectorate, ' + district,
          role: "Administrative oversight and summary directions under Section 152 BNSS"
        }
      ],
      recommendedActions: [
        {
          step: 1,
          title: "Capture High-Resolution Time-Stamped & Geotagged Evidence",
          description: "Photograph the garbage accumulation with identifiable landmarks and date-stamps from multiple angles."
        },
        {
          step: 2,
          title: "Lodge Formal Complaint on Central Swachhata App & Civic Helpline",
          description: 'File a direct civic ticket via MoHUA Swachhata App or dial municipal helpline 1533 / ' + (juris.cmHelpline || '1076') + ' and save the unique grievance docket number.'
        },
        {
          step: 3,
          title: "Submit Written Notice to Municipal Commissioner & Ward Sanitary Inspector",
          description: "Deliver the formal statutory notice generated below, providing a mandatory 48-hour cure deadline."
        },
        {
          step: 4,
          title: "Escalate to Chief Minister Helpline & State Human Rights Commission",
          description: "If unaddressed within 48 hours, escalate docket ID to CM Grievance Portal citing health hazard under Article 21."
        }
      ],
      evidenceChecklist: [
        {
          item: "Geotagged Photographs & Video Clips",
          whyNeeded: "Establishes exact GPS coordinates, volume of accumulated garbage, and stagnation time.",
          tip: "Turn on GPS location in camera settings before recording."
        },
        {
          item: "Previous Complaint Docket / SMS Reference Numbers",
          whyNeeded: "Proves habitual administrative negligence and failure of local ward officials.",
          tip: "Take screenshots of civic portal tickets or automated SMS confirmations."
        },
        {
          item: "Joint Representation signed by Locality Residents / RWA",
          whyNeeded: "Demonstrates widespread public nuisance affecting community health.",
          tip: "Collect signatures from 5 to 10 immediate neighbours."
        },
        {
          item: "Medical Prescriptions / Doctor Slips (if illness occurred)",
          whyNeeded: "Establishes direct proximate harm resulting from unhygienic conditions.",
          tip: "Keep receipts for mosquito-repellents, water purification, or doctor consultations."
        }
      ],
      urgencyAlert: "⚠️ High Health Risk: Stagnant organic waste creates rapid mosquito breeding grounds for Dengue and Malaria and poses imminent contamination risk to drinking water lines.",
      complaintDraft: 'To,\nThe Municipal Commissioner / Sanitary Officer,\nMunicipal Corporation / Nagar Nigam,\n' + district + ', ' + state + '\n\nSubject: URGENT STATUTORY NOTICE: Failure of Garbage Collection & Hazardous Public Health Nuisance at [Insert Exact Locality / Colony / Ward No.], ' + district + '\n\nRespected Sir/Madam,\n\n1. I am a resident and taxpayer residing at [Insert Your Full Address, Locality], ' + district + ', ' + state + '.\n\n2. I am writing to bring to your urgent attention a severe civic hazard in our locality. For the past [Insert Duration, e.g., 3 weeks], municipal garbage and waste collection has been completely stopped. The community dustbins and open roadside corners are severely overflowing with organic and toxic waste, emitting a putrid foul smell and creating an unbearable living condition for dozens of families.\n\n3. STATUTORY INFRACTION:\nThis neglect directly violates:\na) Rule 15 of the Solid Waste Management Rules, 2016 (Mandatory daily collection and disposal duty).\nb) Fundamental Right to a Clean & Hygienic Environment guaranteed under Article 21 of the Constitution of India.\nc) Sections 270 and 271 of the Bharatiya Nyaya Sanhita, 2023 (Spreading infection of disease dangerous to life).\n\n4. Previous complaints registered on [Insert Date / Ticket No.] have yielded zero ground action by the ward sanitary staff.\n\n5. RELIEF PRAYED FOR:\nYou are hereby formally called upon to:\na) Deploy immediate compactor trucks and sanitary staff to clear the entire waste accumulation within 24 to 48 hours of receipt of this notice.\nb) Undertake immediate chemical spraying / bleaching powder application to neutralize pest infestation.\nc) Institute daily door-to-door waste collection as mandated by law.\n\nFailing compliance, I shall be compelled to escalate this matter to the Hon\'ble District Magistrate under Section 152 BNSS and file a petition before the National Green Tribunal (NGT) / Lokayukta for official dereliction of duty.\n\nYours faithfully,\n\n[Applicant Name]\n[Address & Ward Number]\n[Mobile Number & Email]\nDate: ' + today + '\nLocation: ' + district + ', ' + state,
      disclaimer: "This analysis is intended for informational and civic guidance purposes only. It does not constitute professional legal advice. Please verify legal information and consult a qualified professional where necessary."
    };
  }

  // 2. Streetlights / Night Accidents / Public Safety / Darkness
  if (/\b(streetlight|street\s*light|darkness|pole|light\s*not\s*working|theft|snatching|accidents?\s*at\s*night|crime|unsafe|night\s*patrol|broken\s*light)\b/i.test(textLower)) {
    return {
      summary: isHi
        ? ('नागरिक शिकायत: ' + district + ' में स्ट्रीट लाइटें खराब होने, अंधेरे के कारण रात्रि में सड़क दुर्घटनाओं एवं आपराधिक घटनाओं में वृद्धि का मामला।')
        : ('Citizen Complaint regarding non-functioning streetlights, severe darkness, and resulting nighttime accidents and theft in ' + district + '.'),
      categories: ["Public Safety", "Road and Infrastructure", "Government Services", "Police Misconduct"],
      severity: "High",
      keyConcerns: [
        "Prolonged absence of street illumination creating high vulnerability to nighttime violent crime and theft",
        "Increased risk of fatal road accidents and pedestrian injuries",
        "Dereliction of statutory municipal maintenance and public safety duties",
        "Compromised women's safety during evening hours"
      ],
      rightsAndLaws: [
        {
          lawOrArticle: "Article 21, Constitution of India",
          provision: "Right to Safe Public Spaces and Personal Security",
          explanation: "Right to Life under Article 21 encompasses the obligation of the state and local administration to maintain safe and illuminated public streets."
        },
        {
          lawOrArticle: "Section 43 & State Municipalities Act",
          provision: "Obligation of Municipal Authorities for Public Lighting",
          explanation: "Statutory mandatory duty of urban local bodies to light public streets, places, and markets."
        },
        {
          lawOrArticle: "Section 198, Motor Vehicles Act 1988 (Amended 2019)",
          provision: "Liability for failure to maintain safe road infrastructure",
          explanation: "Designated authorities and contractors are legally accountable for road accidents caused by deficient maintenance or failure of safety infrastructure."
        },
        {
          lawOrArticle: "Section 35, Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023",
          provision: "Preventive police patrolling in crime-prone dark spots",
          explanation: "Mandates local police stations to maintain regular preventive night beats in vulnerable areas."
        }
      ],
      responsibleAuthorities: [
        {
          name: 'Municipal Corporation / Local Body Electrical Division (' + district + ')',
          department: "Street Lighting & Public Works Cell",
          portalOrContact: 'Municipal Citizen Portal / Helpline: 1533 / ' + (juris.cmHelpline || '1076'),
          role: "Direct maintenance and replacement of LED streetlights and wiring"
        },
        {
          name: 'District Police Station (SHO) / Traffic Police (' + district + ')',
          department: "Law & Order / Night Patrolling Wing",
          portalOrContact: 'Police Helpline: 112 / SHO ' + (juris.policeNodal?.station || district),
          role: "Intensifying PCR van presence and night patrolling until illumination is restored"
        },
        {
          name: 'State Electricity Distribution Company (DISCOM)',
          department: "Distribution Maintenance Division",
          portalOrContact: "State DISCOM Portal / Toll-free: 1912",
          role: "Restoring transformer supply and fixing cable faults"
        }
      ],
      recommendedActions: [
        {
          step: 1,
          title: "Note Exact Pole Numbers & Street GPS Landmarks",
          description: "Record the unique serial numbers painted on the dark electricity poles along with GPS coordinates."
        },
        {
          step: 2,
          title: "Lodge Online Ticket with Municipal Electricity Cell & DISCOM",
          description: "Register a complaint on the state municipal portal or electricity toll-free line 1912."
        },
        {
          step: 3,
          title: "Submit Written Security Notice to Local Police Station (SHO)",
          description: "Inform the SHO in writing about recent theft/accident incidents requesting heightened night PCR patrolling."
        },
        {
          step: 4,
          title: "Escalate to District Magistrate & Ward Councilor (Parshad)",
          description: "Submit formal representation for fast-track LED replacement under the Smart City / Street Lighting National Programme."
        }
      ],
      evidenceChecklist: [
        {
          item: "Night-time Photos/Videos showing complete darkness",
          whyNeeded: "Clearly shows unlit road stretches and hazardous dark spots.",
          tip: "Capture without flash to realistically portray visibility conditions."
        },
        {
          item: "Pole Identification Numbers & Landmark Map",
          whyNeeded: "Enables line staff to identify the exact faulty phase/poles immediately.",
          tip: "Check the stencil paint on pole bases."
        },
        {
          item: "Copies/FIRs of recent Theft or Accident incidents",
          whyNeeded: "Proves direct causal nexus between darkness and criminal/road hazards.",
          tip: "Obtain GD (General Diary) entry numbers from local police station."
        }
      ],
      urgencyAlert: "⚠️ Public Safety & Crime Alert: Prolonged dark stretches significantly elevate the risk of snatching, burglary, women harassment, and vehicular collisions.",
      complaintDraft: 'To,\nThe Executive Engineer (Street Lighting Division),\nMunicipal Corporation / Nagar Nigam,\n' + district + ', ' + state + '\n\nCopy to: The Station House Officer (SHO), Police Station [Insert Area Name], ' + district + '\n\nSubject: URGENT PUBLIC SAFETY COMPLAINT: Malfunctioning Streetlights, Total Darkness, and Recurring Crime / Accidents at [Insert Road / Colony Name], ' + district + '\n\nRespected Sir/Madam,\n\n1. I am writing on behalf of the residents of [Insert Colony / Sector / Street Name], ' + district + '.\n\n2. For the last [Insert Duration, e.g., 2 months], over [Insert Number] streetlights along [Insert Stretch Name] have been completely non-functional. The entire 1-kilometer stretch is submerged in pitch darkness every night.\n\n3. GRAVE HAZARDS OCCURRING ON-SITE:\nDue to zero lighting, multiple untoward incidents have occurred:\na) [Mention specific incident, e.g., Two vehicular accidents and a bike-borne snatching on Date].\nb) Pedestrians, elderly citizens, and women feel extremely unsafe traversing this stretch after 7:00 PM.\n\n4. STATUTORY MANDATE:\nUnder the State Municipal Act and Article 21 of the Constitution of India, the Municipal Corporation is legally mandated to maintain functional street lighting for public safety.\n\n5. PRAYER:\nWe urgently request your office to:\na) Dispatch an electrical repair team to restore illumination on all faulty poles within 48 hours.\nb) The Police SHO is requested to deploy regular PCR patrolling on this stretch during night hours.\n\nYours sincerely,\n\n[Applicant Name / RWA President]\n[Address]\n[Contact Number]\nDate: ' + today + '\nLocation: ' + district + ', ' + state,
      disclaimer: "This analysis is intended for informational and civic guidance purposes only. It does not constitute professional legal advice. Please verify legal information and consult a qualified professional where necessary."
    };
  }

  // 3. Corruption / Bribe / Extortion / Demanding Money
  if (/\b(bribe|corruption|demanded\s*money|ghoos|commission|extortion|babu|under\s*table|pay\s*cash|application\s*blocked|refused\s*without\s*money|speed\s*money)\b/i.test(textLower)) {
    return {
      summary: isHi
        ? ('नागरिक शिकायत: ' + district + ' में सरकारी अधिकारी द्वारा कार्य/आवेदन निष्पादन हेतु अवैध रिश्वत मांगने एवं भ्रष्टाचार का गंभीर मामला।')
        : ('Citizen Complaint regarding corrupt demand for bribe / unlawful gratification by a public servant in ' + district + '.'),
      categories: ["Corruption", "Government Services", "Police Misconduct", "Other"],
      severity: "Critical",
      keyConcerns: [
        "Unlawful demand of illegal gratification by a public servant to perform statutory duty",
        "Willful delay and harassment to coerce citizen into paying bribe",
        "Cognizable offense under the Prevention of Corruption Act, 1988 (Amended 2018)",
        "Violation of citizen's right to transparent, time-bound public delivery"
      ],
      rightsAndLaws: [
        {
          lawOrArticle: "Section 7, Prevention of Corruption Act, 1988 (Amended 2018)",
          provision: "Offence relating to public servant being bribed",
          explanation: "Obtaining or attempting to obtain undue advantage with intent to improperly perform a public duty carries mandatory imprisonment of 3 to 7 years plus fine."
        },
        {
          lawOrArticle: "Section 7A, Prevention of Corruption Act, 1988",
          provision: "Taking undue advantage to influence public servant by corrupt means",
          explanation: "Punishes middlemen, agents, and accomplices demanding money on behalf of officers."
        },
        {
          lawOrArticle: "Section 13(1)(a) & (b), Prevention of Corruption Act",
          provision: "Criminal Misconduct by Public Servant",
          explanation: "Habitually accepting bribes or illicit enrichment constitutes serious criminal misconduct."
        },
        {
          lawOrArticle: "Central Vigilance Commission (CVC) & State Right to Public Services Act",
          provision: "Time-Bound Service Delivery Guarantee",
          explanation: "Mandates deemed approval or penalty on officers failing to clear citizen applications within statutory time limits."
        }
      ],
      responsibleAuthorities: [
        {
          name: 'State Anti-Corruption Bureau (ACB) / Vigilance Department (' + state + ')',
          department: "Trap & Investigation Wing",
          portalOrContact: 'Toll-Free Anti-Corruption Helpline: 1064 / 1800-180-1515 / ' + (juris.cmHelpline || '1076'),
          role: "Laying lawful traps, catching corrupt public servants red-handed, and filing charge sheets under PC Act"
        },
        {
          name: 'Central Vigilance Commission (CVC) / Lokayukta (' + state + ')',
          department: "Public Integrity & Whistleblower Cell",
          portalOrContact: "portal.cvc.gov.in / Lokayukta Office",
          role: "Statutory ombudsman for inquiring into corruption complaints against government officers"
        },
        {
          name: 'District Magistrate / Head of Department (HOD)',
          department: "Administrative Discipline & Vigilance Section",
          portalOrContact: 'DM Collectorate, ' + district,
          role: "Departmental suspension, charge-sheeting, and transfer of the accused public servant"
        }
      ],
      recommendedActions: [
        {
          step: 1,
          title: "DO NOT Pay the Bribe & Secure Documentary Proof of Application",
          description: "Keep certified copies of your original application, acknowledgment receipt, fee payment, and statutory processing timeline."
        },
        {
          step: 2,
          title: "Document All Demand Details (Date, Time, Location, Demand Amount)",
          description: "Record exact words, room/cabin number, name, and designation of the officer demanding illegal gratification."
        },
        {
          step: 3,
          title: "Contact State Anti-Corruption Bureau (ACB) Helpline 1064 for a Lawful Trap",
          description: "ACB conducts confidential chemical trap operations where phenolphthalein-powdered notes are used to catch the officer in the act."
        },
        {
          step: 4,
          title: "File Whistleblower Complaint with CVC / State Lokayukta & Right to Services Commission",
          description: "Submit a formal affidavit of corrupt demand to the Lokayukta requesting departmental suspension and file clearance."
        }
      ],
      evidenceChecklist: [
        {
          item: "Original Application Receipt & Ack Number",
          whyNeeded: "Proves that a legitimate, fully compliant application was officially pending with the officer.",
          tip: "Keep digital and physical Xerox copies."
        },
        {
          item: "Audio/Video Recording of Bribe Demand (if recorded safely)",
          whyNeeded: "Corroborative electronic evidence admissible under Section 63 BSA / Sec 65B Indian Evidence Act.",
          tip: "Do not edit or alter original recording files; retain original device."
        },
        {
          item: "Call Records / WhatsApp / SMS demanding speed money",
          whyNeeded: "Establishes electronic communication trail of extortion.",
          tip: "Export chat backup with timestamp headers."
        },
        {
          item: "Citizen Charter / Right to Services Timetable",
          whyNeeded: "Proves that the application has been deliberately delayed beyond the statutory time ceiling.",
          tip: "Download the service charter from the department website."
        }
      ],
      urgencyAlert: "⚠️ Criminal Offense Alert: Paying a bribe is also punishable under Section 8 of the PC Act unless reported within 7 days. Immediately contact Anti-Corruption Bureau (1064) before handing over any money.",
      complaintDraft: 'To,\nThe Director General of Police / Superintendent of Police,\nAnti-Corruption Bureau (ACB) / Vigilance Department,\n' + state + '\n\nCopy to: The District Magistrate (DM), Collectorate, ' + district + '\n\nSubject: CONFIDENTIAL CRIMINAL COMPLAINT: Demand of Illegal Gratification (Bribe) of ₹[Insert Amount] by [Insert Officer Name/Designation] under Section 7 of Prevention of Corruption Act, 1988\n\nRespected Sir,\n\n1. I, [Insert Your Full Name], resident of [Insert Address], ' + district + ', am a law-abiding citizen who submitted a legitimate application for [Insert Purpose, e.g., Land Mutation / Trade License / Caste Certificate / Property Approval] on [Insert Application Date] vide Application Reference No: [Insert Number].\n\n2. DETAILS OF CORRUPT DEMAND:\nOn [Insert Date and Approximate Time], when I approached [Insert Officer Name, Designation, and Office Room/Dept], the said public servant explicitly refused to process my file and demanded an unlawful cash bribe of ₹[Insert Amount] as \'speed money\' to clear the statutory approval.\n\n3. All prerequisite documents and government fees have already been fully deposited by me. The official delay is purely artificial and designed to extort illegal gratification.\n\n4. STATUTORY VIOLATION:\nThe actions of the officer constitute a serious cognizable crime under Section 7, 7A, and 13 of the Prevention of Corruption Act, 1988 (Amended 2018).\n\n5. PRAYER:\nI hereby express my full willingness to assist the Anti-Corruption Bureau in conducting a lawful trap / anti-corruption investigation to apprehend the corrupt officer. I pray that:\na) Criminal proceedings under the PC Act be initiated immediately.\nb) My pending application be directed to be cleared without delay by an alternate nodal officer.\n\nYours faithfully,\n\n[Applicant Name]\n[Address]\n[Phone & Email]\nDate: ' + today + '\nLocation: ' + district + ', ' + state,
      disclaimer: "This analysis is intended for informational and civic guidance purposes only. It does not constitute professional legal advice. Please verify legal information and consult a qualified professional where necessary."
    };
  }

  // 4. Landlord / Tenant / Disconnecting Power / Illegal Eviction
  if (/\b(landlord|tenant|tenancy|disconnect(ed)?\s*(electricity|power|water)|thrown?\s*out|lockout|evict(ion)?|security\s*deposit|rent\s*agreement|harass(ing)?\s*tenant)\b/i.test(textLower)) {
    return {
      summary: isHi
        ? ('नागरिक शिकायत: ' + district + ' में मकान मालिक द्वारा बिना नोटिस बिजली-पानी काटने एवं गैर-कानूनी बेदखली की धमकी का मामला।')
        : ('Citizen Complaint regarding unlawful disconnection of essential electricity/water services and illegal eviction threats by landlord in ' + district + '.'),
      categories: ["Housing", "Public Safety", "Consumer Rights", "Other"],
      severity: "High",
      keyConcerns: [
        "Unlawful severance of essential public utility services (electricity and water)",
        "Threat of forceful extra-judicial physical eviction without due process of law",
        "Violation of Model Tenancy Act provisions and constitutional tenancy protections",
        "Criminal intimidation and wrongful restraint by landlord"
      ],
      rightsAndLaws: [
        {
          lawOrArticle: "Model Tenancy Act, 2021 & State Rent Control Act",
          provision: "Strict Prohibition on Disconnection of Essential Services",
          explanation: "Landlord has ZERO right to withhold or disconnect essential supplies (water, electricity, passage) even during rental disputes. Rent Authority can impose heavy compensation."
        },
        {
          lawOrArticle: "Section 56, Electricity Act 2003",
          provision: "Lawful supply of electricity without third-party interference",
          explanation: "Only the licensed DISCOM can disconnect power after statutory 15 days written notice on non-payment grounds."
        },
        {
          lawOrArticle: "Section 351 & 126, Bharatiya Nyaya Sanhita (BNS) / Sec 506 & 341 IPC",
          provision: "Criminal Intimidation & Wrongful Restraint",
          explanation: "Threatening bodily harm or locking out a tenant without a competent court decree is a cognizable criminal offense."
        },
        {
          lawOrArticle: "Section 6, Specific Relief Act 1963",
          provision: "Summary relief against illegal dispossession",
          explanation: "A person dispossessed without their consent of immovable property otherwise than in due course of law may recover possession through court order."
        }
      ],
      responsibleAuthorities: [
        {
          name: 'Rent Authority / Rent Court (SDM / Civil Judge)',
          department: "Tenancy Dispute Redressal Tribunal",
          portalOrContact: 'SDM Court / Rent Controller Office, ' + district,
          role: "Issuing immediate mandatory injunction for restoration of electricity/water and restraining illegal eviction"
        },
        {
          name: 'Local Police Station (SHO) / Emergency 112',
          department: "Law & Order Protection",
          portalOrContact: "Emergency: 112 / Local Police Station",
          role: "Preventing physical lockout, breach of peace, and recording Non-Cognizable/Cognizable crime report"
        },
        {
          name: 'District Legal Services Authority (DLSA)',
          department: "Free Legal Aid Cell",
          portalOrContact: 'DLSA District Court Complex, ' + district + ' / Helpline: 14468',
          role: "Providing free advocate representation under Section 12 Legal Services Authorities Act"
        }
      ],
      recommendedActions: [
        {
          step: 1,
          title: "Immediately Dial 112 if Threatened with Physical Force or Lockout",
          description: "Have the PCR van arrive on-site to create an official police dispatch log proving your peaceful possession."
        },
        {
          step: 2,
          title: "Serve Formal Legal Notice demanding Immediate Power/Water Restoration",
          description: "Deliver the statutory notice below warning the landlord of criminal and rent tribunal consequences."
        },
        {
          step: 3,
          title: "File Urgent Application before Rent Authority (SDM Court)",
          description: "Apply for interim restoration of essential services under the Rent Control / Model Tenancy Act."
        },
        {
          step: 4,
          title: "Preserve All Rent Payment Receipts and Bank Transfer Statements",
          description: "Keep proof that monthly rent and maintenance dues have been paid regularly."
        }
      ],
      evidenceChecklist: [
        {
          item: "Registered/Notarized Rent Agreement Copy",
          whyNeeded: "Establishes lawful tenancy, agreed terms, and possession rights.",
          tip: "Keep digital copy on Google Drive / WhatsApp."
        },
        {
          item: "Bank Statements / UPI Receipts for Rent Payments",
          whyNeeded: "Demonstrates that tenant is not in willful rental default.",
          tip: "Highlight transaction IDs."
        },
        {
          item: "Photos / Videos of Meter Box & Disconnected Wires",
          whyNeeded: "Proves deliberate tampering and intentional disconnection of power by landlord.",
          tip: "Record a continuous video showing dark switches and severed fuse."
        },
        {
          item: "Audio Recordings / WhatsApp Chats of Threats / Extortion",
          whyNeeded: "Substantiates criminal intimidation charges under Section 351 BNS.",
          tip: "Take screenshots showing phone numbers."
        }
      ],
      urgencyAlert: "⚠️ Essential Service Deprivation: Disconnecting electricity/water is a human rights violation. The landlord has no legal authority to forcefully evict without a formal court decree.",
      complaintDraft: 'To,\nThe Rent Authority / Sub-Divisional Magistrate (SDM),\n' + district + ', ' + state + '\n\nCopy to: The Station House Officer (SHO), Police Station [Insert Area Name], ' + district + '\n\nSubject: URGENT APPLICATION: Illegal Severance of Essential Electricity/Water Supply & Threats of Extra-Judicial Eviction by Landlord [Insert Landlord Name]\n\nRespected Sir/Madam,\n\n1. I am a lawful tenant currently residing at [Insert Rented Property Address], ' + district + ', pursuant to a Tenancy Agreement dated [Insert Agreement Date], paying a monthly rent of ₹[Insert Amount].\n\n2. GRIEVANCE & ILLEGAL ACTS:\nOn [Insert Date], the Landlord, [Insert Landlord Name], wrongfully and maliciously disconnected my electricity and water supply in total contravention of the law, and has issued verbal threats to forcefully throw my belongings out without any statutory notice or court order.\n\n3. STATUTORY PROTECTION:\nUnder Section 20/21 of the Model Tenancy Act and established Supreme Court precedents, a landlord is strictly barred from withholding essential services under any circumstance. Such coercive acts constitute wrongful restraint and criminal intimidation under Sections 126 and 351 of the Bharatiya Nyaya Sanhita, 2023.\n\n4. PRAYER:\nI urgently pray that your office may be pleased to:\na) Issue an immediate interim order directing the Landlord to restore the electricity and water connections immediately.\nb) Restrain the Landlord and their agents from causing any physical disturbance or unlawful dispossession without due process of law.\n\nYours faithfully,\n\n[Tenant Name]\n[Address]\n[Mobile Number]\nDate: ' + today + '\nLocation: ' + district + ', ' + state,
      disclaimer: "This analysis is intended for informational and civic guidance purposes only. It does not constitute professional legal advice. Please verify legal information and consult a qualified professional where necessary."
    };
  }

  // General Dynamic Universal Fallback for any other civic complaint
  return {
    summary: isHi
      ? ('नागरिक शिकायत विश्लेषण: ' + district + ' में प्रस्तुत नागरिक एवं प्रशासनिक समस्या का विधिक मूल्यांकन।')
      : ('Civic Complaint Analysis regarding reported governance and public service deficiency in ' + district + ', ' + state + '.'),
    categories: ["Government Services", "Public Safety", "Consumer Rights", "Other"],
    severity: "Medium",
    keyConcerns: [
      "Deficiency in public service delivery and administrative delay",
      "Infringement of citizen rights guaranteed under relevant state and central statutes",
      "Need for structured evidence gathering and escalation to nodal grievance officers"
    ],
    rightsAndLaws: [
      {
        lawOrArticle: "Article 21 & 14, Constitution of India",
        provision: "Right to Life, Equality & Non-Arbitrary State Action",
        explanation: "Citizens are entitled to fair, transparent, and non-discriminatory public service from all state authorities."
      },
      {
        lawOrArticle: "Right to Information Act, 2005 (Section 6)",
        provision: "Right to obtain official inspection and records",
        explanation: "Citizens can file RTI applications to uncover reason for delay, file notings, and responsible officers."
      },
      {
        lawOrArticle: "State Right to Public Services Delivery Act",
        provision: "Time-Bound Service Guarantee",
        explanation: "Statutory mandates stipulate fixed delivery timelines with penalty on non-compliant officials."
      }
    ],
    responsibleAuthorities: [
      {
        name: 'District Magistrate (DM) / Collectorate (' + district + ')',
        department: "Public Grievance Cell",
        portalOrContact: (juris.cmHelpline || '1076') + ' / edistrict.gov.in',
        role: "Overarching administrative supervision and nodal grievance redressal"
      },
      {
        name: 'Chief Minister Citizen Portal (' + state + ')',
        department: "CM Grievance Redressal Mechanism",
        portalOrContact: 'Toll-Free Helpline: ' + (juris.cmHelpline || '1076'),
        role: "High-priority escalation to departmental secretaries"
      }
    ],
    recommendedActions: [
      {
        step: 1,
        title: "Collect and Organize All Supporting Documents & Evidence",
        description: "Maintain a chronological folder of all communications, photos, receipts, or official letters."
      },
      {
        step: 2,
        title: "Lodge Formal Online Grievance on State CM Portal",
        description: 'Register an online ticket on ' + (juris.cmHelpline || '1076') + ' portal and obtain your tracking reference ID.'
      },
      {
        step: 3,
        title: "Submit Written Notice to Designated Nodal Public Officer",
        description: "Send formal written notice via Registered Speed Post / WhatsApp legal dispatch."
      },
      {
        step: 4,
        title: "File Right to Information (RTI) Application if Unaddressed in 15 Days",
        description: "Seek daily progress report and names of officials holding the file."
      }
    ],
    evidenceChecklist: [
      {
        item: "Photographs / Screenshots / Video Proof",
        whyNeeded: "Unimpeachable factual record of the issue on the ground.",
        tip: "Ensure date, time, and location are visible."
      },
      {
        item: "Official Letters / Receipts / Application Reference Numbers",
        whyNeeded: "Proves prior submissions and administrative inaction.",
        tip: "Keep digital scanned copies."
      },
      {
        item: "Witness Details / Citizen Signatures",
        whyNeeded: "Corroborates collective public impact.",
        tip: "Collect contact numbers of affected citizens."
      }
    ],
    urgencyAlert: "",
    complaintDraft: 'To,\nThe Nodal Grievance Officer / District Magistrate,\nCollectorate, ' + district + ', ' + state + '\n\nSubject: FORMAL CIVIC COMPLAINT: [Brief Description of Issue] at ' + district + '\n\nRespected Sir/Madam,\n\n1. I am a resident and citizen residing at [Insert Your Address], ' + district + ', ' + state + '.\n\n2. STATEMENT OF FACTS:\nI am writing to formally report the following grievance:\n"' + text + '"\n\n3. PRAYER FOR RELIEF:\nIn light of the statutory rights guaranteed under the law, I respectfully request your office to:\na) Conduct an immediate ground inquiry into the matter.\nb) Direct the concerned department to take necessary corrective measures within a defined timeframe.\nc) Provide an official acknowledgment and tracking docket number for this complaint.\n\nYours faithfully,\n\n[Applicant Name]\n[Address]\n[Phone & Email]\nDate: ' + today + '\nLocation: ' + district + ', ' + state,
    disclaimer: "This analysis is intended for informational and civic guidance purposes only. It does not constitute professional legal advice. Please verify legal information and consult a qualified professional where necessary."
  };
};

/**
 * Main AI Civic Complaint Analysis Function
 */
export const analyzeCivicComplaint = async ({ rawComplaint, district = 'Lucknow', state = 'Uttar Pradesh', language = 'en', citizenInfo = {} }) => {
  if (!rawComplaint || rawComplaint.trim().length < 5) {
    throw new Error('Please enter a detailed description of the civic or legal issue (at least 5 characters).');
  }

  const cleanComplaint = rawComplaint.trim();
  const juris = resolveJurisdiction(district, state);
  const normDist = juris.district;
  const finalState = juris.state || state || 'Uttar Pradesh';

  const genAI = getGenAI();
  if (!genAI) {
    return dynamicFallbackCivicAnalysis(cleanComplaint, normDist, finalState, language);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
    const prompt = 'You are NyayaSetu AI, an expert Senior Civic & Public Grievance Analyst and Legal Specialist for Indian citizens.\nAnalyze the following citizen\'s complaint thoroughly and produce a precise, comprehensive, and structured JSON response.\n\nCITIZEN\'S COMPLAINT:\n"' + cleanComplaint + '"\n\nDISTRICT: ' + normDist + '\nSTATE: ' + finalState + '\nLANGUAGE: ' + language + '\n\nREQUIRED OUTPUT FORMAT (JSON ONLY, NO MARKDOWN, NO EXPLANATORY TEXT OUTSIDE JSON):\n{\n  "summary": "Short and clear 1-2 sentence summary of the citizen\'s complaint.",\n  "categories": ["Choose 1 to 4 relevant categories from: Public Safety, Sanitation, Corruption, Women\'s Safety, Consumer Rights, Environmental Issues, Police Misconduct, Government Services, Road and Infrastructure, Healthcare, Education, Housing, Employment, Cybercrime, Discrimination, Other"],\n  "severity": "Low | Medium | High | Critical (Use Critical for threats to life, severe corruption, violence, or sexual violence; High for severe health risks, power cuts, theft spots, or extortion; Medium for general service delays; Low for minor queries)",\n  "keyConcerns": [\n    "Key concern 1 detected from complaint",\n    "Key concern 2",\n    "Key concern 3"\n  ],\n  "rightsAndLaws": [\n    {\n      "lawOrArticle": "Exact real Indian Act, Rule, or Constitutional Article (e.g. Article 21, Prevention of Corruption Act 1988 Sec 7, Solid Waste Management Rules 2016 Rule 15, BNS 2023 Sec 351, etc.)",\n      "provision": "Name of legal provision / right",\n      "explanation": "Clear explanation of how this legal protection applies to this specific complaint"\n    }\n  ],\n  "responsibleAuthorities": [\n    {\n      "name": "Exact Department / Body Name in ' + normDist + ', ' + finalState + '",\n      "department": "Specific Division / Wing",\n      "portalOrContact": "Official Portal URL or Toll-free Helpline Number",\n      "role": "What this authority must do to resolve the complaint"\n    }\n  ],\n  "recommendedActions": [\n    {\n      "step": 1,\n      "title": "Actionable Step Title",\n      "description": "Specific guidance tailored specifically to this complaint"\n    }\n  ],\n  "evidenceChecklist": [\n    {\n      "item": "Evidence Item Name (e.g. Time-stamped Photographs, Call Recordings, Receipts, Witness signatures)",\n      "whyNeeded": "Why this evidence is critical for this specific case",\n      "tip": "Practical tip on how to capture or preserve it"\n    }\n  ],\n  "urgencyAlert": "If immediate threat to life, violence, serious injury, fire, dangerous infrastructure, sexual violence, or emergency exists, provide: \'⚠️ This situation may require immediate emergency assistance. Please contact the appropriate emergency services or local authorities immediately.\' plus specific emergency numbers (112, 1090, 1091, 1064, 181). Otherwise leave as empty string.",\n  "complaintDraft": "A formal, professionally formatted complaint letter/application ready for the citizen to copy and submit, with placeholders like [Applicant Name], [Address], [Date], [Location], [Authority Name], and citing the relevant laws.",\n  "disclaimer": "This analysis is intended for informational and civic guidance purposes only. It does not constitute professional legal advice. Please verify legal information and consult a qualified professional where necessary."\n}';

    const result = await model.generateContent(prompt);
    const textResp = result.response.text();
    const parsed = parseCleanJSON(textResp);

    if (parsed && parsed.summary && parsed.categories) {
      return parsed;
    }
    return dynamicFallbackCivicAnalysis(cleanComplaint, normDist, finalState, language);
  } catch (error) {
    console.warn('Gemini civic analysis error, using sovereign dynamic fallback:', error.message);
    return dynamicFallbackCivicAnalysis(cleanComplaint, normDist, finalState, language);
  }
};
