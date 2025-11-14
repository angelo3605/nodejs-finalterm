export const getIpAddress = (req) => {
  if (process.env.NODE_ENV === "production") {
    return req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
  }
  return "127.0.0.1";
};
