import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Loader2, Download } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { useToast } from "../../hooks/use-toast";
import { AssemblyAI } from "assemblyai";

// Initialize AssemblyAI client
const assemblyClient = new AssemblyAI({
  apiKey: import.meta.env.VITE_ASSEMBLY_API_KEY || "",
});

export default function VoiceRegistration({ doctorId, initialTranscript }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState(initialTranscript || "");
  const [extractedData, setExtractedData] = useState(null);
  const [prescriptionData, setPrescriptionData] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const { toast } = useToast();

  useEffect(() => {
    if (initialTranscript) {
      processTranscript(initialTranscript);
    }
  }, [initialTranscript]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        await processAudio(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Microphone error:", error);
      toast({
        title: "Microphone Error",
        description:
          "Could not access your microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const processAudio = async (audioBlob) => {
    try {
      // Transcribe audio using AssemblyAI
      const response = await assemblyClient.transcripts.transcribe({
        audio: audioBlob,
      });

      if (response?.text) {
        setTranscript(response.text);
        await processTranscript(response.text);
      } else {
        throw new Error("Failed to transcribe audio");
      }
    } catch (error) {
      console.error("Error processing audio:", error);
      setIsProcessing(false);
      toast({
        title: "Processing Error",
        description: "There was an error processing your recording.",
        variant: "destructive",
      });
    }
  };

  const processTranscript = async (text) => {
    try {
      // Enhanced mock data extraction based on transcript
      const mockExtractedData = extractInformationFromTranscript(text);
      setExtractedData(mockExtractedData);

      const mockPrescription = {
        doctorId,
        patientName: mockExtractedData.name,
        diagnosis: generateDiagnosis(mockExtractedData.symptoms),
        medicines: generateMedicines(mockExtractedData.symptoms),
        notes:
          "Follow up recommended. Please schedule a follow-up appointment.",
      };
      setPrescriptionData(mockPrescription);
      setIsProcessing(false);

      toast({
        title: "Registration Complete",
        description: "Your voice registration has been processed successfully.",
      });
    } catch (error) {
      console.error("Transcript processing error:", error);
      setIsProcessing(false);
      toast({
        title: "Processing Error",
        description: "Could not extract information from the transcript.",
        variant: "destructive",
      });
    }
  };

  // Helper function to extract information from transcript
  const extractInformationFromTranscript = (text) => {
    const lowerText = text.toLowerCase();

    // Simple keyword-based extraction (you can enhance this with NLP)
    const symptoms = [];
    const commonSymptoms = [
      "headache",
      "fever",
      "cough",
      "pain",
      "nausea",
      "dizziness",
      "fatigue",
      "chest pain",
      "shortness of breath",
      "sore throat",
      "runny nose",
      "stomach ache",
      "back pain",
      "joint pain",
    ];

    commonSymptoms.forEach((symptom) => {
      if (lowerText.includes(symptom)) {
        symptoms.push(symptom);
      }
    });

    // Extract age (simple regex)
    const ageMatch = text.match(/(\d{1,3})\s*years?\s*old|age\s*(\d{1,3})/i);
    const age = ageMatch ? ageMatch[1] || ageMatch[2] : "Not specified";

    // Extract gender
    let gender = "Not specified";
    if (lowerText.includes("male") && !lowerText.includes("female")) {
      gender = "Male";
    } else if (lowerText.includes("female")) {
      gender = "Female";
    }

    // Extract name (simple approach - look for "my name is" or "I am")
    const nameMatch = text.match(/(?:my name is|i am|i'm)\s+([a-zA-Z\s]+)/i);
    const name = nameMatch ? nameMatch[1].trim() : "Patient";

    return {
      name: name,
      age: age,
      gender: gender,
      symptoms: symptoms.length > 0 ? symptoms : ["General consultation"],
      history: ["As mentioned in consultation"],
    };
  };

  // Helper function to generate diagnosis based on symptoms
  const generateDiagnosis = (symptoms) => {
    if (
      symptoms.includes("chest pain") ||
      symptoms.includes("shortness of breath")
    ) {
      return "Potential cardiac evaluation required";
    } else if (
      symptoms.includes("headache") ||
      symptoms.includes("dizziness")
    ) {
      return "Possible neurological consultation needed";
    } else if (symptoms.includes("fever") || symptoms.includes("cough")) {
      return "Upper respiratory tract infection suspected";
    } else {
      return "General health assessment and consultation";
    }
  };

  // Helper function to generate medicines based on symptoms
  const generateMedicines = (symptoms) => {
    const medicines = [];

    if (symptoms.includes("headache")) {
      medicines.push({
        name: "Paracetamol",
        dosage: "500mg",
        frequency: "twice daily",
      });
    }
    if (symptoms.includes("fever")) {
      medicines.push({
        name: "Ibuprofen",
        dosage: "400mg",
        frequency: "as needed",
      });
    }
    if (symptoms.includes("cough")) {
      medicines.push({
        name: "Cough syrup",
        dosage: "10ml",
        frequency: "three times daily",
      });
    }

    if (medicines.length === 0) {
      medicines.push({
        name: "Multivitamin",
        dosage: "1 tablet",
        frequency: "once daily",
      });
    }

    return medicines;
  };

  const downloadPrescription = () => {
    if (!prescriptionData) return;

    const prescriptionText = `
      MEDICAL PRESCRIPTION

      Patient: ${prescriptionData.patientName}
      Doctor ID: ${prescriptionData.doctorId}
      Date: ${new Date().toLocaleDateString()}

      Diagnosis: ${prescriptionData.diagnosis}

      Medications:
      ${prescriptionData.medicines
        .map((med) => `- ${med.name} ${med.dosage}, ${med.frequency}`)
        .join("\n")}

      Notes:
      ${prescriptionData.notes}
    `;

    const blob = new Blob([prescriptionText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prescription_${prescriptionData.patientName.replace(
      /\s+/g,
      "_"
    )}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200">
        <AlertDescription className="flex items-center gap-2 text-blue-800">
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          Please speak clearly about your name, age, gender, symptoms, and any
          relevant medical history.
        </AlertDescription>
      </Alert>

      <div className="flex justify-center">
        <Button
          size="lg"
          variant={isRecording ? "destructive" : "default"}
          className={`rounded-full h-20 w-20 ${
            isRecording ? "animate-pulse" : "voice-pulse"
          }`}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : isRecording ? (
            <MicOff className="h-8 w-8" />
          ) : (
            <Mic className="h-8 w-8" />
          )}
        </Button>
      </div>

      <p className="text-center text-sm text-gray-500">
        {isRecording
          ? "Recording... Click to stop"
          : isProcessing
          ? "Processing your voice..."
          : "Click the microphone to start recording"}
      </p>

      {transcript && (
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">Transcript:</h3>
            <p className="text-gray-700">{transcript}</p>
          </CardContent>
        </Card>
      )}

      {extractedData && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">Extracted Information:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="font-medium">Name:</div>
              <div>{extractedData.name}</div>

              <div className="font-medium">Age:</div>
              <div>{extractedData.age}</div>

              <div className="font-medium">Gender:</div>
              <div>{extractedData.gender}</div>

              <div className="font-medium">Symptoms:</div>
              <div>{extractedData.symptoms.join(", ")}</div>

              <div className="font-medium">Medical History:</div>
              <div>{extractedData.history.join(", ")}</div>
            </div>
          </CardContent>
        </Card>
      )}

      {prescriptionData && (
        <div className="mt-6 flex justify-center">
          <Button
            onClick={downloadPrescription}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Prescription
          </Button>
        </div>
      )}
    </div>
  );
}
