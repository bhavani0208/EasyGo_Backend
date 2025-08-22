import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import { employeeRepo } from "../repositories/employeeRepo.js";
import { notificationService } from "./notificationService.js";

const ORS_BASE = "https://api.openrouteservice.org/v2/directions";

function coordsToQuery(lng, lat) {
  if (typeof lng !== "number" || typeof lat !== "number") {
    throw Object.assign(new Error("Invalid coordinates"), { status: 400 });
  }
  return `${lng},${lat}`;
}

export const routesService = {
  /**
   * Generic route by coordinates
   * @param {{lng:number,lat:number}} start
   * @param {{lng:number,lat:number}} end
   * @param {"driving-car"|"driving-hgv"|"foot-walking"|"cycling-regular"} profile
   */
  async getByCoords(start, end, profile = "driving-car") {
    if (!env.ORS_API_KEY)
      throw Object.assign(new Error("ORS_API_KEY missing"), { status: 500 });

    const url =
      `${ORS_BASE}/${profile}?api_key=${encodeURIComponent(env.ORS_API_KEY)}` +
      `&start=${coordsToQuery(start.lng, start.lat)}&end=${coordsToQuery(end.lng, end.lat)}`;

    const { data } = await axios.get(url, { timeout: 15000 });

    // shape a compact summary
    const feat = data?.features?.[0];
    const summary = feat?.properties?.summary || {};
    return {
      provider: "openrouteservice",
      profile,
      distance_m: summary.distance,
      duration_s: summary.duration,
      geometry: feat?.geometry, // GeoJSON LineString
      raw: data, // keep full payload for map rendering if needed
    };
  },

  /**
   * Route from Employee.homeLocation -> Employee.branch.location
   */
  async getForEmployee(employeeId, profile = "driving-car") {
    const emp = await employeeRepo.findById(employeeId); // populates user and branch
    if (!emp)
      throw Object.assign(new Error("Employee not found"), { status: 404 });

    const home = emp.homeLocation?.coordinates;
    const office = emp.branch?.location?.coordinates;

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

    const [homeLng, homeLat] = home;
    const [offLng, offLat] = office;

    return this.getByCoords(
      { lng: homeLng, lat: homeLat },
      { lng: offLng, lat: offLat },
      profile
    );
  },
  async notifyEmployeeRoute(employeeId, profile = "driving-car") {
    const route = await this.getForEmployee(employeeId, profile);

    const minutes = Math.round((route.duration_s || 0) / 60);
    const km = (route.distance_m / 1000).toFixed(1);

    const message = `Your commute is about ${minutes} min (${km} km) by ${profile.replace("-", " ")}`;

    // send notification
    const emp = await employeeRepo.findById(employeeId);
    if (!emp)
      throw Object.assign(new Error("Employee not found"), { status: 404 });

    await notificationsService.create({
      user: emp.user,
      type: "ROUTE_ALERT",
      message,
    });

    return { message, route };
  },
};
