import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useCase } from '../../context/CaseContext';
import { useLanguage } from '../../context/LanguageContext';
import { resolveClientJurisdiction, apiLookupJurisdiction, INDIAN_STATES_DATA } from '../../services/api';
import { 
  MapPin, Phone, Mail, Clock, ShieldCheck, 
  Building2, Scale, ExternalLink, Navigation, Search, CheckCircle2, Landmark, X
} from 'lucide-react';

export const JurisdictionFinder = () => {
  const { 
    selectedDistrict, 
    setSelectedDistrict, 
    selectedState, 
    setSelectedState, 
    setJurisdiction, 
    showToast 
  } = useCase();
  
  const { language, t } = useLanguage();
  
  const [isCustomCity, setIsCustomCity] = useState(false);
  const [customCityInput, setCustomCityInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef(null);

  const stateKeys = Object.keys(INDIAN_STATES_DATA);
  const currentStateInfo = INDIAN_STATES_DATA[selectedState] || INDIAN_STATES_DATA['Uttar Pradesh'];
  const districtList = currentStateInfo.districts || [];

  // Guaranteed reactive synchronous jurisdiction data for selected district & state
  const jurisdictionData = useMemo(() => {
    return resolveClientJurisdiction(selectedDistrict, selectedState);
  }, [selectedDistrict, selectedState]);

  const popularCities = [
    { district: 'Lucknow', state: 'Uttar Pradesh', label: 'Lucknow (UP)' },
    { district: 'Delhi', state: 'National Capital Territory of Delhi', label: 'Delhi NCR' },
    { district: 'Mumbai', state: 'Maharashtra', label: 'Mumbai (MH)' },
    { district: 'Bengaluru', state: 'Karnataka', label: 'Bengaluru (KA)' },
    { district: 'Prayagraj', state: 'Uttar Pradesh', label: 'Prayagraj (UP)' },
    { district: 'Kolkata', state: 'West Bengal', label: 'Kolkata (WB)' },
    { district: 'Chennai', state: 'Tamil Nadu', label: 'Chennai (TN)' },
    { district: 'Hyderabad', state: 'Telangana', label: 'Hyderabad (TS)' },
    { district: 'Ahmedabad', state: 'Gujarat', label: 'Ahmedabad (GJ)' },
    { district: 'Pune', state: 'Maharashtra', label: 'Pune (MH)' },
    { district: 'Jaipur', state: 'Rajasthan', label: 'Jaipur (RJ)' },
    { district: 'Patna', state: 'Bihar', label: 'Patna (BR)' },
    { district: 'Varanasi', state: 'Uttar Pradesh', label: 'Varanasi (UP)' }
  ];

  // Index all districts across all 36 Indian states for instant search
  const allLocations = useMemo(() => {
    const list = [];
    // 1. Popular hubs first
    popularCities.forEach(c => {
      list.push({
        district: c.district,
        state: c.state,
        label: `${c.district}, ${c.state}`,
        isHub: true
      });
    });
    // 2. All state districts
    Object.entries(INDIAN_STATES_DATA).forEach(([stName, stData]) => {
      if (stData.districts && Array.isArray(stData.districts)) {
        stData.districts.forEach(d => {
          if (!list.some(item => item.district.toLowerCase() === d.toLowerCase() && item.state.toLowerCase() === stName.toLowerCase())) {
            list.push({
              district: d,
              state: stName,
              label: `${d}, ${stName}`,
              isHub: false
            });
          }
        });
      }
    });
    return list;
  }, []);

  // Filtered autocomplete search results
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return allLocations.filter(loc => 
      loc.district.toLowerCase().includes(q) || 
      loc.state.toLowerCase().includes(q) ||
      loc.label.toLowerCase().includes(q)
    ).slice(0, 10);
  }, [searchQuery, allLocations]);

  // Handle outside click to dismiss search dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStateChange = (newSt) => {
    setSelectedState(newSt);
    setIsCustomCity(false);
    const newStInfo = INDIAN_STATES_DATA[newSt];
    const defaultDist = newStInfo && newStInfo.districts && newStInfo.districts.length > 0 
      ? newStInfo.districts[0] 
      : 'District Headquarter';
    setSelectedDistrict(defaultDist);
    setJurisdiction(defaultDist, newSt);
    showToast(`Jurisdiction updated to ${newSt}`, 'info');
  };

  const handleDistrictChange = (newDist) => {
    if (newDist === '__CUSTOM__') {
      setIsCustomCity(true);
      return;
    }
    setIsCustomCity(false);
    setSelectedDistrict(newDist);
    setJurisdiction(newDist, selectedState);
    showToast(`Jurisdiction updated to ${newDist} (${selectedState})`, 'info');
  };

  const handleCustomCitySubmit = (e) => {
    if (e) e.preventDefault();
    if (!customCityInput.trim()) return;
    const cleanCity = customCityInput.trim();
    setSelectedDistrict(cleanCity);
    setJurisdiction(cleanCity, selectedState);
    showToast(`Custom jurisdiction set: ${cleanCity} (${selectedState})`, 'success');
  };

  const handlePopularCityClick = (city) => {
    setIsCustomCity(false);
    setSelectedState(city.state);
    setSelectedDistrict(city.district);
    setJurisdiction(city.district, city.state);
    showToast(`Jurisdiction set to ${city.label}`, 'success');
  };

  const handleSelectLocation = (loc) => {
    setIsCustomCity(false);
    setSelectedState(loc.state);
    setSelectedDistrict(loc.district);
    setJurisdiction(loc.district, loc.state);
    showToast(`Jurisdiction updated to ${loc.district} (${loc.state})`, 'success');
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    // 1. If matches found in district list, pick top match
    if (searchResults.length > 0) {
      handleSelectLocation(searchResults[0]);
      return;
    }

    // 2. If user typed a state name
    const matchedState = stateKeys.find(s => s.toLowerCase().includes(q.toLowerCase()));
    if (matchedState) {
      handleStateChange(matchedState);
      setSearchQuery('');
      setIsSearchFocused(false);
      return;
    }

    // 3. Fallback: treat as custom city under current state
    const cleanCity = q.charAt(0).toUpperCase() + q.slice(1);
    setIsCustomCity(false);
    setSelectedDistrict(cleanCity);
    setJurisdiction(cleanCity, selectedState);
    showToast(`Jurisdiction set to ${cleanCity} (${selectedState})`, 'success');
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in text-slate-800">
      
      {/* Header Banner */}
      <div className="gov-card p-6 bg-gradient-to-r from-slate-50 to-slate-100/60 border-slate-300">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-800 block mb-1">
          {t.jurisdictionEyebrow || 'National District Consumer Forum & Legal Aid Directory'}
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-[#0A2540]">
          {t.jurisdictionTitle}
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          {t.jurisdictionSub}
        </p>
      </div>

      {/* Interactive Location Selector Container */}
      <div className="gov-card p-6 bg-white border-slate-300 shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-sm font-bold text-[#0A2540] uppercase tracking-wide flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#1E3A8A]" />
              <span>{t.selectStateDistrict || 'Select Your State & District / City'}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.locationSubtitle || 'All official filing portals, consumer courts, legal aid authorities, and RTI links adapt dynamically.'}
            </p>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded bg-teal-50 text-teal-900 border border-teal-200 self-start sm:self-auto shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
            <span>{t.activeLocation || 'Active'}: <strong className="text-teal-950">{selectedDistrict}, {selectedState}</strong></span>
          </div>
        </div>

        {/* 1. Fast Smart Search Bar with Real-Time Autocomplete */}
        <div ref={searchContainerRef} className="space-y-1.5 relative">
          <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Search className="w-3.5 h-3.5 text-[#0A2540]" />
              <span>{t.searchCityPlaceholder || 'Instant Search across all 36 States & 700+ Districts:'}</span>
            </span>
            <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">Type name (e.g. Karnal, Gurugram, Jaipur) & press Enter</span>
          </label>

          <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={t.searchCityPlaceholder || 'Search any city, district or state in India (e.g. Karnal, Patna, Noida)...'}
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                className="w-full pl-9 pr-8 py-2.5 text-xs sm:text-sm font-semibold rounded border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0A2540] shadow-sm transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchFocused(false);
                  }}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700 p-0.5 rounded cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-[#0A2540] hover:bg-[#1E3A8A] text-white rounded text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <span>Apply</span>
            </button>

            {/* Autocomplete Dropdown Menu */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-300 rounded-lg shadow-2xl z-50 overflow-hidden divide-y divide-slate-100 max-h-72 overflow-y-auto animate-fade-in">
                <div className="px-3 py-1.5 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                  <span>Matching Indian Districts & States ({searchResults.length})</span>
                  <span>Click or press Enter</span>
                </div>
                {searchResults.map((loc) => (
                  <button
                    key={`${loc.state}-${loc.district}`}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelectLocation(loc);
                    }}
                    className="w-full px-3.5 py-2.5 text-left text-xs hover:bg-teal-50 flex items-center justify-between group transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-[#1E3A8A] group-hover:text-teal-600 flex-shrink-0" />
                      <span className="font-bold text-slate-900 text-sm group-hover:text-teal-950">{loc.district}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 group-hover:bg-teal-100 group-hover:text-teal-900 px-2 py-0.5 rounded border border-slate-200">
                      {loc.state}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* Dropdown Pickers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          
          {/* 1. State Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              {t.domicileStateLabel || '1. Domicile / Cause of Action State'}
            </label>
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2.5 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
            >
              {stateKeys.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* 2. District / City Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              {t.districtJurisdictionLabel || '2. District / City Jurisdiction'}
            </label>
            {!isCustomCity ? (
              <select
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2.5 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
              >
                {districtList.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
                <option value="__CUSTOM__">✍️ + Other / Enter Custom City...</option>
              </select>
            ) : (
              <form onSubmit={handleCustomCitySubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  value={customCityInput}
                  onChange={(e) => setCustomCityInput(e.target.value)}
                  placeholder={`Enter city in ${selectedState}...`}
                  autoFocus
                  className="flex-1 bg-white border border-slate-300 rounded px-3 py-2 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#0A2540] text-white text-xs font-bold hover:bg-[#1E3A8A] transition-colors whitespace-nowrap cursor-pointer"
                >
                  Apply
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomCity(false);
                    if (districtList.length > 0) setSelectedDistrict(districtList[0]);
                  }}
                  className="px-2.5 py-2 rounded border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
                >
                  Back
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Quick Popular Cities Hubs */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            {t.quickMetroLabel || 'Quick Metro & Major District Hubs:'}
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {popularCities.map((c) => {
              const isSelected = selectedDistrict.toLowerCase() === c.district.toLowerCase() && 
                                (selectedState.toLowerCase() === c.state.toLowerCase() || (c.district === 'Delhi' && selectedState.toLowerCase().includes('delhi')));
              return (
                <button
                  key={`${c.state}-${c.district}`}
                  type="button"
                  onClick={() => handlePopularCityClick(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-[#0A2540] text-white shadow-sm ring-1 ring-[#0A2540]'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                  }`}
                >
                  <span>{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Jurisdiction Directory Output Grid */}
      {jurisdictionData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          
          {/* Card 1: District Consumer Forum (DCDRC) */}
          <div className="gov-card p-6 border-slate-300 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded bg-blue-50 text-[#1E3A8A] flex items-center justify-center border border-blue-200">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#1E3A8A] uppercase tracking-wider block">
                      {t.districtCourtTitle || 'District Consumer Court (Section 35 CPA)'}
                    </span>
                    <h3 className="text-sm font-bold text-[#0A2540]">
                      {jurisdictionData.consumerCommission?.name}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span>{jurisdictionData.consumerCommission?.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#059669] flex-shrink-0" />
                  <span>{t.helplineLabel || 'Helpline:'} <strong className="text-slate-900">{jurisdictionData.consumerCommission?.phone}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>{t.emailLabel || 'Email:'} <code className="font-mono text-[#1E3A8A]">{jurisdictionData.consumerCommission?.email}</code></span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#D97706] flex-shrink-0" />
                  <span>{t.operatingHoursLabel || 'Operating Hours:'} {language === 'hi' ? (t.operatingHoursValue || 'सुबह 10:00 - शाम 4:30 (सोम-शनि)') : jurisdictionData.consumerCommission?.workingHours}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
              <a
                href={jurisdictionData.consumerCommission?.portal || "https://www.india.gov.in/category/justice-law-grievances/subcategory/courts-tribunals/details/e-daakhil-portal"}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#1E3A8A] hover:underline font-bold flex items-center gap-1.5"
              >
                <span>{t.stateScdrcPortal || 'State SCDRC Portal'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="flex items-center gap-2">
                <a
                  href={jurisdictionData.consumerCommission?.onlineFiling || "https://www.india.gov.in/category/justice-law-grievances/subcategory/courts-tribunals/details/e-daakhil-portal"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-[#1E3A8A] hover:bg-[#0A2540] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{t.eJagritiFilingBtn || 'e-Daakhil / e-Jagriti Filing'}</span>
                </a>

                <a
                  href={`https://www.google.com/maps/search/District+Consumer+Disputes+Redressal+Commission+${encodeURIComponent(jurisdictionData.district || selectedDistrict)}+${encodeURIComponent(jurisdictionData.state || selectedState)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1 px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#0A2540]" />
                  <span>{t.mapRouteBtn || 'Map Route'}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Card 2: District Legal Services Authority (DLSA Free Legal Aid) */}
          <div className="gov-card p-6 border-slate-300 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded bg-emerald-50 text-[#059669] flex items-center justify-center border border-emerald-200">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#059669] uppercase tracking-wider block">
                      {t.freeLegalAidTitle || 'Free Legal Aid (NALSA & State SLSA)'}
                    </span>
                    <h3 className="text-sm font-bold text-[#0A2540]">
                      {jurisdictionData.legalAid?.name}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span>{jurisdictionData.legalAid?.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#059669] flex-shrink-0" />
                  <span>{t.teleLawTollFreeLabel || 'National Tele-Law Toll-Free:'} <strong className="text-slate-900">{jurisdictionData.legalAid?.phone}</strong></span>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded text-[11px] text-emerald-900 leading-relaxed">
                  <strong>{t.statutoryEligibilityLabel || 'Statutory Eligibility:'} </strong>
                  {language === 'hi' ? (t.freeLegalAidEligibilityDesc || jurisdictionData.legalAid?.freeLegalAidEligibility) : jurisdictionData.legalAid?.freeLegalAidEligibility}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
              <a
                href={jurisdictionData.legalAid?.portal || "https://nalsa.gov.in"}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#059669] hover:underline font-bold flex items-center gap-1.5"
              >
                <span>{t.slsaPortal || 'SLSA Legal Aid Portal'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href="tel:14468"
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-[#059669] hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{t.callTeleLaw || 'Call Tele-Law (14468)'}</span>
              </a>
            </div>
          </div>

          {/* Card 3: RTI Nodal Information Office */}
          <div className="gov-card p-6 border-slate-300 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2 font-bold text-[#0A2540]">
                  <Building2 className="w-5 h-5 text-[#1E3A8A]" />
                  <div>
                    <span className="text-[10px] font-bold text-[#1E3A8A] uppercase tracking-wider block">
                      {t.stateRtiTitle || 'State RTI Nodal Authority (RTI Act 2005)'}
                    </span>
                    <h3 className="text-sm font-bold text-[#0A2540]">
                      {jurisdictionData.rtiNodal?.authority}
                    </h3>
                  </div>
                </div>
                
                <a
                  href={jurisdictionData.rtiNodal?.portal || "https://rtionline.gov.in"}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs bg-blue-50 hover:bg-blue-100 text-[#1E3A8A] px-2.5 py-1 rounded font-bold flex items-center gap-1 border border-blue-200"
                >
                  <span>{t.stateRtiPortal || 'RTI Portal'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <p><strong>{t.addressLabel || 'Address:'}</strong> {jurisdictionData.rtiNodal?.address}</p>
                <p><strong>{t.contactPhoneLabel || 'Contact Phone:'}</strong> {jurisdictionData.rtiNodal?.phone}</p>
                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-700">
                  <strong>{t.emergencyHelplinesLabel || 'Emergency & Civic Helplines:'} </strong>
                  <span className="font-semibold text-slate-900">{language === 'hi' ? (t.emergencyNumbers || jurisdictionData.policeCivicHelpline) : jurisdictionData.policeCivicHelpline}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
              <a
                href={jurisdictionData.rtiNodal?.portal || "https://rtionline.gov.in"}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs font-bold text-[#1E3A8A] hover:underline"
              >
                <span>{t.stateRtiPortal || 'State RTI Online Portal'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-[11px] text-slate-500 font-medium">Sec. 6(1) RTI Act</span>
            </div>
          </div>

          {/* Card 4: Municipal Corporation / Local Authority */}
          <div className="gov-card p-6 border-slate-300 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2 font-bold text-[#0A2540]">
                  <Landmark className="w-5 h-5 text-purple-800" />
                  <div>
                    <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block">
                      {t.civicAuthorityTitle || 'Local Civic & Municipal Authority'}
                    </span>
                    <h3 className="text-sm font-bold text-[#0A2540]">
                      {jurisdictionData.municipalCorporation?.name}
                    </h3>
                  </div>
                </div>

                {jurisdictionData.municipalCorporation?.portal && (
                  <a
                    href={jurisdictionData.municipalCorporation?.portal}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs bg-purple-50 hover:bg-purple-100 text-purple-900 px-2.5 py-1 rounded font-bold flex items-center gap-1 border border-purple-200"
                  >
                    <span>{t.civicPortal || 'Civic Portal'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <p><strong>{t.designatedOfficerLabel || 'Designated Officer:'}</strong> {language === 'hi' ? (t.pioOfficer || 'जन सूचना अधिकारी (PIO)') : (jurisdictionData.municipalCorporation?.officer || 'Public Information Officer (PIO)')}</p>
                <p><strong>{t.officeAddressLabel || 'Office Address:'}</strong> {jurisdictionData.municipalCorporation?.address}</p>
                <p><strong>{t.civicHelplineLabel || 'Civic Helpline:'}</strong> <span className="font-bold text-slate-800">{jurisdictionData.municipalCorporation?.helpline || '1533 / 112'}</span></p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
              <a
                href={jurisdictionData.municipalCorporation?.portal || "https://serviceonline.gov.in"}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs font-bold text-purple-900 hover:underline"
              >
                <span>{t.civicPortal || 'Municipal & Citizen Services'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-[11px] text-slate-500 font-medium">Citizen Grievances</span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
