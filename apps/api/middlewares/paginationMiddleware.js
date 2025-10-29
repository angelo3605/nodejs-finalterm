import { paginationSchema } from "@mint-boutique/zod-schemas";

export const attachPagination = (req, res, next) => {
  req.pagination = paginationSchema.parse(req.query);
  next();
};
