import React from "react";

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages

import Login from './pages/Login';
import Signup from './pages/Signup';
import Pr from './pages/Pr'

import Dashboard from './pages/Dashboard';


// Styles
import './styles/Header.css';
import './styles/MainContent.css';
import './styles/Footer.css';
import './styles/Auth.css';
import './styles/App.css';

// Custom hook to fetch and set current user data in Redux store
import useCurrentUser from './customHooks/getCurrentUser';

import Courses from "./pages/Courses";
import CreateCourse from "./pages/create-courses";
import EditCourse from "./pages/EditCourse";
import CreateLecture from "./pages/CreateLecture";
import EditLecture from "./pages/EditLecture";
import CourseView from "./pages/CourseView";


// Export backend server URL for API calls (can be imported elsewhere)
export const serverUrl= "http://localhost:8000";

function App() {
  // Call the custom hook to fetch current user data on app mount
  // Hooks must be called directly inside React components
      useCurrentUser();   // <-- This is how hooks are used


  return (
    <BrowserRouter>
      {/* Header will appear on all pages */}
      <Header />

      {/* Toast notifications container */}
      <ToastContainer />

      {/* Main content area where routes render pages */}
      <main>
         <Routes>
          {/* 2. Update the routes as requested */}
          
          <Route path="/pr" element={<Pr />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} /> 
          // App.jsx
          <Route path="/courses" element={<Courses />} /> 
          <Route path="/create-course" element={<CreateCourse />} />
          <Route path="/edit-course/:courseId" element={<EditCourse />} />
          <Route path="/createlecture/:courseId"  element={<CreateLecture />}/>
          <Route path="/editlecture/:courseId/:lectureId" element={<EditLecture />} />
           <Route path="/viewcourse/:courseId" element={<CourseView />} />



        </Routes>
      </main>

      {/* Conditionally render footer based on current path */}
      <FooterController />
    </BrowserRouter>
  );
}

/* 
  FooterController component:
  - Uses useLocation to get current path
  - Hides footer on specified routes (like login/signup)
  - Shows footer on all other routes
*/
function FooterController() {
  const { pathname } = useLocation();

  // Paths where footer should be hidden
  const hideFooterOn = ['/login', '/signup'];

  if (hideFooterOn.includes(pathname)) {
    return null; // Don't render footer on these pages
  }

  return <Footer />;
}

export default App;
