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

  // handle the account creation attempt
  const handleSubmit = async (e) => {
    e.preventDefault();

    // perform input validation
    if (username === "") {
      return;
    } else if (password === "") {
      return;
    } else if (confirmPassword === "") {
      return;
    } else if (password !== confirmPassword) {
      return;
    } else {
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
            return;
          } else {
            console.log('Username is not taken:', data);
            // store the username and password in local storage
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
            handleNavigate("/enter-info");
          }
        } else {
          console.log('Account creation failed:', response.statusText);
          return;
        }
      } catch (error) {
        console.error('Error during username check:', error);
        return;
      }
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
              id="outlined-basic"
              label="Username"
              variant="outlined"
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
              id="outlined-basic"
              label="Password"
              variant="outlined"
              type="password"
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
            <TextField
              className='textfield'
              id="outlined-basic"
              label="Re-type Password"
              variant="outlined"
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                Create
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;