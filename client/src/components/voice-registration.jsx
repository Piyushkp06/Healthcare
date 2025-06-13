import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Loader2, Download } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { useToast } from "../../hooks/use-toast";

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
    // If we have an initial transcript, process it
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

        // Stop all tracks to release the microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
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
      // Mock API call to Whisper for speech-to-text
      // In a real implementation, you would send the audio to the Whisper API
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API delay

      // Mock transcript response
      const mockTranscript =
        "My name is John Smith. I am 45 years old. I've been experiencing chest pain and shortness of breath for the past two days. I have a history of high blood pressure.";
      setTranscript(mockTranscript);

      // Process the transcript
      await processTranscript(mockTranscript);
    } catch (error) {
      console.error("Error processing audio:", error);
      setIsProcessing(false);
      toast({
        title: "Processing Error",
        description:
          "There was an error processing your recording. Please try again.",
        variant: "destructive",
      });
    }
  };

  const processTranscript = async (text) => {
    try {
      // Mock extracting structured data from the transcript
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate processing delay

      const mockExtractedData = {
        name: "John Smith",
        age: 45,
        gender: "male",
        symptoms: ["chest pain", "shortness of breath"],
        history: ["high blood pressure"],
      };
      setExtractedData(mockExtractedData);

      // Mock generating prescription
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate processing delay

      const mockPrescription = {
        doctorId,
        patientName: "John Smith",
        diagnosis: "Potential angina, requires further investigation",
        medicines: [
          { name: "Aspirin", dosage: "75mg", frequency: "once daily" },
          {
            name: "Nitroglycerin",
            dosage: "0.4mg",
            frequency: "as needed for chest pain",
          },
        ],
        notes: "Schedule ECG and stress test. Follow up in 1 week.",
      };
      setPrescriptionData(mockPrescription);

      setIsProcessing(false);

      toast({
        title: "Registration Complete",
        description: "Your voice registration has been processed successfully.",
      });
    } catch (error) {
      console.error("Error processing transcript:", error);
      setIsProcessing(false);
      toast({
        title: "Processing Error",
        description:
          "There was an error processing your information. Please try again.",
        variant: "destructive",
      });
    }
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
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
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
