import React, { useState, useEffect } from 'react';
import { useUser } from '../userContext';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAudio } from '../AudioContext';

function Login() {
  const navigate = useNavigate();
  const handleNavigate = (url) => {
    navigate(url);
  };
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // handle the login attempt
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // perform input validation
    if (username === "") {
      setUsernameError("Enter a Username");
    } else if (password === "") {
      setPasswordError("Enter a Password");
    } else {
      setUsernameError("");
      setPasswordError("");
      // proceed to login with API call
      try {
        const response = await fetch('http://localhost:5000/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });
        // check if the response is ok
        if (response.ok) {
          const data = await response.json();
          console.log('Login successful:', data);
          // store the user id in local storage
          localStorage.setItem('userId', data.user.user_id);
          handleNavigate("/home");
        } else {
          console.log('Login failed:', response.statusText);
        }
      } catch (error) {
        console.error('Error during login:', error);
        return;
      }
    }
  };

  return (
    <>
      <div class="login-container">
        <div class="login-box">
          <h2>Login</h2>
            <form onSubmit={handleSubmit}>
              <TextField
                className='textfield'
                error={usernameError}
                id="outlined-basic"
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{padding: '10px',
                  marginTop: '25px',
                  border: 'none',
                  borderRadius: '10px',
                  background: 'transparent',
                  border: '1px solid #fff',
                  color: '#fff',
                  fontSize: '13px'}}
              />
              <TextField
                className='textfield'
                error={passwordError}
                id="outlined-basic"
                label="Password"
                variant="outlined"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                variant="contained" 
                type="submit"
                style={{marginTop: '15px',
                  backgroundColor: '#C51D34'
                }}>
                  Login
              </Button>
            </form>
            <p>Don't have an account? 
              <a href="" onClick={() => handleNavigate("/create-account")}>    Register</a>
            </p>
        </div>
      </div>
    </>
  );
};

export default Login;