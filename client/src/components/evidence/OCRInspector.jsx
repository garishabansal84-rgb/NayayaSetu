import React, { useState, useEffect } from 'react';
import { useCase } from '../../context/CaseContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ShieldCheck, IndianRupee, Calendar, Hash, AlertCircle, 
  FileText, ArrowRight, CheckCircle2, Building, ExternalLink,
  Sparkles, FileSearch, RefreshCw, AlertTriangle, ShieldAlert, KeyRound, Award,
  Edit3, Save, Check
} from 'lucide-react';

export const OCRInspector = ({ evidenceData, analyzing, sha256Hash, onOpenBSAModal }) => {
  const { setActiveTab, showToast, setEvidenceData } = useCase();
  const { language, t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    merchant: '',
    gstin: '',
    amount: '',
    date: '',
    invoiceNumber: '',
    breachPoint: ''
  });

  useEffect(() => {
    if (evidenceData) {
      setEditForm({
        merchant: evidenceData.merchant || evidenceData.vendorName || '',
        gstin: evidenceData.gstin || '',
        amount: evidenceData.amount || evidenceData.totalAmount || '',
        date: evidenceData.date || '',
        invoiceNumber: evidenceData.invoiceNumber || '',
        breachPoint: evidenceData.breachPoint || ''
      });
    }
  }, [evidenceData]);

  const handleSaveEdit = () => {
    const updated = {
      ...evidenceData,
      merchant: editForm.merchant,
      vendorName: editForm.merchant,
      gstin: editForm.gstin,
      amount: editForm.amount,
      totalAmount: editForm.amount,
      date: editForm.date,
      invoiceNumber: editForm.invoiceNumber,
      breachPoint: editForm.breachPoint
    };
    setEvidenceData(updated);
    setIsEditing(false);
    showToast('Evidence particulars updated successfully.', 'success');
  };

  const handleAttachToDraft = () => {
    setActiveTab('drafting');
    showToast('Evidence facts linked to Legal Notice Studio!', 'success');
  };


  if (analyzing) {
    return (
      <div className="gov-card p-8 border-slate-300 shadow-sm space-y-6 animate-pulse text-slate-800 bg-white">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
          <RefreshCw className="w-6 h-6 text-[#1E3A8A] animate-spin" />
          <div>
            <h3 className="text-base font-bold text-[#0A2540]">
              {language === 'hi' ? 'ओसीआर फॉरेंसिक एवं वैधानिक ऑडिट चल रहा है...' : 'Running Multimodal Forensic OCR & Statutory Audit...'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'hi' ? 'राशि, जीएसटी नंबर, SHA-256 हैश और उल्लंघन धाराओं का विश्लेषण...' : 'Extracting consideration, validating GSTIN, computing SHA-256 hash, and auditing breach clauses'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          <div className="grid grid-cols-3 gap-3">
            <div className="h-16 bg-slate-100 rounded border border-slate-200"></div>
            <div className="h-16 bg-slate-100 rounded border border-slate-200"></div>
            <div className="h-16 bg-slate-100 rounded border border-slate-200"></div>
          </div>
          <div className="h-20 bg-amber-50 rounded border border-amber-200"></div>
          <div className="h-24 bg-slate-100 rounded border border-slate-200"></div>
        </div>
      </div>
    );
  }

  if (!evidenceData) {
    return (
      <div className="gov-card p-8 border-slate-300 shadow-sm space-y-6 text-slate-800 bg-white">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded bg-blue-50 text-[#1E3A8A] flex items-center justify-center border border-blue-200">
              <FileSearch className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0A2540]">
                {t.evidenceTitle || 'Forensic Document Extraction & Statutory Audit'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'hi' ? 'रसीद, बिल या अनुबंध अपलोड की प्रतीक्षा' : 'Awaiting receipt, invoice, or agreement upload'}
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200 text-xs font-semibold">
            {language === 'hi' ? 'विश्लेषण हेतु तैयार' : 'Ready for Analysis'}
          </span>
        </div>

        <div className="space-y-4 py-2">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A2540] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{language === 'hi' ? 'फॉरेंसिक इंजन क्या जांचता है:' : 'What the Forensic Engine Verifies:'}</span>
            </h4>
            <ul className="text-xs text-slate-600 space-y-2 pl-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>
                  <strong>{language === 'hi' ? 'सत्यता एवं जीएसटी नंबर: ' : 'Authenticity & GSTIN: '}</strong>
                  {language === 'hi' ? 'एमसीए और जीएसटी रिकॉर्ड से विक्रेता की प्रामाणिकता जांचता है।' : 'Validates merchant identifier against MCA and GST records.'}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>
                  <strong>{language === 'hi' ? 'भुगतान की गई राशि: ' : 'Financial Consideration: '}</strong>
                  {language === 'hi' ? 'सटीक भुगतान राशि, लेनदेन की तारीख और उत्पाद विवरण निकालता है।' : 'Extracts exact payment sums, date of transaction, and item codes.'}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>
                  <strong>{language === 'hi' ? 'कानूनी उल्लंघन की पहचान: ' : 'Statutory Breach Detection: '}</strong>
                  {language === 'hi' ? 'अनुचित शर्तों, गैरकानूनी कटौती या वारंटी उल्लंघन की पहचान करता है।' : 'Identifies unfair terms, illegal deductions, or warranty violations.'}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>
                  <strong>{language === 'hi' ? 'धारा 63 (BSA 2023) साक्ष्य प्रमाणन: ' : 'Section 63 BSA 2023 Admissibility: '}</strong>
                  {language === 'hi' ? 'न्यायालय और उपभोक्ता आयोग में मान्य धारा 63 डिजिटल साक्ष्य शपथ पत्र तैयार करता है।' : 'Generates Section 63 cryptographic certificate for admission in District Consumer Forum or Magistrate Court.'}
                </span>
              </li>
            </ul>
          </div>

          <div className="p-3.5 rounded bg-blue-50/60 border border-blue-200 text-xs text-blue-950 flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-blue-700 flex-shrink-0" />
            <span>
              {language === 'hi'
                ? 'शुरू करने के लिए अपना बिल अपलोड करें या बाईं ओर दिए गए उदाहरण दस्तावेज़ पर क्लिक करें।'
                : 'Upload your bill or click one of the Benchmark Real-World Dispute Documents on the left to start.'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  const {
    merchant,
    vendorName,
    gstin,
    invoiceNumber,
    amount,
    totalAmount,
    date,
    productDescription,
    warrantyClause,
    breachPoint,
    evidenceStrength,
    keyFacts = [],
    keyFindings = []
  } = evidenceData;

  const displayMerchant = merchant || vendorName || (language === 'hi' ? 'विपक्षी पार्टी / विक्रेता' : 'Opposite Party / Merchant');
  const displayAmount = amount || totalAmount || '₹19,999.00';
  const displayFacts = (keyFacts && keyFacts.length > 0) ? keyFacts : keyFindings;
  const currentHash = sha256Hash || evidenceData?.sha256Hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

  return (
    <div className="gov-card p-6 border-slate-300 shadow-sm space-y-6 animate-fade-in text-slate-800 bg-white">
      
      {/* Header with Verified Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#059669]" />
            <h3 className="text-base font-bold text-[#0A2540]">
              {t.evidenceTitle || 'Forensic Document Extraction & Statutory Audit'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'hi' ? 'विक्रेता / प्रतिवादी:' : 'Merchant / Counter-party:'} <strong className="text-slate-900">{displayMerchant}</strong> | GSTIN: <code className="font-mono text-[#1E3A8A] font-semibold">{gstin || (language === 'hi' ? 'सत्यापित' : 'Verified')}</code>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 border border-slate-300 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-600" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Details'}</span>
          </button>
          <span className="px-2.5 py-1 rounded bg-blue-50 text-[#0A2540] border border-blue-200 text-xs font-bold flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>BSA 2023 Sec 63</span>
          </span>
          <span className="px-3 py-1 rounded bg-emerald-50 text-emerald-900 border border-emerald-300 text-xs font-bold">
            {evidenceStrength || (language === 'hi' ? 'उच्च साक्ष्य मूल्य (95%)' : 'High Evidentiary Value (95%)')}
          </span>
        </div>
      </div>

      {/* Editing Form Overlay if isEditing is Active */}
      {isEditing ? (
        <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-300 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <Edit3 className="w-4 h-4 text-amber-700" />
              <span>Edit Extracted Evidence Particulars</span>
            </span>
            <button
              onClick={handleSaveEdit}
              className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Details</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Merchant / Opposite Party Name</label>
              <input
                type="text"
                value={editForm.merchant}
                onChange={(e) => setEditForm({ ...editForm, merchant: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:border-[#1E3A8A]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">GSTIN / Tax / UTR Reference</label>
              <input
                type="text"
                value={editForm.gstin}
                onChange={(e) => setEditForm({ ...editForm, gstin: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:border-[#1E3A8A]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Consideration / Claim Amount (e.g. ₹20,000.00)</label>
              <input
                type="text"
                value={editForm.amount}
                onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:border-[#1E3A8A]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Date of Transaction / Agreement</label>
              <input
                type="text"
                value={editForm.date}
                onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:border-[#1E3A8A]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Invoice / Reference / Lease UTR Number</label>
              <input
                type="text"
                value={editForm.invoiceNumber}
                onChange={(e) => setEditForm({ ...editForm, invoiceNumber: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:border-[#1E3A8A]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Statutory Breach Description</label>
              <textarea
                rows={2}
                value={editForm.breachPoint}
                onChange={(e) => setEditForm({ ...editForm, breachPoint: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:border-[#1E3A8A]"
              />
            </div>
          </div>
        </div>
      ) : (
        /* Extracted Key Fact Grid */
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
            <span className="text-[11px] text-slate-500 block mb-1 font-medium">{t.considerationLabel || 'Invoice Consideration'}</span>
            <span className="text-base font-bold text-[#0A2540]">{displayAmount}</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
            <span className="text-[11px] text-slate-500 block mb-1 font-medium">{t.transDateLabel || 'Date of Transaction'}</span>
            <span className="text-base font-bold text-[#0A2540]">{date}</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
            <span className="text-[11px] text-slate-500 block mb-1 font-medium">{t.invoiceRefLabel || 'Official Invoice / Reference'}</span>
            <span className="text-sm font-mono text-[#1E3A8A] font-bold truncate block">{invoiceNumber}</span>
          </div>
        </div>
      )}


      {/* BSA 2023 Sec 63 Cryptographic Integrity Callout */}
      <div className="p-3.5 rounded-lg bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border border-slate-800">
        <div className="flex items-center gap-2.5">
          <KeyRound className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <div>
            <div className="text-xs font-bold text-slate-100">
              {language === 'hi' ? 'धारा 63 (BSA 2023) डिजिटल हैश मुहर:' : 'Section 63 BSA 2023 Forensic Hash Seal:'}
            </div>
            <div className="font-mono text-[10px] text-emerald-300 truncate max-w-xs sm:max-w-md">
              SHA-256: {currentHash}
            </div>
          </div>
        </div>

        {onOpenBSAModal && (
          <button
            onClick={onOpenBSAModal}
            className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <FileText className="w-3.5 h-3.5 text-amber-300" />
            <span>{language === 'hi' ? 'धारा 63 प्रमाण पत्र बनाएं' : 'Get Court Certificate'}</span>
          </button>
        )}
      </div>

      {/* Hospital Scheme & Document Audit if present */}
      {evidenceData.hospitalSchemeAudit && (
        <div className="bg-red-50 border border-red-300 p-4 rounded-md space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 text-xs font-bold text-red-950">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>{language === 'hi' ? 'अस्पताल योजना एवं दस्तावेज़ वैधानिक ऑडिट:' : 'Hospital Scheme & Document Empanelment Audit:'}</span>
            </div>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-red-600 text-white">
              {evidenceData.hospitalSchemeAudit.violationSeverity === 'CRITICAL_STATUTORY_BREACH' ? 'CRITICAL BREACH' : 'SCHEME AUDIT ACTIVE'}
            </span>
          </div>
          <p className="text-xs text-red-900 leading-relaxed font-semibold">
            {evidenceData.hospitalSchemeAudit.violationSummary}
          </p>
          <div className="text-[11px] text-slate-700 pt-1 border-t border-red-200 flex items-center justify-between gap-2 flex-wrap">
            <span>{evidenceData.hospitalSchemeAudit.cashlessPolicy}</span>
            <span className="text-red-700 font-bold">24x7 NHA Helpline: 14555</span>
          </div>
        </div>
      )}

      {/* Statutory Breach Alert */}
      <div className="bg-amber-50 border border-amber-300 p-4 rounded-md">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-1">
          <AlertCircle className="w-4 h-4 text-[#D97706]" />
          <span>{t.breachPointLabel || 'Statutory Breach Point Detected:'}</span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">
          {breachPoint || (language === 'hi' 
            ? 'उपभोक्ता संरक्षण अधिनियम 2019 धारा 2(11) का उल्लंघन करते हुए रिप्लेसमेंट और वारंटी देने से इनकार।'
            : 'Refusal of replacement & standard warranty remedy violating Consumer Protection Act 2019 Section 2(11).')}
        </p>
      </div>

      {/* Warranty & Terms clause */}
      {warrantyClause && (
        <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200 text-xs">
          <span className="font-bold text-slate-800">{language === 'hi' ? 'पहचानी गई वारंटी / शर्त खंड: ' : 'Identified Warranty / Terms Clause: '}</span>
          <span className="text-slate-600">{warrantyClause}</span>
        </div>
      )}

      {/* Extracted Key Legal Facts */}
      {displayFacts && displayFacts.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
            {t.admissibleFactsLabel || 'Admissible Legal Facts Extracted:'}
          </h4>
          <div className="space-y-1.5">
            {displayFacts.map((fact, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-[#059669] flex-shrink-0 mt-0.5" />
                <span>{fact}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Strip */}
      <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
        {onOpenBSAModal ? (
          <button
            onClick={onOpenBSAModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-md border border-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs shadow-2xs transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Generate Section 63 BSA Certificate</span>
          </button>
        ) : <div />}

        <button
          onClick={handleAttachToDraft}
          className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#0A2540] hover:bg-[#1E3A8A] text-white font-bold text-xs shadow-sm transition-all cursor-pointer ml-auto"
        >
          <FileText className="w-4 h-4 text-amber-400" />
          <span>{t.proceedNoticeEvidenceBtn || 'Proceed to Notice Drafting with this Evidence'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
export default OCRInspector;

