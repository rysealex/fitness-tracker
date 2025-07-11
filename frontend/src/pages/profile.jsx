import React, { useState, useEffect, useRef } from 'react';
import '../styles/index.css'
import Navbar from '../navbar';
import { IconButton } from "@mui/material";
import { Edit } from '@mui/icons-material';

function Profile() {
  const [stats, setStats] = useState({});
  const [profilePicUrl, setProfilePicUrl] = useState("/images/default-profile-icon.jpg");
  const [profilePicFile, setProfilePicFile] = useState(null);

  // ref for hidden file input
  const fileInputRef = useRef(null);

  // function to trigger the hidden file input click
  const handleEditClick = () => {
    fileInputRef.current.click();
  };

  // handle the file change event for the profile pic
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicFile(file);
    } else {
      setProfilePicFile(null);
      setProfilePicUrl("/images/default-profile-icon.jpg"); // reset to default
    }
  };

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
        <div className='user-profile'>
          <img 
            src={stats.profile_pic}
            alt='profile-img'>
          </img>
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            accept="image/*" // only allow images
          />
          {/* Edit button */}
          <IconButton
            color="primary"
            onClick={handleEditClick}
          >
            <Edit />
          </IconButton>
        </div>
      </section>
    </div>
  );
};

export default Profile;