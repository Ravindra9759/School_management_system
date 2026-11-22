import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AdminDashboard from './Deashboard/Admin/App.jsx'
import CollegeAdminDashboard from './Deashboard/CollegeAdmin/App.jsx'
import StudentDashboard from './Deashboard/Student/App.jsx'
import TeacherDashboard from './Deashboard/Teacher/App.jsx'
import EmployeeDashboard from './Deashboard/Employee/App.jsx'
import ForgotPasswordPage from './auth/ForgotPasswordPage.jsx'
import LoginPage from './auth/LoginPage.jsx'
import RegisterPage from './auth/RegisterPage.jsx'
import SignupPage from './auth/SignupPage.jsx'
import './Auth.css'

function isCollegeAdmin(session) {
  const roles = [
    session?.roleName,
    ...(Array.isArray(session?.authorities) ? session.authorities : []),
  ]
    .filter(Boolean)
    .map((role) => String(role).replace(/^ROLE_/i, '').toUpperCase())
  return roles.some((role) => ['SCHOOL', 'COLLAGE', 'COLLEGE', 'UNIVERSITY'].includes(role))
}

function getDashboardType(session) {
  const roles = [
    session?.roleName,
    ...(Array.isArray(session?.authorities) ? session.authorities : []),
  ]
    .filter(Boolean)
    .map((role) => String(role).replace(/^ROLE_/i, '').toUpperCase())

  if (roles.includes('STUDENT')) return 'student'
  if (roles.includes('TEACHER')) return 'teacher'
  if (roles.includes('TEMPUSER')) return 'employee'
  if (isCollegeAdmin(session)) return 'college'
  return 'company'
}

function App() {
  const [session, setSession] = useState(null)
  const dashboardType = getDashboardType(session)
  const dashboardPaths = {
    student: '/student-dashboard',
    teacher: '/teacher-dashboard',
    employee: '/employee-dashboard',
    college: '/college-dashboard',
    company: '/dashboard',
  }
  const dashboardPath = session ? dashboardPaths[dashboardType] : '/login'
  const logout = () => setSession(null)
  const displayName = session?.name || session?.username || session?.email || 'Account'

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/login"
          element={session
            ? <Navigate to={dashboardPath} replace />
            : <LoginPage onLogin={setSession} />}
        />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/dashboard"
          element={session && dashboardType === 'company'
            ? <AdminDashboard onLogout={logout} token={session.token} />
            : <Navigate to="/login" replace />}
        />
        <Route
          path="/college-dashboard"
          element={session && dashboardType === 'college'
            ? <CollegeAdminDashboard user={session} onLogout={logout} />
            : <Navigate to={session ? dashboardPath : '/login'} replace />}
        />
        <Route
          path="/student-dashboard"
          element={session && dashboardType === 'student'
            ? <StudentDashboard email={displayName} onLogout={logout} />
            : <Navigate to={session ? dashboardPath : '/login'} replace />}
        />
        <Route
          path="/teacher-dashboard"
          element={session && dashboardType === 'teacher'
            ? <TeacherDashboard email={displayName} onLogout={logout} />
            : <Navigate to={session ? dashboardPath : '/login'} replace />}
        />
        <Route
          path="/employee-dashboard"
          element={session && dashboardType === 'employee'
            ? <EmployeeDashboard user={session} onLogout={logout} />
            : <Navigate to={session ? dashboardPath : '/login'} replace />}
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
