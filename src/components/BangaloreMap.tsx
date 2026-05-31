import React, { useState } from "react";
import { ZoomIn, ZoomOut, MapPin } from "lucide-react";
import type { DashboardData } from "@/services/stationService";

export const STATIONS_METADATA = {
  A: {
    name: "Pattanagere Metro EV Hub",
    region: "Pattanagere",
    lat: 12.9249,
    lng: 77.5106,
    totalSlots: 3,
  },
  B: {
    name: "RR Nagar Main Road EV Charging Point",
    region: "RR Nagar",
    lat: 12.9304,
    lng: 77.5199,
    totalSlots: 3,
  },
  C: {
    name: "Pattanagere Junction Fast Charging Station",
    region: "Pattanagere",
    lat: 12.9182,
    lng: 77.5051,
    totalSlots: 3,
  },
} as const;

type MapProps = {
  userLat: number;
  userLng: number;
  onSelectLocation: (name: string, lat: number, lng: number) => void;
  liveData: DashboardData;
  recommendedStationId: "A" | "B" | "C" | "AVOID";
  safeStations: ("A" | "B" | "C")[];
};

export const BangaloreMap: React.FC<MapProps> = ({
  userLat,
  userLng,
  recommendedStationId,
}) => {
  // Map zoom level state (manipulates the bounding box window size)
  const [zoomOffset, setZoomOffset] = useState<number>(0.015);

  const handleZoomIn = () => {
    setZoomOffset((prev) => Math.max(0.002, prev / 1.5));
  };

  const handleZoomOut = () => {
    setZoomOffset((prev) => Math.min(0.08, prev * 1.5));
  };

  // Generate bounding box using user's coordinates and active zoom offset
  const minLng = userLng - zoomOffset * 1.5;
  const minLat = userLat - zoomOffset;
  const maxLng = userLng + zoomOffset * 1.5;
  const maxLat = userLat + zoomOffset;

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&layer=mapnik&marker=${userLat}%2C${userLng}`;

  // Formatted location subtitle helper
  const locationText = `lat: ${userLat.toFixed(4)}, lng: ${userLng.toFixed(4)}`;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden glass-panel shadow-sm border border-zinc-200/60 dark:border-slate-800/85 transition-all duration-300 flex flex-col">
      {/* 1. Header inside the card */}
      <div className="bg-white/90 dark:bg-obsidian-850/95 backdrop-blur-md px-4 py-3 border-b border-zinc-200/50 dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block leading-none mb-1">
              BANGALORE MAP
            </span>
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">
              Active Vehicle Point ({locationText})
            </span>
          </div>
        </div>

        {/* Pulsing Green "Live" Badge */}
        <div className="flex items-center gap-1.5 bg-electric-500/10 text-electric-600 dark:text-electric-400 px-2.5 py-1 rounded-full border border-electric-500/20 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-electric-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-electric-500"></span>
          </span>
          <span className="text-[9px] font-black tracking-wider uppercase">
            Live
          </span>
        </div>
      </div>

      {/* 2. Embedded Real Map iframe */}
      <div className="relative w-full h-[320px] md:h-[480px] bg-zinc-100 dark:bg-obsidian-900 overflow-hidden">
        <iframe
          title="Bangalore Map"
          src={mapUrl}
          className="h-full w-full border-0 select-none grayscale-[5%] dark:invert-[90%] dark:hue-rotate-[180deg] transition-all duration-300"
          loading="lazy"
        />

        {/* Active Route HUD Overlay (Displays recommended target station) */}
        {recommendedStationId !== "AVOID" && (
          <div className="absolute bottom-4 left-4 z-10 bg-zinc-900/90 dark:bg-obsidian-850/90 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-zinc-850 dark:border-slate-800 pointer-events-none max-w-[220px]">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-electric-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-electric-500"></span>
              </span>
              <span className="text-[9px] font-black text-electric-400 tracking-widest uppercase">
                Active Destination
              </span>
            </div>
            <p className="text-xs font-black text-white mt-1 leading-none">
              Station {recommendedStationId} Recommended
            </p>
          </div>
        )}

        {/* Map Zoom Overlay Buttons */}
        <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1.5">
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-xl bg-white/95 dark:bg-obsidian-850/95 hover:bg-zinc-150 dark:hover:bg-slate-800 text-zinc-700 dark:text-zinc-300 shadow-md border border-zinc-200/60 dark:border-slate-800/80 transition-all"
            title="Zoom In Map"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-xl bg-white/95 dark:bg-obsidian-850/95 hover:bg-zinc-150 dark:hover:bg-slate-800 text-zinc-700 dark:text-zinc-300 shadow-md border border-zinc-200/60 dark:border-slate-800/80 transition-all"
            title="Zoom Out Map"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
