import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/1 LoginStudent';
import LoginAdmin from './pages/Auth/2 LoginAdmin';
import LoginStaff from './pages/Auth/3 LoginStaff';
import StudentDashboard from './pages/Student/StudentDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import StaffDashboard from './pages/Maintenance Staff/StaffDashboard';
// import ViewTicket from './pages/Admin/2 ViewTicket';
import TicketDetails from './pages/Admin/3 TicketDetails';
import StaffUpdatePage from './pages/Maintenance Staff/StaffUpdatePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/loginAdmin" element={<LoginAdmin />} />
        <Route path="/auth/loginStaff" element={<LoginStaff />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/admin/ticket/:id" element={<TicketDetails />} />
        <Route path="/staff/ticket/:id/update" element={<StaffUpdatePage />} />
      </Routes>
    </Router>
  );
}

export default App;

