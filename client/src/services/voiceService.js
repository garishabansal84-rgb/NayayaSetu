/**
 * Advanced Web Speech & Vernacular Audio Engine for NyayaSetu
 * Provides resilient, continuous speech recognition across all Indian languages,
 * hardware audio preconditioning (noise suppression, gain control), and live VU level metering.
 */

export const isSpeechRecognitionSupported = () => {
  return typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition);
};

export const SUPPORTED_VOICE_LANGUAGES = [
  { code: 'en-IN', label: 'English (India)', short: 'English', native: 'English' },
  { code: 'hi-IN', label: 'हिन्दी (Hindi)', short: 'हिन्दी', native: 'हिन्दी' },
  { code: 'hinglish', label: 'Hinglish (Mix)', short: 'Hinglish', native: 'Hinglish' },
  { code: 'bn-IN', label: 'বাংলা (Bengali)', short: 'বাংলা', native: 'বাংলা' },
  { code: 'ta-IN', label: 'தமிழ் (Tamil)', short: 'தமிழ்', native: 'தமிழ்' },
  { code: 'te-IN', label: 'తెలుగు (Telugu)', short: 'తెలుగు', native: 'తెలుగు' },
  { code: 'mr-IN', label: 'मराठी (Marathi)', short: 'मराठी', native: 'मराठी' },
  { code: 'gu-IN', label: 'ગુજરાતી (Gujarati)', short: 'ગુજરાતી', native: 'ગુજરાતી' },
  { code: 'kn-IN', label: 'ಕನ್ನಡ (Kannada)', short: 'ಕನ್ನಡ', native: 'ಕನ್ನಡ' },
  { code: 'ml-IN', label: 'മലയാളം (Malayalam)', short: 'മലയാളം', native: 'മലയാളം' },
  { code: 'pa-IN', label: 'ਪੰਜਾਬੀ (Punjabi)', short: 'ਪੰਜਾਬੀ', native: 'ਪੰਜਾਬੀ' },
  { code: 'or-IN', label: 'ଓଡ଼ିଆ (Odia)', short: 'ଓଡ଼ିଆ', native: 'ଓଡ଼ିଆ' },
  { code: 'ur-IN', label: 'اردو (Urdu)', short: 'اردو', native: 'اردو' },
  { code: 'as-IN', label: 'অসমীয়া (Assamese)', short: 'অসমীয়া', native: 'অসমীয়া' },
  { code: 'sa-IN', label: 'संस्कृतम् (Sanskrit)', short: 'संस्कृत', native: 'संस्कृतम्' },
  { code: 'en-US', label: 'English (US)', short: 'English (US)', native: 'English (US)' },
  { code: 'en-GB', label: 'English (UK)', short: 'English (UK)', native: 'English (UK)' }
];

export const VERNACULAR_LANG_MAP = {
  'en': 'en-IN',
  'en-in': 'en-IN',
  'en-us': 'en-US',
  'en-gb': 'en-GB',
  'hi': 'hi-IN',
  'hi-in': 'hi-IN',
  'hinglish': 'hi-IN',
  'bn': 'bn-IN',
  'bn-in': 'bn-IN',
  'ta': 'ta-IN',
  'ta-in': 'ta-IN',
  'te': 'te-IN',
  'te-in': 'te-IN',
  'mr': 'mr-IN',
  'mr-in': 'mr-IN',
  'gu': 'gu-IN',
  'gu-in': 'gu-IN',
  'kn': 'kn-IN',
  'kn-in': 'kn-IN',
  'ml': 'ml-IN',
  'ml-in': 'ml-IN',
  'pa': 'pa-IN',
  'pa-in': 'pa-IN',
  'or': 'or-IN',
  'or-in': 'or-IN',
  'od': 'or-IN',
  'od-in': 'or-IN',
  'ur': 'ur-IN',
  'ur-in': 'ur-IN',
  'as': 'as-IN',
  'as-in': 'as-IN',
  'sa': 'sa-IN',
  'sa-in': 'sa-IN'
};

/**
 * Normalizes Indian speech transcripts: currency, numbers, and punctuation across all languages.
 */
export const normalizeVernacularTranscript = (text = '', lang = 'en') => {
  if (!text) return '';
  let cleaned = text.trim().replace(/\s+/g, ' ');

  // 1. Convert Indian currency words and amounts cleanly
  // Hindi & North Indian
  cleaned = cleaned
    .replace(/\b(?:पचास\s+हजार|पचास\s+हज़ार|50\s+हजार)(?:\s*(?:रुपये|रूपये|रुपया|रु\.?))?\b/gi, '₹50,000')
    .replace(/\b(?:उन्नीस\s+हजार\s+नौ\s+सौ\s+निन्यानवे|19999|19,999)(?:\s*(?:रुपये|रूपये|रुपया|रु\.?))?\b/gi, '₹19,999')
    .replace(/\b(?:दस\s+हजार|दस\s+हज़ार|10\s+हजार)(?:\s*(?:रुपये|रूपये|रुपया|रु\.?))?\b/gi, '₹10,000')
    .replace(/\b(?:बीस\s+हजार|बीस\s+हज़ार|20\s+हजार)(?:\s*(?:रुपये|रूपये|रुपया|रु\.?))?\b/gi, '₹20,000')
    .replace(/\b(?:तीस\s+हजार|तीस\s+हज़ार|30\s+हजार)(?:\s*(?:रुपये|रूपये|रुपया|रु\.?))?\b/gi, '₹30,000')
    .replace(/\b(?:एक\s+लाख|1\s+लाख)(?:\s*(?:रुपये|रूपये|रुपया|रु\.?))?\b/gi, '₹1,00,000')
    .replace(/\b(?:दो\s+लाख|2\s+लाख)(?:\s*(?:रुपये|रूपये|रुपया|रु\.?))?\b/gi, '₹2,00,000')
    .replace(/\b(?:पांच\s+लाख|5\s+लाख)(?:\s*(?:रुपये|रूपये|रुपया|रु\.?))?\b/gi, '₹5,00,000')
    .replace(/\b(?:रुपये|रूपये|रु\.?|रुपया)\s*(\d[\d,]*)/gi, '₹$1')
    .replace(/(\d[\d,]*)\s*(?:रुपये|रूपये|रुपया)\b/gi, '₹$1');

  // Marathi
  cleaned = cleaned
    .replace(/\b(?:पन्नास\s+हजार|50\s+हजार)(?:\s*(?:रुपये|रु\.?))?\b/gi, '₹50,000')
    .replace(/\b(?:दहा\s+हजार|10\s+हजार)(?:\s*(?:रुपये|रु\.?))?\b/gi, '₹10,000')
    .replace(/\b(?:वीस\s+हजार|20\s+हजार)(?:\s*(?:रुपये|रु\.?))?\b/gi, '₹20,000')
    .replace(/\b(?:एक\s+लाख|1\s+लाख)(?:\s*(?:रुपये|रु\.?))?\b/gi, '₹1,00,000')
    .replace(/\b(?:पाच\s+लाख|5\s+लाख)(?:\s*(?:रुपये|रु\.?))?\b/gi, '₹5,00,000')
    .replace(/\b(?:रुपये|रु\.?)\s*(\d[\d,]*)/gi, '₹$1');

  // Bengali & Assamese
  cleaned = cleaned
    .replace(/\b(?:পঞ্চাশ\s+হাজার|৫০\s+হাজার|পঞ্চাশ\s+হাজাৰ)(?:\s*(?:টাকা|ট\.|টকা))?\b/gi, '₹50,000')
    .replace(/\b(?:দশ\s+হাজার|১০\s+হাজার|দহ\s+হাজাৰ)(?:\s*(?:টাকা|ট\.|টকা))?\b/gi, '₹10,000')
    .replace(/\b(?:বিশ\s+হাজার|২০\s+হাজার|বিশ\s+হাজাৰ)(?:\s*(?:টাকা|ট\.|টকা))?\b/gi, '₹20,000')
    .replace(/\b(?:এক\s+লাখ|১\s+লাখ)(?:\s*(?:টাকা|ট\.|টকা))?\b/gi, '₹1,00,000')
    .replace(/\b(?:পাঁচ\s+লাখ|৫\s+লাখ)(?:\s*(?:টাকা|ট\.|টকা))?\b/gi, '₹5,00,000')
    .replace(/\b(?:টাকা|ট\.|টকা)\s*(\d[\d,]*)/gi, '₹$1');

  // Tamil
  cleaned = cleaned
    .replace(/\b(?:ஐம்பதாயிரம்|50\s*ஆயிரம்)(?:\s*(?:ரூபாய்|ரூ\.))?\b/gi, '₹50,000')
    .replace(/\b(?:பத்தாயிரம்|10\s*ஆயிரம்)(?:\s*(?:ரூபாய்|ரூ\.))?\b/gi, '₹10,000')
    .replace(/\b(?:இருபதாயிரம்|20\s*ஆயிரம்)(?:\s*(?:ரூபாய்|ரூ\.))?\b/gi, '₹20,000')
    .replace(/\b(?:ஒரு\s+லட்சம்|1\s*லட்சம்)(?:\s*(?:ரூபாய்|ரூ\.))?\b/gi, '₹1,00,000')
    .replace(/\b(?:ஐந்து\s+லட்சம்|5\s*லட்சம்)(?:\s*(?:ரூபாய்|ரூ\.))?\b/gi, '₹5,00,000')
    .replace(/\b(?:ரூபாய்|ரூ\.)\s*(\d[\d,]*)/gi, '₹$1');

  // Telugu
  cleaned = cleaned
    .replace(/\b(?:యాభై\s+వేలు|50\s*వేలు)(?:\s*(?:రూపాయలు|రూ\.))?\b/gi, '₹50,000')
    .replace(/\b(?:పది\s+వేలు|10\s*వేలు)(?:\s*(?:రూపాయలు|రూ\.))?\b/gi, '₹10,000')
    .replace(/\b(?:ఇరవై\s+వేలు|20\s*వేలు)(?:\s*(?:రూపాయలు|రూ\.))?\b/gi, '₹20,000')
    .replace(/\b(?:ఒక\s+లక్ష|1\s*లక్ష)(?:\s*(?:రూపాయలు|రూ\.))?\b/gi, '₹1,00,000')
    .replace(/\b(?:ఐదు\s+లక్షలు|5\s*లక్షలు)(?:\s*(?:రూపాయలు|రూ\.))?\b/gi, '₹5,00,000')
    .replace(/\b(?:రూపాయలు|రూ\.)\s*(\d[\d,]*)/gi, '₹$1');

  // Gujarati
  cleaned = cleaned
    .replace(/\b(?:પચાસ\s+હજાર|50\s+હજાર)(?:\s*(?:રૂપિયા|રૂ\.))?\b/gi, '₹50,000')
    .replace(/\b(?:દસ\s+હજાર|10\s+હજાર)(?:\s*(?:રૂપિયા|રૂ\.))?\b/gi, '₹10,000')
    .replace(/\b(?:વીસ\s+હજાર|20\s+હજાર)(?:\s*(?:રૂપિયા|રૂ\.))?\b/gi, '₹20,000')
    .replace(/\b(?:એક\s+લાખ|1\s+લાખ)(?:\s*(?:રૂપિયા|રૂ\.))?\b/gi, '₹1,00,000')
    .replace(/\b(?:પાંચ\s+લાખ|5\s+લાખ)(?:\s*(?:રૂપિયા|રૂ\.))?\b/gi, '₹5,00,000')
    .replace(/\b(?:રૂપિયા|રૂ\.)\s*(\d[\d,]*)/gi, '₹$1');

  // Kannada
  cleaned = cleaned
    .replace(/\b(?:ಐವತ್ತು\s+ಸಾವಿರ|50\s+ಸಾವಿರ)(?:\s*(?:ರೂಪಾಯಿ|ರೂ\.))?\b/gi, '₹50,000')
    .replace(/\b(?:ಹತ್ತು\s+ಸಾವಿರ|10\s+ಸಾವಿರ)(?:\s*(?:ರೂಪಾಯಿ|ರೂ\.))?\b/gi, '₹10,000')
    .replace(/\b(?:ಇಪ್ಪತ್ತು\s+ಸಾವಿರ|20\s+ಸಾವಿರ)(?:\s*(?:ರೂಪಾಯಿ|ರೂ\.))?\b/gi, '₹20,000')
    .replace(/\b(?:ಒಂದು\s+ಲಕ್ಷ|1\s+ಲಕ್ಷ)(?:\s*(?:ರೂಪಾಯಿ|ರೂ\.))?\b/gi, '₹1,00,000')
    .replace(/\b(?:ಐದು\s+ಲಕ್ಷ|5\s+ಲಕ್ಷ)(?:\s*(?:ರೂಪಾಯಿ|ರೂ\.))?\b/gi, '₹5,00,000')
    .replace(/\b(?:ರೂಪಾಯಿ|ರೂ\.)\s*(\d[\d,]*)/gi, '₹$1');

  // Malayalam
  cleaned = cleaned
    .replace(/\b(?:അമ്പതിനായിരം|50\s+ആയിരം)(?:\s*(?:രൂപ|രൂ\.))?\b/gi, '₹50,000')
    .replace(/\b(?:പതിനായിരം|10\s+ആയിരം)(?:\s*(?:രൂപ|രൂ\.))?\b/gi, '₹10,000')
    .replace(/\b(?:ഇരുപതിനായിരം|20\s+ആയിരം)(?:\s*(?:രൂപ|രൂ\.))?\b/gi, '₹20,000')
    .replace(/\b(?:ഒരു\s+ലക്ഷം|1\s+ലക്ഷം)(?:\s*(?:രൂപ|രൂ\.))?\b/gi, '₹1,00,000')
    .replace(/\b(?:അഞ്ച്\s+ലക്ഷം|5\s+ലക്ഷം)(?:\s*(?:രൂപ|രൂ\.))?\b/gi, '₹5,00,000')
    .replace(/\b(?:രൂപ|രൂ\.)\s*(\d[\d,]*)/gi, '₹$1');

  // Punjabi
  cleaned = cleaned
    .replace(/\b(?:ਪੰਜਾਹ\s+ਹਜ਼ਾਰ|50\s+ਹਜ਼ਾਰ)(?:\s*(?:ਰੁਪਏ|ਰੁ\.))?\b/gi, '₹50,000')
    .replace(/\b(?:ਦਸ\s+ਹਜ਼ਾਰ|10\s+ਹਜ਼ਾਰ)(?:\s*(?:ਰੁਪਏ|ਰੁ\.))?\b/gi, '₹10,000')
    .replace(/\b(?:ਵੀਹ\s+ਹਜ਼ਾਰ|20\s+ਹਜ਼ਾਰ)(?:\s*(?:ਰੁਪਏ|ਰੁ\.))?\b/gi, '₹20,000')
    .replace(/\b(?:ਇੱਕ\s+ਲੱਖ|1\s+ਲੱਖ)(?:\s*(?:ਰੁਪਏ|ਰੁ\.))?\b/gi, '₹1,00,000')
    .replace(/\b(?:ਪੰਜ\s+ਲੱਖ|5\s+ਲੱਖ)(?:\s*(?:ਰੁਪਏ|ਰੁ\.))?\b/gi, '₹5,00,000')
    .replace(/\b(?:ਰੁਪਏ|ਰੁ\.)\s*(\d[\d,]*)/gi, '₹$1');

  // Odia
  cleaned = cleaned
    .replace(/\b(?:ପଚାଶ\s+ହଜାର|୫୦\s+ହଜାର)(?:\s*(?:ଟଙ୍କା|ଟ\.))?\b/gi, '₹50,000')
    .replace(/\b(?:ଦଶ\s+ହଜାର|୧୦\s+ହଜାର)(?:\s*(?:ଟଙ୍କା|ଟ\.))?\b/gi, '₹10,000')
    .replace(/\b(?:କୋଡ଼ିଏ\s+ହଜାର|୨୦\s+ହଜାର)(?:\s*(?:ଟଙ୍କା|ଟ\.))?\b/gi, '₹20,000')
    .replace(/\b(?:ଏକ\s+ଲକ୍ଷ|୧\s+ଲକ୍ଷ)(?:\s*(?:ଟଙ୍କା|ଟ\.))?\b/gi, '₹1,00,000')
    .replace(/\b(?:ପାଞ୍ଚ\s+ଲକ୍ଷ|୫\s+ଲକ୍ଷ)(?:\s*(?:ଟଙ୍କା|ଟ\.))?\b/gi, '₹5,00,000')
    .replace(/\b(?:ଟଙ୍କା|ଟ\.)\s*(\d[\d,]*)/gi, '₹$1');

  // Urdu
  cleaned = cleaned
    .replace(/\b(?:پچاس\s+ہزار)(?:\s*(?:روپے|روپیہ))?\b/gi, '₹50,000')
    .replace(/\b(?:دس\s+ہزار)(?:\s*(?:روپے|روپیہ))?\b/gi, '₹10,000')
    .replace(/\b(?:بیس\s+ہزار)(?:\s*(?:روپے|روپیہ))?\b/gi, '₹20,000')
    .replace(/\b(?:ایک\s+لاکھ)(?:\s*(?:روپے|روپیہ))?\b/gi, '₹1,00,000')
    .replace(/\b(?:پانچ\s+لاکھ)(?:\s*(?:روپے|روپیہ))?\b/gi, '₹5,00,000');

  // English / Hinglish
  cleaned = cleaned
    .replace(/\b(?:fifty\s+thousand|50k|50\s*thousand)\b/gi, '₹50,000')
    .replace(/\b(?:nineteen\s+thousand\s+nine\s+hundred\s+(?:and\s+)?ninety\s+nine)\b/gi, '₹19,999')
    .replace(/\b(?:twenty\s+thousand|20k|20\s*thousand)\b/gi, '₹20,000')
    .replace(/\b(?:ten\s+thousand|10k|10\s*thousand)\b/gi, '₹10,000')
    .replace(/\b(?:one\s+lakh|1\s*lakh)\b/gi, '₹1,00,000')
    .replace(/\b(?:two\s+lakhs?|2\s*lakhs?)\b/gi, '₹2,00,000')
    .replace(/\b(?:five\s+lakhs?|5\s*lakhs?)\b/gi, '₹5,00,000')
    .replace(/\b(?:rupees|rs\.?|inr)\s*(\d[\d,]*)/gi, '₹$1')
    .replace(/(\d[\d,]*)\s*(?:rupees|rs\.?|inr)\b/gi, '₹$1');

  // Prevent duplicate currency symbols
  cleaned = cleaned.replace(/₹\s*₹+/g, '₹');

  return cleaned;
};

import { apiTranscribeAudio } from './api.js';

/**
 * Phonetic Transliteration Dictionary for Indian Vernacular Grievances
 * Ensures that even if the browser engine returns Latin/Hinglish phonetics,
 * they are automatically mapped to native Devanagari Hindi / Marathi script.
 */
const HINDI_PHONETIC_MAP = {
  'flipkart': 'फ्लिपकार्ट',
  'amazon': 'अमेज़न',
  'zomato': 'जोमैटो',
  'swiggy': 'स्विगी',
  'phone': 'फ़ोन',
  'mobile': 'मोबाइल',
  'smartphone': 'स्मार्टफोन',
  'makan': 'मकान',
  'makaan': 'मकान',
  'flat': 'फ्लैट',
  'ghar': 'घर',
  'malik': 'मालिक',
  'maalik': 'मालिक',
  'kiraya': 'किराया',
  'kirayedaar': 'किरायेदार',
  'kirayedar': 'किरायेदार',
  'security': 'सिक्योरिटी',
  'deposit': 'डिपॉजिट',
  'advance': 'अग्रिम (Advance)',
  'refund': 'रिफंड',
  'return': 'रिटर्न',
  'replace': 'रिप्लेसमेंट',
  'replacement': 'रिप्लेसमेंट',
  'damaged': 'टूटा हुआ',
  'damage': 'क्षतिग्रस्त',
  'toota': 'टूटा',
  'kharab': 'खराब',
  'defective': 'खराब / दोषपूर्ण',
  'paise': 'पैसे',
  'rupaye': 'रुपये',
  'rupees': 'रुपये',
  'amount': 'राशि',
  'bill': 'बिल',
  'invoice': 'इनवॉइस',
  'receipt': 'रसीद',
  'hospital': 'अस्पताल',
  'doctor': 'डॉक्टर',
  'ilaj': 'इलाज',
  'treatment': 'इलाज',
  'cashless': 'कैशलेस',
  'ayushman': 'आयुष्मान',
  'bharat': 'भारत',
  'tender': 'टेंडर',
  'budget': 'बजट',
  'sadak': 'सड़क',
  'road': 'सड़क',
  'thekedar': 'ठेकेदार',
  'thekedaar': 'ठेकेदार',
  'contractor': 'ठेकेदार',
  'notice': 'कानूनी नोटिस',
  'complaint': 'शिकायत',
  'shikayat': 'शिकायत',
  'police': 'पुलिस',
  'thana': 'थाना',
  'fir': 'प्राथमिकी (FIR)',
  'case': 'केस',
  'court': 'अदालत',
  'forum': 'उपभोक्ता आयोग',
  'commission': 'आयोग',
  'docket': 'डॉकेट',
  'se': 'से',
  'ne': 'ने',
  'ka': 'का',
  'ki': 'की',
  'ke': 'के',
  'ko': 'को',
  'mein': 'में',
  'me': 'में',
  'par': 'पर',
  'tha': 'था',
  'thi': 'थी',
  'the': 'थे',
  'hai': 'है',
  'hain': 'हैं',
  'nahi': 'नहीं',
  'diya': 'दिया',
  'manga': 'मांगा',
  'mangwaya': 'मंगाया',
  'nikla': 'निकला',
  'kar': 'कर',
  'karein': 'करें',
  'mana': 'मना',
  'mera': 'मेरा',
  'meri': 'मेरी',
  'mere': 'मेरे',
  'aur': 'और',
  'bhi': 'भी',
  'tak': 'तक',
  'din': 'दिन',
  'mahine': 'महीने',
  'saal': 'साल'
};

export const autoTransliterateVernacular = (text = '', targetLang = 'en') => {
  if (!text) return '';
  if (targetLang === 'en' || targetLang === 'en-US' || targetLang === 'en-GB' || targetLang === 'en-IN') return text;

  // If already in Indian Unicode script, don't overwrite
  const hasDevanagari = /[\u0900-\u097F]/.test(text);
  const hasTamil = /[\u0B80-\u0BFF]/.test(text);
  const hasBengali = /[\u0980-\u09FF]/.test(text);
  const hasTelugu = /[\u0C00-\u0C7F]/.test(text);
  const hasGujarati = /[\u0A80-\u0AFF]/.test(text);
  const hasKannada = /[\u0C80-\u0CFF]/.test(text);
  const hasMalayalam = /[\u0D00-\u0D7F]/.test(text);
  const hasGurmukhi = /[\u0A00-\u0A7F]/.test(text);
  const hasOdia = /[\u0B00-\u0B7F]/.test(text);
  const hasArabic = /[\u0600-\u06FF]/.test(text);

  if (hasDevanagari || hasTamil || hasBengali || hasTelugu || hasGujarati || hasKannada || hasMalayalam || hasGurmukhi || hasOdia || hasArabic) {
    return text;
  }

  // Transliterate Romanized words to Devanagari Hindi if target is Hindi / Hinglish / Marathi
  const cleanTarget = targetLang.toLowerCase();
  if (cleanTarget === 'hi' || cleanTarget === 'hi-in' || cleanTarget === 'hinglish' || cleanTarget === 'mr' || cleanTarget === 'mr-in') {
    return text.split(/\s+/).map(word => {
      const clean = word.toLowerCase().replace(/[^a-z0-9₹]/gi, '');
      const punct = word.replace(/[a-z0-9₹]/gi, '');
      if (HINDI_PHONETIC_MAP[clean]) {
        return HINDI_PHONETIC_MAP[clean] + punct;
      }
      return word;
    }).join(' ');
  }

  return text;
};

/**
 * Returns user-friendly localized error messages for voice input issues.
 */
export const getLocalizedVoiceErrorMessage = (errorCode = '', lang = 'en') => {
  const isHindi = lang === 'hi' || lang === 'hi-IN' || lang === 'hinglish';
  
  switch (errorCode) {
    case 'not-allowed':
    case 'service-not-allowed':
    case 'PERMISSION_DENIED':
      return isHindi
        ? 'माइक्रोफ़ोन अनुमति अस्वीकृत है। कृपया अपने ब्राउज़र के एड्रेस बार में लॉक/माइक आइकन पर क्लिक करके अनुमति चालू करें।'
        : 'Microphone access is blocked in this browser. Please enable microphone permissions in your browser URL bar / site settings.';
    case 'audio-capture':
      return isHindi
        ? 'माइक्रोफ़ोन हार्डवेयर नहीं मिला। कृपया जांचें कि आपका माइक कनेक्टेड है।'
        : 'No microphone hardware found. Please verify your microphone is plugged in and recognized by your device.';
    case 'network':
      return isHindi
        ? 'नेटवर्क की समस्या के कारण वॉयस इंजन कनेक्ट नहीं हो सका। कृपया इंटरनेट कनेक्शन जांचें।'
        : 'Speech recognition network error. Please check your internet connection and try again.';
    case 'SPEECH_NOT_SUPPORTED':
      return isHindi
        ? 'यह ब्राउज़र वेब स्पीच रिकग्निशन का समर्थन नहीं करता है। कृपया क्रोम, एज या सफारी का उपयोग करें।'
        : 'Speech recognition is not supported in this browser. Please use Chrome, Edge, Safari, or a Chromium browser.';
    default:
      return isHindi
        ? 'आवाज रिकॉर्डिंग में समस्या आई। कृपया माइक के पास बोलें या ऊपर से भाषा बदलें।'
        : 'Could not capture clear voice input. Please speak closer to the microphone or try switching the spoken language.';
  }
};

/**
 * Resilient Continuous Speech Recognition & Multimodal AI Audio Controller.
 */
export class VoiceRecognitionSession {
  constructor({ language = 'en', onResult, onEnd, onError, onVolumeChange, onStatusChange }) {
    this.requestedLang = language;
    this.targetLocale = VERNACULAR_LANG_MAP[language.toLowerCase()] || (language.includes('-') ? language : 'en-IN');
    this.onResult = onResult;
    this.onEnd = onEnd;
    this.onError = onError;
    this.onVolumeChange = onVolumeChange;
    this.onStatusChange = onStatusChange;

    this.isExplicitlyStopped = false;
    this.accumulatedFinal = '';
    this.latestLiveText = '';
    this.recognition = null;
    this.restartTimeout = null;
    this.audioStream = null;
    this.audioContext = null;
    this.analyser = null;
    this.animFrameId = null;
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  start() {
    this.isExplicitlyStopped = false;
    this.accumulatedFinal = '';
    this.latestLiveText = '';
    this.audioChunks = [];

    // 1. Initialize synchronous Web Speech API
    const SpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (SpeechRecognition) {
      this._startRecognitionEngine(SpeechRecognition);
    } else {
      console.warn('Web Speech API not supported in this environment, using audio recorder fallback.');
    }

    // 2. Start parallel MediaRecorder audio capture & VU meter
    this._startAudioRecorderAndMeter();

    return this;
  }

  _startRecognitionEngine(SpeechRecognition) {
    try {
      if (this.recognition) {
        try { this.recognition.abort(); } catch (e) {}
      }

      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.maxAlternatives = 5;
      rec.lang = this.targetLocale;

      rec.onresult = (event) => {
        let currentFinalPart = '';
        let currentInterimPart = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res && res[0] && res[0].transcript) {
            const txt = res[0].transcript;
            if (res.isFinal) {
              currentFinalPart += (currentFinalPart ? ' ' : '') + txt.trim();
            } else {
              currentInterimPart += (currentInterimPart ? ' ' : '') + txt.trim();
            }
          }
        }

        if (currentFinalPart) {
          this.accumulatedFinal = (this.accumulatedFinal ? this.accumulatedFinal + ' ' : '') + currentFinalPart;
        }

        let fullLiveTranscript = this.accumulatedFinal;
        if (currentInterimPart) {
          fullLiveTranscript = (fullLiveTranscript ? fullLiveTranscript + ' ' : '') + currentInterimPart;
        }

        if (fullLiveTranscript) {
          let normalized = normalizeVernacularTranscript(fullLiveTranscript, this.requestedLang);
          if (this.requestedLang !== 'en') {
            normalized = autoTransliterateVernacular(normalized, this.requestedLang);
          }
          this.latestLiveText = normalized;
          this.onResult && this.onResult(normalized);
        }
      };

      rec.onerror = (event) => {
        // Non-fatal speech recognition events: ignore no-speech and aborted without treating as errors
        if (event.error === 'no-speech' || event.error === 'aborted') {
          return;
        }
        
        console.warn('WebSpeech API event notice:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed' || event.error === 'audio-capture') {
          this.isExplicitlyStopped = true;
          this.onError && this.onError(event.error);
        }
      };

      rec.onend = () => {
        // Continuous session auto-restart across speech pauses & silence
        if (!this.isExplicitlyStopped) {
          clearTimeout(this.restartTimeout);
          this.restartTimeout = setTimeout(() => {
            if (!this.isExplicitlyStopped) {
              this._startRecognitionEngine(SpeechRecognition);
            }
          }, 100);
        }
      };

      rec.start();
      this.recognition = rec;
    } catch (err) {
      console.warn('WebSpeech engine start note:', err);
    }
  }

  async _startAudioRecorderAndMeter() {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      if (this.isExplicitlyStopped) {
        stream.getTracks().forEach(t => t.stop());
        return;
      }

      this.audioStream = stream;

      // Start MediaRecorder for backup multimodal audio transcription
      try {
        let mimeType = 'audio/webm';
        if (typeof MediaRecorder !== 'undefined') {
          if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
            mimeType = 'audio/webm;codecs=opus';
          } else if (MediaRecorder.isTypeSupported('audio/webm')) {
            mimeType = 'audio/webm';
          } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
            mimeType = 'audio/mp4';
          }

          this.mediaRecorder = new MediaRecorder(stream, { mimeType });
          this.mediaRecorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
              this.audioChunks.push(e.data);
            }
          };
          this.mediaRecorder.start(200); // Capture chunk every 200ms
        }
      } catch (recErr) {
        console.warn('MediaRecorder initialization note:', recErr);
      }

      // Visual VU Meter using Web Audio API
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx && this.onVolumeChange) {
        this.audioContext = new AudioCtx();
        const source = this.audioContext.createMediaStreamSource(stream);
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 64;
        source.connect(this.analyser);

        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        const checkVolume = () => {
          if (this.isExplicitlyStopped || !this.analyser) return;
          this.analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          const level = Math.min(100, Math.round((avg / 128) * 100));
          this.onVolumeChange(level);
          this.animFrameId = requestAnimationFrame(checkVolume);
        };
        this.animFrameId = requestAnimationFrame(checkVolume);
      }
    } catch (micErr) {
      console.warn('Audio capture stream error:', micErr);
      if (micErr.name === 'NotAllowedError' || micErr.name === 'PermissionDeniedError') {
        this.isExplicitlyStopped = true;
        this.onError && this.onError('not-allowed');
      }
    }
  }

  _cleanupAudio() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.audioStream) {
      this.audioStream.getTracks().forEach(t => t.stop());
      this.audioStream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
  }

  setLanguage(newLang) {
    this.requestedLang = newLang;
    this.targetLocale = VERNACULAR_LANG_MAP[newLang.toLowerCase()] || (newLang.includes('-') ? newLang : 'en-IN');
    if (this.recognition) {
      try {
        this.recognition.lang = this.targetLocale;
      } catch (e) {}
    }
  }

  async stop() {
    this.isExplicitlyStopped = true;
    clearTimeout(this.restartTimeout);

    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
      this.recognition = null;
    }

    // Safely wait for MediaRecorder to flush final audio chunk
    let audioBlob = null;
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      await new Promise((resolve) => {
        this.mediaRecorder.onstop = () => {
          if (this.audioChunks.length > 0) {
            audioBlob = new Blob(this.audioChunks, {
              type: this.mediaRecorder.mimeType || 'audio/webm'
            });
          }
          resolve();
        };
        try {
          this.mediaRecorder.requestData();
          this.mediaRecorder.stop();
        } catch (e) {
          resolve();
        }
      });
    } else if (this.audioChunks.length > 0) {
      audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
    }

    this._cleanupAudio();

    let finalResult = (this.latestLiveText || this.accumulatedFinal || '').trim();

    // If live Web Speech API returned nothing or sparse text (< 5 chars), send recorded audio to AI Transcriber
    if (finalResult.length < 5 && audioBlob && audioBlob.size > 500) {
      this.onStatusChange && this.onStatusChange('transcribing');
      try {
        const aiTranscript = await apiTranscribeAudio(audioBlob, this.requestedLang);
        if (aiTranscript && aiTranscript.trim()) {
          finalResult = aiTranscript.trim();
          this.latestLiveText = finalResult;
          this.onResult && this.onResult(finalResult);
        }
      } catch (err) {
        console.warn('AI audio transcription notice:', err);
      } finally {
        this.onStatusChange && this.onStatusChange('idle');
      }
    }

    // Apply auto-transliteration and vernacular normalization
    if (finalResult) {
      if (this.requestedLang !== 'en') {
        finalResult = autoTransliterateVernacular(finalResult, this.requestedLang);
      }
      finalResult = normalizeVernacularTranscript(finalResult, this.requestedLang);
      this.latestLiveText = finalResult;
      this.onResult && this.onResult(finalResult);
    }

    this.onEnd && this.onEnd(finalResult);
    return finalResult;
  }
}

/**
 * Creates a standalone real-time audio visualizer analyzer using AudioContext and AnalyserNode.
 * Computes 0-100% volume level to give live visual proof that mic is picking up voice.
 */
export const createAudioVisualizer = (onVolumeChange) => {
  let audioContext = null;
  let audioStream = null;
  let animFrameId = null;

  const start = async () => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return;
    }
    try {
      audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx && onVolumeChange) {
        audioContext = new AudioCtx();
        const source = audioContext.createMediaStreamSource(audioStream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const checkVolume = () => {
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          const level = Math.min(100, Math.round((avg / 128) * 100));
          onVolumeChange(level);
          animFrameId = requestAnimationFrame(checkVolume);
        };
        animFrameId = requestAnimationFrame(checkVolume);
      }
    } catch (e) {
      console.warn('Audio visualizer stream error:', e);
    }
  };

  const stop = () => {
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
    if (audioStream) {
      audioStream.getTracks().forEach(t => t.stop());
      audioStream = null;
    }
    if (audioContext && audioContext.state !== 'closed') {
      audioContext.close().catch(() => {});
      audioContext = null;
    }
  };

  return { start, stop };
};

/**
 * Functional entry point for starting speech recognition.
 */
export const startSpeechRecognition = (config) => {
  const session = new VoiceRecognitionSession(config);
  session.start();
  return session;
};

/**
 * High-accuracy Text-to-Speech (TTS) for legal explanations across all regional languages.
 */
export const speakLegalAdvice = (text, language = 'en', onEnd, onError) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;

  try {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    
    const targetTag = VERNACULAR_LANG_MAP[language?.toLowerCase()] || (language?.includes('-') ? language : 'en-IN');
    utterance.lang = targetTag;

    const voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
    if (voices && voices.length > 0) {
      const targetPrefix = targetTag.split('-')[0].toLowerCase();
      const matchingVoice = voices.find(v => v.lang.toLowerCase() === targetTag.toLowerCase())
        || voices.find(v => v.lang.toLowerCase().startsWith(targetPrefix))
        || voices.find(v => v.lang.includes('IN') || v.name.includes('India'));
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }
    }

    if (onEnd) utterance.onend = onEnd;
    if (onError) utterance.onerror = onError;

    window.speechSynthesis.speak(utterance);
    return utterance;
  } catch (err) {
    console.warn('Text-to-speech error:', err);
    if (onError) onError(err);
    return null;
  }
};

export const stopSpeech = () => {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
};
