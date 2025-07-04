import React, { useState } from 'react';
import { useUser } from '../userContext';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

    try {
      const response = await axios.post("http://127.0.0.1:5000/user", {
        username: username,
        password: password
      });
      console.log(response);
      handleNavigate("/enter-info");
    } catch (error) {
      console.log(error);
    }
  };
  // const { username, setUsername } = useUser();
  // const [password, setPassword] = useState("");
  // const [password2, setPassword2] = useState("");
  // const [matchErrorFlag, setMatchErrorFlag] = useState(false);
  // const [usernameErrorFlag, setUsernameErrorFlag] = useState(false);
  // const [passwordErrorFlag, setPasswordErrorFlag] = useState(false);
  // // Event handlers to update state variables
  // const handleUsernameChange = (event) => {
  //   const inputUsername = event.target.value;
  //   setUsername(inputUsername);
  //   if (inputUsername !== "") {
  //     setUsernameErrorFlag(false);
  //   }
  // };
  // const handlePasswordChange = (event) => {
  //   const inputPassword = event.target.value;
  //   setPassword(inputPassword);
  //   if (inputPassword !== "") {
  //     setPasswordErrorFlag(false);
  //   }
  // };
  // const handlePassword2Change = (event) => {
  //   const inputPassword2 = event.target.value;
  //   setPassword2(inputPassword2);
  //   if (inputPassword2 !== "") {
  //     setMatchErrorFlag(false);
  //   }
  // };
  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   // reset the error flags before checking
  //   setUsernameErrorFlag(false);
  //   setPasswordErrorFlag(false);
  //   setMatchErrorFlag(false);
  //   // validate fields
  //   let isValid = true;
  //   // check if no username
  //   if (username === "") {
  //     setUsernameErrorFlag(true);
  //     isValid = false;
  //   }
  //   // check if no password
  //   if (password === "") {
  //     setPasswordErrorFlag(true);
  //     isValid = false;
  //   }
  //   // check if passwords do not match
  //   if (password !== password2) {
  //     setMatchErrorFlag(true); // flip errorFlag
  //     isValid = false;
  //   }
  //   // check if re-type password textfield is emtpy
  //   if (password2 === "") {
  //     setMatchErrorFlag(true);
  //     isValid = false;
  //   }
  //   if (isValid) {
  //     axios.post("http://127.0.0.1:5000/user", {
  //       username: username,
  //       password: password
  //     })
  //       .then(function (response) {
  //         console.log(response);
  //       })
  //       .catch(function (error) {
  //         console.log(error);
  //       });
  //     handleNavigate("/enter-info");
  //   }
  // };
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
      {/*<div className='create-account-container'>
        <h1>Create Account</h1>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <Stack spacing={2} direction="column" width='25ch'>
            <TextField
              className='textfield'
              error={usernameErrorFlag}
              id="outlined-basic"
              label="Username"
              variant="outlined"
              helperText={usernameErrorFlag && "Enter a Username"}
              onChange={handleUsernameChange}
            />
            <TextField
              className='textfield'
              error={passwordErrorFlag}
              id="outlined-basic"
              label="Password"
              variant="outlined"
              type="password"
              helperText={passwordErrorFlag && "Enter a Password"}
              onChange={handlePasswordChange}
            />
            <TextField
              className='textfield'
              error={matchErrorFlag}
              id="outlined-basic"
              label="Re-type Password"
              variant="outlined"
              type="password"
              helperText={matchErrorFlag && "Passwords don't match"}
              onChange={handlePassword2Change}
            />

            <Stack className='button-container' spacing={2} direction="row">
              <Button variant="contained" type="submit">Create</Button>
              <Button variant="contained" onClick={() => handleNavigate("/")}>Back</Button>
            </Stack>
          </Stack>
        </Box>
      </div>*/}
    </div>
  );
};

export default CreateAccount;