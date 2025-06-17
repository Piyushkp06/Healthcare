import Prescription from "../models/PrescriptionModel.js";
import Patient from "../models/PatientModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generatePrescription = async (req, res) => {
  try {
    const { patientId, symptoms, medicines, notes } = req.body;
    const doctorId = req.doctor._id;

    // Validate patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      throw new ApiError(404, "Patient not found");
    }

    // Create prescription
    const prescription = await Prescription.create({
      doctorId,
      patient: patientId,
      symptoms,
      medicines,
      notes
    });

    // Add prescription to patient's history
    patient.history.push(prescription._id);
    await patient.save();

    return res
      .status(201)
      .json(new ApiResponse(201, { prescription }, "Prescription generated successfully"));
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message);
  }
};

export const getPatientPrescriptions = async (req, res) => {
  try {
    const { patientId } = req.params;

    const prescriptions = await Prescription.find({ patient: patientId })
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json(new ApiResponse(200, { prescriptions }, "Prescriptions fetched successfully"));
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message);
  }
};

export const generatePrescriptionPDF = async (req, res) => {
  try {
    const { prescriptionId } = req.params;

    const prescription = await Prescription.findById(prescriptionId)
      .populate("patient")
      .populate("doctorId");

    if (!prescription) {
      throw new ApiError(404, "Prescription not found");
    }

    // Create PDF
    const doc = new PDFDocument();
    const pdfPath = path.join(__dirname, `../temp/prescription_${prescriptionId}.pdf`);

    // Ensure temp directory exists
    if (!fs.existsSync(path.join(__dirname, "../temp"))) {
      fs.mkdirSync(path.join(__dirname, "../temp"));
    }

    // Pipe PDF to file
    doc.pipe(fs.createWriteStream(pdfPath));

    // Add content to PDF
    doc.fontSize(20).text("Medical Prescription", { align: "center" });
    doc.moveDown();

    // Doctor Info
    doc.fontSize(12).text("Doctor Information:");
    doc.fontSize(10).text(`Name: Dr. ${prescription.doctorId.name}`);
    doc.text(`Specialization: ${prescription.doctorId.specialization}`);
    doc.moveDown();

    // Patient Info
    doc.fontSize(12).text("Patient Information:");
    doc.fontSize(10).text(`Name: ${prescription.patient.name}`);
    doc.text(`Age: ${prescription.patient.age}`);
    doc.text(`Gender: ${prescription.patient.gender}`);
    doc.moveDown();

    // Date
    doc.fontSize(12).text("Date:");
    doc.fontSize(10).text(new Date(prescription.createdAt).toLocaleDateString());
    doc.moveDown();

    // Symptoms
    doc.fontSize(12).text("Symptoms:");
    prescription.symptoms.forEach(symptom => {
      doc.fontSize(10).text(`• ${symptom}`);
    });
    doc.moveDown();

    // Medicines
    doc.fontSize(12).text("Prescribed Medicines:");
    prescription.medicines.forEach(medicine => {
      doc.fontSize(10).text(`• ${medicine.name} - ${medicine.dosage} (${medicine.frequency})`);
    });
    doc.moveDown();

    // Notes
    if (prescription.notes) {
      doc.fontSize(12).text("Additional Notes:");
      doc.fontSize(10).text(prescription.notes);
    }

    // Add signature line
    doc.moveDown(2);
    doc.fontSize(10).text("Doctor's Signature: _________________", { align: "right" });

    // Finalize PDF
    doc.end();

    // Wait for PDF to be generated
    await new Promise((resolve) => {
      doc.on("end", resolve);
    });

    // Send PDF file
    res.download(pdfPath, `prescription_${prescriptionId}.pdf`, (err) => {
      if (err) {
        console.error("Error sending PDF:", err);
      }
      // Clean up: delete the temporary PDF file
      fs.unlink(pdfPath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Error deleting temporary PDF:", unlinkErr);
        }
      });
    });
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message);
  }
}; 