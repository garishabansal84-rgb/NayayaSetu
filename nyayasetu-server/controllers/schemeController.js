import { SCHEMES_DATABASE } from '../services/knowledgeBase.js';

export const evaluateSchemesHandler = async (req, res, next) => {
  try {
    const {
      annualIncome = 180000,
      age = 22,
      gender = 'ALL',
      category,
      socialCategory = 'OBC',
      occupation = 'Student',
      state = 'Uttar Pradesh',
      district = 'lucknow',
      existingDocuments,
      ownedDocuments = ['DOC_AADHAAR', 'DOC_BANK_PASSBOOK']
    } = req.body;

    const userCategory = category || socialCategory || 'OBC';
    const userDocs = existingDocuments || ownedDocuments || ['DOC_AADHAAR', 'DOC_BANK_PASSBOOK'];
    const incomeNum = Number(annualIncome) || 180000;
    const ageNum = Number(age) || 22;

    const normalizedExisting = userDocs.map(d => {
      const u = d.toUpperCase();
      if (!u.startsWith('DOC_')) return `DOC_${u}`;
      return u;
    });

    const evaluatedResults = [];
    let totalEligibleFinancialValue = 0;

    for (const scheme of SCHEMES_DATABASE) {
      let isEligible = true;
      const reasons = [];

      if (scheme.criteria?.maxAnnualIncome && incomeNum > scheme.criteria.maxAnnualIncome) {
        isEligible = false;
        reasons.push(`Income ₹${incomeNum.toLocaleString('en-IN')} exceeds threshold ₹${scheme.criteria.maxAnnualIncome.toLocaleString('en-IN')}`);
      }

      if (scheme.criteria?.minAge && ageNum < scheme.criteria.minAge) {
        isEligible = false;
        reasons.push(`Age ${ageNum} is below minimum required age of ${scheme.criteria.minAge}`);
      }
      if (scheme.criteria?.maxAge && ageNum > scheme.criteria.maxAge) {
        isEligible = false;
        reasons.push(`Age ${ageNum} exceeds maximum allowable age of ${scheme.criteria.maxAge}`);
      }

      if (scheme.criteria?.allowedGenders && !scheme.criteria.allowedGenders.includes('ALL') && gender !== 'ALL' && !scheme.criteria.allowedGenders.includes(gender)) {
        isEligible = false;
        reasons.push(`Scheme restricted to ${scheme.criteria.allowedGenders.join(', ')}`);
      }

      if (scheme.criteria?.allowedCategories && !scheme.criteria.allowedCategories.includes('ALL') && userCategory !== 'ALL' && !scheme.criteria.allowedCategories.includes(userCategory)) {
        isEligible = false;
        reasons.push(`Category ${userCategory} not covered`);
      }

      if (scheme.criteria?.targetOccupations && !scheme.criteria.targetOccupations.includes('ALL') && occupation !== 'ALL' && !scheme.criteria.targetOccupations.includes(occupation)) {
        isEligible = false;
        reasons.push(`Targeted for ${scheme.criteria.targetOccupations.join(', ')}`);
      }

      if (scheme.state !== 'ALL' && scheme.state.toLowerCase() !== state.toLowerCase()) {
        isEligible = false;
        reasons.push(`Restricted to residents of ${scheme.state}`);
      }

      const reqDocs = scheme.requiredDocuments || [];
      const verifiedDocs = [];
      const missingDocs = [];

      reqDocs.forEach(rd => {
        const codeUpper = rd.code.toUpperCase();
        if (normalizedExisting.includes(codeUpper) || normalizedExisting.includes(`DOC_${codeUpper}`)) {
          verifiedDocs.push(rd);
        } else {
          missingDocs.push(rd);
        }
      });

      const readinessScore = reqDocs.length > 0
        ? Math.round((verifiedDocs.length / reqDocs.length) * 100)
        : 100;

      const matchScore = isEligible ? Math.min(95, 80 + Math.round(readinessScore * 0.15)) : 55;

      if (isEligible) {
        totalEligibleFinancialValue += (scheme.financialAmount || 0);
      }

      evaluatedResults.push({
        schemeId: scheme.schemeId || scheme.code,
        schemeCode: scheme.code,
        title: scheme.title || scheme.name,
        name: scheme.name || scheme.title,
        hindiTitle: scheme.hindiTitle || scheme.name,
        category: scheme.category,
        ministry: scheme.ministry || scheme.sponsoringBody || "Government of India",
        sponsoringBody: scheme.sponsoringBody,
        state: scheme.state,
        shortDescription: scheme.shortDescription,
        benefitSummary: scheme.benefitSummary || scheme.benefitsSummary,
        benefitsSummary: scheme.benefitsSummary || scheme.benefitSummary,
        benefitAmount: scheme.benefitAmount || (scheme.financialAmount ? `₹${scheme.financialAmount.toLocaleString('en-IN')}` : null),
        financialAmount: scheme.financialAmount,
        officialApplyUrl: scheme.officialApplyUrl || scheme.officialPortalUrl || "https://myscheme.gov.in",
        helpline: scheme.helpline || "1800-11-1555",
        isEligible,
        matchScore,
        readinessScore,
        ineligibilityReasons: reasons,
        documentGap: {
          verifiedCount: verifiedDocs.length,
          missingCount: missingDocs.length,
          verifiedDocs,
          missingDocs,
          readyDocuments: verifiedDocs,
          missingDocuments: missingDocs,
          isDocumentReady: missingDocs.length === 0,
          readinessScore
        }
      });
    }

    evaluatedResults.sort((a, b) => {
      if (a.isEligible && !b.isEligible) return -1;
      if (!a.isEligible && b.isEligible) return 1;
      return (b.matchScore || 0) - (a.matchScore || 0);
    });

    const eligibleCount = evaluatedResults.filter(r => r.isEligible).length;

    res.status(200).json({
      success: true,
      eligibleCount,
      totalEvaluated: evaluatedResults.length,
      schemes: evaluatedResults,
      evaluation: {
        totalSchemesEvaluated: evaluatedResults.length,
        eligibleSchemesCount: eligibleCount,
        totalEligibleFinancialBenefit: totalEligibleFinancialValue,
        results: evaluatedResults
      }
    });
  } catch (error) {
    next(error);
  }
};

export const listAllSchemesHandler = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      count: SCHEMES_DATABASE.length,
      schemes: SCHEMES_DATABASE
    });
  } catch (error) {
    next(error);
  }
};