import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import Home from './app/Home/Home';
import Test from './app/Test/Test';
import Result from './app/Result/Result';
import Consultation from './app/Consultation/Consultation';
import Profile from './app/Profile/Profile';  
import OMR from './app/OMR/OMR'; 
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
              <Route path="/test" element={<Test />} />
              <Route path="/result" element={<Result />} />
              <Route path="/consultation" element={<Consultation />} />
              <Route path="/profile" element={<Profile />} /> 
              <Route path="/omr" element={<OMR />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;