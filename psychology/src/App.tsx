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
import PFResultsList from './app/Test/PFTest/PFResultsList/PFResultsList';
import IQResultsList from './app/Test/IQTest/IQResultsList/IQResultsList';
import ThemeToggle from "./darkMode";
import OMRCamera from "./app/OMR/OMRCamera/OMRCamera"
import IQInterpretation from './app/Test/IQTest/IQResultsList/IQInterpretation';
import OmrIQResultsList from './app/Test/IQTest/IQResultsList/Omr_IQResultList';
import IQResultListBoth from './app/Test/IQTest/IQResultsList/IQtestListBoth';
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
                path="/iqresults_list_both"
                element={<ProtectedRoute><IQResultListBoth /></ProtectedRoute>}
              />
              <Route
                path="/omrcamera"
                element={<ProtectedRoute><OMRCamera /></ProtectedRoute>}
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
