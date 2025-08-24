import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import { employeeRepo } from "../repositories/employeeRepo.js";
import { notificationService } from "./notificationService.js";

const ORS_BASE = "https://api.openrouteservice.org/v2/directions";
const DEFAULT_PROFILE = "driving-car";



function toMinutes(seconds) {
  return Math.round((seconds || 0) / 60);
}

function normalizeORS(json) {
  const route = json?.routes?.[0];
  if (!route) {
    throw Object.assign(new Error("No route found"), { status: 404 });
  }
  const distanceKm = +(route.summary?.distance || 0) / 1000;
  const durationMin = toMinutes(route.summary?.duration || 0);

  return {
    distanceKm: +distanceKm.toFixed(2),
    durationMin,
    geometry: route.geometry || null, // polyline
    raw: json,
  };
}

function coordsToQuery([lng, lat]) {
  if (
    !Array.isArray([lng, lat]) ||
    typeof lng !== "number" ||
    typeof lat !== "number"
  ) {
    throw Object.assign(new Error("Invalid coordinates"), { status: 400 });
  }
  return `${lng},${lat}`;
}

export const routesService = {
  
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
   * Route from Employee.homeLocation -> Employee.branch.location
   */
  async getForEmployee(employeeId, profile = DEFAULT_PROFILE) {
    const emp = await employeeRepo.findById(employeeId);
    if (!emp) {
      throw Object.assign(new Error("Employee not found"), { status: 404 });
    }

    const home = emp.location?.coordinates; // [lng, lat]
    const office = emp.branch?.location?.coordinates; // [lng, lat]

    if (!home || home.length !== 2) {
      throw Object.assign(
        new Error("Employee homeLocation missing or invalid"),
        { status: 400 }
      );
    }
    if (!office || office.length !== 2) {
      throw Object.assign(new Error("Branch location missing or invalid"), {
        status: 400,
      });
    }

    const url = `${ORS_BASE}/${encodeURIComponent(
      profile
    )}?api_key=${encodeURIComponent(
      process.env.ORS_API_KEY
    )}&start=${coordsToQuery(home)}&end=${coordsToQuery(office)}`;

    const { data } = await axios.get(url, { timeout: 15000 });
    const normalized = normalizeORS(data);

    // Attach some useful context
    return {
      ...normalized,
      employee: {
        id: emp._id,
        name: emp.name,
        email: emp.email,
        officeStartTime: emp.officeStartTime || null,
        officeEndTime: emp.officeEndTime || null,
      },
      branch: {
        id: emp.branch?._id || null,
        name: emp.branch?.name || null,
      },
    };
  },
  async notifyEmployeeRoute(employeeId, profile = DEFAULT_PROFILE) {
    const result = await this.getForEmployee(employeeId, profile);

    const message = `Best route: ${result.distanceKm} km (~${result.durationMin} min)${
      result.employee?.officeStartTime
        ? `; office starts at ${result.employee.officeStartTime}`
        : ""
    }`;

    // NOTE: employeeRepo.findById populates 'user'
    const emp = await employeeRepo.findById(employeeId);
    if (!emp) {
      throw Object.assign(new Error("Employee not found"), { status: 404 });
    }

    // Store both human-friendly message and machine-readable payload
    await notificationService.create(
      emp.user, // user id
      message,
      "ROUTE_UPDATE",
      {
        employeeId,
        branchId: emp.branch?._id || null,
        profile,
        distanceKm: result.distanceKm,
        durationMin: result.durationMin,
        geometry: result.geometry, // polyline string
        generatedAt: new Date().toISOString(),
      }
    );

    return {
      message: "Route computed and notification created",
      route: result,
    };
  },
};