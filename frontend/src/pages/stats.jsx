import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useUser } from '../userContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/index.css'
import Navbar from '../navbar';

function Stats() {
  const navigate = useNavigate();
  const handleNavigate = (url) => {
    navigate(url);
  };
  // const { username, setUsername } = useUser();
  const [stats, setStats] = useState({});
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  // const [weightInput, setWeightInput] = useState(stats.weight);
  // const [heightInput, setHeightInput] = useState(stats.height);
  // const [editStats, setEditStats] = useState(false);
  // const [errorHeight, setErrorHeight] = useState(false); 
  // const [errorWeight, setErrorWeight] = useState(false); 
  // const [helperTextHeight, setHelperTextHeight] = useState('');
  // const [helperTextWeight, setHelperTextWeight] = useState('');
  // Event handler for nav bar buttons
  const handleSignOut = (event) => {
    //setUsername("");
    handleNavigate('/');
  };
  const handleClickDashboard = () => {
    handleNavigate('/home');
  };
  const handleClickStats = () => {
    handleNavigate('/stats');
  };
  const handleClickProfile = () => {
    handleNavigate('/profile');
  };
  const handleClickSettings = () => {
    handleNavigate('/settings');
  };
  // // event handler for edit stats use state
  // const handleClickEditStats = () => {
  //   setEditStats(!editStats);
  // }
  // // Event handler for saving the new values
  // const handleSaveWeight = () => {
  //   const updatedStats = { ...stats, weight: weightInput };
  //   setStats(updatedStats);
  //   // Connect to backend here
  //   axios.put(`http://127.0.0.1:5000/user/${username}/stats`, {
  //     weight: weightInput
  //   })
  //     .then(response => {
  //       console.log("Weight updated successfully:", response.data);
  //       axios.get(`http://127.0.0.1:5000/user/${username}/stats`)
  //         .then(function (response) {
  //           setStats(response.data); // Ensure we have the latest stats
  //           setEditStats(false);
  //         })
  //         .catch(function (error) {
  //           console.log(error);
  //         });
  //     })
  //     .catch(error => {
  //       console.log("Error updating weight:", error);
  //     });
  // };
  // const handleSaveHeight = () => {
  //   const updatedStats = { ...stats, height: heightInput };
  //   setStats(updatedStats);
  //   // Connect to backend here
  //   axios.put(`http://127.0.0.1:5000/user/${username}/stats`, {
  //     height: heightInput
  //   })
  //     .then(response => {
  //       console.log("Height updated successfully:", response.data);
  //       axios.get(`http://127.0.0.1:5000/user/${username}/stats`)
  //         .then(function (response) {
  //           setStats(response.data); // Ensure we have the latest stats
  //           setEditStats(false);
  //         })
  //         .catch(function (error) {
  //           console.log(error);
  //         });
  //     })
  //     .catch(error => {
  //       console.log("Error updating height:", error);
  //     });
  // };
  // // Error checking weight input value
  // const handleWeightInputChange = (e) => {
  //   const newValue = e.target.value;
  //   // allow only numbers (positive integers and decimals)
  //   if (/^\d*\.?\d*$/.test(newValue)) {
  //     setWeightInput(newValue);
  //     setErrorWeight(false);
  //     setHelperTextWeight("");
  //   } else {
  //     setErrorWeight(true);
  //     setHelperTextWeight("Enter a valid weight");
  //   }
  // };
  // // Error checking height input value
  // const handleHeightInputChange = (e) => {
  //   const newValue = e.target.value;
  //   // allow only numbers (positive integers and decimals)
  //   if (/^\d*\.?\d*$/.test(newValue)) {
  //     setHeightInput(newValue);
  //     setErrorHeight(false);
  //     setHelperTextHeight("");
  //   } else {
  //     setErrorHeight(true);
  //     setHelperTextHeight("Enter a valid height");
  //   }
  // };
  // // Fetch user stats
  // useEffect(() => {
  //   if (username) {
  //     axios.get(`http://127.0.0.1:5000/user/${username}/stats`)
  //       .then(function (response) {
  //         console.log(response);
  //         setStats(response.data);
  //         setWeightInput(response.data.weight);
  //         setHeightInput(response.data.height);
  //       })
  //       .catch(function (error) {
  //         console.log(error);
  //       });
  //   }
  // }, [username])

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
      } else {
        console.log("Failed to update user stats:", response.statusText);
        return;
      }
    } catch (error) {
      console.error("Error updating user stats:", error);
      return;
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
    <div>
      <Navbar stats={stats} />
      <section className='stats-container'>
        <h1>Your Stats</h1>
          <ul>
            <li>Age: {calculateAge(stats.dob)}</li>
            <li>Gender: {stats.gender}</li>
            <li>
              Height: {stats.height_ft} ft
              <input type="number" required={true} value={height} onChange={(e) => setHeight(e.target.value)} placeholder="Enter new height" />
              <button type="button" onClick={() => handleSubmit('height_ft', parseFloat(height))}>Update Height</button>
            </li>
            <li>
              Weight: {stats.weight_lbs} lbs
              <input type="number" required={true} value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Enter new weight" />
              <button type="button" onClick={() => handleSubmit('weight_lbs', parseFloat(weight))}>Update Weight</button>
            </li>
          </ul>
        {/* {editStats && (
          <>
          <div className='enter-height-container'>
            <TextField
              label="Enter Height"
              variant="outlined"
              value={heightInput}
              placeholder="Enter Height"
              error={errorHeight}
              helperText={helperTextHeight}
              onChange={handleHeightInputChange}
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
              variant='contained'
              style={{marginTop: '15px',
                backgroundColor: '#C51D34',
                marginLeft: '2em',
                marginTop: '3em'
              }} 
              onClick={handleSaveHeight}>
                Save Height
            </Button>
          </div>
          <div className='enter-weight-container'>
          <TextField
              label="Enter Weight"
              variant="outlined"
              value={weightInput}
              placeholder="Enter Weight"
              error={errorWeight}
              helperText={helperTextWeight}
              onChange={handleWeightInputChange}
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
              variant='contained'
              style={{marginTop: '15px',
                backgroundColor: '#C51D34',
                marginLeft: '2em',
                marginTop: '3em'
              }} 
              onClick={handleSaveWeight}>
                Save Weight
            </Button>
          </div>
          </>
        )} */}
        {/* <Button 
          variant="contained" 
          style={{marginTop: '15px',
            backgroundColor: '#C51D34'
          }}
          onClick={handleClickEditStats}>
            {editStats ? "Exit Edit" : "Edit Stats"}
        </Button> */}
      </section>
    </div>
  );
};

export default Stats;