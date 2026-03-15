// MOCK DATA — Replace imports in screens with real Firebase hooks
// when backend is ready. All screens currently import from here.

export const dustbins = [
  { id: 1, location: "City Center", methane_ppm: 120, temperature: 29, humidity: 65, pump_status: "OFF", valve_status: "CLOSED", gas_collected_liters: 12.4, last_update: "2026-03-12T08:30:00Z", lat: 28.6139, lng: 77.2090 },
  { id: 2, location: "Market Road", methane_ppm: 340, temperature: 31, humidity: 58, pump_status: "OFF", valve_status: "CLOSED", gas_collected_liters: 28.1, last_update: "2026-03-12T08:25:00Z", lat: 28.6200, lng: 77.2150 },
  { id: 3, location: "Industrial Area", methane_ppm: 680, temperature: 33, humidity: 52, pump_status: "OFF", valve_status: "CLOSED", gas_collected_liters: 45.7, last_update: "2026-03-12T08:20:00Z", lat: 28.6300, lng: 77.2250 },
  { id: 4, location: "Residential Block A", methane_ppm: 95, temperature: 27, humidity: 70, pump_status: "OFF", valve_status: "CLOSED", gas_collected_liters: 5.2, last_update: "2026-03-12T08:15:00Z", lat: 28.6050, lng: 77.1990 },
  { id: 5, location: "Park Avenue", methane_ppm: 180, temperature: 28, humidity: 68, pump_status: "OFF", valve_status: "CLOSED", gas_collected_liters: 15.8, last_update: "2026-03-12T08:10:00Z", lat: 28.6180, lng: 77.2030 },
  { id: 6, location: "Hospital Zone", methane_ppm: 250, temperature: 30, humidity: 60, pump_status: "OFF", valve_status: "CLOSED", gas_collected_liters: 22.3, last_update: "2026-03-12T08:05:00Z", lat: 28.6100, lng: 77.2200 },
  { id: 7, location: "Bus Terminal", methane_ppm: 410, temperature: 32, humidity: 55, pump_status: "ON", valve_status: "OPEN", gas_collected_liters: 38.9, last_update: "2026-03-12T08:00:00Z", lat: 28.6250, lng: 77.1950 },
  { id: 8, location: "University Campus", methane_ppm: 75, temperature: 26, humidity: 72, pump_status: "OFF", valve_status: "CLOSED", gas_collected_liters: 3.1, last_update: "2026-03-12T07:55:00Z", lat: 28.6350, lng: 77.2100 },
];

export const alerts = [
  { id: 1, bin_id: 3, message: "High methane detected in Bin #3", severity: "critical", timestamp: "2026-03-12T08:20:00Z" },
  { id: 2, bin_id: 7, message: "Gas collection started in Bin #7", severity: "low", timestamp: "2026-03-12T08:00:00Z" },
  { id: 3, bin_id: 2, message: "Methane rising above threshold in Bin #2", severity: "medium", timestamp: "2026-03-12T07:45:00Z" },
  { id: 4, bin_id: 6, message: "Medium methane level detected in Bin #6", severity: "medium", timestamp: "2026-03-12T07:30:00Z" },
  { id: 5, bin_id: 3, message: "Methane spike detected in Bin #3", severity: "high", timestamp: "2026-03-12T06:15:00Z" },
  { id: 6, bin_id: 1, message: "Routine check completed for Bin #1", severity: "low", timestamp: "2026-03-12T06:00:00Z" },
];

export const methaneChartData = [
  { time: "00:00", ppm: 80 },
  { time: "04:00", ppm: 150 },
  { time: "08:00", ppm: 320 },
  { time: "12:00", ppm: 480 },
  { time: "16:00", ppm: 380 },
  { time: "20:00", ppm: 220 },
  { time: "24:00", ppm: 140 },
];

export const gasCollectionData = [
  { day: "Mon", collected: 12 },
  { day: "Tue", collected: 18 },
  { day: "Wed", collected: 24 },
  { day: "Thu", collected: 15 },
  { day: "Fri", collected: 30 },
  { day: "Sat", collected: 22 },
  { day: "Sun", collected: 10 },
];

export const dailyMethaneData = [
  { date: "Mar 6", detected: 420 },
  { date: "Mar 7", detected: 380 },
  { date: "Mar 8", detected: 510 },
  { date: "Mar 9", detected: 460 },
  { date: "Mar 10", detected: 390 },
  { date: "Mar 11", detected: 550 },
  { date: "Mar 12", detected: 480 },
];

export const efficiencyData = [
  { month: "Oct", efficiency: 62 },
  { month: "Nov", efficiency: 68 },
  { month: "Dec", efficiency: 71 },
  { month: "Jan", efficiency: 75 },
  { month: "Feb", efficiency: 78 },
  { month: "Mar", efficiency: 82 },
];

export const getStatus = (bin) => {
  if (bin.pump_status === "ON") return "collection";
  if (bin.methane_ppm > 500) return "high";
  if (bin.methane_ppm > 200) return "medium";
  return "normal";
};

export const statusLabel = {
  normal: "Normal",
  medium: "Medium Methane",
  high: "High Methane",
  collection: "Gas Collection Active",
};