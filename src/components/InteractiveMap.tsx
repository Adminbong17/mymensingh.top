import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import type { Place } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { MapPin, Navigation, Compass } from 'lucide-react';

interface InteractiveMapProps {
  onSelectPlace: (place: Place) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ onSelectPlace }) => {
  const { language } = useLanguage();
  const { places } = useData();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Mymensingh center coordinates
  const MYMENSINGH_CENTER: [number, number] = [24.7550, 90.4030];

  const getMarkerEmoji = (slug?: string) => {
    switch (slug) {
      case 'heritage': return '🏛️';
      case 'nature': return '🌳';
      case 'food': return '🍮';
      case 'hotels': return '🏨';
      case 'emergency': return '🏥';
      case 'transport': return '🚂';
      case 'education': return '🎓';
      default: return '📍';
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: MYMENSINGH_CENTER,
        zoom: 13,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when places or filter changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    const filteredPlaces = places.filter((p) => {
      if (selectedFilter === 'all') return true;
      return p.category_slug === selectedFilter;
    });

    filteredPlaces.forEach((place) => {
      const title = language === 'bn' ? place.name_bn || place.name_en : place.name_en;
      const emoji = getMarkerEmoji(place.category_slug);

      // Create a modern custom HTML marker
      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div style="
            background: white;
            border-radius: 9999px;
            padding: 4px 8px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.25);
            border: 2px solid #059669;
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 11px;
            font-weight: 700;
            color: #0f172a;
            white-space: nowrap;
            transform: translate(-50%, -50%);
            cursor: pointer;
          ">
            <span>${emoji}</span>
            <span style="max-width: 110px; overflow: hidden; text-overflow: ellipsis;">${title}</span>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      const marker = L.marker([place.latitude, place.longitude], { icon: customIcon });

      const popupContent = document.createElement('div');
      popupContent.style.width = '220px';
      popupContent.style.padding = '4px';
      popupContent.innerHTML = `
        <div style="border-radius: 12px; overflow: hidden; margin-bottom: 8px;">
          <img src="${place.image_url}" style="width: 100%; height: 90px; object-fit: cover;" />
        </div>
        <h4 style="font-weight: 800; font-size: 13px; color: #0f172a; margin: 0 0 4px 0;">${title}</h4>
        <p style="font-size: 11px; color: #64748b; margin: 0 0 8px 0; line-height: 1.3;">${place.area}</p>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 11px; font-weight: 700; color: #059669;">★ ${place.rating}</span>
          <button id="btn-place-${place.id}" style="
            background: #059669;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 4px 10px;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
          ">
            ${language === 'bn' ? 'বিস্তারিত' : 'Details'}
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-place-${place.id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectPlace(place);
          };
        }
      });

      markersLayer.addLayer(marker);
    });
  }, [places, selectedFilter, language, onSelectPlace]);

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(MYMENSINGH_CENTER, 13);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
      {/* Header and Filter pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Compass className="w-6 h-6 text-emerald-600" />
            <span>{language === 'bn' ? 'ময়মনসিংহের ইন্টারেক্টিভ মানচিত্র' : 'Interactive Map of Mymensingh'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {language === 'bn'
              ? 'ঐতিহাসিক রাজবাড়ি, পার্ক, ব্রহ্মপুত্র ঘাট, রেস্তোরাঁ ও হাসপাতালের সুনির্দিষ্ট অবস্থান'
              : 'Pinpoint locations of heritage palaces, river wharfs, food spots and hospitals'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Category filters on map */}
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 outline-hidden focus:border-emerald-500 cursor-pointer"
          >
            <option value="all">{language === 'bn' ? 'সব স্থান' : 'All Places'}</option>
            <option value="heritage">{language === 'bn' ? 'ঐতিহাসিক রাজবাড়ি' : 'Heritage & History'}</option>
            <option value="nature">{language === 'bn' ? 'পার্ক ও নদী' : 'Parks & River'}</option>
            <option value="food">{language === 'bn' ? 'খাবার ও মিষ্টি' : 'Food & Sweets'}</option>
            <option value="hotels">{language === 'bn' ? 'হোটেল' : 'Hotels'}</option>
            <option value="emergency">{language === 'bn' ? 'জরুরি হাসপাতাল' : 'Hospitals'}</option>
          </select>

          <button
            onClick={handleResetView}
            className="text-xs font-semibold px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 flex items-center gap-1.5 shadow-2xs"
            title="Reset to City Center"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'সেন্টার' : 'Center'}</span>
          </button>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative w-full h-[450px] sm:h-[550px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
        <div ref={mapContainerRef} className="w-full h-full" />
        
        {/* Helper overlay */}
        <div className="absolute bottom-3 left-3 z-[400] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-md text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span>{places.length} {language === 'bn' ? 'টি পিন চিহ্নিত স্থান' : 'Mapped Locations'}</span>
        </div>
      </div>
    </div>
  );
};
