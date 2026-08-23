import { analyzeCivicComplaint } from '../services/civicAnalysisService.js';

// In-Memory history store for recent civic complaint analyses
const recentAnalysesStore = [];

export const analyzeCivicComplaintHandler = async (req, res, next) => {
  try {
    const { 
      complaintText, 
      district = 'Lucknow', 
      state = 'Uttar Pradesh', 
      language = 'en', 
      citizenInfo = {} 
    } = req.body;

    if (!complaintText || complaintText.trim().length < 5) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a detailed description of your civic or legal issue (at least 5 characters).'
      });
    }

    const analysis = await analyzeCivicComplaint({
      rawComplaint: complaintText,
      district,
      state,
      language,
      citizenInfo
    });

    const analysisId = 'CIVIC-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);
    const record = {
      analysisId,
      complaintText,
      district,
      state,
      language,
      analysis,
      timestamp: new Date().toISOString()
    };

    recentAnalysesStore.unshift(record);
    if (recentAnalysesStore.length > 50) {
      recentAnalysesStore.pop();
    }

    res.status(200).json({
      success: true,
      analysisId,
      timestamp: record.timestamp,
      data: analysis
    });
  } catch (error) {
    next(error);
  }
};

export const getCivicAnalysisHistoryHandler = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      count: recentAnalysesStore.length,
      history: recentAnalysesStore.slice(0, 10)
    });
  } catch (error) {
    next(error);
  }
};
