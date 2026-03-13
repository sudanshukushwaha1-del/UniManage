import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, Users, FileText, Trash2 } from "lucide-react";
import { useState } from "react";

export default function Courses() {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const isTeacher = user?.role === "teacher";

  // Mock courses data
  const [courses, setCourses] = useState([
    {
      id: 1,
      code: "CS101",
      name: "Data Structures",
      semester: "5th",
      students: 45,
      assignments: 8,
      lectures: 24,
      description: "Comprehensive study of data structures including arrays, linked lists, trees, and graphs",
    },
    {
      id: 2,
      code: "CS102",
      name: "Algorithms",
      semester: "5th",
      students: 50,
      assignments: 6,
      lectures: 20,
      description: "Analysis and design of algorithms with focus on complexity and optimization",
    },
    {
      id: 3,
      code: "CS103",
      name: "Databases",
      semester: "5th",
      students: 38,
      assignments: 5,
      lectures: 18,
      description: "Relational databases, SQL, and database design principles",
    },
  ]);

  const handleCreateCourse = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newCourse = {
      id: courses.length + 1,
      code: formData.get("code") as string,
      name: formData.get("name") as string,
      semester: formData.get("semester") as string,
      students: 0,
      assignments: 0,
      lectures: 0,
      description: formData.get("description") as string,
    };
    setCourses([...courses, newCourse]);
    setShowCreateForm(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Courses</h1>
              <p className="text-muted-foreground">
                {isTeacher ? "Manage your courses" : "View your enrolled courses"}
              </p>
            </div>
          </div>
          {isTeacher && (
            <Button onClick={() => setShowCreateForm(!showCreateForm)} className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4" />
              Create Course
            </Button>
          )}
        </div>

        {/* Create Course Form */}
        {isTeacher && showCreateForm && (
          <div className="card-elevated p-6 mb-8 rounded-xl">
            <h3 className="text-lg font-bold mb-4">Create New Course</h3>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Course Code</label>
                  <input
                    type="text"
                    name="code"
                    placeholder="e.g., CS101"
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Course Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g., Data Structures"
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Semester</label>
                  <select
                    name="semester"
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select Semester</option>
                    <option value="1st">1st Semester</option>
                    <option value="2nd">2nd Semester</option>
                    <option value="3rd">3rd Semester</option>
                    <option value="4th">4th Semester</option>
                    <option value="5th">5th Semester</option>
                    <option value="6th">6th Semester</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  placeholder="Enter course description"
                  rows={3}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  Create Course
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="card-elevated p-6 rounded-xl hover:shadow-lg transition-shadow flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground font-semibold">{course.code}</p>
                  <h3 className="text-xl font-bold">{course.name}</h3>
                </div>
                {isTeacher && (
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4 text-muted-foreground hover:text-red-600" />
                  </button>
                )}
              </div>

              <p className="text-muted-foreground text-sm mb-4 flex-1">{course.description}</p>

              <div className="grid grid-cols-3 gap-2 mb-4 py-4 border-y border-border">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{course.students}</p>
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <Users className="w-3 h-3" />
                    Students
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-secondary">{course.assignments}</p>
                  <p className="text-xs text-muted-foreground">Assignments</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent">{course.lectures}</p>
                  <p className="text-xs text-muted-foreground">Lectures</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                  View Course
                </Button>
                {isTeacher && (
                  <Button size="sm" variant="outline" className="flex-1">
                    Edit
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No courses yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
