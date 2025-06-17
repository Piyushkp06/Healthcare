import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import Navbar from "../../components/navbar";
import VoiceRegistrationHome from "../../components/voice-registration-home";
import {
  Clock,
  Calendar,
  Award,
  Heart,
  Brain,
  Bone,
  Eye,
  Stethoscope,
  Baby,
  ArrowRight,
  CheckCircle2,
  Phone,
  User,
} from "lucide-react";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-60 hero-pattern overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
              <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
                24/7 Healthcare Support
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Your Health Is Our Top Priority
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Experience seamless healthcare with our voice-enabled patient
                registration system. Speak your symptoms, get matched with
                specialists, and receive personalized care.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-base">
                  <Link to="/frontdesk">Register Now</Link>
                </Button>
                <Button size="lg" variant="outline" className="text-base">
                  <Link to="/doctors">Find Doctors</Link>
                </Button>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-6">
                <div className="stats-item text-center">
                  <p className="text-3xl font-bold text-blue-600">24/7</p>
                  <p className="text-sm text-gray-500">Support</p>
                </div>
                <div className="stats-item text-center">
                  <p className="text-3xl font-bold text-blue-600">100+</p>
                  <p className="text-sm text-gray-500">Specialists</p>
                </div>
                <div className="stats-item text-center">
                  <p className="text-3xl font-bold text-blue-600">50k+</p>
                  <p className="text-sm text-gray-500">Happy Patients</p>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 relative">
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">
                  Voice Registration
                </h2>
                <VoiceRegistrationHome />
              </div>

              <div className="absolute -z-10 -top-10 -right-10 w-64 h-64 bg-blue-100 rounded-full opacity-50 blur-3xl"></div>
              <div className="absolute -z-10 -bottom-10 -left-10 w-64 h-64 bg-cyan-100 rounded-full opacity-50 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
              Our Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose MediCare+
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our hospital management system offers cutting-edge features
              designed to provide the best healthcare experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="feature-card border-none shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Quick Registration</h3>
                <p className="text-gray-600 mb-4">
                  Register in seconds using our voice-enabled system or
                  traditional form methods.
                </p>
                <Link
                  to="/frontdesk"
                  className="text-blue-600 font-medium flex items-center"
                >
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            <Card className="feature-card border-none shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Smart Scheduling</h3>
                <p className="text-gray-600 mb-4">
                  Get matched with the right specialist based on your symptoms
                  and preferences.
                </p>
                <Link
                  to="/services"
                  className="text-blue-600 font-medium flex items-center"
                >
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            <Card className="feature-card border-none shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Expert Care</h3>
                <p className="text-gray-600 mb-4">
                  Access to top specialists and personalized treatment plans for
                  your health needs.
                </p>
                <Link
                  to="/doctors"
                  className="text-blue-600 font-medium flex items-center"
                >
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section id="departments" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
              Our Departments
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Specialized Healthcare Departments
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our hospital features specialized departments with expert doctors
              to provide comprehensive care.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Cardiology",
                icon: Heart,
                desc: "Heart and cardiovascular system",
              },
              {
                name: "Neurology",
                icon: Brain,
                desc: "Brain and nervous system",
              },
              {
                name: "Orthopedics",
                icon: Bone,
                desc: "Bones, joints, and muscles",
              },
              { name: "Ophthalmology", icon: Eye, desc: "Eye care and vision" },
              {
                name: "General Medicine",
                icon: Stethoscope,
                desc: "General health and wellness",
              },
              { name: "Pediatrics", icon: Baby, desc: "Child healthcare" },
            ].map((dept, index) => (
              <Card
                key={index}
                className="department-card border-none shadow-lg transition-all duration-300"
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <dept.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{dept.name}</h3>
                  <p className="text-gray-600 mb-4">{dept.desc}</p>
                  <Button variant="outline">
                    <Link to="/frontdesk">Book Appointment</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section id="doctors" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
              Our Specialists
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Meet Our Expert Doctors
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our team of highly qualified medical professionals is dedicated to
              providing exceptional care.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Dr. John Smith",
                specialty: "Cardiologist",
                img: "/placeholder.svg",
              },
              {
                name: "Dr. Sarah Johnson",
                specialty: "Neurologist",
                img: "/placeholder.svg",
              },
              {
                name: "Dr. Michael Brown",
                specialty: "Orthopedic Surgeon",
                img: "/placeholder.svg",
              },
              {
                name: "Dr. Emily Davis",
                specialty: "Pediatrician",
                img: "/placeholder.svg",
              },
            ].map((doctor, index) => (
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
                  <p className="text-blue-600 text-sm mb-4">
                    {doctor.specialty}
                  </p>
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

          <div className="text-center mt-12">
            <Button>
              <Link to="/doctors">View All Doctors</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 gradient-bg text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-white text-blue-700 hover:bg-white">
              Testimonials
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Patients Say
            </h2>
            <p className="text-lg max-w-2xl mx-auto opacity-90">
              Hear from patients who have experienced our innovative healthcare
              system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Chayan Mondal",
                text: "The voice registration system made my visit so much easier. I was quickly matched with the right specialist for my condition.",
              },
              {
                name: "Piyushkanta Panda",
                text: "I was impressed by how accurately the system understood my symptoms. The doctor was prepared with all my information before I arrived.",
              },
              {
                name: "Kunal Kushwaha ",
                text: "As someone with mobility issues, being able to register by voice and get a prescription quickly was a game-changer for me.",
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className="testimonial-card bg-white/10 backdrop-blur-sm border-none"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4 text-yellow-300">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mb-6 italic">"{testimonial.text}"</p>
                  <p className="font-medium">{testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-blue-50 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-2/3 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Experience Modern Healthcare?
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Register now using our voice-enabled system and get matched with
                the right specialist for your needs.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2" />
                  <span>Quick Registration</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2" />
                  <span>Expert Doctors</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2" />
                  <span>Digital Prescriptions</span>
                </div>
              </div>
            </div>
            <div>
              <Button size="lg" className="text-base px-8">
                <Link to="/frontdesk">Register Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section (Placeholder) */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About Us</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We are dedicated to providing the best healthcare services with a
            focus on patient well-being and advanced technology.
          </p>
        </div>
      </section>

      {/* Contact Section (Placeholder) */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Have questions? Reach out to us through the following channels.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <div className="flex items-center gap-3">
              <Phone className="h-6 w-6 text-blue-600" />
              <span className="text-gray-700">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-3">
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
                className="lucide lucide-mail h-6 w-6 text-blue-600"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span className="text-gray-700">info@medicareplus.com</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                MediCare+
              </h3>
              <p className="text-gray-400 mb-6">
                Advanced healthcare with voice-enabled patient registration and
                expert medical care.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Services
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white">
                    Doctors
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Departments</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white">
                    Cardiology
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white">
                    Neurology
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white">
                    Orthopedics
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white">
                    Ophthalmology
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white">
                    Pediatrics
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-gray-400">
                    NIT ROURKELA, Rourkela, 769008
                  </span>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-blue-400" />
                  <span className="text-gray-400">+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-gray-400">
                    contact@medicare-plus.com
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <p className="text-center text-gray-400">
              © {new Date().getFullYear()} MediCare+. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
