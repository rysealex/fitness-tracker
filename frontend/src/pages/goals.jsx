import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { Button, Dialog, DialogContent, DialogActions, DialogTitle, TextField, Box, MenuItem, Typography } from "@mui/material";
import '../styles/index.css'

function Goals() {
	const navigate = useNavigate();
		const handleNavigate = (url) => {
		navigate(url);
	};

	const [goalTitle, setGoalTitle] = useState("");
	const [goalType, setGoalType] = useState("");
	const [goals, setGoals] = useState([]);
    const [addModalOpen, setAddModalOpen] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [editGoal, setEditGoal] = useState(null);

    // error states for add modal
    const [addGoalTitleError, setAddGoalTitleError] = useState("");
    const [addGoalTypeError, setAddGoalTypeError] = useState("");
    const [addGeneralError, setAddGeneralError] = useState("");

    // error states for edit modal
    const [editGoalTitleError, setEditGoalTitleError] = useState("");
    const [editGoalTypeError, setEditGoalTypeError] = useState("");
    const [editStatusError, setEditStatusError] = useState("");
    const [editGeneralError, setEditGeneralError] = useState("");

    // refs for add modal inputs
	const addGoalTitleRef = useRef(null);
	const addGoalTypeRef = useRef(null);

	// refs for edit modal inputs
	const editGoalTitleRef = useRef(null);
	const editGoalTypeRef = useRef(null);
	const editStatusRef = useRef(null);

	// open the edit modal and set entry to edit
	const openEditModal = (entry) => {
		setEditGoal({ ...entry });
        setEditGoalTitleError("");
        setEditGoalTypeError("");
        setEditStatusError("");
		setEditModalOpen(true);
	};

	// close the edit modal
	const closeEditModal = () => {
		setEditModalOpen(false);
        setEditGoalTitleError("");
        setEditGoalTypeError("");
        setEditStatusError("");
		setEditGoal(null);
	};

	// handle input changes in the edit modal
	const handleEditChange = (e) => {
		const { name, value } = e.target;
		setEditGoal((prev) => ({
			...prev,
			[name]: value,
		}));
        // clear specific error when user starts typing in edit modal
        if (name === "goal_title") setEditGoalTitleError("");
        if (name === "goal_type") setEditGoalTypeError("");
        if (name === "status") setEditStatusError("");
	};

	// function to handle the goal submission attempt
	const handleSubmit = async (e) => {
		e.preventDefault();

        // clear previous errors
        setAddGoalTitleError("");
        setAddGoalTypeError("");
        setAddGeneralError("");

        let hasError = false;

		// perform input validation
        if (goalTitle === "") {
            setAddGoalTitleError("Goal title is required.");
            hasError = true;
            addGoalTitleRef.current.focus();
        }
        else if (goalType === "") {
            setAddGoalTypeError("Goal type is required.");
            hasError = true;
            addGoalTypeRef.current.focus();
        }
        if (hasError) return; // stop if input validation failed
        
        // get the JWT token from local storage
		const token = localStorage.getItem('token');

		// if token does not exist, user is not authenticated
		if (!token) {
			console.error("User is not authenticated.");
			return;
		}
        
        // proceed with form submission
        try {
            console.log("Submitting goal now!");
            const response = await fetch('http://localhost:5000/goal/add', {
                method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}` // use the JWT token for authentication
				},
                body: JSON.stringify({
                    // user_id: localStorage.getItem('userId'), // get user id from local storage
                    goal_title: goalTitle,
                    goal_type: goalType
                }),
            });
            // check if the response is ok
            if (response.ok) {
                const data = await response.json();
                console.log("Goal submitted successfully:", data);
                // fetch the goals to update UI for new goal added
                fetchGoals();
                // clear the input fields
                setGoalTitle("");
                setGoalType("");
                setAddModalOpen(false); // close modal on success
            } else {
                setAddGeneralError("Failed to add goal. Please try again.");
                console.log("Failed to submit goal:", response.statusText);
            }
        } catch (error) {
            setAddGeneralError("Error adding goal. Please try again.");
            console.error("Error submitting goal:", error);
        }
	};

	// function to handle the edit of a goal
	const handleEditGoal = async (goal_id) => {

        // clear previous errors
        setEditGoalTitleError("");
        setEditGoalTypeError("");
        setEditStatusError("");
        setEditGeneralError("");

        let hasError = false;

        // perform input validation
        if (editGoal.goal_title === "") {
            setEditGoalTitleError("Goal title is required.");
            hasError = true;
            editGoalTitleRef.current.focus();
        }
        else if (editGoal.goal_type === "") {
            setEditGoalTypeError("Goal type is required.");
            hasError = true;
            editGoalTypeRef.current.focus();
        }
        else if (editGoal.status === "") {
            setEditStatusError("Status is required.");
            hasError = true;
            editStatusRef.current.focus();
        }
        if (hasError) return; // stop if input validation failed
        // continue with the API call
		try {
			const response = await fetch(`http://localhost:5000/goal/edit/${goal_id}`, {
				method: 'PUT',
				headers: {
						'Content-Type': 'application/json',
				},
				body: JSON.stringify({
						goal_title: editGoal.goal_title,
						goal_type: editGoal.goal_type,
						status: editGoal.status
				}),
			});
			if (response.ok) {
				const data = await response.json();
				console.log("Goal edited successfully: ", data);
				// close the edit modal
				closeEditModal();
				// fetch the goals to update UI for goal edited
				fetchGoals();
			} else {
                setEditGeneralError("Failed to update goal. Please try again.");
				console.error("Failed to update goal:", response.statusText);
			}
		} catch (error) {
            setEditGeneralError("Error updating goal. Please try again.");
			console.error("Error updating goal:", error);
		}
	};

	// function to handle the deletion of a goal
	const handleDeleteGoal = async (goal_id) => {
		try {
			const response = await fetch(`http://localhost:5000/goal/delete/${goal_id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			if (response.ok) {
				const data = await response.json();
				console.log("Food entry deleted successfully:", data);
				// fetch the goals to update UI for goal deleted
				fetchGoals();
			} else {
				console.error("Failed to delete goal:", response.statusText);
			}
		} catch (error) {
			console.error("Error deleting goal:", error);
		}
	};

	// function to fetch goals for the current user
	const fetchGoals = async () => {
		// // get the current users user_id from local storage
		// const userId = localStorage.getItem('userId');
		// if (!userId) {
		// 	console.error("User ID not found in local storage.");
		// 	return;
		// }

        // get the JWT token from local storage
		const token = localStorage.getItem('token');

		// if token does not exist, user is not authenticated
		if (!token) {
			console.error("User is not authenticated.");
			return;
		}

		// continue with the goals fetch
		try {
			const response = await fetch(`http://localhost:5000/goal/entriesbyuser`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}` // use the JWT token for authentication
				}
			});
			if (response.ok) {
				const data = await response.json();
				setGoals(data); // update goals state
				console.log("Goals for current user fetched successfully:", data);
			} else {
				console.error("Failed to fetch goals for current user:", response.statusText);
			}
		} catch (error) {
			console.error("Error fetching goals for current user:", error);
		}
	};

	// useEffect to fetch goals on component mount
	useEffect(() => {
		fetchGoals();
	}, []);

    // helper function to format date
    const formattedDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

	// helper function to group goals by type
    const groupGoalsByType = (goalsArray) => {
        return goalsArray.reduce((acc, goal) => {
            const type = goal.goal_type
            if (!acc[type]) {
                acc[type] = [];
            }
            acc[type].push(goal);
            return acc;
        }, {});
    };

	// filter goals by status
    const activeGoals = goals.filter(goal => goal.status === 'Active');
    const completedGoals = goals.filter(goal => goal.status === 'Completed');
    const abandonedGoals = goals.filter(goal => goal.status === 'Abandoned');

    // group filtered goals by type
    const groupedActiveGoals = groupGoalsByType(activeGoals);
    const groupedCompletedGoals = groupGoalsByType(completedGoals);
    const groupedAbandonedGoals = groupGoalsByType(abandonedGoals);

	// function to render each goal types section
	const renderGoalSection = (title, groupedGoals) => (
        <div className="goal-section">
            <h2 className="goal-section-title">{title}</h2>
            {Object.entries(groupedGoals).length > 0 ? (
                Object.entries(groupedGoals).map(([type, goalsOfType]) => (
                    <div key={type} className="goal-type-group">
                        <h3 className="goal-type-title">{type}</h3>
                        <div className="goal-list">
                            {goalsOfType.map((goal) => (
                                <div key={goal.goal_id} className="goal-card">
                                    <h4 className="goal-card-title">{goal.goal_title}</h4>
                                    <p className="goal-card-text">Start Date: {formattedDate(goal.start_date)}</p>
                                    <p className="goal-card-text">End Date: {goal.end_date ? formattedDate(goal.end_date) : "N/A"}</p>
                                    <p className="goal-card-text">Status: <span className={`goal-status-${goal.status.toLowerCase()}`}>{goal.status}</span></p>
                                    <div className="goal-card-actions">
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => openEditModal(goal)}
                                            className="edit-button"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            color="error"
                                            onClick={() => handleDeleteGoal(goal.goal_id)}
                                            className="delete-button"
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <p className="no-goals-message">No goals in this section.</p>
            )}
        </div>
    );

	return (
		<div className="goals-container">
            <div className="max-w-7xl">
                {/* Header and Exit Button */}
                <div className="header-section">
                    <Typography variant="h4" component="h1" className="page-title">
                        Your Goals
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => setAddModalOpen(true)}
                    >
                        Add New Goal
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => handleNavigate('/home')}
                        className="exit-button"
                    >
                        Exit
                    </Button>
                </div>

                {/* Add New Goal Section */}
                {/* <div className="add-goal-section">
                    <h2 className="add-goal-title">Add New Goal</h2>
                    <form onSubmit={handleSubmit} className="add-goal-form">
                        <TextField
                            label="Goal Title"
                            variant="outlined"
                            value={goalTitle}
                            onChange={(e) => setGoalTitle(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Goal Type"
                            variant="outlined"
                            value={goalType}
                            onChange={(e) => setGoalType(e.target.value)}
                            select
                            fullWidth
                        >
                            <MenuItem value="Weight Loss">Weight Loss</MenuItem>
                            <MenuItem value="Strength Gain">Strength Gain</MenuItem>
                            <MenuItem value="Cardio Endurance">Cardio Endurance</MenuItem>
                            <MenuItem value="Flexibility">Flexibility</MenuItem>
                            <MenuItem value="Nutrition">Nutrition</MenuItem>
                            <MenuItem value="Overall Health">Overall Health</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </TextField>
                        <Button
                            type="submit"
                            variant="contained"
                            className="add-goal-button"
                        >
                            Add Goal
                        </Button>
                    </form>
                </div> */}

                {/* Goal Status Sections */}
                <div className="goal-status-sections">
                    {renderGoalSection("Active Goals", groupedActiveGoals)}
                    {renderGoalSection("Completed Goals", groupedCompletedGoals)}
                    {renderGoalSection("Abandoned Goals", groupedAbandonedGoals)}
                </div>
            </div>

            {/* Add goal modal */}
            <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)} PaperProps={{ className: "MuiDialog-paper" }}>
                <DialogTitle className="MuiDialogTitle-root">Add New Goal</DialogTitle>
                <DialogContent className="MuiDialogContent-root">
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <TextField
                            label="Goal Title"
                            name="goal_title"
                            value={goalTitle}
                            onChange={(e) => {
                                setGoalTitle(e.target.value);
                                setAddGoalTitleError("");
                            }}
                            error={!!addGoalTitleError}
                            helperText={addGoalTitleError}
                            inputRef={addGoalTitleRef}
                            fullWidth
                            variant="outlined"
                        />
                        <TextField
                            label="Goal Type"
                            name="goal_type"
                            value={goalType}
                            onChange={(e) => {
                                setGoalType(e.target.value);
                                setAddGoalTitleError("");
                            }}
                            select
                            error={!!addGoalTypeError}
                            helperText={addGoalTypeError}
                            inputRef={addGoalTypeRef}
                            fullWidth
                            variant="outlined"
                        >
                            <MenuItem value="Weight Loss">Weight Loss</MenuItem>
                            <MenuItem value="Strength Gain">Strength Gain</MenuItem>
                            <MenuItem value="Cardio Endurance">Cardio Endurance</MenuItem>
                            <MenuItem value="Flexibility">Flexibility</MenuItem>
                            <MenuItem value="Nutrition">Nutrition</MenuItem>
                            <MenuItem value="Overall Health">Overall Health</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </TextField>
                        {addGeneralError && (
                            <Typography color="error" variant="body2" sx={{ textAlign: 'center' }}>
                                {addGeneralError}
                            </Typography>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions className="MuiDialogActions-root">
                    <Button onClick={() => {
                        setAddModalOpen(false);
                        setGoalTitle("");
                        setGoalType("");
                        setAddGoalTitleError("");
                        setAddGoalTypeError("");
                        setAddGeneralError("");
                    }}>Cancel</Button>
                    <Button
                        onClick={(e) => handleSubmit(e)}
                        variant="contained"
                    >
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit goal modal */}
            <Dialog open={editModalOpen} onClose={closeEditModal} PaperProps={{ className: "MuiDialog-paper" }}>
                <DialogTitle className="MuiDialogTitle-root">Edit Goal</DialogTitle>
                <DialogContent className="MuiDialogContent-root">
                    {editGoal && (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <TextField
                                label="Goal Title"
                                name="goal_title"
                                value={editGoal.goal_title}
                                onChange={handleEditChange}
                                error={!!editGoalTitleError}
                                helperText={editGoalTitleError}
                                inputRef={editGoalTitleRef}
                                fullWidth
                                variant="outlined"
                            />
                            <TextField
                                label="Goal Type"
                                name="goal_type"
                                value={editGoal.goal_type}
                                onChange={handleEditChange}
                                error={!!editGoalTypeError}
                                helperText={editGoalTypeError}
                                inputRef={editGoalTypeRef}
                                select
                                fullWidth
                                variant="outlined"
                            >
                                <MenuItem value="Weight Loss">Weight Loss</MenuItem>
                                <MenuItem value="Strength Gain">Strength Gain</MenuItem>
                                <MenuItem value="Cardio Endurance">Cardio Endurance</MenuItem>
                                <MenuItem value="Flexibility">Flexibility</MenuItem>
                                <MenuItem value="Nutrition">Nutrition</MenuItem>
                                <MenuItem value="Overall Health">Overall Health</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                            </TextField>
                            <TextField
                                label="Status"
                                name="status"
                                value={editGoal.status}
                                onChange={handleEditChange}
                                error={!!editStatusError}
                                helperText={editStatusError}
                                inputRef={editStatusRef}
                                select
                                fullWidth
                                variant="outlined"
                            >
                                <MenuItem value="Active">Active</MenuItem>
                                <MenuItem value="Completed">Completed</MenuItem>
                                <MenuItem value="Abandoned">Abandoned</MenuItem>
                            </TextField>
                            {editGeneralError && (
                                <Typography color="error" variant="body2" sx={{ textAlign: 'center' }}>
                                    {editGeneralError}
                                </Typography>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions className="MuiDialogActions-root">
                    <Button onClick={closeEditModal} className="MuiButton-text">Cancel</Button>
                    <Button
                        onClick={() => handleEditGoal(editGoal.goal_id)}
                        variant="contained"
                        color="error" // Using color="error" to map to the green save button style
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
	)
};

export default Goals;