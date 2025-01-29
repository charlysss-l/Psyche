// App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import './App.css';

import Login from './app/Login/login';
import LandingPageGuidance from './app/Home/landingpageguidance';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';


// Lazy load components
const Home = React.lazy(() => import('./app/Home/Home'));
const Calendar = React.lazy(() => import('./app/Calendar/Calendar'));
const Consultation = React.lazy(() => import('./app/Consultation/Consultation'));
const Profile = React.lazy(() => import('./app/Profile/Profile'));
const ArchiveInbox = React.lazy(() => import('./app/Consultation/ArchiveInbox'));
const CreateAccount = React.lazy(() => import('./app/CreateAccount/CreateAccount'));
const OnlineConsult = React.lazy(() => import('./app/Consultation/OnlineConsult/OnlineConsult'));

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPageGuidance />} /> {/* Public route for landing page */}

          {/* Login Page */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes with Navbar and Sidebar */}
          <Route
            path="*"
            element={
              <>
                <div className="main-content">
                  <Navbar />
                  <div className="content">
                    <React.Suspense fallback={<div>Loading...</div>}>
                      <Routes>
                        <Route
                          path="/home"
                          element={
                            <ProtectedRoute>
                              <Home />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/calendar"
                          element={
                            <ProtectedRoute>
                              <Calendar />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/consultation"
                          element={
                            <ProtectedRoute>
                              <Consultation />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/online-consult/:testID"
                          element={
                            <ProtectedRoute>
                              <OnlineConsult />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/profile"
                          element={
                            <ProtectedRoute>
                              <Profile />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/archive"
                          element={
                            <ProtectedRoute>
                              <ArchiveInbox />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/create-account"
                          element={
                            <ProtectedRoute allowedRoles={['main']}>
                              <CreateAccount />
                            </ProtectedRoute>
                          }
                        />
                        <Route path="*" element={<Navigate to="/login" />} />
                      </Routes>
                    </React.Suspense>
                  </div>
                </div>
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
