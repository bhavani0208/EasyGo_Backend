import { z } from "zod";

export const createCompanySchema = {
  body: z.object({ name: z.string().min(2) }),
};

export const createBranchSchema = {
  body: z.object({
    name: z.string().min(2),
    address: z.string().optional(),
    companyId: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid company id").optional(), // ✅ accept companyId
    location: z.union([
      z.string(),  // ✅ human readable address
      z.object({
        type: z.literal("Point").default("Point"),
        coordinates: z.tuple([
          z.number().gte(-180).lte(180), // longitude
          z.number().gte(-90).lte(90),   // latitude
        ]),
      }),
    ]).optional(),
  }),
};

export const inviteCreateSchema = {
  body: z.object({
    email: z.string().email(),
    branchId: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid branch id"),
    workType: z.enum(["OFFICE", "HYBRID", "REMOTE"]),
    homeLocation: z.string().optional(),
    officeTimings: z
      .object({
        start: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
        end: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
      })
      .optional(),
  }),
};

export const inviteAcceptSchema = {
  body: z.object({
    
    name: z.string().min(2),
    password: z.string().min(6),
    homeLocation: z.string().optional(),
  }),
};
export const updateEmployeeSchema = {
  body: z.object({
    branch: z.string().regex(/^[a-f0-9]{24}$/i).optional(),
    workMode: z.enum(["OFFICE", "HYBRID", "REMOTE"]).optional(),
    officeTimings: z
      .object({
        start: z
          .string()
          .regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
        end: z
          .string()
          .regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
      })
      .optional(),
  }),
};
