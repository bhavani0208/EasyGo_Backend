// import axios from "axios";
// import dotenv from "dotenv";
// import { DateTime } from "luxon";
// import { employeeRepo } from "../repositories/employeeRepo.js";
// import { notificationService } from "./notificationService.js";

// dotenv.config();

// const ORS_BASE = "https://api.openrouteservice.org/v2/directions";
// const DEFAULT_PROFILE = "driving-car";

// function toMinutes(seconds) {
//   return Math.round((seconds || 0) / 60);
// }

// function nextOccurrenceISO(
//   hhmm,
//   tz = process.env.DEFAULT_TIMEZONE || "Asia/Kolkata"
// ) {
//   if (!hhmm) return null;
//   const [hh, mm] = hhmm.split(":").map(Number);
//   if (Number.isNaN(hh) || Number.isNaN(mm)) return null;
//   // current time in target zone
//   let now = DateTime.now().setZone(tz);
//   let target = now.set({ hour: hh, minute: mm, second: 0, millisecond: 0 });
//   if (target <= now) {
//     target = target.plus({ days: 1 });
//   }
//   // Convert to ISO in UTC (Mapbox accepts ISO)
//   return target.toUTC().toISO();
// }

// // Convert Mapbox geojson coordinates [lng,lat] to [lat,lng]
// function coordsLngLatToLatLng(coords) {
//   return coords.map(([lng, lat]) => [lat, lng]);
// }

// // Mapbox route (traffic-aware) for driving-traffic. start/end arrays are [lng, lat]
// async function mapboxRoute(startLngLat, endLngLat, departAtIso = null) {
//   if (!process.env.MAPBOX_TOKEN) {
//     throw new Error("MAPBOX_TOKEN not configured");
//   }
//   const accessToken = process.env.MAPBOX_TOKEN;
//   const profile = "mapbox/driving-traffic";
//   const coords = `${startLngLat[0]},${startLngLat[1]};${endLngLat[0]},${endLngLat[1]}`;
//   const params = new URLSearchParams({
//     geometries: "geojson",
//     overview: "full",
//     steps: "true",
//     access_token: accessToken,
//   });
//   if (departAtIso) params.append("depart_at", departAtIso);

//   const url = `https://api.mapbox.com/directions/v5/${profile}/${coords}?${params.toString()}`;
//   const res = await axios.get(url);
//   if (!res.data?.routes?.length) throw new Error("No route from Mapbox");
//   const r = res.data.routes[0];

//   // Collect instructions
//   const steps = [];
//   if (r.legs && Array.isArray(r.legs)) {
//     for (const leg of r.legs) {
//       for (const step of leg.steps || []) {
//         // Mapbox step maneuver has instruction text
//         steps.push({
//           instruction: step.maneuver?.instruction || step.name || "",
//           distance: step.distance,
//           duration: step.duration,
//         });
//       }
//     }
//   }

//   return {
//     distance: r.distance,
//     duration: r.duration,
//     geometry: coordsLngLatToLatLng(r.geometry.coordinates), // [[lat,lng],...]
//     steps,
//   };
// }

// // ORS fallback: call your existing ORS code (adjust to match your current POST shape)
// async function orsRoute(startLngLat, endLngLat, profile = "driving-car") {
//   // Build body in format ORS expects coordinates as [lng, lat]
//   const body = {
//     coordinates: [
//       [startLngLat[0], startLngLat[1]],
//       [endLngLat[0], endLngLat[1]],
//     ],
//   };

//   const url = `${ORS_BASE}/${profile}/geojson`;
//   const resp = await axios.post(url, body, {
//     headers: { Authorization: process.env.ORS_KEY },
//   });

//   const feat = resp.data?.features?.[0];
//   const seg = feat?.properties?.segments?.[0];

//   const coords = feat?.geometry?.coordinates || []; // [lng,lat]...
//   const steps = (seg?.steps || []).map((s) => ({
//     instruction: s.instruction,
//     distance: s.distance,
//     duration: s.duration,
//   }));

//   return {
//     distance: seg?.distance || 0,
//     duration: seg?.duration || 0,
//     geometry: coordsLngLatToLatLng(coords),
//     steps,
//   };
// }

// function normalizeORS(json) {
//   const route = json?.routes?.[0];
//   if (!route) throw Object.assign(new Error("No route found"), { status: 404 });

//   return {
//     distanceKm: +(route.summary?.distance / 1000 || 0).toFixed(2),
//     durationMin: toMinutes(route.summary?.duration || 0),
//     geometry: route.geometry || null,
//   };
// }

// function coordsToQuery([lng, lat]) {
//   if (typeof lng !== "number" || typeof lat !== "number") {
//     throw Object.assign(new Error("Invalid coordinates"), { status: 400 });
//   }
//   return `${lng},${lat}`;
// }

// export const routesService = {
//   /**
//    * Route by raw coordinates
//    */
//   async getByCoords(start, end, profile = DEFAULT_PROFILE) {
//     if (!start?.lat || !start?.lng || !end?.lat || !end?.lng) {
//       throw Object.assign(new Error("start/end are required"), { status: 400 });
//     }

//     const url = `${ORS_BASE}/${encodeURIComponent(
//       profile
//     )}?api_key=${encodeURIComponent(
//       process.env.ORS_API_KEY
//     )}&start=${start.lng},${start.lat}&end=${end.lng},${end.lat}`;

//     const { data } = await axios.get(url, { timeout: 15000 });
//     return normalizeORS(data);
//   },

//   /**
//    * Route from Employee.home -> Branch.office
//    */
//   async getForEmployee(employeeId, profile = DEFAULT_PROFILE) {
//     const emp = await employeeRepo.findById(employeeId);
//     if (!emp)
//       throw Object.assign(new Error("Employee not found"), { status: 404 });

//     const home = emp.location?.coordinates; // [lng, lat]
//     const office = emp.branch?.location?.coordinates; // [lng, lat]
//     if (!home || !office)
//       throw Object.assign(new Error("Invalid employee/branch location"), {
//         status: 400,
//       });

//     const url = `${ORS_BASE}/${encodeURIComponent(
//       profile
//     )}?api_key=${encodeURIComponent(process.env.ORS_API_KEY)}&start=${coordsToQuery(
//       home
//     )}&end=${coordsToQuery(office)}`;

//     const { data } = await axios.get(url, { timeout: 15000 });
//     const normalized = normalizeORS(data);

//     // Calculate suggested leave time
//     let suggestedLeave = null;
//     if (emp.officeStartTime) {
//       const start = DateTime.fromISO(emp.officeStartTime, {
//         zone: process.env.TIMEZONE || "UTC",
//       });
//       suggestedLeave = start
//         .minus({
//           minutes:
//             normalized.durationMin +
//             (parseInt(process.env.ROUTE_BUFFER_MINUTES) || 0),
//         })
//         .toISO();
//     }

//     return {
//       ...normalized,
//       employee: {
//         id: emp._id,
//         name: emp.name,
//         officeStartTime: emp.officeStartTime || null,
//       },
//       branch: {
//         id: emp.branch?._id,
//         name: emp.branch?.name,
//       },
//       suggestedLeave,
//     };
//   },

//   /**
//    * Compute and notify employee about their route
//    */
//   async notifyEmployeeRoute(employeeId, profile = DEFAULT_PROFILE) {
//     const result = await this.getForEmployee(employeeId, profile);
//     const message = `Route: ${result.distanceKm} km (~${result.durationMin} min). Suggested leave: ${
//       result.suggestedLeave || "N/A"
//     }`;

//     const emp = await employeeRepo.findById(employeeId);
//     if (!emp)
//       throw Object.assign(new Error("Employee not found"), { status: 404 });

//     await notificationService.create(emp.user, message, "ROUTE_UPDATE", result);

//     return { message: "Notification created", route: result };
//   },
// };

import axios from "axios";
import { DateTime } from "luxon";
import { employeeRepo } from "../repositories/employeeRepo.js";
import { notificationService } from "./notificationService.js";

const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;
const ORS_KEY = process.env.ORS_KEY;
const DEFAULT_TZ = process.env.DEFAULT_TIMEZONE || "Asia/Kolkata";

/**
 * 🔹 Helper: compute next ISO datetime for given "HH:mm"
 */
function nextOccurrenceISO(timeStr, tz = DEFAULT_TZ) {
  const now = DateTime.now().setZone(tz);
  let [h, m] = timeStr.split(":").map(Number);
  let dt = now.set({ hour: h, minute: m, second: 0, millisecond: 0 });
  if (dt < now) dt = dt.plus({ days: 1 });
  return dt.toISO();
}

/**
 * 🔹 Convert ORS [lng, lat] → [lat, lng]
 */
function coordsLngLatToLatLng(coords = []) {
  return coords.map(([lng, lat]) => [lat, lng]);
}

/**
 * 🔹 Get traffic-aware route from Mapbox
 */
async function mapboxRoute(home, office, departAtIso, profile = "driving") {
  const departAt = departAtIso || DateTime.now().toISO();

  const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${home[0]},${home[1]};${office[0]},${office[1]}`;
  const resp = await axios.get(url, {
    params: {
      access_token: MAPBOX_TOKEN,
      geometries: "polyline6",
      steps: true,
      overview: "full",
      depart_at: departAt,
      annotations: "duration,distance",
    },
  });

  const route = resp.data.routes[0];
  const geometry = route.geometry ? decodePolyline6(route.geometry) : [];

  const steps =
    route.legs?.[0]?.steps?.map((s) => ({
      instruction: s.maneuver.instruction,
      distance: (s.distance / 1000).toFixed(2) + " km",
      duration: Math.round(s.duration / 60) + " min",
    })) || [];

  return {
    provider: "mapbox",
    distanceKm: (route.distance / 1000).toFixed(2),
    durationMin: Math.round(route.duration / 60),
    geometry,
    steps,
  };
}

/**
 * 🔹 Decode Mapbox polyline6 → [lat, lng]
 */
function decodePolyline6(encoded) {
  let points = [];
  let index = 0,
    lat = 0,
    lng = 0;

  while (index < encoded.length) {
    let result = 1,
      shift = 0,
      b;
    do {
      b = encoded.charCodeAt(index++) - 63 - 1;
      result += b << shift;
      shift += 5;
    } while (b >= 0x1f);
    lat += result & 1 ? ~(result >> 1) : result >> 1;

    result = 1;
    shift = 0;
    do {
      b = encoded.charCodeAt(index++) - 63 - 1;
      result += b << shift;
      shift += 5;
    } while (b >= 0x1f);
    lng += result & 1 ? ~(result >> 1) : result >> 1;

    points.push([lat * 1e-6, lng * 1e-6]);
  }
  return points;
}

/**
 * 🔹 Get fallback route from ORS (no traffic)
 */
async function orsRoute(home, office, profile = "driving-car") {
  const url = `https://api.openrouteservice.org/v2/directions/${profile}/geojson`;
  const body = { coordinates: [home, office] };

  const resp = await axios.post(url, body, {
    headers: { Authorization: ORS_KEY },
  });

  const feat = resp.data?.features?.[0];
  const seg = feat?.properties?.segments?.[0];

  return {
    provider: "ors",
    distanceKm: (seg?.distance || 0) / 1000,
    durationMin: Math.round((seg?.duration || 0) / 60),
    geometry: coordsLngLatToLatLng(feat?.geometry?.coordinates || []),
    steps:
      seg?.steps?.map((s) => ({
        instruction: s.instruction,
        distance: (s.distance / 1000).toFixed(2) + " km",
        duration: Math.round(s.duration / 60) + " min",
      })) || [],
  };
}

export const routesService = {
  // Get route for employee
  async getForEmployee(employeeId, profile = "driving-car", departAt) {
    const emp = await employeeRepo.findById(employeeId).populate("branch");
    if (!emp)
      throw Object.assign(new Error("Employee not found"), { status: 404 });

    const home = emp.location?.coordinates;
    const office = emp.branch?.location?.coordinates;
    if (!home || !office)
      throw Object.assign(new Error("Missing home/office location"), {
        status: 400,
      });

    if (emp.workMode === "REMOTE") {
      return {
        message: "Employee is remote — no commute needed",
        distanceKm: 0,
        durationMin: 0,
        geometry: [],
        steps: [],
      };
    }

    let departAtIso =
      departAt ||
      (emp.officeStartTime ? nextOccurrenceISO(emp.officeStartTime) : null);

    try {
      return await mapboxRoute(home, office, departAtIso, "driving-traffic");
    } catch (e) {
      return await orsRoute(home, office, profile);
    }
  },

  // Notify employee about route
  async notifyEmployeeRoute(employeeId, profile = "driving-car", departAt) {
    const route = await this.getForEmployee(employeeId, profile, departAt);
    await notificationService.send(employeeId, "ROUTE_UPDATE", route);
    return route;
  },
};
