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
  const [profilePicUrl, setProfilePicUrl] = useState("/images/default-profile-icon.jpg");
  const [profilePicFile, setProfilePicFile] = useState(null);
  //const [profilePic, setProfilePic] = useState(""); // optional
  const [occupation, setOccupation] = useState("Unemployed"); // optional

  // handle the file change event for the profile pic
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicFile(file);
    } else {
      setProfilePicFile(null);
      setProfilePicUrl("/images/default-profile-icon.jpg"); // reset to default
    }
  };

  // function to upload the selected profile pic file to backend server
  const uploadProfilePic = async (file) => {
    try {
      const formData = new FormData();
      formData.append('profile_pic', file);

      // make a POST request to backend file upload endpoint
      const response = await fetch('http://localhost:5000/auth/upload-profile-pic', {
        method: 'POST',
        body: formData,
      });
      // check if response is ok
      if (response.ok) {
        const data = await response.json();
        return data.imageUrl;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Profile picture upload failed.');
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      return null;
    }
  };

  // handle the account information submission attempt
  const handleSubmit = async (e) => {
    e.preventDefault();

    // perform input validation
    if (fname === "") { console.log("First name is required"); return; }
    if (lname === "") { console.log("Last name is required"); return; }
    if (height === "") { console.log("Height is required"); return; }  
    if (weight === "") { console.log("Weight is required"); return; }
    if (dob === "") { console.log("Date of birth is required"); return; }
    if (gender === "") { console.log("Gender is required"); return; }

    // initialize with current profilePicUrl (default or previously set)
    let finalProfilePicUrl = profilePicUrl; 

    // if a profile pic file is selected, upload it first
    if (profilePicFile) {
      const uploadedUrl = await uploadProfilePic(profilePicFile);
      if (uploadedUrl) {
        finalProfilePicUrl = uploadedUrl; // use the URL if successful
      } else {
        console.log("Profile picture upload failed, cannot submit user information.");
        return;
      }
    }

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
          profile_pic: finalProfilePicUrl,
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
              label="Profile Picture (optional)"
              variant="outlined"
              type="file"
              onChange={handleFileChange}
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