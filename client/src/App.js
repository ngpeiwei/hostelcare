import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './pages/Auth/SignUp';
import Login from './pages/Auth/Login';
// import Login from './pages/Auth/1 LoginStudent';
// import LoginAdmin from './pages/Auth/2 LoginAdmin';
// import LoginStaff from './pages/Auth/3 LoginStaff';
import StudentDashboard from './pages/Student/StudentDashboard';
import StudentProfile from './pages/Student/StudentProfile';
import AdminDashboard from './pages/Admin/AdminDashboard';
import StaffDashboard from './pages/Maintenance Staff/StaffDashboard';
import TicketDetails from './pages/Admin/3 TicketDetails';
import StaffUpdatePage from './pages/Maintenance Staff/StaffUpdatePage';
import InProgressDetails from './pages/Admin/InProgressDetails';
import StudentTracker from './modules/tracking/components/StudentTracker';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/auth/signUp" element={<SignUp />} />
        <Route path="/auth/login" element={<Login />} />
        {/* <Route path="/auth/loginAdmin" element={<LoginAdmin />} />
        <Route path="/auth/loginStaff" element={<LoginStaff />} /> */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/StudentProfile" element={<StudentProfile />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/admin/ticket/:id" element={<TicketDetails />} />
        <Route path="/admin/inprogress/:id" element={<InProgressDetails />} />
        <Route path="/staff/ticket/:id/update" element={<StaffUpdatePage />} />
        <Route path="/student/complaint/:id/track" element={<StudentTracker />} />
      </Routes>
    </Router>
  );
}

export default App;

