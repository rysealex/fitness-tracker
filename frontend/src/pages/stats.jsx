import { useState, useRef } from 'react';
import { useStats } from '../StatsContext';
import { Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import '../styles/index.css'
import Navbar from '../navbar';

function Stats() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [successMessage, setSuccessMessage] = useState("");
  const [weightError, setWeightError] = useState("");
  const [heightError, setHeightError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editEntry, setEditEntry] = useState(null);

  // refs for the input fields
  const heightInputRef = useRef(null);
  const weightInputRef = useRef(null);

  // get the stats from context
  const { stats, isLoading, error, setStats } = useStats();
  if (isLoading) return <div>Loading home page...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!stats) return <div>No stats available.</div>;

  // open modal to edit
	const openEditModal = (entry) => {
    setEditEntry({ ...entry });
		// clear previous edit errors when opening the modal
    setWeightError("");
    setHeightError("");
    setGeneralError("");
		setEditModalOpen(true);
	};

  // close modal
	const closeEditModal = () => {
		setEditModalOpen(false);
    setEditEntry(null);
		// clear edit errors when closing the modal
    setWeightError("");
    setHeightError("");
    setGeneralError("");
	};

  // handle input changes in the edit modal
	const handleEditChange = (e) => {
		const { name, value } = e.target;
		setEditEntry((prev) => ({
			...prev,
			[name]: value,
		}));
		// clear specific error when user starts typing in edit modal
    if (name === "weight_lbs") setWeightError("");
    if (name === "height_ft") setHeightError("");
	};

  // handle the update stats form submission
  const handleSubmit = async (attributeInput, valueInput) => {
    // get the current users user_id from local storage
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error("User ID not found in local storage.");
      return;
    }

    // start loading state
    setIsLoadingStats(true);

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
      setIsLoadingStats(false);
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
        // update the stats state to keep it consistent with new values
        setStats(prevStats => ({
          ...prevStats,
          [attributeInput]: valueInput
        }));
        // clear the inputs
        setHeight("");
        setWeight("");
        setIsLoadingStats(false);
        // close edit modal
        closeEditModal();
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
        setIsLoadingStats(false);
        setGeneralError("Stats update submission failed.");
        console.log("Failed to update user stats:", response.statusText);
      }
    } catch (error) {
      setHeight("");
      setWeight("");
      setSuccessMessage("");
      setIsLoadingStats(false);
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
      <Navbar />
      <section className='profile-container'>
        <h1>Your Stats</h1>
        <div className='profile-content-wrapper'>
          {/* User Info Section */}
          <div className='profile-info-section'>
            <ul>
              <li>Age: {calculateAge(stats.dob)}</li>
              <li>Gender: {stats.gender}</li>
              <li>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <div>
                    Height: {stats.height_ft} ft
                  </div>
                  {/* <TextField
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
                    size="small"
                    sx={{ width: 100 }}
                  />
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: '#C51D34'
                    }}
                    onClick={() => handleSubmit('height_ft', parseFloat(height))}
                  >
                    Update
                  </Button> */}
                </Box>
              </li>
              <li>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <div>
                    Weight: {stats.weight_lbs} lbs
                  </div>
                  <button
                    onClick={() => openEditModal()}
                  >
                    Edit
                  </button>
                  {/* <TextField
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
                    size="small"
                    sx={{ width: 100 }}
                  />
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: '#C51D34'
                    }}
                    onClick={() => handleSubmit('weight_lbs', parseFloat(weight))}
                  >
                    Update
                  </Button> */}
                </Box>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onClose={closeEditModal}>
        <DialogTitle>Edit Stats</DialogTitle>
        <DialogContent>
          {editEntry && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
              <TextField
                margin="dense"
                name="height_ft"
                label="Height (ft)"
                type="number"
                fullWidth
                variant="outlined"
                value={editEntry.height_ft}
                onChange={handleEditChange}
                error={!!heightError}
                helperText={heightError}
                inputRef={heightInputRef}
              />
              <TextField
                margin="dense"
                name="weight_lbs"
                label="Weight (lbs)"
                type="number"
                fullWidth
                variant="outlined"
                value={editEntry.weight_lbs}
                onChange={handleEditChange}
                error={!!weightError}
                helperText={weightError}
                inputRef={weightInputRef}
              />
              {isLoadingStats && (
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
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditModal}>
            Cancel
          </Button>
          <Button 
            onClick={
              () => {
                if (
                  parseFloat(height) === stats.height_ft &&
                  parseFloat(weight) === stats.weight_lbs
                ) {
                  setGeneralError("No changes made to stats.");
                  return;
                }
                handleSubmit('height_ft', parseFloat(height));
                handleSubmit('weight_lbs', parseFloat(weight));
              }}
            >
              Save
            </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Stats;