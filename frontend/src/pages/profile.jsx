import React, { useState, useEffect, useRef } from 'react';
import '../styles/index.css'
import Navbar from '../navbar';
import { IconButton } from "@mui/material";
import { Edit } from '@mui/icons-material';

function Profile() {
  const [stats, setStats] = useState({});
  const [displayedProfilePicUrl, setDisplayedProfilePicUrl] = useState("/images/default-profile-icon.jpg");
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
      // attempt to upload the new profile pic
      uploadNewProfilePic(file);
    } else {
      setProfilePicFile(null);
      setDisplayedProfilePicUrl(stats.profile_pic || "/images/default-profile-icon.jpg"); // reset to default
    }
  };

  // function to upload the new profile pic to the backend server and update user data
  const uploadNewProfilePic = async (file) => {
    
    // get the current user ID from local storage
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error("User ID not found. Cannot upload profile picture.");
      return;
    }

    // attempt to upload new profile pic
    try {
      const formData = new FormData();
      formData.append('profile_pic', file);

      // PUT request to backend to update profile pic endpoint
      const response = await fetch(`http://localhost:5000/auth/user/${userId}/update-profile-pic`, {
        method: 'PUT',
        body: formData,
      });

      // check if the response if ok
      if (response.ok) {
        const data = await response.json();
        console.log('Profile picture updated successfully:', data);
        setDisplayedProfilePicUrl(data.imageUrl); // update the displayed image
        // update the stats state to keep it consistent with the new URL
        setStats(prevStats => ({
          ...prevStats,
          profile_pic: data.imageUrl
        }));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile picture.');
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
      return;
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
        <div className='profile-content-wrapper'>
          {/* Profile Picture Section */}
          <div className='profile-picture-section'>
            {/* New outer wrapper for positioning the button */}
            <div className='profile-image-outer-wrapper'>
              <div className='profile-picture-wrapper'>
                <img
                  src={stats.profile_pic}
                  alt='profile-img'
                  className='profile-image'
                />
              </div>
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept="image/*"
              />
              {/* Edit Button */}
              <IconButton
                color="primary"
                onClick={handleEditClick}
                sx={{
                  position: 'absolute',
                  top: -15, 
                  right: -15, 
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.8)',
                  },
                  color: '#fff',
                  borderRadius: '50%',
                  padding: '8px',
                  zIndex: 10,
                }}
              >
                <Edit />
              </IconButton>
            </div>
          </div>

          {/* User Info Section */}
          <div className='profile-info-section'>
            <ul>
              <li>Name: {stats.fname} {stats.lname}</li>
              <li>Birthday: {formatDate(stats.dob)}</li>
              <li>Occupation: {stats.occupation}</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;