import { Button, Dialog, DialogContent, DialogActions, DialogTitle, TextField, Card, CardContent, Typography, Box, Divider, IconButton, MenuItem } from "@mui/material";
import { StaticDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { Edit, Delete, Add, KeyboardBackspace } from '@mui/icons-material';

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

	// error states for add modal
	const [addCaloriesBurnedError, setAddCaloriesBurnedError] = useState("");
	const [addDurationMinError, setAddDurationMinError] = useState("");
	const [addGeneralError, setAddGeneralError] = useState("");

	// error states for edit modal
	const [editCaloriesBurnedError, setEditCaloriesBurnedError] = useState("");
	const [editDurationMinError, setEditDurationMinError] = useState("");
	const [editWorkoutTypeError, setEditWorkoutTypeError] = useState("");
	const [editGeneralError, setEditGeneralError] = useState("");

	// refs for add modal inputs
	const addCaloriesBurnedRef = useRef(null);
	const addDurationMinRef = useRef(null);

	// refs for edit modal inputs
	const editCaloriesBurnedRef = useRef(null);
	const editDurationMinRef = useRef(null);
	const editWorkoutTypeRef = useRef(null);

	// open modal and set entry to edit
	const openEditModal = (entry) => {
		setEditEntry({ ...entry });
		setEditCaloriesBurnedError("");
		setEditDurationMinError("");
		setEditWorkoutTypeError("");
		setEditGeneralError("");
		setEditModalOpen(true);
	};

	// close modal
	const closeEditModal = () => {
		setEditModalOpen(false);
		setEditEntry(null);
		// clear edit errors when closing the modal
        setEditCaloriesBurnedError("");
		setEditDurationMinError("");
		setEditWorkoutTypeError("");
		setEditGeneralError("");
	};

	// handle input changes in the edit modal
	const handleEditChange = (e) => {
		const { name, value } = e.target;
		setEditEntry((prev) => ({
			...prev,
			[name]: value,
		}));
		// clear specific error when user starts typing in edit modal
        if (name === "calories_burned") setEditCaloriesBurnedError("");
        if (name === "duration_min") setEditDurationMinError("");
        if (name === "workout_type") setEditWorkoutTypeError("");
	};

	// function to handle the specified day change
	const handleSpecifiedDayChange = async (specifiedDay) => {
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

		// fetch workout logs for the user for the specified day
		try {
			const response = await fetch(`http://localhost:5000/workout/entries/specific/${specifiedDay}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}` // use the JWT token for authentication
				},
			});
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

		// clear previous errors
		setAddCaloriesBurnedError("");
		setAddDurationMinError("");
		setAddGeneralError("");

		let hasError = false;

		// perform input validation
		if (caloriesBurned === "" 
				|| isNaN(parseInt(caloriesBurned)) 
				|| parseInt(caloriesBurned) <= 0
				|| !/^\d+$/.test(caloriesBurned)) {
			setAddCaloriesBurnedError("Calories burned must be a positive whole number.");
			hasError = true;
			addCaloriesBurnedRef.current.focus();
		} else if (durationMin === "" 
				|| isNaN(parseInt(durationMin)) 
				|| parseInt(durationMin) <= 0
				|| !/^\d+$/.test(durationMin)) {
			setAddDurationMinError("Duration must be a positive whole number.");
			hasError = true;
			addDurationMinRef.current.focus();
		} else if (workoutType === "") {
			setAddGeneralError("An unexpected error has occurred.");
			hasError = true;
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
			console.log("Submitting workout log now!");
			const response = await fetch('http://localhost:5000/workout/add', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}` // use the JWT token for authentication
				},
				body: JSON.stringify({
					// user_id: localStorage.getItem('userId'), // get user id from local storage
					workout_type: workoutType,
					calories_burned: parseInt(caloriesBurned),
					duration_min: parseInt(durationMin),
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
				setAddModalOpen(false); // close modal on success
			} else {
				setAddGeneralError("Failed to add workout. Please try again.");
				console.log("Failed to submit workout log:", response.statusText);
			}
		} catch (error) {
			setAddGeneralError("Error adding workout. Please try again.");
			console.error("Error submitting workout log:", error);
		}
	};

	// function to handle the workout log edit submission
	const handleEditSubmit = async (specifiedDay) => {

		// clear previous errors
		setEditCaloriesBurnedError("");
		setEditDurationMinError("");
		setEditWorkoutTypeError("");
		setEditGeneralError("");

		let hasError = false;

		// perform input validation
		if (editEntry.calories_burned === "" 
				|| isNaN(parseInt(editEntry.calories_burned)) 
				|| parseInt(editEntry.calories_burned) <= 0
				|| !/^\d+$/.test(editEntry.calories_burned)) {
			setEditCaloriesBurnedError("Calories burned must be a positive number.");
			hasError = true;
			editCaloriesBurnedRef.current.focus();
		} else if (editEntry.duration_min === "" 
				|| isNaN(parseInt(editEntry.duration_min)) 
				|| parseInt(editEntry.duration_min) <= 0
				|| !/^\d+$/.test(editEntry.duration_min)) {
			setEditDurationMinError("Calories burned must be a positive number.");
			hasError = true;
			editDurationMinRef.current.focus();
		} else if (editEntry.workout_type === "") {
			setEditWorkoutTypeError("Workout type is required.");
			hasError = true;
			editWorkoutTypeRef.current.focus();
		}
		if (hasError) return; // stop if input validation failed

		try {
			const response = await fetch(`http://localhost:5000/workout/edit/${editEntry.workout_id}`, {
				method: 'PUT',
				headers: {
						'Content-Type': 'application/json',
				},
				body: JSON.stringify({
						workout_type: editEntry.workout_type,
						calories_burned: parseInt(editEntry.calories_burned),
						duration_min: parseInt(editEntry.duration_min),
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
				setEditGeneralError("Failed to update workout. Please try again.");
				console.error("Failed to update workout log:", response.statusText);
			}
		} catch (error) {
			setEditGeneralError("Error updating workout. Please try again.");
			console.error("Error updating workout log:", error);
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
		// // get the current users user_id from local storage
		// const userId = localStorage.getItem('userId');
		// if (!userId) {
		// 	console.error("User ID not found in local storage.");
		// 	return;
		// }
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

		// get the JWT token from local storage
		const token = localStorage.getItem('token');

		// if token does not exist, user is not authenticated
		if (!token) {
			console.error("User is not authenticated.");
			return;
		}

		// second fetch today's workout logs for the user
		try {
			const response = await fetch(`http://localhost:5000/workout/entries/today`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}` // use the JWT token for authentication
				}
			});
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
					<Typography 
						sx={{
							fontFamily: 'kanit, sans-serif',
							fontWeight: '700',
							fontSize: '1.5rem',
						}}
						variant="h6"
						align="center" 
						gutterBottom
					>
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
				<Card sx={{ 
					p: 2, 
						textAlign: "left",
						backgroundColor: 'transparent',
						boxShadow: 'none',

					}}
				>
					<Button 
						variant="contained" 
						color="primary" 
						onClick={() => handleNavigate('/home')}
						maxWidth="sm"
					>
						<KeyboardBackspace /> Back
					</Button>
				</Card>
			</Box>

			{/* Right Column */}
			<Box sx={{ flex: 2, minWidth: 350 }}>
				<Card sx={{ mb: 4 }}>
					<CardContent>
						<Typography 
							variant="h6" 
							gutterBottom 
							sx={{
								fontFamily: 'kanit, sans-serif',
								fontWeight: '700',
								fontSize: '1.5rem',
							}}
						>
                            {isToday(new Date(specifiedDay))
                                ? "Today's Food Entries"
                                : `${new Date(specifiedDay).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} Food Entries`}
                        </Typography>
						<Typography 
							variant="subtitle1" 
							sx={{ 
								mb: 2,
								fontFamily: 'kanit, sans-serif',
								fontWeight: '500',
								fontSize: '1.15rem',	
							}}
						>
                            Total Calories Burned: <b>{calcTodayTotalCaloriesBurned(todayWorkoutLogs)}</b>
                        </Typography>
						<Divider sx={{ mb: 2 }} />
						{workoutTypes.map((type) => (
							<Box key={type} sx={{ mb: 3 }}>
								<Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
								<Typography 
									variant="subtitle1"
									sx={{
										fontFamily: 'kanit, sans-serif', 
									}}
								>
									{type}
								</Typography>
								<IconButton
									size="small"
									color="primary"
									sx={{ ml: 1 }}
									onClick={() => {
									setWorkoutType(type);
									setAddCaloriesBurnedError("");
									setAddDurationMinError("");
									setAddGeneralError("");
									setAddModalOpen(true);
									}}
								>
									<Add />
								</IconButton>
								</Box>
								{grouped[type].length === 0 ? (
								<Typography color="text.secondary" fontStyle={'italic'} sx={{ mb: 1, ml: 2, fontFamily: 'kanit, sans-serif' }}>
									No {type.toLowerCase()} workouts.
								</Typography>
								) : (
								grouped[type].map((entry) => (
									<Box key={entry.workout_types_id} sx={{ mb: 1, p: 1, borderRadius: 1, bgcolor: "#f9f9f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
									<Box>
										<Typography 
											variant="subtitle2"
											sx={{ fontFamily: 'kanit, sans-serif' }}
										>
											<b>{entry.workout_type}</b>
										</Typography>
										<Typography 
											variant="body2"
											sx={{ fontFamily: 'kanit, sans-serif' }}
										>
											<b>{entry.calories_burned}</b> cals burned
										</Typography>
										<Typography 
											variant="body2"
											sx={{ fontFamily: 'kanit, sans-serif' }}
										>
											<b>{entry.duration_min}</b> min
										</Typography>
										{/*<Typography variant="body2" color="text.secondary">Date: {entry.created_at}</Typography>*/}
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
					<Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1, fontFamily: 'kanit, sans-serif' }}>
						<TextField
							label="Calories Burned "
							variant="outlined"
							type="number"
							value={caloriesBurned}
							onChange={(e) => {
								setCaloriesBurned(e.target.value);
								setAddCaloriesBurnedError("");
							}}
							error={!!addCaloriesBurnedError}
							helperText={addCaloriesBurnedError}
							inputProps={{ step: 1, min: 0 }}
							fullWidth
							inputRef={addCaloriesBurnedRef}
						/>
						<TextField
							label="Duration (Min)"
							variant="outlined"
							type="number"
							value={durationMin}
							onChange={(e) => {
								setDurationMin(e.target.value);
								setAddDurationMinError("");
							}}
							error={!!addDurationMinError}
							helperText={addDurationMinError}
							inputProps={{ step: 1, min: 0 }}
							fullWidth
							inputRef={addDurationMinRef}
						/>
						{addGeneralError && (
							<Typography color="error" variant="body2" sx={{ textAlign: 'center' }}>
								{addGeneralError}
							</Typography>
						)}
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => {
						setAddModalOpen(false);
						setCaloriesBurned("");
						setDurationMin("");
						setWorkoutType("");
						setAddCaloriesBurnedError("");
						setAddDurationMinError("");
						setAddGeneralError("");
					}}>Cancel</Button>
					<Button
						onClick={(e) => {
							const formattedDate = specifiedDay instanceof Date
								? specifiedDay.toISOString().split('T')[0]
								: new Date(specifiedDay).toISOString().split('T')[0];
							handleSubmit(e, formattedDate);
						}}
						variant="contained"
						style={{
							backgroundColor: '#C51D34'
						}}
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
						<Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1, fontFamily: 'kanit, sans-serif' }}>
							<TextField
								label="Calories Burned"
								name="calories_burned"
								type="number"
								value={editEntry.calories_burned}
								onChange={handleEditChange}
								error={!!editCaloriesBurnedError}
								helperText={editCaloriesBurnedError}
								inputProps={{ step: 1, min: 0 }}
								fullWidth
								inputRef={editCaloriesBurnedRef}
							/>
							<TextField
								label="Duration (Min)"
								name="duration_min"
								type="number"
								value={editEntry.duration_min}
								onChange={handleEditChange}
								error={!!editDurationMinError}
								helperText={editDurationMinError}
								inputProps={{ step: 1, min: 0 }}
								fullWidth
								inputRef={editDurationMinRef}
							/>
							<TextField
								label="Workout Type"
								name="workout_type"
								value={editEntry.workout_type}
								onChange={handleEditChange}
								error={!!editWorkoutTypeError}
                                helperText={editWorkoutTypeError}
                                select
                                fullWidth
                                inputRef={editWorkoutTypeRef}
							>
								<MenuItem value="Running">Running</MenuItem>
								<MenuItem value="Swimming">Swimming</MenuItem>
								<MenuItem value="Biking">Biking</MenuItem>
								<MenuItem value="Walking">Walking</MenuItem>
								<MenuItem value="Strength">Strength</MenuItem>
								<MenuItem value="Yoga">Yoga</MenuItem>
								<MenuItem value="Other">Other</MenuItem>
							</TextField>
							{editGeneralError && (
								<Typography color="error" variant="body2" sx={{ textAlign: 'center' }}>
									{editGeneralError}
								</Typography>
							)}
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
						style={{
							backgroundColor: '#C51D34'
						}}
					>
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}

export default WorkoutLog;