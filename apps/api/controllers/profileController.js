import bcrypt from "bcryptjs";
import { getUserByIdService, updateUserService } from "../services/userService.js";

export const getMe = async (req, res) => {
  const user = await getUserByIdService(req.user.id);
  return res.json({
    data: user,
  });
};

export const updateMyInfo = async (req, res) => {
  const user = await updateUserService(req.user.id, req.body);
  return res.json({
    data: user,
  });
};

export const changeMyPassword = async (req, res) => {
  const oldUser = await getUserByIdService(req.user.id);
  if (!(await bcrypt.compare(req.body.currentPassword, oldUser.password))) {
    return res.status(400).json({
      message: "Current password is incorrect",
    });
  }
  const user = await updateUserService(req.user.id, {
    password: req.body.newPassword,
  });
  return res.json({
    data: user,
  });
};
