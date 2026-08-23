import { JURISDICTION_DIRECTORY, STATE_DIRECTORY, resolveJurisdiction } from '../services/knowledgeBase.js';

export const lookupJurisdictionHandler = async (req, res, next) => {
  try {
    const { district, city, state } = req.query;
    const targetDistrict = (district || city || 'Lucknow').trim();
    const targetState = (state || '').trim();

    const data = resolveJurisdiction(targetDistrict, targetState);

    res.status(200).json({
      success: true,
      matchedDistrict: data.district,
      matchedState: data.state,
      jurisdiction: data
    });
  } catch (error) {
    next(error);
  }
};

export const getStatesListHandler = async (req, res, next) => {
  try {
    const states = Object.keys(STATE_DIRECTORY).map(stateName => ({
      name: stateName,
      shortCode: STATE_DIRECTORY[stateName].shortCode,
      districts: STATE_DIRECTORY[stateName].districts,
      rtiPortal: STATE_DIRECTORY[stateName].rtiPortal,
      slsaPortal: STATE_DIRECTORY[stateName].slsaPortal,
      cmHelpline: STATE_DIRECTORY[stateName].cmHelpline
    }));

    res.status(200).json({
      success: true,
      count: states.length,
      states
    });
  } catch (error) {
    next(error);
  }
};