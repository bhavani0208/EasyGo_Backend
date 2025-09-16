import axios from "axios";
import dotenv from "dotenv";
import { DateTime } from "luxon";
import { employeeRepo } from "../repositories/employeeRepo.js";
import { notificationService } from "./notificationService.js";

dotenv.config();

const ORS_BASE = "https://api.openrouteservice.org/v2/directions";
const DEFAULT_PROFILE = "driving-car";

function toMinutes(seconds) {
  return Math.round((seconds || 0) / 60);
}

function normalizeORS(json) {
  const route = json?.routes?.[0];
  if (!route) throw Object.assign(new Error("No route found"), { status: 404 });

  return {
    distanceKm: +(route.summary?.distance / 1000 || 0).toFixed(2),
    durationMin: toMinutes(route.summary?.duration || 0),
    geometry: route.geometry || null,
  };
}

function coordsToQuery([lng, lat]) {
  if (typeof lng !== "number" || typeof lat !== "number") {
    throw Object.assign(new Error("Invalid coordinates"), { status: 400 });
  }
  return `${lng},${lat}`;
}

export const routesService = {
  /**
   * Route by raw coordinates
   */
  async getByCoords(start, end, profile = DEFAULT_PROFILE) {
    if (!start?.lat || !start?.lng || !end?.lat || !end?.lng) {
      throw Object.assign(new Error("start/end are required"), { status: 400 });
    }

    const url = `${ORS_BASE}/${encodeURIComponent(
      profile
    )}?api_key=${encodeURIComponent(
      process.env.ORS_API_KEY
    )}&start=${start.lng},${start.lat}&end=${end.lng},${end.lat}`;

    const { data } = await axios.get(url, { timeout: 15000 });
    return normalizeORS(data);
  },

  /**
   * Route from Employee.home -> Branch.office
   */
  async getForEmployee(employeeId, profile = DEFAULT_PROFILE) {
    const emp = await employeeRepo.findById(employeeId);
    if (!emp)
      throw Object.assign(new Error("Employee not found"), { status: 404 });

    const home = emp.location?.coordinates; // [lng, lat]
    const office = emp.branch?.location?.coordinates; // [lng, lat]
    if (!home || !office)
      throw Object.assign(new Error("Invalid employee/branch location"), {
        status: 400,
      });

    const url = `${ORS_BASE}/${encodeURIComponent(
      profile
    )}?api_key=${encodeURIComponent(process.env.ORS_API_KEY)}&start=${coordsToQuery(
      home
    )}&end=${coordsToQuery(office)}`;

    const { data } = await axios.get(url, { timeout: 15000 });
    const normalized = normalizeORS(data);

    // Calculate suggested leave time
    let suggestedLeave = null;
    if (emp.officeStartTime) {
      const start = DateTime.fromISO(emp.officeStartTime, {
        zone: process.env.TIMEZONE || "UTC",
      });
      suggestedLeave = start
        .minus({
          minutes:
            normalized.durationMin +
            (parseInt(process.env.ROUTE_BUFFER_MINUTES) || 0),
        })
        .toISO();
    }

    return {
      ...normalized,
      employee: {
        id: emp._id,
        name: emp.name,
        officeStartTime: emp.officeStartTime || null,
      },
      branch: {
        id: emp.branch?._id,
        name: emp.branch?.name,
      },
      suggestedLeave,
    };
  },

  /**
   * Compute and notify employee about their route
   */
  async notifyEmployeeRoute(employeeId, profile = DEFAULT_PROFILE) {
    const result = await this.getForEmployee(employeeId, profile);
    const message = `Route: ${result.distanceKm} km (~${result.durationMin} min). Suggested leave: ${
      result.suggestedLeave || "N/A"
    }`;

    const emp = await employeeRepo.findById(employeeId);
    if (!emp)
      throw Object.assign(new Error("Employee not found"), { status: 404 });

    await notificationService.create(emp.user, message, "ROUTE_UPDATE", result);

    return { message: "Notification created", route: result };
  },
};
