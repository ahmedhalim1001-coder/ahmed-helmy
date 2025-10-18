import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Type } from "@google/genai";
import { villaImages, apartmentImages, fallbackImage } from './imageData.tsx';

const translations = {
  en: {
    title: "ahmed helmy",
    toggleLang: "عربي",
    loading: "Loading properties...",
    error: "Could not fetch properties. Please try again later.",
    viewOnMap: "Location",
    priceUnit: "EGP",
    mapTitle: "Property Location",
    themeToggleLight: "Switch to dark mode",
    themeToggleDark: "Switch to light mode",
    bedrooms: "Beds",
    bathrooms: "Baths",
    areaUnit: "sqm",
    downPayment: "Down payment",
    contactAgent: "Contact Agent",
    home: "Home",
    about: "About Us",
    projects: "Projects",
    contact: "Contact",
    filtersTitle: "Dream Home Builder",
    location: "Location",
    propertyType: "Property Type",
    all: "All",
    neighborhoodTitle: "Neighborhood Highlights",
    dreamFeaturesTitle: "Select Your Dream Features",
    compare: "Compare",
    compareNow: "Compare Now",
    clearComparison: "Clear",
    comparisonTitle: "Property Comparison",
    finishingQuality: "Finishing Quality",
    quietnessScore: "Quietness Score",
    neighborhoodReport: "Neighborhood Report",
    viewReport: "View Report",
    liveabilityScore: "Liveability Score",
    priceTrend: "12-Month Price Trend",
    mortgageCalculator: "Mortgage Calculator",
    propertyPrice: "Property Price",
    loanTerm: "Loan Term (Years)",
    interestRate: "Interest Rate (%)",
    monthlyPayment: "Monthly Payment",
    heroTitle: "Find Your Future Home",
    heroSubtitle: "The most exclusive properties, tailored for you."
  },
  ar: {
    title: "ahmed helmy",
    toggleLang: "English",
    loading: "جاري تحميل العقارات...",
    error: "تعذر تحميل العقارات. يرجى المحاولة مرة أخرى لاحقًا.",
    viewOnMap: "الموقع",
    priceUnit: "جنيه",
    mapTitle: "موقع العقار",
    themeToggleLight: "التبديل إلى الوضع الداكن",
    themeToggleDark: "التبديل إلى الوضع الفاتح",
    bedrooms: "غرف",
    bathrooms: "حمامات",
    areaUnit: "م²",
    downPayment: "دفعة أولى",
    contactAgent: "تواصل مع الوكيل",
    home: "الرئيسية",
    about: "من نحن",
    projects: "مشاريعنا",
    contact: "اتصل بنا",
    filtersTitle: "مُنشئ بيت الأحلام",
    location: "الموقع",
    propertyType: "نوع العقار",
    all: "الكل",
    neighborhoodTitle: "مميزات المنطقة",
    dreamFeaturesTitle: "اختر مواصفات حلمك",
    compare: "قارن",
    compareNow: "قارن الآن",
    clearComparison: "مسح",
    comparisonTitle: "مقارنة العقارات",
    finishingQuality: "جودة التشطيب",
    quietnessScore: "مستوى الهدوء",
    neighborhoodReport: "تقرير الحي",
    viewReport: "عرض التقرير",
    liveabilityScore: "مؤشر جودة الحياة",
    priceTrend: "اتجاه الأسعار لآخر 12 شهرًا",
    mortgageCalculator: "حاسبة التمويل العقاري",
    propertyPrice: "سعر العقار",
    loanTerm: "مدة القرض (سنوات)",
    interestRate: "نسبة الفائدة (%)",
    monthlyPayment: "القسط الشهري",
    heroTitle: "ابحث عن منزل مستقبلك",
    heroSubtitle: "أفخم العقارات، مصممة خصيصاً لك."
  },
};

// --- ICONS ---
const SunIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.106a.75.75 0 010 1.06l-1.591 1.591a.75.75 0 11-1.06-1.06l1.591-1.591a.75.75 0 011.06 0zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.803 17.803a.75.75 0 01-1.06 0l-1.591-1.591a.75.75 0 111.06-1.06l1.591 1.591a.75.75 0 010 1.06zM12 18a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM5.197 17.803a.75.75 0 010-1.06l1.591-1.591a.75.75 0 111.06 1.06l-1.591 1.591a.75.75 0 01-1.06 0zM3 12a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H3.75A.75.75 0 013 12zM6.106 5.197a.75.75 0 011.06 0l1.591 1.591a.75.75 0 11-1.06 1.06L5.197 6.257a.75.75 0 010-1.06z" /></svg> );
const MoonIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-3.832 2.072-7.147 5.228-8.97a.75.75 0 01.818.162z" clipRule="evenodd" /></svg> );
const BedIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v10.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875V4.875C22.5 3.839 21.66 3 20.625 3H3.375zM9 12h12V4.875c0-.621-.504-1.125-1.125-1.125H9v8.25zM7.5 15.75V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V15.75c0 .621.504 1.125 1.125 1.125h3c.621 0 1.125-.504 1.125-1.125z" /></svg> );
const BathIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M3.5 8.25a.75.75 0 000 1.5h2.25V15a4.505 4.505 0 004.5 4.5H18v-1.528A4.522 4.522 0 0014.25 12H12V4.5A2.25 2.25 0 009.75 2.25h-3A2.25 2.25 0 004.5 4.5v1.5H3.5a.75.75 0 00-.75.75v1.5a.75.75 0 00.75.75zM12 12.75H13.5a.75.75 0 00.75-.75V8.25a.75.75 0 00-.75-.75H12v5.25z" /></svg> );
const AreaIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6 12.75a3 3 0 116 0 3 3 0 01-6 0zM12.75 15a3 3 0 116 0 3 3 0 01-6 0z" clipRule="evenodd" /></svg> );
const LocationIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 005.169-4.4c3.95-6.193 3.4-11.952-1.2-15.54C15.34.468 12.26 0 8.5 0 4.74 0 1.66.468.04 3.486-4.56 7.073-4.01 12.833-.06 19.023a16.975 16.975 0 005.169 4.4c.195.11.39.213.58.309zM12 2.25c2.518 0 4.886.953 6.625 2.658 2.348 2.305 3.235 5.823 1.838 9.394-.725 1.83-2.06 3.73-3.8 5.613a15.483 15.483 0 01-4.663 3.633.45.45 0 01-.4 0A15.483 15.483 0 017.04 19.923c-1.74-1.883-3.075-3.783-3.8-5.613-1.397-3.57-0.51-7.09 1.838-9.394C6.826 3.33 9.4.99 12 .99z" clipRule="evenodd" /><path d="M12 6.75a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zM8.25 10.5a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0z" /></svg> );
const MenuIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>);
const CloseIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>);
const CheckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.052-.143Z" clipRule="evenodd" /></svg>);
const StarIcon = ({filled}) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`star-icon ${filled ? 'filled' : ''}`} width="16" height="16"><path fillRule="evenodd" d="M10.868 2.884c.321-.662 1.134-.662 1.456 0l2.033 4.192c.11.226.313.39.55.43l4.63.672c.725.105 1.014.992.49 1.498l-3.35 3.265a.752.752 0 0 0-.215.664l.79 4.612c.124.722-.63.1.277-1.043l-4.14-2.176a.75.75 0 0 0-.702 0l-4.14 2.176c-.63.33-1.155-.32-1.03-1.043l.79-4.612a.752.752 0 0 0-.215-.664L.49 9.676c-.524-.506-.235-1.393.49-1.498l4.63-.672a.75.75 0 0 0 .55-.43L9.13 2.884Z" clipRule="evenodd" /></svg>);

const DREAM_FEATURES = {
    pool: { en: "Private Pool", ar: "حمام سباحة خاص" },
    view: { en: "Sea View", ar: "إطلالة بحرية" },
    luxury_finish: { en: "Luxury Finish", ar: "تشطيبات فاخرة" },
    garden: { en: "Private Garden", ar: "حديقة خاصة" },
    gym: { en: "Near a Gym", ar: "قرب من الجيم" },
    quiet: { en: "Quiet Area", ar: "منطقة هادئة" },
};

const formatPrice = (price, language) => new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US').format(price);

let audioContext;
const playSound = () => {
  if (!audioContext) {
    // FIX: Property 'webkitAudioContext' does not exist on type 'Window & typeof globalThis'. Cast to any to support older browsers.
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5 note
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.5);
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
};


const SkeletonCard = () => (
    <div className="property-card skeleton">
      <div className="property-image-container skeleton-image"></div>
      <div className="property-details">
        <div className="property-meta">
          <div className="skeleton-line" style={{ width: '30%' }}></div>
          <div className="skeleton-line" style={{ width: '40%' }}></div>
        </div>
        <div className="skeleton-line title"></div>
        <div className="skeleton-line short"></div>
         <div className="skeleton-line" style={{ height: '3em' }}></div>
        <div className="property-specs">
          <div className="skeleton-line" style={{ width: '25%' }}></div>
          <div className="skeleton-line" style={{ width: '25%' }}></div>
          <div className="skeleton-line" style={{ width: '25%' }}></div>
        </div>
        <div className="property-pricing">
           <div className="skeleton-line price"></div>
        </div>
        <div className="property-actions">
          <div className="skeleton-button"></div>
          <div className="skeleton-button"></div>
        </div>
      </div>
    </div>
  );

const PropertyCard = ({ prop, language, imageSrcs, onShowMap, onCompareToggle, isCompared }) => {
    const t = translations[language];
    const { lq, hq } = imageSrcs || {};
    const [isHqLoaded, setIsHqLoaded] = useState(false);

    useEffect(() => {
        if (hq) {
            const img = new Image();
            img.src = hq;
            img.onload = () => setIsHqLoaded(true);
        }
    }, [hq]);

    const Rating = ({ score, label }) => (
        <div className="rating">
            <span className="rating-label">{label}</span>
            <div className="stars">
                {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < score} />)}
            </div>
        </div>
    );

    return (
        <div className="property-card-container">
          <div className="property-card">
              <div className="card-face card-front">
                  <div className="property-image-container">
                      { !lq && <div className="image-loader"></div> }
                      { lq && <img src={lq} alt={`${prop.title?.[language] || ''} placeholder`} className="property-image placeholder" /> }
                      { hq && <img src={hq} alt={prop.title?.[language] || ''} className={`property-image final ${isHqLoaded ? 'visible' : ''}`} /> }
                  </div>
                  <div className="property-details">
                      <div className="property-meta">
                          <span className="property-type">{prop.propertyType?.[language]}</span>
                          <span className="property-agency">{prop.agency}</span>
                      </div>
                      <h2 className="property-title">{prop.title?.[language]}</h2>
                      <div className="property-location">
                          <LocationIcon />
                          <span>{prop.location_string?.[language]}</span>
                      </div>
                      <div className="property-specs">
                          <div className="spec-item"><BedIcon /><span>{prop.bedrooms} {t.bedrooms}</span></div>
                          <div className="spec-item"><BathIcon /><span>{prop.bathrooms} {t.bathrooms}</span></div>
                          <div className="spec-item"><AreaIcon /><span>{prop.area} {t.areaUnit}</span></div>
                      </div>
                      <div className="property-pricing">
                          <div className="price">{formatPrice(prop.price, language)} <span className="price-unit">{t.priceUnit}</span></div>
                      </div>
                      <div className="property-actions">
                          <button onClick={() => onCompareToggle(prop.id)} className={`action-button compare-action ${isCompared ? 'compared' : ''}`}>{t.compare}</button>
                          <button onClick={() => onShowMap(prop)} className="action-button">{t.viewOnMap}</button>
                      </div>
                  </div>
              </div>
              <div className="card-face card-back">
                  <div className="property-details">
                       <h2 className="property-title">{prop.title?.[language]}</h2>
                       <p className="property-description">{prop.description?.[language]}</p>
                       <div className="property-ratings">
                          <Rating score={prop.finishing_quality} label={t.finishingQuality} />
                          <Rating score={prop.quietness_score} label={t.quietnessScore} />
                       </div>
                       {prop.neighborhood_highlights && (
                           <div className="neighborhood-highlights">
                               <h4 className="highlights-title">{t.neighborhoodTitle}</h4>
                               <ul>
                                   {prop.neighborhood_highlights?.[language]?.slice(0, 3).map((item, index) => (
                                       <li key={index}><CheckIcon /> {item}</li>
                                   ))}
                               </ul>
                           </div>
                       )}
                       <div className="property-actions">
                         <button className="action-button primary-action" onClick={playSound}>{t.contactAgent}</button>
                       </div>
                  </div>
              </div>
          </div>
        </div>
    );
};

const HeroBanner = ({ t }) => (
    <div className="hero-banner">
        <div className="hero-content">
            <h1>{t.heroTitle}</h1>
            <p>{t.heroSubtitle}</p>
        </div>
    </div>
);

const ComparisonModal = ({ properties, onClose, language }) => {
    const t = translations[language];

    const Rating = ({ score }) => (
        <div className="stars">
            {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < score} />)}
        </div>
    );
    
    return (
        <div className="map-modal-overlay" onClick={onClose}>
            <div className="comparison-modal-content" onClick={e => e.stopPropagation()}>
                <div className="map-modal-header">
                    <h3>{t.comparisonTitle}</h3>
                    <button className="map-modal-close" onClick={onClose}>&times;</button>
                </div>
                <div className="comparison-modal-body">
                    {properties.map(prop => (
                        <div key={prop.id} className="comparison-column">
                            <div className="comparison-image-container">
                                <img src={getImageForProp(prop).hq} alt={prop.title?.[language]} />
                            </div>
                            <h4>{prop.title?.[language]}</h4>
                            <div className="comparison-detail price">{formatPrice(prop.price, language)} {t.priceUnit}</div>
                            <div className="comparison-detail"><strong>{t.areaUnit}:</strong> {prop.area}</div>
                            <div className="comparison-detail"><strong>{t.bedrooms}:</strong> {prop.bedrooms}</div>
                            <div className="comparison-detail"><strong>{t.bathrooms}:</strong> {prop.bathrooms}</div>
                            <div className="comparison-detail"><strong>{t.finishingQuality}:</strong> <Rating score={prop.finishing_quality} /></div>
                            <div className="comparison-detail"><strong>{t.quietnessScore}:</strong> <Rating score={prop.quietness_score} /></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const PriceTrendChart = ({ data, language }) => {
    const t = translations[language];
    if (!data || data.length === 0) return null;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * 300;
        const y = 100 - ((d - min) / range) * 80; // 80 to leave some padding
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="price-trend-chart">
            <h4>{t.priceTrend}</h4>
            <svg viewBox="0 0 300 100" preserveAspectRatio="none">
                <polyline fill="none" stroke="var(--primary-color)" strokeWidth="2" points={points} />
            </svg>
        </div>
    );
};

const NeighborhoodReportModal = ({ neighborhood, onClose, language, ai }) => {
    const t = translations[language];
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            if (!neighborhood) return;
            setLoading(true);
            try {
                const result = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: `Generate a fictional but realistic neighborhood report for "${neighborhood}" in Egypt. Provide a JSON object with: liveability_score (a number between 1 and 10), and price_trend (an array of 12 numbers representing fictional percentage price change over the last 12 months).`,
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: Type.OBJECT,
                            properties: {
                                liveability_score: { type: Type.NUMBER },
                                price_trend: { type: Type.ARRAY, items: { type: Type.NUMBER } }
                            }
                        }
                    }
                });
                setReport(JSON.parse(result.text));
            } catch (e) {
                console.error("Failed to fetch neighborhood report", e);
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [neighborhood, ai]);

    return (
        <div className="map-modal-overlay" onClick={onClose}>
            <div className="map-modal-content" onClick={e => e.stopPropagation()}>
                <div className="map-modal-header">
                    <h3>{t.neighborhoodReport}: {neighborhood}</h3>
                    <button className="map-modal-close" onClick={onClose}>&times;</button>
                </div>
                <div className="map-modal-body">
                    {loading && <div className="loader">{t.loading}</div>}
                    {!loading && report && (
                        <div>
                            <div className="liveability-score">
                                <h4>{t.liveabilityScore}</h4>
                                <div className="score-circle"><span>{report.liveability_score.toFixed(1)}</span>/10</div>
                            </div>
                            <PriceTrendChart data={report.price_trend} language={language} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const MortgageCalculator = ({ t, language }) => {
    const [price, setPrice] = useState(5000000);
    const [downPayment, setDownPayment] = useState(1000000);
    const [term, setTerm] = useState(20);
    const [rate, setRate] = useState(8);

    const monthlyPayment = useMemo(() => {
        const principal = price - downPayment;
        if (principal <= 0) return 0;
        const monthlyRate = rate / 100 / 12;
        const numberOfPayments = term * 12;
        if (monthlyRate === 0) return principal / numberOfPayments;
        const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        return payment;
    }, [price, downPayment, term, rate]);
    
    return (
        <div className="mortgage-calculator">
             <div className="filter-group">
                <label>{t.propertyPrice}: {formatPrice(price, language)} {t.priceUnit}</label>
                <input type="range" min="500000" max="20000000" step="100000" value={price} onChange={e => setPrice(Number(e.target.value))} />
             </div>
             <div className="filter-group">
                <label>{t.downPayment}: {formatPrice(downPayment, language)} {t.priceUnit}</label>
                <input type="range" min="100000" max={price} step="50000" value={downPayment} onChange={e => setDownPayment(Number(e.target.value))} />
             </div>
             <div className="filter-group">
                <label>{t.loanTerm}: {term}</label>
                <input type="range" min="5" max="30" value={term} onChange={e => setTerm(Number(e.target.value))} />
             </div>
              <div className="filter-group">
                <label>{t.interestRate}: {rate}%</label>
                <input type="range" min="1" max="20" step="0.25" value={rate} onChange={e => setRate(Number(e.target.value))} />
             </div>
             <div className="monthly-payment">
                <h4>{t.monthlyPayment}</h4>
                <p>{formatPrice(monthlyPayment.toFixed(0), language)} {t.priceUnit}</p>
             </div>
        </div>
    );
};


const getImageForProp = (prop) => {
    const type = prop.propertyType?.en?.toLowerCase() || '';
    if (type.includes('villa')) return villaImages[(prop.id || 0) % villaImages.length];
    if (type.includes('apartment')) return apartmentImages[(prop.id || 0) % apartmentImages.length];
    return fallbackImage;
};

const App = () => {
  const [language, setLanguage] = useState('ar');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mapProperty, setMapProperty] = useState(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [comparisonItems, setComparisonItems] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [reportingNeighborhood, setReportingNeighborhood] = useState(null);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [showMortgageModal, setShowMortgageModal] = useState(false);
  const [filters, setFilters] = useState({
    location: 'all',
    propertyType: 'all',
    features: [],
  });

  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY }), []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.title = translations[language].title;
  }, [language]);

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-mode' : '';
  }, [isDarkMode]);
    
  useEffect(() => {
    const fetchProperties = async () => {
        setLoading(true);
        setError('');
        try {
            const cachedProps = sessionStorage.getItem('cachedProperties');
            if (cachedProps) {
                setProperties(JSON.parse(cachedProps));
                setLoading(false);
                playSound();
                return;
            }
        } catch (e) { console.error("Failed to read from sessionStorage", e); }

        try {
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Generate a list of 12 fictional luxury real estate properties for sale in Egypt. Six in "New Cairo" and six in "6th of October City". Provide a JSON array. Each object needs: id, title (en/ar), description (en/ar, a compelling 2-3 sentence narrative), location_string (en/ar), price (EGP), downPayment (EGP), propertyType (en/ar, e.g., "Villa", "Apartment"), bedrooms, bathrooms, area (sqm), agency (fictional name), location (lat/lng), neighborhood_highlights (en/ar, an array of 3 key features), features (en/ar, an array of 2-4 string tags from this list: "Private Pool", "Sea View", "Luxury Finish", "Private Garden", "Near a Gym", "Quiet Area"), finishing_quality (a number 1-5), and quietness_score (a number 1-5).`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                id: { type: Type.NUMBER },
                                title: { type: Type.OBJECT, properties: { en: { type: Type.STRING }, ar: { type: Type.STRING } } },
                                description: { type: Type.OBJECT, properties: { en: { type: Type.STRING }, ar: { type: Type.STRING } } },
                                location_string: { type: Type.OBJECT, properties: { en: { type: Type.STRING }, ar: { type: Type.STRING } } },
                                price: { type: Type.NUMBER },
                                downPayment: { type: Type.NUMBER },
                                propertyType: { type: Type.OBJECT, properties: { en: { type: Type.STRING }, ar: { type: Type.STRING } } },
                                bedrooms: { type: Type.NUMBER },
                                bathrooms: { type: Type.NUMBER },
                                area: { type: Type.NUMBER },
                                agency: { type: Type.STRING },
                                location: { type: Type.OBJECT, properties: { lat: { type: Type.NUMBER }, lng: { type: Type.NUMBER } } },
                                neighborhood_highlights: { type: Type.OBJECT, properties: { en: { type: Type.ARRAY, items: { type: Type.STRING }}, ar: { type: Type.ARRAY, items: { type: Type.STRING }}} },
                                features: { type: Type.OBJECT, properties: { en: { type: Type.ARRAY, items: { type: Type.STRING }}, ar: { type: Type.ARRAY, items: { type: Type.STRING }}} },
                                finishing_quality: { type: Type.NUMBER },
                                quietness_score: { type: Type.NUMBER }
                            }
                        }
                    }
                }
            });
            const parsedProperties = JSON.parse(result.text);
            setProperties(parsedProperties);
            sessionStorage.setItem('cachedProperties', JSON.stringify(parsedProperties));
        } catch (e) {
            console.error(e);
            setError(translations[language].error);
        } finally {
            setLoading(false);
            playSound();
        }
    };

    fetchProperties();
  }, [ai, language]);

  const t = translations[language];
  const toggleLanguage = () => setLanguage(lang => lang === 'en' ? 'ar' : 'en');
  const toggleTheme = () => setIsDarkMode(dark => !dark);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFeatureToggle = (featureKey) => {
    setFilters(prev => {
        const newFeatures = prev.features.includes(featureKey)
            ? prev.features.filter(f => f !== featureKey)
            : [...prev.features, featureKey];
        return { ...prev, features: newFeatures };
    });
  };

  const uniqueLocations = useMemo(() => {
    const locations = properties.map(p => p.location_string?.[language]?.split(',')[1]?.trim()).filter(Boolean);
    return [...new Set(locations)];
  }, [properties, language]);

  const uniquePropTypes = useMemo(() => {
    const types = properties.map(p => p.propertyType?.[language]).filter(Boolean);
    return [...new Set(types)];
  }, [properties, language]);

  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
        const locationMatch = filters.location === 'all' || prop.location_string?.[language]?.includes(filters.location);
        const typeMatch = filters.propertyType === 'all' || prop.propertyType?.[language] === filters.propertyType;
        const featureMatch = filters.features.every(featureKey => prop.features?.[language]?.includes(DREAM_FEATURES[featureKey][language]));
        return locationMatch && typeMatch && featureMatch;
    });
  }, [properties, filters, language]);
  
  const handleCompareToggle = useCallback((propId) => {
    setComparisonItems(prev => {
        if (prev.includes(propId)) {
            return prev.filter(id => id !== propId);
        }
        if (prev.length < 3) {
            return [...prev, propId];
        }
        // Optional: show a notification that max 3 items can be compared
        return prev;
    });
  }, []);

  const comparisonProperties = useMemo(() => {
    return properties.filter(p => comparisonItems.includes(p.id));
  }, [comparisonItems, properties]);

  return (
    <>
      <header className="header">
        <div className="header-main">
            <div className="logo">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.383 6.999c.357-.356.93-.356 1.287 0l8.132 8.132c.356.357.356.93 0 1.287l-1.889 1.889a.91.91 0 01-1.287 0l-6.289-6.289-4.321 4.322a.91.91 0 01-1.287 0l-1.89-1.89a.91.91 0 010-1.287l6.147-6.147zm-1.669 4.322l-4.321-4.322a.91.91 0 00-1.287 0l-1.89 1.89a.91.91 0 000 1.287l6.148 6.147 1.35-1.35-6.147-6.147.05-.05c.056-.056.11-.112.168-.168l4.13-4.13-.17.17-.168.168-4.13 4.13z" /></svg>
                <span>{t.title}</span>
            </div>
            <nav className={`header-nav ${isNavOpen ? 'open' : ''}`}>
                <a href="#" className="nav-link">{t.home}</a>
                <a href="#" className="nav-link">{t.about}</a>
                <a href="#" className="nav-link">{t.projects}</a>
                <a href="#" className="nav-link">{t.contact}</a>
            </nav>
            <div className="header-controls">
              <button onClick={toggleLanguage} className="lang-toggle">{t.toggleLang}</button>
              <button onClick={toggleTheme} className="theme-toggle" aria-label={isDarkMode ? t.themeToggleDark : t.themeToggleLight}>
                {isDarkMode ? <SunIcon /> : <MoonIcon />}
              </button>
              <button className="nav-toggle" onClick={() => setIsNavOpen(!isNavOpen)}>
                {isNavOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
        </div>
      </header>
      
      <main className="main-content">
            <HeroBanner t={t} />

            <div className="filters-container">
                <div className="filter-group">
                    <label htmlFor="location-filter">{t.location}</label>
                    <div className="location-filter-container">
                        <select id="location-filter" name="location" value={filters.location} onChange={handleFilterChange}>
                            <option value="all">{t.all}</option>
                            {uniqueLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                        </select>
                        <button className="view-report-btn" onClick={() => filters.location !== 'all' && setReportingNeighborhood(filters.location)} disabled={filters.location === 'all'}>{t.viewReport}</button>
                    </div>
                </div>
                <div className="filter-group">
                    <label htmlFor="type-filter">{t.propertyType}</label>
                    <select id="type-filter" name="propertyType" value={filters.propertyType} onChange={handleFilterChange}>
                        <option value="all">{t.all}</option>
                        {uniquePropTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </div>
                <div className="filter-group">
                    <button className="modal-trigger-button" onClick={() => setShowFeaturesModal(true)}>
                        {t.dreamFeaturesTitle}
                        {filters.features.length > 0 && <span className="feature-count">{filters.features.length}</span>}
                    </button>
                </div>
                 <div className="filter-group">
                    <button className="modal-trigger-button" onClick={() => setShowMortgageModal(true)}>{t.mortgageCalculator}</button>
                </div>
            </div>

            <div className="property-list-container">
              {error && <div className="error">{error}</div>}
              <div className="property-list">
                  {loading && Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                  {!loading && !error && filteredProperties.map(prop => (
                      <PropertyCard 
                          key={prop.id} prop={prop} language={language}
                          imageSrcs={getImageForProp(prop)}
                          onShowMap={setMapProperty}
                          onCompareToggle={handleCompareToggle}
                          isCompared={comparisonItems.includes(prop.id)}
                      />
                  ))}
              </div>
            </div>
      </main>

      {comparisonItems.length > 0 && (
          <div className="comparison-bar">
              <div className="comparison-info">
                  <span>{comparisonItems.length} {t.compare}</span>
              </div>
              <div className="comparison-actions">
                  <button onClick={() => setShowComparison(true)} disabled={comparisonItems.length < 2}>{t.compareNow}</button>
                  <button onClick={() => setComparisonItems([])}>{t.clearComparison}</button>
              </div>
          </div>
      )}

      {showComparison && (
          <ComparisonModal properties={comparisonProperties} onClose={() => setShowComparison(false)} language={language} />
      )}
       
      {showFeaturesModal && (
        <div className="map-modal-overlay" onClick={() => setShowFeaturesModal(false)}>
            <div className="map-modal-content" onClick={e => e.stopPropagation()}>
                <div className="map-modal-header">
                    <h3>{t.dreamFeaturesTitle}</h3>
                    <button className="map-modal-close" onClick={() => setShowFeaturesModal(false)}>&times;</button>
                </div>
                <div className="map-modal-body">
                    <div className="features-grid">
                        {Object.keys(DREAM_FEATURES).map(key => (
                            <button key={key} className={`feature-button ${filters.features.includes(key) ? 'active' : ''}`} onClick={() => handleFeatureToggle(key)}>
                                {DREAM_FEATURES[key][language]}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      )}

      {showMortgageModal && (
        <div className="map-modal-overlay" onClick={() => setShowMortgageModal(false)}>
            <div className="map-modal-content" onClick={e => e.stopPropagation()}>
                <div className="map-modal-header">
                    <h3>{t.mortgageCalculator}</h3>
                    <button className="map-modal-close" onClick={() => setShowMortgageModal(false)}>&times;</button>
                </div>
                <div className="map-modal-body">
                    <MortgageCalculator t={t} language={language} />
                </div>
            </div>
        </div>
      )}

      {reportingNeighborhood && (
        <NeighborhoodReportModal neighborhood={reportingNeighborhood} onClose={() => setReportingNeighborhood(null)} language={language} ai={ai} />
      )}

      {mapProperty && (
        <div className="map-modal-overlay" onClick={() => setMapProperty(null)}>
          <div className="map-modal-content" onClick={e => e.stopPropagation()}>
            <div className="map-modal-header"><h3>{t.mapTitle}</h3><button className="map-modal-close" onClick={() => setMapProperty(null)}>&times;</button></div>
            <div className="map-modal-body"><iframe title={mapProperty.title?.[language] || 'Property Location'} src={`https://www.google.com/maps/embed/v1/place?key=${process.env.GOOGLE_MAPS_API_KEY}&q=${mapProperty.location.lat},${mapProperty.location.lng}&zoom=15`} allowFullScreen></iframe></div>
          </div>
        </div>
      )}
    </>
  );
};

createRoot(document.getElementById('root')).render(<App />);