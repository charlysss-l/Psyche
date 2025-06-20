import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./app/Home/Home";
import Test from "./app/Test/Test";
import Result from "./app/Result/Result";
import Consultation from "./app/Consultation/Consultation";
import OnlineConsult from "./app/Consultation/OnlineConsult/OnlineConsult";
import StudentDashboard from "./app/Survey/surveyList";
import Profile from "./app/Profile/Profile";
import OMR from "./app/OMR/OMR";
import PFTest from "./app/Test/PFTest/PFTest";
import IQTest from "./app/Test/IQTest/IQTest";
import CFTest from "./app/Test/CFTest/CFTest";
import IQTestUserForm from "./app/Test/IQTest/IQTestUserForm";
import CFTestUserForm from "./app/Test/CFTest/CFTestUserForm";
import PFResult from "./app/Result/PFResult/PFResult";
import IQResult from "./app/Result/IQResult/IQResult";
import CFResult from "./app/Result/CFResult/CFResult";
import "./App.css";
import Login from "./app/Login/login";
import SignupForm from "./app/Signup/Signup";
import LandingPage from './app/Home/LandingPage';
import OMRCamera from "./app/OMR/OMRCamera/PfOMR/PfOMR";
import OMRResult from "./app/OMR/OMRCamera/IqOMR/OMRResult";
import IQResultList from "./app/Result/IQResult/IQOnlineList/IQResultList";
import OmrIQResultsList from "./app/Result/IQResult/IQOMRList/OmrIQResultList";
import IQResultListBoth from "./app/Result/IQResult/IQBothList/IQResultListBoth";
import CFResultListBoth from "./app/Result/CFResult/CFBothList/CFResultListBoth";
import OmrCFResultsList from "./app/Result/CFResult/CFOMRList/OmrCFResultList";
import OmrCFResult from "./app/OMR/OMRCamera/CfOMR/OmrCFResult";
import CFResultList from "./app/Result/CFResult/CFOnlineList/CFResultList";
import PFBothList from "./app/Result/PFResult/PFBothList/PFBothList";
import PFOMRList from "./app/Result/PFResult/PFOMRList/PFOMRList";
import PFOnlineList from "./app/Result/PFResult/PFOnlineList/PFOnlineList";
import AllOMR from "./app/OMR/AllOMR";
import IqOMR from "./app/OMR/OMRCamera/IqOMR/IqOMR";
import PfOMR from "./app/OMR/OMRCamera/PfOMR/PfOMR";
import CfOMR from "./app/OMR/OMRCamera/CfOMR/CfOMR";
import OmrResult from "./app/OMR/OMRCamera/PfOMR/OmrResult";
import SurveyDetails from "./app/Survey/surveryDetails/surveyDetails";
import ArchiveInbox from "./app/Consultation/ArchiveInbox";
import IntroPF from "./app/Test/PFTest/IntroPF/IntroPF";
import IntroIQ from "./app/Test/IQTest/IntroIQ/IntroIQ";
import IntroCF from "./app/Test/CFTest/IntroCF/IntroCF";
import ForgotPassword from "./app/Login/forgotPassword/forgotPassword";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import SurveyIntro from "./app/Survey/surveyIntro/surveyIntro";


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Landing Page Route */}
          <Route path="/" element={<LandingPage />} 
          />

          {/* Route for Login and Signup Pages without Navbar/Sidebar */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignupForm />} />

          {/* Other routes for pages with Sidebar and Navbar */}
          <Route
            path="*"
            element={
              <>
                <div className="main-content">
                  <Navbar />

                  
                  <div className="content">
                    <Routes>
                      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                      <Route path="/test" element={<ProtectedRoute><Test /></ProtectedRoute>} />
                      <Route path="/result" element={<ProtectedRoute><Result /></ProtectedRoute>} />
                      <Route path="/consultation" element={<ProtectedRoute><Consultation /></ProtectedRoute>} />
                      <Route path="/online-consult/:testID"element={<ProtectedRoute><OnlineConsult /></ProtectedRoute>} />
                      <Route path="/archive" element={<ProtectedRoute><ArchiveInbox /></ProtectedRoute>} />
                      <Route path="/surveyIntro" element={<ProtectedRoute><SurveyIntro /></ProtectedRoute>} />
                      <Route path="/surveyDashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
                      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                      <Route path="/omr" element={<ProtectedRoute><OMR /></ProtectedRoute>} />
                      <Route path="/pftest" element={<ProtectedRoute><PFTest /></ProtectedRoute>} />
                      <Route path="/iqtestuserform" element={<ProtectedRoute><IQTestUserForm /></ProtectedRoute>} />
                      <Route path="/cftestuserform" element={<ProtectedRoute><CFTestUserForm /></ProtectedRoute>} />
                      <Route path="/iqtest" element={<ProtectedRoute><IQTest /></ProtectedRoute>} />
                      <Route path="/cftest" element={<ProtectedRoute><CFTest /></ProtectedRoute>} />
                      <Route path="/pf-results" element={<ProtectedRoute><PFResult /></ProtectedRoute>} />
                      <Route path="/iq-results" element={<ProtectedRoute><IQResult /></ProtectedRoute>} />
                      <Route path="/cf-results" element={<ProtectedRoute><CFResult /></ProtectedRoute>} />
                      <Route path="/omrcamera" element={<ProtectedRoute><OMRCamera /></ProtectedRoute>} />
                      <Route path="/iqresultlist" element={<ProtectedRoute><IQResultList /></ProtectedRoute>} />
                      <Route path="/omriqresultlist" element={<ProtectedRoute><OmrIQResultsList /></ProtectedRoute>} />
                      <Route path="/iqresultlistboth" element={<ProtectedRoute><IQResultListBoth /></ProtectedRoute>} />
                      <Route path="/cfresultlist" element={<ProtectedRoute><CFResultList /></ProtectedRoute>} />
                      <Route path="/omrcfresultlist" element={<ProtectedRoute><OmrCFResultsList /></ProtectedRoute>} />
                      <Route path="/cfresultlistboth" element={<ProtectedRoute><CFResultListBoth /></ProtectedRoute>} />
                      <Route path="/pfbothlist" element={<ProtectedRoute><PFBothList /></ProtectedRoute>} />
                      <Route path="/pfomrlist" element={<ProtectedRoute><PFOMRList /></ProtectedRoute>} />
                      <Route path="/pfonlinelist" element={<ProtectedRoute><PFOnlineList /></ProtectedRoute>} />
                      <Route path="/intro-pf" element={<ProtectedRoute><IntroPF /></ProtectedRoute>} />
                      <Route path="/intro-iq" element={<ProtectedRoute><IntroIQ /></ProtectedRoute>} />
                      <Route path="/intro-cf" element={<ProtectedRoute><IntroCF /></ProtectedRoute>} />
                      <Route path="/allomr" element={<ProtectedRoute><AllOMR /></ProtectedRoute>} />
                      <Route path="/iqomr" element={<ProtectedRoute><IqOMR /></ProtectedRoute>} />
                      <Route path="/iqomrresult" element={<ProtectedRoute><OMRResult /></ProtectedRoute>} />
                      <Route path="/pfomr" element={<ProtectedRoute><PfOMR /></ProtectedRoute>} />
                      <Route path="/pfomrresult" element={<ProtectedRoute><OmrResult /></ProtectedRoute>} />
                      <Route path="/cfomr" element={<ProtectedRoute><CfOMR /></ProtectedRoute>} />
                      <Route path="/cfomrresult" element={<ProtectedRoute><OmrCFResult /></ProtectedRoute>} />
                      <Route path="/survey-details/:surveyId" element={<ProtectedRoute><SurveyDetails /></ProtectedRoute>} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
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
