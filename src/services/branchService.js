import { branchRepo } from "../repositories/branchRepo.js";
import { geocodeAddress } from "../utils/geocode.js";

export const branchService = {
  async create(data) {
    let coordinates = data?.location?.coordinates;

    // if no coordinates given but address exists → geocode
    if ((!coordinates || coordinates.length !== 2) && data.address) {
      const geo = await geocodeAddress(data.address);
      console.log("📍 Geocoded:", data.address, "=>", geo); // Debug log
      if (geo) {
        data.location = { type: "Point", coordinates: geo };
      } else {
        delete data.location; // ✅ prevent invalid Point
      }
    }

    return branchRepo.create(data);
  },

  listByCompany: (companyId) => branchRepo.findByCompany(companyId),
  // async listBranches(user) {
  //   let filter = {};
  //   if (user.role === "ADMIN") {
  //     filter.company = user.company;
  //   }
  //   return await branchRepo.find(filter);
  // },

  get: (id) => branchRepo.findById(id),

  async update(id, data) {
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

  remove: (id) => branchRepo.remove(id),
  // async deleteBranch(branchId, user) {
  //   const branch = await branchRepo.findById(branchId);
  //   if (!branch) throw new Error("Branch not found");

  //   if (user.role === "ADMIN" && String(branch.company._id) !== String(user.company)) {
  //     throw new Error("Unauthorized");
  //   }

  //   return await branch.deleteOne();
  // }
};
