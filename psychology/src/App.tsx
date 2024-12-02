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
import Login from './app/Login/login';
import SurveyDashboard from './app/Survey/surveyDashboard';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import MaybeShowNavSideBar from './components/MaybeShowNavSideBar/MaybeShowNavSideBar';
import PFResultsList from './app/Test/PFTest/PFOnlineList/PFResultsList';
import IQResultsList from './app/Test/IQTest/IQOnlineList/IQResultsList';
import ThemeToggle from "./darkMode/darkMode";
import IQInterpretation from './app/Test/IQTest/IQInterpretationEdit/IQInterpretation';
import OmrIQResultsList from './app/Test/IQTest/IQOmrList/Omr_IQResultList';
import IQResultListBoth from './app/Test/IQTest/IQTestDashboard/IQtestListBoth';
import PFStatistics from './app/Test/PFTest/PFStatistics/PFStatistics';
import IQStatistics from './app/Test/IQTest/IQStatistics/IQStatistics';
import SurveyList from './app/Survey/surveyList';
import SurveyForm from './app/Survey/survey';
import AllOMR from './app/OMR/AllOMR';
import PfOMR from './app/OMR/OMRCamera/PfOMR/PfOMR';
import OmrResult from './app/OMR/OMRCamera/PfOMR/OmrResult';
import AllPfTestList from './app/Test/PFTest/PFTestDashBoard/AllPfTestList';
import PFOmrList from './app/Test/PFTest/PFOmrList/PFOmrList';
import IqOMR from './app/OMR/OMRCamera/IqOMR/IqOMR';
import OMRResult from './app/OMR/OMRCamera/IqOMR/OMRResult';
import SurveyDetails from './app/Survey/surveyDetails';
import SurveyResponse from './app/Survey/surveyResponse';
// Archive List Components
import IQOnlineArchiveList from './app/Test/IQTest/IQOnlineList/IQOnlineArchiveList';

function App() {
  return (
    <Router>
      <div className="App">
      <MaybeShowNavSideBar>
        <Sidebar />
      </MaybeShowNavSideBar>        <div className="main-content">
        <MaybeShowNavSideBar>
        <Navbar />
      </MaybeShowNavSideBar>          <div className="content">
            <Routes>
              {/* Public route for login */}
              <Route path="/" element={<Login />} />

              {/* Protected Routes */}
              <Route
                path="/report"
                element={<ProtectedRoute><Report /></ProtectedRoute>}
              />
              <Route
                path="/test"
                element={<ProtectedRoute><Test /></ProtectedRoute>}
              />
              <Route
                path="/surveyDashboard"
                element={<ProtectedRoute><SurveyDashboard /></ProtectedRoute>}
              />
              
              <Route
                path="/user"
                element={<ProtectedRoute><User /></ProtectedRoute>}
              />
              <Route
                path="/profile"
                element={<ProtectedRoute><Profile /></ProtectedRoute>}
              />
              <Route
                path="/omr"
                element={<ProtectedRoute><OMR /></ProtectedRoute>}
              />
              <Route
                path="/pftest"
                element={<ProtectedRoute><PFTest /></ProtectedRoute>}
              />
              <Route
                path="/iqtest"
                element={<ProtectedRoute><IQTest /></ProtectedRoute>}
              />
              <Route
                path="/pfresults_list"
                element={<ProtectedRoute><PFResultsList /></ProtectedRoute>}
              />

              <Route
                path="/iqinterpretation"
                element={<ProtectedRoute><IQInterpretation /></ProtectedRoute>}
              />

              <Route
                path="/iqresults_list"
                element={<ProtectedRoute><IQResultsList /></ProtectedRoute>}
              />

              <Route
                path="/omriqresults_list"
                element={<ProtectedRoute><OmrIQResultsList /></ProtectedRoute>}
              />

              <Route  
                path="/iqomrresult"
                element={<ProtectedRoute><OMRResult /></ProtectedRoute>}
              />
              
              <Route 
                path="/iqresults_list_both"
                element={<ProtectedRoute><IQResultListBoth /></ProtectedRoute>}
              />
              <Route
                path="/iqomr"
                element={<ProtectedRoute><IqOMR /></ProtectedRoute>}
              />
              <Route 
                path="/pfomrresult"
                element={<ProtectedRoute><OmrResult /></ProtectedRoute>}
              />
              <Route
                path="/pfomr"
                element={<ProtectedRoute><PfOMR /></ProtectedRoute>}
              />
              <Route
                path="/allomr"
                element={<ProtectedRoute><AllOMR /></ProtectedRoute>} 
              />
              <Route
                path="/pf-statistics"
                element={<ProtectedRoute><PFStatistics /></ProtectedRoute>}
              />
              <Route
                path="/iq-statistics"
                element={<ProtectedRoute><IQStatistics /></ProtectedRoute>}
              />
              <Route
                path="/survey-form"
                element={<ProtectedRoute><SurveyForm /></ProtectedRoute>}
              />
              <Route
                path="/all-pf-test-list"
                element={<ProtectedRoute><AllPfTestList /></ProtectedRoute>}
              />
              <Route
                path="/pfomr-list"
                element={<ProtectedRoute><PFOmrList /></ProtectedRoute>}
              />
              <Route
                path="/survey-list"
                element={<ProtectedRoute><SurveyList /></ProtectedRoute>}
              />
              <Route
                path="/survey-details/:id"
                element={<ProtectedRoute><SurveyDetails /></ProtectedRoute>}
              />
               <Route path="/survey-responses/:surveyId" element={<ProtectedRoute><SurveyResponse /></ProtectedRoute>} />

            </Routes>

            {/* Archive List Routes */}
            
            <Routes>
              <Route
                path="/iqonlinearchive"
                element={<ProtectedRoute><IQOnlineArchiveList /></ProtectedRoute>}
              />
            </Routes>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </Router>
  );
}

export default App;
