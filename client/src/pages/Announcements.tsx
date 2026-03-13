import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Bell, Plus, Send, MessageSquare, Clock } from "lucide-react";
import { useState } from "react";

export default function Announcements() {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "Midterm Exam Schedule",
      content: "Midterm exams will be held from March 25 to April 5. Please check the schedule on the portal.",
      author: "Dr. Smith",
      date: "2024-03-10",
      course: "Data Structures",
      priority: "high",
    },
    {
      id: 2,
      title: "Assignment 2 Extended",
      content: "Due to popular request, the deadline for Assignment 2 has been extended to March 22.",
      author: "Prof. Johnson",
      date: "2024-03-09",
      course: "Algorithms",
      priority: "medium",
    },
    {
      id: 3,
      title: "Lab Session Cancelled",
      content: "Lab session on March 15 has been cancelled. It will be rescheduled for March 18.",
      author: "Dr. Williams",
      date: "2024-03-08",
      course: "Databases",
      priority: "high",
    },
    {
      id: 4,
      title: "New Course Materials Available",
      content: "Chapter 5 lecture notes and practice problems are now available in the course portal.",
      author: "Dr. Smith",
      date: "2024-03-07",
      course: "Data Structures",
      priority: "low",
    },
  ]);

  const isTeacher = user?.role === "teacher";

  const getPriorityColor = (priority: string) => {
    if (priority === "high") return "bg-red-50 border-l-4 border-l-red-500";
    if (priority === "medium") return "bg-yellow-50 border-l-4 border-l-yellow-500";
    return "bg-blue-50 border-l-4 border-l-blue-500";
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === "high") return "bg-red-100 text-red-800";
    if (priority === "medium") return "bg-yellow-100 text-yellow-800";
    return "bg-blue-100 text-blue-800";
  };

  const handleCreateAnnouncement = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newAnnouncement = {
      id: announcements.length + 1,
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      author: user?.name || "Unknown",
      date: new Date().toISOString().split("T")[0],
      course: formData.get("course") as string,
      priority: formData.get("priority") as string,
    };
    setAnnouncements([newAnnouncement, ...announcements]);
    setShowCreateForm(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Announcements</h1>
              <p className="text-muted-foreground">
                {isTeacher ? "Post announcements to your students" : "Stay updated with latest announcements"}
              </p>
            </div>
          </div>
          {isTeacher && (
            <Button onClick={() => setShowCreateForm(!showCreateForm)} className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4" />
              Post Announcement
            </Button>
          )}
        </div>

        {/* Create Announcement Form */}
        {isTeacher && showCreateForm && (
          <div className="card-elevated p-6 mb-8 rounded-xl">
            <h3 className="text-lg font-bold mb-4">Create New Announcement</h3>
            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter announcement title"
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Course</label>
                <select
                  name="course"
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Course</option>
                  <option value="Data Structures">Data Structures</option>
                  <option value="Algorithms">Algorithms</option>
                  <option value="Databases">Databases</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  name="content"
                  placeholder="Enter your announcement message"
                  rows={5}
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <select
                  name="priority"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="gap-2 bg-primary hover:bg-primary/90">
                  <Send className="w-4 h-4" />
                  Post Announcement
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Announcements List */}
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div key={announcement.id} className={`card-elevated p-6 rounded-xl hover:shadow-lg transition-shadow ${getPriorityColor(announcement.priority)}`}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <Bell className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">{announcement.title}</h3>
                      <p className="text-sm text-muted-foreground">{announcement.course}</p>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityBadge(announcement.priority)}`}>
                  {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}
                </span>
              </div>

              <p className="text-foreground mb-4 leading-relaxed">{announcement.content}</p>

              <div className="flex flex-wrap items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span>By {announcement.author}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(announcement.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="gap-1">
                  <MessageSquare className="w-4 h-4" />
                  Reply
                </Button>
              </div>
            </div>
          ))}
        </div>

        {announcements.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No announcements yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
