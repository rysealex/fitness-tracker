import { useState, useRef } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';

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
  const [isLoading, setIsLoading] = useState(false);

  // refs for the input fields
  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  // handle the login attempt
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // start loading state
    setIsLoading(true);

    // clear previous errors
    setUsernameError("");
    setPasswordError("");
    setGeneralError("");

    let hasError = false;
    
    // perform input validation
    if (username === "") {
      setUsernameError("Enter your username.");
      hasError = true;
      usernameInputRef.current.focus();
    } 
    else if (password === "") {
      setPasswordError("Enter your password.");
      hasError = true;
      passwordInputRef.current.focus();
    } 
    if (hasError) {
      setIsLoading(false);
      return; // stop if input validation failed
    }
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
        // // store the user id in local storage
        // localStorage.setItem('userId', data.user.user_id);
        // check if JWT token exists
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        setIsLoading(false);
        handleNavigate("/home");
      } else {
        setUsername("");
        setPassword("");
        setIsLoading(false);
        usernameInputRef.current.focus();
        const errorData = await response.json();
        setGeneralError(errorData.message || "Login failed. Please check your credentials.");
        console.log('Login failed:', response.statusText);
      }
    } catch (error) {
      setUsername("");
      setPassword("");
      setIsLoading(false);
      usernameInputRef.current.focus();
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
                inputRef={usernameInputRef}
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
                inputRef={passwordInputRef}
                style={{padding: '10px',
                  marginTop: '25px',
                  border: 'none',
                  borderRadius: '10px',
                  background: 'transparent',
                  border: '1px solid #fff',
                  color: '#fff',
                  fontSize: '13px'}}
              />
              {isLoading && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <CircularProgress sx={{ color: '#C51D34' }} />
                </Box>
              )}
              {generalError && (
                <Box sx={{ color: '#C51D34', mt: 2, textAlign: 'center', fontFamily: 'kanit, sans-serif' }}>
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