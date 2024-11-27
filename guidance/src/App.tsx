import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import Home from './app/Home/Home';
import Consultation from './app/Consultation/Consultation';
import Calendar from './app/Calendar/Calendar';
import Profile from './app/Profile/Profile';
import './App.css';
import Login from './app/Login/login';
import ThemeToggle from './darkMode';
import ArchiveInbox from './app/Consultation/ArchiveInbox';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route for Login page without Navbar/ Sidebar */}
          <Route path="/" element={<Login />} />

          {/* Other routes for pages with Sidebar and Navbar */}
          <Route
            path="*"
            element={
              <>
                <Sidebar /> 
                <div className="main-content">
                  <Navbar /> 
                  <div className="content">
                    <Routes>
                      <Route path="/home" element={<Home />} />
                      <Route path="/calendar" element={<Calendar />} />
                      <Route path="/consultation" element={<Consultation />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/archive" element={<ArchiveInbox />} />
                    
                    </Routes>
                  </div>
                </div>
                <ThemeToggle />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
