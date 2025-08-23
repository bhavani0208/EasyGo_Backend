// import { invitationService } from "../services/invitationService.js";

// export const createInvitation = async (req, res, next) => {
//   try {
//     const { email, role, company, branch, frontendUrl } = req.body;
//     const createdBy = req.user.id;
//     const invite = await invitationService.createInvite({ email, role, company, branch, createdBy, frontendUrl });
//     res.status(201).json(invite);
//   } catch (err) { next(err); }
// };

// export const acceptInvitation = async (req, res, next) => {
//   try {
//     const { token, name, password, homeLocation } = req.body;
//     const result = await invitationService.acceptInvite({ token, name, password, homeLocation });
//     res.status(201).json(result);
//   } catch (err) { next(err); }
// };
