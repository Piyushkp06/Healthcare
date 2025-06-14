import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

import { HOST } from "../utils/constants";

const navigation = [
  { name: "Dashboard", key: "dashboard", icon: LayoutDashboard },
  { name: "Appointments", key: "appointments", icon: Calendar },
  { name: "Patients", key: "patients", icon: Users },
  { name: "Prescriptions", key: "prescriptions", icon: FileText },
  { name: "Settings", key: "settings", icon: Settings },
];

export default function DoctorSidebar({ setActiveView, activeView, doctor }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${HOST}/api/doctorAuth/logout`,
        {},
        { withCredentials: true }
      );
      navigate("/doctor/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Doctor Info */}
      <div className="px-4 py-6 border-b">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src="/placeholder.svg?height=40&width=40"
              alt="Doctor"
            />
            <AvatarFallback>DR</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">Dr. {doctor?.name || "Loading..."}</p>
            <p className="text-sm text-gray-500">
              {doctor?.specialization || "Specialization..."}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = activeView === item.key;
          return (
            <Button
              key={item.name}
              variant="ghost"
              className={`w-full justify-start gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-blue-100 text-blue-900"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => {
                setActiveView(item.key);
                setOpen(false);
              }}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Button>
          );
        })}
      </div>

      {/* Logout */}
      <div className="px-2 py-4 border-t">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 left-4"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-64 border-r bg-white">
        <SidebarContent />
      </div>
    </>
  );
}
