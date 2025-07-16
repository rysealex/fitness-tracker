import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';

function CreateAccount() {
  const navigate = useNavigate();
  const handleNavigate = (url) => {
    navigate(url);
  };
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState("");
  const [generalError, setGeneralError] = useState("");

  // handle the account creation attempt
  const handleSubmit = async (e) => {
    e.preventDefault();

    // clear previous errors
    setUsernameError("");
    setPasswordError("");
    setPasswordConfirmError("");
    setGeneralError("");

    let hasError = false;

    // perform input validation
    if (username === "") {
      setUsernameError("Enter a Username");
      hasError = true;
    } else if (password === "") {
      setPasswordError("Enter a Password");
      hasError = true;
    } else if (confirmPassword === "") {
      setPasswordConfirmError("Confirm your password.");
      hasError = true;
    } else if (password !== confirmPassword) {
      setPasswordConfirmError("Passwords don't match.");
      hasError = true;
    }
    if (hasError) return; // stop if input validation failed
    // proceed to account creation with API call
    try {
      const response = await fetch('http://localhost:5000/auth/username-exists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      // check if the response is ok
      if (response.ok) {
        const data = await response.json();
        // check if username is taken
        if (data.exists) {
          console.log('Username is taken:', data);
          setGeneralError("Username is taken.");
        } else {
          console.log('Username is not taken:', data);
          // store the username and password in local storage
          localStorage.setItem('username', username);
          localStorage.setItem('password', password);
          handleNavigate("/enter-info");
        }
      } else {
        const errorData = await response.json();
        setGeneralError(errorData.message || "Account creation failed. Please check your credentials.");
        console.log('Account creation failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during username check:', error);
      setGeneralError("Network error. Please try again later.");
    };
  };

  return (
    <div  className='centered-page'>
      <div class="register-container">
        <div class="register-box">
          <h2>Register</h2>
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
            <TextField
              className='textfield'
              error={!!passwordConfirmError}
              id="confirm-password-input"
              label="Confirm Password"
              variant="outlined"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setPasswordConfirmError(""); // clear error when user starts typing
              }}
              helperText={passwordConfirmError}
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
                Create
            </Button>
          </form>
          <p>Already have an account? 
            <a href="" onClick={() => handleNavigate("/login")}>    Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;