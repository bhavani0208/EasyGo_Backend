import InviteToken from "../models/InviteToken.js";

export const inviteRepo = {
  create: (data) => InviteToken.create(data),
  findByToken: (token) => InviteToken.findOne({ token }),
  markUsed: (id) => InviteToken.findByIdAndUpdate(id, { usedAt: new Date() }, { new: true }),
};
