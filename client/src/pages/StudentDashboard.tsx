import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { BookOpen, FileText, Calendar, BarChart3, Bell, LogOut, User } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { data: courses } = trpc.course.list.useQuery();

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const menuItems = [
    { icon: User, label: "Profile", href: "/student/profile" },
    { icon: BarChart3, label: "Attendance", href: "/student/attendance" },
    { icon: FileText, label: "Assignments", href: "/student/assignments" },
    { icon: BarChart3, label: "Grades", href: "/student/grades" },
    { icon: Calendar, label: "Lectures", href: "/student/lectures" },
    { icon: Bell, label: "Announcements", href: "/student/announcements" },
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
              <h2 className="text-3xl font-bold mb-2">Welcome, {user?.name}!</h2>
              <p className="text-muted-foreground">Track your courses, assignments, and academic progress</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="card-elevated p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Enrolled Courses</p>
                    <p className="text-3xl font-bold">{courses?.length || 0}</p>
                  </div>
                  <BookOpen className="w-10 h-10 text-primary/20" />
                </div>
              </div>
              <div className="card-elevated p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Attendance</p>
                    <p className="text-3xl font-bold">0%</p>
                  </div>
                  <BarChart3 className="w-10 h-10 text-secondary/20" />
                </div>
              </div>
              <div className="card-elevated p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Pending Assignments</p>
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

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Enrolled Courses */}
              <div className="lg:col-span-2 card-elevated p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4">Your Courses</h3>
                <div className="space-y-3">
                  {courses && courses.length > 0 ? (
                    courses.map((course: any) => (
                      <div
                        key={course.id}
                        className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{course.name}</h4>
                            <p className="text-sm text-muted-foreground">{course.code}</p>
                          </div>
                          <span className="badge-primary">Enrolled</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No courses enrolled yet</p>
                  )}
                </div>
              </div>

              {/* Quick Links */}
              <div className="card-gradient p-6 rounded-xl border border-border/50 h-fit">
                <h3 className="text-xl font-bold mb-4">Quick Access</h3>
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    My Assignments
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    My Grades
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    My Schedule
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </Button>
                </div>
              </div>
            </div>

            {/* Announcements */}
            <div className="mt-6 card-elevated p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Recent Announcements</h3>
              <div className="space-y-4">
                <p className="text-muted-foreground text-center py-8">No announcements yet</p>
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
