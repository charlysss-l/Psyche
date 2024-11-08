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
import PFTest from './app/Test/PFTest/PFTest';
import IQTest from './app/Test/IQTest/IQTest';
import PFResult from './app/Result/PFResult/PFResult';
import IQResult from './app/Result/IQResult/IQResult';
import './App.css';
import Login from './app/Login/login';
import SignupForm from './app/Signup/Signup';

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
              <Route path="/pftest" element={<PFTest />} />
              <Route path="/iqtest" element={<IQTest />} />
              <Route path="/pf-results" element={<PFResult />} />
              <Route path="/iq-results" element={<IQResult />} />
              <Route path="/login" element={<Login/>}/>
              <Route path="/signup" element={<SignupForm/>}/>

            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;