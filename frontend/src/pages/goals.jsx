import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Button, Dialog, DialogContent, DialogActions, DialogTitle, TextField, Box, MenuItem } from "@mui/material";

function Goals() {
	const navigate = useNavigate();
		const handleNavigate = (url) => {
		navigate(url);
	};

	const [goalTitle, setGoalTitle] = useState("");
	const [goalType, setGoalType] = useState("");
	// const [startDate, setStartDate] = useState(Date());
	// const [endDate, setEndDate] = useState(Date());
	// const [status, setStatus] = useState("");
	const [goals, setGoals] = useState({});
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [editGoal, setEditGoal] = useState(null);

	// open the edit modal and set entry to edit
	const openEditModal = (entry) => {
		setEditGoal({ ...entry });
		setEditModalOpen(true);
	};

	// close the edit modal
	const closeEditModal = () => {
		setEditModalOpen(false);
		setEditGoal(null);
	};

	// handle input changes in the edit modal
	const handleEditChange = (e) => {
		const { name, value } = e.target;
		setEditGoal((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// function to handle the goal submission attempt
	const handleSubmit = async (e) => {
		e.preventDefault();

		// perform input validation
		if (!goalTitle || !goalType) {
			alert("Please fill in all fields.");
			return;
		} else {
			// proceed with form submission
			try {
				console.log("Submitting goal now!");
				const response = await fetch('http://localhost:5000/goal/add', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						user_id: localStorage.getItem('userId'), // get user id from local storage
						goal_title: goalTitle,
						goal_type: goalType
						// start_date: startDate,
						// end_date: endDate,
						// status: status
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
					// setStartDate(Date());
					// setEndDate(Date());
					// setStatus("");

				} else {
					console.log("Failed to submit goal:", response.statusText);
					return;
				}
			} catch (error) {
				console.error("Error submitting goal:", error);
				return;
			}
		}
	};

	// function to handle the edit of a goal
	const handleEditGoal = async (goal_id) => {
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
				console.error("Failed to update goal:", response.statusText);
				return;
			}
		} catch (error) {
			console.error("Error updating goal:", error);
			return;
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
		// get the current users user_id from local storage
		const userId = localStorage.getItem('userId');
		if (!userId) {
			console.error("User ID not found in local storage.");
			return;
		}

		// continue with the goals fetch
		try {
			const response = await fetch(`http://localhost:5000/goal/entries/${userId}`);
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

	return (
		<div>
			<div>Goals Page</div>
			<div>
				<h1>Add Goal Here</h1>
				<form onSubmit={handleSubmit}>
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
						fullWidth
					/>
					{/* <TextField
						label="Start Date"
						variant="outlined"
						value={startDate}
						type="date"
						onChange={(e) => setStartDate(e.target.value)}
						fullWidth
					/>
					<TextField
						label="End Date"
						variant="outlined"
						type="date"
						value={endDate}
						onChange={(e) => setEndDate(e.target.value)}
						fullWidth
					/>
					<TextField
						label="Status"
						variant="outlined"
						value={status}
						onChange={(e) => setStatus(e.target.value)}
						fullWidth
					/> */}
					<button type="submit">
						Add
					</button>
				</form>
			</div>
			<ul>
				{goals.length > 0 ? (
				goals.map((goal) => (
					<li key={goal.goal_id}>
					<h3>{goal.goal_title}</h3>
					<p>Type: {goal.goal_type}</p>
					<p>Start Date: {goal.start_date}</p>
					<p>End Date: {goal.end_date ? goal.end_date : "N/A"}</p>
					<p>Status: {goal.status}</p>
						<button onClick={() => handleDeleteGoal(goal.goal_id)}>
							Delete
						</button>
						<button onClick={() => openEditModal(goal)}>
							Edit
						</button>
					</li>	
				))
				) : (
				<li>No goals to display</li>
				)}
			</ul>
			<button onClick={() => handleNavigate('/home')}>
				Exit
			</button>

			{/* Edit goal modal */}
			<Dialog open={editModalOpen} onClose={closeEditModal}>
				<DialogTitle>Edit Goal</DialogTitle>
				<DialogContent>
					{editGoal && (
						<Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
							<TextField
								label="Goal Title"
								name="goal_title"
								value={editGoal.goal_title}
								onChange={handleEditChange}
								fullWidth
							/>
							<TextField
								label="Goal Type"
								name="goal_type"
								value={editGoal.goal_type}
								onChange={handleEditChange}
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
							<TextField
								label="Status"
								name="status"
								value={editGoal.status}
								onChange={handleEditChange}
								select
								fullWidth
							>
								<MenuItem value="Active">Active</MenuItem>
								<MenuItem value="Completed">Completed</MenuItem>
								<MenuItem value="Abandoned">Abandoned</MenuItem>
							</TextField>
						</Box>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={closeEditModal}>Cancel</Button>
					<Button
						onClick={() => handleEditGoal(editGoal.goal_id)}
						variant="contained"
					>
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
};

export default Goals;