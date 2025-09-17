import { useState, useRef } from 'react';
import { useStats } from '../StatsContext';
import { IconButton, Typography, Box } from "@mui/material";
import { Edit } from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
import '../styles/index.css'
import Navbar from '../navbar';

function Profile() {
  const [displayedProfilePicUrl, setDisplayedProfilePicUrl] = useState("/images/default-profile-icon.jpg");
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicError, setProfilePicError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoadingPic, setIsLoadingPic] = useState(false);

  // ref for hidden file input
  const fileInputRef = useRef(null);

  // get the stats from context
  const { stats, isLoading, error, setStats } = useStats();
  if (isLoading) return <div>Loading home page...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!stats) return <div>No stats available.</div>;

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

    // reset the error message and success message
    setProfilePicError("");
    setSuccessMessage("");

    // // get the current user ID from local storage
    // const userId = localStorage.getItem('userId');

    // if (!userId) {
    //   console.error("User ID not found. Cannot upload profile picture.");
    //   return;
    // }

    // get the JWT token from local storage
		const token = localStorage.getItem('token');

		// if token does not exist, user is not authenticated
		if (!token) {
			console.error("User is not authenticated.");
			return;
		}

    // start loading state
    setIsLoadingPic(true);

    // attempt to upload new profile pic
    try {
      const formData = new FormData();
      formData.append('profile_pic', file);

      // PUT request to backend to update profile pic endpoint
      const response = await fetch(`http://localhost:5000/auth/update-profile-pic`, {
        method: 'PUT',
        headers: {
					'Authorization': `Bearer ${token}` // use the JWT token for authentication
				},
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
        setProfilePicError("");
        setIsLoadingPic(false);
        setSuccessMessage("Successfuly update profile picture!");
        // clear the success message after 3 sec
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        setIsLoadingPic(false);
        setSuccessMessage("");
        setProfilePicError("Failed to update profile picture. Please try again.");
        const errorData = await response.json();
        console.error(errorData.message || 'Failed to update profile picture.');
      }
    } catch (error) {
      setIsLoadingPic(false);
      setSuccessMessage("");
      setProfilePicError("Error updating profile picture. Please try again.");
      console.error('Error updating profile picture:', error);
    }
  };

  // function to convert birthday and account creation date to a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return ''; 
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    // extract the UTC if in GMT format
    if (dateString.includes("00:00:00 GMT")) { 
      return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
             .toLocaleDateString(undefined, options);
    }
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div className='centered-page'>
      <Navbar />
      <section className='profile-container'>
        <h1>Profile</h1>
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
              <li>Account Created: {formatDate(stats.created_at)}</li>
            </ul>
          </div>
        </div>
        {isLoadingPic && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <CircularProgress sx={{ color: '#C51D34' }} />
          </Box>
        )}
        {successMessage && (
          <Box sx={{ color: '#1dc51dff', mt: 2, textAlign: 'center', fontFamily: 'kanit, sans-serif' }}>
            {successMessage}
          </Box>
        )}
        {profilePicError && (
          <Typography color="error" variant="body2" sx={{ textAlign: 'center', fontFamily: 'kanit, sans-serif' }}>
            {profilePicError}
          </Typography>
        )}
      </section>
    </div>
  );
};

export default Profile;