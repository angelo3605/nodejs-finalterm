import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import router from "./routes/index.js";
import passport from "./utils/passport.js";
import { getIo, initSocket } from "./utils/socket.js";
import { saveProvincesAndDistrictsSnapshot } from "./utils/ghn.js";

const __filename__ = fileURLToPath(import.meta.url);
const __dirname__ = path.dirname(__filename__);

const allowedClients = [process.env.STORE_URL, process.env.ADMIN_URL, "http://localhost:5173", "http://localhost:5174"];

const app = express();

const server = createServer(app);
initSocket(server, allowedClients);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedClients.includes(origin)) {
        cb(null, true);
      } else {
        cb(new Error("Blocked by CORS"), false);
      }
    },
    credentials: true,
  }),
);
app.use(passport.initialize());

app.use(express.static(path.join(__dirname__, "public")));

app.use("/", router);

getIo()
  .of("/comments")
  .on("connection", (socket) => {
    socket.on("join", (slug) => socket.join(slug));
    socket.on("leave", (slug) => socket.leave(slug));
  });

getIo()
  .of("/ratings")
  .on("connection", (socket) => {
    socket.on("join", (slug) => socket.join(slug));
    socket.on("leave", (slug) => socket.leave(slug));
  });

saveProvincesAndDistrictsSnapshot();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
