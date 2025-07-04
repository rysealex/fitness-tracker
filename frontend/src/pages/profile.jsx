import React, { useState, useEffect } from 'react';
import { useUser } from '../userContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/index.css'
import Navbar from '../navbar';

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
  // // Fetch user stats
  // useEffect(() => {
  //   if (username) {
  //     axios.get(`http://127.0.0.1:5000/user/${username}/stats`)
  //       .then(function (response) {
  //         console.log(response);
  //         setStats(response.data);
  //       })
  //       .catch(function (error) {
  //         console.log(error);
  //       });
  //   }
  // }, [username])

  // fetch user stats on component mount
  useEffect(() => {
    const fetchStats = async () => {
      // get the current users user_id from local storage
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error("User ID not found in local storage.");
        return;
      }
      try {
        const response = await fetch(`http://localhost:5000/auth/user/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setStats(data);
          console.log("User stats fetched successfully:", data);
        } else {
          console.error("Failed to fetch user stats:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };
    // call the fetchStats function to get user stats
    fetchStats();
  }, []);

  // function to convert birthday and account creation date to a more readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className='centered-page'>
      <Navbar stats={stats} />
      <section className='profile-container'>
        <h1>Your Profile</h1>
        <ul>
          <li>Name: {stats.fname} {stats.lname}</li>
          <li>Birthday: {formatDate(stats.dob)}</li>
          <li>Occupation: {stats.occupation}</li>
          <li>Account Created: {formatDate(stats.created_at)}</li>
        </ul>
        <h2>Update Profile Pic</h2>
      </section>
    </div>
  );
};

export default Profile;