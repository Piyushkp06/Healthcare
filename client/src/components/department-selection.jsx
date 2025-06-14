import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import {
  Heart,
  Brain,
  Bone,
  Eye,
  Stethoscope,
  Baby,
  ChevronRight,
} from "lucide-react";

// Mock data for departments and doctors
const departments = [
  {
    id: "cardiology",
    name: "Cardiology",
    icon: Heart,
    description: "Heart and cardiovascular system",
    image: "/placeholder.svg?height=200&width=300",
    doctors: [
      {
        id: "doc1",
        name: "Dr. John Smith",
        specialization: "Cardiologist",
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: "doc2",
        name: "Dr. Emily Johnson",
        specialization: "Cardiac Surgeon",
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
  },
  {
    id: "neurology",
    name: "Neurology",
    icon: Brain,
    description: "Brain and nervous system",
    image: "/placeholder.svg?height=200&width=300",
    doctors: [
      {
        id: "doc3",
        name: "Dr. Michael Brown",
        specialization: "Neurologist",
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: "doc4",
        name: "Dr. Sarah Davis",
        specialization: "Neurosurgeon",
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
  },
  {
    id: "orthopedics",
    name: "Orthopedics",
    icon: Bone,
    description: "Bones, joints, and muscles",
    image: "/placeholder.svg?height=200&width=300",
    doctors: [
      {
        id: "doc5",
        name: "Dr. Robert Wilson",
        specialization: "Orthopedic Surgeon",
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: "doc6",
        name: "Dr. Jennifer Lee",
        specialization: "Sports Medicine",
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
  },
  {
    id: "ophthalmology",
    name: "Ophthalmology",
    icon: Eye,
    description: "Eye care and vision",
    image: "/placeholder.svg?height=200&width=300",
    doctors: [
      {
        id: "doc7",
        name: "Dr. David Miller",
        specialization: "Ophthalmologist",
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: "doc8",
        name: "Dr. Lisa Chen",
        specialization: "Eye Surgeon",
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
  },
  {
    id: "general",
    name: "General Medicine",
    icon: Stethoscope,
    description: "General health and wellness",
    image: "/placeholder.svg?height=200&width=300",
    doctors: [
      {
        id: "doc9",
        name: "Dr. James Taylor",
        specialization: "General Physician",
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: "doc10",
        name: "Dr. Patricia Moore",
        specialization: "Family Medicine",
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
  },
  {
    id: "pediatrics",
    name: "Pediatrics",
    icon: Baby,
    description: "Child healthcare",
    image: "/placeholder.svg?height=200&width=300",
    doctors: [
      {
        id: "doc11",
        name: "Dr. Thomas Anderson",
        specialization: "Pediatrician",
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: "doc12",
        name: "Dr. Nancy White",
        specialization: "Child Specialist",
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
  },
];

export default function DepartmentSelection({ onSelect }) {
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  return (
    <div className="space-y-6">
      {!selectedDepartment ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => {
            const Icon = dept.icon;
            return (
              <Card
                key={dept.id}
                className="cursor-pointer hover:shadow-xl transition-all duration-300 border-none shadow-lg overflow-hidden department-card"
                onClick={() => setSelectedDepartment(dept.id)}
              >
                <div className="h-36 relative">
                  <img
                    src={dept.image || "/placeholder.svg"}
                    alt={dept.name}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-4 text-white">
                      <h3 className="font-bold text-lg">{dept.name}</h3>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-600">{dept.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-between mt-2"
                  >
                    Select Department <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-medium">Select Doctor</h3>
            <Button
              variant="outline"
              onClick={() => setSelectedDepartment(null)}
            >
              Back to Departments
            </Button>
          </div>

          <div className="grid gap-4">
            {departments
              .find((d) => d.id === selectedDepartment)
              ?.doctors.map((doctor) => (
                <Card
                  key={doctor.id}
                  className="cursor-pointer hover:shadow-xl transition-all duration-300 border-none shadow-md"
                  onClick={() =>
                    onSelect(
                      departments.find((d) => d.id === selectedDepartment)
                        ?.name || "",
                      doctor.id
                    )
                  }
                >
                  <CardContent className="p-4 flex items-center">
                    <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4">
                      <img
                        src={doctor.image || "/placeholder.svg"}
                        alt={doctor.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-lg">{doctor.name}</h4>
                      <p className="text-sm text-blue-600">
                        {doctor.specialization}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
