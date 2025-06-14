import { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Calendar, Clock, Stethoscope, User } from "lucide-react";
import DoctorSidebar from "../../components/doctor-sidebar";
import { Badge } from "../../components/ui/badge";

export default function DoctorDashboard() {
  const [appointments] = useState([
    {
      id: "a1",
      patientName: "John Smith",
      time: "09:00 AM",
      date: "2023-06-15",
      status: "Upcoming",
      reason: "Routine Checkup",
      age: 45,
      gender: "male",
      symptoms: ["chest pain", "shortness of breath"],
      medicalHistory: "No previous medical history available.",
      diagnosis: "Potential angina, requires further investigation",
      medications: ["Aspirin", "Nitroglycerin"],
      notes: "Schedule ECG and stress test. Follow up in 1 week.",
    },
    {
      id: "a2",
      patientName: "Sarah Johnson",
      time: "10:30 AM",
      date: "2023-06-15",
      status: "Upcoming",
      reason: "Headache Consultation",
      age: 32,
      gender: "female",
      symptoms: ["severe headache", "dizziness"],
      medicalHistory: "Migraines since childhood.",
      diagnosis: "Migraine with aura",
      medications: ["Sumatriptan"],
      notes: "Advised rest and hydration.",
    },
    {
      id: "a3",
      patientName: "Michael Brown",
      time: "02:00 PM",
      date: "2023-06-15",
      status: "Upcoming",
      reason: "Follow-up Visit",
      age: 58,
      gender: "male",
      symptoms: ["fatigue", "weight loss"],
      medicalHistory: "Type 2 Diabetes, Hypertension.",
      diagnosis: "Diabetes management follow-up",
      medications: ["Metformin", "Lisinopril"],
      notes: "Adjusted Metformin dosage.",
    },
    {
      id: "a4",
      patientName: "Emily Davis",
      time: "11:00 AM",
      date: "2023-06-16",
      status: "Upcoming",
      reason: "Annual Physical",
      age: 27,
      gender: "female",
      symptoms: [],
      medicalHistory: "No significant history.",
      diagnosis: "Healthy, routine checkup",
      medications: [],
      notes: "Advised healthy lifestyle.",
    },
  ]);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeView, setActiveView] = useState("dashboard");

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
  };

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card className="border-none shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Today's Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {appointments.filter((a) => a.date === "2023-06-15").length}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Total Patients
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {appointments.length}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Next Appointment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">
                    {appointments[0]?.time || "N/A"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {appointments[0]?.patientName
                      ? `with ${appointments[0].patientName}`
                      : "No upcoming appointments"}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <h2 className="text-xl font-bold p-4 border-b">
                  Today's Appointments
                </h2>
                <div className="divide-y">
                  {appointments
                    .filter((appt) => appt.date === "2023-06-15")
                    .map((appointment) => (
                      <div
                        key={appointment.id}
                        className="p-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleSelectPatient(appointment)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="bg-blue-100 p-3 rounded-full">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-medium">
                                {appointment.patientName}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {appointment.age} years, {appointment.gender}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="mr-1 h-4 w-4" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                {selectedPatient ? (
                  <Card className="shadow-lg border-none">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xl">
                          {selectedPatient.patientName}
                        </CardTitle>
                        <Button
                          variant="ghost"
                          onClick={() => setSelectedPatient(null)}
                        >
                          Back to List
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">
                        {selectedPatient.age} years, {selectedPatient.gender}
                      </p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Tabs defaultValue="patient-details" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                          <TabsTrigger value="patient-details">
                            Patient Details
                          </TabsTrigger>
                          <TabsTrigger value="prescription">
                            Prescription
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="patient-details">
                          <div className="space-y-4">
                            <div>
                              <h3 className="font-medium mb-1">Symptoms</h3>
                              <div className="flex flex-wrap gap-2">
                                {selectedPatient.symptoms.length > 0 ? (
                                  selectedPatient.symptoms.map(
                                    (symptom, index) => (
                                      <Badge key={index} variant="secondary">
                                        {symptom}
                                      </Badge>
                                    )
                                  )
                                ) : (
                                  <p className="text-gray-500 text-sm">
                                    No symptoms recorded.
                                  </p>
                                )}
                              </div>
                            </div>
                            <div>
                              <h3 className="font-medium mb-1">
                                Medical History
                              </h3>
                              <p className="text-gray-700 text-sm">
                                {selectedPatient.medicalHistory}
                              </p>
                            </div>
                            <div>
                              <h3 className="font-medium mb-1">Appointment</h3>
                              <p className="text-gray-700 text-sm">
                                {selectedPatient.date}, {selectedPatient.time}
                              </p>
                            </div>
                            <div>
                              <h3 className="font-medium mb-1">
                                Doctor's Notes
                              </h3>
                              <Textarea
                                placeholder="Add your notes about the patient here..."
                                className="min-h-[100px]"
                                defaultValue={selectedPatient.notes}
                              />
                            </div>
                          </div>
                        </TabsContent>
                        <TabsContent value="prescription">
                          <div className="space-y-4">
                            <div>
                              <h3 className="font-medium mb-1">Diagnosis</h3>
                              <Input
                                type="text"
                                placeholder="Diagnosis..."
                                defaultValue={selectedPatient.diagnosis}
                              />
                            </div>
                            <div>
                              <h3 className="font-medium mb-2">Medications</h3>
                              {selectedPatient.medications.length > 0 ? (
                                selectedPatient.medications.map(
                                  (med, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between text-sm mb-2"
                                    >
                                      <p>{med}</p>
                                      <Button variant="ghost" size="sm">
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
                                          className="lucide lucide-trash"
                                        >
                                          <path d="M3 6h18" />
                                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                        </svg>
                                      </Button>
                                    </div>
                                  )
                                )
                              ) : (
                                <p className="text-gray-500 text-sm">
                                  No medications prescribed.
                                </p>
                              )}
                              <Button variant="outline" className="mt-2 w-full">
                                + Add Medication
                              </Button>
                            </div>
                            <div>
                              <h3 className="font-medium mb-1">Notes</h3>
                              <Textarea
                                placeholder="Add prescription notes..."
                                className="min-h-[100px]"
                                defaultValue={selectedPatient.notes}
                              />
                            </div>
                            <Button className="w-full">
                              Download Prescription
                            </Button>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="shadow-lg border-none flex items-center justify-center min-h-[400px]">
                    <CardContent className="text-center text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-clipboard-list mx-auto mb-4"
                      >
                        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                        <path d="M12 11h4" />
                        <path d="M12 16h4" />
                        <path d="M8 11h.01" />
                        <path d="M8 16h.01" />
                      </svg>
                      <p>No Patient Selected</p>
                      <p className="text-sm">
                        Select a patient from the list to view their details and
                        generate a prescription
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </>
        );
      case "appointments":
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">All Appointments</h2>
            <p>Content for all appointments goes here.</p>
          </div>
        );
      case "patients":
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">All Patients</h2>
            <p>Content for all patients goes here.</p>
          </div>
        );
      case "prescriptions":
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">All Prescriptions</h2>
            <p>Content for all prescriptions goes here.</p>
          </div>
        );
      case "settings":
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <p>Content for settings goes here.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DoctorSidebar setActiveView={setActiveView} activeView={activeView} />

      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
          <div className="flex items-center gap-4">
            <Input
              type="search"
              placeholder="Search patients..."
              className="w-64"
            />
            <Button>+ New Appointment</Button>
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}