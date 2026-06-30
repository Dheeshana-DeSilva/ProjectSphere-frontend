import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import AlertContainer from './components/AlertContainer.jsx';
import Footer from './components/Footer.jsx';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import RoleRedirect from './components/RoleRedirect.jsx';
import { AlertProvider } from './context/AlertContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import NotFound from './pages/NotFound.jsx';
import PlaceholderPage from './pages/PlaceholderPage.jsx';
import Projects from './pages/recruiter/Projects.jsx';
import ProjectDetails from './pages/recruiter/ProjectDetails.jsx';
import StudentProfile from './pages/recruiter/StudentProfile.jsx';
import SavedProjects from './pages/recruiter/SavedProjects.jsx';
import FollowedStudents from './pages/recruiter/FollowedStudents.jsx';
import Register from './pages/Register.jsx';
import MyProjects from './components/projects/MyProjects.jsx'
import CreateProject from './components/projects/CreateProject.jsx'
import EditProject from './components/projects/EditProject.jsx'

function App() {
  return (
    <AlertProvider>
      <AuthProvider>
        <Router>
          <div className="app-shell">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                {/* ── Public / Recruiter routes ── */}
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetails />} />
                <Route path="/students/:id" element={<StudentProfile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                  path="/dashboard"
                  element={(
                    <ProtectedRoute>
                      <RoleRedirect />
                    </ProtectedRoute>
                  )}
                />
                <Route
                  path="/dashboard/student"
                  element={(
                    <ProtectedRoute allowedRoles={['student']}>
                      <Dashboard role="student" />
                    </ProtectedRoute>
                  )}
                />
                <Route
                  path="/dashboard/lecturer"
                  element={(
                    <ProtectedRoute allowedRoles={['lecturer', 'admin']}>
                      <Dashboard role="lecturer" />
                    </ProtectedRoute>
                  )}
                />
                <Route
                  path="/dashboard/recruiter"
                  element={(
                    <ProtectedRoute allowedRoles={['recruiter']}>
                      <Dashboard role="recruiter" />
                    </ProtectedRoute>
                  )}
                />

                <Route
                  path="/student/projects"
                  element={(
                    <ProtectedRoute allowedRoles={["student"]}>
                      <MyProjects />
                    </ProtectedRoute>
                  )}
                />
                <Route
                  path="/student/projects/create"
                  element={(
                    <ProtectedRoute allowedRoles={["student"]}>
                      <CreateProject />
                    </ProtectedRoute>
                  )}
                />
                <Route
                  path="/projects/:id/edit"
                  element={(
                    <ProtectedRoute allowedRoles={["student"]}>
                      <EditProject />
                    </ProtectedRoute>
                  )}
                />
                <Route
                  path="/lecturer/approvals"
                  element={(
                    <ProtectedRoute allowedRoles={['lecturer', 'admin']}>
                      <PlaceholderPage title="Pending approvals" role="Lecturer" />
                    </ProtectedRoute>
                  )}
                />
                <Route
                  path="/recruiter/saved"
                  element={(
                    <ProtectedRoute allowedRoles={['recruiter']}>
                      <SavedProjects />
                    </ProtectedRoute>
                  )}
                />
                <Route
                  path="/recruiter/followed"
                  element={(
                    <ProtectedRoute allowedRoles={['recruiter']}>
                      <FollowedStudents />
                    </ProtectedRoute>
                  )}
                />

                <Route path="/student/dashboard" element={<Navigate to="/dashboard/student" replace />} />
                <Route path="/lecturer/dashboard" element={<Navigate to="/dashboard/lecturer" replace />} />
                <Route path="/recruiter/dashboard" element={<Navigate to="/dashboard/recruiter" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <AlertContainer />
        </Router>
      </AuthProvider>
    </AlertProvider>
  );
}

export default App;
