import Prescription from "../models/PrescriptionModel.js";
import Patient from "../models/PatientModel.js";
import Doctor from "../models/DoctorModel.js";
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
    const {
      patientId,
      symptoms,
      diagnosis,
      medicines,
      holdMedicines,
      emergencyInstructions,
      criticalWarnings,
      sideEffectsNote,
      followUp,
      rationale,
      notes
    } = req.body;
    const doctorId = req.doctorId;
    if (!doctorId) {
      return res.status(401).send("Doctor not authenticated!");
    }

    // Fetch doctor details
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).send("Doctor not found!");
    }

    // Validate patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      throw new ApiError(404, "Patient not found");
    }

    // Create prescription with all new fields
    const prescription = await Prescription.create({
      doctorId: doctor._id,
      doctorName: doctor.name,
      doctorSpecialization: doctor.specialization,
      patient: patientId,
      symptoms,
      diagnosis,
      medicines,
      holdMedicines,
      emergencyInstructions,
      criticalWarnings,
      sideEffectsNote,
      followUp,
      rationale,
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
      .populate("patient");

    if (!prescription) {
      throw new ApiError(404, "Prescription not found");
    }

    // Paths
    const tempDir = path.join(__dirname, "../temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    const pdfPath = path.join(tempDir, `prescription_${prescriptionId}.pdf`);

    // PDF Setup
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    // Register custom font
    doc.registerFont("Helvetica-Bold", "Helvetica-Bold");

    // Add border
    doc.rect(50, 50, 500, 700).stroke();

    // Header
    doc.font("Helvetica-Bold").fontSize(24).fillColor("#0000FF").text("Medical Prescription", { align: "center" });
    doc.moveDown();

    // Doctor Info
    doc.font("Helvetica-Bold").fontSize(14).fillColor("#FF0000").text("Doctor Information:", { underline: true });
    doc.font("Helvetica").fontSize(12).fillColor("#000000").text(`Name: Dr. ${prescription.doctorName}`);
    doc.text(`Specialization: ${prescription.doctorSpecialization}`);
    doc.moveDown();

    // Patient Info
    doc.font("Helvetica-Bold").fontSize(14).fillColor("#FF0000").text("Patient Information:", { underline: true });
    doc.font("Helvetica").fontSize(12).fillColor("#000000").text(`Name: ${prescription.patient.name}`);
    doc.text(`Age: ${prescription.patient.age}`);
    doc.text(`Gender: ${prescription.patient.gender}`);
    doc.moveDown();

    // Date
    doc.font("Helvetica-Bold").fontSize(14).fillColor("#FF0000").text("Date:", { underline: true });
    doc.font("Helvetica").fontSize(12).fillColor("#000000").text(new Date(prescription.createdAt).toLocaleDateString());
    doc.moveDown();

    // Symptoms
    doc.font("Helvetica-Bold").fontSize(14).fillColor("#FF0000").text("Symptoms:", { underline: true });
    prescription.symptoms.forEach(symptom => {
      doc.font("Helvetica").fontSize(12).fillColor("#000000").text(`• ${symptom}`);
    });
    doc.moveDown();

    // Medicines
    doc.font("Helvetica-Bold").fontSize(14).fillColor("#FF0000").text("Prescribed Medicines:", { underline: true });
    prescription.medicines.forEach(medicine => {
      doc.font("Helvetica").fontSize(12).fillColor("#000000").text(`• ${medicine.name} - ${medicine.dosage} (${medicine.frequency})`);
    });
    doc.moveDown();

    // Notes
    if (prescription.notes) {
      doc.font("Helvetica-Bold").fontSize(14).fillColor("#FF0000").text("Additional Notes:", { underline: true });
      doc.font("Helvetica").fontSize(12).fillColor("#000000").text(prescription.notes);
      doc.moveDown();
    }

    // Hold Medicines
    if (prescription.holdMedicines?.length > 0) {
      doc.font("Helvetica-Bold").fontSize(14).fillColor("#FF0000").text("Hold Medicines:", { underline: true });
      prescription.holdMedicines.forEach(med => {
        doc.font("Helvetica").fontSize(12).fillColor("#000000").text(`• ${med.name} - ${med.dosage} (Reason: ${med.reason})`);
      });
      doc.moveDown();
    }

    // Signature
    doc.moveDown(2);
    doc.font("Helvetica").fontSize(12).fillColor("#000000").text("Doctor's Signature: _________________", { align: "right" });

    // Footer
    doc.font("Helvetica").fontSize(10).fillColor("#000000").text("Generated on: " + new Date().toLocaleString(), { align: "center" });

    doc.end(); // finalize

    // ✅ Wait for stream to finish
    await new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    // Send file
    res.download(pdfPath, `prescription_${prescriptionId}.pdf`, (err) => {
      if (err) console.error("Error sending PDF:", err);
      fs.unlink(pdfPath, (unlinkErr) => {
        if (unlinkErr) console.error("Error deleting PDF:", unlinkErr);
      });
    });
  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw new ApiError(error.statusCode || 500, error.message);
  }
};
