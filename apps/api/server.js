import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { passport } from "./utils/passport.js";
import router from "./routes/router.js";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use(passport.initialize());
app.use("/", router);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("newComment", (productId) => {
    socket.broadcast.emit("commentUpdated", { productId });
  });

  socket.on("newRating", (productId) => {
    socket.broadcast.emit("ratingUpdated", { productId });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
