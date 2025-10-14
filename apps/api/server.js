import path from "path";
import { createServer } from "http";
import { fileURLToPath, } from "url";

import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// import { Server } from "socket.io";

import passport from "./utils/passport.js";
import router from "./routes/index.js";
// import { setAnonymousId } from "./middleware/setAnonymousId.js";

const __filename__ = fileURLToPath(import.meta.url);
const __dirname__ = path.dirname(__filename__);

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
// app.use(setAnonymousId);
app.use(passport.initialize());

app.use(express.static(path.join(__dirname__, "public")));

app.use("/", router);

const httpServer = createServer(app);

// const io = new Server(httpServer, {
//   cors: {
//     origin: "*",
//   },
// });

// // Middleware gắn io vào req
// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

// io.on("connection", (socket) => {
//   console.log("A user connected");

//   socket.on("newComment", (productId) => {
//     socket.broadcast.emit("commentUpdated", { productId });
//   });

//   socket.on("newRating", (productId) => {
//     socket.broadcast.emit("ratingUpdated", { productId });
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });
// });

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
