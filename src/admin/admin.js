import AdminJS from "adminjs";
import * as AdminJSExpress from "@adminjs/express";
import * as AdminJSMongoose from "@adminjs/mongoose";
import mongoose from "mongoose";
import express from "express";
import { geocodeAddress } from "../utils/geocode.js";
// Import your models
import User from "../models/User.js";
import Company from "../models/Company.js";
import Branch from "../models/Branch.js";
import Employee from "../models/Employee.js";

AdminJS.registerAdapter(AdminJSMongoose);

// Role-based access helper
const canAccess =
  (roles) =>
  ({ currentAdmin }) =>
    currentAdmin && roles.includes(currentAdmin.role);

const adminOptions = {
  resources: [
    {
      resource: User,
      options: {
        navigation: { name: "Users", icon: "User" },
        actions: {
          list: { isAccessible: canAccess(["SUPERADMIN"]) },
          new: { isAccessible: canAccess(["SUPERADMIN"]) },
          edit: { isAccessible: canAccess(["SUPERADMIN"]) },
          delete: { isAccessible: canAccess(["SUPERADMIN"]) },
        },
      },
    },
    {
      resource: Company,
      options: {
        navigation: { name: "Organizations", icon: "Building" },
        actions: {
          list: { isAccessible: canAccess(["SUPERADMIN"]) },
          new: { isAccessible: canAccess(["SUPERADMIN"]) },
          edit: { isAccessible: canAccess(["SUPERADMIN"]) },
          delete: { isAccessible: canAccess(["SUPERADMIN"]) },
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
          list: {
            isAccessible: canAccess(["SUPERADMIN", "ADMIN"]),
            before: async (req, ctx) => {
              const { currentAdmin } = ctx;
              if (currentAdmin.role === "ADMIN") {
                req.query = {
                  ...req.query,
                  filters: { company: currentAdmin.company },
                };
              }
              return req;
            },
          },
          new: {
            isAccessible: canAccess(["SUPERADMIN", "ADMIN"]),
            before: async (req, ctx) => {
              const { currentAdmin } = ctx;

              if (req.payload) {
                if (currentAdmin.role === "ADMIN") {
                  req.payload.company = currentAdmin.company.toString();
                }

                if (req.payload.address) {
                  const coords = await geocodeAddress(req.payload.address);
                  if (coords) {
                    req.payload.location = {
                      type: "Point",
                      coordinates: coords,
                    };
                  }
                }
              }

              return req;
            },
          },
          edit: {
            isAccessible: canAccess(["SUPERADMIN", "ADMIN"]),
            before: async (req, ctx) => {
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
          delete: { isAccessible: canAccess(["SUPERADMIN", "ADMIN"]) },
        },
      },
    },
    {
      resource: Employee,
      options: {
        navigation: { name: "Employees", icon: "UserFriends" },
        properties: {
          location: { isVisible: false }, // hide location from forms
        },
        actions: {
          list: {
            isAccessible: canAccess(["SUPERADMIN", "ADMIN"]),
            before: async (req, ctx) => {
              const { currentAdmin } = ctx;
              if (currentAdmin.role === "ADMIN") {
                req.query = {
                  ...req.query,
                  filters: { branch: currentAdmin.branch },
                };
              }
              return req;
            },
          },
          new: {
            isAccessible: canAccess(["SUPERADMIN", "ADMIN"]),
            before: async (req, ctx) => {
              const { currentAdmin } = ctx;

              if (req.payload) {
                // ✅ auto-assign company
                if (currentAdmin.role === "ADMIN") {
                  req.payload.company = currentAdmin.company.toString();
                }

                // ✅ auto-geocode homeLocation if given
                if (req.payload.homeLocation) {
                  const coords = await geocodeAddress(req.payload.homeLocation);
                  if (coords) {
                    req.payload.location = {
                      type: "Point",
                      coordinates: coords,
                    };
                  }
                }
              }

              return req;
            },
          },
          edit: {
            isAccessible: canAccess(["SUPERADMIN", "ADMIN"]),
            before: async (req, ctx) => {
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
          delete: { isAccessible: canAccess(["SUPERADMIN", "ADMIN"]) },
        },
      },
    },
  ],
  rootPath: "/admin",
};

const adminJs = new AdminJS(adminOptions);

// Authentication setup
const router = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
  authenticate: async (email, password) => {
    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      return user; // user object is stored in session as currentAdmin
    }
    return null;
  },
  cookieName: "adminjs",
  cookiePassword: "some-secret-password",
});

export { adminJs, router };
