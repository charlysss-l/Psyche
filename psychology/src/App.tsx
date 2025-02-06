import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import Report from './app/Report/Report';
import Test from './app/Test/Test';
import User from './app/User/User';
import Profile from './app/Profile/Profile';
import OMR from './app/OMR/OMR';
import PFTest from './app/Test/PFTest/PFTest';
import IQTest from './app/Test/IQTest/IQTest';
import CFTest from './app/Test/CFTest/CFTest';
import './App.css';
import Login from './app/Login/login';
import SurveyDashboard from './app/Survey/surveyDashboard/surveyDashboard';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import MaybeShowNavSideBar from './components/MaybeShowNavSideBar/MaybeShowNavSideBar';
import PFResultsList from './app/Test/PFTest/PFOnlineList/PFResultsList';
import IQResultsList from './app/Test/IQTest/IQOnlineList/IQResultsList';
import CFResultsList from './app/Test/CFTest/CFOnlineList/CFResultsList';

import IQInterpretation from './app/Test/IQTest/IQInterpretationEdit/IQInterpretation';
import CFInterpretation from './app/Test/CFTest/CFInterpretationEdit/CFInterpretation';

import OmrIQResultsList from './app/Test/IQTest/IQOmrList/Omr_IQResultList';
import OmrCFResultsList from './app/Test/CFTest/CFOmrList/Omr_CFResultList';

import IQResultListBoth from './app/Test/IQTest/IQTestDashboard/IQtestListBoth';
import CFResultListBoth from './app/Test/CFTest/CFTestDashboard/CFtestListBoth';

import PFStatistics from './app/Test/PFTest/PFStatistics/PFStatistics';
import IQStatistics from './app/Test/IQTest/IQStatistics/IQStatistics';
import CFStatistics from './app/Test/CFTest/CFStatistics/CFStatistics';

import SurveyList from './app/Survey/surveyList/surveyList';
import SurveyForm from './app/Survey/survey/survey';
import AllOMR from './app/OMR/AllOMR';
import PfOMR from './app/OMR/OMRCamera/PfOMR/PfOMR';
import OmrResult from './app/OMR/OMRCamera/PfOMR/OmrResult';
import AllPfTestList from './app/Test/PFTest/PFTestDashBoard/AllPfTestList';
import PFOmrList from './app/Test/PFTest/PFOmrList/PFOmrList';
import IqOMR from './app/OMR/OMRCamera/IqOMR/IqOMR';
import OMRResult from './app/OMR/OMRCamera/IqOMR/OMRResult';
import CfOMR from "./app/OMR/OMRCamera/CfOMR/CfOMR";
import OmrCFResult from "./app/OMR/OMRCamera/CfOMR/OmrCFResult";
import SurveyDetails from './app/Survey/surveyDetails/surveyDetails';
import SurveyResponse from './app/Survey/surveyResponse/surveyResponse';
import ContentEditor from './app/Content/editContent';
// Archive List Components
import IQOnlineArchiveList from './app/Test/IQTest/IQOnlineList/IQOnlineArchiveList';
import CFOnlineArchiveList from './app/Test/CFTest/CFOnlineList/CFOnlineArchiveList';

function App() {
  return (
    <Router>
      <div className="App">
      {/*<MaybeShowNavSideBar>
        <Sidebar />
      </MaybeShowNavSideBar>   */}     <div className="main-content">
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
                path="/cftest"
                element={<ProtectedRoute><CFTest /></ProtectedRoute>}
              />
              
              <Route
                path="/contentEditor"
                element={<ProtectedRoute><ContentEditor /></ProtectedRoute>}
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
                path="/cfinterpretation"
                element={<ProtectedRoute><CFInterpretation /></ProtectedRoute>}
              />

              <Route
                path="/iqresults_list"
                element={<ProtectedRoute><IQResultsList /></ProtectedRoute>}
              />
              <Route
                path="/cfresults_list"
                element={<ProtectedRoute><CFResultsList /></ProtectedRoute>}
              />

              <Route
                path="/omriqresults_list"
                element={<ProtectedRoute><OmrIQResultsList /></ProtectedRoute>}
              />
              <Route
                path="/omrcfresults_list"
                element={<ProtectedRoute><OmrCFResultsList /></ProtectedRoute>}
              />

              <Route  
                path="/iqomrresult"
                element={<ProtectedRoute><OMRResult /></ProtectedRoute>}
              />

              <Route
                path="/cfomr"
                element={<ProtectedRoute><CfOMR /></ProtectedRoute>}
              />

              <Route  
                path="/cfomrresult"
                element={<ProtectedRoute><OmrCFResult /></ProtectedRoute>}
              />
              
              <Route 
                path="/iqresults_list_both"
                element={<ProtectedRoute><IQResultListBoth /></ProtectedRoute>}
              />
              <Route 
                path="/cfresults_list_both"
                element={<ProtectedRoute><CFResultListBoth /></ProtectedRoute>}
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
                path="/cf-statistics"
                element={<ProtectedRoute><CFStatistics /></ProtectedRoute>}
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
               <Route path="/survey-responses/:surveyId" 
               element={<ProtectedRoute><SurveyResponse /></ProtectedRoute>}
              />
              <Route
                path="/iqonlinearchive"
                element={<ProtectedRoute><IQOnlineArchiveList /></ProtectedRoute>}
              />
              <Route
                path="/cfonlinearchive"
                element={<ProtectedRoute><CFOnlineArchiveList /></ProtectedRoute>}
              />
              <Route path="*" element={<Navigate to="/" />} />

            </Routes>
          </div>
        </div>
       
      </div>
    </Router>
  );
}

export default App;
