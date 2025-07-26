import { useState, useRef } from 'react';
import { useStats } from '../StatsContext';
import { Edit } from '@mui/icons-material';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';
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
  const [isEditing, setIsEditing] = useState(false);

  // refs for the input fields
  const heightInputRef = useRef(null);
  const weightInputRef = useRef(null);

  // get the stats from context
  const { stats, isLoading, error, setStats } = useStats();
  if (isLoading) return <div>Loading home page...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!stats) return <div>No stats available.</div>;

  // open modal to edit
	const openEditModal = () => {
    setIsEditing(false);
    setEditEntry({
      height_ft: stats.height_ft,
      weight_lbs: stats.weight_lbs,
    });
		// clear previous edit errors when opening the modal
    setWeightError("");
    setHeightError("");
    setGeneralError("");
		setEditModalOpen(true);
	};

  // close modal
	const closeEditModal = () => {
    setIsEditing(false);
		setEditModalOpen(false);
    setEditEntry(null);
		// clear edit errors when closing the modal
    setWeightError("");
    setHeightError("");
    setGeneralError("");
	};

  // handle input changes in the edit modal
	const handleEditChange = (e) => {
    setIsEditing(true);
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
  const handleSubmit = async () => {
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

    // perform height validation
    const parsedHeight = parseFloat(editEntry.height_ft);
    if (editEntry.height_ft === "") {
      setHeightError("Enter your new height.");
      heightInputRef.current.focus();
      setIsLoadingStats(false);
      return;
    } else if (isNaN(parsedHeight) || !/^\d+\.?\d{0,1}$/.test(editEntry.height_ft)) {
      setHeight("");
      setHeightError("New height must be a decimal to the tenth place (e.g., 5.9).");
      heightInputRef.current.focus();
      setIsLoadingStats(false);
      return;
    }
    // perform weight validation
    const parsedWeight = parseFloat(editEntry.weight_lbs);
    if (editEntry.weight_lbs === "") {
      setWeightError("Enter your new weight.");
      weightInputRef.current.focus();
      setIsLoadingStats(false);
      return;
    } else if (isNaN(parsedWeight) || !/^\d+\.?\d{0,2}$/.test(editEntry.weight_lbs)) {
      setWeight("");
      setWeightError("New weight must be a decimal to the hundredth place (e.g., 150.75).");
      weightInputRef.current.focus();
      setIsLoadingStats(false);
      return;
    }

    try {
      console.log("Sending update:", {
        userId,
        height_ft: parseFloat(editEntry.height_ft),
        weight_lbs: parseFloat(editEntry.weight_lbs)
      });
      // try to update the user stats with current attribute and value
      const response = await fetch(`http://localhost:5000/auth/user/${userId}/update-height-weight`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          height_ft: parseFloat(editEntry.height_ft),
          weight_lbs: parseFloat(editEntry.weight_lbs)
        }),
      });
      // check if the response is ok
      if (response.ok) {
        const data = await response.json();
        console.log("User stats updated successfully:", data);
        // update the stats state to keep it consistent with new values
        setStats(prevStats => ({
          ...prevStats,
          height_ft: editEntry.height_ft,
          weight_lbs: editEntry.weight_lbs
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
        setGeneralError("Must enter a new height and weight.");
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
          <Box sx={{ position: 'relative' }} className="profile-info-section">
            {/* Edit Button */}
            <IconButton
              color="primary"
              onClick={openEditModal}
              sx={{
                position: 'absolute',
                top: -20, 
                right: 8, 
                backgroundColor: 'rgba(0,0,0,0.6)',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.8)',
                },
                color: '#fff',
                borderRadius: '50%',
                padding: '8px',
                zIndex: 10,
              }}
            >
              <Edit />
            </IconButton>
            <ul>
              <li>Age: {calculateAge(stats.dob)}</li>
              <li>Gender: {stats.gender}</li>
              <li>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <div>
                    Height: {stats.height_ft} ft
                  </div>
                </Box>
              </li>
              <li>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <div>
                    Weight: {stats.weight_lbs} lbs
                  </div>
                </Box>
              </li>
            </ul>
          </Box>
        </div>
        {/* <div className='profile-content-wrapper'>
          <div className='profile-info-section'>
            <IconButton
              color="primary"
              onClick={openEditModal}
              sx={{
                position: 'absolute',
                top: -15, 
                right: -15, 
                backgroundColor: 'rgba(0,0,0,0.6)',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.8)',
                },
                color: '#fff',
                borderRadius: '50%',
                padding: '8px',
                zIndex: 10,
              }}
            >
              <Edit />
            </IconButton>
            <ul>
              <li>Age: {calculateAge(stats.dob)}</li>
              <li>Gender: {stats.gender}</li>
              <li>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <div>
                    Height: {stats.height_ft} ft
                  </div>
                </Box>
              </li>
              <li>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <div>
                    Weight: {stats.weight_lbs} lbs
                  </div>
                </Box>
              </li>
            </ul>
          </div>
        </div> */}
        {successMessage && (
          <Box sx={{ color: '#1dc51dff', mt: 2, textAlign: 'center' }}>
            {successMessage}
          </Box>
        )}
      </section>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onClose={closeEditModal}>
        <DialogTitle>Edit Stats</DialogTitle>
        <DialogContent>
          {editEntry && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
              <TextField
                name="height_ft"
                label="Height (ft)"
                type="number"
                fullWidth
                value={editEntry.height_ft}
                onChange={handleEditChange}
                error={!!heightError}
                helperText={heightError}
                inputRef={heightInputRef}
              />
              <TextField
                name="weight_lbs"
                label="Weight (lbs)"
                type="number"
                fullWidth
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
          {isEditing && (
            <Button 
            onClick={ () => handleSubmit() }
            >
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Stats;