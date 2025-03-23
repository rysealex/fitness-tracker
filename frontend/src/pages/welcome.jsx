import React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import '../styles/index.css'
import { useNavigate } from 'react-router-dom';

function Welcome() {
  const navigate = useNavigate();
  const handleNavigate = (url) => {
    navigate(url);
  };
  return (
    <div>
      {/*<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
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
            <a href='#'><span 
            class="material-symbols-outlined">
              dashboard
              </span>Dashboard</a>
          </li>
          <li>
            <a href='#'><span 
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
            <a href='#'><span 
            class="material-symbols-outlined">
              account_circle
              </span>Profile</a>
          </li>
          <li>
            <a href='#'><span 
            class="material-symbols-outlined">
              settings
              </span>Settings</a>
          </li>
          <li>
            <a href='#'><span 
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
              <h3>Alex Ryse</h3>
              <span>Software Engineer</span>
            </div>
          </div>
        </div>
      </aside>*/}
      <div className='welcome-container'>
        <div className='logo-container'>
          <img src='/images/muscle-logo.png' alt='logo'></img>
        </div>
        <h1>Fitness Tracker</h1>
        <Stack className='button-container' spacing={2} direction="row" >
          <Button 
            className='log-in' 
            variant="contained" 
            onClick={ () => 
              handleNavigate("/login")
            }
            style={{
              backgroundColor: '#C51D34'
            }}
          >
            Login
          </Button>
          <Button 
            className='create-account' 
            variant="contained" 
            onClick={ () => 
              handleNavigate("/create-account")
            }
            style={{
              backgroundColor: '#C51D34'
            }}
          >
            Register
          </Button>
        </Stack>
      </div>
    </div>
  );
};

export default Welcome;