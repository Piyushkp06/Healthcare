import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import adminAuthRoutes from "./routes/AdminAuthRoute.js";
import doctorAuthRoutes from "./routes/DoctorAuthRoute.js";
import doctorDashboardRoutes from "./routes/DoctorDashboardRoute.js";
import adminDashboardRoutes from "./routes/AdminDashboardRoute.js";
<<<<<<< HEAD
import transcriptionRoutes from "./routes/transcription.js";
import { createServer } from "http";
=======
>>>>>>> 19432826f6c0aa92d4d7a06ab4528b345ca59dd6

dotenv.config();

const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || 3001;
const databaseUrl = process.env.DATABASE_URL;

app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
   
app.use("/api/doctorAuth",doctorAuthRoutes);
app.use("/api/adminAuth",adminAuthRoutes);
app.use("/api/doctorDashboard",doctorDashboardRoutes);
app.use("/api/adminDashboard",adminDashboardRoutes);


// WebSocket upgrade handler
httpServer.on("upgrade", (request, socket, head) => {
  const pathname = new URL(request.url, `http://${request.headers.host}`)
    .pathname;

  if (pathname === "/api/transcription/stream") {
    transcriptionRoutes.handleUpgrade(request, socket, head);
  } else {
    socket.destroy();
  }
});

// Start server
httpServer.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Connect to MongoDB
mongoose
  .connect(databaseUrl)
  .then(() => console.log("DB Connected Successfully"))
  .catch((err) => console.log(err.message));
