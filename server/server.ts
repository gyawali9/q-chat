import express, { Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";

// create express app and http server (socket.io support )
const app = express();
const server = http.createServer(app);

// middleware setup
app.use(
  express.json({
    limit: "4mb",
  })
);
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Server is live");
});

const port = process.env.PORT || 5001;

// connect to database
await connectDB();

server.listen(port, () => console.log("Server running on Port:" + port));
server.on("error", (err) => {
  console.error("❌ Server failed to start:", err.message);
});

export default app;
