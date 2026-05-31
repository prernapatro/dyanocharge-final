import type { DashboardData } from "@/services/stationService";

type StationName = "A" | "B" | "C" | "AVOID";

export type RecommendationResult = {
  station: StationName;
  reason: string;
};

function stationScore(station: {
  load: number;
  loadStatus: "GREEN" | "RED";
  occupancy: number;
  distance: number;
  waitingTime: number;
}) {
  return (
    station.load * 0.45 +
    station.waitingTime * 0.3 +
    station.distance * 0.2 +
    station.occupancy * 15
  );
}

function isStationSafe(
  station: {
    load: number;
    loadStatus: "GREEN" | "RED";
    occupancy: number;
    distance: number;
    waitingTime: number;
  },
  battery: number
) {
  const fullRangeKm = 335;
  const batteryRangeKm = (battery / 100) * fullRangeKm;

  if (station.load >= 90) return false;
  if (station.loadStatus === "RED") return false;
  if (station.occupancy >= 3) return false;
  if (station.waitingTime > 45) return false;
  if (station.distance > batteryRangeKm) return false;

  return true;
}

export function getRecommendation(data: DashboardData): RecommendationResult {
  if (data.grid.headroom <= 5 || data.grid.status === "RED") {
    return {
      station: "AVOID",
      reason:
        "Grid headroom is critically low, so no new charging session is recommended.",
    };
  }

  const battery = data.vehicle.battery;

  const candidates = (["A", "B", "C"] as const)
    .map((name) => {
      const station = data.stations[name];

      return {
        name,
        station,
        score: stationScore(station),
        safe: isStationSafe(station, battery),
      };
    })
    .filter((item) => item.safe);

  if (candidates.length === 0) {
    return {
      station: "AVOID",
      reason:
        "No station is currently safe, reachable, and available. The system is avoiding overloaded, full, high-wait, or out-of-range stations.",
    };
  }

  candidates.sort((a, b) => a.score - b.score);

  const best = candidates[0];

  return {
    station: best.name,
    reason: `Station ${best.name} is recommended because it is safe, reachable with the current battery, not overloaded, and has the best balance of load, waiting time, distance, and occupancy.`,
  };
}