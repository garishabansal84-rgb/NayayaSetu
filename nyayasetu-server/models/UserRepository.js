import crypto from 'crypto';

// In-Memory fallback store for high reliability
const usersStore = new Map();

// Seed initial demo citizen (Tanvi Makhija)
const seedDemoUser = () => {
  const demoUser = {
    userId: 'USR-2026-8812',
    nyayaPassId: 'NP-2026-8812-UP-IN',
    name: 'Tanvi Makhija',
    phone: '+91 98765 43210',
    email: 'citizen@nyayasetu.in',
    aadhaarMasked: 'XXXX-XXXX-4810',
    aadhaarHash: crypto.createHash('sha256').update('987654324810').digest('hex'),
    aadhaarVerified: true,
    uidaiVerificationCode: 'UIDAI-AUTH-OK-2026-IN',
    gender: 'FEMALE',
    age: 28,
    dob: '1998-05-14',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    socialCategory: 'OBC',
    occupation: 'Student',
    annualIncome: 180000,
    ownedDocuments: ['DOC_AADHAAR', 'DOC_BANK_PASSBOOK', 'DOC_INCOME'],
    issuedAt: new Date().toISOString(),
    passQrUrl: 'https://nyayasetu.gov.in/verify-pass?id=NP-2026-8812-UP-IN',
    passwordHash: crypto.createHash('sha256').update('password123').digest('hex')
  };
  usersStore.set(demoUser.nyayaPassId, demoUser);
  usersStore.set(demoUser.email, demoUser);
  usersStore.set(demoUser.phone, demoUser);
  usersStore.set(demoUser.aadhaarMasked, demoUser);
};

seedDemoUser();

export const UserRepository = {
  async findByNyayaPassId(nyayaPassId) {
    if (!nyayaPassId) return null;
    return usersStore.get(nyayaPassId.trim().toUpperCase()) || null;
  },

  async findByEmailOrPhone(identifier) {
    if (!identifier) return null;
    const clean = identifier.trim().toLowerCase();
    for (const user of usersStore.values()) {
      if (user.email.toLowerCase() === clean || user.phone.replace(/[^0-9]/g, '') === clean.replace(/[^0-9]/g, '') || user.nyayaPassId.toLowerCase() === clean) {
        return user;
      }
    }
    return null;
  },

  async findByAadhaar(aadhaar12Digit) {
    if (!aadhaar12Digit) return null;
    const hash = crypto.createHash('sha256').update(aadhaar12Digit.replace(/\s+/g, '')).digest('hex');
    const masked = 'XXXX-XXXX-' + aadhaar12Digit.slice(-4);
    for (const user of usersStore.values()) {
      if (user.aadhaarHash === hash || user.aadhaarMasked === masked) {
        return user;
      }
    }
    return null;
  },

  async create(userData) {
    const rawPassNum = Math.floor(1000 + Math.random() * 9000);
    const stateCode = (userData.state || 'IN').toUpperCase().slice(0, 2);
    const nyayaPassId = userData.nyayaPassId || ('NP-' + new Date().getFullYear() + '-' + rawPassNum + '-' + stateCode + '-IN');
    const userId = 'USR-' + new Date().getFullYear() + '-' + rawPassNum;

    const cleanAadhaar = (userData.aadhaarNumber || '999988887777').replace(/\s+/g, '');
    const aadhaarMasked = 'XXXX-XXXX-' + cleanAadhaar.slice(-4);
    const aadhaarHash = crypto.createHash('sha256').update(cleanAadhaar).digest('hex');
    const passwordHash = crypto.createHash('sha256').update(userData.password || 'password123').digest('hex');

    const newUser = {
      userId,
      nyayaPassId,
      name: userData.name || 'Citizen of India',
      phone: userData.phone || '+91 98765 43210',
      email: userData.email || ('citizen.' + rawPassNum + '@nyayasetu.in'),
      aadhaarMasked,
      aadhaarHash,
      aadhaarVerified: true,
      uidaiVerificationCode: userData.uidaiVerificationCode || ('UIDAI-AUTH-OK-' + Math.floor(100000 + Math.random() * 900000)),
      gender: userData.gender || 'FEMALE',
      age: Number(userData.age) || 28,
      dob: userData.dob || '1998-01-01',
      state: userData.state || 'Uttar Pradesh',
      district: userData.district || 'Lucknow',
      socialCategory: userData.socialCategory || 'OBC',
      occupation: userData.occupation || 'Citizen',
      annualIncome: Number(userData.annualIncome) || 180000,
      ownedDocuments: userData.ownedDocuments || ['DOC_AADHAAR', 'DOC_BANK_PASSBOOK'],
      issuedAt: new Date().toISOString(),
      passQrUrl: 'https://nyayasetu.gov.in/verify-pass?id=' + nyayaPassId,
      passwordHash
    };

    usersStore.set(nyayaPassId, newUser);
    usersStore.set(newUser.email, newUser);
    usersStore.set(newUser.phone, newUser);
    usersStore.set(newUser.aadhaarMasked, newUser);

    return newUser;
  }
};
