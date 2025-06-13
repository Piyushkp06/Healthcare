import { ApiError } from "../utils/ApiError.js";
import Doctor from "../models/DoctorModel.js";
import Patient from "../models/PatientModel.js";
import { hash, compare } from "bcrypt";
export const registerDoctor = async (req, res) => {
  try {
    const { name, email, phone, password, specialization, doctorId } = req.body;
    if (!name || !email || !phone || !password || !specialization || !doctorId) {
      throw new ApiError(400, "All fields are required to register a doctor");
    }

    const hashedPassword = await hash(password, 10);
    const newDoctor = new Doctor({
      name,
      email,
      phone,
      password: hashedPassword,
      specialization,
      doctorId,
    });

    await newDoctor.save();
    return res.status(201).json({ message: "Doctor registered successfully" });
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Internal Server Error");
  }
};

export const deregisterDoctor = async (req, res) => {
  try {
    const { doctorId } = req.body;
    if (!doctorId) throw new ApiError(400, "Doctor ID is required");

    const doctor = await Doctor.findOneAndDelete({ doctorId });
    if (!doctor) throw new ApiError(404, "Doctor not found");

    return res.status(200).json({ message: "Doctor deregistered successfully" });
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Internal Server Error");
  }
};

export const viewPatients = async (req, res) => {
  try {
    const { doctorId, specialization } = req.query;
    let query = {};

    if (doctorId) query = { doctorId };
    else if (specialization) query = { specialization };
    else throw new ApiError(400, "Doctor ID or specialization required");

    const doctors = await Doctor.find(query);
    const doctorIds = doctors.map(doc => doc._id);

    const patients = await Patient.find({ assignedDoctor: { $in: doctorIds } }).populate("assignedDoctor");
    return res.status(200).json({ patients });
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Internal Server Error");
  }
};

export const getDoctorsBySpecialization = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    const grouped = doctors.reduce((acc, doc) => {
      if (!acc[doc.specialization]) acc[doc.specialization] = [];
      acc[doc.specialization].push(doc);
      return acc;
    }, {});

    return res.status(200).json({ grouped });
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Internal Server Error");
  }
};
