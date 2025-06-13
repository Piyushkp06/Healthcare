import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
  doctorId: {
    type: String,
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true
  },
  symptoms: {
    type: [String],
    default: []
  },
  medicines: [{
    name: String,
    dosage: String,
    frequency: String
  }],
  notes: {
    type: String
  }
}, { timestamps: true });

const Prescription = mongoose.model("Prescription", prescriptionSchema);
export default Prescription;
