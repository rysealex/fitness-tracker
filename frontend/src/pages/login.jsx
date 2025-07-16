import { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
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
  const [generalError, setGeneralError] = useState("");

  // handle the login attempt
  const handleSubmit = async (e) => {
    e.preventDefault();

    // clear previous errors
    setUsernameError("");
    setPasswordError("");
    setGeneralError("");

    let hasError = false;
    
    // perform input validation
    if (username === "") {
      setUsernameError("Enter a Username");
      hasError = true;
    } else if (password === "") {
      setPasswordError("Enter a Password");
      hasError = true;
    } 
    if (hasError) return; // stop if input validation failed
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
        const errorData = await response.json();
        setGeneralError(errorData.message || "Login failed. Please check your credentials.");
        console.log('Login failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setGeneralError("Network error. Please try again later.");
    }
  };

  return (
    <div  className='centered-page'>
      <div class="login-container">
        <div class="login-box">
          <h2>Login</h2>
            <form onSubmit={handleSubmit}>
              <TextField
                className='textfield'
                error={!!usernameError}
                id="username-input"
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setUsernameError(""); // clear error when user starts typing
                }}
                helperText={usernameError}
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
                error={!!passwordError}
                id="password-input"
                label="Password"
                variant="outlined"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(""); // clear error when user starts typing
                }}
                helperText={passwordError}
                style={{padding: '10px',
                  marginTop: '25px',
                  border: 'none',
                  borderRadius: '10px',
                  background: 'transparent',
                  border: '1px solid #fff',
                  color: '#fff',
                  fontSize: '13px'}}
              />
              {generalError && (
                <Box sx={{ color: '#C51D34', mt: 2, textAlign: 'center' }}>
                  {generalError}
                </Box>
              )}
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
    </div>
  );
};

export default Login;