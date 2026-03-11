import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { BookOpen, Users, BarChart3, Calendar, FileText, Bell, LogOut } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { data: courses } = trpc.course.list.useQuery();

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const menuItems = [
    { icon: BookOpen, label: "Courses", href: "/teacher/courses" },
    { icon: Users, label: "Attendance", href: "/teacher/attendance" },
    { icon: FileText, label: "Assignments", href: "/teacher/assignments" },
    { icon: Calendar, label: "Lectures", href: "/teacher/lectures" },
    { icon: Bell, label: "Announcements", href: "/teacher/announcements" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gradient">UniManage</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.name}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 bg-card border-r border-border flex-col">
          <nav className="flex-1 p-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </a>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h2>
              <p className="text-muted-foreground">Manage your courses, attendance, and students</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="card-elevated p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Courses</p>
                    <p className="text-3xl font-bold">{courses?.length || 0}</p>
                  </div>
                  <BookOpen className="w-10 h-10 text-primary/20" />
                </div>
              </div>
              <div className="card-elevated p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Students</p>
                    <p className="text-3xl font-bold">0</p>
                  </div>
                  <Users className="w-10 h-10 text-secondary/20" />
                </div>
              </div>
              <div className="card-elevated p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Pending Submissions</p>
                    <p className="text-3xl font-bold">0</p>
                  </div>
                  <FileText className="w-10 h-10 text-accent/20" />
                </div>
              </div>
              <div className="card-elevated p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Upcoming Lectures</p>
                    <p className="text-3xl font-bold">0</p>
                  </div>
                  <Calendar className="w-10 h-10 text-primary/20" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-gradient p-8 rounded-xl border border-border/50">
                <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Create New Course
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Create Assignment
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Lecture
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Bell className="w-4 h-4 mr-2" />
                    Post Announcement
                  </Button>
                </div>
              </div>

              <div className="card-gradient p-8 rounded-xl border border-border/50">
                <h3 className="text-xl font-bold mb-4">Recent Activities</h3>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">No recent activities</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex overflow-x-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                className="flex-1 flex flex-col items-center gap-1 px-4 py-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
