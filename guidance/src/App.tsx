import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import Home from './app/Home/Home';
import Consultation from './app/Consultation/Consultation';
import Calendar from './app/Calendar/Calendar';
import Profile from './app/Profile/Profile';
import './App.css';
import Login from './app/Login/login';
import ThemeToggle from './darkMode/darkMode';
import ArchiveInbox from './app/Consultation/ArchiveInbox';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import CreateAccount from './app/CreateAccount/CreateAccount';
import OnlineConsult from './app/Consultation/OnlineConsult/OnlineConsult';

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
                      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                      <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
                      <Route path="/consultation" element={<ProtectedRoute><Consultation /></ProtectedRoute>} />
                      <Route path="/online-consult/:testID" element={<ProtectedRoute><OnlineConsult /></ProtectedRoute>} />
                      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                      <Route path="/archive" element={<ProtectedRoute><ArchiveInbox /></ProtectedRoute>} />
                      <Route path="/create-account"
                              element={
                                <ProtectedRoute allowedRoles={['main']}>
                                  <CreateAccount />
                                </ProtectedRoute>
                              }
                            />
                      <Route path="*" element={<Navigate to="/" />} />

                    </Routes>
                  </div>
                </div>
              </>
            }
          />
        </Routes>
        <ThemeToggle />

      </div>
    </Router>
  );
}

export default App;
