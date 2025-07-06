import { Button, Dialog, DialogContent, DialogActions, DialogTitle, TextField, Card, CardContent, Typography, Box, Divider, IconButton, MenuItem } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Edit, Delete } from '@mui/icons-material';
import { all } from "axios";

function WorkoutLog() {
	const navigate = useNavigate();
		const handleNavigate = (url) => {
		navigate(url);
	};

	const [workoutType, setWorkoutType] = useState("");
	const [caloriesBurned, setCaloriesBurned] = useState(0);
	const [durationMin, setDurationMin] = useState(0);
	const [allWorkoutLogs, setAllWorkoutLogs] = useState({});
	const [todayWorkoutLogs, setTodayWorkoutLogs] = useState({});
	const [editEntry, setEditEntry] = useState(null);

	// function to handle the workout log submission attempt
	const handleSubmit = async (e) => {
		e.preventDefault();

		// perform input validation
		if (!workoutType || !caloriesBurned || !durationMin) {
			alert("Please fill in all fields.");
			return;
		} else {
			// proceed with form submission
			try {
				console.log("Submitting workout log now!");
				const response = await fetch('http://localhost:5000/workout/add', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						user_id: localStorage.getItem('userId'), // get user id from local storage
						workout_type: workoutType,
						calories_burned: caloriesBurned,
						duration_min: durationMin,
					}),
				});
				// check if the response is ok
				if (response.ok) {
					const data = await response.json();
					console.log("Workout log submitted successfully:", data);
					// fetch the updated workout logs after submission
					fetchWorkoutLogs();
				} else {
					console.log("Failed to submit workout log:", response.statusText);
					return;
				}
			} catch (error) {
				console.error("Error submitting workout log:", error);
				return;
			}
		}
	};

	// function to handle the workout log edit submission
	const handleEditSubmit = async () => {
		try {
			const response = await fetch(`http://localhost:5000/workout/edit/${editEntry.workout_id}`, {
				method: 'PUT',
				headers: {
						'Content-Type': 'application/json',
				},
				body: JSON.stringify({
						workout_type: editEntry.workout_type,
						calories_burned: editEntry.calories_burned,
						duration_min: editEntry.duration_min,
				}),
			});
			if (response.ok) {
				const data = await response.json();
				console.log("Workout log edited successfully: ", data);
				// fetch updated workout logs
				fetchWorkoutLogs();
			} else {
				console.error("Failed to update workout log:", response.statusText);
				return;
			}
		} catch (error) {
			console.error("Error updating workout log:", error);
			return;
		}
	};

	// function to handle the deletion of a workout log
	const handleDeleteEntry = async (workout_id) => {
		try {
			const response = await fetch(`http://localhost:5000/workout/delete/${workout_id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			if (response.ok) {
				const data = await response.json();
				console.log("Workout log deleted successfully:", data);
				// fetch the updated workout log after deletion
				fetchWorkoutLogs();
			} else {
				console.error("Failed to delete workout log:", response.statusText);
			}
		} catch (error) {
			console.error("Error deleting workout log:", error);
		}
	};


	// function to fetch all workout logs for the user
	const fetchWorkoutLogs = async () => {
		// get the current users user_id from local storage
		const userId = localStorage.getItem('userId');
		if (!userId) {
			console.error("User ID not found in local storage.");
			return;
		}
		try {
			const response = await fetch(`http://localhost:5000/workout/entries/${userId}`);
			if (response.ok) {
				const data = await response.json();
				setAllWorkoutLogs(data);
				console.log("All user workout logs fetched successfully:", data);
			} else {
				console.error("Failed to fetch all user workout logs:", response.statusText);
			}
		} catch (error) {
			console.error("Error fetching all user workout logs:", error);
		}
	};

	// useEffect to fetch workout logs on component mount
	useEffect(() => {
		fetchWorkoutLogs();
	}, []);

	return (
		<div>
			<h1>Workout Log</h1>
			<div>
				<h2>Add New Workout Here</h2>
				<form onSubmit={handleSubmit}>
					<Box sx={{ display: "flex", gap: 2, mb: 2 }}>
						<TextField
							label="Workout Type"
							variant="outlined"
							value={workoutType}
							onChange={(e) => setWorkoutType(e.target.value)}
							select
							fullWidth
						>
							<MenuItem value="Running">Running</MenuItem>
							<MenuItem value="Biking">Biking</MenuItem>
							<MenuItem value="Walking">Walking</MenuItem>
							<MenuItem value="Strength">Strength</MenuItem>
							<MenuItem value="Yoga">Yoga</MenuItem>
							<MenuItem value="Other">Other</MenuItem>
						</TextField>
						<TextField
							label="Calories Burned"
							variant="outlined"
							type="number"
							value={caloriesBurned}
							onChange={(e) => setCaloriesBurned(e.target.value)}
							inputProps={{ step: 1, min: 0 }}
							fullWidth
						/>
						<TextField
							label="Duration (Mins)"
							variant="outlined"
							type="number"
							value={durationMin}
							onChange={(e) => setDurationMin(e.target.value)}
							inputProps={{ step: 1, min: 0 }}
							fullWidth
						/>
					</Box>
					<Button type="submit" variant="contained" color="primary" fullWidth>
						Add Workout
					</Button>
				</form>
			</div>
			<Card sx={{ mb: 4 }}>
				<CardContent>
					<Typography variant="h6" gutterBottom>
						Today's Workouts
					</Typography>
					<Divider sx={{ mb: 2 }} />
					{Object.keys(todayWorkoutLogs).length === 0 ? (
						<Typography color="text.secondary">No workouts for today.</Typography>
					) : (
						Object.entries(todayWorkoutLogs).map(([id, entry]) => (
							<Box key={id} sx={{ mb: 2, p: 1, borderRadius: 1, bgcolor: "#f9f9f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
								<Box>
									<Typography variant="subtitle1">{entry.workout_type}</Typography>
									<Typography variant="body2">Calories Burned: {entry.calories_burned}</Typography>
									<Typography variant="body2">Duration (Min): {entry.duration_min}</Typography>
									<Typography variant="body2" color="text.secondary">Date: {entry.created_at}</Typography>
								</Box>
								{/* <Box>
									<IconButton color="primary" onClick={() => openEditModal(entry)}>
										<Edit />
									</IconButton>
									<IconButton color="error" onClick={() => handleDeleteEntry(entry.workout_id)}>
										<Delete />
									</IconButton>
								</Box> */}
							</Box>
						))
					)}
				</CardContent>
			</Card>

			<Card>
				<CardContent>
					<Typography variant="h6" gutterBottom>
						All Workouts
					</Typography>
					<Divider sx={{ mb: 2 }} />
					{Object.keys(allWorkoutLogs).length === 0 ? (
							<Typography color="text.secondary">No workouts found.</Typography>
					) : (
						Object.entries(allWorkoutLogs).map(([id, entry]) => (
							<Box key={id} sx={{ mb: 2, p: 1, borderRadius: 1, bgcolor: "#f9f9f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
								<Box>
									<Typography variant="subtitle1">{entry.workout_type}</Typography>
									<Typography variant="body2">Calories Burned: {entry.calories_burned}</Typography>
									<Typography variant="body2">Duration (Min): {entry.duration_min}</Typography>
									<Typography variant="body2" color="text.secondary">Date: {entry.created_at}</Typography>
								</Box>
								{/* <Box>
									<IconButton color="primary" onClick={() => openEditModal(entry)}>
										<Edit />
									</IconButton>
									<IconButton color="error" onClick={() => handleDeleteEntry(entry.workout_id)}>
										<Delete />
									</IconButton>
								</Box> */}
							</Box>
						))
					)}
				</CardContent>
			</Card>
			<button onClick={() => handleNavigate('/home')}>
				Exit
			</button>
		</div>
	);
}

export default WorkoutLog;