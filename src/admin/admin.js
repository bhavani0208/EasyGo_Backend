import AdminJS from "adminjs";
import * as AdminJSExpress from "@adminjs/express";
import * as AdminJSMongoose from "@adminjs/mongoose";
import mongoose from "mongoose";
import express from "express";
import { geocodeAddress } from "../utils/geocode.js";

// Import models
import User from "../models/User.js";
import Company from "../models/Company.js";
import Branch from "../models/Branch.js";
import Employee from "../models/Employee.js";

AdminJS.registerAdapter(AdminJSMongoose);

// ✅ Role-based access helper (SUPERADMIN only)
const canAccessSuperadmin = ({ currentAdmin }) =>
  currentAdmin && currentAdmin.role === "SUPERADMIN";

const adminOptions = {
  rootPath: "/admin",
  resources: [
    {
      resource: User,
      options: {
        navigation: { name: "Users", icon: "User" },
        actions: {
          list: { isAccessible: canAccessSuperadmin },
          new: { isAccessible: canAccessSuperadmin },
          edit: { isAccessible: canAccessSuperadmin },
          delete: { isAccessible: canAccessSuperadmin },
        },
      },
    },
    {
      resource: Company,
      options: {
        navigation: { name: "Organizations", icon: "Building" },
        actions: {
          list: { isAccessible: canAccessSuperadmin },
          new: { isAccessible: canAccessSuperadmin },
          edit: { isAccessible: canAccessSuperadmin },
          delete: { isAccessible: canAccessSuperadmin },
        },
      },
    },
    {
      resource: Branch,
      options: {
        navigation: { name: "Branches", icon: "Map" },
        properties: {
          location: { isVisible: false }, // hide location from forms
        },
        actions: {
          list: { isAccessible: canAccessSuperadmin },
          new: {
            isAccessible: canAccessSuperadmin,
            before: async (req) => {
              if (req.payload && req.payload.address) {
                const coords = await geocodeAddress(req.payload.address);
                if (coords) {
                  req.payload.location = {
                    type: "Point",
                    coordinates: coords,
                  };
                }
              }
              return req;
            },
          },
          edit: {
            isAccessible: canAccessSuperadmin,
            before: async (req) => {
              if (req.payload && req.payload.address) {
                const coords = await geocodeAddress(req.payload.address);
                if (coords) {
                  req.payload.location = {
                    type: "Point",
                    coordinates: coords,
                  };
                }
              }
              return req;
            },
          },
          delete: { isAccessible: canAccessSuperadmin },
        },
      },
    },
    {
      resource: Employee,
      options: {
        navigation: { name: "Employees", icon: "UserFriends" },
        properties: {
          location: { isVisible: false },
        },
        actions: {
          list: { isAccessible: canAccessSuperadmin },
          new: {
            isAccessible: canAccessSuperadmin,
            before: async (req) => {
              if (req.payload && req.payload.homeLocation) {
                const coords = await geocodeAddress(req.payload.homeLocation);
                if (coords) {
                  req.payload.location = {
                    type: "Point",
                    coordinates: coords,
                  };
                }
              }
              return req;
            },
          },
          edit: {
            isAccessible: canAccessSuperadmin,
            before: async (req) => {
              if (req.payload && req.payload.homeLocation) {
                const coords = await geocodeAddress(req.payload.homeLocation);
                if (coords) {
                  req.payload.location = {
                    type: "Point",
                    coordinates: coords,
                  };
                }
              }
              return req;
            },
          },
          delete: { isAccessible: canAccessSuperadmin },
        },
      },
    },
  ],
};

const adminJs = new AdminJS(adminOptions);

// ✅ Authentication — only SUPERADMIN can log in
const router = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
  authenticate: async (email, password) => {
    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      if (user.role === "SUPERADMIN") {
        return user;
      }
    }
    return null;
  },
  cookieName: "adminjs",
  cookiePassword: "some-secret-password",
});

export { adminJs, router };
