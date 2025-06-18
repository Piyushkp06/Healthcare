import { Router } from 'express';
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import { generatePrescription, getPatientPrescriptions, generatePrescriptionPDF } from '../controllers/PrescriptionController.js';

const prescriptionRoutes = Router();

prescriptionRoutes.use(verifyToken);

prescriptionRoutes.post('/generate', verifyToken, generatePrescription);
prescriptionRoutes.get('/patient/:patientId', verifyToken, getPatientPrescriptions);
prescriptionRoutes.get('/pdf/:prescriptionId', verifyToken, generatePrescriptionPDF);

export default prescriptionRoutes; 