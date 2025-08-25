import branchRepo from "../repositories/branchRepo.js";
import { geocodeAddress } from "../utils/geocode.js";

export const branchService = {
  async create(data) {
    // 🔹 Map companyId → company (schema requires `company`)
    if (data.companyId) {
      data.company = data.companyId;
      delete data.companyId;
    }

    // 🔹 If location is passed as a string, treat it as `address`
    if (typeof data.location === "string") {
      data.address = data.location;
      delete data.location;
    }

    // 🔹 If no coordinates but address exists → geocode
    if ((!data.location || !data.location.coordinates) && data.address) {
      const geo = await geocodeAddress(data.address);
      console.log("📍 Geocoded:", data.address, "=>", geo);
      if (geo) {
        data.location = { type: "Point", coordinates: geo };
      } else {
        delete data.location; // prevent invalid Point
      }
    }

    return branchRepo.create(data);
  },

  listByCompany: (companyId) => branchRepo.findByCompany(companyId),

  get: (id) => branchRepo.findById(id),

  async update(id, data) {
    // 🔹 Handle `companyId` mapping (in case update sends it)
    if (data.companyId) {
      data.company = data.companyId;
      delete data.companyId;
    }

    // 🔹 Handle `location` string as address
    if (typeof data.location === "string") {
      data.address = data.location;
      delete data.location;
    }

    if (data.address && (!data.location || !data.location.coordinates)) {
      const geo = await geocodeAddress(data.address);
      console.log("📍 Updated Geocode:", data.address, "=>", geo);
      if (geo) {
        data.location = { type: "Point", coordinates: geo };
      } else {
        delete data.location;
      }
    }

    if (!data.location?.coordinates || data.location.coordinates.length !== 2) {
      delete data.location;
    }

    return branchRepo.update(id, data);
  },
  list: () => branchRepo.findAll(),
  remove: (id) => branchRepo.remove(id),
};
