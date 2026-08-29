import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_MODELS = ["gemini-3.6-flash", "gemini-3.7-flash", "gemini-3.5-flash", "gemini-3.1-flash-lite"];

function getGenAI() {
  dotenv.config();
  const key = process.env.GEMINI_API_KEY;
  if (key) {
    return new GoogleGenerativeAI(key);
  }
  return null;
}

function parseCleanJSON(rawText) {
  if (!rawText) return null;
  let text = rawText.trim();
  text = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
  try {
    return JSON.parse(text);
  } catch (err) {
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(text.slice(firstBrace, lastBrace + 1));
      } catch (innerErr) {
        return null;
      }
    }
    return null;
  }
}

/**
 * Fallback heuristic simulator for offline and demo stability
 */
export const getFallbackOpponentSimulation = (grievanceText = '', applicableActs = []) => {
  const lower = grievanceText.toLowerCase();

  const isRent = /\b(rent|deposit|landlord|flat|apartment|tenant|painting|cleaning|lease)\b/i.test(lower);
  const isConsumer = /\b(flipkart|amazon|phone|delivery|defective|warranty|refund|seller|merchant|invoice)\b/i.test(lower);
  const isBuilder = /\b(builder|possession|rera|flat|apartment|developer|supertech|delay)\b/i.test(lower);
  const isHospital = /\b(hospital|medical|doctor|ayushman|cashless|treatment|pmjay)\b/i.test(lower);

  if (isRent) {
    return {
      opponentPersona: "Senior Legal Counsel for Property Owner & Real Estate Association",
      strategicDefensePosture: "Contractual Discretion & Customary Wear-and-Tear Offset Defense",
      settlementLikelihood: 82,
      settlementOutlook: "High Settlement Likelihood (Landlord faces 2x penalty risk under Model Tenancy Act Section 11)",
      vulnerabilities: [
        {
          weakness: "Proof of Handover Date & Key Surrender Acknowledgment",
          severity: "Medium",
          mitigation: "Include written WhatsApp/Email exit clearance record and date stamped key handover photo."
        },
        {
          weakness: "Demarcation between ordinary wear-and-tear vs actual tenant damage",
          severity: "Low",
          mitigation: "Cite Section 11(2) Model Tenancy Act mandating itemized contractor tax invoices for all deductions."
        }
      ],
      opponentCounterArguments: [
        {
          argument: "Clause 7 of Rental Agreement allows customary deduction for deep cleaning and fresh painting upon vacation.",
          proceduralTactics: "Will cite customary market practice in rental properties.",
          statutoryBasis: "Contract Act 1872 Section 73 (Damages for breach).",
          rebuttal: "Model Tenancy Act 2021 overrides customary terms; unilateral deductions without third-party contractor receipts are strictly void.",
          precedentCitation: "Nand Lal v. State of UP & Supreme Court Tenancy Mandates on Non-Refundable Security Deposits."
        },
        {
          argument: "Tenant caused minor wall scuffs and fixture discoloration requiring professional restoration.",
          proceduralTactics: "Will threaten to raise counter-claims for property refurbishment.",
          statutoryBasis: "Transfer of Property Act Section 108(m).",
          rebuttal: "Ordinary wear and tear over tenancy duration is the landlord's maintenance responsibility under Law.",
          precedentCitation: "Kailash Chand v. Rakesh Kumar (Delhi HC) — Reasonable wear and tear cannot be charged to security deposit."
        }
      ],
      tacticalShieldChecklist: [
        "Seal UPI deposit receipt with SHA-256 BSA Section 63 Digital Certificate",
        "Demand itemized contractor invoices and GSTIN bills in the pre-litigation notice",
        "Give a strict statutory 15-day cure notice before filing before Rent Authority"
      ],
      recommendedPrayerTweaks: [
        "Claim ₹20,000 principal deposit refund + 18% p.a. interest from date of vacation.",
        "Add ₹10,000 statutory damages for unlawful retention and mental harassment."
      ]
    };
  }

  if (isConsumer) {
    return {
      opponentPersona: "Corporate Litigation Head for E-Commerce Marketplace & Authorized Vendor",
      strategicDefensePosture: "Intermediary Safe Harbor & Third-Party Manufacturer Warranty Delegation",
      settlementLikelihood: 76,
      settlementOutlook: "Favorable Pre-Litigation Settlement (High corporate risk of Class-Action Consumer Commission scrutiny)",
      vulnerabilities: [
        {
          weakness: "Proof of unboxing condition within 24 hours of delivery",
          severity: "Medium",
          mitigation: "Attach timestamped unboxing photos / delivery boy delivery sheet notes."
        },
        {
          weakness: "Proof of direct replacement request within platform return window",
          severity: "Low",
          mitigation: "Seal customer support ticket logs with SHA-256 cryptographic hash under BSA 2023."
        }
      ],
      opponentCounterArguments: [
        {
          argument: "Marketplace is only an intermediary under Section 79 IT Act; liability rests solely with merchant/brand.",
          proceduralTactics: "Will file application to delete marketplace name from dispute array.",
          statutoryBasis: "Information Technology Act 2000 Section 79 (Safe Harbor).",
          rebuttal: "Consumer Protection (E-Commerce) Rules 2020 make marketplace jointly liable for counterfeit, damaged, or unfair return refusals.",
          precedentCitation: "Christian Louboutin SAS v. Nakul Bajaj (Delhi HC) & CPA 2019 Section 2(47)."
        },
        {
          argument: "Customer accepted delivery without recording immediate transit damage on OTP confirmation.",
          proceduralTactics: "Will argue damage occurred post-delivery due to customer mishandling.",
          statutoryBasis: "Sale of Goods Act Section 41 (Right of buyer to examine goods).",
          rebuttal: "Latent defects and internal damage cannot be assessed upon OTP gate delivery; statutory 7-day trial period applies.",
          precedentCitation: "Amazon Seller Services v. Amway India (2020) & NCDRC Consumer Rulings on Defective Electronics."
        }
      ],
      tacticalShieldChecklist: [
        "Include GSTIN Tax Invoice and UPI Transaction ID in Annexure-A",
        "Attach Section 63 BSA Digital Certificate for WhatsApp/Chat support logs",
        "Specify formal 15-day cure window prior to E-Daakhil filing"
      ],
      recommendedPrayerTweaks: [
        "Demand 100% full invoice consideration refund + ₹15,000 litigation expense.",
        "Demand compensation for unfair trade practice under Section 2(47) Consumer Protection Act."
      ]
    };
  }

  // General BNS / Civil / Civic dispute fallback
  return {
    opponentPersona: "Opposing Legal Counsel & Risk Defense Team",
    strategicDefensePosture: "Preliminary Objections on Forum Jurisdiction & Procedural Default",
    settlementLikelihood: 74,
    settlementOutlook: "Moderate-to-High Pre-Litigation Settlement Potential upon serving formal notice",
    vulnerabilities: [
      {
        weakness: "Chronological documentation of prior verbal representations",
        severity: "Medium",
        mitigation: "Itemize exact dates, times, and officers/representatives contacted in Statement of Facts."
      },
      {
        weakness: "Authenticity of digital communication screenshots",
        severity: "Low",
        mitigation: "Affix Section 63 Bharatiya Sakshya Adhiniyam (BSA 2023) electronic certificate."
      }
    ],
    opponentCounterArguments: [
      {
        argument: "The dispute involves complex disputed questions of fact not maintainable under summary consumer/grievance jurisdiction.",
        proceduralTactics: "Will attempt to relegate complainant to civil court trial to cause delay.",
        statutoryBasis: "Code of Civil Procedure Section 9.",
        rebuttal: "Summary jurisdiction under CPA 2019 and BNSS 2023 explicitly covers deficiency in service and statutory nuisance without trial delay.",
        precedentCitation: "CCI Chambers Coop Housing Society v. Development Credit Bank (Supreme Court of India)."
      },
      {
        argument: "Statutory limitation period lapsed or claim is premature without departmental appeal exhaustion.",
        proceduralTactics: "Will file preliminary limitation objections.",
        statutoryBasis: "Limitation Act 1963 Section 3.",
        rebuttal: "Cause of action is continuing, and pre-litigation notice is statutory prerequisite fulfilling all conditions precedent.",
        precedentCitation: "Laxmi Engineering Works v. P.S.G. Industrial Institute (Supreme Court)."
      }
    ],
    tacticalShieldChecklist: [
      "Itemize financial consideration with exact rupee figures and transaction dates",
      "Attach verified digital hash certificates for all electronic exhibits",
      "Address notice to registered corporate headquarters / principal officer"
    ],
    recommendedPrayerTweaks: [
      "Demand immediate statutory remediation within 15 calendar days.",
      "Reserve right to initiate criminal proceedings under Bharatiya Nyaya Sanhita (BNS 2023)."
    ]
  };
};

/**
 * Executes live AI Opponent Wargaming Simulation using Gemini 3.6/3.7 Flash with fallback
 */
export const simulateOpponentDefense = async ({
  grievanceText = '',
  applicableActs = [],
  evidenceData = null,
  district = 'Lucknow',
  state = 'Uttar Pradesh',
  language = 'en'
}) => {
  const genAI = getGenAI();

  if (!genAI || !grievanceText.trim()) {
    return getFallbackOpponentSimulation(grievanceText, applicableActs);
  }

  const actsList = (applicableActs || []).map(a => `${a.act || ''} ${a.section || ''}`).join(', ');

  const prompt = `
You are the Chief Corporate Defense Counsel and Adversarial Red-Team Legal Strategist.
Analyze the following citizen's grievance and claim from the perspective of the OPPOSING PARTY (e.g. Corporate Merchant, Builder, Landlord, Hospital, or Authority).

Citizen Grievance: "${grievanceText}"
Jurisdiction: ${district}, ${state}
Invoked Statutes: ${actsList || 'Indian Law, BNS 2023, Consumer Protection Act 2019, Model Tenancy Act'}
Evidence Extracted: ${evidenceData ? JSON.stringify(evidenceData) : 'Basic payment / transaction records'}
Language: ${language}

YOUR MISSION:
Stress-test this claim. Predict the exact legal loopholes, counter-arguments, procedural defenses, and contractual clauses the opponent's senior advocates will use against this citizen, and provide the exact Supreme Court / statutory rebuttals to defeat those counter-arguments.

Return ONLY a valid JSON object matching this structure:
{
  "opponentPersona": "e.g. Senior Corporate Defense Advocate for Flipkart / Landlord Legal Team",
  "strategicDefensePosture": "e.g. Intermediary Safe Harbor & Contractual Discretion Defense",
  "settlementLikelihood": 80,
  "settlementOutlook": "e.g. High Settlement Likelihood (Opponent faces severe regulatory penalty under CPA Section 35 / BNS)",
  "vulnerabilities": [
    {
      "weakness": "Description of loophole in citizen's case",
      "severity": "High | Medium | Low",
      "mitigation": "Actionable advice on how citizen can fix this loophole before serving notice"
    }
  ],
  "opponentCounterArguments": [
    {
      "argument": "The exact defense argument the opponent will make",
      "proceduralTactics": "Procedural tactics (e.g. Filing arbitration objection or blaming manufacturer)",
      "statutoryBasis": "Statute/law they will cite (e.g. Section 79 IT Act / Section 73 Contract Act)",
      "rebuttal": "How the citizen can completely demolish this argument",
      "precedentCitation": "Relevant landmark Supreme Court or High Court citation (e.g. Emaar MGF / Christian Louboutin)"
    }
  ],
  "tacticalShieldChecklist": [
    "Checklist item 1 for citizen",
    "Checklist item 2 for citizen",
    "Checklist item 3 for citizen"
  ],
  "recommendedPrayerTweaks": [
    "Specific itemized demand adjustment 1",
    "Specific itemized demand adjustment 2"
  ]
}
`;

  for (const modelName of GEMINI_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const parsed = parseCleanJSON((await result.response).text());
      if (parsed && parsed.opponentPersona && parsed.opponentCounterArguments) {
        return parsed;
      }
    } catch (err) {
      console.warn(`Opponent simulator model ${modelName} failed:`, err.message);
    }
  }

  return getFallbackOpponentSimulation(grievanceText, applicableActs);
};
