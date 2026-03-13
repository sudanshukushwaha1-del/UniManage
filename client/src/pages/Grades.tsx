import { BarChart3, TrendingUp } from "lucide-react";

export default function Grades() {
  const mockGrades = [
    { id: 1, assignment: "Assignment 1", course: "Data Structures", score: 85, maxScore: 100, percentage: 85, submittedDate: "2024-03-05" },
    { id: 2, assignment: "Assignment 2", course: "Data Structures", score: 92, maxScore: 100, percentage: 92, submittedDate: "2024-03-08" },
    { id: 3, assignment: "Quiz 1", course: "Algorithms", score: 78, maxScore: 100, percentage: 78, submittedDate: "2024-03-06" },
    { id: 4, assignment: "Midterm Exam", course: "Databases", score: 88, maxScore: 100, percentage: 88, submittedDate: "2024-03-10" },
  ];

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600 bg-green-50";
    if (percentage >= 80) return "text-blue-600 bg-blue-50";
    if (percentage >= 70) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getGradeLabel = (percentage: number) => {
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  const averageGrade = Math.round(mockGrades.reduce((sum, g) => sum + g.percentage, 0) / mockGrades.length);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <BarChart3 className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">My Grades</h1>
            <p className="text-muted-foreground">View your assignment and exam grades</p>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card-elevated p-6">
            <p className="text-sm text-muted-foreground mb-2">Average Grade</p>
            <div className="flex items-end gap-2">
              <p className={`text-4xl font-bold ${getGradeColor(averageGrade).split(" ")[0]}`}>
                {getGradeLabel(averageGrade)}
              </p>
              <p className="text-2xl text-muted-foreground mb-1">{averageGrade}%</p>
            </div>
          </div>
          <div className="card-elevated p-6">
            <p className="text-sm text-muted-foreground mb-2">Total Assessments</p>
            <p className="text-3xl font-bold">{mockGrades.length}</p>
          </div>
          <div className="card-elevated p-6">
            <p className="text-sm text-muted-foreground mb-2">Highest Score</p>
            <p className="text-3xl font-bold text-green-600">
              {Math.max(...mockGrades.map((g) => g.percentage))}%
            </p>
          </div>
        </div>

        {/* Grades Table */}
        <div className="card-elevated p-6 rounded-xl">
          <h3 className="text-lg font-bold mb-4">Grade Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Assessment</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Course</th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Score</th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Percentage</th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Grade</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {mockGrades.map((grade) => (
                  <tr key={grade.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 font-medium">{grade.assignment}</td>
                    <td className="py-3 px-4 text-muted-foreground">{grade.course}</td>
                    <td className="py-3 px-4 text-center">
                      {grade.score}/{grade.maxScore}
                    </td>
                    <td className={`py-3 px-4 text-center font-semibold ${getGradeColor(grade.percentage).split(" ")[0]}`}>
                      {grade.percentage}%
                    </td>
                    <td className={`py-3 px-4 text-center font-bold text-lg ${getGradeColor(grade.percentage)}`}>
                      {getGradeLabel(grade.percentage)}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-sm">
                      {new Date(grade.submittedDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="mt-8 card-elevated p-6 rounded-xl">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Performance Trend
          </h3>
          <div className="space-y-3">
            {mockGrades.map((grade) => (
              <div key={grade.id} className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{grade.assignment}</span>
                    <span className={`font-bold ${getGradeColor(grade.percentage).split(" ")[0]}`}>
                      {grade.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        grade.percentage >= 90
                          ? "bg-green-500"
                          : grade.percentage >= 80
                          ? "bg-blue-500"
                          : grade.percentage >= 70
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${grade.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
