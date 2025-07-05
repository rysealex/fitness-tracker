import React, { useState, useEffect } from 'react';
import '../styles/index.css'
import Navbar from '../navbar';

function Profile() {
  const [stats, setStats] = useState({});

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