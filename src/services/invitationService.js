// import { inviteRepo } from "../repositories/inviteRepo.js";
// import { randomToken } from "../utils/crypto.js";
// import { sendEmail } from "../utils/sendEmail.js";
// import dotenv from "dotenv";
// dotenv.config();
// import { authService } from "./authService.js";
// import { employeeService } from "./employeeService.js";

// export const invitationService = {
//   async createInvite({ email, role, company, branch, createdBy, frontendUrl }) {
//     if (role === "EMPLOYEE" && !branch)
//       throw new Error("Branch is required for EMPLOYEE invites");
//     const token = randomToken();
//     const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
//     const invite = await inviteRepo.create({
//       email,
//       role,
//       company,
//       branch,
//       token,
//       expiresAt,
//       createdBy,
//     });

//     const link = `${frontendUrl?.replace(/\/$/, "") || "http://localhost:5173"}/register?token=${token}`;
//     await sendEmail({
//       to: email,
//       subject: "You're invited to the Routing App",
//       html: `<p>You have been invited as <b>${role}</b>. Click to register:</p><p><a href="${link}">${link}</a></p><p>This link expires on ${expiresAt.toISOString()}.</p>`,
//     });

//     return invite;
//   },

//   async acceptInvite({ token, name, password, homeLocation }) {
//     const invite = await inviteRepo.findByToken(token);
//     if (!invite) throw new Error("Invalid token");
//     if (invite.usedAt) throw new Error("Token already used");
//     if (invite.expiresAt < new Date()) throw new Error("Token expired");

//     const user = await authService.register({
//       name: name || invite.email.split("@")[0],
//       email: invite.email,
//       password,
//       role: invite.role,
//       company: invite.company,
//       branch: invite.role === "EMPLOYEE" ? invite.branch : undefined,
//     });

//     if (invite.role === "EMPLOYEE") {
//       await employeeService.create({
//         user: user._id,
//         branch: invite.branch,
//         workType: "OFFICE",
//         homeLocation: homeLocation || "",
//       });
//     }

//     await inviteRepo.markUsed(invite._id);
//     return { user };
//   },
// };
