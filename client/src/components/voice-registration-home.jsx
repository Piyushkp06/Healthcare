import { useState, useRef } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { useToast } from "../../hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function VoiceRegistrationHome() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const { toast } = useToast();
  const navigate = useNavigate();

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
        await processAudio(/* audioBlob */);

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

  const processAudio = async (/* audioBlob */) => {
    try {
      // Mock API call to Whisper for speech-to-text
      // In a real implementation, you would send the audio to the Whisper API
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API delay

      // Mock transcript response
      const mockTranscript =
        "I'm experiencing severe headaches and dizziness for the past week. I'd like to see a neurologist as soon as possible.";
      setTranscript(mockTranscript);

      // Simulate processing and redirect
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Voice Processed",
        description: "Redirecting you to complete your registration.",
      });

      // Redirect to frontdesk with the transcript as a query parameter
      setTimeout(() => {
        navigate(`/frontdesk?transcript=${encodeURIComponent(mockTranscript)}`);
      }, 1000);
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
          Describe your symptoms, preferred department, or doctor
        </AlertDescription>
      </Alert>

      <div className="flex justify-center">
        <Button
          size="lg"
          variant={isRecording ? "destructive" : "default"}
          className={`rounded-full h-24 w-24 ${
            isRecording ? "animate-pulse" : "voice-pulse"
          }`}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Loader2 className="h-10 w-10 text-primary-foreground" />
          ) : isRecording ? (
            <MicOff className="h-10 w-10 text-primary-foreground" />
          ) : (
            <Mic className="h-10 w-10 text-primary-foreground" />
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
        <Card className="mt-4 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">We heard:</h3>
            <p className="text-gray-700 italic">"{transcript}"</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
