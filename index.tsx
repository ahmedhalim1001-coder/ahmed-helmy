/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, Type } from '@google/genai';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';

// --- TYPE DEFINITION ---
interface Property {
  name: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
  imagePrompt: string;
}

type Language = 'ar' | 'en';
type Theme = 'dark' | 'light';

// --- TRANSLATIONS ---
const translations = {
  ar: {
    logo: "الفاخرة",
    heroTitle: "ابحث عن منزل أحلامك",
    heroSubtitle: "مجموعة حصرية من أرقى العقارات في العالم",
    loading: "جاري تحميل العقارات الفاخرة...",
    error: "عذرًا، حدث خطأ أثناء تحميل العقارات. يرجى المحاولة مرة أخرى لاحقًا.",
    bedrooms: "غرف",
    bathrooms: "حمامات",
    themeToggle: (theme: Theme) => theme === 'dark' ? '☀️ رؤية نهارية' : '🌙 رؤية ليلية',
    langToggle: 'English',
    fetchPrompt: "أنشئ قائمة بـ 6 عقارات حديثة للبيع بأسعار اليوم في مناطق التجمع الخامس ومدينة 6 أكتوبر في القاهرة، مصر. يجب أن تكون القائمة متنوعة بين الشقق والفلل.",
    priceCurrency: 'EGP',
    priceLocale: 'ar-EG',
  },
  en: {
    logo: "LUXURY",
    heroTitle: "Find Your Dream Home",
    heroSubtitle: "An exclusive collection of the world's finest properties",
    loading: "Loading exclusive properties...",
    error: "Sorry, an error occurred while loading properties. Please try again later.",
    bedrooms: "Beds",
    bathrooms: "Baths",
    themeToggle: (theme: Theme) => theme === 'dark' ? '☀️ Day View' : '🌙 Night View',
    langToggle: 'العربية',
    fetchPrompt: "Generate a list of 6 modern properties for sale with current prices in the areas of Fifth Settlement and 6th of October City in Cairo, Egypt. The list should be diverse, including apartments and villas.",
    priceCurrency: 'EGP',
    priceLocale: 'en-US',
  }
};

// --- API HELPER ---
const fetchProperties = async (lang: Language): Promise<Property[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const propertySchema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "Name of the property or villa" },
      location: { type: Type.STRING, description: "Location of the property, like district and city name" },
      price: { type: Type.INTEGER, description: "Price of the property in Egyptian Pounds (EGP)" },
      bedrooms: { type: Type.INTEGER, description: "Number of bedrooms" },
      bathrooms: { type: Type.INTEGER, description: "Number of bathrooms" },
      description: { type: Type.STRING, description: "A brief and appealing description of the property" },
      imagePrompt: { type: Type.STRING, description: "A short English prompt to generate an image for the property" },
    },
    required: ["name", "location", "price", "bedrooms", "bathrooms", "description", "imagePrompt"],
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: translations[lang].fetchPrompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: propertySchema,
      },
    },
  });

  const jsonText = response.text.trim();
  return JSON.parse(jsonText);
};


// --- COMPONENTS ---

const Header: React.FC<{
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  t: (key: string, ...args: any[]) => string;
}> = ({ language, setLanguage, theme, setTheme, t }) => {
  const handleLangToggle = () => setLanguage(language === 'ar' ? 'en' : 'ar');
  const handleThemeToggle = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <header className="header">
      <div className="logo">{t('logo')}</div>
      <div className="controls-container">
        <button className="theme-toggle" onClick={handleThemeToggle} aria-label="Toggle theme">
          {t('themeToggle', theme)}
        </button>
        <button className="lang-toggle" onClick={handleLangToggle} aria-label="Toggle language">
          {t('langToggle')}
        </button>
      </div>
    </header>
  );
};

const Hero: React.FC<{ t: (key: string) => string }> = ({ t }) => (
  <section className="hero">
    <h1>{t('heroTitle')}</h1>
    <p>{t('heroSubtitle')}</p>
  </section>
);

const PropertyCard: React.FC<{ property: Property, t: (key: string) => string, lang: Language }> = ({ property, t, lang }) => {
  const formattedPrice = new Intl.NumberFormat(translations[lang].priceLocale, {
    style: 'currency',
    currency: translations[lang].priceCurrency,
    maximumFractionDigits: 0,
  }).format(property.price);

  const placeholderImageUrl = `https://placehold.co/600x400/${theme === 'dark' ? '0d1b2a/e0bdaa' : 'e0e0e0/1c1e21'}?text=${encodeURIComponent(property.imagePrompt)}`;

  return (
    <div className="property-card" aria-labelledby={`property-name-${property.name}`}>
      <img src={placeholderImageUrl} alt={property.name} className="property-image" />
      <div className="property-info">
        <h3 id={`property-name-${property.name}`}>{property.name}</h3>
        <p className="property-location">{property.location}</p>
        <div className="property-details">
          <div className="detail-item" aria-label={`${property.bedrooms} ${t('bedrooms')}`}>
             <span>{property.bedrooms}</span> {t('bedrooms')}
          </div>
          <div className="detail-item" aria-label={`${property.bathrooms} ${t('bathrooms')}`}>
            <span>{property.bathrooms}</span> {t('bathrooms')}
          </div>
        </div>
        <p className="property-description">{property.description}</p>
        <div className="property-price" aria-label={`Price ${formattedPrice}`}>{formattedPrice}</div>
      </div>
    </div>
  );
};

let theme: Theme; // Global theme for placeholder URL

const PropertyGrid: React.FC<{ properties: Property[], t: (key: string) => string, lang: Language }> = ({ properties, t, lang }) => (
  <main className="property-grid" aria-live="polite">
    {properties.map((prop, index) => (
      <PropertyCard key={index} property={prop} t={t} lang={lang}/>
    ))}
  </main>
);

// --- MAIN APP COMPONENT ---

function App() {
  const [language, setLanguage] = useState<Language>('ar');
  const [currentTheme, setCurrentTheme] = useState<Theme>('dark');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  theme = currentTheme; // Update global theme variable

  const t = (key: string, ...args: any[]): string => {
    const translation = translations[language][key];
    if (typeof translation === 'function') {
      return translation(...args);
    }
    return translation || key;
  };

  useEffect(() => {
    document.body.className = `theme-${currentTheme}`;
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.title = language === 'ar' ? 'العقارات الفاخرة | بوابتك لعالم الرفاهية' : 'Luxury Real Estate | Your Gateway to Opulence';
  }, [currentTheme, language]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedProperties = await fetchProperties(language);
        setProperties(fetchedProperties);
      } catch (err) {
        console.error("Failed to fetch properties:", err);
        setError(t('error'));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [language]);

  return (
    <div className="container">
      <Header
        language={language}
        setLanguage={setLanguage}
        theme={currentTheme}
        setTheme={setCurrentTheme}
        t={t}
      />
      <Hero t={t} />
      {loading && <div className="loader" role="status">{t('loading')}</div>}
      {error && <div className="error" role="alert">{error}</div>}
      {!loading && !error && <PropertyGrid properties={properties} t={t} lang={language}/>}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);