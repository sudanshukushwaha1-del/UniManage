import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { BarChart3, Download, Filter, Search, CheckCircle2, XCircle, Calendar } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function Attendance() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const { data: courses } = trpc.course.list.useQuery();
  const { data: attendance } = trpc.attendance.list.useQuery({
    courseId: selectedCourse ? parseInt(selectedCourse) : undefined,
  });

  const isTeacher = user?.role === "teacher";

  // Mock attendance data for demo
  const mockAttendanceData = [
    { id: 1, studentName: "John Doe", studentId: "STU001", course: "Data Structures", present: 18, total: 20, percentage: 90 },
    { id: 2, studentName: "Jane Smith", studentId: "STU002", course: "Data Structures", present: 19, total: 20, percentage: 95 },
    { id: 3, studentName: "Mike Johnson", studentId: "STU003", course: "Data Structures", present: 15, total: 20, percentage: 75 },
    { id: 4, studentName: "Sarah Williams", studentId: "STU004", course: "Algorithms", present: 20, total: 20, percentage: 100 },
  ];

  const filteredAttendance = mockAttendanceData.filter((record) =>
    record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 85) return "text-green-600";
    if (percentage >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const getAttendanceBg = (percentage: number) => {
    if (percentage >= 85) return "bg-green-50";
    if (percentage >= 75) return "bg-yellow-50";
    return "bg-red-50";
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Attendance Management</h1>
          </div>
          <p className="text-muted-foreground">
            {isTeacher ? "Mark and manage student attendance" : "View your attendance records"}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card-elevated p-6">
            <p className="text-sm text-muted-foreground mb-2">Total Classes</p>
            <p className="text-3xl font-bold">20</p>
          </div>
          <div className="card-elevated p-6">
            <p className="text-sm text-muted-foreground mb-2">Classes Attended</p>
            <p className="text-3xl font-bold">18</p>
          </div>
          <div className="card-elevated p-6">
            <p className="text-sm text-muted-foreground mb-2">Attendance Rate</p>
            <p className="text-3xl font-bold text-green-600">90%</p>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="card-elevated p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
            <div className="flex-1 flex gap-4 w-full md:w-auto">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <select
                value={selectedCourse || ""}
                onChange={(e) => setSelectedCourse(e.target.value || null)}
                className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Courses</option>
                {courses?.map((course: any) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Student Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Student ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Course</th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Present</th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Total</th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Percentage</th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.map((record) => (
                  <tr key={record.id} className={`border-b border-border hover:bg-muted/50 transition-colors ${getAttendanceBg(record.percentage)}`}>
                    <td className="py-3 px-4 font-medium">{record.studentName}</td>
                    <td className="py-3 px-4 text-muted-foreground">{record.studentId}</td>
                    <td className="py-3 px-4 text-muted-foreground">{record.course}</td>
                    <td className="py-3 px-4 text-center">{record.present}</td>
                    <td className="py-3 px-4 text-center">{record.total}</td>
                    <td className={`py-3 px-4 text-center font-semibold ${getAttendanceColor(record.percentage)}`}>
                      {record.percentage}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      {record.percentage >= 75 ? (
                        <span className="inline-flex items-center gap-1 text-green-600">
                          <CheckCircle2 className="w-4 h-4" />
                          Good
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-600">
                          <XCircle className="w-4 h-4" />
                          Low
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAttendance.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No attendance records found
            </div>
          )}
        </div>

        {/* Attendance Chart */}
        {isTeacher && (
          <div className="card-elevated p-6">
            <h3 className="text-lg font-bold mb-4">Mark Today's Attendance</h3>
            <div className="space-y-3">
              {mockAttendanceData.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium">{student.studentName}</p>
                    <p className="text-sm text-muted-foreground">{student.studentId}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Present
                    </Button>
                    <Button size="sm" variant="outline">
                      Absent
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
