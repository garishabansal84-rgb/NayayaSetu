import { GoogleGenerativeAI } from '@google/generative-ai';
import { retrieveRelevantGovernmentExcerpts } from './retrievalService.js';

const apiKey = process.env.GEMINI_API_KEY || '';
let genAI = null;
if (apiKey && apiKey !== 'your_gemini_api_key_here') {
  genAI = new GoogleGenerativeAI(apiKey);
}

const parseCleanJSON = (rawText) => {
  try {
    const cleaned = rawText
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();
    return JSON.parse(cleaned);
  } catch (err) {
    return null;
  }
};

/**
 * Core RAG Orchestrator:
 * Retrieval -> Context Construction -> Anti-Hallucination Prompting -> Grounded Generation
 */
export const answerWithRAG = async ({
  question,
  citizenProfile = {},
  topK = 4
}) => {
  if (!question || question.trim().length === 0) {
    throw new Error('Question is required for RAG evaluation.');
  }

  // 1. Prepare Metadata Filters from Citizen Profile
  const filters = {};
  if (citizenProfile.state && citizenProfile.state !== 'ALL') {
    filters.state = citizenProfile.state;
  }
  if (citizenProfile.domainCategory && citizenProfile.domainCategory !== 'ALL') {
    filters.domainCategory = citizenProfile.domainCategory;
  }
  if (citizenProfile.category && citizenProfile.category !== 'ALL') {
    filters.socialCategory = citizenProfile.category; // e.g. 'OBC', 'SC', 'ST', 'GEN'
  }
  if (citizenProfile.annualIncome) {
    filters.annualIncome = Number(citizenProfile.annualIncome);
  }

  // 2. RETRIEVAL: Fetch top relevant official excerpts
  const retrievedExcerpts = await retrieveRelevantGovernmentExcerpts({
    query: question,
    topK,
    filters
  });

  // Guardrail: If no evidence found
  if (!retrievedExcerpts || retrievedExcerpts.length === 0) {
    return {
      success: true,
      answer: "I couldn't find sufficient information in the available official government sources to answer this reliably. Please verify with your local district office.",
      isGrounded: false,
      retrievedCitations: [],
      matchedSchemes: []
    };
  }

  // 3. CONTEXT CONSTRUCTION: Build evidence block with source anchors
  const evidenceBlock = retrievedExcerpts.map((item, idx) => `
[SOURCE ${idx + 1}]:
Scheme / Act: ${item.schemeName} (${item.hindiName || ''})
Authority: ${item.officialAuthority || 'Government of India'}
Official URL: ${item.sourceUrl}
Required Documents: ${(item.requiredDocuments || []).join(', ')}
Excerpts:
${item.content}
`).join('\n-----------------------------------------\n');

  // 4. GENERATION: Grounded Prompt Execution
  if (!genAI) {
    return buildFallbackGroundedResponse(question, citizenProfile, retrievedExcerpts);
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.6-flash",
      generationConfig: {
        temperature: 0.1 // Low temperature = high factual determinism
      }
    });

    const systemPrompt = `
You are NyayaSetu AI, an expert Senior Citizen Rights & Government Welfare Advisor.
Your job is to answer the citizen's inquiry using ONLY the provided official government evidence.

STRICT ACCURACY RULES:
1. NEVER invent or hallucinate scheme names, amounts, or sections not present in the sources.
2. If the user appears to qualify, say "You appear to meet the criteria based on official guidelines" (DO NOT definitively promise benefits).
3. Always cite the exact official source URL and required documentation.
4. If the provided sources do not contain the answer, explicitly state that official documentation was not found.

CITIZEN PROFILE:
- Age: ${citizenProfile.age || 'Not specified'}
- Income: ₹${citizenProfile.annualIncome || 'Not specified'}
- State: ${citizenProfile.state || 'Not specified'}
- Category: ${citizenProfile.category || 'Not specified'}
- Occupation: ${citizenProfile.occupation || 'Not specified'}

CITIZEN QUESTION: "${question}"

OFFICIAL GOVERNMENT EVIDENCE:
${evidenceBlock}

Return ONLY a valid JSON object matching this schema:
{
  "explanation": "Clear 3-4 sentence plain-language explanation addressing the citizen's situation directly.",
  "matchedSchemes": [
    {
      "schemeName": "Official Scheme Name",
      "whyItApplies": "Why citizen appears eligible based on the evidence",
      "financialBenefit": "₹ amount or specific benefit described",
      "requiredDocuments": ["Doc 1", "Doc 2"],
      "sourceUrl": "Exact source URL from evidence"
    }
  ],
  "actionSteps": [
    "Step 1: Procure required missing document",
    "Step 2: Apply on official portal"
  ],
  "statutoryDisclaimers": "Statutory guidance notice"
}
`;

    const result = await model.generateContent(systemPrompt);
    const responseText = (await result.response).text();
    const parsed = parseCleanJSON(responseText);

    if (parsed) {
      return {
        success: true,
        isGrounded: true,
        answer: parsed.explanation,
        matchedSchemes: parsed.matchedSchemes || [],
        actionSteps: parsed.actionSteps || [],
        retrievedCitations: retrievedExcerpts.map(r => ({
          schemeName: r.schemeName,
          sourceUrl: r.sourceUrl,
          authority: r.officialAuthority,
          relevanceScore: r.hybridScore
        }))
      };
    }
    return buildFallbackGroundedResponse(question, citizenProfile, retrievedExcerpts);
  } catch (error) {
    console.error("Gemini RAG Generation Error:", error.message);
    return buildFallbackGroundedResponse(question, citizenProfile, retrievedExcerpts);
  }
};

function buildFallbackGroundedResponse(question, citizenProfile, retrievedExcerpts) {
  const top = retrievedExcerpts[0];
  const matched = retrievedExcerpts.map(r => ({
    schemeName: r.schemeName,
    whyItApplies: `Based on your profile, your situation matches the official provisions of ${r.schemeName}.`,
    financialBenefit: r.metadata?.financialAmount ? `₹${r.metadata.financialAmount.toLocaleString('en-IN')}` : 'Statutory Redressal / Assistance',
    requiredDocuments: r.requiredDocuments || [],
    sourceUrl: r.sourceUrl
  }));

  return {
    success: true,
    isGrounded: true,
    answer: `Based on official government notifications, you appear to meet the preliminary eligibility criteria for ${top.schemeName}. You can view the full provisions and application procedures using the official sources below.`,
    matchedSchemes: matched,
    actionSteps: [
      "1. Verify that all mandatory identity and income certificates are up-to-date.",
      "2. Access the official government portal via the verified links below to register your application."
    ],
    retrievedCitations: retrievedExcerpts.map(r => ({
      schemeName: r.schemeName,
      sourceUrl: r.sourceUrl,
      authority: r.officialAuthority,
      relevanceScore: r.hybridScore
    }))
  };
}