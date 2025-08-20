import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

// export function requireAuth(req, res, next) {
//   const header = req.headers.authorization || "";
//   const token = header.startsWith("Bearer ") ? header.slice(7) : null;
//   if (!token) return res.status(401).json({ message: "Unauthorized" });

//   try {
//     const payload = jwt.verify(token, env.JWT_SECRET);
//     req.user = payload; // { id, role, companyId? }
//     next();
//   } catch {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// }
export function requireAuth(roles = []) {
  return (req, res, next) => {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
      const payload = jwt.verify(token, env.JWT_SECRET);
      req.user = payload; // { id, role, companyId, branchId }

      if (roles.length && !roles.includes(payload.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
}
