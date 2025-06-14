import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Search, UserPlus } from "lucide-react";
import AdminSidebar from "../../components/admin-sidebar";
import { useToast } from "../../components/ui/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";

// Mock doctors data
const initialDoctors = [
  {
    id: "d1",
    name: "Dr. Jane Wilson",
    specialization: "Cardiology",
    email: "jane.wilson@hospital.com",
    patients: 24,
    appointments: 8,
  },
  {
    id: "d2",
    name: "Dr. Robert Chen",
    specialization: "Neurology",
    email: "robert.chen@hospital.com",
    patients: 18,
    appointments: 5,
  },
  {
    id: "d3",
    name: "Dr. Sarah Miller",
    specialization: "Orthopedics",
    email: "sarah.miller@hospital.com",
    patients: 31,
    appointments: 12,
  },
  {
    id: "d4",
    name: "Dr. James Taylor",
    specialization: "General Medicine",
    email: "james.taylor@hospital.com",
    patients: 42,
    appointments: 15,
  },
];

export default function AdminDashboard() {
  const [doctors, setDoctors] = useState(initialDoctors);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  const { toast } = useToast();
  const [activeView, setActiveView] = useState("dashboard");

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddDoctor = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const newDoctor = {
      id: `d${doctors.length + 1}`,
      name: formData.get("name"),
      specialization: formData.get("specialization"),
      email: formData.get("email"),
      patients: 0,
      appointments: 0,
    };

    setDoctors([...doctors, newDoctor]);
    setIsAddDoctorOpen(false);

    toast({
      title: "Doctor Added",
      description: `${newDoctor.name} has been added successfully.`,
    });
  };

  const handleRemoveDoctor = (doctorId) => {
    const doctorToRemove = doctors.find((d) => d.id === doctorId);
    setDoctors(doctors.filter((doctor) => doctor.id !== doctorId));

    toast({
      title: "Doctor Removed",
      description: `${doctorToRemove?.name} has been removed successfully.`,
    });
  };

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
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
      case "doctors":
        return (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search doctors..."
                  className="w-64 pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Dialog open={isAddDoctorOpen} onOpenChange={setIsAddDoctorOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Doctor
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Doctor</DialogTitle>
                    <DialogDescription>
                      Enter the details of the new doctor to add them to the
                      system.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddDoctor}>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="specialization">Specialization</Label>
                        <Select name="specialization" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select specialization" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Cardiology">
                              Cardiology
                            </SelectItem>
                            <SelectItem value="Neurology">Neurology</SelectItem>
                            <SelectItem value="Orthopedics">
                              Orthopedics
                            </SelectItem>
                            <SelectItem value="Ophthalmology">
                              Ophthalmology
                            </SelectItem>
                            <SelectItem value="General Medicine">
                              General Medicine
                            </SelectItem>
                            <SelectItem value="Pediatrics">
                              Pediatrics
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddDoctorOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Add Doctor</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDoctors.map((doctor) => (
                <Card key={doctor.id} className="border-none shadow-lg">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {doctor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRemoveDoctor(doctor.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="mb-1">{doctor.name}</CardTitle>
                    <p className="text-blue-600 text-sm mb-4">
                      {doctor.specialization}
                    </p>

                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Email:</span>
                        <span>{doctor.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Patients:</span>
                        <span>{doctor.patients}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Appointments:</span>
                        <span>{doctor.appointments}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredDoctors.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-gray-600 text-lg">
                  No doctors found matching your search.
                </p>
              </div>
            )}
          </>
        );
      case "settings":
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Admin Settings</h2>
            <p>Content for admin settings goes here.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar setActiveView={setActiveView} activeView={activeView} />

      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <Input
              type="search"
              placeholder="Search..."
              className="w-64 pl-8"
            />
            <Button>Quick Action</Button>
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}
