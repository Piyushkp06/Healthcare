import { Router } from 'express';
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import { generatePrescription, getPatientPrescriptions, generatePrescriptionPDF } from '../controllers/PrescriptionController.js';

const prescriptionRoutes = Router();

prescriptionRoutes.use(verifyToken);

prescriptionRoutes.post('/generate', generatePrescription);
prescriptionRoutes.get('/patient/:patientId', getPatientPrescriptions);
prescriptionRoutes.get('/pdf/:prescriptionId', generatePrescriptionPDF);

export default prescriptionRoutes; 