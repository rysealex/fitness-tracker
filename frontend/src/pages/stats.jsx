import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useUser } from '../userContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/index.css'

function Stats() {
  const navigate = useNavigate();
  const handleNavigate = (url) => {
    navigate(url);
  };
  const { username, setUsername } = useUser();
  const [stats, setStats] = useState({});
  const [weightInput, setWeightInput] = useState(stats.weight);
  const [heightInput, setHeightInput] = useState(stats.height);
  const [editStats, setEditStats] = useState(false);
  const [errorHeight, setErrorHeight] = useState(false); 
  const [errorWeight, setErrorWeight] = useState(false); 
  const [helperTextHeight, setHelperTextHeight] = useState('');
  const [helperTextWeight, setHelperTextWeight] = useState('');
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
  // event handler for edit stats use state
  const handleClickEditStats = () => {
    setEditStats(!editStats);
  }
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
            setEditStats(false);
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
            setEditStats(false);
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
    // allow only numbers (positive integers and decimals)
    if (/^\d*\.?\d*$/.test(newValue)) {
      setWeightInput(newValue);
      setErrorWeight(false);
      setHelperTextWeight("");
    } else {
      setErrorWeight(true);
      setHelperTextWeight("Enter a valid weight");
    }
  };
  // Error checking height input value
  const handleHeightInputChange = (e) => {
    const newValue = e.target.value;
    // allow only numbers (positive integers and decimals)
    if (/^\d*\.?\d*$/.test(newValue)) {
      setHeightInput(newValue);
      setErrorHeight(false);
      setHelperTextHeight("");
    } else {
      setErrorHeight(true);
      setHelperTextHeight("Enter a valid height");
    }
  };
  // Fetch user stats
  useEffect(() => {
    if (username) {
      axios.get(`http://127.0.0.1:5000/user/${username}/stats`)
        .then(function (response) {
          console.log(response);
          setStats(response.data);
          setWeightInput(response.data.weight);
          setHeightInput(response.data.height);
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
      <section className='stats-container'>
        <h1>Your Stats</h1>
        <ul>
          <li>Age: {stats.age}</li>
          <li>Gender: {stats.gender}</li>
          <li>Height: {stats.height}</li>
          <li>Weight: {stats.weight}</li>
        </ul>
        {editStats && (
          <>
          <div className='enter-height-container'>
            <TextField
              label="Enter Height"
              variant="outlined"
              value={heightInput}
              placeholder="Enter Height"
              error={errorHeight}
              helperText={helperTextHeight}
              onChange={handleHeightInputChange}
              style={{padding: '10px',
                marginTop: '25px',
                border: 'none',
                borderRadius: '10px',
                background: 'transparent',
                border: '1px solid #fff',
                color: '#fff',
                fontSize: '13px'}}
            />
            <Button 
              variant='contained'
              style={{marginTop: '15px',
                backgroundColor: '#C51D34',
                marginLeft: '2em',
                marginTop: '3em'
              }} 
              onClick={handleSaveHeight}>
                Save Height
            </Button>
          </div>
          <div className='enter-weight-container'>
          <TextField
              label="Enter Weight"
              variant="outlined"
              value={weightInput}
              placeholder="Enter Weight"
              error={errorWeight}
              helperText={helperTextWeight}
              onChange={handleWeightInputChange}
              style={{padding: '10px',
                marginTop: '25px',
                border: 'none',
                borderRadius: '10px',
                background: 'transparent',
                border: '1px solid #fff',
                color: '#fff',
                fontSize: '13px'}}
            />
            <Button 
              variant='contained'
              style={{marginTop: '15px',
                backgroundColor: '#C51D34',
                marginLeft: '2em',
                marginTop: '3em'
              }} 
              onClick={handleSaveWeight}>
                Save Weight
            </Button>
          </div>
          </>
        )}
        <Button 
          variant="contained" 
          style={{marginTop: '15px',
            backgroundColor: '#C51D34'
          }}
          onClick={handleClickEditStats}>
            {editStats ? "Exit Edit" : "Edit Stats"}
        </Button>
      </section>
    </div>
  );
};

export default Stats;