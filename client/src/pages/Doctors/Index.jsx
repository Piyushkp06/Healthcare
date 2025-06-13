import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { User } from "lucide-react";

const doctors = [
  {
    name: "Chayan",
    specialty: "Cardiologist",
    img: "/placeholder.svg",
  },
  {
    name: "Piyushkanta",
    specialty: "Neurologist",
    img: "/placeholder.svg",
  },
  {
    name: "Kunal",
    specialty: "Orthopedic Surgeon",
    img: "/placeholder.svg",
  },
  {
    name: "Dr. Emily Davis",
    specialty: "Pediatrician",
    img: "/placeholder.svg",
  },
  {
    name: "Dr. Alex Lee",
    specialty: "Dermatologist",
    img: "/placeholder.svg",
  },
  {
    name: "Dr. Jessica Chen",
    specialty: "Oncologist",
    img: "/placeholder.svg",
  },
  {
    name: "Dr. David Kim",
    specialty: "Gastroenterologist",
    img: "/placeholder.svg",
  },
  {
    name: "Dr. Sophia Rodriguez",
    specialty: "Endocrinologist",
    img: "/placeholder.svg",
  },
];

const AllDoctorsPage = () => {
  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
        Our Expert Doctors
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {doctors.map((doctor, index) => (
          <Card
            key={index}
            className="doctor-card border-none shadow-lg transition-all duration-300"
          >
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="mb-4 rounded-full overflow-hidden w-24 h-24 bg-gray-100 flex items-center justify-center">
                {doctor.img === "/placeholder.svg" ? (
                  <User className="h-16 w-16 text-gray-400" />
                ) : (
                  <img
                    src={doctor.img}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <h3 className="text-xl font-bold mb-1">{doctor.name}</h3>
              <p className="text-blue-600 text-sm mb-4">{doctor.specialty}</p>
              <Button variant="outline" asChild>
                <Link
                  to={`/frontdesk?doctorName=${encodeURIComponent(
                    doctor.name
                  )}&specialty=${encodeURIComponent(doctor.specialty)}`}
                >
                  Book Appointment
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AllDoctorsPage;
