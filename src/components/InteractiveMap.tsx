import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Phone, Clock, ExternalLink, Navigation, ZoomIn, ZoomOut, Layers } from 'lucide-react';

export const InteractiveMap: React.FC = () => {
  const { t } = useLanguage();
  const [zoomLevel, setZoomLevel] = useState(15);
  const [mapStyle, setMapStyle] = useState<'dark' | 'satellite'>('dark');

  // Configurable restaurant coordinates: Dostyk Ave 105, Almaty
  const latitude = 43.238949;
  const longitude = 76.958318;
  const locationName = 'Lagman Food Restaurant & Lounge';
  const addressString = 'Dostyk Avenue 105, Almaty, Kazakhstan';

  const handleOpenExternal = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#d4af37]/20 shadow-2xl bg-[#0d0d11]">
      {/* Map Canvas / Simulated Interactive Vector Cartography */}
      <div className="relative h-[420px] sm:h-[480px] w-full overflow-hidden select-none bg-[#09090c]">
        {/* Styled Dark Street Grid / Vector Map Simulation */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            backgroundImage:
              mapStyle === 'dark'
                ? `radial-gradient(circle at 50% 50%, rgba(212,175,55,0.06) 0%, transparent 60%),
                   linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
                   linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)`
                : `radial-gradient(circle at 50% 50%, rgba(30,58,138,0.2) 0%, transparent 80%),
                   linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
                   linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)`,
            backgroundSize: `${30 * (zoomLevel / 15)}px ${30 * (zoomLevel / 15)}px`,
          }}
        >
          {/* Simulated Major Roads & Landmarks in Almaty Medeu District */}
          <svg className="w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
            {/* Dostyk Ave Diagonal */}
            <line x1="20%" y1="100%" x2="70%" y2="0%" stroke="#d4af37" strokeWidth="6" strokeOpacity="0.4" />
            <line x1="20%" y1="100%" x2="70%" y2="0%" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.6" />
            
            {/* Al-Farabi Ave Cross */}
            <line x1="0%" y1="75%" x2="100%" y2="65%" stroke="#d4af37" strokeWidth="8" strokeOpacity="0.35" />
            <line x1="0%" y1="75%" x2="100%" y2="65%" stroke="#ffffff" strokeWidth="2.5" strokeOpacity="0.5" />
            
            {/* Satpayev St */}
            <line x1="0%" y1="35%" x2="100%" y2="30%" stroke="#4b5563" strokeWidth="4" />
            
            {/* Small tertiary avenues */}
            <line x1="10%" y1="0%" x2="40%" y2="100%" stroke="#374151" strokeWidth="2" strokeDasharray="6 4" />
            <line x1="60%" y1="0%" x2="90%" y2="100%" stroke="#374151" strokeWidth="2" />
            
            {/* River / Park contour */}
            <path
              d="M 750,0 Q 720,200 780,450"
              fill="none"
              stroke="#1e3a8a"
              strokeWidth="10"
              strokeOpacity="0.4"
            />
          </svg>
        </div>

        {/* Center Marker Pin with Luxury Pulsing Ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-[#d4af37]/20 animate-ping absolute inset-0 -m-1" />
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#000] to-[#1a1710] border-2 border-[#d4af37] shadow-[0_0_20px_#d4af37] flex items-center justify-center text-[#d4af37]">
              <MapPin className="w-5 h-5 fill-[#d4af37] text-black" />
            </div>
          </div>
          <div className="mt-2 px-3 py-1 bg-black/85 backdrop-blur-md rounded-md border border-[#d4af37]/40 text-center shadow-lg">
            <p className="text-xs font-serif font-bold text-white tracking-wide">Lagman Food</p>
            <p className="text-[10px] text-[#d4af37] font-mono">Dostyk Ave 105</p>
          </div>
        </div>

        {/* Map Control Toolbar */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 1, 18))}
            className="w-8 h-8 rounded-lg bg-black/80 backdrop-blur-md border border-zinc-700 hover:border-[#d4af37] text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 1, 12))}
            className="w-8 h-8 rounded-lg bg-black/80 backdrop-blur-md border border-zinc-700 hover:border-[#d4af37] text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMapStyle(prev => (prev === 'dark' ? 'satellite' : 'dark'))}
            className="w-8 h-8 rounded-lg bg-black/80 backdrop-blur-md border border-zinc-700 hover:border-[#d4af37] text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Toggle Map Style"
          >
            <Layers className="w-4 h-4 text-[#d4af37]" />
          </button>
        </div>

        {/* Interactive Floating Info Card */}
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm z-20 bg-[#0e0e13]/95 backdrop-blur-xl p-5 rounded-xl border border-[#d4af37]/30 shadow-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-400">
              Open Now · До 23:00
            </span>
          </div>

          <h4 className="font-serif text-base font-bold text-white mb-2">
            {locationName}
          </h4>

          <div className="space-y-2 text-xs text-zinc-300 mb-4">
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
              <span>{addressString}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
              <span>{t('openingHoursValue')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
              <a href="tel:+77273456789" className="hover:text-[#d4af37] transition-colors">
                +7 (727) 345-6789
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenExternal}
              className="flex-1 py-2 px-3 rounded-lg bg-[#d4af37] hover:bg-[#e5c378] text-black font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{t('getDirections')}</span>
            </button>
            <button
              onClick={handleOpenExternal}
              className="p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="Open Google Maps"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
