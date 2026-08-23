import React, { useState, useEffect, useMemo } from 'react';
import { useCase } from '../../context/CaseContext';
import { useLanguage } from '../../context/LanguageContext';
import { SAMPLE_GRIEVANCES } from '../../services/mockData';
import { 
  Clock, ShieldCheck, CheckCircle2, AlertCircle, FileText, 
  ArrowRight, Search, Calendar, ChevronRight, Download, Award,
  Scale, ShieldAlert, Sparkles, User, Building2, MapPin, ExternalLink, RefreshCw, Share2 
} from 'lucide-react';
import { LegalDispatchRelayModal } from '../drafting/LegalDispatchRelayModal';

export const CaseTracker = () => {
  const { 
    currentReferenceId, 
    currentDiagnosis, 
    currentGrievance, 
    activeDraft, 
    setActiveTab, 
    showToast, 
    casesHistory,
    activeTrackingCaseId,
    setActiveTrackingCaseId
  } = useCase();
  
  const { language, t } = useLanguage();
  const isHi = language === 'hi';
  const [isDispatchRelayOpen, setIsDispatchRelayOpen] = useState(false);

  // 1. Build Comprehensive Registered Cases Corpus
  const allRegisteredCases = useMemo(() => {
    const list = [];
    const seenRefs = new Set();

    // Any saved complaints in user's history
    if (casesHistory && casesHistory.length > 0) {
      casesHistory.forEach((c) => {
        if (!seenRefs.has(c.ref || c.id)) {
          seenRefs.add(c.ref || c.id);
          const tDays = c.timelineDays || c.diagnosis?.timelineDays || c.diagnosis?.remedy?.timelineDays || 15;
          list.push({
            id: c.id || c.ref,
            ref: c.ref || c.id,
            title: c.title || c.diagnosis?.disputeTitle || (isHi ? 'पंजीकृत कानूनी विवाद' : 'Registered Dispute'),
            category: c.category || c.diagnosis?.category || 'Active Case',
            counterParty: c.counterParty || c.diagnosis?.oppositeParty || 'Opposite Party / Authority',
            urgency: tDays <= 1 ? 'CRITICAL_24H' : tDays === 2 ? 'CRITICAL_48H' : tDays === 30 ? 'MEDIUM_30D' : 'HIGH_15D',
            timelineDays: tDays,
            registeredAt: c.registeredAt || new Date().toISOString(),
            deadlineAt: c.deadlineAt || new Date(Date.now() + tDays * 86400000).toISOString(),
            summary: c.summary || c.diagnosis?.summary || c.rawText,
            rawText: c.rawText || '',
            diagnosis: c.diagnosis,
            isUserCreated: true
          });
        }
      });
    }

    // Active Diagnosed Case (if present and not already added)
    if ((currentDiagnosis || currentGrievance) && !seenRefs.has(currentReferenceId)) {
      const tDays = currentDiagnosis?.timelineDays || currentDiagnosis?.remedy?.timelineDays || 15;
      const regTime = currentDiagnosis?.registeredAt || new Date().toISOString();
      const deadTime = currentDiagnosis?.deadlineAt || new Date(Date.now() + tDays * 86400000).toISOString();
      
      seenRefs.add(currentReferenceId);
      list.unshift({
        id: currentReferenceId || 'NYA-2026-LIVE',
        ref: currentReferenceId || 'NYA-2026-LIVE',
        title: currentDiagnosis?.disputeTitle || (isHi ? 'सक्रिय पंजीकृत कानूनी विवाद' : 'Active Registered Dispute'),
        category: currentDiagnosis?.category || 'Active Case',
        counterParty: currentDiagnosis?.oppositeParty || currentDiagnosis?.counterParty || 'Opposite Party / Authority',
        urgency: tDays <= 1 ? 'CRITICAL_24H' : tDays === 2 ? 'CRITICAL_48H' : tDays === 30 ? 'MEDIUM_30D' : 'HIGH_15D',
        timelineDays: tDays,
        registeredAt: regTime,
        deadlineAt: deadTime,
        summary: currentDiagnosis?.summary || currentGrievance,
        rawText: currentGrievance,
        diagnosis: currentDiagnosis,
        isUserCreated: true
      });
    }

    // Benchmark Precedent Cases
    SAMPLE_GRIEVANCES.forEach((sg) => {
      const caseRef = sg.ref || `NYA-2026-${1000 + Math.abs(sg.id.charCodeAt(0) * 89 + (sg.id.charCodeAt(1) || 0))}`;
      if (!seenRefs.has(caseRef)) {
        seenRefs.add(caseRef);
        const isDowry = sg.id === 'g6';
        const isSCST = sg.id === 'g9';
        const isSenior = sg.id === 'g10';
        const isHospital = sg.id === 'g4';
        const isProperty = sg.id === 'g8';
        const isFIR = sg.id === 'g7';
        const isRERA = sg.id === 'g5';
        const isTenancy = sg.id === 'g2';
        const isRTI = sg.id === 'g3';
        const isConsumer = sg.id === 'g1';

        let timelineDays = 15;
        let urgency = 'HIGH_15D';
        let offsetHours = 0;

        if (isDowry || isSCST || isFIR) {
          timelineDays = 1;
          urgency = 'CRITICAL_24H';
          offsetHours = 5; // Registered 5 hours ago
        } else if (isHospital) {
          timelineDays = 2;
          urgency = 'CRITICAL_48H';
          offsetHours = 8;
        } else if (isRERA || isRTI || isProperty || isSenior) {
          timelineDays = 30;
          urgency = 'MEDIUM_30D';
          offsetHours = 48;
        } else {
          timelineDays = 15;
          urgency = 'HIGH_15D';
          offsetHours = 36;
        }

        const simRegDate = new Date(Date.now() - offsetHours * 3600000);

        list.push({
          id: sg.id,
          ref: caseRef,
          title: isHi ? sg.hindiTitle : sg.title,
          category: sg.category,
          counterParty: sg.targetAuthority || sg.diagnosis?.counterParty || 'Concerned Authority',
          urgency: urgency,
          timelineDays: timelineDays,
          registeredAt: simRegDate.toISOString(),
          deadlineAt: new Date(simRegDate.getTime() + timelineDays * 86400000).toISOString(),
          summary: sg.diagnosis?.summary || sg.text,
          rawText: sg.text,
          diagnosis: sg.diagnosis,
          isUserCreated: false
        });
      }
    });

    return list;
  }, [casesHistory, currentDiagnosis, currentGrievance, currentReferenceId, isHi]);

  // Selected Case State
  const [selectedCaseId, setSelectedCaseId] = useState(
    activeTrackingCaseId || allRegisteredCases[0]?.id || 'NYA-2026-LIVE'
  );
  
  const [searchRef, setSearchRef] = useState(allRegisteredCases[0]?.ref || 'NYA-2026-8091');

  // Currently active case object
  const activeCase = useMemo(() => {
    return allRegisteredCases.find(c => c.id === selectedCaseId || c.ref === selectedCaseId || c.ref === searchRef) || allRegisteredCases[0];
  }, [allRegisteredCases, selectedCaseId, searchRef]);

  // Real-Time Second-by-Second Dynamic Countdown Clock
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    const calculateCountdown = () => {
      const regTime = activeCase?.registeredAt ? new Date(activeCase.registeredAt).getTime() : Date.now();
      const timelineDays = activeCase?.timelineDays || 15;
      const deadlineTime = regTime + (timelineDays * 24 * 60 * 60 * 1000);
      const diff = deadlineTime - Date.now();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [activeCase]);

  const handleSelectCase = (c) => {
    setSelectedCaseId(c.id);
    setSearchRef(c.ref);
    if (setActiveTrackingCaseId) {
      setActiveTrackingCaseId(c.id);
    }
    showToast(isHi ? `ट्रैकिंग केस चुना गया: ${c.ref}` : `Tracking switched to ${c.ref}`, 'info');
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const query = (searchRef || '').trim().toLowerCase();
    if (!query) return;

    const matched = allRegisteredCases.find(c => 
      c.ref.toLowerCase().includes(query) || 
      c.title.toLowerCase().includes(query) || 
      c.category.toLowerCase().includes(query) ||
      c.counterParty.toLowerCase().includes(query)
    );

    if (matched) {
      setSelectedCaseId(matched.id);
      setSearchRef(matched.ref);
      showToast(isHi ? `केस ${matched.ref} पाया गया` : `Case record ${matched.ref} loaded`, 'success');
    } else {
      showToast(isHi ? 'केस संदर्भ संख्या नहीं मिली' : 'No matching case reference found', 'warning');
    }
  };

  // Helper date formatter based on complaint's actual registration date
  const formatOffsetDate = (baseIso, offsetDays) => {
    const base = baseIso ? new Date(baseIso) : new Date();
    const target = new Date(base.getTime() + offsetDays * 86400000);
    return target.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Dynamic Milestones Generator based on legal discipline & actual registration timestamp
  const milestones = useMemo(() => {
    const text = (activeCase?.rawText || activeCase?.title || activeCase?.category || '').toLowerCase();
    const ref = activeCase?.ref || 'NYA-2026-LIVE';
    const regDate = activeCase?.registeredAt || new Date().toISOString();
    const tDays = activeCase?.timelineDays || 15;

    // Matrimonial & Dowry Death
    if (new RegExp('dowry|husband|in-laws|suicide|bahu|dahej|304b|bns\\s*80|cruelty', 'i').test(text)) {
      return [
        {
          title: isHi ? '1. वैधानिक अपराध वर्गीकरण एवं धारा मैपिंग' : '1. Statutory AI Crime Mapping & Section Categorization',
          date: formatOffsetDate(regDate, 0),
          status: 'COMPLETED',
          desc: isHi ? 'धारा 80 BNS (दहेज मृत्यु) और धारा 118 BSA (अनिवार्य वैधानिक उपधारणा) दर्ज की गई।' : 'Cognizable sections mapped: Section 80 BNS (Dowry Death) & Section 118 BSA (Mandatory Presumption).'
        },
        {
          title: isHi ? '2. औपचारिक आपराधिक परिवाद एवं एसडीएम इनक्वेस्ट आवेदन' : '2. Criminal Complaint & Formal SDM Inquest Docket Generated',
          date: formatOffsetDate(regDate, 0),
          status: 'COMPLETED',
          desc: isHi ? `सत्यापित संदर्भ संख्या ${ref} दर्ज। मजिस्ट्रियल जांच प्रारूप तैयार।` : `Document Reference ID ${ref} generated. Magisterial inquest docket prepared.`
        },
        {
          title: isHi ? '3. थानेदार (SHO) एवं पुलिस अधीक्षक (SP) को डाक व ईमेल द्वारा परिवाद तामील' : '3. Written Complaint Service to SHO & SP under Sec 175(3) BNSS',
          date: formatOffsetDate(regDate, 1),
          status: 'IN_PROGRESS',
          desc: isHi ? 'पंजीकृत स्पीड पोस्ट डिलीवरी और पुलिस सामान्य डायरी (GD) प्रविष्टि ट्रैकिंग।' : 'Speed Post delivery tracked. Mandating immediate FIR under Sec 173 BNSS.'
        },
        {
          title: isHi ? '4. 24 घंटे में एसडीएम मजिस्ट्रियल जांच एवं फोरेंसिक पोस्टमार्टम रिपोर्ट' : '4. Mandatory SDM Magisterial Inquest & Forensic Autopsy Report',
          date: formatOffsetDate(regDate, 1),
          status: 'PENDING',
          desc: isHi ? 'धारा 196 BNSS के तहत उप-संभागीय मजिस्ट्रेट द्वारा स्वतंत्र साक्ष्य दर्ज करना।' : 'Independent judicial enquiry under Section 196 BNSS by Sub-Divisional Magistrate.'
        },
        {
          title: isHi ? '5. सत्र न्यायालय में NALSA वरिष्ठ सरकारी वकील द्वारा ट्रायल अभियोजन' : '5. Sessions Court Trial Prosecution via Free NALSA Senior Counsel',
          date: formatOffsetDate(regDate, 7),
          status: 'PENDING',
          desc: isHi ? 'धारा 12 विधिक सेवा प्राधिकरण अधिनियम (NALSA 14468) के तहत 100% मुफ्त विधिक सहायता।' : '100% Free Senior Advocate legal representation assigned via District Legal Services Authority (DLSA).'
        }
      ];
    }

    // SC/ST Atrocities
    if (new RegExp('sc/st|dalit|casteist|caste\\s*slur|atrocit|poa\\s*act|14566', 'i').test(text)) {
      return [
        {
          title: isHi ? '1. धारा 18A PoA एक्ट एवं गैर-जमानती अपराध विश्लेषण' : '1. Section 18A PoA Act Non-Bailable Arrest Mandate Analysis',
          date: formatOffsetDate(regDate, 0),
          status: 'COMPLETED',
          desc: isHi ? 'एससी/एसटी अत्याचार निवारण अधिनियम 1989 की धारा 3(1), 3(2) व 18A मैपिंग।' : 'Statutory bar on anticipatory bail (Sec 18A) and immediate arrest mandate recorded.'
        },
        {
          title: isHi ? '2. पुलिस परिवाद एवं NHPA 14566 राष्ट्रीय डॉकेट निर्माण' : '2. Police FIR Petition & NHPA 14566 National Escalation Docket',
          date: formatOffsetDate(regDate, 0),
          status: 'COMPLETED',
          desc: isHi ? `संदर्भ संख्या ${ref} दर्ज। राष्ट्रीय अत्याचार निवारण हेल्पलाइन डॉकेट तैयार।` : `Case Reference ${ref} recorded. Direct Ministry of Social Justice docket created.`
        },
        {
          title: isHi ? '3. पुलिस उपाधीक्षक (DSP) स्पेशल सेल एवं राष्ट्रीय आयोग को तामील' : '3. Formal Service to DSP Special Cell & National Commission',
          date: formatOffsetDate(regDate, 1),
          status: 'IN_PROGRESS',
          desc: isHi ? 'विशेष जांच अधिकारी (DSP) द्वारा 30 दिनों में आरोप पत्र (Chargesheet) दाखिल करने की निगरानी।' : 'Tracking DSP investigation and mandated 30-day chargesheet filing.'
        },
        {
          title: isHi ? '4. जिला समाज कल्याण अधिकारी द्वारा ₹85,000 - ₹8.25 लाख DBT मुआवजा स्वीकृति' : '4. Statutory Victim Relief Sanction (₹85,000 to ₹8,25,000 DBT)',
          date: formatOffsetDate(regDate, 7),
          status: 'PENDING',
          desc: isHi ? 'अत्याचार निवारण नियमावली नियम 12 के तहत प्रथम सूचना रिपोर्ट पर 25% अग्रिम सहायता।' : 'Direct Benefit Transfer (DBT) victim compensation sanctioned under PoA Rules.'
        },
        {
          title: isHi ? '5. अनन्य विशेष न्यायालय (Exclusive Special Court) में 60-दिवसीय त्वरित ट्रायल' : '5. Speedy Trial before Exclusive Special Court (60-Day Mandate)',
          date: formatOffsetDate(regDate, 21),
          status: 'PENDING',
          desc: isHi ? 'विशेष लोक अभियोजक द्वारा डे-टू-डे सुनवाई और धारा 14 के तहत त्वरित न्याय।' : 'Day-to-day trial by Special Public Prosecutor under Section 14 of PoA Act.'
        }
      ];
    }

    // Senior Citizens Maintenance & Gift Deed Voidance
    if (new RegExp('senior|elderly|parents|gift\\s*deed|section\\s*23|elder\\s*line|14567', 'i').test(text)) {
      return [
        {
          title: isHi ? '1. धारा 23 गिफ्ट डीड रद्दीकरण एवं भरण-पोषण वैधानिक विश्लेषण' : '1. Section 23 Gift Deed Voidance & Maintenance Right Analysis',
          date: formatOffsetDate(regDate, 0),
          status: 'COMPLETED',
          desc: isHi ? 'वरिष्ठ नागरिक अधिनियम 2007 की धारा 4 व 23 के तहत कपट की वैधानिक उपधारणा।' : 'Statutory analysis under Section 23 (Transfer of property deemed void for fraud).'
        },
        {
          title: isHi ? '2. एसडीएम अधिकरण याचिका एवं Elder Line 14567 डॉकेट तैयार' : '2. SDM Maintenance Tribunal Petition & Elder Line 14567 Docket',
          date: formatOffsetDate(regDate, 0),
          status: 'COMPLETED',
          desc: isHi ? `दस्तावेज़ संदर्भ ${ref} दर्ज। संपत्ति वापसी व गुजारा भत्ता याचिका तैयार।` : `Reference ${ref} recorded. Restoration of property & ₹10,000/mo allowance petition prepared.`
        },
        {
          title: isHi ? '3. अधिकरण द्वारा व्यतिक्रमी संतानों को वैधानिक नोटिस जारी' : '3. Statutory Notice Service to Defaulting Children via Tribunal',
          date: formatOffsetDate(regDate, 3),
          status: 'IN_PROGRESS',
          desc: isHi ? 'उप-संभागीय मजिस्ट्रेट (SDM) अधिकरण द्वारा संतानों को 15 दिन में पेश होने का समन।' : 'SDM Maintenance Tribunal summons served on children for mandatory appearance.'
        },
        {
          title: isHi ? '4. मासिक भरण-पोषण एवं चिकित्सा खर्च आदेश' : '4. Monthly Maintenance Allowance Hearing & Adjudication',
          date: formatOffsetDate(regDate, 15),
          status: 'PENDING',
          desc: isHi ? 'धारा 4 के तहत प्रतिमाह अनिवार्य गुजारा भत्ता और बैंक खाते से कटौती आदेश।' : 'Order directing children to pay monthly maintenance under Section 4.'
        },
        {
          title: isHi ? '5. गिफ्ट डीड को शून्य घोषित करने एवं बेदखली का अंतिम आदेश' : '5. Final Decree Declaring Gift Deed VOID & Property Restitution',
          date: formatOffsetDate(regDate, 30),
          status: 'PENDING',
          desc: isHi ? 'रजिस्ट्री शून्य करने का सरकारी आदेश और माता-पिता को पूर्ण स्वामित्व की बहाली।' : 'Tribunal decree setting aside gift deed and restoring ownership to elderly parents.'
        }
      ];
    }

    // Emergency Healthcare & Hospital Refusal
    if (new RegExp('hospital|accident|trauma|ayushman|doctor|cash\\s*advance|emergency|pm-jay|pmjay', 'i').test(text)) {
      return [
        {
          title: isHi ? '1. धारा 134(a) MVA एवं क्लिनिकल एस्टेब्लिशमेंट आपातकालीन ऑडिट' : '1. Sec 134(a) MVA & Clinical Establishments Act Emergency Audit',
          date: formatOffsetDate(regDate, 0),
          status: 'COMPLETED',
          desc: isHi ? 'आपातकालीन ट्रॉमा में नकद अग्रिम मांगना गैरकानूनी वैधानिक उल्लंघन चिह्नित।' : 'Emergency stabilization mandate without cash advance verified under MVA Sec 134(a).'
        },
        {
          title: isHi ? '2. अस्पताल अधीक्षक को वैधानिक नोटिस एवं NHA CGRP 14555 टिकट दर्ज' : '2. Statutory Notice to Medical Superintendent & NHA 14555 Ticket',
          date: formatOffsetDate(regDate, 0),
          status: 'COMPLETED',
          desc: isHi ? `संदर्भ ${ref} दर्ज। राष्ट्रीय स्वास्थ्य प्राधिकरण (NHA) शिकायत दर्ज।` : `Reference ${ref} generated. NHA PM-JAY National Grievance ticket raised.`
        },
        {
          title: isHi ? '3. आरोग्य मित्र एवं राज्य स्वास्थ्य एजेंसी (SHA) का आपातकालीन हस्तक्षेप' : '3. On-Duty Arogya Mitra & State Health Agency (SHA) Intervention',
          date: formatOffsetDate(regDate, 1),
          status: 'IN_PROGRESS',
          desc: isHi ? 'अस्पताल प्रबंधन को 100% कैशलेस इलाज और शून्य अग्रिम राशि जमा का आदेश।' : 'SHA nodal officer directing hospital management for immediate cashless admission.'
        },
        {
          title: isHi ? '4. जबरन ली गई अग्रिम राशि की पूर्ण वापसी एवं मरीज स्थिरीकरण' : '4. Advance Cash Refund & 100% Cashless Trauma Care Enforcement',
          date: formatOffsetDate(regDate, 2),
          status: 'PENDING',
          desc: isHi ? 'अवैध नकद जमा की 24 घंटे में वापसी और आपातकालीन आईसीयू प्रोटोकॉल पालन।' : 'Full refund of advance deposit and strict compliance with PM-JAY package rates.'
        },
        {
          title: isHi ? '5. उपभोक्ता आयोग (DCDRC) एवं राज्य चिकित्सा परिषद में लापरवाही दावा' : '5. DCDRC Negligence Claim & State Medical Council Penalty Action',
          date: formatOffsetDate(regDate, 15),
          status: 'PENDING',
          desc: isHi ? 'सेवा में घोर कमी हेतु अस्पताल पर 5 गुना जुर्माना और क्षतिपूर्ति याचिका।' : 'Petition for ₹5,00,000 compensation for mental trauma and regulatory de-empanelment.'
        }
      ];
    }

    // Daughter Ancestral Property
    if (new RegExp('ancestral|inheritance|daughter|succession|coparcener|will|partition|mutation', 'i').test(text)) {
      return [
        {
          title: isHi ? '1. धारा 6 हिंदू उत्तराधिकार अधिनियम सहदायिकी हिस्सा मैपिंग' : '1. Section 6 Hindu Succession Act Equal Coparcenary Share Analysis',
          date: formatOffsetDate(regDate, 0),
          status: 'COMPLETED',
          desc: isHi ? 'सुप्रीम कोर्ट विनीता शर्मा फैसले के तहत जन्म से 1/3 समान सहदायिकी हिस्सा निर्धारित।' : 'Daughter equal coparcenary share mapped per Supreme Court Vineeta Sharma precedent.'
        },
        {
          title: isHi ? '2. राजस्व नामांतरण (Mutation) आवेदन एवं वंशावली डॉकेट तैयार' : '2. Revenue Mutation (Namantaran) Application & Pedigree Dossier',
          date: formatOffsetDate(regDate, 0),
          status: 'COMPLETED',
          desc: isHi ? `केस संदर्भ ${ref} दर्ज। तहसीलदार न्यायालय नामांतरण प्रारूप तैयार।` : `Case Ref ${ref} logged. Tehsildar mutation and family tree dossier generated.`
        },
        {
          title: isHi ? '3. तहसीलदार न्यायालय में 30-दिवसीय सरकारी राजस्व अभिलेख प्रविष्टि' : '3. Tehsildar Court 30-Day Mandatory Revenue Mutation Notice',
          date: formatOffsetDate(regDate, 3),
          status: 'IN_PROGRESS',
          desc: isHi ? 'जमीन के सरकारी कागजात (खतौनी) में नाम दर्ज करने हेतु 30-दिवसीय सार्वजनिक आपत्ति नोटिस।' : 'Public notice for land record mutation and entry in Khatauni.'
        },
        {
          title: isHi ? '4. दीवानी न्यायालय (Civil Judge) में बंटवारे एवं व्यादेश (Injunction) का वाद' : '4. Civil Suit for Partition & Injunction before Civil Judge',
          date: formatOffsetDate(regDate, 18),
          status: 'PENDING',
          desc: isHi ? 'पैतृक जमीन को तीसरे पक्ष को बेचने या अवैध निर्माण पर अंतरिम अदालती रोक।' : 'Interim injunction restraining other legal heirs from alienating ancestral land.'
        },
        {
          title: isHi ? '5. अंतिम विभाजन डिक्री एवं राजस्व खतौनी में समान 1/3 हिस्सा दर्ज' : '5. Final Partition Decree & Revenue Record (Khatauni) Execution',
          date: formatOffsetDate(regDate, 30),
          status: 'PENDING',
          desc: isHi ? 'राजस्व विभाग द्वारा भौतिक सीमांकन और अलग खाता संख्या आवंटन।' : 'Physical boundary demarcation and separate revenue ledger allocation.'
        }
      ];
    }

    // Police FIR
    if (new RegExp('fir|zero\\s*fir|police|sho|police\\s*station|assault|beaten|154\\s*crpc|173\\s*bnss', 'i').test(text)) {
      return [
        {
          title: isHi ? '1. धारा 173 BNSS संज्ञेय अपराध एवं जीरो एफआईआर अनिवार्यता' : '1. Section 173 BNSS Cognizable Crime & Zero FIR Mandate Mapping',
          date: formatOffsetDate(regDate, 0),
          status: 'COMPLETED',
          desc: isHi ? 'ललिता कुमारी फैसले के तहत थानेदार द्वारा बिना देरी एफआईआर दर्ज करने का वैधानिक कर्तव्य।' : 'Mandatory duty of police to lodge FIR without preliminary inquiry recorded.'
        },
        {
          title: isHi ? '2. थानेदार हेतु औपचारिक परिवाद एवं जीडी प्रविष्टि मांग पत्र' : '2. Formal Police Complaint & General Diary (GD) Demand Drafted',
          date: formatOffsetDate(regDate, 0),
          status: 'COMPLETED',
          desc: isHi ? `सत्यापित संदर्भ ${ref} दर्ज। साक्ष्य और धाराओं सहित लिखित परिवाद तैयार।` : `Document Ref ${ref} generated with penal sections and evidence annexures.`
        },
        {
          title: isHi ? '3. पुलिस अधीक्षक (SP) को धारा 175(3) BNSS के तहत रजिस्टर्ड स्पीड पोस्ट' : '3. Registered Speed Post Escalation to District SP under Sec 175(3)',
          date: formatOffsetDate(regDate, 1),
          status: 'IN_PROGRESS',
          desc: isHi ? 'थानेदार द्वारा मना करने पर सीधे जिले के पुलिस कप्तान (SP) को डाक द्वारा शिकायत प्रेषण।' : 'Speed post consignment tracked. Demanding SP to order immediate FIR.'
        },
        {
          title: isHi ? '4. न्यायिक मजिस्ट्रेट (JMFC) के समक्ष धारा 175(4) BNSS आवेदन' : '4. Section 175(4) BNSS Application before Judicial Magistrate',
          date: formatOffsetDate(regDate, 2),
          status: 'PENDING',
          desc: isHi ? 'मजिस्ट्रेट द्वारा पुलिस को एफआईआर दर्ज कर जांच करने का सीधा अदालती आदेश।' : 'Application before Magistrate commanding police to register FIR (former 156(3) CrPC).'
        },
        {
          title: isHi ? '5. एफआईआर पंजीकरण एवं 60/90 दिनों में आरोप पत्र (Chargesheet) दाखिल' : '5. FIR Registration, Forensic Investigation & Chargesheet Filing',
          date: formatOffsetDate(regDate, 7),
          status: 'PENDING',
          desc: isHi ? 'निःशुल्क एफआईआर प्रति की प्राप्ति और अदालत में समयबद्ध चार्जशीट निगरानी।' : 'Certified free copy of FIR obtained and timebound investigation tracked.'
        }
      ];
    }

    // Real Estate RERA
    if (new RegExp('builder|flat|rera|possession|apartment', 'i').test(text)) {
      return [
        {
          title: isHi ? '1. रेरा धारा 18 विलंब ब्याज एवं वैधानिक उल्लंघन विश्लेषण' : '1. Section 18 RERA Delay Interest & Breach Analysis',
          date: formatOffsetDate(regDate, 0),
          status: 'COMPLETED',
          desc: isHi ? 'SBI MCLR + 2% की दर से पूर्ण मूलधन वापसी या मासिक विलंब ब्याज का वैधानिक अधिकार।' : 'Statutory interest calculation (SBI MCLR + 2%) on consideration.'
        },
        {
          title: isHi ? '2. बिल्डर प्रबंधन को 30-दिवसीय वैधानिक मांग नोटिस जारी' : '2. 30-Day Formal Statutory Demand Notice Issued to Builder',
          date: formatOffsetDate(regDate, 0),
          status: 'COMPLETED',
          desc: isHi ? `संदर्भ ${ref} दर्ज। विधिक नोटिस बिल्डर के पंजीकृत कार्यालय को प्रेषित।` : `Notice Ref ${ref} generated and dispatched via Registered Speed Post.`
        },
        {
          title: isHi ? '3. राज्य रेरा पोर्टल (RERA Portal) पर धारा 31 के तहत ऑनलाइन शिकायत' : '3. State RERA Portal Section 31 Formal Complaint Registration',
          date: formatOffsetDate(regDate, 3),
          status: 'IN_PROGRESS',
          desc: isHi ? 'रेरा बेंच के समक्ष शिकायत संख्या दर्ज और बिल्डर को समन जारी।' : 'Online complaint docket submitted for summary recovery decree.'
        },
        {
          title: isHi ? '4. न्यायनिर्णायक अधिकारी (Adjudicating Officer) के समक्ष सुनवाई' : '4. Adjudicating Officer Hearing & Recovery Warrant Order',
          date: formatOffsetDate(regDate, 18),
          status: 'PENDING',
          desc: isHi ? 'बिल्डर द्वारा जवाब दाखिल और ब्याज सहित मूलधन वापसी का आदेश।' : 'RERA Authority hearing for recovery of consideration + delay compensation.'
        },
        {
          title: isHi ? '5. जिला मजिस्ट्रेट (DM) द्वारा रिकवरी सर्टिफिकेट (RC) की वसूली' : '5. Recovery Certificate (RC) Execution via District Collector',
          date: formatOffsetDate(regDate, 30),
          status: 'PENDING',
          desc: isHi ? 'बिल्डर के बैंक खातों की कुर्की और पीड़ित होमबायर के खाते में आरटीजीएस भुगतान।' : 'Attachment of builder escrow accounts and full recovery transfer.'
        }
      ];
    }

    // Default Civic / Consumer Roadmap
    return [
      {
        title: isHi ? '1. वैधानिक AI निदान एवं धारा मैपिंग' : '1. Statutory AI Diagnosis & Section Mapping',
        date: formatOffsetDate(regDate, 0),
        status: 'COMPLETED',
        desc: isHi ? 'उपभोक्ता संरक्षण अधिनियम 2019 / मॉडल टेनेंसी एक्ट / आरटीआई के तहत धाराएं मैप की गईं।' : 'Sections mapped under CPA 2019 / Model Tenancy Act / RTI 2005.'
      },
      {
        title: isHi ? '2. क्यूआर कोड टोकन सहित औपचारिक विधिक नोटिस तैयार' : '2. Formal Legal Notice Generated with QR Token',
        date: formatOffsetDate(regDate, 0),
        status: 'COMPLETED',
        desc: isHi ? `सत्यापित संदर्भ संख्या ${ref} दर्ज की गई।` : `Document Reference ID ${ref} recorded.`
      },
      {
        title: isHi ? '3. पंजीकृत स्पीड पोस्ट / ईमेल द्वारा औपचारिक परिवाद तामील' : '3. Formal Service via Registered Speed Post / Email',
        date: formatOffsetDate(regDate, 1),
        status: 'IN_PROGRESS',
        desc: isHi ? 'शिकायत निवारण अधिकारी को डाक कन्साइनमेंट डिलीवरी ट्रैकिंग सक्रिय।' : 'Tracking postal consignment delivery to Grievance Officer.'
      },
      {
        title: isHi ? '4. अनिवार्य वैधानिक प्रत्युत्तर समय-सीमा' : '4. Mandatory Statutory Response Window',
        date: formatOffsetDate(regDate, tDays),
        status: 'PENDING',
        desc: isHi ? 'पूर्ण रिफंड या विवाद सुधार के लिए कानूनी अंतिम तिथि।' : 'Legal deadline for full refund or dispute rectification.'
      },
      {
        title: isHi ? '5. ई-दाखिल / ई-जागृति जिला उपभोक्ता आयोग में याचिका' : '5. Escalation to E-Daakhil District Consumer Commission',
        date: formatOffsetDate(regDate, tDays + 1),
        status: 'PENDING',
        desc: isHi ? 'समाधान न होने पर स्वतः पूर्व-भरी हुई याचिका का ऑनलाइन दाखिला।' : 'Automatic pre-filled petition filing if unheeded.'
      }
    ];
  }, [activeCase, isHi]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in text-slate-800">
      
      {/* Header Card */}
      <div className="gov-card p-6 bg-gradient-to-r from-slate-50 to-slate-100/60 border-slate-300">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="w-4 h-4 text-[#0A2540]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#0A2540]">
            {isHi ? 'वैधानिक समय-सीमा एवं बहु-केस ट्रैकर' : 'STATUTORY LIMITATION & MULTI-COMPLAINT TRACKER'}
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#0A2540]">
          {isHi ? 'पंजीकृत शिकायतों की वैधानिक समय-सीमा एवं प्रगति स्थिति' : 'Track Every Registered Complaint & Statutory Milestone Progression'}
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          {isHi 
            ? 'अपनी किसी भी शिकायत का चयन करें और उसकी सटीक कानूनी समय-सीमा, पुलिस/अदालत कार्रवाई व अगली तारीख देखें।' 
            : 'Select any registered complaint below to inspect its statute-specific countdown clock, legal notice service, and sequential judicial milestones.'}
        </p>
      </div>

      {/* Case Selector Dropdown & Quick Search Bar */}
      <div className="gov-card p-5 border-slate-300 space-y-4 bg-white shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-blue-900" />
            <span className="text-xs font-extrabold uppercase text-slate-900 tracking-wide">
              {isHi ? 'शिकायत चुनें (Select Registered Complaint):' : 'Select Registered Complaint to Track:'}
            </span>
          </div>

          <form onSubmit={handleSearch} className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchRef}
                onChange={(e) => setSearchRef(e.target.value)}
                placeholder="Search Ref ID or Keyword..."
                className="w-full pl-8 pr-3 py-1.5 rounded border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0A2540]"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              {isHi ? 'खोजें' : 'Track'}
            </button>
          </form>
        </div>

        {/* Registered Case Cards Grid Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              {isHi ? 'सभी पंजीकृत शिकायतें:' : 'ALL REGISTERED COMPLAINTS:'}
            </span>
            <span className="text-[10px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {allRegisteredCases.length} {isHi ? 'केस उपलब्ध' : 'Cases Available'}
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1">
            {allRegisteredCases.map((c) => {
              const isSelected = c.id === activeCase.id || c.ref === activeCase.ref;
              return (
                <div
                  key={c.id || c.ref}
                  onClick={() => handleSelectCase(c)}
                  className={`p-3 rounded-md border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-blue-50/90 border-blue-600 ring-2 ring-blue-500/30 shadow-xs'
                      : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white text-slate-800 border border-slate-200">
                        {c.ref}
                      </span>
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                        c.urgency.includes('24H') || c.urgency.includes('48H')
                          ? 'bg-red-100 text-red-800'
                          : c.urgency.includes('30D')
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                      }`}>
                        {c.urgency.replace('_', ' ')}
                      </span>
                    </div>
                    <h4 className={`text-xs font-bold line-clamp-1 ${isSelected ? 'text-blue-950' : 'text-slate-800'}`}>
                      {c.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                      vs. {c.counterParty}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-200/60 text-[10px]">
                    <span className="text-slate-600 font-semibold">{c.category}</span>
                    <span className={`font-bold flex items-center gap-0.5 ${isSelected ? 'text-blue-700 font-extrabold' : 'text-slate-400'}`}>
                      {isSelected ? '● Active' : 'Track →'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Statutory Tracker Details Card */}
      <div className="gov-card p-6 sm:p-8 border-slate-300 shadow-sm space-y-8 bg-white">
        
        {/* Case Meta & Live Statutory Clock */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-1 text-center lg:text-left w-full lg:w-auto">
            <div className="flex items-center gap-2 flex-wrap justify-center lg:justify-start">
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200">
                {activeCase.category}
              </span>
              <span className="text-xs text-[#059669] flex items-center gap-1 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <ShieldCheck className="w-4 h-4" />
                <span>{isHi ? 'वैधानिक समय-सीमा सक्रिय' : 'Live Statutory Limitation Clock'}</span>
              </span>
              {activeCase.isUserCreated && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                  {isHi ? 'हाल ही में पंजीकृत' : 'Freshly Registered'}
                </span>
              )}
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[#0A2540] font-mono pt-1">
              {isHi ? 'केस संदर्भ:' : 'Case Reference ID:'} <span className="text-[#1E3A8A] font-extrabold">{activeCase.ref}</span>
            </h3>

            <h4 className="text-sm font-bold text-slate-800">
              {activeCase.title}
            </h4>

            <p className="text-xs text-slate-600">
              {isHi ? 'विपक्षी पक्ष / संबंधित अधिकरण:' : 'Opposite Party / Regulatory Authority:'} <strong className="text-slate-900 underline">{activeCase.counterParty}</strong>
            </p>
            
            <div className="pt-1 text-[11px] text-slate-500 flex items-center gap-2 justify-center lg:justify-start">
              <span>📅 {isHi ? 'पंजीकरण:' : 'Registered:'} <strong>{formatOffsetDate(activeCase.registeredAt, 0)}</strong></span>
              <span>•</span>
              <span>⚖️ {isHi ? 'वैधानिक सीमा:' : 'Statutory Limit:'} <strong>{activeCase.timelineDays} {isHi ? 'दिन' : 'Days'}</strong></span>
            </div>
          </div>

          {/* Real-Time Second-by-Second Countdown Clock Box */}
          <div className="bg-slate-50 p-4 rounded-md border border-slate-200 text-center w-full sm:w-auto min-w-[300px] shadow-xs">
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="text-[10px] font-extrabold text-[#D97706] uppercase tracking-wider block">
                {activeCase.timelineDays <= 1 
                  ? (isHi ? '24-घंटे अनिवार्य पुलिस/इनक्वेस्ट घड़ी' : '24-Hour Mandatory Police & Inquest Clock')
                  : activeCase.timelineDays === 2 
                    ? (isHi ? '48-घंटे आपातकालीन चिकित्सा स्थिरीकरण घड़ी' : '48-Hour Emergency Medical Compliance Clock')
                    : activeCase.timelineDays === 30 
                      ? (isHi ? '30-दिवसीय वैधानिक परिसीमा घड़ी' : '30-Day Statutory Limitation Clock')
                      : (isHi ? '15-दिवसीय विधिक नोटिस प्रत्युत्तर घड़ी' : '15-Day Statutory Notice Response Clock')}
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" title="Live Clock Active" />
            </div>

            <div className="flex items-center justify-center gap-1.5 font-mono">
              <div className="bg-white border border-slate-300 px-2.5 py-1.5 rounded shadow-2xs">
                <span className="text-lg sm:text-xl font-extrabold text-[#0A2540]">{String(timeLeft.days).padStart(2, '0')}</span>
                <span className="text-[9px] text-slate-500 block font-sans font-semibold">{isHi ? 'दिन' : 'DAYS'}</span>
              </div>
              <span className="text-lg text-slate-400 font-bold">:</span>
              <div className="bg-white border border-slate-300 px-2.5 py-1.5 rounded shadow-2xs">
                <span className="text-lg sm:text-xl font-extrabold text-[#0A2540]">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-[9px] text-slate-500 block font-sans font-semibold">{isHi ? 'घंटे' : 'HRS'}</span>
              </div>
              <span className="text-lg text-slate-400 font-bold">:</span>
              <div className="bg-white border border-slate-300 px-2.5 py-1.5 rounded shadow-2xs">
                <span className="text-lg sm:text-xl font-extrabold text-[#0A2540]">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-[9px] text-slate-500 block font-sans font-semibold">{isHi ? 'मिनट' : 'MIN'}</span>
              </div>
              <span className="text-lg text-slate-400 font-bold">:</span>
              <div className="bg-white border border-red-200 bg-red-50/20 px-2.5 py-1.5 rounded shadow-2xs">
                <span className="text-lg sm:text-xl font-extrabold text-red-700">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="text-[9px] text-red-600 block font-sans font-semibold">{isHi ? 'सेकंड' : 'SEC'}</span>
              </div>
            </div>

            <span className="text-[10px] text-slate-500 mt-2 block font-medium">
              {timeLeft.isExpired 
                ? (isHi ? '⚠️ वैधानिक समय-सीमा समाप्त। तत्काल अधिकरण में याचिका दायर करें।' : '⚠️ Statutory deadline expired. Immediate commission filing required.') 
                : (isHi ? `अंतिम तिथि: ${formatOffsetDate(activeCase.registeredAt, activeCase.timelineDays)}` : `Statutory Expiry: ${formatOffsetDate(activeCase.registeredAt, activeCase.timelineDays)}`)}
            </span>
          </div>
        </div>

        {/* Milestone Progression Timeline */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A2540]">
              {isHi ? 'वैधानिक मील का पत्थर प्रगति (Statutory Milestone Progression):' : 'STATUTORY MILESTONE PROGRESSION:'}
            </h4>
            <span className="text-[11px] text-slate-500 font-semibold">
              {isHi ? 'शिकायत पंजीकरण से स्वचालित तिथियां' : 'Automated dates from complaint registration'}
            </span>
          </div>

          <div className="space-y-3">
            {milestones.map((m, idx) => {
              const isCompleted = m.status === 'COMPLETED';
              const isInProgress = m.status === 'IN_PROGRESS';

              return (
                <div 
                  key={idx} 
                  className={`p-4 rounded-md border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isCompleted 
                      ? 'border-emerald-200 bg-emerald-50/20' 
                      : isInProgress 
                        ? 'border-amber-300 bg-amber-50/30 ring-1 ring-amber-400/20' 
                        : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                      isCompleted 
                        ? 'bg-[#059669] text-white' 
                        : isInProgress 
                          ? 'bg-[#D97706] text-white animate-pulse' 
                          : 'bg-slate-100 text-slate-500'
                    }`}>
                      {isCompleted ? '✓' : idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h5 className="text-xs sm:text-sm font-bold text-[#0A2540]">{m.title}</h5>
                        {isInProgress && (
                          <span className="text-[9px] font-extrabold px-2 py-0.2 rounded bg-amber-200 text-amber-900 animate-pulse">
                            {isHi ? 'प्रक्रियाधीन' : 'IN PROGRESS'}
                          </span>
                        )}
                        {isCompleted && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                            {isHi ? 'पूर्ण' : 'COMPLETED'}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5 leading-relaxed">{m.desc}</p>
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono flex-shrink-0 self-end sm:self-center bg-white px-2 py-1 rounded border border-slate-200">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{m.date}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Toolbar for Chosen Case */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <FileText className="w-4 h-4 text-blue-900" />
            <span>{isHi ? `केस ${activeCase.ref} का वैधानिक दस्तावेज़ तैयार है।` : `Legal notice and dossier for ${activeCase.ref} ready.`}</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            <button
              onClick={() => setIsDispatchRelayOpen(true)}
              className="flex-1 sm:flex-none px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{isHi ? '📱 व्हाट्सएप / ईमेल रिले' : '📱 1-Click Dispatch Relay'}</span>
            </button>

            <button
              onClick={() => setActiveTab('drafting')}
              className="flex-1 sm:flex-none px-4 py-2 rounded bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <span>{isHi ? 'विधिक नोटिस ड्राफ्ट देखें' : 'View Notice & PDF in Studio'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Sub-modal: 1-Click Dispatch Relay for Active Case */}
      <LegalDispatchRelayModal
        isOpen={isDispatchRelayOpen}
        onClose={() => setIsDispatchRelayOpen(false)}
        draftData={{
          referenceId: activeCase?.ref || 'NYA-2026-LIVE',
          authorityName: activeCase?.counterParty || 'Opposite Party / Grievance Officer',
          authorityAddress: 'Corporate Headquarters / Nodal Office',
          subject: activeCase?.title || 'Formal Statutory Pre-Litigation Legal Notice',
          statutoryAct: activeCase?.category || 'Consumer Protection Act, 2019',
          statutoryNoticePeriodDays: activeCase?.timelineDays || 15,
          applicantName: 'Tanvi Makhija',
          applicantPhone: '+91 98765 43210',
          facts: activeCase?.summary || activeCase?.rawText,
          prayer: `Immediate compliance, full restitution, and statutory compensation within ${activeCase?.timelineDays || 15} days.`
        }}
      />

    </div>
  );
};
