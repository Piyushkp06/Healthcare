import { ApiError } from "../utils/ApiError.js";
import Doctor from "../models/DoctorModel.js";
import jwt from "jsonwebtoken";
import { compare } from "bcrypt";

const maxAge = 3 * 24 * 60 * 60 * 1000;

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validatePhone = (phone) => {
  const regex = /^(\+91|91)?[6-9]\d{9}$/;
  return regex.test(phone);
};

const createToken = (email, doctorId) => {
  return jwt.sign({ email, doctorId }, process.env.JWT_KEY, { expiresIn: maxAge });
};

export const doctorLogin = async (req, res, next) => {
  try {
    const { email, phone, password, doctorId } = req.body;
    if (!password || !doctorId || (!email && !phone)) {
      throw new ApiError(400, "Password, Doctor ID, and either Email or Phone are required");
    }

    let doctor;
    if (email) {
      if (!validateEmail(email)) {
        throw new ApiError(400, "Invalid email format");
      }
      doctor = await Doctor.findOne({ email, doctorId });
    } else if (phone) {
      if (!validatePhone(phone)) {
        throw new ApiError(400, "Invalid phone number format");
      }
      doctor = await Doctor.findOne({ phone, doctorId });
    }

    if (!doctor) {
      throw new ApiError(404, "Doctor not found with provided credentials");
    }

    const auth = await compare(password, doctor.password);
    if (!auth) {
      throw new ApiError(401, "Incorrect password");
    }

    res.cookie("jwt", createToken(doctor.email, doctor._id), {
      maxAge,
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    return res.status(200).json({
      doctor: {
        id: doctor._id,
        doctorId: doctor.doctorId,
        email: doctor.email,
        phone: doctor.phone,
        name: doctor.name,
        specialization: doctor.specialization,
      },
    });
  } catch (error) {
    console.log({ error });
    throw new ApiError(500, "Internal Server Error");
  }
};

export const getDoctorInfo = async (req, res, next) => {
  try {
    const doctorData = await Doctor.findById(req.doctorId);
    if (!doctorData) {
      throw new ApiError(404, "Doctor not found");
    }

    return res.status(200).json({
      id: doctorData._id,
      doctorId: doctorData.doctorId,
      name: doctorData.name,
      phone: doctorData.phone,
      email: doctorData.email,
      specialization: doctorData.specialization,
    });
  } catch (error) {
    console.log({ error });
    throw new ApiError(500, "Internal Server Error");
  }
};

export const doctorLogout = async (req, res, next) => {
  try {
    res.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" });
    return res.status(200).send("Doctor logged out successfully");
  } catch (error) {
    console.log({ error });
    throw new ApiError(500, "Internal Server Error");
  }
};
