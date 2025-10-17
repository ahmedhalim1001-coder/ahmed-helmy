import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Type } from "@google/genai";

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
    filtersTitle: "Filters",
    location: "Location",
    propertyType: "Property Type",
    all: "All"
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
    filtersTitle: "تصفية النتائج",
    location: "الموقع",
    propertyType: "نوع العقار",
    all: "الكل"
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


const formatPrice = (price, language) => new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US').format(price);

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

const PropertyCard = ({ prop, language, imageSrcs, onImageNeeded, onShowMap }) => {
    const t = translations[language];
    const cardRef = useRef(null);
    const { lq, hq } = imageSrcs || {};
    const [isHqLoaded, setIsHqLoaded] = useState(false);

    useEffect(() => {
        if (hq) {
            const img = new Image();
            img.src = hq;
            img.onload = () => {
                setIsHqLoaded(true);
            };
        }
    }, [hq]);
  
    useEffect(() => {
      if (!cardRef.current || lq || hq) return;
  
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            onImageNeeded(prop.id, prop.description.en);
            observer.unobserve(entry.target);
          }
        },
        { rootMargin: '0px 0px 200px 0px' } 
      );
  
      observer.observe(cardRef.current);
  
      return () => {
        if (cardRef.current) {
          observer.unobserve(cardRef.current);
        }
      };
    }, [prop.id, prop.description.en, lq, hq, onImageNeeded]);

    return (
        <div ref={cardRef} className="property-card">
            <div className="property-image-container">
                { !lq && <div className="image-loader"></div> }
                { lq && 
                    <img 
                        src={lq} 
                        alt={`${prop.title[language]} placeholder`}
                        className="property-image placeholder"
                    /> 
                }
                { hq && 
                    <img 
                        src={hq} 
                        alt={prop.title[language]}
                        className={`property-image final ${isHqLoaded ? 'visible' : ''}`}
                    />
                }
            </div>
            <div className="property-details">
                <div className="property-meta">
                    <span className="property-type">{prop.propertyType[language]}</span>
                    <span className="property-agency">{prop.agency}</span>
                </div>
                <h2 className="property-title">{prop.title[language]}</h2>
                <div className="property-location">
                    <LocationIcon />
                    <span>{prop.location_string[language]}</span>
                </div>
                <div className="property-specs">
                    <div className="spec-item"><BedIcon /><span>{prop.bedrooms} {t.bedrooms}</span></div>
                    <div className="spec-item"><BathIcon /><span>{prop.bathrooms} {t.bathrooms}</span></div>
                    <div className="spec-item"><AreaIcon /><span>{prop.area} {t.areaUnit}</span></div>
                </div>
                <div className="property-pricing">
                    <div className="price">{formatPrice(prop.price, language)} <span className="price-unit">{t.priceUnit}</span></div>
                    <div className="down-payment">{t.downPayment}: {formatPrice(prop.downPayment, language)} {t.priceUnit}</div>
                </div>
                <div className="property-actions">
                    <button className="action-button primary-action">{t.contactAgent}</button>
                    <button onClick={() => onShowMap(prop)} className="action-button">{t.viewOnMap}</button>
                </div>
            </div>
        </div>
    );
};

const App = () => {
  const [language, setLanguage] = useState('ar');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mapProperty, setMapProperty] = useState(null);
  const [imageCache, setImageCache] = useState({});
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [filters, setFilters] = useState({
    location: 'all',
    propertyType: 'all',
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
            const cachedImages = sessionStorage.getItem('cachedImages');
            if (cachedProps) {
                setProperties(JSON.parse(cachedProps));
                if (cachedImages) {
                    setImageCache(JSON.parse(cachedImages));
                }
                setLoading(false);
                return;
            }
        } catch (e) {
            console.error("Failed to read from sessionStorage", e);
        }

        try {
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Generate a list of 12 fictional luxury real estate properties for sale in Egypt. Six in "New Cairo" and six in "6th of October City". Provide a JSON array. Each object needs: id, title (en/ar), description (en/ar, short marketing phrase), location_string (en/ar, e.g., "Mivida, New Cairo"), price (EGP), downPayment (EGP), propertyType (en/ar, e.g., "Villa", "Apartment", "Townhouse"), bedrooms (number), bathrooms (number), area (sqm), agency (fictional name), and location (lat/lng).`,
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
                                location: { type: Type.OBJECT, properties: { lat: { type: Type.NUMBER }, lng: { type: Type.NUMBER } } }
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
        }
    };

    fetchProperties();
  }, [ai, language]);

  const fetchImageForProperty = useCallback(async (id, description) => {
    if (imageCache[id]) return;

    setImageCache(prev => ({ ...prev, [id]: { lq: undefined, hq: undefined } }));

    // Fetch Low Quality Image First
    try {
        const lqResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: `Generate a very fast, extremely blurry, low-resolution placeholder image of a luxury property exterior: "${description}"` }] },
            config: { responseModalities: ['IMAGE'] },
        });
        const lqPart = lqResponse.candidates[0]?.content?.parts.find(p => p.inlineData);
        if (lqPart) {
            const lqUrl = `data:image/png;base64,${lqPart.inlineData.data}`;
            setImageCache(prev => ({ ...prev, [id]: { ...prev[id], lq: lqUrl } }));
        }
    } catch (e) {
        console.error(`Failed to generate LQ image for ${id}:`, e);
    }

    // Then Fetch High Quality Image
    try {
        const hqResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: `Generate a photorealistic, high-end architectural photograph of a modern luxury property exterior based on this: "${description}"` }] },
            config: { responseModalities: ['IMAGE'] },
        });
        const hqPart = hqResponse.candidates[0]?.content?.parts.find(p => p.inlineData);
        if (hqPart) {
            const hqUrl = `data:image/png;base64,${hqPart.inlineData.data}`;
            setImageCache(prev => {
                const newCache = { ...prev, [id]: { ...prev[id], hq: hqUrl } };
                try {
                   sessionStorage.setItem('cachedImages', JSON.stringify(newCache));
                } catch(e) {
                   console.error("Failed to write images to sessionStorage", e);
                }
                return newCache;
            });
        }
    } catch (e) {
        console.error(`Failed to generate HQ image for ${id}:`, e);
    }
  }, [ai, imageCache]);
  
  const t = translations[language];
  const toggleLanguage = () => setLanguage(lang => lang === 'en' ? 'ar' : 'en');
  const toggleTheme = () => setIsDarkMode(dark => !dark);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const uniqueLocations = useMemo(() => {
    const locations = properties.map(p => p.location_string[language].split(',')[1]?.trim()).filter(Boolean);
    return [...new Set(locations)];
  }, [properties, language]);

  const uniquePropTypes = useMemo(() => {
    const types = properties.map(p => p.propertyType[language]).filter(Boolean);
    return [...new Set(types)];
  }, [properties, language]);


  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
        const locationMatch = filters.location === 'all' || prop.location_string[language].includes(filters.location);
        const typeMatch = filters.propertyType === 'all' || prop.propertyType[language] === filters.propertyType;
        return locationMatch && typeMatch;
    });
  }, [properties, filters, language]);

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
      
      <div className="app-body">
        <aside className="sidebar">
            <h2 className="sidebar-title">{t.filtersTitle}</h2>
            <div className="filter-group">
                <label htmlFor="location-filter">{t.location}</label>
                <select id="location-filter" name="location" value={filters.location} onChange={handleFilterChange}>
                    <option value="all">{t.all}</option>
                    {uniqueLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
            </div>
            <div className="filter-group">
                <label htmlFor="type-filter">{t.propertyType}</label>
                <select id="type-filter" name="propertyType" value={filters.propertyType} onChange={handleFilterChange}>
                    <option value="all">{t.all}</option>
                    {uniquePropTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
            </div>
        </aside>

        <main className="main-content">
            {error && <div className="error">{error}</div>}
            <div className="property-list">
                {loading && Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                {!loading && !error && filteredProperties.map(prop => (
                    <PropertyCard 
                        key={prop.id}
                        prop={prop}
                        language={language}
                        imageSrcs={imageCache[prop.id]}
                        onImageNeeded={fetchImageForProperty}
                        onShowMap={setMapProperty}
                    />
                ))}
            </div>
        </main>
      </div>

      {mapProperty && (
        <div className="map-modal-overlay" onClick={() => setMapProperty(null)}>
          <div className="map-modal-content" onClick={e => e.stopPropagation()}>
            <div className="map-modal-header"><h3>{t.mapTitle}</h3><button className="map-modal-close" onClick={() => setMapProperty(null)}>&times;</button></div>
            <div className="map-modal-body"><iframe title={mapProperty.title[language]} src={`https://www.google.com/maps/embed/v1/place?key=${process.env.GOOGLE_MAPS_API_KEY}&q=${mapProperty.location.lat},${mapProperty.location.lng}&zoom=15`} allowFullScreen></iframe></div>
          </div>
        </div>
      )}
    </>
  );
};

createRoot(document.getElementById('root')).render(<App />);