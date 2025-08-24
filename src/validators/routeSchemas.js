import { z } from "zod";

const coord = z.object({
  lat: z.number().gte(-90).lte(90),
  lng: z.number().gte(-180).lte(180),
});
const profile = z
  .enum(["driving-car", "driving-hgv", "foot-walking", "cycling-regular"])
  .optional();

export const routeByCoordsSchema = {
  body: z.object({
    start: coord,
    end: coord,
    profile,
  }),
};

export const routeForEmployeeSchema = {
  params: z.object({
    employeeId: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid employee id"),
  }),
  query: z
    .object({
      profile,
    })
    .optional(),
};

export const routeNotifySchema = {
  params: z.object({
    employeeId: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid employee id"),
  }),
  query: z
    .object({
      profile,
    })
    .optional(),
};
