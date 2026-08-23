import mongoose from 'mongoose';

const SchemeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    hindiName: String,
    category: {
      type: String,
      enum: ['EDUCATION', 'HEALTH', 'AGRICULTURE', 'HOUSING', 'WOMEN_CHILD', 'PENSION', 'LABOR'],
      required: true
    },
    sponsoringBody: { type: String, enum: ['CENTRAL', 'STATE', 'JOINT'], default: 'CENTRAL' },
    state: { type: String, default: 'ALL' },
    shortDescription: String,
    benefitsSummary: String,
    financialAmount: Number,
    officialPortalUrl: String,
    criteria: {
      maxAnnualIncome: Number,
      minAge: Number,
      maxAge: Number,
      allowedGenders: [String],
      allowedCategories: [String],
      targetOccupations: [String]
    },
    requiredDocuments: [{
      code: String,
      name: String,
      procurementGuide: String,
      portalLink: String
    }]
  },
  { timestamps: true }
);

let SchemeModel;
try {
  SchemeModel = mongoose.model('Scheme', SchemeSchema);
} catch (e) {
  SchemeModel = mongoose.models.Scheme;
}

export default SchemeModel;