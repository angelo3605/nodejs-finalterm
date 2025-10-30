import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes/index.js";
import passport from "./utils/passport.js";
import { initSocket } from "./utils/socket.js";

const __filename__ = fileURLToPath(import.meta.url);
const __dirname__ = path.dirname(__filename__);

const app = express();

const server = createServer(app);
initSocket(server, [process.env.STORE_CLIENT, process.env.ADMIN_CLIENT]);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || [process.env.STORE_CLIENT, process.env.ADMIN_CLIENT].includes(origin)) {
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

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
