import { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import '../styles/index.css'
import Navbar from '../navbar';

function Stats() {
  const [stats, setStats] = useState({});
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [successMessage, setSuccessMessage] = useState("");
  const [weightError, setWeightError] = useState("");
  const [heightError, setHeightError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // refs for the input fields
  const heightInputRef = useRef(null);
  const weightInputRef = useRef(null);

  // fetch user stats function
  const fetchStats = async () => {
    // get the current users user_id from local storage
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error("User ID not found in local storage.");
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/auth/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
        console.log("User stats fetched successfully:", data);
      } else {
        console.error("Failed to fetch user stats:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };
  // fetch user stats on component mount
  useEffect(() => {
    fetchStats();
  }, []);

  // handle the update stats form submission
  const handleSubmit = async (attributeInput, valueInput) => {
    // get the current users user_id from local storage
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error("User ID not found in local storage.");
      return;
    }

    // start loading state
    setIsLoading(true);

    // clear previous errors and success messages
    setWeightError("");
    setHeightError("");
    setGeneralError("");
    setSuccessMessage("");

    let hasError = false;

    // check which attribute is being updated
    if (attributeInput === "height_ft") {
      // perform height validation
      const parsedHeight = parseFloat(height);
      if (height === "") {
        setHeightError("Enter your new height.");
        hasError = true;
        heightInputRef.current.focus();
      } else if (isNaN(parsedHeight) || !/^\d+\.?\d{0,1}$/.test(height)) {
        setHeight("");
        setHeightError("New height must be a decimal to the tenth place (e.g., 5.9).");
        hasError = true;
        heightInputRef.current.focus();
      }
    } 
    else if (attributeInput === "weight_lbs") {
      // perform weight validation
      const parsedWeight = parseFloat(weight);
      if (weight === "") {
        setWeightError("Enter your new weight.");
        hasError = true;
        weightInputRef.current.focus();
      } else if (isNaN(parsedWeight) || !/^\d+\.?\d{0,2}$/.test(weight)) {
        setWeight("");
        setWeightError("New weight must be a decimal to the hundredth place (e.g., 150.75).");
        hasError = true;
        weightInputRef.current.focus();
      }
    } 
    else {
      // stop the submission now
      setHeight("");
      setWeight("");
      setGeneralError("An unexpected error occurred.");
      return;
    }

    if (hasError) {
      setIsLoading(false);
      return; // stop if input validation failed
    }

    try {
      // try to update the user stats with current attribute and value
      const response = await fetch(`http://localhost:5000/auth/update-attribute/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          attribute: attributeInput,
          value: valueInput
        }),
      });
      // check if the response is ok
      if (response.ok) {
        const data = await response.json();
        console.log("User stats updated successfully:", data);
        fetchStats(); // fetch the updated stats
        // clear the inputs
        setHeight("");
        setWeight("");
        setIsLoading(false);
        // display success message
        setSuccessMessage("Successfuly updated stats!");
        // clear the success message after 3 sec
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
        
      } else {
        setHeight("");
        setWeight("");
        setSuccessMessage("");
        setIsLoading(false);
        setGeneralError("Stats update submission failed.");
        console.log("Failed to update user stats:", response.statusText);
      }
    } catch (error) {
      setHeight("");
      setWeight("");
      setSuccessMessage("");
      setIsLoading(false);
      setGeneralError("Error updating user stats.");
      console.error("Error updating user stats:", error);
    }
  };

  // function to calculate the user's age from the date of birth
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className='centered-page'>
      <Navbar stats={stats} />
      <section className='stats-container'>
        <h1>Your Stats</h1>
        <ul>
          <li>Age: {calculateAge(stats.dob)}</li>
          <li>Gender: {stats.gender}</li>
          <li>
            Height: {stats.height_ft} ft
            <TextField
              className='textfield'
              error={!!heightError}
              id="height-input"
              label="New height"
              variant="outlined"
              value={height}
              onChange={(e) => {
                setHeight(e.target.value);
                setHeightError(""); // clear error when user starts typing
              }}
              helperText={heightError}
              inputRef={heightInputRef}
            />
            <button type="button" onClick={() => handleSubmit('height_ft', parseFloat(height))}>Update Height</button>
          </li>
          <li>
            Weight: {stats.weight_lbs} lbs
            <TextField
              className='textfield'
              error={!!weightError}
              id="weight-input"
              label="New weight"
              variant="outlined"
              value={weight}
              onChange={(e) => {
                setWeight(e.target.value);
                setWeightError(""); // clear error when user starts typing
              }}
              helperText={weightError}
              inputRef={weightInputRef}
            />
            <button type="button" onClick={() => handleSubmit('weight_lbs', parseFloat(weight))}>Update Weight</button>
          </li>
        </ul>
      </section>
      {isLoading && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <CircularProgress sx={{ color: '#C51D34' }} />
        </Box>
      )}
      {successMessage && (
        <Box sx={{ color: '#1dc51dff', mt: 2, textAlign: 'center' }}>
          {successMessage}
        </Box>
      )}
      {generalError && (
        <Box sx={{ color: '#C51D34', mt: 2, textAlign: 'center' }}>
          {generalError}
        </Box>
      )}
    </div>
  );
};

export default Stats;