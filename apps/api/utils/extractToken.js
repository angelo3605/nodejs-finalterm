export default (req) => {
  if (!req) {
    return null;
  }

  const authHeader = req.headers?.authorization ?? "";
  const match = authHeader.match(/^Bearer\s+(.+)$/i);

  return match?.[1] ?? req.cookies?.token ?? null;
};
