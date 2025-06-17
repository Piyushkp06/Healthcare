import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { X, Download } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { toast } from "sonner";
import axios from "axios";
import { HOST, GENERATE_PRESCRIPTION_API_ROUTE, GENERATE_PRESCRIPTION_PDF_ROUTE } from "../utils/constants";

export default function PrescriptionGenerator({ patient, onPrescriptionGenerated }) {
  const [symptoms, setSymptoms] = useState(patient?.symptoms || []);
  const [newSymptom, setNewSymptom] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    dosage: "",
    frequency: ""
  });
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddSymptom = () => {
    if (newSymptom.trim()) {
      setSymptoms([...symptoms, newSymptom.trim()]);
      setNewSymptom("");
    }
  };

  const handleRemoveSymptom = (index) => {
    setSymptoms(symptoms.filter((_, i) => i !== index));
  };

  const handleAddMedicine = () => {
    if (newMedicine.name.trim()) {
      setMedicines([...medicines, { ...newMedicine }]);
      setNewMedicine({ name: "", dosage: "", frequency: "" });
    }
  };

  const handleRemoveMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleGeneratePrescription = async () => {
    if (!patient) {
      toast.error("No patient selected");
      return;
    }

    if (medicines.length === 0) {
      toast.error("Please add at least one medicine");
      return;
    }

    setLoading(true);
    try {
      const prescription = {
        patientId: patient._id,
        symptoms,
        medicines,
        notes
      };

      const response = await axios.post(
        `${HOST}/${GENERATE_PRESCRIPTION_API_ROUTE}`,
        prescription,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success && response.data.prescription) {
        // Merge AI recommendations with doctor's prescription
        const aiRecommendations = response.data.prescription;
        const finalPrescription = {
          ...prescription,
          aiRecommendations,
          timestamp: new Date().toISOString()
        };

        onPrescriptionGenerated(finalPrescription);
        toast.success("Prescription generated successfully");
        
        // Reset form
        setSymptoms(patient.symptoms || []);
        setMedicines([]);
        setNotes("");
      } else {
        throw new Error("Failed to generate prescription");
      }
    } catch (error) {
      console.error("Error generating prescription:", error);
      toast.error(error.response?.data?.error || "Failed to generate prescription");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (prescriptionId) => {
    try {
      const response = await axios.get(
        `${HOST}/${GENERATE_PRESCRIPTION_PDF_ROUTE(prescriptionId)}`,
        {
          responseType: 'blob',
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Create a blob from the PDF Stream
      const file = new Blob([response.data], { type: 'application/pdf' });
      
      // Create a link element
      const fileURL = window.URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = `prescription_${prescriptionId}.pdf`;
      
      // Append to html link element page
      document.body.appendChild(link);
      
      // Start download
      link.click();
      
      // Clean up and remove the link
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(fileURL);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download prescription PDF");
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Generate Prescription</CardTitle>
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

        {/* Symptoms Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Symptoms
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {symptoms.map((symptom, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
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
              placeholder="Add new symptom"
              value={newSymptom}
              onChange={(e) => setNewSymptom(e.target.value)}
              className="flex-1"
            />
            <Button type="button" onClick={handleAddSymptom}>
              Add
            </Button>
          </div>
        </div>

        {/* Medicines Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Medicines
          </label>
          <div className="space-y-3">
            {medicines.map((medicine, index) => (
              <div key={index} className="grid grid-cols-4 gap-3 p-3 bg-gray-50 rounded-lg">
                <Input
                  placeholder="Medicine name"
                  value={medicine.name}
                  onChange={(e) => {
                    const newMeds = [...medicines];
                    newMeds[index].name = e.target.value;
                    setMedicines(newMeds);
                  }}
                  className="col-span-1"
                />
                <Input
                  placeholder="Dosage"
                  value={medicine.dosage}
                  onChange={(e) => {
                    const newMeds = [...medicines];
                    newMeds[index].dosage = e.target.value;
                    setMedicines(newMeds);
                  }}
                  className="col-span-1"
                />
                <Input
                  placeholder="Frequency"
                  value={medicine.frequency}
                  onChange={(e) => {
                    const newMeds = [...medicines];
                    newMeds[index].frequency = e.target.value;
                    setMedicines(newMeds);
                  }}
                  className="col-span-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveMedicine(index)}
                  className="col-span-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="grid grid-cols-4 gap-3 p-3 bg-gray-50 rounded-lg">
              <Input
                placeholder="Medicine name"
                value={newMedicine.name}
                onChange={(e) => setNewMedicine(prev => ({ ...prev, name: e.target.value }))}
                className="col-span-1"
              />
              <Input
                placeholder="Dosage"
                value={newMedicine.dosage}
                onChange={(e) => setNewMedicine(prev => ({ ...prev, dosage: e.target.value }))}
                className="col-span-1"
              />
              <Input
                placeholder="Frequency"
                value={newMedicine.frequency}
                onChange={(e) => setNewMedicine(prev => ({ ...prev, frequency: e.target.value }))}
                className="col-span-1"
              />
              <Button
                type="button"
                onClick={handleAddMedicine}
                className="col-span-1"
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <Textarea
            placeholder="Enter any additional notes or instructions"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGeneratePrescription}
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Prescription"}
        </Button>
      </CardContent>
    </Card>
  );
} 