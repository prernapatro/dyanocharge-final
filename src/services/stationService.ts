import { ref, onValue, set } from "firebase/database";
import { database } from "@/lib/firebase";

export type StationData = {
  load: number;
  loadStatus: "GREEN" | "RED";
  occupancy: number;
  occupied: boolean;
  distance: number;
  waitingTime: number;
  sensorDistanceCm?: number;
  lat: number;
  lng: number;
};

export type DashboardData = {
  stations: {
    A: StationData;
    B: StationData;
    C: StationData;
  };
  grid: {
    headroom: number;
    status: "GREEN" | "RED";
  };
  vehicle: {
    battery: number;
  };
  recommendation?: {
    station: "A" | "B" | "C" | "AVOID";
    ledStatus: "GREEN" | "RED";
    reason: string;
    updatedAt?: string;
  };
};

export const DEFAULT_DASHBOARD_DATA: DashboardData = {
  stations: {
    A: { load: 42, loadStatus: "GREEN", occupancy: 1, occupied: false, distance: 1.2, waitingTime: 6 },
    B: { load: 68, loadStatus: "GREEN", occupancy: 2, occupied: false, distance: 2.4, waitingTime: 12 },
    C: { load: 91, loadStatus: "RED", occupancy: 3, occupied: true, distance: 3.1, waitingTime: 28 },
  },
  grid: { headroom: 32, status: "GREEN" },
  vehicle: { battery: 45 },
};

const toNumber = (value: unknown, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const toStatus = (value: unknown, fallback: "GREEN" | "RED") =>
  value === "RED" || value === "GREEN" ? value : fallback;

const normalizeDashboardData = (raw: Partial<DashboardData> | null): DashboardData => ({
  stations: {
    A: normalizeStation(raw?.stations?.A, DEFAULT_DASHBOARD_DATA.stations.A),
    B: normalizeStation(raw?.stations?.B, DEFAULT_DASHBOARD_DATA.stations.B),
    C: normalizeStation(raw?.stations?.C, DEFAULT_DASHBOARD_DATA.stations.C),
  },
  grid: {
    headroom: toNumber(raw?.grid?.headroom, DEFAULT_DASHBOARD_DATA.grid.headroom),
    status: toStatus(raw?.grid?.status, DEFAULT_DASHBOARD_DATA.grid.status),
  },
  vehicle: {
    battery: toNumber(raw?.vehicle?.battery, DEFAULT_DASHBOARD_DATA.vehicle.battery),
  },
  recommendation: raw?.recommendation,
});

const normalizeStation = (station: Partial<StationData> | undefined, fallback: StationData): StationData => ({
  load: toNumber(station?.load, fallback.load),
  loadStatus: toStatus(station?.loadStatus, fallback.loadStatus),
  occupancy: toNumber(station?.occupancy, fallback.occupancy),
  occupied: typeof station?.occupied === "boolean" ? station.occupied : fallback.occupied,
  distance: toNumber(station?.distance, fallback.distance),
  waitingTime: toNumber(station?.waitingTime, fallback.waitingTime),
  sensorDistanceCm: station?.sensorDistanceCm,
});

export function subscribeToDashboardData(
  callback: (data: DashboardData) => void
) {
  const rootRef = ref(database, "/");

  callback(DEFAULT_DASHBOARD_DATA);

  return onValue(
    rootRef,
    (snapshot) => callback(normalizeDashboardData(snapshot.val() as Partial<DashboardData> | null)),
    () => callback(DEFAULT_DASHBOARD_DATA)
  );
}

export async function writeRecommendationToFirebase(
  station: "A" | "B" | "C" | "AVOID",
  reason: string
) {
  const ledStatus = station === "AVOID" ? "RED" : "GREEN";

  await set(ref(database, "/recommendation"), {
    station,
    ledStatus,
    reason,
    updatedAt: new Date().toISOString(),
  });
}