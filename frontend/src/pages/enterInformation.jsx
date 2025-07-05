import React, { useState } from 'react';
import { useUser } from '../userContext';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Calendar from '../calendar';
import FormControl from '@mui/material/FormControl';
import { useNavigate } from 'react-router-dom';
import { FormHelperText, InputLabel } from '@mui/material';
import { useAudio } from '../AudioContext';
import { create } from '@mui/material/styles/createTransitions';

function EnterInformation() {
  const navigate = useNavigate();
    const handleNavigate = (url) => {
      navigate(url);
    };
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState(""); 
  const [profilePic, setProfilePic] = useState(""); // optional
  const [occupation, setOccupation] = useState(""); // optional

  // handle the account information submission attempt
  const handleSubmit = async (e) => {
    e.preventDefault();

    // perform input validation
    if (fname === "") {
      console.log("First name is required");
      return;
    } else if (lname === "") {
      console.log("Last name is required"); 
      return;
    } else if (height === "") {
      console.log("Height is required");
      return;
    } else if (weight === "") {
      console.log("Weight is required");  
      return;
    } else if (dob === "") {
      console.log("Date of birth is required"); 
      return;
    } else if (gender === "") {
      console.log("Gender is required");
      return;
    } else if (profilePic === "") {
      setProfilePic("default_profile_pic.png"); // set default profile pic if not provided
    } else if (occupation === "") {
      setOccupation("Unemployed"); // set default occupation if not provided
    } else {
      // proceed to account information submission with API call
      try {
        console.log("Submitting account information for user:", localStorage.getItem('username'));
        const response = await fetch('http://localhost:5000/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: localStorage.getItem('username'),
            password: localStorage.getItem('password'),
            fname: fname,
            lname: lname,
            dob: dob,
            height_ft: height,
            weight_lbs: weight,
            gender: gender,
            profile_pic: profilePic,
            occupation: occupation,
          }),
        });
        // check if the response is ok
        if (response.ok) {
          const data = await response.json();
          console.log('Account information submitted successfully:', data);
          // store the user id in local storage
          localStorage.setItem('userId', data.user_id);
          console.log('User ID stored in local storage:', data.user_id);
          handleNavigate("/home");
        } else {
          console.log('Account information submission failed:', response.statusText);
          return;
        }
      } catch (error) {
        console.error('Error during account information submission:', error);
        return;
      }
    }
  };

  return (
    <div className='centered-page'>
      <div class="enter-info-container">
        <div class="enter-info-box">
          <h2>Enter Information</h2>
          <form onSubmit={handleSubmit}>
            <TextField
              className='textfield'
              id="fname"
              label="First Name"
              variant="outlined"
              onChange={(e) => setFname(e.target.value)}
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
              id="lname"
              label="Last Name"
              onChange={(e) => setLname(e.target.value)}
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
              id="height"
              label="Height (feet)"
              variant="outlined"
              type="number"
              step="0.1"
              onChange={(e) => setHeight(e.target.value)}
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
              id="weight"
              label="Weight (lbs)"
              variant="outlined"
              type="number"
              step="0.1"
              onChange={(e) => setWeight(e.target.value)}
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
              id="dob"
              label="Date of Birth (YYYY-MM-DD)"
              variant="outlined"
              type="date"
              onChange={(e) => setDob(e.target.value)}
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
              id="gender"
              label="Gender"
              variant="outlined"
              type="text"
              onChange={(e) => setGender(e.target.value)}
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
              id="profile-pic"
              label="Profile Picture URL (optional)"
              variant="outlined"
              type="text"
              onChange={(e) => setProfilePic(e.target.value)}
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
              id="occupation"
              label="Occupation (optional)"
              variant="outlined"
              type="text"
              onChange={(e) => setOccupation(e.target.value)}
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
              style={{
                backgroundColor: '#C51D34'
              }}
            >
              Continue
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EnterInformation;