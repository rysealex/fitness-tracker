import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import '../styles/index.css'
import Navbar from '../navbar';

function Stats() {
  const [stats, setStats] = useState({});
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

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
    <div className='centered-page'>
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
      </section>
    </div>
  );
};

export default Stats;