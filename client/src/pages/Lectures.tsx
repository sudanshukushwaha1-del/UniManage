import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Plus, Users } from "lucide-react";
import { useState } from "react";

export default function Lectures() {
  const { user } = useAuth();
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const isTeacher = user?.role === "teacher";

  // Mock lectures data
  const mockLectures = [
    {
      id: 1,
      title: "Introduction to Data Structures",
      course: "Data Structures",
      date: "2024-03-15",
      time: "10:00 AM",
      duration: "1 hour",
      room: "Room 101",
      instructor: "Dr. Smith",
      students: 45,
      description: "Overview of arrays, linked lists, and basic operations",
    },
    {
      id: 2,
      title: "Binary Trees and Traversal",
      course: "Data Structures",
      date: "2024-03-17",
      time: "2:00 PM",
      duration: "1.5 hours",
      room: "Room 102",
      instructor: "Dr. Smith",
      students: 45,
      description: "In-depth study of binary tree structures and traversal methods",
    },
    {
      id: 3,
      title: "Sorting Algorithms",
      course: "Algorithms",
      date: "2024-03-18",
      time: "11:00 AM",
      duration: "1 hour",
      room: "Room 201",
      instructor: "Prof. Johnson",
      students: 50,
      description: "Comparison of sorting algorithms: bubble, merge, quick sort",
    },
    {
      id: 4,
      title: "Graph Theory Basics",
      course: "Algorithms",
      date: "2024-03-20",
      time: "3:00 PM",
      duration: "1.5 hours",
      room: "Room 202",
      instructor: "Prof. Johnson",
      students: 50,
      description: "Introduction to graphs, vertices, edges, and basic algorithms",
    },
  ];

  const isUpcoming = (date: string) => {
    return new Date(date) > new Date();
  };

  const daysUntil = (date: string) => {
    const lectureDate = new Date(date);
    const today = new Date();
    const diff = Math.ceil((lectureDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Lecture Schedule</h1>
              <p className="text-muted-foreground">
                {isTeacher ? "Manage your lecture schedule" : "View your upcoming lectures"}
              </p>
            </div>
          </div>
          {isTeacher && (
            <Button onClick={() => setShowScheduleForm(!showScheduleForm)} className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4" />
              Schedule Lecture
            </Button>
          )}
        </div>

        {/* Schedule Form */}
        {isTeacher && showScheduleForm && (
          <div className="card-elevated p-6 mb-8 rounded-xl">
            <h3 className="text-lg font-bold mb-4">Schedule New Lecture</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Lecture Title</label>
                  <input
                    type="text"
                    placeholder="Enter lecture title"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Course</label>
                  <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>Select Course</option>
                    <option>Data Structures</option>
                    <option>Algorithms</option>
                    <option>Databases</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Time</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g., 1 hour"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Room/Location</label>
                  <input
                    type="text"
                    placeholder="e.g., Room 101"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <input
                    type="text"
                    placeholder="Brief description"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  Schedule Lecture
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowScheduleForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Lectures List */}
        <div className="space-y-4">
          {mockLectures.map((lecture) => (
            <div
              key={lecture.id}
              className={`card-elevated p-6 rounded-xl hover:shadow-lg transition-all ${
                isUpcoming(lecture.date) ? "border-l-4 border-l-primary" : "opacity-75"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">{lecture.title}</h3>
                      <p className="text-sm text-muted-foreground">{lecture.course}</p>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4">{lecture.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{new Date(lecture.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{lecture.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{lecture.room}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{lecture.students} students</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 md:items-end">
                  {isUpcoming(lecture.date) && (
                    <div className="px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                      In {daysUntil(lecture.date)} days
                    </div>
                  )}
                  <div className="flex gap-2">
                    {isTeacher ? (
                      <>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm" className="gap-1 bg-primary hover:bg-primary/90">
                          <Users className="w-4 h-4" />
                          Attendance
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" variant="outline">
                        Add to Calendar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {mockLectures.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No lectures scheduled</p>
          </div>
        )}
      </div>
    </div>
  );
}
