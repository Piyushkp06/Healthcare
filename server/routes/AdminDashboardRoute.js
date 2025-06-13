import { Router } from "express";
import {
  registerDoctor,
  deregisterDoctor,
  viewPatients,
  getDoctorsBySpecialization,
} from "../controllers/DoctorDashboardController.js";

const adminDashboardRoutes = Router();


adminDashboardRoutes.post("/register-doctor", registerDoctor);
adminDashboardRoutes.delete("/deregister-doctor", deregisterDoctor);
adminDashboardRoutes.get("/view-patients", viewPatients);
adminDashboardRoutes.get("/doctors-by-specialization", getDoctorsBySpecialization);

export default adminDashboardRoutes;
