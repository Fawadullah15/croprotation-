/// <reference types="@types/google.maps" />
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  APIProvider,
  Map,
  useMap,
  useMapsLibrary,
  AdvancedMarker,
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Layers,
  Scissors,
  RotateCcw,
  CheckCircle,
  Search,
  Navigation,
  FileEdit,
  Globe,
  Compass,
} from 'lucide-react';
import { useFarm } from '../../context/FarmContext';
import { LatLngPoint } from '../../types';
import { LeafletFarmMap } from './LeafletFarmMap';

interface FarmMapSelectorProps {
  onLocationConfirmed?: () => void;
  standalone?: boolean;
}

const MapDrawingLayer: React.FC<{
  polygon: LatLngPoint[];
  setPolygon: React.Dispatch<React.SetStateAction<LatLngPoint[]>>;
  isDrawing: boolean;
  setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>;
  centerPoint: LatLngPoint;
  setCenterPoint: React.Dispatch<React.SetStateAction<LatLngPoint>>;
  mapTypeId: string;
}> = ({
  polygon,
  setPolygon,
  isDrawing,
  centerPoint,
  setCenterPoint,
  mapTypeId,
}) => {
  const map = useMap();
  useMapsLibrary('geometry');
  const polygonInstanceRef = useRef<google.maps.Polygon | null>(null);

  useEffect(() => {
    if (map) {
      map.setMapTypeId(mapTypeId);
    }
  }, [map, mapTypeId]);

  useEffect(() => {
    if (!map) return;

    const clickListener = map.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (!isDrawing || !e.latLng) return;
      const newPt: LatLngPoint = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setPolygon(prev => [...prev, newPt]);
      setCenterPoint(newPt);
    });

    return () => {
      google.maps.event.removeListener(clickListener);
    };
  }, [map, isDrawing, setPolygon, setCenterPoint]);

  useEffect(() => {
    if (!map) return;

    if (polygonInstanceRef.current) {
      polygonInstanceRef.current.setMap(null);
      polygonInstanceRef.current = null;
    }

    if (polygon.length >= 3) {
      const gPath = polygon.map(p => ({ lat: p.lat, lng: p.lng }));
      const poly = new google.maps.Polygon({
        paths: gPath,
        strokeColor: '#35A853',
        strokeOpacity: 0.95,
        strokeWeight: 3,
        fillColor: '#35A853',
        fillOpacity: 0.35,
        editable: false,
        draggable: false,
        map: map,
      });

      polygonInstanceRef.current = poly;
    }

    return () => {
      if (polygonInstanceRef.current) {
        polygonInstanceRef.current.setMap(null);
      }
    };
  }, [map, polygon]);

  return (
    <>
      {polygon.map((pt, idx) => (
        <AdvancedMarker
          key={`vertex-${idx}`}
          position={{ lat: pt.lat, lng: pt.lng }}
          title={`Point ${idx + 1}`}
        >
          <div className="w-5 h-5 rounded-full bg-[#35A853] border-2 border-white flex items-center justify-center text-[10px] text-white font-bold shadow-md cursor-pointer hover:scale-125 transition-transform">
            {idx + 1}
          </div>
        </AdvancedMarker>
      ))}

      <AdvancedMarker position={{ lat: centerPoint.lat, lng: centerPoint.lng }}>
        <div className="flex flex-col items-center cursor-pointer">
          <div className="bg-[#123D2A] text-white text-xs px-2 py-0.5 rounded shadow font-semibold flex items-center gap-1 border border-[#35A853]">
            <MapPin className="w-3 h-3 text-[#35A853]" />
            Farm Center
          </div>
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#123D2A]" />
        </div>
      </AdvancedMarker>
    </>
  );
};

const FAISALABAD_TEHSILS = [
  { label: 'Faisalabad Saddar / Chak 204 RB', lat: 31.4504, lng: 73.1350 },
  { label: 'Jaranwala Tehsil', lat: 31.3342, lng: 73.4194 },
  { label: 'Samundri Tehsil', lat: 31.0628, lng: 72.9604 },
  { label: 'Tandlianwala Tehsil', lat: 31.0345, lng: 73.1311 },
  { label: 'Chak Jhumra Tehsil', lat: 31.5681, lng: 73.1836 },
  { label: 'Dijkot / Samundri Road', lat: 31.2167, lng: 72.9833 },
];

export const FarmMapSelector: React.FC<FarmMapSelectorProps> = ({
  onLocationConfirmed,
}) => {
  const { farmer, updateLocation, updateFarmer, language } = useFarm();
  const mapsApiKey = (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY || '';

  // Default to Free Leaflet + OpenStreetMap (No API Key Required)
  const [providerMode, setProviderMode] = useState<'leaflet' | 'manual' | 'google'>('leaflet');

  // Manual Backup Form State
  const [manualVillage, setManualVillage] = useState(farmer.location.village || 'Chak 204 RB');
  const [manualDistrict, setManualDistrict] = useState(farmer.location.district || 'Faisalabad');
  const [manualAcres, setManualAcres] = useState<string>(String(farmer.location.areaAcres || 5));
  const [manualLat, setManualLat] = useState<string>(String(farmer.location.lat || 31.4504));
  const [manualLng, setManualLng] = useState<string>(String(farmer.location.lng || 73.135));
  const [manualSavedMsg, setManualSavedMsg] = useState<string | null>(null);

  // Sync manual form when farmer.location updates from map
  useEffect(() => {
    setManualVillage(farmer.location.village || 'Chak 204 RB');
    setManualDistrict(farmer.location.district || 'Faisalabad');
    setManualAcres(String(farmer.location.areaAcres || 5));
    setManualLat(String(farmer.location.lat || 31.4504));
    setManualLng(String(farmer.location.lng || 73.135));
  }, [farmer.location]);

  // Google Maps State (when optional Google Maps tab is selected)
  const [polygon, setPolygon] = useState<LatLngPoint[]>(farmer.location.polygon || []);
  const [centerPoint, setCenterPoint] = useState<LatLngPoint>({
    lat: farmer.location.lat,
    lng: farmer.location.lng,
  });
  const [isDrawing, setIsDrawing] = useState(false);
  const [mapTypeId, setMapTypeId] = useState<'satellite' | 'roadmap'>('satellite');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmed, setConfirmed] = useState(farmer.location.confirmed);
  const [calculatedAcres, setCalculatedAcres] = useState(farmer.location.areaAcres);
  const [calculatedHectares, setCalculatedHectares] = useState(farmer.location.areaHectares);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const computePolygonArea = useCallback((pts: LatLngPoint[]) => {
    if (pts.length < 3) return { acres: 0, hectares: 0 };
    const radius = 6378137;
    let total = 0;

    for (let i = 0; i < pts.length; i++) {
      const p1 = pts[i];
      const p2 = pts[(i + 1) % pts.length];
      const lat1 = (p1.lat * Math.PI) / 180;
      const lat2 = (p2.lat * Math.PI) / 180;
      const lngDiff = ((p2.lng - p1.lng) * Math.PI) / 180;
      total += lngDiff * (2 + Math.sin(lat1) + Math.sin(lat2));
    }

    const areaM2 = Math.abs((total * radius * radius) / 2);
    const acres = areaM2 / 4046.86;
    const hectares = areaM2 / 10000;

    return {
      acres: Math.max(0.1, Math.round(acres * 100) / 100),
      hectares: Math.max(0.04, Math.round(hectares * 100) / 100),
    };
  }, []);

  useEffect(() => {
    if (polygon.length >= 3) {
      const { acres, hectares } = computePolygonArea(polygon);
      setCalculatedAcres(acres);
      setCalculatedHectares(hectares);
    }
  }, [polygon, computePolygonArea]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const acresVal = Math.max(0.1, parseFloat(manualAcres) || 5);
    const hectaresVal = Math.round((acresVal / 2.471) * 100) / 100;
    const latVal = parseFloat(manualLat) || 31.4504;
    const lngVal = parseFloat(manualLng) || 73.135;

    const d = 0.0018;
    const poly: LatLngPoint[] = [
      { lat: latVal - d, lng: lngVal - d },
      { lat: latVal + d, lng: lngVal - d },
      { lat: latVal + d, lng: lngVal + d },
      { lat: latVal - d, lng: lngVal + d },
    ];

    updateLocation({
      lat: latVal,
      lng: lngVal,
      village: manualVillage.trim() || 'Faisalabad',
      district: manualDistrict.trim() || 'Faisalabad',
      address: `${manualVillage.trim() || 'Farm'}, ${manualDistrict.trim() || 'Faisalabad'}, Punjab`,
      areaAcres: acresVal,
      areaHectares: hectaresVal,
      polygon: poly,
      confirmed: true,
    });

    updateFarmer({
      village: `${manualVillage.trim() || 'Faisalabad'}, ${manualDistrict.trim() || 'Faisalabad'}`,
    });

    setManualSavedMsg(
      language === 'ur'
        ? `محفوظ ہو گیا! ${manualVillage} (${acresVal} ایکڑ)`
        : `Saved manual location: ${manualVillage}, ${manualDistrict} (${acresVal} Acres).`
    );

    if (onLocationConfirmed) {
      onLocationConfirmed();
    }
  };

  const handleStartDrawing = () => {
    setIsDrawing(true);
    setPolygon([]);
    setStatusMsg('Click on the map to place boundary points around your agricultural field.');
  };

  const handleFinishDrawing = () => {
    setIsDrawing(false);
    if (polygon.length < 3) {
      setStatusMsg('Please click at least 3 points to enclose your agricultural plot.');
      return;
    }
    const { acres, hectares } = computePolygonArea(polygon);
    setCalculatedAcres(acres);
    setCalculatedHectares(hectares);
    setStatusMsg(`Boundary mapped: ${acres} Acres (${hectares} Hectares)`);
  };

  const handleClearBoundary = () => {
    setPolygon([]);
    setIsDrawing(false);
    setCalculatedAcres(0);
    setCalculatedHectares(0);
    setStatusMsg('Field boundaries cleared.');
  };

  const handleConfirmLocation = () => {
    if (polygon.length < 3) {
      const deltaLat = 0.0018;
      const deltaLng = 0.0018;
      const defaultPoly: LatLngPoint[] = [
        { lat: centerPoint.lat - deltaLat, lng: centerPoint.lng - deltaLng },
        { lat: centerPoint.lat + deltaLat, lng: centerPoint.lng - deltaLng },
        { lat: centerPoint.lat + deltaLat, lng: centerPoint.lng + deltaLng },
        { lat: centerPoint.lat - deltaLat, lng: centerPoint.lng + deltaLng },
      ];
      setPolygon(defaultPoly);
      const { acres, hectares } = computePolygonArea(defaultPoly);
      setCalculatedAcres(acres);
      setCalculatedHectares(hectares);

      updateLocation({
        lat: centerPoint.lat,
        lng: centerPoint.lng,
        areaAcres: acres,
        areaHectares: hectares,
        polygon: defaultPoly,
        confirmed: true,
      });
    } else {
      updateLocation({
        lat: centerPoint.lat,
        lng: centerPoint.lng,
        areaAcres: calculatedAcres,
        areaHectares: calculatedHectares,
        polygon: polygon,
        confirmed: true,
      });
    }

    setConfirmed(true);
    setStatusMsg('Farm location & boundary coordinates successfully confirmed!');
    if (onLocationConfirmed) onLocationConfirmed();
  };

  const handleSearchLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const lower = searchQuery.toLowerCase();
    if (lower.includes('samundri')) {
      setCenterPoint({ lat: 31.0628, lng: 72.9604 });
    } else if (lower.includes('jaranwala')) {
      setCenterPoint({ lat: 31.3342, lng: 73.4194 });
    } else if (lower.includes('tandlianwala')) {
      setCenterPoint({ lat: 31.0345, lng: 73.1311 });
    } else if (lower.includes('uaf')) {
      setCenterPoint({ lat: 31.4313, lng: 73.0695 });
    } else {
      setCenterPoint({ lat: 31.4504, lng: 73.135 });
    }
    setStatusMsg(`Moved to ${searchQuery}`);
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setCenterPoint({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setStatusMsg('GPS coordinates acquired.');
        },
        () => setStatusMsg('Unable to retrieve GPS. Centering on Faisalabad.')
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Mode Switcher Tabs: Free OpenStreetMap (Default) | Manual Form Backup | Optional Google Maps */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-emerald-900/10 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setProviderMode('leaflet')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              providerMode === 'leaflet'
                ? 'bg-[#123D2A] text-white shadow-sm'
                : 'bg-[#F5F8F5] text-gray-700 hover:bg-emerald-50'
            }`}
          >
            <Globe className="w-4 h-4 text-[#35A853]" />
            <span>
              {language === 'ur'
                ? 'مفت نقشہ (OpenStreetMap)'
                : 'Free Map (Leaflet / OpenStreetMap)'}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-[#35A853] text-white text-[10px]">
              No API Key
            </span>
          </button>

          <button
            type="button"
            onClick={() => setProviderMode('manual')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              providerMode === 'manual'
                ? 'bg-[#123D2A] text-white shadow-sm'
                : 'bg-[#F5F8F5] text-gray-700 hover:bg-emerald-50'
            }`}
          >
            <FileEdit className="w-4 h-4 text-amber-500" />
            <span>
              {language === 'ur' ? 'دستی فارم (بیک اپ)' : 'Manual Form (Backup)'}
            </span>
          </button>

          {mapsApiKey && (
            <button
              type="button"
              onClick={() => setProviderMode('google')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                providerMode === 'google'
                  ? 'bg-[#123D2A] text-white shadow-sm'
                  : 'bg-[#F5F8F5] text-gray-700 hover:bg-emerald-50'
              }`}
            >
              <Compass className="w-4 h-4 text-blue-400" />
              <span>Google Satellite Map</span>
            </button>
          )}
        </div>

        <div className="text-[11px] text-gray-500 px-2">
          Selected: <strong className="text-[#123D2A]">{farmer.location.village}</strong> •{' '}
          <strong className="text-[#35A853]">{farmer.location.areaAcres} Acres</strong>
        </div>
      </div>

      {/* MODE 1: FREE LEAFLET + OPENSTREETMAP (DEFAULT) */}
      {providerMode === 'leaflet' && (
        <LeafletFarmMap onLocationConfirmed={onLocationConfirmed} />
      )}

      {/* MODE 2: MANUAL LOCATION & AREA BACKUP FORM */}
      {providerMode === 'manual' && (
        <div className="bg-white rounded-2xl border border-emerald-900/10 shadow-lg overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-[#123D2A] to-[#102A43] text-white">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <FileEdit className="w-5 h-5 text-[#35A853]" />
              {language === 'ur'
                ? 'کھیت کا مقام اور رقبہ دستی طور پر درج کریں'
                : 'Manual Farm Location & Land Area Form (Backup)'}
            </h3>
            <p className="text-xs text-emerald-100">
              Works offline or on slow rural networks. Enter your village, land area, and optional coordinates.
            </p>
          </div>

          <form onSubmit={handleManualSubmit} className="p-6 space-y-5">
            {/* Quick Tehsil Presets */}
            <div>
              <span className="block text-xs font-bold text-gray-600 mb-2">
                Quick-Fill Faisalabad Tehsil / Area:
              </span>
              <div className="flex flex-wrap gap-2">
                {FAISALABAD_TEHSILS.map(t => (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => {
                      setManualVillage(t.label);
                      setManualDistrict('Faisalabad');
                      setManualLat(String(t.lat));
                      setManualLng(String(t.lng));
                    }}
                    className="px-3 py-1.5 bg-[#F5F8F5] hover:bg-[#E9F7EF] text-[#123D2A] border border-emerald-900/15 rounded-xl text-xs font-semibold transition-colors"
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {language === 'ur' ? 'گاؤں / چک / موضع کا نام *' : 'Village / Chak / Mouza Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={manualVillage}
                  onChange={e => setManualVillage(e.target.value)}
                  placeholder="e.g. Chak 204 RB"
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-[#35A853] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {language === 'ur' ? 'ضلع (District) *' : 'District *'}
                </label>
                <input
                  type="text"
                  required
                  value={manualDistrict}
                  onChange={e => setManualDistrict(e.target.value)}
                  placeholder="Faisalabad"
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-[#35A853] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {language === 'ur' ? 'زرعی رقبہ (ایکڑ میں) *' : 'Farm Land Area (Acres) *'}
                </label>
                <input
                  type="number"
                  step="0.25"
                  min="0.1"
                  required
                  value={manualAcres}
                  onChange={e => setManualAcres(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-[#35A853] outline-none font-bold"
                />
                <span className="text-[11px] text-gray-500 mt-1 block">
                  Approx {((parseFloat(manualAcres) || 0) / 2.471).toFixed(2)} Hectares
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Latitude (Optional)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={manualLat}
                    onChange={e => setManualLat(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-[#35A853] outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Longitude (Optional)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={manualLng}
                    onChange={e => setManualLng(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-[#35A853] outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {manualSavedMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#35A853]" />
                <span>{manualSavedMsg}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setProviderMode('leaflet')}
                className="text-xs font-bold text-[#35A853] hover:underline"
              >
                ← Switch back to Free OpenStreetMap
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#35A853] hover:bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>
                  {language === 'ur' ? 'معلومات محفوظ کریں' : 'Confirm Manual Farm Location'}
                </span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODE 3: OPTIONAL GOOGLE MAPS (IF API KEY CONFIGURED) */}
      {providerMode === 'google' && mapsApiKey && (
        <div className="w-full bg-white rounded-2xl border border-emerald-900/10 shadow-lg overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-[#123D2A] to-[#102A43] text-white flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#35A853]" />
                Select &amp; Map Your Agricultural Land (Google Maps)
              </h3>
              <p className="text-xs text-emerald-100">
                Faisalabad, Punjab, Pakistan • Interactive High-Res Satellite View
              </p>
            </div>

            <form onSubmit={handleSearchLocation} className="flex items-center gap-1.5 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search village, chak, or city (e.g. Jaranwala)..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-white/10 hover:bg-white/20 focus:bg-white focus:text-[#102A43] text-white placeholder-emerald-200/70 text-xs rounded-lg border border-white/20 transition-all outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 bg-[#35A853] hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors shadow"
              >
                Search
              </button>
            </form>
          </div>

          <div className="p-3 bg-[#F5F8F5] border-b border-emerald-900/10 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              {!isDrawing ? (
                <button
                  onClick={handleStartDrawing}
                  className="px-3 py-1.5 bg-[#123D2A] hover:bg-[#1b553b] text-white font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Scissors className="w-3.5 h-3.5 text-[#35A853]" />
                  Draw Land Boundary
                </button>
              ) : (
                <button
                  onClick={handleFinishDrawing}
                  className="px-3 py-1.5 bg-[#35A853] hover:bg-emerald-600 text-white font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-sm animate-pulse"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Close Boundary
                </button>
              )}

              <button
                onClick={handleClearBoundary}
                className="px-3 py-1.5 bg-white hover:bg-red-50 text-gray-700 hover:text-red-700 font-medium rounded-lg border border-gray-300 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Clear
              </button>

              <button
                onClick={() => setMapTypeId(prev => (prev === 'satellite' ? 'roadmap' : 'satellite'))}
                className="px-3 py-1.5 bg-white hover:bg-emerald-50 text-gray-700 font-medium rounded-lg border border-gray-300 flex items-center gap-1"
              >
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                {mapTypeId === 'satellite' ? 'Map View' : 'Satellite View'}
              </button>

              <button
                onClick={handleGetCurrentLocation}
                className="px-3 py-1.5 bg-white hover:bg-emerald-50 text-gray-700 font-medium rounded-lg border border-gray-300 flex items-center gap-1"
              >
                <Navigation className="w-3.5 h-3.5 text-blue-600" />
                GPS
              </button>
            </div>

            <div className="flex items-center gap-3 bg-white px-3 py-1 rounded-lg border border-emerald-900/10 shadow-sm">
              <div>
                <span className="text-gray-500 text-[10px] uppercase font-bold block">Calculated Area</span>
                <span className="font-extrabold text-[#123D2A] text-sm">
                  {calculatedAcres.toFixed(2)} Acres ({calculatedHectares.toFixed(2)} Ha)
                </span>
              </div>
            </div>
          </div>

          <div className="relative w-full h-[460px] md:h-[520px]">
            <APIProvider apiKey={mapsApiKey} libraries={['geometry', 'marker', 'places']}>
              <Map
                defaultCenter={centerPoint}
                defaultZoom={15}
                mapId="DEMO_MAP_ID"
                gestureHandling="greedy"
                disableDefaultUI={false}
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                style={{ width: '100%', height: '100%' }}
              >
                <MapDrawingLayer
                  polygon={polygon}
                  setPolygon={setPolygon}
                  isDrawing={isDrawing}
                  setIsDrawing={setIsDrawing}
                  centerPoint={centerPoint}
                  setCenterPoint={setCenterPoint}
                  mapTypeId={mapTypeId}
                />
              </Map>
            </APIProvider>
          </div>

          <div className="p-4 bg-white border-t border-emerald-900/10 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              {statusMsg && (
                <p className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded inline-block">
                  {statusMsg}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                <span><strong>District:</strong> {farmer.location.district}</span>
                <span><strong>Lat/Lng:</strong> {centerPoint.lat.toFixed(4)}, {centerPoint.lng.toFixed(4)}</span>
                <span><strong>Mapped Area:</strong> {calculatedAcres.toFixed(1)} Acres</span>
              </div>
            </div>

            <button
              onClick={handleConfirmLocation}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm text-white shadow-md transition-all flex items-center gap-2 ${
                confirmed ? 'bg-[#35A853] hover:bg-emerald-600' : 'bg-[#123D2A] hover:bg-[#1b553b]'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              {confirmed ? 'Location Confirmed!' : 'Confirm My Farm Location'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
