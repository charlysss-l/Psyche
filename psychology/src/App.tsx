import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';  
import Report from './app/Report/Report';
import Test from './app/Test/Test';
import User from './app/User/User';
import Profile from './app/Profile/Profile';  
import OMR from './app/OMR/OMR'; 

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar /> {/* Sidebar */}
        <div className="main-content">
          <Navbar /> {/* Navbar */}
          <Routes>
            <Route path="/" element={<Report />} />
            <Route path="/test" element={<Test />} />
            <Route path="/user" element={<User />} />
            <Route path="/profile" element={<Profile />} /> 
            <Route path="/omr" element={<OMR />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
