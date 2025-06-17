import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Search, Trash2, History, User } from "lucide-react";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import apiClient from "../../lib/api-client";
import {
  VIEW_PATIENTS_ROUTE,
  DELETE_PATIENT_ROUTE,
  GET_PATIENT_BY_ID_ROUTE,
} from "../../utils/constants";
import { useToast } from "../../components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [filterDoctor, setFilterDoctor] = useState("all");
  const [filterGender, setFilterGender] = useState("all");
  const { toast } = useToast();

  const fetchPatients = async () => {
    try {
  //    console.log("Fetching patients from:", VIEW_PATIENTS_ROUTE);
      const response = await apiClient.get(VIEW_PATIENTS_ROUTE);
    //  console.log("API Response:", response.data);
      setPatients(response.data.patients || []);
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast({
        title: "Error",
        description: "Failed to fetch patients data",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    console.log("Component mounted, fetching patients...");
    fetchPatients();
  }, []);

  const handleDeletePatient = async () => {
    try {
      await apiClient.delete(DELETE_PATIENT_ROUTE.replace(':id', patientToDelete._id));
      toast({
        title: "Success",
        description: "Patient deleted successfully",
      });
      fetchPatients();
      setIsDeleteDialogOpen(false);
      setPatientToDelete(null);
    } catch (error) {
      console.error("Error deleting patient:", error);
      toast({
        title: "Error",
        description: "Failed to delete patient",
        variant: "destructive",
      });
    }
  };

  const handleViewPatientHistory = async (patientId) => {
    try {
      const response = await apiClient.get(GET_PATIENT_BY_ID_ROUTE.replace(':id', patientId));
      setSelectedPatient(response.data);
      setIsHistoryOpen(true);
    } catch (error) {
      console.error("Error fetching patient history:", error);
      toast({
        title: "Error",
        description: "Failed to fetch patient history",
        variant: "destructive",
      });
    }
  };

  const filteredPatients = patients.filter((patient) => {
    //console.log("Filtering patients:", patients);
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.doctorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.doctorSpecialization?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDoctor = filterDoctor === "all" || patient.doctorName === filterDoctor;
    const matchesGender = filterGender === "all" || patient.gender === filterGender;

    return matchesSearch && matchesDoctor && matchesGender;
  });

  const uniqueDoctors = [...new Set(patients.map((p) => p.doctorName))].filter(Boolean);

  const renderPatientHistory = (history) => {
    if (!history || history.length === 0) {
      return <div className="text-gray-500">No visit history available</div>;
    }

    return (
      <div className="space-y-4">
        {history.map((visit, index) => (
          <div key={index} className="border-b pb-4">
            <div className="font-medium">
              Visit Date: {new Date(visit.createdAt).toLocaleDateString()}
            </div>
            <div>Doctor: {visit.doctorId?.name || "Unknown"}</div>
            <div>Specialization: {visit.doctorId?.specialization || "Unknown"}</div>
            <div>Diagnosis: {visit.symptoms?.join(", ") || "None"}</div>
            <div>Prescription: {visit.medicines?.map(m => `${m.name} (${m.dosage})`).join(", ") || "None"}</div>
            <div>Notes: {visit.notes || "No additional notes"}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Patients</h2>
        <div className="flex gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search patients..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filterDoctor} onValueChange={setFilterDoctor}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Doctor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Doctors</SelectItem>
              {uniqueDoctors.map((doctor) => (
                <SelectItem key={doctor} value={doctor}>
                  {doctor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterGender} onValueChange={setFilterGender}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genders</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {patients.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No patients found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.map((patient) => (
            <Card key={patient._id || patient.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {patient.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{patient.name}</CardTitle>
                      <div className="text-sm text-gray-500">
                        {patient.age} years, {patient.gender}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      setPatientToDelete(patient);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium">Phone:</span>
                    <span className="ml-2">{patient.phone}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium">Doctor:</span>
                    <span className="ml-2">{patient.doctorName || "Not Assigned"}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium">Specialization:</span>
                    <span className="ml-2">{patient.doctorSpecialization || "Not Assigned"}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium">Symptoms:</span>
                    <span className="ml-2">
                      {patient.symptoms?.length > 0
                        ? patient.symptoms.join(", ")
                        : "None"}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleViewPatientHistory(patient._id)}
                >
                  <History className="h-4 w-4 mr-2" />
                  View History
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the patient
              record and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePatient}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={isHistoryOpen}
        onOpenChange={(open) => {
          setIsHistoryOpen(open);
          if (!open) setSelectedPatient(null);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Patient History - {selectedPatient?.name}</DialogTitle>
          </DialogHeader>
          {selectedPatient && renderPatientHistory(selectedPatient.history)}
        </DialogContent>
      </Dialog>
    </div>
  );
} 