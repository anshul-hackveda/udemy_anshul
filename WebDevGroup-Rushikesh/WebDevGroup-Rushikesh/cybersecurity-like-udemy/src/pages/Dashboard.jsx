import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import './Dashboard.css';
import CardPage from '../components/CardPage';

const Dashboard = () => {
  // ✅ This must be inside the component function
const { userData } = useSelector((state) => state.user);
console.log("Redux userData in Dashboard:", userData);

  const navigate = useNavigate();

  if (!userData) {
    return <p>Loading user data...</p>;
  }

  const handleCreateCourse = () => {
    navigate('/courses');
  };

  const userInitial = userData.name?.trim()
  ? userData.name[0].toUpperCase()
  : userData.email[0].toUpperCase();
  



  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="dashboard-avatar-text">
          {userInitial}
        </div>
        <div className="dashboard-info">
          <h2>Welcome, {userData.name?.trim() || userData.email} 👋</h2>
          <p><strong>Total Earnings:</strong> ₹{userData.totalEarnings || 0}</p>
          <p>{userData.role || 'Educator'}</p>
          <button
            className="create-course-btn"
            onClick={handleCreateCourse}
          >
            Create Courses
          </button>
        </div>
      </div>
       <CardPage/>
    </div>
    
  );
 
};

export default Dashboard;

