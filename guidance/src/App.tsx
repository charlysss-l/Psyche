import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import Home from './app/Home/Home';
import Consultation from './app/Consultation/Consultation';
import Calendar from './app/Calendar/Calendar';
import Profile from './app/Profile/Profile';
import Login from './app/Login/login';  // Adjusted to match path
import Signup from './app/Signup/Signup';  // Fixed the import here


import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar /> 
        <div className="main-content">
          <Navbar /> 
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/consultation" element={<Consultation />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} /> {/* Updated path to lowercase */}
              <Route path="/signup" element={<Signup />} />  {/* Fixed the path here */}

            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
