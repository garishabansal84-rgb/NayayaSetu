import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCase } from '../../context/CaseContext';
import { 
  BookOpen, Search, Scale, ChevronDown, ChevronUp, 
  ExternalLink, FileText, ShieldAlert, CheckCircle2, ArrowRight, Sparkles, Filter 
} from 'lucide-react';

export const KnowledgeWiki = () => {
  const { language, t } = useLanguage();
  const { setCurrentGrievance, setActiveTab } = useCase();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [expandedId, setExpandedId] = useState('bns_dowry_80');

  const isHi = language === 'hi';

  const CATEGORIES = [
    { id: 'ALL', name: isHi ? 'सभी अधिनियम (All Acts)' : 'All Acts' },
    { id: 'WOMEN_CRIMINAL', name: isHi ? 'महिला व विवाह अधिकार' : 'Women & Matrimonial' },
    { id: 'CRIMINAL_POLICE', name: isHi ? 'आपराधिक न्याय व पुलिस' : 'Criminal & Police' },
    { id: 'SOCIAL_JUSTICE', name: isHi ? 'सामाजिक न्याय व दिव्यांगजन' : 'Social Justice & Equality' },
    { id: 'CONSTITUTION', name: isHi ? 'संवैधानिक अधिकार' : 'Constitutional Rights' },
    { id: 'HEALTHCARE', name: isHi ? 'स्वास्थ्य व आपातकालीन' : 'Healthcare & Emergency' },
    { id: 'PROPERTY_HOUSING', name: isHi ? 'संपत्ति, भूमि व रेरा' : 'Property & Housing' },
    { id: 'CONSUMER_BANKING', name: isHi ? 'उपभोक्ता व बैंकिंग' : 'Consumer & Banking' },
    { id: 'DIGITAL_PRIVACY', name: isHi ? 'डिजिटल डेटा व साइबर' : 'Digital & Cyber' },
    { id: 'LABOR_WORKPLACE', name: isHi ? 'श्रम व कार्यस्थल' : 'Labor & Workplace' },
    { id: 'CIVIC_RTI', name: isHi ? 'आरटीआई व नागरिक' : 'Civic & RTI' }
  ];

  const legalGuides = useMemo(() => [
    {
      id: 'bns_dowry_80',
      act: 'Bharatiya Nyaya Sanhita, 2023 (BNS), BSA & Dowry Prohibition Act',
      categoryTag: 'WOMEN_CRIMINAL',
      category: isHi ? 'दहेज मृत्यु, क्रूरता एवं महिला अधिकार' : 'Dowry Death, Cruelty & Women Rights',
      summary: isHi
        ? 'विवाह के 7 वर्ष में अप्राकृतिक मृत्यु पर गैर-जमानती दहेज मृत्यु केस (धारा 80 BNS) और अदालत की अनिवार्य उपधारणा (धारा 118 BSA)। पति का "उपहार" या "विवाद" का दावा कानूनन खारिज होता है। NALSA के तहत 100% मुफ्त सरकारी वकील।'
        : 'Dowry death within 7 years of marriage (Sec 80 BNS / 304B IPC), mandatory statutory presumption against husband/in-laws (Sec 118 BSA), and 100% free legal aid (NALSA 14468). Husband claims of "voluntary gifts" are legally untenable.',
      keySections: [
        { 
          sec: 'Section 80 BNS', 
          desc: isHi 
            ? 'दहेज मृत्यु: विवाह के 7 वर्ष में अप्राकृतिक मृत्यु व प्रताड़ना पर न्यूनतम 7 वर्ष से आजीवन कारावास।' 
            : 'Dowry Death: Unnatural death within 7 years of marriage with dowry harassment. Min 7 years to Life Imprisonment.' 
        },
        { 
          sec: 'Section 118 BSA', 
          desc: isHi 
            ? 'अनिवार्य वैधानिक उपधारणा: अदालत अनिवार्य रूप से मानेगी कि ससुराल पक्ष ने ही मृत्यु कारित की है।' 
            : 'Mandatory Statutory Presumption: Court SHALL presume husband/in-laws caused the dowry death.' 
        },
        { 
          sec: 'Section 85 & 86 BNS', 
          desc: isHi 
            ? 'ससुराल पक्ष द्वारा महिला पर क्रूरता व अवैध संपत्ति मांग पर 3 वर्ष का कठोर कारावास।' 
            : 'Cruelty by Husband or In-Laws: Physical/mental cruelty and unlawful property demands.' 
        },
        { 
          sec: 'Sec 6 Dowry Act', 
          desc: isHi 
            ? 'स्त्रीधन की कानूनी सुरक्षा: सारा स्त्रीधन पीड़िता के माता-पिता/उत्तराधिकारियों को लौटाना अनिवार्य।' 
            : 'Stridhan Mandate: Mandatory transfer of all dowry/stridhan properties to woman or her legal heirs.' 
        }
      ],
      actionPrompt: 'A woman died within 7 years of marriage after repeated demands of ₹5 lakh and a car by husband and in-laws.'
    },
    {
      id: 'pwdva_2005',
      act: 'Protection of Women from Domestic Violence Act, 2005 (PWDVA)',
      categoryTag: 'WOMEN_CRIMINAL',
      category: isHi ? 'घरेलू हिंसा से महिला संरक्षण' : 'Domestic Violence & Residence Rights',
      summary: isHi
        ? 'ससुराल के साझे घर में रहने का कानूनी अधिकार (Right to Residence), संरक्षण आदेश (Protection Orders) और 3 दिन में अंतरिम गुजारा भत्ता।'
        : 'Statutory right to reside in shared household, protection orders against abuse, and interim maintenance within 3 days.',
      keySections: [
        { 
          sec: 'Section 17 & 19', 
          desc: isHi 
            ? 'साझे घर में निवास का अधिकार: महिला को ससुराल के घर से गैरकानूनी रूप से नहीं निकाला जा सकता।' 
            : 'Right to reside in shared household; injunction against unlawful eviction by in-laws.' 
        },
        { 
          sec: 'Section 18', 
          desc: isHi 
            ? 'मजिस्ट्रेट द्वारा संरक्षण आदेश: घरेलू हिंसा और संपर्क करने पर तुरंत रोक।' 
            : 'Protection orders restraining respondent from committing acts of domestic violence.' 
        },
        { 
          sec: 'Section 20 & 22', 
          desc: isHi 
            ? 'मासिक वित्तीय राहत, चिकित्सा खर्च एवं मानसिक यातना के लिए क्षतिपूर्ति।' 
            : 'Monetary relief, monthly maintenance, and compensation for emotional trauma.' 
        }
      ],
      actionPrompt: 'My husband and in-laws are physically abusing me and threatening to evict me from our matrimonial home.'
    },
    {
      id: 'sc_st_poa_1989',
      act: 'SC & ST (Prevention of Atrocities) Act, 1989 (Amended 2018)',
      categoryTag: 'SOCIAL_JUSTICE',
      category: isHi ? 'अनुसूचित जाति/जनजाति अत्याचार निवारण अधिकार' : 'SC/ST Protection & Anti-Atrocities Rights',
      summary: isHi
        ? 'एससी/एसटी वर्ग के प्रति जातिगत गाली-गलौज, उत्पीड़न, जमीन पर अवैध कब्जे पर तुरंत गैर-जमानती गिरफ्तारी (धारा 18A) और ₹85,000 से ₹8.25 लाख तक की अनिवार्य सरकारी राहत।'
        : 'Strict non-bailable arrest without preliminary inquiry (Sec 18A), exclusive Special Courts, and statutory victim relief of ₹85,000 to ₹8.25 Lakh under Ministry of Social Justice norms.',
      keySections: [
        { 
          sec: 'Section 3(1) & 3(2)', 
          desc: isHi 
            ? 'जातिगत अपमान, धमकी, मारपीट व भूमि बेदखली पर कठोर कारावास व जुर्माना।' 
            : 'Offences of atrocities, intentional insult, and dispossession punishable with rigorous imprisonment.' 
        },
        { 
          sec: 'Section 18 & 18A', 
          desc: isHi 
            ? 'अग्रिम जमानत पर पूर्ण प्रतिबंध; बिना किसी पूर्व अनुमति के अभियुक्त की तत्काल गिरफ्तारी का प्रावधान।' 
            : 'Bar on anticipatory bail; immediate arrest without preliminary enquiry or prior sanction.' 
        },
        { 
          sec: 'Helpline 14566', 
          desc: isHi 
            ? 'राष्ट्रीय अत्याचार निवारण हेल्पलाइन (National Helpline for Prevention of Atrocities - 24x7)।' 
            : 'National Helpline for Prevention of Atrocities (NHPA Toll-Free: 14566) for direct monitoring.' 
        }
      ],
      actionPrompt: 'A dominant caste landlord hurled casteist slurs and unlawfully dispossessed an SC family from their allotted land.'
    },
    {
      id: 'senior_citizens_2007',
      act: 'Maintenance and Welfare of Parents and Senior Citizens Act, 2007',
      categoryTag: 'SOCIAL_JUSTICE',
      category: isHi ? 'वरिष्ठ नागरिक एवं माता-पिता भरण-पोषण अधिकार' : 'Senior Citizens & Parents Welfare Rights',
      summary: isHi
        ? 'बुजुर्ग माता-पिता को बच्चों से अनिवार्य मासिक भरण-पोषण पाने और सेवा न करने पर दी गई संपत्ति/गिफ्ट डीड को धारा 23 के तहत शून्य (रद्द) कराने का अधिकार।'
        : 'Statutory right to claim monthly maintenance via SDM Tribunal and power to CANCEL/REVOKE property transfer/gift deed under Section 23 if children neglect parents.',
      keySections: [
        { 
          sec: 'Section 4 & 5', 
          desc: isHi 
            ? 'एसडीएम भरण-पोषण अधिकरण द्वारा बच्चों से प्रति माह अनिवार्य गुजारा भत्ता का आदेश।' 
            : 'Mandatory monthly maintenance allowance ordered by Maintenance Tribunal (SDM).' 
        },
        { 
          sec: 'Section 23', 
          desc: isHi 
            ? 'गिफ्ट डीड / संपत्ति अंतरण रद्दीकरण: यदि बच्चे देखभाल न करें तो अंतरित संपत्ति वापस पाने का अधिकार।' 
            : 'Revocation of Property Transfer: Property gift/transfer deemed VOID if children fail to provide basic amenities.' 
        },
        { 
          sec: 'Elder Line 14567', 
          desc: isHi 
            ? 'वरिष्ठ नागरिकों हेतु राष्ट्रीय हेल्पलाइन (Elder Line 14567)।' 
            : 'National Helpline for Senior Citizens (Elder Line: 14567) for emergency rescue and legal aid.' 
        }
      ],
      actionPrompt: 'My son took ownership of our ancestral house via gift deed and has now abandoned us and refuses basic food and medical care.'
    },
    {
      id: 'rpwd_act_2016',
      act: 'Rights of Persons with Disabilities Act, 2016 (RPwD Act)',
      categoryTag: 'SOCIAL_JUSTICE',
      category: isHi ? 'दिव्यांगजन अधिकार एवं गैर-भेदभाव' : 'Disability Rights & Accessibility Mandate',
      summary: isHi
        ? 'दिव्यांगजनों के साथ किसी भी प्रकार के भेदभाव पर रोक, सार्वजनिक भवनों में सुगम्यता (Accessibility) और अपमान/प्रताड़ना पर 5 वर्ष तक की जेल (धारा 92)।'
        : 'Statutory non-discrimination, 4% public employment reservation, accessible public infrastructure, and 5-year imprisonment for insults/assaults under Section 92.',
      keySections: [
        { 
          sec: 'Section 3 & 4', 
          desc: isHi 
            ? 'समानता, मानवीय गरिमा और सरकारी/निजी क्षेत्र में यथोचित समायोजन (Reasonable Accommodation) का अधिकार।' 
            : 'Guarantees equality, non-discrimination, and reasonable accommodation in employment and education.' 
        },
        { 
          sec: 'Section 92', 
          desc: isHi 
            ? 'दिव्यांग व्यक्ति का सार्वजनिक अपमान या प्रताड़ना करने पर 6 माह से 5 वर्ष तक का कारावास।' 
            : 'Punishment of 6 months to 5 years imprisonment for humiliating or assaulting persons with disabilities.' 
        }
      ],
      actionPrompt: 'A public transport authority and government office denied accessible wheelchair ramp entry to a person with disability.'
    },
    {
      id: 'transgender_2019',
      act: 'Transgender Persons (Protection of Rights) Act, 2019',
      categoryTag: 'SOCIAL_JUSTICE',
      category: isHi ? 'उभयलिंगी (ट्रांसजेंडर) व्यक्ति अधिकार' : 'Transgender Equality & Protection',
      summary: isHi
        ? 'शिक्षा, रोजगार और स्वास्थ्य सेवाओं में ट्रांसजेंडर व्यक्तियों के साथ भेदभाव पर पूर्ण प्रतिबंध एवं डीएम से पहचान प्रमाण पत्र का अधिकार।'
        : 'Prohibits discrimination in education, employment, healthcare, and recognizes self-perceived gender identity certificate issued by DM.',
      keySections: [
        { 
          sec: 'Section 3', 
          desc: isHi ? 'रोजगार, शिक्षा और सार्वजनिक सेवाओं में भेदभाव पर पूर्ण रोक।' : 'Prohibition against discrimination in all establishments.' 
        },
        { 
          sec: 'Section 18', 
          desc: isHi ? 'ट्रांसजेंडर व्यक्तियों से दुर्व्यवहार या जबरन श्रम कराने पर 2 वर्ष तक की जेल।' : 'Penalties for physical, verbal, sexual or economic abuse.' 
        }
      ],
      actionPrompt: 'A private employer terminated an employee solely on grounds of gender transition and identity.'
    },
    {
      id: 'bnss_fir_173',
      act: 'Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS) & Citizen Police Rights',
      categoryTag: 'CRIMINAL_POLICE',
      category: isHi ? 'नागरिक पुलिस अधिकार एवं अनिवार्य एफआईआर' : 'Citizen Police Rights & Mandatory FIR',
      summary: isHi
        ? 'संज्ञेय अपराध में पुलिस द्वारा बिना देरी एफआईआर दर्ज करना अनिवार्य (ललिता कुमारी फैसला)। देश के किसी भी थाने में जीरो एफआईआर (Zero FIR) का अधिकार।'
        : 'Mandatory FIR registration for cognizable crimes by police (Lalita Kumari landmark). Right to lodge Zero FIR anywhere in India.',
      keySections: [
        { 
          sec: 'Section 173 BNSS', 
          desc: isHi 
            ? 'संज्ञेय अपराध की सूचना पर तुरंत एफआईआर और निःशुल्क प्रमाणित प्रति का अधिकार।' 
            : 'Mandatory FIR registration upon disclosure of cognizable offence (Zero FIR).' 
        },
        { 
          sec: 'Section 175(3) BNSS', 
          desc: isHi 
            ? 'थानेदार के मना करने पर सीधे पुलिस अधीक्षक (SP) को डाक द्वारा शिकायत भेजने का अधिकार।' 
            : 'Direct escalation to Superintendent of Police (SP) upon refusal by SHO.' 
        },
        { 
          sec: 'Section 175(4) BNSS', 
          desc: isHi 
            ? 'न्यायिक मजिस्ट्रेट (156(3) CrPC) द्वारा पुलिस को एफआईआर दर्ज करने का सीधा आदेश।' 
            : 'Application before Judicial Magistrate to command police to register FIR and investigate.' 
        }
      ],
      actionPrompt: 'The local police SHO refused to register my FIR for a cognizable criminal assault and intimidation.'
    },
    {
      id: 'hsa_daughter_6',
      act: 'Hindu Succession Act, 1956 (Section 6) & Property Succession',
      categoryTag: 'PROPERTY_HOUSING',
      category: isHi ? 'पैतृक संपत्ति में बेटियों का समान अधिकार' : 'Daughter Equal Coparcenary Property Rights',
      summary: isHi
        ? 'बेटियों को जन्म से ही पैतृक संपत्ति में बेटों के बराबर समान सहदायिकी अधिकार (सुप्रीम कोर्ट विनीता शर्मा फैसला)।'
        : 'Daughters are equal coparceners by birth in ancestral property with identical rights and shares as sons (Vineeta Sharma SC landmark).',
      keySections: [
        { 
          sec: 'Section 6 HSA', 
          desc: isHi 
            ? 'पैतृक संपत्ति में जन्म से समान सहदायिकी (Coparcenary) हिस्सा और विभाजन का अधिकार।' 
            : 'Equal coparcenary rights by birth; right to claim partition and separate possession.' 
        },
        { 
          sec: 'State Revenue Code', 
          desc: isHi 
            ? 'तहसीलदार न्यायालय में 30 दिनों में जमीन के सरकारी कागजात में अनिवार्य नामांतरण (Mutation)।' 
            : 'Mandatory 30-day land record mutation (Namantaran) upon inheritance.' 
        }
      ],
      actionPrompt: 'My brothers are refusing to give me my equal share in my deceased father’s ancestral property.'
    },
    {
      id: 'mva_1988',
      act: 'Motor Vehicles Act, 1988 (Amended 2019) & Emergency Healthcare Mandate',
      categoryTag: 'HEALTHCARE',
      category: isHi ? 'सड़क दुर्घटना एवं आपातकालीन चिकित्सा अधिकार' : 'Accident & Emergency Medical Rights',
      summary: isHi
        ? 'सड़क दुर्घटना पीड़ितों के इलाज में देरी या अग्रिम पैसे की मांग पर पूर्ण प्रतिबंध। धारा 134A के तहत मददगार (Good Samaritan) को कानूनी सुरक्षा।'
        : 'Strictly bans demanding advance payment or police formalities before treating road accident victims. Section 134A protects Good Samaritans from any harassment.',
      keySections: [
        { 
          sec: 'Section 134(a)', 
          desc: isHi 
            ? 'डॉक्टर और अस्पताल का अनिवार्य कर्तव्य: दुर्घटना पीड़ित को बिना पुलिस रिपोर्ट या अग्रिम पैसे के तत्काल चिकित्सा सहायता दें।' 
            : 'Mandatory statutory duty of doctor/hospital to immediately attend to accident victims without procedural delay or advance payment.' 
        },
        { 
          sec: 'Section 134A', 
          desc: isHi 
            ? 'नेक मददगार संरक्षण: घायल को अस्पताल पहुंचाने वाले व्यक्ति पर कोई सिविल या आपराधिक दायित्व नहीं।' 
            : 'Good Samaritan Protection: No civil or criminal liability or forced witness interrogation on bystanders aiding victims.' 
        },
        { 
          sec: 'Section 166', 
          desc: isHi 
            ? 'मोटर दुर्घटना दावा अधिकरण (MACT) के समक्ष मुआवजे का वैधानिक दावा।' 
            : 'Compensation claim application before Motor Accidents Claims Tribunal (MACT).' 
        }
      ],
      actionPrompt: 'A private hospital refused to admit an accident victim demanding ₹50,000 cash advance before emergency stabilization.'
    },
    {
      id: 'cea_2010',
      act: 'Clinical Establishments (Registration and Regulation) Act, 2010',
      categoryTag: 'HEALTHCARE',
      category: isHi ? 'अस्पताल एवं मरीज अधिकार' : 'Hospital & Patient Rights',
      summary: isHi
        ? 'भारत के सभी निजी और सरकारी अस्पतालों को आपातकालीन स्थिति में मरीज को स्थिर (stabilize) करना कानूनी रूप से अनिवार्य बनाता है।'
        : 'Mandates every clinical establishment (private or public) to immediately provide emergency medical treatment and stabilization without upfront payment demands.',
      keySections: [
        { 
          sec: 'Section 12(2)', 
          desc: isHi 
            ? 'आपातकालीन चिकित्सा स्थिरीकरण की अनिवार्यता (बिना अग्रिम नकदी जमा के)।' 
            : 'Mandatory provision of emergency medical examination and treatment to stabilize patient condition.' 
        },
        { 
          sec: 'Section 41', 
          desc: isHi 
            ? 'आपातकालीन नियमों का उल्लंघन करने वाले अस्पतालों पर ₹5 लाख तक का जुर्माना और लाइसेंस रद्द करने का प्रावधान।' 
            : 'Penalties of up to ₹5,00,000 and cancellation of registration for refusing emergency stabilization.' 
        }
      ],
      actionPrompt: 'A private hospital denied emergency ICU admission due to inability to deposit cash advance.'
    },
    {
      id: 'pmjay_nha',
      act: 'Ayushman Bharat (PM-JAY) & NHA Anti-Fraud Statutory Framework',
      categoryTag: 'HEALTHCARE',
      category: isHi ? 'आयुष्मान भारत एवं स्वास्थ्य बीमा' : 'Ayushman Bharat & Health Insurance',
      summary: isHi
        ? 'एम्पैनल्ड अस्पतालों में ₹5 लाख तक का 100% कैशलेस इलाज। नकद अग्रिम मांगना 5 गुना जुर्माना और डी-एम्पैनल्मेंट का कारण बनता है।'
        : 'Guarantees 100% cashless treatment up to ₹5 Lakh at empanelled hospitals. Demanding cash advances attracts de-empanelment and 5x penalty under NHA guidelines.',
      keySections: [
        { 
          sec: 'Clause 7.2 NHA', 
          desc: isHi 
            ? '100% कैशलेस इन-पेशेंट और सर्जरी गारंटी (शून्य अग्रिम जमा)।' 
            : '100% Cashless treatment guarantee for all secondary/tertiary packages.' 
        },
        { 
          sec: 'Clause 14 NHA', 
          desc: isHi 
            ? 'मरीज से नकदी मांगने वाले अस्पताल का डी-एम्पैनल्मेंट और 5 गुना वसूली।' 
            : 'De-empanelment and 5 times penalty recovery for fraudulent out-of-pocket charges.' 
        },
        { 
          sec: 'Helpline 14555', 
          desc: isHi 
            ? '24x7 राष्ट्रीय आपातकालीन आयुष्मान शिकायत निवारण हॉटलाइन।' 
            : '24x7 NHA National Emergency Helpline for instant State Health Agency intervention.' 
        }
      ],
      actionPrompt: 'An empanelled hospital refused cashless treatment under Ayushman Bharat and demanded cash advance.'
    },
    {
      id: 'cpa_2019',
      act: 'Consumer Protection Act, 2019 & E-Commerce Rules',
      categoryTag: 'CONSUMER_BANKING',
      category: isHi ? 'उपभोक्ता संरक्षण एवं ई-कॉमर्स अधिकार' : 'Consumer Rights & E-Commerce',
      summary: isHi 
        ? 'जिला आयोगों में ₹50 लाख तक की सुनवाई, दोषपूर्ण उत्पाद पर रिफंड, और ई-कॉमर्स में भ्रामक विज्ञापनों पर रोक।'
        : 'Pecuniary jurisdiction up to ₹50 Lakh for District Commissions, product liability, and strict ban on unfair return cancellations.',
      keySections: [
        { 
          sec: 'Section 2(11)', 
          desc: isHi ? 'सेवा में कमी (Deficiency of Service) की कानूनी परिभाषा।' : 'Deficiency of Service definition and liabilities.' 
        },
        { 
          sec: 'Section 2(47)', 
          desc: isHi ? 'अनुचित व्यापार व्यवहार (Unfair Trade Practice) पर सख्त प्रतिबंध।' : 'Unfair Trade Practices prohibiting arbitrary refund rejections.' 
        },
        { 
          sec: 'Section 35', 
          desc: isHi ? 'जिला उपभोक्ता आयोग (DCDRC) में ऑनलाइन ई-दाखिल शिकायत दर्ज करने का अधिकार।' : 'Formal consumer complaint filing procedure before DCDRC.' 
        }
      ],
      actionPrompt: 'My online order was defective and seller refused refund within the return window.'
    },
    {
      id: 'mta_2021',
      act: 'Model Tenancy Act, 2021 & State Rent Control Acts',
      categoryTag: 'PROPERTY_HOUSING',
      category: isHi ? 'किरायेदारी, रेंट व बेदखली संरक्षण' : 'Tenancy, Rent & Eviction',
      summary: isHi
        ? 'सिक्योरिटी डिपॉजिट अधिकतम 2 महीने का किराया। घर खाली करने के 30 दिनों में अनिवार्य वापसी।'
        : 'Limits security deposit to 2 months rent for residential premises. Mandates 30-day return on handover.',
      keySections: [
        { 
          sec: 'Section 11', 
          desc: isHi ? 'सिक्योरिटी डिपॉजिट सीमा और 30 दिनों में अनिवार्य वापसी।' : 'Security Deposit cap & mandatory 30-day refund window upon vacating.' 
        },
        { 
          sec: 'Section 21', 
          desc: isHi ? 'रेंट अथॉरिटी के आदेश के बिना गैरकानूनी बेदखली पर रोक।' : 'Protection against unlawful eviction without Rent Authority decree.' 
        }
      ],
      actionPrompt: 'My landlord has not returned my security deposit after vacating flat in good condition.'
    },
    {
      id: 'rera_2016',
      act: 'Real Estate (Regulation and Development) Act (RERA), 2016',
      categoryTag: 'PROPERTY_HOUSING',
      category: isHi ? 'रियल एस्टेट एवं होमबायर अधिकार' : 'Real Estate & Homebuyer Rights',
      summary: isHi
        ? 'बिल्डर द्वारा फ्लैट पजेशन में देरी पर ब्याज सहित पूरा पैसा वापस पाने या मासिक विलंब ब्याज प्राप्त करने का कानूनी अधिकार।'
        : 'Mandates full refund with SBI MCLR + 2% interest if developer delays handover, and provides 5-year structural defect warranty.',
      keySections: [
        { 
          sec: 'Section 18', 
          desc: isHi ? 'पजेशन में देरी पर ब्याज सहित पूर्ण रिफंड या मासिक विलंब मुआवजा।' : 'Mandatory return of principal consideration with interest on possession delay.' 
        },
        { 
          sec: 'Section 31', 
          desc: isHi ? 'राज्य रेरा प्राधिकरण (RERA Authority) में सीधे ऑनलाइन शिकायत दर्ज करने का अधिकार।' : 'Direct complaint filing before State RERA Authority.' 
        }
      ],
      actionPrompt: 'My builder has delayed flat possession by 2 years and refuses to pay delay interest.'
    },
    {
      id: 'electricity_2003',
      act: 'Electricity Act, 2003 & Consumer Supply Code',
      categoryTag: 'CONSUMER_BANKING',
      category: isHi ? 'बिजली उपभोक्ता अधिकार एवं बिलिंग विवाद' : 'Electricity Consumer Rights',
      summary: isHi
        ? '15 दिन के लिखित नोटिस के बिना बिजली कनेक्शन काटने पर रोक और मीटर जांच का अधिकार।'
        : 'Requires mandatory 15-day clear written notice before disconnecting electricity and provides dispute resolution via CGRF.',
      keySections: [
        { 
          sec: 'Section 56(1)', 
          desc: isHi ? 'बिना 15 दिन के अग्रिम नोटिस के बिजली कनेक्शन काटने पर कानूनी रोक।' : 'Mandatory 15 days clear written notice before disconnection.' 
        },
        { 
          sec: 'Section 42(5)', 
          desc: isHi ? 'उपभोक्ता शिकायत निवारण फोरम (CGRF) और लोकपाल का गठन।' : 'Statutory redressal forum (CGRF) and Electricity Ombudsman.' 
        }
      ],
      actionPrompt: 'Electricity department disconnected my power supply without 15-day notice on a disputed surge bill.'
    },
    {
      id: 'rbi_ombudsman',
      act: 'Reserve Bank of India (RBI Integrated Ombudsman Scheme, 2021)',
      categoryTag: 'CONSUMER_BANKING',
      category: isHi ? 'बैंकिंग एवं साइबर फ्रॉड सुरक्षा' : 'Banking & Cyber Fraud Protection',
      summary: isHi
        ? 'अनधिकृत डिजिटल ट्रांजेक्शन की 3 दिन में सूचना देने पर ग्राहक की शून्य देयता (Zero Liability)।'
        : 'Zero customer liability for unauthorized third-party digital banking fraud reported within 3 days under RBI Master Direction.',
      keySections: [
        { 
          sec: 'RBI Zero Liability', 
          desc: isHi ? '3 कार्य दिवसों में फ्रॉड की सूचना देने पर बैंक को 10 दिन में पूरी राशि लौटानी होगी।' : 'Full credit reversal within 10 days for unauthorized fraud.' 
        },
        { 
          sec: 'Helpline 1930', 
          desc: isHi ? 'राष्ट्रीय वित्तीय साइबर धोखाधड़ी हेल्पलाइन (cybercrime.gov.in)।' : 'National Cyber Crime Reporting Helpline 1930 for immediate fund freezing.' 
        }
      ],
      actionPrompt: 'An unauthorized UPI transaction occurred from my bank account and the bank refused to reverse the funds.'
    },
    {
      id: 'dpdp_2023',
      act: 'Digital Personal Data Protection Act, 2023 (DPDP) & IT Act, 2000',
      categoryTag: 'DIGITAL_PRIVACY',
      category: isHi ? 'डिजिटल डेटा गोपनीयता व साइबर अधिकार' : 'Digital Privacy & Data Protection',
      summary: isHi
        ? 'नागरिकों के व्यक्तिगत डेटा का दुरुपयोग करने वाली कंपनियों पर ₹250 करोड़ तक का जुर्माना और डेटा मिटाने का अधिकार।'
        : 'Protects citizens against unauthorized personal data harvesting and spam; imposes penalties up to ₹250 Crores on defaulting platforms.',
      keySections: [
        { 
          sec: 'Section 6 DPDP', 
          desc: isHi ? 'डेटा प्रोसेसिंग के लिए स्पष्ट, विशिष्ट और सूचित सहमति अनिवार्य।' : 'Requirement of free, specific, and informed consent for data processing.' 
        },
        { 
          sec: 'Section 43A IT Act', 
          desc: isHi ? 'डेटा लीक व लापरवाही पर कंपनी द्वारा नागरिक को मुआवजा।' : 'Compensation for failure to protect sensitive citizen personal data.' 
        }
      ],
      actionPrompt: 'A fintech app leaked my personal banking details and phone number to unauthorized third-party advertisers.'
    },
    {
      id: 'posh_2013',
      act: 'Sexual Harassment of Women at Workplace (POSH) Act, 2013',
      categoryTag: 'LABOR_WORKPLACE',
      category: isHi ? 'कार्यस्थल पर महिला यौन उत्पीड़न संरक्षण (POSH)' : 'Workplace Harassment Protection (POSH)',
      summary: isHi
        ? 'हर 10+ कर्मचारियों वाले कार्यालय में आंतरिक शिकायत समिति (ICC) अनिवार्य। 90 दिन में जांच और पीड़िता को अंतरिम ट्रांसफर/अवकाश का अधिकार।'
        : 'Mandates Internal Complaints Committee (ICC) in all workplaces with 10+ employees. 90-day timebound inquiry and interim relief.',
      keySections: [
        { 
          sec: 'Section 4', 
          desc: isHi ? 'आंतरिक शिकायत समिति (ICC) का अनिवार्य गठन।' : 'Mandatory constitution of Internal Complaints Committee (ICC).' 
        },
        { 
          sec: 'Section 12', 
          desc: isHi ? 'जांच के दौरान पीड़िता को सवेतन अवकाश अथवा ट्रांसफर का अंतरिम अधिकार।' : 'Interim relief: Transfer of aggrieved woman or paid leave up to 3 months.' 
        }
      ],
      actionPrompt: 'My employer failed to constitute an Internal Complaints Committee and retaliated against my harassment report.'
    },
    {
      id: 'gratuity_epfo',
      act: 'Payment of Gratuity Act, 1972 & Employees Provident Funds Act',
      categoryTag: 'LABOR_WORKPLACE',
      category: isHi ? 'ग्रेच्युटी व भविष्य निधि (PF) अधिकार' : 'Gratuity, EPF & Employee Terminal Dues',
      summary: isHi
        ? '5 वर्ष सेवा के बाद 30 दिन में ग्रेच्युटी भुगतान अनिवार्य। देरी होने पर कंपनी को 10% वार्षिक चक्रवृद्धि ब्याज देना होगा।'
        : 'Mandates full gratuity payout within 30 days of leaving employment after 5 years service, with 10% compound interest on delays.',
      keySections: [
        { 
          sec: 'Section 7(3)', 
          desc: isHi ? '30 दिनों के भीतर ग्रेच्युटी राशि का अनिवार्य भुगतान।' : 'Employer shall arrange to pay gratuity amount within 30 days.' 
        },
        { 
          sec: 'Section 7(3A)', 
          desc: isHi ? 'भुगतान में देरी पर अनिवार्य ब्याज (10% प्रति वर्ष)।' : 'Mandatory simple/compound interest payable on delayed gratuity.' 
        }
      ],
      actionPrompt: 'My previous employer has withheld my statutory gratuity and PF clearance for over 6 months without reason.'
    },
    {
      id: 'ngt_2010',
      act: 'National Green Tribunal Act, 2010 & Environment Protection Act',
      categoryTag: 'CIVIC_RTI',
      category: isHi ? 'पर्यावरण संरक्षण व प्रदूषण निवारण' : 'Environmental Law & NGT Remedies',
      summary: isHi
        ? 'प्रदूषण फैलाने वाले उद्योगों पर NGT द्वारा तुरंत रोक और प्रभावित नागरिकों को क्षतिपूर्ति (Polluter Pays Principle)।'
        : 'Provides direct citizen recourse to NGT for environmental damage, illegal construction on water bodies, and hazardous industrial effluents.',
      keySections: [
        { 
          sec: 'Section 14 NGT', 
          desc: isHi ? 'पर्यावरण से जुड़े सभी सिविल मामलों पर एनजीटी का सीधा क्षेत्राधिकार।' : 'Jurisdiction over all civil cases involving substantial questions of environment.' 
        },
        { 
          sec: 'Section 15 NGT', 
          desc: isHi ? 'पीड़ित नागरिकों को राहत, मुआवजा और पर्यावरण पुनर्बहाली का आदेश।' : 'Relief, compensation to victims of pollution, and property restitution.' 
        }
      ],
      actionPrompt: 'A chemical processing unit is illegally dumping untreated toxic effluent into our local river and groundwater.'
    },
    {
      id: 'rti_2005',
      act: 'Right to Information Act, 2005 (RTI)',
      categoryTag: 'CIVIC_RTI',
      category: isHi ? 'सूचना का अधिकार एवं सरकारी पारदर्शिता' : 'Right to Information & Transparency',
      summary: isHi
        ? 'प्रत्येक भारतीय नागरिक को 30 दिनों के भीतर प्रमाणित सरकारी रिकॉर्ड और बजट खर्च विवरण प्राप्त करने का अधिकार।'
        : 'Empowers every Indian citizen to seek certified government records, inspect works, and obtain budget allocations within 30 days.',
      keySections: [
        { 
          sec: 'Section 6(1)', 
          desc: isHi ? '₹10 मानक शुल्क के साथ लिखित या ऑनलाइन आरटीआई आवेदन प्रक्रिया।' : 'Application procedure in writing or through electronic means with ₹10 fee.' 
        },
        { 
          sec: 'Section 7(1)', 
          desc: isHi ? 'अनिवार्य 30-दिवसीय समय-सीमा (जीवन और स्वतंत्रता से जुड़ा हो तो 48 घंटे)।' : 'Mandatory 30-day timeline (48 hours if life and liberty is involved).' 
        },
        { 
          sec: 'Section 20', 
          desc: isHi ? 'लापरवाह पीआईओ (PIO) पर ₹250 प्रतिदिन (अधिकतम ₹25,000) का जुर्माना।' : 'Personal penalty of ₹250 per day up to ₹25,000 on errant PIO.' 
        }
      ],
      actionPrompt: 'I want to file an RTI for substandard road construction tender and sanctioned budget in my ward.'
    },
    {
      id: 'lsa_1987',
      act: 'Legal Services Authorities Act, 1987 (NALSA Toll-Free: 14468)',
      categoryTag: 'CIVIC_RTI',
      category: isHi ? 'मुफ्त कानूनी सहायता एवं लोक अदालत' : 'Free Legal Aid & Lok Adalats',
      summary: isHi
        ? 'महिलाओं, बच्चों, एससी/एसटी नागरिकों और आर्थिक रूप से कमजोर व्यक्तियों को 100% मुफ्त सरकारी वकील की कानूनी गारंटी।'
        : 'Guarantees 100% free legal counsel to women, children, SC/ST citizens, industrial workmen, and persons with annual income under ₹3 Lakhs.',
      keySections: [
        { 
          sec: 'Section 12', 
          desc: isHi ? 'पात्र नागरिक श्रेणियों को मुफ्त कानूनी सेवाएं प्रदान करने के कानूनी मानदंड।' : 'Criteria for giving free legal services to eligible citizen categories.' 
        },
        { 
          sec: 'Section 19', 
          desc: isHi ? 'विवादों के त्वरित और सौहार्दपूर्ण समाधान हेतु लोक अदालतों का आयोजन।' : 'Organization of Lok Adalats for quick and amicable settlement of disputes.' 
        }
      ],
      actionPrompt: 'I need a free government-appointed lawyer for my case before the District Court.'
    },
    {
      id: 'const_fundamental_rights',
      act: 'Constitution of India (Part III Fundamental Rights & Writ Jurisdiction)',
      categoryTag: 'CONSTITUTION',
      category: isHi ? 'संवैधानिक मौलिक अधिकार एवं रिट याचिका' : 'Constitutional Fundamental Rights & Writs',
      summary: isHi
        ? 'अनुच्छेद 14 (समानता), अनुच्छेद 21 (गरिमापूर्ण जीवन व आपातकालीन इलाज), और अनुच्छेद 32/226 के तहत सुप्रीम कोर्ट व हाईकोर्ट से रिट आदेश का सर्वोच्च अधिकार।'
        : 'Supreme fundamental guarantees under Article 14 (Equality), Article 21 (Life with Dignity & Emergency Healthcare), Article 39A (Free Legal Aid), and High Court Writs under Article 226.',
      keySections: [
        { 
          sec: 'Article 21', 
          desc: isHi ? 'गरिमापूर्ण जीवन, आपातकालीन चिकित्सा, निजता और स्वच्छ पर्यावरण का मौलिक अधिकार।' : 'Right to Life and Personal Liberty including healthcare, dignity, privacy, and livelihood.' 
        },
        { 
          sec: 'Article 32 & 226', 
          desc: isHi ? 'सुप्रीम कोर्ट व हाईकोर्ट से बंदी प्रत्यक्षीकरण, परमादेश (Mandamus) और उत्प्रेषण रिट का अधिकार।' : 'Constitutional remedies via Writs of Mandamus, Certiorari, and Habeas Corpus against state inaction.' 
        },
        { 
          sec: 'Article 39A', 
          desc: isHi ? 'समान न्याय और 100% निःशुल्क विधिक सहायता (NALSA 14468)।' : 'Statutory mandate of 100% Free Legal Aid ensuring justice is not denied due to economic handicap.' 
        }
      ],
      actionPrompt: 'Government municipal authorities demolished residential shelters without prior notice or rehabilitation, violating Article 21.'
    }
  ], [isHi]);

  const filtered = useMemo(() => {
    return legalGuides.filter(g => {
      const matchesCategory = selectedCategory === 'ALL' || g.categoryTag === selectedCategory;
      const matchesSearch = !searchTerm || 
        g.act.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.keySections.some(s => s.sec.toLowerCase().includes(searchTerm.toLowerCase()) || s.desc.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [legalGuides, selectedCategory, searchTerm]);

  const handleTestInDiagnosis = (prompt) => {
    setCurrentGrievance(prompt);
    setActiveTab('triage');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in text-slate-800">
      
      {/* Header */}
      <div className="gov-card p-6 bg-gradient-to-r from-slate-50 to-slate-100/60 border-slate-300">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-4 h-4 text-[#1E3A8A]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A]">
            {isHi ? 'भारतीय विधि एवं वैधानिक अधिकार विश्वकोश' : 'INDIAN LAW & CONSTITUTIONAL ACTS ENCYCLOPEDIA'}
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#0A2540]">
          {isHi ? 'भारत के सभी प्रमुख कानून, धाराएं एवं नागरिक अधिकार' : 'All Major Indian Acts, Statutory Sections & Citizen Rights'}
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          {isHi 
            ? 'भारत के संविधान, सामाजिक न्याय मंत्रालय, गृह मंत्रालय एवं उपभोक्ता कार्य मंत्रालय के सभी आधिकारिक कानून।' 
            : 'Comprehensive statutory guide covering Criminal Justice, Women Rights, Social Justice, Healthcare, Consumer, RERA, Tenancy, RTI & Constitutional Writs.'}
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="gov-card p-4 border-slate-300 max-w-2xl mx-auto flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={isHi ? "किसी भी कानून, धारा, अपराध या अधिकार को खोजें (उदा: BNS 80, दहेज, SC/ST, RERA, FIR)..." : "Search any Indian Act, Section, or Right (e.g. BNS 80, Dowry, SC/ST 18A, RERA, FIR, RTI)..."}
          className="flex-1 bg-transparent border-none text-xs sm:text-sm text-slate-900 focus:outline-none placeholder-slate-400"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-xs text-slate-400 hover:text-slate-700 px-2 cursor-pointer font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category Filter Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                isSelected 
                  ? 'bg-[#0A2540] text-white border-[#0A2540] shadow-xs' 
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50 hover:border-slate-400'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Results Count Banner */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          {isHi 
            ? `कुल ${filtered.length} आधिकारिक अधिनियम सूचीबद्ध` 
            : `Showing ${filtered.length} Statutory Acts & Legal Guides`}
        </span>
        <span className="text-[11px] font-semibold text-slate-400">
          {isHi ? '1-क्लिक परीक्षण उपलब्ध' : 'Click any act to view sections or test in diagnosis'}
        </span>
      </div>

      {/* Legal Guides Accordion */}
      <div className="space-y-4">
        {filtered.map((guide) => {
          const isExpanded = expandedId === guide.id;
          return (
            <div key={guide.id} className="gov-card border-slate-300 shadow-sm overflow-hidden transition-all">
              
              <div
                onClick={() => setExpandedId(isExpanded ? null : guide.id)}
                className="p-5 flex items-center justify-between gap-4 cursor-pointer bg-slate-50/50 hover:bg-slate-100/70 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                      {guide.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 font-semibold">
                      {guide.keySections.length} {isHi ? 'मुख्य धाराएं' : 'Key Sections'}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-[#0A2540]">
                    {guide.act}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-600" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </div>
              </div>

              {isExpanded && (
                <div className="p-6 space-y-4 border-t border-slate-200 bg-white text-xs leading-relaxed text-slate-700 animate-fade-in">
                  <p className="text-slate-800 font-medium leading-relaxed">{guide.summary}</p>

                  <div className="space-y-2 pt-2">
                    <h4 className="font-bold text-[#0A2540] uppercase tracking-wider text-[11px]">
                      {isHi ? 'वैधानिक धाराएं एवं प्रावधान:' : 'KEY STATUTORY SECTIONS & RIGHTS:'}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {guide.keySections.map((s, idx) => (
                        <div key={idx} className="p-3 rounded bg-slate-50 border border-slate-200 space-y-1">
                          <span className="statute-tag">{s.sec}</span>
                          <p className="text-[11px] text-slate-600 pt-1 leading-normal">{s.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-500">
                      {isHi ? 'इस अधिनियम के तहत अपनी शिकायत का विश्लेषण करें:' : 'Test this statute against your grievance in the AI engine:'}
                    </span>
                    <button
                      onClick={() => handleTestInDiagnosis(guide.actionPrompt)}
                      className="px-4 py-2 rounded bg-[#0A2540] hover:bg-[#1E3A8A] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isHi ? 'इस कानून के तहत केस जांचें' : 'Diagnose Case with'} {guide.act.split('(')[0]}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
