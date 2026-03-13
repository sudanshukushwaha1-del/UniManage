import { useAuth } from "@/_core/hooks/useAuth";
import { User, Mail, Phone, MapPin, Calendar, BookOpen, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StudentProfile() {
  const { user } = useAuth();

  // Mock student data
  const studentData = {
    id: "STU001",
    name: user?.name || "John Doe",
    email: user?.email || "john.doe@university.edu",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, City, State 12345",
    enrollmentDate: "2023-09-01",
    semester: "5th Semester",
    gpa: "3.75",
    courses: 4,
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (user?.name || "john"),
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <User className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">View and manage your student profile</p>
          </div>
        </div>

        {/* Student ID Card */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border-2 border-primary p-8 shadow-lg">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Photo */}
              <div className="flex-shrink-0">
                <img
                  src={studentData.photo}
                  alt={studentData.name}
                  className="w-32 h-32 rounded-xl border-4 border-primary shadow-md"
                />
              </div>

              {/* Card Details */}
              <div className="flex-1 text-center md:text-left">
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground font-semibold">STUDENT ID</p>
                  <p className="text-2xl font-bold text-primary">{studentData.id}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground font-semibold">NAME</p>
                  <p className="text-xl font-bold">{studentData.name}</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground font-semibold">SEMESTER</p>
                    <p className="font-bold">{studentData.semester}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground font-semibold">GPA</p>
                    <p className="font-bold text-green-600">{studentData.gpa}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground font-semibold">ENROLLMENT</p>
                    <p className="font-bold">{new Date(studentData.enrollmentDate).getFullYear()}</p>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <div className="flex-shrink-0">
                <Button className="gap-2 bg-primary hover:bg-primary/90">
                  <Download className="w-4 h-4" />
                  Download ID
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Contact Information */}
          <div className="card-elevated p-6 rounded-xl">
            <h3 className="text-lg font-bold mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{studentData.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{studentData.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{studentData.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="card-elevated p-6 rounded-xl">
            <h3 className="text-lg font-bold mb-4">Academic Information</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Enrollment Date</p>
                  <p className="font-medium">{new Date(studentData.enrollmentDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Current Semester</p>
                  <p className="font-medium">{studentData.semester}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 text-primary mt-1 flex-shrink-0 flex items-center justify-center">
                  <span className="text-lg font-bold">📊</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current GPA</p>
                  <p className="font-medium text-green-600">{studentData.gpa}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card-elevated p-6 text-center rounded-xl">
            <p className="text-3xl font-bold text-primary mb-2">{studentData.courses}</p>
            <p className="text-sm text-muted-foreground">Enrolled Courses</p>
          </div>
          <div className="card-elevated p-6 text-center rounded-xl">
            <p className="text-3xl font-bold text-green-600 mb-2">90%</p>
            <p className="text-sm text-muted-foreground">Attendance</p>
          </div>
          <div className="card-elevated p-6 text-center rounded-xl">
            <p className="text-3xl font-bold text-blue-600 mb-2">15</p>
            <p className="text-sm text-muted-foreground">Assignments Done</p>
          </div>
          <div className="card-elevated p-6 text-center rounded-xl">
            <p className="text-3xl font-bold text-purple-600 mb-2">3</p>
            <p className="text-sm text-muted-foreground">Pending Tasks</p>
          </div>
        </div>

        {/* Edit Profile Button */}
        <div className="flex gap-2">
          <Button className="bg-primary hover:bg-primary/90">Edit Profile</Button>
          <Button variant="outline">Change Password</Button>
        </div>
      </div>
    </div>
  );
}
