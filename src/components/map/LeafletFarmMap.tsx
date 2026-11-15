import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Layers,
  Scissors,
  RotateCcw,
  CheckCircle,
  Search,
  Navigation,
  MousePointerClick,
  Map as MapIcon,
} from 'lucide-react';
import { useFarm } from '../../context/FarmContext';
import { LatLngPoint } from '../../types';

interface LeafletFarmMapProps {
  onLocationConfirmed?: () => void;
}

const FAISALABAD_HUBS = [
  { name: 'Faisalabad Center', lat: 31.4504, lng: 73.135, district: 'Faisalabad' },
  { name: 'Chak 204 RB', lat: 31.4488, lng: 73.1422, district: 'Faisalabad' },
  { name: 'UAF Campus Belt', lat: 31.4313, lng: 73.0695, district: 'Faisalabad' },
  { name: 'Jaranwala', lat: 31.3342, lng: 73.4194, district: 'Faisalabad' },
  { name: 'Samundri', lat: 31.0628, lng: 72.9604, district: 'Faisalabad' },
  { name: 'Tandlianwala', lat: 31.0345, lng: 73.1311, district: 'Faisalabad' },
  { name: 'Chak Jhumra', lat: 31.5681, lng: 73.1836, district: 'Faisalabad' },
];

export const LeafletFarmMap: React.FC<LeafletFarmMapProps> = ({ onLocationConfirmed }) => {
  const { farmer, updateLocation, updateFarmer, language } = useFarm();

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const osmLayerRef = useRef<L.TileLayer | null>(null);
  const satLayerRef = useRef<L.TileLayer | null>(null);
  const pinMarkerRef = useRef<L.Marker | null>(null);
  const polygonLayerRef = useRef<L.Polygon | null>(null);
  const vertexGroupRef = useRef<L.LayerGroup | null>(null);

  const [centerPoint, setCenterPoint] = useState<LatLngPoint>({
    lat: farmer.location.lat || 31.4504,
    lng: farmer.location.lng || 73.135,
  });
  const [polygon, setPolygon] = useState<LatLngPoint[]>(farmer.location.polygon || []);
  const [interactionMode, setInteractionMode] = useState<'pin' | 'draw'>('pin');
  const interactionModeRef = useRef<'pin' | 'draw'>('pin');

  const [tileMode, setTileMode] = useState<'osm' | 'satellite'>('osm');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [confirmed, setConfirmed] = useState(farmer.location.confirmed);
  const [calculatedAcres, setCalculatedAcres] = useState(farmer.location.areaAcres || 5.0);
  const [calculatedHectares, setCalculatedHectares] = useState(farmer.location.areaHectares || 2.02);
  const [selectedLabel, setSelectedLabel] = useState(farmer.location.village || 'Faisalabad');
  const [statusMsg, setStatusMsg] = useState<string | null>(
    language === 'ur'
      ? 'نقشے پر کہیں بھی کلک کر کے اپنا کھیت منتخب کریں (کوئی API Key درکار نہیں)'
      : 'Click anywhere on the Faisalabad map to select your farm location (100% Free, No API Key).'
  );

  useEffect(() => {
    interactionModeRef.current = interactionMode;
  }, [interactionMode]);

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
    const acres = Math.max(0.1, Math.round((areaM2 / 4046.86) * 100) / 100);
    const hectares = Math.max(0.04, Math.round((areaM2 / 10000) * 100) / 100);
    return { acres, hectares };
  }, []);

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [centerPoint.lat, centerPoint.lng],
      zoom: 13,
      zoomControl: true,
    });

    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    });

    const satLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles &copy; Esri &mdash; Open GIS Imagery',
        maxZoom: 19,
      }
    );

    osmLayer.addTo(map);

    const vertexGroup = L.layerGroup().addTo(map);

    osmLayerRef.current = osmLayer;
    satLayerRef.current = satLayer;
    vertexGroupRef.current = vertexGroup;
    mapRef.current = map;

    map.on('click', (e: L.LeafletMouseEvent) => {
      const clickedPt: LatLngPoint = {
        lat: Number(e.latlng.lat.toFixed(6)),
        lng: Number(e.latlng.lng.toFixed(6)),
      };

      if (interactionModeRef.current === 'draw') {
        setPolygon(prev => [...prev, clickedPt]);
        setCenterPoint(clickedPt);
      } else {
        setCenterPoint(clickedPt);
        setConfirmed(false);
        setStatusMsg(
          language === 'ur'
            ? `کھیت کا مقام منتخب ہو گیا: ${clickedPt.lat.toFixed(4)}, ${clickedPt.lng.toFixed(4)}`
            : `Farm pin placed at ${clickedPt.lat.toFixed(4)}° N, ${clickedPt.lng.toFixed(4)}° E`
        );
      }
    });

    // Ensure Leaflet recalculates container dimensions properly (important in modals/tabs)
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 180);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Switch tile layers cleanly
  useEffect(() => {
    const map = mapRef.current;
    const osm = osmLayerRef.current;
    const sat = satLayerRef.current;
    if (!map || !osm || !sat) return;

    if (tileMode === 'satellite') {
      if (map.hasLayer(osm)) map.removeLayer(osm);
      if (!map.hasLayer(sat)) sat.addTo(map);
    } else {
      if (map.hasLayer(sat)) map.removeLayer(sat);
      if (!map.hasLayer(osm)) osm.addTo(map);
    }
  }, [tileMode]);

  // Render Center Pin Marker using custom DivIcon (prevents Vite broken PNG icon URLs)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (pinMarkerRef.current) {
      pinMarkerRef.current.setLatLng([centerPoint.lat, centerPoint.lng]);
    } else {
      const farmIcon = L.divIcon({
        className: 'croprotation-leaflet-pin',
        html: `
          <div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%);">
            <div style="background:#123D2A;color:#fff;font-size:11px;font-weight:700;padding:3px 8px;border-radius:8px;border:2px solid #35A853;white-space:nowrap;box-shadow:0 4px 10px rgba(0,0,0,0.3);">
              Selected Farm
            </div>
            <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:8px solid #123D2A;"></div>
            <div style="width:12px;height:12px;border-radius:9999px;background:#35A853;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.4);margin-top:-2px;"></div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      pinMarkerRef.current = L.marker([centerPoint.lat, centerPoint.lng], {
        icon: farmIcon,
        draggable: true,
      }).addTo(map);

      pinMarkerRef.current.on('dragend', () => {
        const pos = pinMarkerRef.current?.getLatLng();
        if (pos) {
          setCenterPoint({
            lat: Number(pos.lat.toFixed(6)),
            lng: Number(pos.lng.toFixed(6)),
          });
          setConfirmed(false);
        }
      });
    }
  }, [centerPoint]);

  // Render Polygon & Vertex Markers
  useEffect(() => {
    const map = mapRef.current;
    const vertexGroup = vertexGroupRef.current;
    if (!map || !vertexGroup) return;

    vertexGroup.clearLayers();
    if (polygonLayerRef.current) {
      map.removeLayer(polygonLayerRef.current);
      polygonLayerRef.current = null;
    }

    polygon.forEach((pt, idx) => {
      const vIcon = L.divIcon({
        className: 'croprotation-vertex-dot',
        html: `<div style="width:20px;height:20px;border-radius:9999px;background:#35A853;border:2px solid #fff;color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.35);transform:translate(-50%,-50%);">${idx + 1}</div>`,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });
      L.marker([pt.lat, pt.lng], { icon: vIcon }).addTo(vertexGroup);
    });

    if (polygon.length >= 3) {
      const latLngs: L.LatLngExpression[] = polygon.map(p => [p.lat, p.lng]);
      polygonLayerRef.current = L.polygon(latLngs, {
        color: '#35A853',
        weight: 3,
        fillColor: '#35A853',
        fillOpacity: 0.3,
      }).addTo(map);

      const { acres, hectares } = computePolygonArea(polygon);
      setCalculatedAcres(acres);
      setCalculatedHectares(hectares);
    }
  }, [polygon, computePolygonArea]);

  const panToPoint = (pt: LatLngPoint, zoomLevel: number = 14, label?: string) => {
    setCenterPoint(pt);
    setConfirmed(false);
    if (label) setSelectedLabel(label);
    if (mapRef.current) {
      mapRef.current.setView([pt.lat, pt.lng], zoomLevel, { animate: true });
    }
  };

  // Free OpenStreetMap Nominatim Search (no API key required)
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    setIsSearching(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        `${q}, Punjab, Pakistan`
      )}&limit=1`;
      const res = await fetch(url, {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const results = await res.json();
        if (Array.isArray(results) && results.length > 0) {
          const hit = results[0];
          const pt = { lat: parseFloat(hit.lat), lng: parseFloat(hit.lon) };
          panToPoint(pt, 14, q);
          setStatusMsg(`Found "${hit.display_name.split(',').slice(0, 2).join(', ')}" on OpenStreetMap.`);
          setIsSearching(false);
          return;
        }
      }
    } catch {
      // Fallback to local Punjab hub matching below
    }

    const lower = q.toLowerCase();
    const localHit = FAISALABAD_HUBS.find(h => h.name.toLowerCase().includes(lower));
    if (localHit) {
      panToPoint({ lat: localHit.lat, lng: localHit.lng }, 14, localHit.name);
      setStatusMsg(`Centered on ${localHit.name}, Faisalabad.`);
    } else {
      panToPoint({ lat: 31.4504, lng: 73.135 }, 13, q);
      setStatusMsg(`Centered on Faisalabad district for "${q}". Click directly on your farm plot.`);
    }
    setIsSearching(false);
  };

  const handleGetGps = () => {
    if (!navigator.geolocation) {
      setStatusMsg('GPS is not supported in this browser. Click on the map or use Manual Form.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const pt = {
          lat: Number(pos.coords.latitude.toFixed(6)),
          lng: Number(pos.coords.longitude.toFixed(6)),
        };
        panToPoint(pt, 15, 'My GPS Field');
        setStatusMsg(`GPS locked: ${pt.lat.toFixed(4)}° N, ${pt.lng.toFixed(4)}° E`);
      },
      () => {
        setStatusMsg('GPS permission denied. Click on the Faisalabad map to pick your farm.');
      }
    );
  };

  const handleClearBoundary = () => {
    setPolygon([]);
    setInteractionMode('pin');
    setStatusMsg('Boundary cleared. Click on the map to place a farm pin or redraw boundary.');
  };

  const handleConfirm = () => {
    let finalPoly = polygon;
    let finalAcres = calculatedAcres;
    let finalHectares = calculatedHectares;

    if (polygon.length < 3) {
      const d = 0.0018;
      finalPoly = [
        { lat: centerPoint.lat - d, lng: centerPoint.lng - d },
        { lat: centerPoint.lat + d, lng: centerPoint.lng - d },
        { lat: centerPoint.lat + d, lng: centerPoint.lng + d },
        { lat: centerPoint.lat - d, lng: centerPoint.lng + d },
      ];
      finalAcres = farmer.location.areaAcres || 5.0;
      finalHectares = Math.round((finalAcres / 2.471) * 100) / 100;
    }

    updateLocation({
      lat: centerPoint.lat,
      lng: centerPoint.lng,
      village: selectedLabel || farmer.location.village,
      district: 'Faisalabad',
      address: `${selectedLabel || 'Selected Farm'}, Faisalabad, Punjab, Pakistan`,
      areaAcres: finalAcres,
      areaHectares: finalHectares,
      polygon: finalPoly,
      confirmed: true,
    });

    if (selectedLabel && selectedLabel !== 'Faisalabad') {
      updateFarmer({ village: `${selectedLabel}, Faisalabad` });
    }

    setConfirmed(true);
    setStatusMsg(
      language === 'ur'
        ? 'کھیت کا مقام اور رقبہ محفوظ ہو گیا ہے!'
        : `Farm location confirmed at ${centerPoint.lat.toFixed(4)}° N, ${centerPoint.lng.toFixed(4)}° E (${finalAcres} Acres).`
    );

    if (onLocationConfirmed) onLocationConfirmed();
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-emerald-900/10 shadow-lg overflow-hidden">
      {/* Top Bar */}
      <div className="p-4 bg-gradient-to-r from-[#123D2A] to-[#102A43] text-white flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
            <MapIcon className="w-5 h-5 text-[#35A853]" />
            {language === 'ur'
              ? 'مفت اوپن اسٹریٹ میپ (فیصل آباد) — کوئی Key درکار نہیں'
              : 'Free Faisalabad Farm Map (OpenStreetMap & Leaflet)'}
          </h3>
          <p className="text-[11px] text-emerald-200">
            No API Key Required • Click anywhere on the map to select your farm
          </p>
        </div>

        {/* Free Nominatim Search */}
        <form onSubmit={handleSearch} className="flex items-center gap-1.5 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={
                language === 'ur'
                  ? 'چک، گاؤں یا شہر تلاش کریں (مثلاً Jaranwala)'
                  : 'Search village, chak, or tehsil (e.g. Jaranwala, Samundri)...'
              }
              className="w-full pl-9 pr-3 py-1.5 bg-white/10 hover:bg-white/20 focus:bg-white focus:text-[#102A43] text-white placeholder-emerald-200/70 text-xs rounded-lg border border-white/20 outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-3 py-1.5 bg-[#35A853] hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold shrink-0 shadow disabled:opacity-60"
          >
            {isSearching ? '...' : 'Search'}
          </button>
        </form>
      </div>

      {/* Quick Faisalabad Location Presets */}
      <div className="px-3 py-2 bg-emerald-50/70 border-b border-emerald-900/10 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        <span className="font-bold text-[#123D2A] shrink-0 mr-1">Faisalabad Quick Jump:</span>
        {FAISALABAD_HUBS.map(hub => (
          <button
            key={hub.name}
            type="button"
            onClick={() => {
              panToPoint({ lat: hub.lat, lng: hub.lng }, 14, hub.name);
              setStatusMsg(`Centered on ${hub.name}, Faisalabad. Click map to fine-tune pin.`);
            }}
            className="px-2.5 py-1 bg-white hover:bg-[#35A853] hover:text-white text-[#123D2A] rounded-lg border border-emerald-900/15 font-semibold shrink-0 transition-colors"
          >
            {hub.name}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="p-3 bg-[#F5F8F5] border-b border-emerald-900/10 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setInteractionMode('pin')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all border ${
              interactionMode === 'pin'
                ? 'bg-[#123D2A] text-white border-[#123D2A] shadow-sm'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <MousePointerClick className="w-3.5 h-3.5 text-[#35A853]" />
            {language === 'ur' ? 'کلک کر کے پِن لگائیں' : 'Click to Pick Farm'}
          </button>

          <button
            type="button"
            onClick={() => {
              setInteractionMode('draw');
              setPolygon([]);
              setStatusMsg('Click 3+ corners around your field to calculate exact Acres & Hectares.');
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all border ${
              interactionMode === 'draw'
                ? 'bg-[#35A853] text-white border-[#35A853] shadow-sm animate-pulse'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            {language === 'ur' ? 'حدود بنائیں (Area)' : 'Draw Boundary'}
          </button>

          {polygon.length > 0 && (
            <button
              type="button"
              onClick={handleClearBoundary}
              className="px-3 py-1.5 bg-white hover:bg-red-50 text-gray-700 hover:text-red-700 font-medium rounded-lg border border-gray-300 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear
            </button>
          )}

          <button
            type="button"
            onClick={() => setTileMode(prev => (prev === 'osm' ? 'satellite' : 'osm'))}
            className="px-3 py-1.5 bg-white hover:bg-emerald-50 text-gray-700 font-medium rounded-lg border border-gray-300 flex items-center gap-1"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            {tileMode === 'osm' ? 'Satellite Layer' : 'Street Map'}
          </button>

          <button
            type="button"
            onClick={handleGetGps}
            className="px-3 py-1.5 bg-white hover:bg-blue-50 text-gray-700 font-medium rounded-lg border border-gray-300 flex items-center gap-1"
            title="Use My Current GPS"
          >
            <Navigation className="w-3.5 h-3.5 text-blue-600" />
            GPS
          </button>
        </div>

        {/* Live Area & Coordinates Indicator */}
        <div className="flex items-center gap-3 bg-white px-3 py-1 rounded-lg border border-emerald-900/10 shadow-2xs">
          <div>
            <span className="text-gray-400 text-[10px] uppercase font-bold block">Farm Area</span>
            <span className="font-extrabold text-[#123D2A] text-xs sm:text-sm">
              {calculatedAcres.toFixed(2)} Acres{' '}
              <span className="text-gray-500 font-normal text-xs">
                ({calculatedHectares.toFixed(2)} Ha)
              </span>
            </span>
          </div>
          {polygon.length >= 3 && (
            <div className="border-l pl-2.5 border-gray-200 text-xs font-bold text-emerald-700">
              {polygon.length} Corners
            </div>
          )}
        </div>
      </div>

      {/* Leaflet Map Canvas */}
      <div className="relative w-full h-[420px] md:h-[480px] z-0">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Mode Hint Overlay */}
        <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl shadow border border-emerald-900/15 text-[11px] font-semibold text-[#123D2A] flex items-center gap-1.5 pointer-events-none">
          <MapPin className="w-3.5 h-3.5 text-[#35A853]" />
          {interactionMode === 'draw'
            ? 'Draw Mode: Click corners around your plot'
            : 'Click anywhere on the map (or drag marker) to set farm'}
        </div>
      </div>

      {/* Confirmation Footer */}
      <div className="p-4 bg-white border-t border-emerald-900/10 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          {statusMsg && (
            <p className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded inline-block">
              {statusMsg}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
            <span>
              <strong className="text-gray-900">Location:</strong> {selectedLabel}, Faisalabad
            </span>
            <span>
              <strong className="text-gray-900">Lat/Lng:</strong> {centerPoint.lat.toFixed(4)},{' '}
              {centerPoint.lng.toFixed(4)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleConfirm}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm text-white shadow-md transition-all flex items-center gap-2 ${
            confirmed ? 'bg-[#35A853] hover:bg-emerald-600' : 'bg-[#123D2A] hover:bg-[#1b553b]'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          {confirmed
            ? language === 'ur'
              ? 'لوکیشن تصدیق شدہ (Confirmed)'
              : 'Farm Location Confirmed!'
            : language === 'ur'
            ? 'اپنے کھیت کی لوکیشن تصدیق کریں'
            : 'Confirm My Farm Location'}
        </button>
      </div>
    </div>
  );
};
