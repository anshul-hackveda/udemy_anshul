import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import '../styles/pr.css';
import { useSelector, useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useCurrentUser from '../customHooks/getCurrentUser'; // Import hook

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch current user on mount
  useCurrentUser();

  // Get userData from Redux
  const { userData } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(setUserData(null)); // Clear Redux state
    toast.success('Logged out successfully');
    navigate('/login'); // Redirect to login
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => navigate('/')}>
          Hackveda
        </div>

        <div className="navbar-actions">
    
<div id="profile-initial">
  {userData?.name 
    ? userData.name[0].toUpperCase()
    : userData?.email 
    ? userData.email[0].toUpperCase()
    : "?"}
</div>



          {/* Dashboard button */}
          <button
            className="nav-button dashboard-btn"
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </button>

          {/* Logout button */}
          <button
            className="nav-button logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

