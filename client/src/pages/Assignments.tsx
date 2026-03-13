import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Clock, CheckCircle2, AlertCircle, Download } from "lucide-react";
import { useState } from "react";

export default function Assignments() {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const isTeacher = user?.role === "teacher";

  // Mock assignments data
  const mockAssignments = [
    {
      id: 1,
      title: "Data Structures Implementation",
      course: "Data Structures",
      dueDate: "2024-03-20",
      status: "active",
      submissions: 15,
      totalStudents: 20,
      description: "Implement linked list and binary tree operations",
    },
    {
      id: 2,
      title: "Algorithm Analysis",
      course: "Algorithms",
      dueDate: "2024-03-15",
      status: "completed",
      submissions: 20,
      totalStudents: 20,
      description: "Analyze time and space complexity of sorting algorithms",
    },
    {
      id: 3,
      title: "Database Design Project",
      course: "Databases",
      dueDate: "2024-03-25",
      status: "active",
      submissions: 8,
      totalStudents: 20,
      description: "Design a relational database for an e-commerce system",
    },
  ];

  const getStatusColor = (status: string) => {
    if (status === "completed") return "bg-green-50 text-green-700";
    if (status === "active") return "bg-blue-50 text-blue-700";
    return "bg-gray-50 text-gray-700";
  };

  const getStatusIcon = (status: string) => {
    if (status === "completed") return <CheckCircle2 className="w-4 h-4" />;
    if (status === "active") return <Clock className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  const daysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Assignments</h1>
              <p className="text-muted-foreground">
                {isTeacher ? "Create and manage assignments" : "View and submit assignments"}
              </p>
            </div>
          </div>
          {isTeacher && (
            <Button onClick={() => setShowCreateForm(!showCreateForm)} className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4" />
              Create Assignment
            </Button>
          )}
        </div>

        {/* Create Assignment Form */}
        {isTeacher && showCreateForm && (
          <div className="card-elevated p-6 mb-8 rounded-xl">
            <h3 className="text-lg font-bold mb-4">Create New Assignment</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Assignment Title</label>
                  <input
                    type="text"
                    placeholder="Enter assignment title"
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
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  placeholder="Enter assignment description"
                  rows={4}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Due Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Max Score</label>
                  <input
                    type="number"
                    placeholder="100"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  Create Assignment
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Assignments List */}
        <div className="space-y-4">
          {mockAssignments.map((assignment) => (
            <div key={assignment.id} className="card-elevated p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <FileText className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">{assignment.title}</h3>
                      <p className="text-sm text-muted-foreground">{assignment.course}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-3">{assignment.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                      {daysUntilDue(assignment.dueDate) > 0 && (
                        <span className="text-yellow-600">({daysUntilDue(assignment.dueDate)} days left)</span>
                      )}
                    </div>
                    {isTeacher && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {assignment.submissions}/{assignment.totalStudents} submitted
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 md:items-end">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(assignment.status)}`}>
                    {getStatusIcon(assignment.status)}
                    {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                  </div>
                  <div className="flex gap-2">
                    {isTeacher ? (
                      <>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm" className="gap-1 bg-primary hover:bg-primary/90">
                          <Download className="w-4 h-4" />
                          Submissions
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                        {assignment.status === "active" && (
                          <Button size="sm" className="bg-primary hover:bg-primary/90">
                            Submit
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {mockAssignments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No assignments yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
