import { ApiError } from "../utils/ApiError.js";
import Appointment from "../models/AppointmentModel.js";
import Patient from "../models/PatientModel.js";
import Doctor from "../models/DoctorModel.js";

// Create a new appointment
export const createAppointment = async (req, res, next) => {
  try {
    const { doctor, appointmentTime, reason } = req.body;
    const patient = req.user._id; // Get patient ID from authenticated user

    // Validate doctor existence
    const doctorExists = await Doctor.findById(doctor);
    if (!doctorExists) {
      throw new ApiError(404, "Doctor not found");
    }

    // Validate patient existence
    const patientExists = await Patient.findById(patient);
    if (!patientExists) {
      throw new ApiError(404, "Patient not found");
    }

    const newAppointment = new Appointment({
      patient,
      doctor,
      appointmentTime,
      reason
    });

    await newAppointment.save();

    // Populate the appointment with patient and doctor details
    const populatedAppointment = await Appointment.findById(newAppointment._id)
      .populate("patient", "firstName lastName email age gender")
      .populate("doctor", "name specialization email");

    return res.status(201).json({ 
      message: "Appointment created successfully", 
      appointment: populatedAppointment 
    });
  } catch (error) {
    console.log(error);
    next(new ApiError(500, "Failed to create appointment"));
  }
};

// Get all appointments (optionally filter by doctor or patient)
export const getAppointments = async (req, res, next) => {
  try {
    const { doctor, patient } = req.query;
    const filter = {};
    
    // If user is a doctor, only show their appointments
    if (req.user.role === 'doctor') {
      filter.doctor = req.user._id;
    }
    // If user is a patient, only show their appointments
    else if (req.user.role === 'patient') {
      filter.patient = req.user._id;
    }
    // If specific doctor or patient is requested (for admin)
    else {
      if (doctor) filter.doctor = doctor;
      if (patient) filter.patient = patient;
    }

    const appointments = await Appointment.find(filter)
      .populate("patient", "firstName lastName email age gender")
      .populate("doctor", "name specialization email")
      .sort({ appointmentTime: -1 });

    return res.status(200).json({ appointments });
  } catch (error) {
    console.log(error);
    next(new ApiError(500, "Failed to fetch appointments"));
  }
};

// Get a single appointment by ID
export const getAppointmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id)
      .populate("patient", "firstName lastName email age gender")
      .populate("doctor", "name specialization email");

    if (!appointment) {
      throw new ApiError(404, "Appointment not found");
    }

    // Check if user has permission to view this appointment
    if (req.user.role === 'doctor' && appointment.doctor._id.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Not authorized to view this appointment");
    }
    if (req.user.role === 'patient' && appointment.patient._id.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Not authorized to view this appointment");
    }

    return res.status(200).json({ appointment });
  } catch (error) {
    console.log(error);
    next(new ApiError(500, "Failed to fetch appointment"));
  }
};

// Update appointment status or time
export const updateAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const update = req.body;

    // Check if appointment exists
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      throw new ApiError(404, "Appointment not found");
    }

    // Check if user has permission to update this appointment
    if (req.user.role === 'doctor' && appointment.doctor.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Not authorized to update this appointment");
    }
    if (req.user.role === 'patient' && appointment.patient.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Not authorized to update this appointment");
    }

    // Update the appointment
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      update,
      { new: true }
    )
      .populate("patient", "firstName lastName email age gender")
      .populate("doctor", "name specialization email");

    return res.status(200).json({ 
      message: "Appointment updated", 
      appointment: updatedAppointment 
    });
  } catch (error) {
    console.log(error);
    next(new ApiError(500, "Failed to update appointment"));
  }
};

// Delete/cancel an appointment
export const deleteAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if appointment exists
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      throw new ApiError(404, "Appointment not found");
    }

    // Check if user has permission to delete this appointment
    if (req.user.role === 'doctor' && appointment.doctor.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Not authorized to delete this appointment");
    }
    if (req.user.role === 'patient' && appointment.patient.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Not authorized to delete this appointment");
    }

    await Appointment.findByIdAndDelete(id);

    return res.status(200).json({ message: "Appointment deleted" });
  } catch (error) {
    console.log(error);
    next(new ApiError(500, "Failed to delete appointment"));
  }
};