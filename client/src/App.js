import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/1 LoginStudent';
import LoginAdmin from './pages/Auth/2 LoginAdmin';
import StudentDashboard from './pages/Student/1 Dashboard';
import ViewTicket from './pages/Admin/2 ViewTicket';
import TicketDetails from './pages/Admin/3 TicketDetails';
import ComplaintPage from './modules/complaints/ComplaintPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/LoginAdmin" element={<LoginAdmin />} />
        <Route path="/auth/loginAdmin" element={<LoginAdmin />} />
        <Route path="/complaint" element={<ComplaintPage />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/admin/dashboard" element={<ViewTicket />} />
        <Route path="/admin/ticket/:id" element={<TicketDetails />} />
      </Routes>
    </Router>
  );
}

export default App;

// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
