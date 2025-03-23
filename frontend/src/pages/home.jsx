import React, { useState, useEffect } from 'react';
import { useAudio } from '../AudioContext';
import { useUser } from '../userContext';
import { Container } from '@mui/material';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import StatCard from '../statCard';
import CurrentDate from '../currentDate';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

function Home() {
  const navigate = useNavigate();
  const handleNavigate = (url) => {
    navigate(url);
  };
  const { username, setUsername } = useUser();
  const [stats, setStats] = useState({});
  const [weightInput, setWeightInput] = useState(stats.weight);
  const [heightInput, setHeightInput] = useState(stats.height);
  const [profileVisible, setProfileVisible] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewPicture, setPreviewPicture] = useState(null);
  const { startAudio, isPlaying } = useAudio();
  useEffect(() => {
    if (!isPlaying) {
      startAudio(); // Start audio if not already playing
    }
  }, [isPlaying, startAudio]);
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
  // event handler for calorie counter button
  const handleClickCalorieCounter = () => {
    handleNavigate('/calorie-counter');
  };
  // Event handler for edit buttons
  const [editModeWeight, setEditModeWeight] = useState(false);
  const handleClickWeight = () => {
    setEditModeWeight(!editModeWeight);
  };
  const [editModeHeight, setEditModeHeight] = useState(false);
  const handleClickHeight = () => {
    setEditModeHeight(!editModeHeight);
  };
  // Event handler for saving the new values
  const handleSaveWeight = () => {
    const updatedStats = { ...stats, weight: weightInput };
    setStats(updatedStats);
    // Connect to backend here
    axios.put(`http://127.0.0.1:5000/user/${username}/stats`, {
      weight: weightInput
    })
      .then(response => {
        console.log("Weight updated successfully:", response.data);
        axios.get(`http://127.0.0.1:5000/user/${username}/stats`)
          .then(function (response) {
            setStats(response.data); // Ensure we have the latest stats
            setEditModeWeight(false);
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch(error => {
        console.log("Error updating weight:", error);
      });
  };
  const handleSaveHeight = () => {
    const updatedStats = { ...stats, height: heightInput };
    setStats(updatedStats);
    // Connect to backend here
    axios.put(`http://127.0.0.1:5000/user/${username}/stats`, {
      height: heightInput
    })
      .then(response => {
        console.log("Height updated successfully:", response.data);
        axios.get(`http://127.0.0.1:5000/user/${username}/stats`)
          .then(function (response) {
            setStats(response.data); // Ensure we have the latest stats
            setEditModeHeight(false);
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch(error => {
        console.log("Error updating height:", error);
      });
  };
  // Error checking weight input value
  const handleWeightInputChange = (e) => {
    const newValue = e.target.value;
    if (!isNaN(newValue)) {
      setWeightInput(newValue);
    }
  };
  // Error checking height input value
  const handleHeightInputChange = (e) => {
    const newValue = e.target.value;
    if (!isNaN(newValue)) {
      setHeightInput(newValue);
    }
  };
  // handle profile picture upload
  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type.split("/")[0];
      if (fileType === "image") {
        setPreviewPicture(file);
      } else {
        alert("Please select a valid image file.");
      }
    }
  };
  const handleSaveProfilePicture = () => {
    if (previewPicture) {
        const formData = new FormData();
        formData.append('file', previewPicture);

        axios.put(`http://127.0.0.1:5000/user/${username}/profile-pic`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(response => {
            console.log("Profile picture updated successfully:", response.data);
            const imageUrl = response.data.profile_pic;
            setProfilePicture(`http://127.0.0.1:5000${imageUrl}`);  // Update the state with new profile picture URL
            setPreviewPicture(null); // Reset the preview image
            axios.get(`http://127.0.0.1:5000/user/${username}/stats`)
                .then(response => {
                    setStats(response.data);
                })
                .catch(error => {
                    console.log(error);
                });
        })
        .catch(error => {
            console.log("Error updating profile picture:", error);
        });
    }
};
  const handleProfilePicClick = () => {
    setProfileVisible(prevVisible => {
      const newVisible = !prevVisible;
      console.log("Profile picture clicked. New profileVisible:", newVisible);
      return newVisible;
    });
  };
  // Fetch user stats
  useEffect(() => {
    if (!isPlaying) {
      startAudio();
    }
    if (username) {
      axios.get(`http://127.0.0.1:5000/user/${username}/stats`)
        .then(function (response) {
          console.log(response);
          setStats(response.data);
          setWeightInput(response.data.weight);
          setHeightInput(response.data.height);
          setProfilePicture(response.data.profile_pic);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [username, isPlaying, startAudio]);
  return (
    <div>
      {/*<aside className='profile-collapsable'>
        <div className='profile-image' onClick={handleProfilePicClick}>
          <div className='profile-image-container'>
            {previewPicture ? (
              <img src={URL.createObjectURL(previewPicture)} alt="Profile-pic" />
            ) : (
              profilePicture ? (
                <img src={`http://127.0.0.1:5000${profilePicture}`} alt="Profile-pic" />
              ) : (
                <FontAwesomeIcon icon={faUser} size="3x" />
              )
            )}
          </div>
        </div>
        <div className='profile-username'>
          <h3>{stats.fname} {stats.lname}</h3>
          <h4>{`${username}`}</h4>
        </div>
        {profileVisible && (
          <div className={`profile-stats ${profileVisible ? 'visible' : ''}`}>
            {console.log("profile stats rednered")}
            <ul>
              <li>{stats.gender}</li>
              <li>{stats.age} yrs</li>
              <li>{stats.weight} lbs</li>
              <li>{stats.height} ft</li>
            </ul>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePictureChange}
              />
              {previewPicture && (
                <div className='profile-stats'>
                  <div className='profile-image-container'>
                    <img 
                      src={URL.createObjectURL(previewPicture)} 
                      alt="Profile-pic-preview" 
                    />
                  </div>
                  <Button 
                    variant='contained' 
                    onClick={handleSaveProfilePicture}
                  >
                    Save
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </aside>*/}
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
      <div className='current-date'>
        <h2>Today's Date: <CurrentDate /></h2>
      </div>
      <section className='dashboard-container'>
        <h1>Welcome {stats.fname}!</h1>      
        <div className='cards-container'>
          <Stack direction="row" spacing={2}>
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                sx={{ height: 140 }}
                image="/images/workout-log.jpg"
                title="workout-log"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Workout Log
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Enter your workouts here! That way you can track your progress!
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Share</Button>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                sx={{ height: 140 }}
                image="/images/calorie-counter.jpeg"
                title="workout-log"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Calorie Counter
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Track your daily calories here! This is the best way to reach your goals!
                </Typography>
              </CardContent>
              <CardActions>
                {/*<Button size="small">Enter</Button>
                <Button size="small">Learn More</Button>*/}
                <Button
                  variant='contained'
                  style={{
                    backgroundColor: '#C51D34'
                  }}
                  onClick={handleClickCalorieCounter}> 
                  Enter
                </Button>
              </CardActions>
            </Card>
          </Stack>
        </div>
      </section>
      {/*<Container> 
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <div style={{ width: '100%', maxWidth: '300px', marginBottom: '20px' }}>
          <StatCard
            title="Username"
            value={`${username}`}
          //unit=""
          //icon={<FaFireAlt />}
          />
        </div>
        <div style={{ width: '100%', maxWidth: '300px', marginBottom: '20px' }}>
          <StatCard
            title="Today's Date"
            value={<CurrentDate />}
          //unit="lbs"
          //icon={<FaWalking />}
          />
        </div>
        <div style={{ width: '100%', maxWidth: '300px', marginBottom: '20px' }}>
          <StatCard
            title="Weight"
            value={stats.weight}
            unit="lbs"
          //icon={<FaWalking />}
          />
          <Button variant="contained" onClick={handleClickWeight}>Edit</Button>
          {editModeWeight && (
            <>
              <input
                type="text"
                value={weightInput}
                onChange={handleWeightInputChange}
              />
              <Button variant='contained' onClick={handleSaveWeight}>Save</Button>
            </>
          )}
        </div>
        <div style={{ width: '100%', maxWidth: '300px', marginBottom: '20px' }}>
          <StatCard
            title="Height"
            value={stats.height}
            unit="feet"
          //icon={<FaFireAlt />}
          />
          <Button variant="contained" onClick={handleClickHeight}>Edit</Button>
          {editModeHeight && (
            <>
              <input
                type="text"
                value={heightInput}
                onChange={handleHeightInputChange}
              />
              <Button variant='contained' onClick={handleSaveHeight}>Save</Button>
            </>
          )}
        </div>
        <div style={{ width: '100%', maxWidth: '300px', marginBottom: '20px' }}>
          <StatCard
            title="Age"
            value={stats.age}
            unit="years"
          //icon={<FaFireAlt />}
          />
        </div>
        <div style={{ width: '100%', maxWidth: '300px', marginBottom: '20px' }}>
          <StatCard
            title="Gender"
            value={stats.gender}
          //unit=""
          //icon={<FaFireAlt />}
          />
        </div>
      </div>
      <Button variant="contained" onClick={() => handleSignOut()}>Sign Out</Button>
      </Container>*/}
    </div>
  )
};

export default Home;