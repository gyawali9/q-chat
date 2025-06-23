import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

import { connectDB } from "./src/lib/db";
import userRouter from "./src/routes/user.route";
import { errorHandler } from "./src/middleware/error.middleware";
import messageRouter from "./src/routes/message.route";

dotenv.config();

// create express app and http server (socket.io support )
const app = express();
const server = http.createServer(app);

// initialize socket.io server
export const io = new Server(server, {
  cors: { origin: "*" },
});

// store online users
export const userSocketmap: Record<string, string> = {
  // {userId: socketId}
};

// socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId as string;

  if (typeof userId === "string") {
    console.log("User Connected", userId);
    if (userId) userSocketmap[userId] = socket.id;
  }

  // Emit onlineusers to all connected clients
  io.emit("getOnlineusers", Object.keys(userSocketmap));

  // disconnect events
  socket.on("disconnect", () => {
    console.log("User Disconnected", userId);
    delete userSocketmap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketmap));
  });
});

// middleware setup
app.use(
  cors({
    origin:
      process.env.NODE_ENV !== "development"
        ? process.env.FRONTEND_URL
        : "http://localhost:5173",
    credentials: true, // allows cookies from frontend
  })
);
app.use(
  express.json({
    limit: "4mb",
  })
);
app.use(cookieParser()); // parse cookies

// routes setup
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/messages", messageRouter);

// ✅ Error handling middleware (always at end)
app.use(errorHandler);

app.get("/", (req: Request, res: Response) => {
  res.send("Server is live");
});

const port = process.env.PORT || 5001;

const startServer = async () => {
  await connectDB();
  server.listen(port, () => {
    console.log("Server running on Port:" + port);
  });
};

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

server.on("error", (err) => {
  console.error("❌ Server failed to start:", err.message);
});

export default app;
