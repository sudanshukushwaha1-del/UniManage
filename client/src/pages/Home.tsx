import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { BookOpen, Users, BarChart3, Calendar, FileText, Bell } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Redirect to appropriate dashboard if already logged in
  if (user) {
    if (user.role === "teacher") {
      setLocation("/teacher/dashboard");
    } else {
      setLocation("/student/dashboard");
    }
    return null;
  }

  const features = [
    {
      icon: BookOpen,
      title: "Course Management",
      description: "Teachers can create and manage courses with ease",
    },
    {
      icon: Users,
      title: "Student Enrollment",
      description: "Manage student enrollments and track progress",
    },
    {
      icon: BarChart3,
      title: "Attendance Tracking",
      description: "Mark attendance and view detailed analytics",
    },
    {
      icon: Calendar,
      title: "Lecture Scheduling",
      description: "Schedule lectures and manage timetables",
    },
    {
      icon: FileText,
      title: "Assignment Management",
      description: "Create assignments and track submissions",
    },
    {
      icon: Bell,
      title: "Announcements",
      description: "Post announcements and notices to students",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gradient">UniManage</h1>
          </div>
          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Manage Your <span className="text-gradient">University</span> Efficiently
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              A modern, elegant platform for teachers and students to collaborate, track attendance, manage assignments, and stay connected with announcements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => (window.location.href = getLoginUrl())}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg"
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                className="px-8 py-3 text-lg border-border hover:bg-muted"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="hidden md:flex justify-center animate-slide-in-right">
            <div className="relative w-full max-w-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />
              <div className="relative bg-card rounded-3xl border border-border p-8 shadow-xl">
                <div className="space-y-4">
                  <div className="h-12 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg" />
                  <div className="h-8 bg-muted rounded-lg w-3/4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-5/6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card border-y border-border py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage your university operations efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="card-elevated p-6 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4 group-hover:from-primary/20 group-hover:to-secondary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl border border-border p-12 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to get started?</h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of educators and students using UniManage to streamline their academic operations.
          </p>
          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg"
          >
            Sign In Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container text-center text-muted-foreground">
          <p>&copy; 2024 UniManage. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
