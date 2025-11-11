import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/1 LoginStudent';
import LoginAdmin from './pages/Auth/2 LoginAdmin';
import StudentDashboard from './pages/Student/StudentDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
// import ViewTicket from './pages/Admin/2 ViewTicket';
import TicketDetails from './pages/Admin/3 TicketDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/loginAdmin" element={<LoginAdmin />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/ticket/:id" element={<TicketDetails />} />
      </Routes>
    </Router>
  );
}

export default App;

