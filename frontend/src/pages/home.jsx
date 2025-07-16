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
import Navbar from '../navbar';
import CalorieCounterMini from '../calorieCounterMini';
import WorkoutLogMini from '../workoutLogMini';
import GoalsMini from '../goalsMini';

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
  // event handler for workout log button
  const handleClickWorkoutLog = () => {
    handleNavigate('/workout-log');
  };
  // event handler for goals button
  const handleClickGoals = () => {
    handleNavigate('/goals');
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
    
  return (
    <div className='centered-page'>
      <Navbar stats={stats} />
      <div className='current-date'>
        <h2>Today's Date: <CurrentDate /></h2>
      </div>
      <section className='dashboard-container'>
        <h1>Welcome {stats.username}!</h1>      
        <div className='cards-container'>
          <Stack direction="row" spacing={2}>
            <Card sx={{ maxWidth: 345 }}>
              {/* <CardMedia
                sx={{ height: 140 }}
                image="/images/goals.png"
                title="goals"
              /> */}
              <CardMedia><GoalsMini/></CardMedia>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Goals
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Track and manage your personal goals here!
                </Typography>
              </CardContent>
              <CardActions>
                {/* <Button size="small">Share</Button>
                <Button size="small">Learn More</Button> */}
                <Button
                  variant='contained'
                  style={{
                    backgroundColor: '#C51D34'
                  }}
                  onClick={handleClickGoals}> 
                  Enter
                </Button>
              </CardActions>
            </Card>
            <Card sx={{ maxWidth: 345 }}>
              {/* <CardMedia
                sx={{ height: 140 }}
                image="/images/workout-log.jpg"
                title="workout-log"
              /> */}
              <CardMedia><WorkoutLogMini/></CardMedia>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Workout Log
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Enter your workouts here!
                </Typography>
              </CardContent>
              <CardActions>
                {/* <Button size="small">Share</Button>
                <Button size="small">Learn More</Button> */}
                <Button
                  variant='contained'
                  style={{
                    backgroundColor: '#C51D34'
                  }}
                  onClick={handleClickWorkoutLog}> 
                  Enter
                </Button>
              </CardActions>
            </Card>
            <Card sx={{ maxWidth: 345 }}>
              {/* <CardMedia
                sx={{ height: 140 }}
                image="/images/calorie-counter.jpeg"
                title="workout-log"
              /> */}
              <CardMedia><CalorieCounterMini/></CardMedia>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Calorie Counter
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Track your daily calories here!
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
    </div>
  )
};

export default Home;