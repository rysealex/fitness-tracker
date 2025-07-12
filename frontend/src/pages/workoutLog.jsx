import { Button, Dialog, DialogContent, DialogActions, DialogTitle, TextField, Card, CardContent, Typography, Box, Divider, IconButton, MenuItem } from "@mui/material";
import { StaticDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Edit, Delete, Add } from '@mui/icons-material';

function WorkoutLog() {
	const navigate = useNavigate();
		const handleNavigate = (url) => {
		navigate(url);
	};

	const [workoutType, setWorkoutType] = useState("");
	const [caloriesBurned, setCaloriesBurned] = useState(0);
	const [durationMin, setDurationMin] = useState(0);
	const [specifiedDay, setSpecifiedDay] = useState(Date());
	const [allWorkoutLogs, setAllWorkoutLogs] = useState({});
	const [todayWorkoutLogs, setTodayWorkoutLogs] = useState({});
	const [addModalOpen, setAddModalOpen] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [editEntry, setEditEntry] = useState(null);

	// open modal and set entry to edit
	const openEditModal = (entry) => {
		setEditEntry({ ...entry });
		setEditModalOpen(true);
	};

	// close modal
	const closeEditModal = () => {
		setEditModalOpen(false);
		setEditEntry(null);
	};

	// handle input changes in the edit modal
	const handleEditChange = (e) => {
		const { name, value } = e.target;
		setEditEntry((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// function to handle the specified day change
	const handleSpecifiedDayChange = async (specifiedDay) => {
		// get the current users user_id from local storage
		const userId = localStorage.getItem('userId');
		if (!userId) {
			console.error("User ID not found in local storage.");
			return;
		}
		// fetch workout logs for the user for the specified day
		try {
			const response = await fetch(`http://localhost:5000/workout/entries/specific/${userId}/${specifiedDay}`);
			if (response.ok) {
				const data = await response.json();
				if (!data) {
					setTodayWorkoutLogs({});
				} else {
					setTodayWorkoutLogs(data);
				}
				console.log("User workout logs for the specified day fetched successfully:", data);
			} else {
				console.error("Failed to fetch user workout logs for the specified day:", response.statusText);
			}
		} catch (error) {
			console.error("Error fetching user workout logs for the specified day:", error);
		}
	};

	// function to handle the workout log submission attempt
	const handleSubmit = async (e, specifiedDay) => {
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
						created_at: specifiedDay
					}),
				});
				// check if the response is ok
				if (response.ok) {
					const data = await response.json();
					console.log("Workout log submitted successfully:", data);
					// fetch the specified day change results
					handleSpecifiedDayChange(specifiedDay);
					// clear the input fields
					setWorkoutType("");
					setCaloriesBurned(0);
					setDurationMin(0);
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
	const handleEditSubmit = async (specifiedDay) => {
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
						created_at: specifiedDay
				}),
			});
			if (response.ok) {
				const data = await response.json();
				console.log("Workout log edited successfully: ", data);
				// close the edit modal and fetch updated workout logs
				closeEditModal();
				// fetch the specified day change results
				handleSpecifiedDayChange(specifiedDay);
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
	const handleDeleteEntry = async (workout_id, specifiedDay) => {
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
				// fetch the specified day change results
				handleSpecifiedDayChange(specifiedDay);
			} else {
				console.error("Failed to delete workout log:", response.statusText);
			}
		} catch (error) {
			console.error("Error deleting workout log:", error);
		}
	};


	// function to fetch workout logs for the user
	const fetchWorkoutLogs = async () => {
		// get the current users user_id from local storage
		const userId = localStorage.getItem('userId');
		if (!userId) {
			console.error("User ID not found in local storage.");
			return;
		}
		// // first fetch all workout logs for the user
		// try {
		// 	const response = await fetch(`http://localhost:5000/workout/entries/${userId}`);
		// 	if (response.ok) {
		// 		const data = await response.json();
		// 		setAllWorkoutLogs(data);
		// 		console.log("All user workout logs fetched successfully:", data);
		// 	} else {
		// 		console.error("Failed to fetch all user workout logs:", response.statusText);
		// 	}
		// } catch (error) {
		// 	console.error("Error fetching all user workout logs:", error);
		// }
		// second fetch today's workout logs for the user
		try {
			const response = await fetch(`http://localhost:5000/workout/entries/today/${userId}`);
			if (response.ok) {
				const data = await response.json();
				setTodayWorkoutLogs(data);
				console.log("Today's user workout logs fetched successfully:", data);
			} else {
				console.error("Failed to fetch today's user workout logs:", response.statusText);
			}
		} catch (error) {
			console.error("Error fetching today's user workout logs:", error);
		}
	};

	// useEffect to fetch workout logs on component mount
	useEffect(() => {
		fetchWorkoutLogs();
	}, []);

	// function to calculate today's total calories burned
	const calcTodayTotalCaloriesBurned = (entries) => {
		return Object.values(entries).reduce((sum, entry) => {
			const caloriesBurned = Number(entry.calories_burned) || 0;
			return sum + caloriesBurned;
		}, 0);
	};

	// function to check if the calendar picker is the current day
	const isToday = (date) => {
    const today = new Date();
    return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
		);
	};

	// function to group workouts by workout type
	const groupEntriesByWorkoutType = (entries) => {
		const groups = {
			Running: [],
			Swimming: [], 
			Biking: [], 
			Walking: [], 
			Strength: [], 
			Yoga: [], 
			Other: [],
		};
		Object.values(entries).forEach(entry => {
			if (groups[entry.workout_type]) {
				groups[entry.workout_type].push(entry);
			}
		});
		return groups;
	};

	const workoutTypes = ["Running", "Swimming", "Biking", "Walking", "Strength", "Yoga", "Other"];
	const grouped = groupEntriesByWorkoutType(todayWorkoutLogs);

	return (
		<Box sx={{
			maxWidth: 1200,
			mx: "auto",
			mt: 4,
			p: 2,
			display: "flex",
			gap: 4,
			alignItems: "flex-start",
			'@media (max-width:900px)': { flexDirection: "column", alignItems: "stretch" }
		}}>
			{/* Left Column */}
			<Box sx={{ flex: 1, minWidth: 320 }}>
				<Card sx={{ mb: 3, p: 2 }}>
					<Typography variant="h6" align="center" gutterBottom>
						Select Day
					</Typography>
					<LocalizationProvider dateAdapter={AdapterDateFns}>
						<StaticDatePicker
							displayStaticWrapperAs="desktop"
							value={specifiedDay}
							onChange={(newValue) => {
								setSpecifiedDay(newValue);
								const formattedDate = newValue.toISOString().split('T')[0];
								handleSpecifiedDayChange(formattedDate);
							}}
							renderInput={(params) => <TextField {...params} />}
						/>
					</LocalizationProvider>
				</Card>
				<Card sx={{ p: 2, textAlign: "center" }}>
					<Button 
						variant="contained" 
						color="primary" 
						onClick={() => handleNavigate('/home')}
						fullWidth
					>
						Exit
					</Button>
				</Card>
			</Box>

			{/* Right Column */}
			<Box sx={{ flex: 2, minWidth: 350 }}>
				<Card sx={{ mb: 4 }}>
					<CardContent>
						<Typography variant="h6" gutterBottom>
							{isToday(new Date(specifiedDay))
								? "Today's Workouts"
								: `${new Date(specifiedDay).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} Workouts`}
						</Typography>
						<Typography variant="subtitle1" sx={{ mb: 2 }}>
							Total Calories Burned: <b>{calcTodayTotalCaloriesBurned(todayWorkoutLogs)}</b>
						</Typography>
						<Divider sx={{ mb: 2 }} />
						{workoutTypes.map((type) => (
							<Box key={type} sx={{ mb: 3 }}>
								<Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
								<Typography variant="subtitle1">{type}</Typography>
								<IconButton
									size="small"
									color="primary"
									sx={{ ml: 1 }}
									onClick={() => {
									setWorkoutType(type);
									setAddModalOpen(true);
									}}
								>
									<Add />
								</IconButton>
								</Box>
								{grouped[type].length === 0 ? (
								<Typography color="text.secondary" sx={{ mb: 1, ml: 2 }}>
									No {type.toLowerCase()} workouts
								</Typography>
								) : (
								grouped[type].map((entry) => (
									<Box key={entry.workout_types_id} sx={{ mb: 1, p: 1, borderRadius: 1, bgcolor: "#f9f9f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
									<Box>
										<Typography variant="subtitle2">{entry.workout_name}</Typography>
										<Typography variant="body2">Calories Burned: {entry.calories_burned}</Typography>
										<Typography variant="body2">Duration (Min): {entry.duration_min}</Typography>
										<Typography variant="body2" color="text.secondary">Date: {entry.created_at}</Typography>
									</Box>
									<Box>
										<IconButton color="primary" onClick={() => openEditModal(entry)}>
										<Edit />
										</IconButton>
										<IconButton
										color="error"
										onClick={() => {
											const formattedDate = specifiedDay instanceof Date
											? specifiedDay.toISOString().split('T')[0]
											: new Date(specifiedDay).toISOString().split('T')[0];
											handleDeleteEntry(entry.workout_id, formattedDate);
										}}
										>
										<Delete />
										</IconButton>
									</Box>
									</Box>
								))
								)}
								<Divider sx={{ mt: 2 }} />
							</Box>
						))}
					</CardContent>
				</Card>
			</Box>

			{/* Add Workout Log Modal */}
			<Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)}>
				<DialogTitle>Add New {workoutType ? workoutType : ""} Workout</DialogTitle>
				<DialogContent>
					<Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
						<TextField
							label="Calories Burned "
							variant="outlined"
							type="number"
							value={caloriesBurned}
							onChange={(e) => setCaloriesBurned(e.target.value)}
							inputProps={{ step: 1, min: 0 }}
							fullWidth
						/>
						<TextField
							label="Duration (Min)"
							variant="outlined"
							type="number"
							value={durationMin}
							onChange={(e) => setDurationMin(e.target.value)}
							inputProps={{ step: 1, min: 0 }}
							fullWidth
						/>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setAddModalOpen(false)}>Cancel</Button>
					<Button
						onClick={(e) => {
							const formattedDate = specifiedDay instanceof Date
								? specifiedDay.toISOString().split('T')[0]
								: new Date(specifiedDay).toISOString().split('T')[0];
							handleSubmit(e, formattedDate);
							setAddModalOpen(false);
						}}
						variant="contained"
					>
						Add
					</Button>
				</DialogActions>
			</Dialog>

			{/* Edit Workout Log Modal */}
			<Dialog open={editModalOpen} onClose={closeEditModal}>
				<DialogTitle>Edit Workout</DialogTitle>
				<DialogContent>
					{editEntry && (
						<Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
							<TextField
								label="Workout Type"
								name="workout_type"
								value={editEntry.workout_type}
								onChange={handleEditChange}
								select
								fullWidth
							>
								<MenuItem value="Running">Running</MenuItem>
								<MenuItem value="Swimming">Swimming</MenuItem>
								<MenuItem value="Biking">Biking</MenuItem>
								<MenuItem value="Walking">Walking</MenuItem>
								<MenuItem value="Strength">Strength</MenuItem>
								<MenuItem value="Yoga">Yoga</MenuItem>
								<MenuItem value="Other">Other</MenuItem>
							</TextField>
							<TextField
								label="Calories Burned"
								name="calories_burned"
								type="number"
								value={editEntry.calories_burned}
								onChange={handleEditChange}
								inputProps={{ step: 1, min: 0 }}
								fullWidth
							/>
							<TextField
								label="Duration (Min)"
								name="duration_min"
								type="number"
								value={editEntry.duration_min}
								onChange={handleEditChange}
								inputProps={{ step: 1, min: 0 }}
								fullWidth
							/>
						</Box>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={closeEditModal}>Cancel</Button>
					<Button
						onClick={() => {
							const formattedDate = specifiedDay instanceof Date
								? specifiedDay.toISOString().split('T')[0]
								: new Date(specifiedDay).toISOString().split('T')[0];
							handleEditSubmit(formattedDate);
						}}
						variant="contained"
					>
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}

export default WorkoutLog;