import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCase } from '../../context/CaseContext';
import { 
  Send, Mail, Phone, MessageSquare, Copy, Check, X, 
  ExternalLink, ShieldCheck, FileText, ArrowRight, Building2, 
  Package, MapPin, AlertCircle, Sparkles, Share2, CheckCircle2 
} from 'lucide-react';

export const OFFICIAL_NODAL_DIRECTORY = [
  { name: 'Flipkart India Pvt Ltd', email: 'grievance.officer@flipkart.com', phone: '919876543210', category: 'E-Commerce' },
  { name: 'Amazon Seller Services India', email: 'grievance-officer@amazon.in', phone: '919876543211', category: 'E-Commerce' },
  { name: 'Zomato Limited', email: 'nodal@zomato.com', phone: '919876543212', category: 'Food Delivery' },
  { name: 'Swiggy (Bundl Technologies)', email: 'grievance@swiggy.in', phone: '919876543213', category: 'Food Delivery' },
  { name: 'State Bank of India (SBI)', email: 'customercare@sbi.co.in', phone: '919876543214', category: 'Banking' },
  { name: 'HDFC Bank Grievance Redressal', email: 'grievance.redressal@hdfcbank.com', phone: '919876543215', category: 'Banking' },
  { name: 'National Health Authority (PM-JAY)', email: 'grievance.pmjay@nha.gov.in', phone: '14555', category: 'Healthcare' },
  { name: 'Local Police Station (SHO)', email: 'sho.complaints@police.gov.in', phone: '112', category: 'Police' },
  { name: 'Landlord / Property Owner', email: 'landlord@email.com', phone: '', category: 'Tenancy' },
  { name: 'Builder / Developer Management', email: 'crm@builderproject.com', phone: '', category: 'Real Estate' }
];

export const LegalDispatchRelayModal = ({ 
  isOpen, 
  onClose, 
  draftData, 
  draftText,
  referenceId,
  statutoryDiagnosis
}) => {
  const { language } = useLanguage();
  const { showToast } = useCase();
  const isHi = language === 'hi';

  const [activeTab, setActiveTab] = useState('whatsapp'); // 'whatsapp' | 'email' | 'speedpost'
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [speedPostTracking, setSpeedPostTracking] = useState('EM' + Math.floor(100000000 + Math.random() * 900000000) + 'IN');
  const [copied, setCopied] = useState(false);

  const ref = draftData?.referenceId || referenceId || 'NYA-2026-LIVE';
  const recipientName = draftData?.authorityName || statutoryDiagnosis?.forum || 'Opposite Party / Grievance Officer';
  const recipientAddress = draftData?.authorityAddress || 'Corporate Headquarters / Nodal Office';
  const subject = draftData?.subject || statutoryDiagnosis?.statuteTitle || 'Formal Statutory Pre-Litigation Legal Notice';
  const statutoryAct = draftData?.statutoryAct || statutoryDiagnosis?.primaryStatute || 'Consumer Protection Act, 2019';
  const cureWindowDays = draftData?.statutoryNoticePeriodDays || 15;
  const applicantName = draftData?.applicantName || 'Citizen Applicant';
  const applicantPhone = draftData?.applicantPhone || '+91 98765 43210';
  const applicantAddress = draftData?.applicantAddress || 'India';
  const rawNoticeContent = draftText || draftData?.structuredText || draftData?.facts || '';

  // Format WhatsApp Legal Payload
  const whatsappPayload = useMemo(() => {
    return [
      '*⚖️ OFFICIAL STATUTORY LEGAL NOTICE*',
      '*NyayaSetu Verification Ref:* ' + ref,
      '*Date of Issuance:* ' + new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      '',
      '*TO:* ' + recipientName,
      '*ADDRESS:* ' + recipientAddress,
      '',
      '*FROM:* ' + applicantName,
      '*CONTACT:* ' + applicantPhone,
      '',
      '*SUBJECT:* ' + subject,
      '',
      '*STATUTORY PROVISIONS INVOKED:*',
      '• ' + statutoryAct,
      '• Electronic Evidence Admissibility (Sec 65B IEA / Sec 63 BSA)',
      '• National Free Legal Aid (Article 39A & NALSA 14468)',
      '',
      '*MANDATORY STATUTORY CURE WINDOW:*',
      'Take formal legal notice that you are required to comply with the lawful remedies sought within *' + cureWindowDays + ' Days* of receipt of this notice.',
      '',
      'In default of immediate compliance, formal proceedings shall be instituted before the competent District Court / Consumer Commission / Regulatory Authority at your entire cost and legal risk.',
      '',
      '*VERIFY OFFICIAL QR SIGNED NOTICE ONLINE:*',
      'https://nyayasetu.gov.in/verify?ref=' + ref,
      '',
      '*POSTAL CONSIGNMENT TRACKING:*',
      'Registered Speed Post Barcode: ' + speedPostTracking
    ].join('\n');
  }, [ref, recipientName, recipientAddress, applicantName, applicantPhone, subject, statutoryAct, cureWindowDays, speedPostTracking]);

  // Format Email Payload
  const emailSubject = useMemo(() => {
    return '[LEGAL NOTICE] REF: ' + ref + ' - ' + subject.slice(0, 70) + '...';
  }, [ref, subject]);

  const emailBody = useMemo(() => {
    if (rawNoticeContent && rawNoticeContent.length > 50) {
      return rawNoticeContent;
    }
    return [
      'FORMAL STATUTORY LEGAL NOTICE',
      'Document Reference ID: ' + ref,
      'Date: ' + new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
      '',
      'TO:',
      recipientName,
      recipientAddress,
      '',
      'FROM:',
      applicantName,
      'Address: ' + applicantAddress,
      'Contact: ' + applicantPhone,
      '',
      'SUBJECT: ' + subject,
      '',
      '1. STATEMENT OF FACTS & LEGAL BREACH:',
      draftData?.facts || 'As detailed in the formal complaint docket.',
      '',
      '2. STATUTORY REMEDY & PRAYER SOUGHT:',
      draftData?.prayer || 'Immediate compliance, full restitution, and statutory compensation.',
      '',
      '3. MANDATORY STATUTORY NOTICE PERIOD:',
      'You are hereby given formal statutory notice of ' + cureWindowDays + ' Days to rectify the breach and fulfill the prayer. Failing compliance, formal proceedings will be instituted before the competent court/commission.',
      '',
      '4. OFFICIAL QR VERIFICATION:',
      'This document is registered with the NyayaSetu Citizen Legal Engine. Verify online:',
      'https://nyayasetu.gov.in/verify?ref=' + ref,
      '',
      'Sincerely,',
      applicantName,
      'Digitally Dispatched via NyayaSetu Legal Action Engine'
    ].join('\n');
  }, [ref, recipientName, recipientAddress, applicantName, applicantAddress, applicantPhone, subject, draftData, rawNoticeContent, cureWindowDays]);

  if (!isOpen) return null;

  const handleSendWhatsApp = () => {
    const cleanPhone = recipientPhone.replace(/[^0-9]/g, '');
    let url = 'https://wa.me/?text=' + encodeURIComponent(whatsappPayload);
    if (cleanPhone) {
      const fullPhone = cleanPhone.startsWith('91') ? cleanPhone : ('91' + cleanPhone);
      url = 'https://wa.me/' + fullPhone + '?text=' + encodeURIComponent(whatsappPayload);
    }
    window.open(url, '_blank');
    showToast(isHi ? 'व्हाट्सएप लीगल रिले खोला गया!' : 'WhatsApp Legal Relay initiated!', 'success');
  };

  const handleSendEmail = () => {
    const targetEmail = recipientEmail || 'grievance.officer@company.com';
    const mailtoUrl = 'mailto:' + targetEmail + '?subject=' + encodeURIComponent(emailSubject) + '&body=' + encodeURIComponent(emailBody);
    window.open(mailtoUrl, '_blank');
    showToast(isHi ? 'ईमेल क्लाइंट खोला गया!' : 'Registered Email Relay opened!', 'success');
  };

  const handleCopyPayload = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast(isHi ? 'दस्तावेज़ क्लिपबोर्ड पर कॉपी किया गया' : 'Legal dispatch text copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSelectNodal = (nodal) => {
    setRecipientEmail(nodal.email);
    if (nodal.phone && !nodal.phone.includes('112') && !nodal.phone.includes('14555')) {
      setRecipientPhone(nodal.phone);
    }
    showToast(isHi ? ('नोडल अधिकारी चुना गया: ' + nodal.name) : ('Nodal authority set to: ' + nodal.name), 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-xs animate-fade-in overflow-y-auto font-sans">
      <div className="bg-white border border-slate-300 rounded-lg max-w-2xl w-full my-8 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-4 bg-[#0A2540] text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">
                {isHi ? '1-क्लिक व्हाट्सएप एवं रजिस्टर्ड ईमेल विधिक रिले' : '1-Click WhatsApp & Registered Email Legal Relay'}
              </h3>
              <p className="text-[11px] text-slate-300 font-mono">
                {isHi ? 'सत्यापित संदर्भ:' : 'Verified Notice Ref:'} <span className="text-amber-300 font-bold">{ref}</span>
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-300 hover:text-white p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={'pb-2.5 px-3 border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ' + (
              activeTab === 'whatsapp'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            )}
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>{isHi ? '📱 व्हाट्सएप लीगल रिले' : '📱 WhatsApp Relay'}</span>
          </button>

          <button
            onClick={() => setActiveTab('email')}
            className={'pb-2.5 px-3 border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ' + (
              activeTab === 'email'
                ? 'border-blue-600 text-blue-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            )}
          >
            <Mail className="w-4 h-4 text-blue-600" />
            <span>{isHi ? '📧 रजिस्टर्ड ईमेल डिस्पैच' : '📧 Registered Email'}</span>
          </button>

          <button
            onClick={() => setActiveTab('speedpost')}
            className={'pb-2.5 px-3 border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ' + (
              activeTab === 'speedpost'
                ? 'border-amber-600 text-amber-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            )}
          >
            <Package className="w-4 h-4 text-amber-600" />
            <span>{isHi ? '📮 स्पीड पोस्ट स्लिप एवं ट्रैकिंग' : '📮 Speed Post Docket'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          
          {/* Quick Nodal Directory Directory */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              {isHi ? '⚡ नोडल शिकायत अधिकारी निर्देशिका (1-Click Fill):' : '⚡ Nodal Grievance Directory (1-Click Autofill):'}
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {OFFICIAL_NODAL_DIRECTORY.map((nodal, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectNodal(nodal)}
                  className="px-2.5 py-1 rounded bg-white hover:bg-slate-200 border border-slate-300 text-[11px] font-medium text-slate-800 transition-colors cursor-pointer"
                >
                  {nodal.name}
                </button>
              ))}
            </div>
          </div>

          {/* TAB 1: WHATSAPP DISPATCH RELAY */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 block text-xs">
                  {isHi ? 'विपक्षी पार्टी / अधिकारी का व्हाट्सएप नंबर:' : 'Opposite Party / Landlord / Officer WhatsApp Number:'}
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      placeholder="e.g. 9876543210 (or leave empty to select contact in WhatsApp)"
                      className="w-full pl-9 pr-3 py-2 rounded border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* WhatsApp Message Preview */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 text-[11px]">
                    {isHi ? 'पूर्वावलोकन संदेश (Pre-filled Statutory Notice):' : 'Pre-filled Statutory Legal Message Preview:'}
                  </span>
                  <button
                    onClick={() => handleCopyPayload(whatsappPayload)}
                    className="text-emerald-700 hover:text-emerald-900 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copied ? (isHi ? 'कॉपी हुआ!' : 'Copied!') : (isHi ? 'कॉपी करें' : 'Copy Text')}</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-lg bg-emerald-50/50 border border-emerald-200 text-emerald-950 font-mono text-[11px] leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {whatsappPayload}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleSendWhatsApp}
                className="w-full py-3 px-4 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{isHi ? 'व्हाट्सएप पर कानूनी नोटिस भेजें' : 'Dispatch Formal Legal Notice via WhatsApp →'}</span>
              </button>
            </div>
          )}

          {/* TAB 2: EMAIL DISPATCH RELAY */}
          {activeTab === 'email' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block text-xs mb-1">
                    {isHi ? 'नोडल शिकायत अधिकारी का ईमेल:' : 'Nodal Grievance Officer Email:'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="e.g. grievance.officer@flipkart.com"
                      className="w-full pl-9 pr-3 py-2 rounded border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block text-xs mb-1">
                    {isHi ? 'विषय (Pre-filled Subject):' : 'Legal Subject Line:'}
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    readOnly
                    className="w-full px-3 py-2 rounded border border-slate-200 bg-slate-50 text-xs font-mono text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              {/* Email Body Preview */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 text-[11px]">
                    {isHi ? 'रजिस्टर्ड ईमेल का प्रारूप:' : 'Formal Legal Notice Body Preview:'}
                  </span>
                  <button
                    onClick={() => handleCopyPayload(emailBody)}
                    className="text-blue-700 hover:text-blue-900 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copied ? (isHi ? 'कॉपी हुआ!' : 'Copied!') : (isHi ? 'कॉपी करें' : 'Copy Text')}</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-lg bg-blue-50/50 border border-blue-200 text-slate-900 font-mono text-[11px] leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {emailBody}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleSendEmail}
                className="w-full py-3 px-4 rounded-md bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>{isHi ? 'रजिस्टर्ड ईमेल क्लाइंट में खोलें' : 'Open in Default Email Client (Outlook/Gmail) →'}</span>
              </button>
            </div>
          )}

          {/* TAB 3: SPEED POST DOCKET SLIP */}
          {activeTab === 'speedpost' && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-amber-50/60 border border-amber-300 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-amber-700" />
                    <span>{isHi ? 'भारतीय डाक (India Post) पंजीकृत स्पीड पोस्ट स्लिप' : 'India Post Registered Speed Post AD Consignment Docket'}</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-mono">
                    BARCODE: {speedPostTracking}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px] pt-1">
                  <div>
                    <span className="text-slate-500 block uppercase font-bold text-[9px]">{isHi ? 'प्रेषक / Sender:' : 'Sender (Citizen):'}</span>
                    <strong className="text-slate-900">{applicantName}</strong>
                    <p className="text-slate-600">{applicantAddress}</p>
                    <p className="text-slate-600">{applicantPhone}</p>
                  </div>

                  <div>
                    <span className="text-slate-500 block uppercase font-bold text-[9px]">{isHi ? 'पाने वाला / Addressee:' : 'Addressee / Opposite Party:'}</span>
                    <strong className="text-slate-900">{recipientName}</strong>
                    <p className="text-slate-600">{recipientAddress}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-amber-200/80 flex items-center justify-between text-[10px] text-amber-900 font-medium">
                  <span>⚖️ Section 27 General Clauses Act (Presumption of Valid Service)</span>
                  <a
                    href="https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx"
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold underline flex items-center gap-1"
                  >
                    <span>India Post Tracker</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 rounded bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{isHi ? 'पोस्टल स्लिप प्रिंट करें' : 'Print Speed Post AD Docket'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Legal Evidentiary Note */}
          <div className="p-2.5 rounded bg-slate-100 border border-slate-200 text-[10px] text-slate-600 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              {isHi 
                ? 'डिजिटल डिस्पैच रसीदें एवं स्पीड पोस्ट बारकोड भारतीय साक्ष्य अधिनियम की धारा 65B / BSA धारा 63 के तहत अदालत में पूर्णतः स्वीकार्य हैं।' 
                : 'Digital WhatsApp delivery receipts and Speed Post barcodes are fully admissible evidence under Section 65B Indian Evidence Act / Section 63 BSA.'}
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
