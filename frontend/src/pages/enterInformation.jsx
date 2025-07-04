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
import axios from 'axios';
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
  // const navigate = useNavigate();
  // const { username } = useUser();
  // const { startAudio } = useAudio();
  // const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("");
  // const [height, setHeight] = useState("");
  // const [weight, setWeight] = useState("");
  // const [birthDate, setBirthDate] = useState("");
  // const [gender, setGender] = useState("");
  // const [errors, setErrors] = useState({
  //   firstName: '',
  //   lastName: '',
  //   height: '',
  //   weight: '',
  //   birthDate: '',
  //   gender: '',
  // });
  // // Event handlers to update state variables
  // const handleFirstNameChange = (event) => {
  //   const inputFirstName = event.target.value;
  //   setFirstName(inputFirstName);
  //   setErrors((prevErrors) => ({
  //     ...prevErrors,
  //     firstName: '',
  //   }));
  // };
  // const handleLastNameChange = (event) => {
  //   const inputLastName = event.target.value;
  //   setLastName(inputLastName);
  //   setErrors((prevErrors) => ({
  //     ...prevErrors,
  //     lastName: '',
  //   }));
  // };
  // const handleHeightChange = (event) => {
  //   const inputHeight = event.target.value;
  //   setHeight(inputHeight);
  //   setErrors((prevErrors) => ({
  //     ...prevErrors,
  //     height: '',
  //   }));
  // };
  // const handleWeightChange = (event) => {
  //   const inputWeight = event.target.value;
  //   setWeight(inputWeight);
  //   setErrors((prevErrors) => ({
  //     ...prevErrors,
  //     weight: '',
  //   }));
  // };
  // const handleBirthDateChange = (event) => {
  //   const inputBirthDate = event;
  //   setBirthDate(inputBirthDate);
  //   setErrors((prevErrors) => ({
  //     ...prevErrors,
  //     birthDate: '',
  //   }));
  // };
  // const handleGenderChange = (event) => {
  //   const inputGender = event.target.value;
  //   setGender(inputGender);
  //   setErrors((prevErrors) => ({
  //     ...prevErrors,
  //     gender: '',
  //   }));
  // };
  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   let validationErrors = {
  //     firstName: '',
  //     lastName: '',
  //     height: '',
  //     weight: '',
  //     birthDate: '',
  //     gender: '',
  //   };
  //   // validate fields
  //   let isValid = true;
  //   // check if no first name
  //   if (firstName === "") {
  //     validationErrors.firstName = 'Enter your First Name';
  //     isValid = false;
  //   }
  //   // check if no last name
  //   if (lastName === "") {
  //     validationErrors.lastName = 'Enter your Last Name';
  //     isValid = false;
  //   }
  //   // check if no height
  //   if (height === "") {
  //     validationErrors.height = 'Enter your Height';
  //     isValid = false;
  //   }
  //   // check if no weight
  //   if (weight === "") {
  //     validationErrors.weight = 'Enter your Weight';
  //     isValid = false;
  //   }
  //   // check if no birth date
  //   if (birthDate === "") {
  //     validationErrors.birthDate = 'Enter your Birthday';
  //     isValid = false;
  //   }
  //   // check if no gender
  //   if (gender === "") {
  //     validationErrors.gender = 'Enter your Gender';
  //     isValid = false;
  //   }
  //   if (!isValid) {
  //     setErrors(validationErrors);
  //     return;
  //   }
  //   axios.post(`http://127.0.0.1:5000/user/${username}/stats`, {
  //     fname: firstName,
  //     lname: lastName,
  //     height: height,
  //     weight: weight,
  //     birthday: birthDate,
  //     gender: gender,
  //   })
  //     .then(function (response) {
  //       console.log(response);
  //       navigate('/home');
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // };
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
            {/* <Calendar
              className='textfield'
              id="birthday"
              onChange={(e) => setDob(e.target.value)}
            />
            <FormControl className='textfield'>
              <InputLabel
                id="gender-label"
              >
                Gender
              </InputLabel>
              <Select
                className='textfield'
                labelId="gender-label"
                id="gender"
                label="Gender"
                onChange={(e) => setGender(e.target.value)}
              >
                <MenuItem value={"Male"}>Male</MenuItem>
                <MenuItem value={"Female"}>Female</MenuItem>
                <MenuItem value={"Other"}>Other</MenuItem>
              </Select>
            </FormControl> */}
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
      {/*<div className='enter-information-container'>
        <h1>Enter Information</h1>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <Stack spacing={2} direction="column" width='25ch'>
            <TextField
              className='textfield'
              error={!!errors.firstName}
              id="fname"
              label="First Name"
              variant="outlined"
              helperText={errors.firstName}
              onChange={handleFirstNameChange}
            />
            <TextField
              className='textfield'
              error={!!errors.lastName}
              id="lname"
              label="Last Name"
              variant="outlined"
              helperText={errors.lastName}
              onChange={handleLastNameChange}
            />
            <TextField
              className='textfield'
              error={!!errors.height}
              id="height"
              label="Height (feet)"
              variant="outlined"
              type="number"
              helperText={errors.height}
              onChange={handleHeightChange}
            />
            <TextField
              className='textfield'
              error={!!errors.weight}
              id="weight"
              label="Weight (lbs)"
              variant="outlined"
              type="number"
              helperText={errors.weight}
              onChange={handleWeightChange}
            />
            <Calendar
              className='textfield'
              error={!!errors.birthDate}
              id="birthday"
              helperText={errors.birthDate}
              onChange={handleBirthDateChange}
            />
            <FormControl className='textfield' fullWidth error={!!errors.gender}>
              <InputLabel
                id="gender-label"
              >
                Gender
              </InputLabel>
              <Select
                className='textfield'
                labelId="gender-label"
                id="gender"
                label="Gender"
                value={gender}
                onChange={handleGenderChange}
              >
                <MenuItem value={"Male"}>Male</MenuItem>
                <MenuItem value={"Female"}>Female</MenuItem>
                <MenuItem value={"Other"}>Other</MenuItem>
              </Select>
              {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
            </FormControl>
            <Stack className='button-container' spacing={2} direction="row">
              <Button variant="contained" type="submit">Continue</Button>
            </Stack>
          </Stack>
        </Box>
      </div>*/}
    </div>
  );
}

export default EnterInformation;