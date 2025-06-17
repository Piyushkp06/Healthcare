import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { X, Download, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { toast } from "sonner";
import axios from "axios";
import {
  HOST,
  GENERATE_PRESCRIPTION_API_ROUTE,
  GENERATE_PRESCRIPTION_PDF_ROUTE,
  FASTAPI_HOST,
  PROCESS_CASE_API_ROUTE,
} from "../utils/constants";

// FastAPI backend configuration
const FASTAPI_BASE_URL = "http://127.0.0.1:8000";
const PROCESS_CASE_ENDPOINT = "/process_case/";

export default function PrescriptionGenerator({
  patient,
  onPrescriptionGenerated,
}) {
  const [symptoms, setSymptoms] = useState(patient?.symptoms || []);
  const [newSymptom, setNewSymptom] = useState("");
  const [medicalReport, setMedicalReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [prescription, setPrescription] = useState(null);

  const handleAddSymptom = () => {
    if (newSymptom.trim()) {
      setSymptoms([...symptoms, newSymptom.trim()]);
      setNewSymptom("");
    }
  };

  const handleRemoveSymptom = (index) => {
    setSymptoms(symptoms.filter((_, i) => i !== index));
  };

  const handleGeneratePrescription = async () => {
    if (symptoms.length === 0) {
      toast.error("Please add at least one symptom");
      return;
    }

    if (!medicalReport.trim()) {
      toast.error("Please provide medical report text");
      return;
    }

    setLoading(true);
    setPrescription(null);

    try {
      // Prepare data for FastAPI backend
      const requestData = {
        medical_report_text: medicalReport,
        current_symptoms: symptoms,
      };

      console.log("Sending request to FastAPI:", requestData);

      const response = await axios.post(
        `${FASTAPI_BASE_URL}${PROCESS_CASE_ENDPOINT}`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 60000, // 60 seconds timeout for ML processing
        }
      );

      console.log("FastAPI Response:", response.data);

      if (response.data.status === "success" && response.data.result) {
        const aiPrescription = response.data.result;
        setPrescription(aiPrescription);

        // Call parent callback if provided
        if (onPrescriptionGenerated) {
          onPrescriptionGenerated({
            patient,
            symptoms,
            medicalReport,
            aiPrescription,
            timestamp: new Date().toISOString(),
          });
        }

        toast.success("AI prescription generated successfully!");
      } else {
        throw new Error(
          response.data.message || "Failed to generate prescription"
        );
      }
    } catch (error) {
      console.error("Error generating prescription:", error);

      if (error.code === "ECONNABORTED") {
        toast.error("Request timeout - AI processing took too long");
      } else if (error.response?.status === 500) {
        toast.error("Server error - please check your backend logs");
      } else if (error.response?.data?.message) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        toast.error(
          "Failed to generate prescription. Please ensure your FastAPI server is running."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const renderPrescriptionResult = () => {
    if (!prescription) return null;

    return (
      <Card className="mt-6 border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center gap-2">
            🏥 AI-Generated Prescription
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Assessment */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Assessment:</h4>
            <p className="text-gray-700 bg-white p-3 rounded border">
              {prescription.assessment}
            </p>
          </div>

          {/* Medications */}
          {prescription.medications && prescription.medications.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Medications:</h4>
              <div className="space-y-3">
                {prescription.medications.map((med, index) => (
                  <div key={index} className="bg-white p-3 rounded border">
                    <div className="font-medium text-blue-700">
                      {med.medication}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Dosage:</span> {med.dosage}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Instructions:</span>{" "}
                      {med.instructions}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lifestyle Recommendations */}
          {prescription.lifestyle && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">
                Lifestyle Recommendations:
              </h4>
              <p className="text-gray-700 bg-white p-3 rounded border">
                {prescription.lifestyle}
              </p>
            </div>
          )}

          {/* Considerations */}
          {prescription.considerations &&
            prescription.considerations.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  Important Considerations:
                </h4>
                <ul className="bg-white p-3 rounded border space-y-2">
                  {prescription.considerations.map((consideration, index) => (
                    <li key={index} className="text-gray-700 flex items-start">
                      <span className="text-red-500 mr-2">⚠️</span>
                      {consideration}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {/* Follow-up */}
          {prescription.follow_up && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Follow-up:</h4>
              <p className="text-gray-700 bg-white p-3 rounded border">
                {prescription.follow_up}
              </p>
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded">
            <p className="text-yellow-800 text-sm font-medium">
              ⚠️ This is an AI-generated prescription for informational purposes
              only. Always consult with a qualified healthcare professional
              before making any medical decisions.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-bold text-gray-800 text-center flex items-center justify-center gap-2 pb-5 ">
            AI Medical Prescription Generator
          </CardTitle>

          <p className="text-sm text-gray-500 leading-relaxed">
            Input the patient's medical history and current symptoms to receive
            an AI-generated prescription tailored to their condition.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Patient Info */}
          {patient && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium">{patient.name}</h3>
              <p className="text-sm text-gray-500">
                {patient.age} years, {patient.gender}
              </p>
            </div>
          )}

          {/* Medical Report Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medical Report Text *
            </label>
            <Textarea
              placeholder="Enter the patient's medical report including patient name, date of birth, diagnosis, current medications, allergies, previous symptoms, lab results, etc."
              value={medicalReport}
              onChange={(e) => setMedicalReport(e.target.value)}
              className="min-h-[120px]"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Example: "Patient Name: John Doe, DOB: 1985-05-15, Diagnosis: Type
              2 Diabetes, Medications: Metformin 500mg BID..."
            </p>
          </div>

          {/* Current Symptoms Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Symptoms *
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {symptoms.map((symptom, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {symptom}
                  <button
                    onClick={() => handleRemoveSymptom(index)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add current symptom (e.g., severe headache, nausea)"
                value={newSymptom}
                onChange={(e) => setNewSymptom(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddSymptom()}
                className="flex-1"
              />
              <Button type="button" onClick={handleAddSymptom}>
                Add
              </Button>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGeneratePrescription}
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing with AI... (This may take 30-60 seconds)
              </>
            ) : (
              "Generate AI Prescription"
            )}
          </Button>

          {/* Status Message */}
          {loading && (
            <div className="text-center text-sm text-gray-600 bg-blue-50 p-3 rounded">
              🧠 AI is analyzing medical data, searching for relevant
              information, and generating prescription recommendations...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Prescription Results */}
      {renderPrescriptionResult()}
    </div>
  );
}
