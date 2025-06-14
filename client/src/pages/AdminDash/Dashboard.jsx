import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogTrigger,
} from "../../components/ui/dialog";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "../../components/ui/select";
import { Search, UserPlus } from "lucide-react";
import AdminSidebar from "../../components/admin-sidebar";
import { useToast } from "../../components/ui/use-toast";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "../../components/ui/card";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import apiClient from "../../lib/api-client";
import {
  REGISTER_DOCTOR_ROUTE,
  DEREGISTER_DOCTOR_ROUTE,
  VIEW_PATIENTS_ROUTE,
  DOCTORS_BY_SPECIALIZATION_ROUTE,
  ALL_DOCTORS_ROUTE,
} from "../../utils/constants";

const mockDoctors = [
  {
    id: "d1",
    name: "Dr. Jane Wilson",
    specialization: "Cardiology",
    email: "jane.wilson@hospital.com",
    patients: 24,
    appointments: 8,
    doctorId: "DOC001",
  },
  {
    id: "d2",
    name: "Dr. Robert Chen",
    specialization: "Neurology",
    email: "robert.chen@hospital.com",
    patients: 18,
    appointments: 5,
    doctorId: "DOC002",
  },
  {
    id: "d3",
    name: "Dr. Sarah Miller",
    specialization: "Orthopedics",
    email: "sarah.miller@hospital.com",
    patients: 31,
    appointments: 12,
    doctorId: "DOC003",
  },
  {
    id: "d4",
    name: "Dr. James Taylor",
    specialization: "General Medicine",
    email: "james.taylor@hospital.com",
    patients: 42,
    appointments: 15,
    doctorId: "DOC004",
  },
];

export default function AdminDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  const { toast } = useToast();
  const [activeView, setActiveView] = useState("dashboard");
  const [patients, setPatients] = useState([]);

  const fetchDoctors = async () => {
    try {
      const res = await apiClient.get(ALL_DOCTORS_ROUTE);
      const dbDoctors = res.data.doctors || [];

      // Filter out duplicates by doctorId
      const uniqueDoctors = [
        ...mockDoctors,
        ...dbDoctors.filter(dbDoc => !mockDoctors.some(mock => mock.doctorId === dbDoc.doctorId)),
      ];

      setDoctors(uniqueDoctors.map(doc => ({
        ...doc,
        patients: doc.patients || 0,
        appointments: doc.appointments || 0,
      })));
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to fetch doctors.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newDoctor = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      password: formData.get("password"),
      specialization: formData.get("specialization"),
      doctorId: formData.get("doctorId"),
    };

    try {
      await apiClient.post(REGISTER_DOCTOR_ROUTE, newDoctor);
      await fetchDoctors();
      toast({
        title: "Doctor Registered",
        description: `${newDoctor.name} has been registered.`,
      });
      setIsAddDoctorOpen(false);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to register doctor.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveDoctor = async (doctorId) => {
    try {
      await apiClient.delete(DEREGISTER_DOCTOR_ROUTE, {
        data: { doctorId },
      });
      await fetchDoctors();
      toast({ title: "Doctor Removed" });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to remove doctor.",
        variant: "destructive",
      });
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await apiClient.get(VIEW_PATIENTS_ROUTE);
      setPatients(res.data.patients);
    } catch (err) {
      toast({
        title: "Error",
        description: "Could not fetch patients.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (activeView === "patients") fetchPatients();
  }, [activeView]);

  const renderContent = () => {
    if (activeView === "dashboard") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <Card className="border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Doctors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{doctors.length}</div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Patients Managed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {doctors.reduce((sum, doc) => sum + doc.patients, 0)}
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {doctors.reduce((sum, doc) => sum + doc.appointments, 0)}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (activeView === "doctors") {
      return (
        <div>
          <div className="flex justify-between items-center mb-6">
            <Input
              type="search"
              placeholder="Search doctors..."
              className="w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Dialog open={isAddDoctorOpen} onOpenChange={setIsAddDoctorOpen}>
              <DialogTrigger asChild>
                <Button><UserPlus className="mr-2 h-4 w-4" /> Add Doctor</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Doctor</DialogTitle>
                  <DialogDescription>Register a new doctor.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddDoctor} className="grid gap-4 py-4">
                  {["name", "email", "phone", "password", "specialization", "doctorId"].map((field) => (
                    <div className="grid gap-2" key={field}>
                      <Label htmlFor={field}>{field[0].toUpperCase() + field.slice(1)}</Label>
                      <Input id={field} name={field} type={field === "password" ? "password" : "text"} required />
                    </div>
                  ))}
                  <div className="flex justify-end gap-2">
                    <Button type="submit">Register</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.doctorId} className="border-none shadow-lg">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {doctor.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600"
                      onClick={() => handleRemoveDoctor(doctor.doctorId)}
                    >
                      Remove
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="mb-1">{doctor.name}</CardTitle>
                  <p className="text-blue-600 text-sm mb-4">{doctor.specialization}</p>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between"><span className="text-gray-500">Email:</span><span>{doctor.email}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Patients:</span><span>{doctor.patients}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Appointments:</span><span>{doctor.appointments}</span></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    if (activeView === "patients") {
      return (
        <div className="grid gap-4">
          {patients.map((patient) => (
            <Card key={patient._id} className="shadow">
              <CardHeader><CardTitle>{patient.name}</CardTitle></CardHeader>
              <CardContent>
                <p>Email: {patient.email}</p>
                <p>Doctor: {patient.assignedDoctor?.name || "Unassigned"}</p>
                <p>Diagnosis: {patient.diagnosis}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar setActiveView={setActiveView} activeView={activeView} />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        {renderContent()}
      </div>
    </div>
  );
}
