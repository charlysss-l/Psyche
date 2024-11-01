import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import Report from './app/Report/Report';
import Test from './app/Test/Test';
import User from './app/User/User';
import Profile from './app/Profile/Profile';
import OMR from './app/OMR/OMR';
import PFTest from './app/Test/PFTest/PFTest';
import IQTest from './app/Test/IQTest/IQTest';

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
              <Route path="/" element={<Report />} />
              <Route path="/test" element={<Test />} />
              <Route path="/user" element={<User />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/omr" element={<OMR />} />
              <Route path="/pftest" element={<PFTest/>} />
              <Route path="/iqtest" element={<IQTest/>} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
