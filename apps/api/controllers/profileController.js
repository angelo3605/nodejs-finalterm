import { getUserByIdService } from "../services/userService.js";

export const getMe = async (req, res) => {
  const user = await getUserByIdService(req.user.id);
  return res.json({ user });
};
