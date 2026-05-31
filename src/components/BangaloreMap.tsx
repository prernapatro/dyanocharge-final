import React, { useState } from "react";
import { Compass, ZoomIn, ZoomOut } from "lucide-react";
import type { DashboardData, StationData } from "@/services/stationService";
import { bangaloreLocations } from "@/lib/bangaloreLocations";

// Stations static info matching Firebase structure coordinates
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
  onSelectLocation,
  liveData,
  recommendedStationId,
  safeStations,
}) => {
  const [zoomMode, setZoomMode] = useState<"bangalore" | "cluster">("cluster");
  const [hoveredStation, setHoveredStation] = useState<"A" | "B" | "C" | null>(null);

  // Zoom bounds definition
  const bounds = {
    bangalore: {
      latMin: 12.83,
      latMax: 13.12,
      lngMin: 77.44,
      lngMax: 77.77,
    },
    cluster: {
      latMin: 12.905,
      latMax: 12.942,
      lngMin: 77.478,
      lngMax: 77.535,
    },
  }[zoomMode];

  const mapToXY = (lat: number, lng: number) => {
    const x = ((lng - bounds.lngMin) / (bounds.lngMax - bounds.lngMin)) * 100;
    const y = (1 - (lat - bounds.latMin) / (bounds.latMax - bounds.latMin)) * 100;
    return { x: `${x}%`, y: `${y}%` };
  };

  // Convert percentages for SVG path lines (0-100 viewport)
  const mapToPercentageNum = (lat: number, lng: number) => {
    const x = ((lng - bounds.lngMin) / (bounds.lngMax - bounds.lngMin)) * 100;
    const y = (1 - (lat - bounds.latMin) / (bounds.latMax - bounds.latMin)) * 100;
    return { x, y };
  };

  const userPos = mapToPercentageNum(userLat, userLng);
  const recommendedCoords =
    recommendedStationId !== "AVOID"
      ? mapToPercentageNum(
          STATIONS_METADATA[recommendedStationId].lat,
          STATIONS_METADATA[recommendedStationId].lng
        )
      : null;

  // Render stylized water bodies or roads based on zoom mode
  const renderStylizedBackground = () => {
    if (zoomMode === "bangalore") {
      return (
        <>
          {/* Stylized Outer Ring Road and Major Highways */}
          <path
            d="M 15 20 C 35 45, 65 75, 80 90 M 50 10 C 50 40, 52 70, 55 95 M 5 50 C 35 52, 65 55, 95 58"
            fill="none"
            className="stroke-zinc-200 dark:stroke-slate-800"
            strokeWidth="1.5"
            strokeDasharray="4 8"
          />
          <path
            d="M 20 80 C 40 60, 60 40, 80 20"
            fill="none"
            className="stroke-zinc-200 dark:stroke-slate-800"
            strokeWidth="1"
          />
          {/* Stylized Vrishabhavathi River / Lakes */}
          <path
            d="M 10 90 C 30 75, 45 60, 50 45 C 55 30, 70 15, 85 5"
            fill="none"
            className="stroke-cyan-100/60 dark:stroke-cyan-950/40"
            strokeWidth="12"
            strokeLinecap="round"
          />
        </>
      );
    } else {
      {/* Cluster/Local Zoom Mode: show detailed local roads around RR Nagar/Pattanagere */}
      return (
        <>
          {/* Mysore Road */}
          <path
            d="M -10 10 L 110 50"
            fill="none"
            className="stroke-zinc-200 dark:stroke-slate-800"
            strokeWidth="5"
          />
          <text
            x="30%"
            y="20%"
            className="text-[9px] font-medium tracking-wider fill-zinc-400 dark:fill-slate-600 rotate-[12deg] select-none"
          >
            MYSORE ROAD
          </text>

          {/* Pattanagere Metro Line */}
          <path
            d="M -10 15 L 110 55"
            fill="none"
            className="stroke-electric-500/20 dark:stroke-electric-500/10"
            strokeWidth="8"
          />
          <path
            d="M -10 15 L 110 55"
            fill="none"
            className="stroke-electric-500/50"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />

          {/* RR Nagar Main Road */}
          <path
            d="M 30 -10 C 40 40, 65 70, 85 110"
            fill="none"
            className="stroke-zinc-200 dark:stroke-slate-800"
            strokeWidth="4"
          />
          <text
            x="60%"
            y="65%"
            className="text-[9px] font-medium tracking-wider fill-zinc-400 dark:fill-slate-600 rotate-[65deg] select-none"
          >
            RR NAGAR MAIN RD
          </text>

          {/* Secondary Arterial Roads */}
          <path
            d="M 5 60 Q 40 50, 70 65 T 110 80"
            fill="none"
            className="stroke-zinc-100 dark:stroke-slate-800/60"
            strokeWidth="3"
          />
          <path
            d="M 10 30 Q 30 45, 60 20 T 90 5"
            fill="none"
            className="stroke-zinc-100 dark:stroke-slate-800/60"
            strokeWidth="3.5"
          />
        </>
      );
    }
  };

  return (
    <div className="relative w-full h-[360px] md:h-[480px] rounded-2xl overflow-hidden glass-panel shadow-sm border select-none transition-all duration-300">
      {/* HUD Telemetry Grid Backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

      {/* Map Control Bar */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-white/90 dark:bg-obsidian-850/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-zinc-200/50 dark:border-slate-800/80">
        <button
          onClick={() => setZoomMode("bangalore")}
          className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-all ${
            zoomMode === "bangalore"
              ? "bg-zinc-900 text-white dark:bg-white dark:text-obsidian-900"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-slate-800"
          }`}
          title="Show all Bangalore"
        >
          <ZoomOut className="w-3.5 h-3.5" />
          <span>Bangalore</span>
        </button>
        <button
          onClick={() => setZoomMode("cluster")}
          className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-all ${
            zoomMode === "cluster"
              ? "bg-zinc-900 text-white dark:bg-white dark:text-obsidian-900"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-slate-800"
          }`}
          title="Zoom to Pattanagere/RR Nagar Station Hub"
        >
          <ZoomIn className="w-3.5 h-3.5" />
          <span>Local Hub</span>
        </button>
      </div>

      {/* Map Overlay Info Panel */}
      <div className="absolute bottom-4 left-4 z-10 max-w-[200px] md:max-w-xs bg-white/90 dark:bg-obsidian-850/90 backdrop-blur-md px-3 py-2 rounded-xl shadow-sm border border-zinc-200/50 dark:border-slate-800/80 pointer-events-none">
        <div className="flex items-center gap-2 mb-1">
          <Compass className="w-4 h-4 text-electric-500 animate-spin-slow" />
          <span className="text-[10px] md:text-xs font-bold tracking-wider uppercase text-zinc-500 dark:text-zinc-400">
            Telemetry Mapping
          </span>
        </div>
        <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-tight font-medium">
          {zoomMode === "bangalore"
            ? "Overview Mode. Click landmark nodes to manually teleport vehicle location."
            : "Local Hub Active. Animating live optimal charging route."}
        </p>
      </div>

      {/* SVG Canvas */}
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Dynamic Stylized Background Roads & Rivers */}
        {renderStylizedBackground()}

        {/* Animated active routing route */}
        {recommendedCoords && (
          <>
            {/* Inner Glowing Animated Dash Route */}
            <line
              x1={`${userPos.x}%`}
              y1={`${userPos.y}%`}
              x2={`${recommendedCoords.x}%`}
              y2={`${recommendedCoords.y}%`}
              className="stroke-electric-400 svg-route-dash opacity-80"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Outer Route Halo */}
            <line
              x1={`${userPos.x}%`}
              y1={`${userPos.y}%`}
              x2={`${recommendedCoords.x}%`}
              y2={`${recommendedCoords.y}%`}
              className="stroke-electric-500/25"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </>
        )}

        {/* Landmark Nodes (Only shown in Bangalore overview mode to avoid clutter) */}
        {zoomMode === "bangalore" &&
          bangaloreLocations.map((loc) => {
            const { x, y } = mapToXY(loc.lat, loc.lng);
            return (
              <g
                key={loc.name}
                className="cursor-pointer group"
                onClick={() => onSelectLocation(loc.name, loc.lat, loc.lng)}
              >
                {/* Glow ring */}
                <circle
                  cx={x}
                  cy={y}
                  r="6"
                  className="fill-zinc-300/30 group-hover:fill-zinc-400/50 dark:fill-slate-700/20 dark:group-hover:fill-slate-700/50 transition-colors"
                />
                <circle
                  cx={x}
                  cy={y}
                  r="3.5"
                  className="fill-zinc-400 dark:fill-slate-600 group-hover:fill-zinc-600 dark:group-hover:fill-slate-400 transition-colors"
                />
                <text
                  x={x}
                  y={`calc(${y} - 8px)`}
                  textAnchor="middle"
                  className="text-[9px] font-semibold opacity-60 group-hover:opacity-100 fill-zinc-600 dark:fill-zinc-400 transition-all pointer-events-none tracking-wide"
                >
                  {loc.name}
                </text>
              </g>
            );
          })}

        {/* User Location Node */}
        {(() => {
          const { x, y } = mapToXY(userLat, userLng);
          return (
            <g className="transition-all duration-500">
              {/* Radar ring 1 */}
              <circle
                cx={x}
                cy={y}
                r="18"
                className="fill-none stroke-blue-500/30 stroke-[1.5] animate-radar-pulse"
                style={{ transformOrigin: `${x} ${y}` }}
              />
              {/* Core halo */}
              <circle
                cx={x}
                cy={y}
                r="6"
                className="fill-blue-500/30 dark:fill-blue-500/20"
              />
              <circle
                cx={x}
                cy={y}
                r="3.5"
                className="fill-blue-600 dark:fill-blue-500 animate-pulse"
              />
              {/* Location Tag */}
              <g transform={`translate(${parseFloat(x)}, ${parseFloat(y) - 14})`}>
                <rect
                  x="-25"
                  y="-8"
                  width="50"
                  height="14"
                  rx="4"
                  className="fill-blue-600 text-white shadow-sm"
                />
                <text
                  x="0"
                  y="2"
                  textAnchor="middle"
                  className="text-[8px] font-black fill-white tracking-widest uppercase"
                >
                  Vehicle
                </text>
              </g>
            </g>
          );
        })()}

        {/* Charging Stations A, B, C */}
        {(["A", "B", "C"] as const).map((id) => {
          const s = STATIONS_METADATA[id];
          const isSafe = safeStations.includes(id);
          const isRecommended = recommendedStationId === id;
          const { x, y } = mapToXY(s.lat, s.lng);

          const liveStation = liveData.stations[id] as StationData | undefined;
          const occupancy = liveStation?.occupancy ?? 0;
          const load = liveStation?.load ?? 0;
          const waitingTime = liveStation?.waitingTime ?? 0;

          // Determine glowing colors
          const pulseColorClass = isSafe
            ? "stroke-electric-500/50 fill-electric-500/10"
            : "stroke-coral-500/40 fill-coral-500/50";
          const coreColorClass = isSafe
            ? "fill-electric-500 hover:fill-electric-400 text-white"
            : "fill-coral-500 hover:fill-coral-400 text-white";

          return (
            <g
              key={id}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredStation(id)}
              onMouseLeave={() => setHoveredStation(null)}
              onClick={() => onSelectLocation(s.name, s.lat, s.lng)}
            >
              {/* Highlight Halo for Recommended Station */}
              {isRecommended && (
                <circle
                  cx={x}
                  cy={y}
                  r="22"
                  className="fill-none stroke-electric-500/30 stroke-2 animate-pulse"
                />
              )}

              {/* Base Pulsing Radar Ring */}
              <circle
                cx={x}
                cy={y}
                r="14"
                className={`fill-none stroke-[2] transition-colors ${
                  isRecommended ? "animate-ping" : "animate-pulse"
                } ${pulseColorClass}`}
                style={{ transformOrigin: `${x} ${y}`, animationDuration: isRecommended ? "1.8s" : "3s" }}
              />

              {/* Station Circle Core */}
              <circle
                cx={x}
                cy={y}
                r="9.5"
                className={`shadow-lg transition-transform duration-200 hover:scale-125 ${coreColorClass}`}
              />

              {/* Mini Lightning Bolt Inside Node */}
              <path
                d="M 0 -4.5 L -2.5 0.5 L 0.5 0.5 L -0.5 4.5 L 3 -0.5 L 0 -0.5 Z"
                className="fill-white pointer-events-none"
                transform={`translate(${parseFloat(x)}, ${parseFloat(y)}) scale(0.9)`}
              />

              {/* Station ID Identifier Tag */}
              <g transform={`translate(${parseFloat(x) + 12}, ${parseFloat(y) - 6})`}>
                <rect
                  x="-3"
                  y="-6"
                  width="13"
                  height="12"
                  rx="3"
                  className="fill-zinc-900/85 dark:fill-obsidian-800/90 border border-zinc-700/30 dark:border-slate-800"
                />
                <text
                  x="3.5"
                  y="3"
                  textAnchor="middle"
                  className="text-[8px] font-bold fill-white"
                >
                  {id}
                </text>
              </g>

              {/* Hover Tooltip Render */}
              {hoveredStation === id && (
                <g transform={`translate(${parseFloat(x)}, ${parseFloat(y) - 24})`} className="pointer-events-none z-50">
                  {/* Tooltip Card Body */}
                  <rect
                    x="-65"
                    y="-54"
                    width="130"
                    height="50"
                    rx="8"
                    className="fill-zinc-900/95 dark:fill-obsidian-850/95 stroke-zinc-800 dark:stroke-slate-700 shadow-xl"
                    strokeWidth="1"
                  />
                  {/* Header */}
                  <text
                    x="-57"
                    y="-41"
                    className="text-[9px] font-black fill-white uppercase tracking-wider"
                  >
                    Station {id}
                  </text>
                  <text
                    x="57"
                    y="-41"
                    textAnchor="end"
                    className={`text-[8px] font-extrabold tracking-wider ${
                      isSafe ? "fill-electric-400" : "fill-coral-400"
                    }`}
                  >
                    {isSafe ? "SAFE / RECOMMEND" : "UNSAFE / AVOID"}
                  </text>
                  
                  {/* Divider */}
                  <line x1="-57" y1="-34" x2="57" y2="-34" className="stroke-zinc-800 dark:stroke-slate-800" strokeWidth="1" />

                  {/* Metrics */}
                  <text x="-57" y="-23" className="text-[8px] font-medium fill-zinc-400">
                    Occupancy: <tspan className="font-bold fill-white">{occupancy}/3</tspan>
                  </text>
                  <text x="-57" y="-12" className="text-[8px] font-medium fill-zinc-400">
                    Load Status: <tspan className="font-bold fill-white">{load}%</tspan>
                  </text>
                  <text x="57" y="-23" textAnchor="end" className="text-[8px] font-medium fill-zinc-400">
                    Queue: <tspan className="font-bold fill-white">{waitingTime}m</tspan>
                  </text>
                  <text x="57" y="-12" textAnchor="end" className="text-[8px] font-medium fill-zinc-400">
                    Dist: <tspan className="font-bold fill-white">{liveStation?.distance ?? s.lat} km</tspan>
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
