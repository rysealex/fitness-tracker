import React, { useState, useEffect } from 'react';
import { useUser } from '../userContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/index.css'

function Profile() {
  const navigate = useNavigate();
  const handleNavigate = (url) => {
    navigate(url);
  };
  const { username, setUsername } = useUser();
  const [stats, setStats] = useState({});
  // Event handler for nav bar buttons
  const handleSignOut = (event) => {
    setUsername("");
    handleNavigate('/');
  };
  const handleClickDashboard = () => {
    handleNavigate('/home');
  };
  const handleClickStats = () => {
    handleNavigate('/stats');
  };
  const handleClickProfile = () => {
    handleNavigate('/profile');
  };
  const handleClickSettings = () => {
    handleNavigate('/settings');
  };
  // Fetch user stats
  useEffect(() => {
    if (username) {
      axios.get(`http://127.0.0.1:5000/user/${username}/stats`)
        .then(function (response) {
          console.log(response);
          setStats(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [username])
  return (
    <div>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      <aside className='nav-container'>
        <div className='nav-header'>
          <img src='/images/muscle-logo.png' alt='logo'></img>
          <h2>FitnessTracker</h2>
        </div>
        <ul className='nav-links'>
          <h4>
            <span>Main Menu</span>
            <div className='menu-separator'></div>
          </h4>
          <li>
            <a href='' onClick={() => handleClickDashboard()}><span 
            class="material-symbols-outlined">
              dashboard
              </span>Dashboard</a>
          </li>
          <li>
            <a href='' onClick={() => handleClickStats()}><span 
            class="material-symbols-outlined">
              monitoring
              </span>Stats</a>
          </li>
          <li>
            <a href='#'><span 
            class="material-symbols-outlined">
              notifications_active
              </span>Notifications</a>
          </li>
          <li>
            <a href='' onClick={() => handleClickProfile()}><span 
            class="material-symbols-outlined">
              account_circle
              </span>Profile</a>
          </li>
          <li>
            <a href='' onClick={() => handleClickSettings()}><span 
            class="material-symbols-outlined">
              settings
              </span>Settings</a>
          </li>
          <li>
            <a href='' onClick={() => handleSignOut()}><span 
            class="material-symbols-outlined">
              logout
              </span>Logout</a>
          </li>
        </ul>
        <div className='user-account'>
          <div className='user-profile'>
            <img src='/images/yami.png'
            alt='profile-img'></img>
            <div className='user-detail'>
              <h3>{stats.fname} {stats.lname}</h3>
              <span>Software Engineer</span>
            </div>
          </div>
        </div>
      </aside>
      <section className='profile-container'>
        <h1>Your Profile</h1>
        <ul>
          <li>Name: {stats.fname} {stats.lname}</li>
          <li>Birthday: </li>
          <li>Location: </li>
          <li>Occupation: </li>
          <li>Account Created: </li>
        </ul>
        <h2>Update Profile Pic</h2>
      </section>
    </div>
  );
};

export default Profile;