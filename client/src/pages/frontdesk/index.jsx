import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Mic, ChevronRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import VoiceRegistration from "../../components/voice-registration";
import PatientForm from "../../components/patient-form";
import DepartmentSelection from "../../components/department-selection";
import Navbar from "../../components/navbar";

export default function FrontdeskPage() {
  const [step, setStep] = useState("department");
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [initialTab, setInitialTab] = useState("voice");
  const [searchParams] = useSearchParams();
  const transcript = searchParams.get("transcript");

  useEffect(() => {
    // If there's a transcript in the URL, we came from voice registration on the homepage
    if (transcript) {
      // For demo purposes, let's assume the transcript mentions neurology
      // In a real app, you'd use NLP to determine the department from the transcript
      if (
        transcript.toLowerCase().includes("headache") ||
        transcript.toLowerCase().includes("neurologist")
      ) {
        setSelectedDepartment("Neurology");
        setSelectedDoctor("doc3"); // ID for Dr. Michael Brown, Neurologist
        setStep("registration");
        setInitialTab("voice");
      }
    }
  }, [transcript]);

  const handleDepartmentSelected = (department, doctorId) => {
    setSelectedDepartment(department);
    setSelectedDoctor(doctorId);
    setStep("registration");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <div className="pt-28 pb-16 px-4 md:px-8">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">
            Patient Registration
          </h1>

          {step === "department" && (
            <Card className="shadow-lg border-none">
              <CardHeader>
                <CardTitle>Select Department & Doctor</CardTitle>
                <CardDescription>
                  Please select the department and doctor you wish to visit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DepartmentSelection onSelect={handleDepartmentSelected} />
              </CardContent>
            </Card>
          )}

          {step === "registration" && selectedDepartment && selectedDoctor && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep("department")}
                  className="text-blue-600"
                >
                  Departments
                </Button>
                <ChevronRight className="h-4 w-4" />
                <span>{selectedDepartment}</span>
              </div>

              <Card className="shadow-lg border-none">
                <CardHeader>
                  <CardTitle>Patient Registration</CardTitle>
                  <CardDescription>
                    Please provide your details to complete the registration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue={initialTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger
                        value="voice"
                        className="flex items-center gap-2"
                      >
                        <Mic className="h-4 w-4" />
                        Voice Registration
                      </TabsTrigger>
                      <TabsTrigger
                        value="form"
                        className="flex items-center gap-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Form Registration
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="voice">
                      <VoiceRegistration
                        doctorId={selectedDoctor}
                        initialTranscript={transcript || undefined}
                      />
                    </TabsContent>
                    <TabsContent value="form">
                      <PatientForm doctorId={selectedDoctor} />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
