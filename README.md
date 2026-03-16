# 🎓 UniManage - College Attendance Management System

A modern, elegant web application for managing college operations with role-based access for teachers and students. Built with React, Node.js, and MySQL, featuring real-time attendance tracking, assignment management, lecture scheduling, and comprehensive analytics.

**🚀 [Live Demo](https://unimanage-ytzpwhru.manus.space)**

---

## ✨ Features

### 🏫 **Core Features**

#### For Teachers
- **📊 Attendance Management** - Mark attendance, view analytics, export reports
- **📝 Assignment Management** - Create, edit, and manage assignments with deadline tracking
- **📅 Lecture Scheduling** - Schedule lectures with date, time, and location details
- **👥 Student Management** - View student profiles, search and filter students
- **📢 Announcements** - Post notices with priority levels (high, medium, low)
- **📈 Grade Tracking** - Assign and track student grades and marks
- **📊 Analytics Dashboard** - View attendance rates, assignment submission stats, and more

#### For Students
- **👤 Profile Management** - Digital student ID card with personal information
- **📊 Attendance Tracking** - View attendance records and percentage analytics
- **📅 Lecture Timetable** - View scheduled lectures in calendar format
- **📝 Assignment Submission** - View assignments and submit work
- **📈 Grade Viewing** - Track grades, GPA, and academic performance
- **📢 Announcements** - Stay updated with course announcements
- **📱 Responsive Dashboard** - Quick access to all important information

### 🔐 **Security & Access Control**
- **Role-Based Access Control (RBAC)** - Separate dashboards and permissions for teachers and students
- **Secure Authentication** - OAuth-based login with session management
- **Protected API Procedures** - Type-safe backend with tRPC and role verification
- **Data Privacy** - Students can only access their own data; teachers cannot modify student accounts

### 🎨 **Design & UX**
- **Modern, Elegant UI** - Clean design with vibrant colors and smooth gradients
- **Mobile-First Responsive** - Fully responsive on phones, tablets, and desktops
- **Smooth Animations** - Polished transitions and micro-interactions
- **Intuitive Navigation** - Sidebar on desktop, optimized mobile menu
- **Card-Based Layout** - Organized information in easy-to-scan cards

---

## 🛠️ **Tech Stack**

### Frontend
- **React 19** - Modern UI library with hooks
- **Tailwind CSS 4** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript
- **tRPC** - End-to-end type-safe APIs
- **Wouter** - Lightweight routing
- **Lucide React** - Beautiful icon library
- **Framer Motion** - Animation library

### Backend
- **Node.js** - JavaScript runtime
- **Express 4** - Web framework
- **tRPC 11** - Type-safe RPC framework
- **TypeScript** - Type-safe backend code
- **Drizzle ORM** - Type-safe database toolkit

### Database
- **MySQL** - Relational database
- **Drizzle ORM** - Modern ORM with type safety
- **Database Schema** - Comprehensive schema for users, courses, attendance, assignments, grades, lectures, and announcements

### Authentication
- **Manus OAuth** - Secure OAuth-based authentication
- **JWT** - Session token management
- **Role-Based Access** - Teacher and Student roles

---

## 📦 **Installation & Setup**

### Prerequisites
- Node.js 18+ and pnpm
- MySQL 8.0+
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/sudanshukushwaha1-del/UniManage.git
   cd UniManage
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with:
   ```
   DATABASE_URL=mysql://user:password@localhost:3306/university_db
   JWT_SECRET=your_jwt_secret_key
   VITE_APP_ID=your_oauth_app_id
   OAUTH_SERVER_URL=https://api.manus.im
   VITE_OAUTH_PORTAL_URL=https://portal.manus.im
   ```

4. **Run database migrations**
   ```bash
   pnpm drizzle-kit generate
   pnpm drizzle-kit migrate
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

   The app will be available at `http://localhost:3000`

---

## 📁 **Project Structure**

```
university-management-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components (Dashboard, Attendance, etc.)
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utilities and libraries
│   │   ├── App.tsx        # Main app component with routing
│   │   ├── main.tsx       # Entry point
│   │   └── index.css      # Global styles
│   └── public/            # Static assets
│
├── server/                # Node.js backend
│   ├── db.ts             # Database query helpers
│   ├── routers.ts        # tRPC procedures and API routes
│   ├── auth.logout.test.ts # Test example
│   └── _core/            # Core framework files
│
├── drizzle/              # Database schema and migrations
│   ├── schema.ts         # Drizzle schema definition
│   └── migrations/       # SQL migration files
│
├── shared/               # Shared types and constants
│
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
└── README.md             # This file
```

---

## 🚀 **Building & Deployment**

### Build for Production
```bash
pnpm build
```

This creates optimized bundles in the `dist/` directory.

### Start Production Server
```bash
pnpm start
```

### Deploy to Manus
The app is configured to deploy to Manus hosting:
```bash
# Via Management UI or CLI
manus deploy
```

---

## 📊 **Database Schema**

### Key Tables
- **users** - User accounts with role (teacher/student)
- **courses** - Course information and metadata
- **enrollments** - Student course enrollments
- **attendance** - Attendance records with date and status
- **assignments** - Assignment details and deadlines
- **submissions** - Student assignment submissions
- **grades** - Assignment and exam grades
- **lectures** - Lecture schedules and details
- **announcements** - Course announcements and notices

---

## 🔄 **API Routes**

All API routes are under `/api/trpc` using tRPC procedures:

### Authentication
- `auth.me` - Get current user
- `auth.logout` - Logout user

### Courses
- `course.list` - List all courses
- `course.create` - Create new course (teacher only)
- `course.update` - Update course (teacher only)
- `course.delete` - Delete course (teacher only)

### Attendance
- `attendance.mark` - Mark attendance (teacher only)
- `attendance.list` - List attendance records
- `attendance.getStats` - Get attendance statistics

### Assignments
- `assignment.create` - Create assignment (teacher only)
- `assignment.list` - List assignments
- `assignment.submit` - Submit assignment (student)
- `assignment.grade` - Grade assignment (teacher only)

### Grades
- `grade.list` - List grades
- `grade.getStats` - Get grade statistics

### Announcements
- `announcement.create` - Create announcement (teacher only)
- `announcement.list` - List announcements

---

## 🧪 **Testing**

Run tests with Vitest:
```bash
pnpm test
```

Example test file: `server/auth.logout.test.ts`

---

## 🎨 **Design System**

### Color Palette
- **Primary**: Vibrant Blue (#0066FF)
- **Secondary**: Purple (#7C3AED)
- **Accent**: Coral (#FF6B6B)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)

### Typography
- **Headings**: Bold, large sizes for hierarchy
- **Body**: Clean, readable sans-serif
- **Monospace**: For code and technical content

### Spacing & Radius
- Consistent 4px grid system
- 8px, 12px, 16px, 24px, 32px spacing
- 8px border radius for cards, 12px for larger elements

---

## 📝 **Usage Examples**

### Login as Teacher
1. Click "Login" on the home page
2. Authenticate with Manus OAuth
3. System automatically routes to Teacher Dashboard
4. Access attendance, assignments, lectures, and student management

### Login as Student
1. Click "Login" on the home page
2. Authenticate with Manus OAuth
3. System automatically routes to Student Dashboard
4. View courses, attendance, assignments, grades, and announcements

### Mark Attendance (Teacher)
1. Go to Attendance page
2. Select course and date
3. Click "Present" or "Absent" for each student
4. Submit to save attendance records

### Submit Assignment (Student)
1. Go to Assignments page
2. Click on an active assignment
3. Click "Submit"
4. Upload file and submit
5. View submission status and feedback from teacher

---

## 🔒 **Security Considerations**

- All API procedures are protected with role-based access control
- Sensitive operations require authentication
- Database queries use parameterized statements to prevent SQL injection
- CORS is configured for secure cross-origin requests
- Session tokens are secure and HTTP-only

---

## 🐛 **Known Limitations**

- Mock data is used in some pages; connect to real database for production
- Email notifications are not yet implemented
- File upload for assignments is not yet fully integrated
- Real-time updates use polling; consider WebSocket for live features

---

## 🚧 **Future Enhancements**

- [ ] Email notifications for deadlines and announcements
- [ ] File upload system with S3 integration
- [ ] Real-time notifications with WebSockets
- [ ] Advanced analytics and reporting
- [ ] Mobile app (React Native)
- [ ] Video lecture integration
- [ ] Discussion forums
- [ ] Parent/Guardian portal
- [ ] Advanced search and filtering
- [ ] Batch operations for attendance

---

## 📄 **License**

This project is open source and available under the MIT License.

---

## 👨‍💻 **Contributing**

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📧 **Support**

For support, email support@unimanage.com or open an issue on GitHub.

---

## 🙏 **Acknowledgments**

- Built with React, Node.js, and modern web technologies
- Designed with accessibility and user experience in mind
- Inspired by real-world university management needs

---

**Made with ❤️ for educational institutions**

**Live Demo: https://unimanage-ytzpwhru.manus.space**
