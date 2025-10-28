export const allowedClients = process.env.ALLOWED_CLIENTS?.split(",").map((clientUrl) => clientUrl.trim()) ?? [];
