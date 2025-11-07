import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import Navbar from './components/Navbar';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Student/Dashboard';
import ComplaintPage from './modules/complaints/ComplaintPage';
//import ComplaintPage from './modules/complaints/ComplaintPage';
//import AssignmentPage from './modules/assignments/AssignmentPage';
//import TrackingPage from './modules/tracking/TrackingPage';
//import FeedbackPage from './modules/feedback/FeedbackPage';

function App() {
  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/complaint" element={<ComplaintPage />} />
        <Route path="/student/dashboard" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
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
