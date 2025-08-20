import { z } from "zod";

export const createCompanySchema = { body: z.object({ name: z.string().min(2) }) };

export const createBranchSchema = {
  body: z.object({
    name: z.string().min(2),
    address: z.string().optional(),
    company: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid company id"),
  }),
};

export const inviteCreateSchema = {
  body: z.object({
    email: z.string().email(),
    role: z.enum(["ADMIN", "EMPLOYEE"]),
    company: z.string().regex(/^[a-f0-9]{24}$/i),
    branch: z.string().regex(/^[a-f0-9]{24}$/i).optional(),
    frontendUrl: z.string().url().optional(),
  }).refine((d) => d.role !== "EMPLOYEE" || !!d.branch, { message: "branch required for EMPLOYEE" }),
};

export const inviteAcceptSchema = {
  body: z.object({
    token: z.string().min(10),
    name: z.string().min(2).optional(),
    password: z.string().min(6),
    homeLocation: z.string().optional(),
  }),
};
