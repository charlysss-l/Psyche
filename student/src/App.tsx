import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Home from "./app/Home/Home";
import Test from "./app/Test/Test";
import Result from "./app/Result/Result";
import Consultation from "./app/Consultation/Consultation";
import StudentDashboard from "./app/Survey/surveyList";
import Profile from "./app/Profile/Profile";
import OMR from "./app/OMR/OMR";
import PFTest from "./app/Test/PFTest/PFTest";
import IQTest from "./app/Test/IQTest/IQTest";
import IQTestUserForm from "./app/Test/IQTest/IQTestUserForm";
import PFResult from "./app/Result/PFResult/PFResult";
import IQResult from "./app/Result/IQResult/IQResult";
import "./App.css";
import Login from "./app/Login/login";
import SignupForm from "./app/Signup/Signup";
import LandingPage from './app/Home/LandingPage';
import ThemeToggle from "./darkMode";
import OMRCamera from "./app/OMR/OMRCamera/OMRCamera";
import OMRResult from "./app/OMR/OMRCamera/OMRResult";
import IQResultList from "./app/Result/IQResult/IQResultList";
import OmrIQResultsList from "./app/Result/IQResult/OmrIQResultList";
import IQResultListBoth from "./app/Result/IQResult/IQResultListBoth";
import PFBothList from "./app/Result/PFResult/PFBothList/PFBothList";
import PFOMRList from "./app/Result/PFResult/PFOMRList/PFOMRList";
import PFOnlineList from "./app/Result/PFResult/PFOnlineList/PFOnlineList";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Landing Page Route */}
          <Route path="/" element={<LandingPage />} />

          {/* Route for Login and Signup Pages without Navbar/Sidebar */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignupForm />} />

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
                      <Route path="/test" element={<Test />} />
                      <Route path="/result" element={<Result />} />
                      <Route path="/consultation" element={<Consultation />} />
                      <Route path="/surveyDashboard" element={<StudentDashboard />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/omr" element={<OMR />} />
                      <Route path="/pftest" element={<PFTest />} />
                      <Route path="/iqtestuserform" element={<IQTestUserForm />} />
                      <Route path="/iqtest" element={<IQTest />} />
                      <Route path="/pf-results" element={<PFResult />} />
                      <Route path="/iq-results" element={<IQResult />} />
                      <Route path="/omrcamera" element={<OMRCamera />} />
                      <Route path="/omrresult" element={<OMRResult />} />
                      <Route path="/iqresultlist" element={<IQResultList />} />
                      <Route path="/omriqresultlist" element={<OmrIQResultsList />} />
                      <Route path="/iqresultlistboth" element={<IQResultListBoth />} />
                      <Route path="/pfbothlist" element={<PFBothList />} />
                      <Route path="/pfomrlist" element={<PFOMRList />} />
                      <Route path="/pfonlinelist" element={<PFOnlineList />} />
                    </Routes>
                  </div>
                </div>
                <ThemeToggle /> {/* Add the ThemeToggle component here */}

              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
