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
    <div className='centered-page'>
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