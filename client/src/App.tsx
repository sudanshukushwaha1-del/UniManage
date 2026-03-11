import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAuth } from "./_core/hooks/useAuth";
import { Loader2 } from "lucide-react";

// Pages
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Courses from "./pages/Courses";
import Attendance from "./pages/Attendance";
import Assignments from "./pages/Assignments";
import Grades from "./pages/Grades";
import Lectures from "./pages/Lectures";
import Announcements from "./pages/Announcements";
import StudentProfile from "./pages/StudentProfile";

function ProtectedRoute({ component: Component, requiredRole }: { component: any; requiredRole?: string }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Home />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <NotFound />;
  }

  return <Component />;
}

function Router() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Switch>
      <Route path={"/"} component={Home} />
      
      {/* Teacher Routes */}
      <Route path={"/teacher/dashboard"}>
        {() => <ProtectedRoute component={TeacherDashboard} requiredRole="teacher" />}
      </Route>
      <Route path={"/teacher/courses"}>
        {() => <ProtectedRoute component={Courses} requiredRole="teacher" />}
      </Route>
      <Route path={"/teacher/attendance"}>
        {() => <ProtectedRoute component={Attendance} requiredRole="teacher" />}
      </Route>
      <Route path={"/teacher/assignments"}>
        {() => <ProtectedRoute component={Assignments} requiredRole="teacher" />}
      </Route>
      <Route path={"/teacher/lectures"}>
        {() => <ProtectedRoute component={Lectures} requiredRole="teacher" />}
      </Route>
      <Route path={"/teacher/announcements"}>
        {() => <ProtectedRoute component={Announcements} requiredRole="teacher" />}
      </Route>

      {/* Student Routes */}
      <Route path={"/student/dashboard"}>
        {() => <ProtectedRoute component={StudentDashboard} requiredRole="student" />}
      </Route>
      <Route path={"/student/profile"}>
        {() => <ProtectedRoute component={StudentProfile} requiredRole="student" />}
      </Route>
      <Route path={"/student/attendance"}>
        {() => <ProtectedRoute component={Attendance} requiredRole="student" />}
      </Route>
      <Route path={"/student/assignments"}>
        {() => <ProtectedRoute component={Assignments} requiredRole="student" />}
      </Route>
      <Route path={"/student/grades"}>
        {() => <ProtectedRoute component={Grades} requiredRole="student" />}
      </Route>
      <Route path={"/student/lectures"}>
        {() => <ProtectedRoute component={Lectures} requiredRole="student" />}
      </Route>
      <Route path={"/student/announcements"}>
        {() => <ProtectedRoute component={Announcements} requiredRole="student" />}
      </Route>

      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
