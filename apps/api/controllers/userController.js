import { getAllUsersService, updateUserService } from "../services/userService.js";

export const getAllUsers = async (req, res) => {
  const data = await getAllUsersService(
    {
      excludeIds: [req.user.id],
    },
    req.pagination,
  );
  return res.json(data);
};

export const updateUser = async (req, res) => {
  const user = await updateUserService(req.params.id, req.body);
  return res.json({
    data: user,
  });
};
