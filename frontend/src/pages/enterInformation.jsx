import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import CircularProgress from '@mui/material/CircularProgress';

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
  const [isLoading, setIsLoading] = useState(false);

  // error usestates
  const [fnameError, setFnameError] = useState("");
  const [lnameError, setLnameError] = useState("");
  const [heightError, setHeightError] = useState("");
  const [weightError, setWeightError] = useState("");
  const [dobError, setDobError] = useState("");
  const [genderError, setGenderError] = useState(""); 
  const [profilePicError, setProfilePicError] = useState("");
  const [generalError, setGeneralError] = useState("");

  // refs for the input fields
  const fnameInputRef = useRef(null);
  const lnameInputRef = useRef(null);
  const heightInputRef = useRef(null);
  const weightInputRef = useRef(null);
  const dobInputRef = useRef(null);
  const genderInputRef = useRef(null);

  // handle the redirect to login page
  const handleLoginRedirect = () => {
    // clear user data from local storage
    localStorage.removeItem('username');
		localStorage.removeItem('password');
    handleNavigate('/login');
  };

  // handle the file change event for the profile pic
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicFile(file);
      setProfilePicError("");
    } else {
      setProfilePicFile(null);
      setProfilePicUrl("/images/default-profile-icon.jpg"); // reset to default
      setProfilePicError("Error uploading profile picture.");
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
        setProfilePicError(errorData.message || 'Profile picture upload failed.');
      }
    } catch (error) {
      setProfilePicError("Error uploading profile picture.");
      console.error('Error uploading profile picture:', error);
      return null;
    }
  };

  // handle the account information submission attempt
  const handleSubmit = async (e) => {
    e.preventDefault();

    // set loading state
    setIsLoading(true);

    // clear previous errors
    setFnameError("");
    setLnameError("");
    setHeightError("");
    setWeightError("");
    setDobError("");
    setGenderError("");
    setProfilePicError("");

    let hasError = false;

    // perform input validation
    if (fname === "") { 
      setFnameError("Enter your first name."); 
      hasError = true; 
      fnameInputRef.current.focus(); 
    }
    else if (lname === "") { 
      setLnameError("Enter your last name."); 
      hasError = true; 
      lnameInputRef.current.focus(); 
    }
    // height validation
    else if (height === "") {
      setHeightError("Enter your height.");
      hasError = true;
      heightInputRef.current.focus();
    } else if (isNaN(parseFloat(height)) || !/^\d+\.?\d{0,1}$/.test(height)) {
      setHeight("");
      setHeightError("Height must be a decimal to the tenth place (e.g., 5.9).");
      hasError = true;
      heightInputRef.current.focus();
    }
    // weight validation
    else if (weight === "") {
      setWeightError("Enter your weight.");
      hasError = true;
      weightInputRef.current.focus();
    } else if (isNaN(parseFloat(weight)) || !/^\d+\.?\d{0,2}$/.test(weight)) {
      setWeight("");
      setWeightError("Weight must be a decimal to the hundredth place (e.g., 150.75).");
      hasError = true;
      weightInputRef.current.focus();
    }
    else if (dob === "") { 
      setDobError("Enter your date of birth."); 
      hasError = true; 
      dobInputRef.current.focus(); 
    }
    else if (gender === "") { 
      setGenderError("Enter your gender.");
      hasError = true; 
      genderInputRef.current.focus(); 
    }

    if (hasError) {
      setIsLoading(false);
      return; // stop if input validation failed
    }

    // initialize with current profilePicUrl (default or previously set)
    let finalProfilePicUrl = profilePicUrl; 

    // if a profile pic file is selected, upload it first
    if (profilePicFile) {
      const uploadedUrl = await uploadProfilePic(profilePicFile);
      if (uploadedUrl) {
        finalProfilePicUrl = uploadedUrl; // use the URL if successful
      } else {
        setIsLoading(false);
        setProfilePicError("Profile picture upload failed.")
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
          height_ft: parseFloat(height),
          weight_lbs: parseFloat(weight),
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
        setIsLoading(false);
        handleNavigate("/home");
        //window.location.reload(); // reload home page to reflect new user data
      } else {
        setFname("");
        setLname("");
        setHeight("");
        setWeight("");
        setDob("");
        setGender("");
        setIsLoading(false);
        fnameInputRef.current.focus();
        setGeneralError("Account information submission failed.");
        console.log('Account information submission failed:', response.statusText);
      }
    } catch (error) {
      setFname("");
      setLname("");
      setHeight("");
      setWeight("");
      setDob("");
      setGender("");
      setIsLoading(false);
      fnameInputRef.current.focus();
      setGeneralError("Error during account information submission.");
      console.error('Error during account information submission:', error);
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
              error={!!fnameError}
              id="fname-input"
              label="First Name"
              variant="outlined"
              value={fname}
              onChange={(e) => {
                setFname(e.target.value);
                setFnameError(""); // clear error when user starts typing
              }}
              helperText={fnameError}
              inputRef={fnameInputRef}
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
              error={!!lnameError}
              id="lname-input"
              label="Last Name"
              value={lname}
              onChange={(e) => {
                setLname(e.target.value);
                setLnameError(""); // clear error when user starts typing
              }}
              helperText={lnameError}
              inputRef={lnameInputRef}
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
              error={!!heightError}
              id="height-input"
              label="Height (feet)"
              variant="outlined"
              type="text"
              value={height}
              onChange={(e) => {
                setHeight(e.target.value);
                setHeightError(""); // clear error when user starts typing
              }}
              helperText={heightError}
              inputRef={heightInputRef}
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
              error={!!weightError}
              id="weight-input"
              label="Weight (lbs)"
              variant="outlined"
              type="text"
              value={weight}
              onChange={(e) => {
                setWeight(e.target.value);
                setWeightError(""); // clear error when user starts typing
              }}
              helperText={weightError}
              inputRef={weightInputRef}
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
              error={!!dobError}
              id="dob-input"
              variant="outlined"
              type="date"
              value={dob}
              onChange={(e) => {
                setDob(e.target.value);
                setDobError(""); // clear error when user starts typing
              }}
              helperText={dobError}
              inputRef={dobInputRef}
              style={{padding: '10px',
                marginTop: '25px',
                border: 'none',
                borderRadius: '10px',
                background: 'transparent',
                border: '1px solid #fff',
                color: '#fff',
                fontSize: '13px'}}
            />
            {/* <TextField
              className='textfield'
              error={!!genderError}
              id="gender-input"
              label="Gender"
              variant="outlined"
              type="text"
              value={gender}
              onChange={(e) => {
                setGender(e.target.value);
                setGenderError(""); // clear error when user starts typing
              }}
              helperText={genderError}
              style={{padding: '10px',
                marginTop: '25px',
                border: 'none',
                borderRadius: '10px',
                background: 'transparent',
                border: '1px solid #fff',
                color: '#fff',
                fontSize: '13px'}}
            /> */}
            <FormControl
              variant="outlined"
              error={!!genderError}
            >
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                id="gender-select"
                value={gender}
                label="Gender"
                onChange={(e) => {
                  setGender(e.target.value);
                  setGenderError("");
                }}
                inputRef={genderInputRef}
                style={{padding: '10px',
                  marginTop: '25px',
                  border: 'none',
                  borderRadius: '10px',
                  background: 'transparent',
                  border: '1px solid #fff',
                  color: '#fff',
                  fontSize: '13px'}}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
              {genderError && <FormHelperText sx={{ color: '#d32f2f' }}>{genderError}</FormHelperText>}
            </FormControl>
            <TextField
              className='textfield'
              error={!!profilePicError}
              id="profile-pic-input"
              variant="outlined"
              type="file"
              onChange={handleFileChange}
              helperText={profilePicError}
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
              id="occupation-input"
              label="Occupation"
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
            {isLoading && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <CircularProgress sx={{ color: '#C51D34' }} />
              </Box>
            )}
            {generalError && (
              <Box sx={{ color: '#C51D34', mt: 2, textAlign: 'center' }}>
                {generalError}
              </Box>
            )}
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
          <p>Already have an account? 
            <a href="" onClick={handleLoginRedirect}>    Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default EnterInformation;