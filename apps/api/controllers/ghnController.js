import { getWardService } from "../services/ghnService.js";

export const getWard = async (req, res) => {
  const ward = await getWardService(req.query?.district);
  return res.json({
    data: ward,
  });
};
