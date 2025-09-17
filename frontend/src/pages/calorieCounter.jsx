import { Button, Dialog, DialogContent, DialogActions, DialogTitle, TextField, Card, CardContent, Typography, Box, Divider, IconButton, MenuItem } from "@mui/material";
import { StaticDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { Edit, Delete, Add, KeyboardBackspace } from '@mui/icons-material';

function CalorieCounter() {
	const navigate = useNavigate();
		const handleNavigate = (url) => {
		navigate(url);
	};

	const [foodName, setFoodName] = useState("");
	const [totalCalories, setTotalCalories] = useState(0);
	const [mealType, setMealType] = useState("");
	const [specifiedDay, setSpecifiedDay] = useState(Date());
	const [allFoodEntries, setAllFoodEntries] = useState({});
	const [todayFoodEntries, setTodayFoodEntries] = useState({});
	const [addModalOpen, setAddModalOpen] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [editEntry, setEditEntry] = useState(null);

	// error states for add modal
    const [addFoodNameError, setAddFoodNameError] = useState("");
    const [addCaloriesError, setAddCaloriesError] = useState("");
	const [addGeneralError, setAddGeneralError] = useState("");

    // error states for edit modal
    const [editFoodNameError, setEditFoodNameError] = useState("");
    const [editCaloriesError, setEditCaloriesError] = useState("");
    const [editMealTypeError, setEditMealTypeError] = useState("");
    const [editGeneralError, setEditGeneralError] = useState("");

    // refs for add modal inputs
    const addFoodNameRef = useRef(null);
    const addCaloriesRef = useRef(null);

    // refs for edit modal inputs
    const editFoodNameRef = useRef(null);
    const editCaloriesRef = useRef(null);
    const editMealTypeRef = useRef(null);

	// open modal and set entry to edit
	const openEditModal = (entry) => {
		setEditEntry({ ...entry });
		// clear previous edit errors when opening the modal
        setEditFoodNameError("");
        setEditCaloriesError("");
        setEditMealTypeError("");
        setEditGeneralError("");
		setEditModalOpen(true);
	};

	// close modal
	const closeEditModal = () => {
		setEditModalOpen(false);
		setEditEntry(null);
		// clear edit errors when closing the modal
        setEditFoodNameError("");
        setEditCaloriesError("");
        setEditMealTypeError("");
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
        if (name === "food_name") setEditFoodNameError("");
        if (name === "total_calories") setEditCaloriesError("");
        if (name === "meal_type") setEditMealTypeError("");
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

		// fetch food entries for the user for the specified day
		try {
			const response = await fetch(`http://localhost:5000/food/entries/specific/${specifiedDay}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}` // use the JWT token for authentication
				},
			});
			if (response.ok) {
				const data = await response.json();
				if (!data) {
					setTodayFoodEntries({});
				} else {
					setTodayFoodEntries(data);
				}
				console.log("User food entries for the specified day fetched successfully:", data);
			} else {
				console.error("Failed to fetch user food entries for the specified day:", response.statusText);
			}
		} catch (error) {
			console.error("Error fetching user food entries for the specified day:", error);
		}
	};

	// function to handle the food entry edit submission
	const handleEditSubmit = async (specifiedDay) => {

		// clear previous errors
		setEditFoodNameError("");
        setEditCaloriesError("");
        setEditMealTypeError("");
        setEditGeneralError("");

		let hasError = false;

		// perform input validation
		if (editEntry.food_name === "") {
			setEditFoodNameError("Food name is required.");
			hasError = true;
			editFoodNameRef.current.focus();
		}
		else if (editEntry.total_calories === "" 
				|| isNaN(parseInt(editEntry.total_calories)) 
				|| parseInt(editEntry.total_calories) <= 0
				|| !/^\d+$/.test(editEntry.total_calories)) {
			setEditCaloriesError("Calories must be a positive whole number.");
            hasError = true;
            editCaloriesRef.current.focus();
		}
		else if (editEntry.meal_type === "") {
			setEditMealTypeError("Meal type is required.");
            hasError = true;
            editMealTypeRef.current?.focus();
		}
		if (hasError) return; // stop if input validation failed

		try {
			const response = await fetch(`http://localhost:5000/food/edit/${editEntry.food_entries_id}`, {
				method: 'PUT',
				headers: {
						'Content-Type': 'application/json',
				},
				body: JSON.stringify({
						food_name: editEntry.food_name,
						total_calories: parseInt(editEntry.total_calories),
						meal_type: editEntry.meal_type,
						created_at: specifiedDay
				}),
			});
			if (response.ok) {
				const data = await response.json();
				console.log("Food entry edited successfully: ", data);
				// close the edit modal
				closeEditModal();
				// fetch the specified day change results
				handleSpecifiedDayChange(specifiedDay);
			} else {
				setEditGeneralError("Failed to update food entry. Please try again.");
				console.error("Failed to update food entry:", response.statusText);
			}
		} catch (error) {
			setEditGeneralError("Error updating food entry. Please try again.");
			console.error("Error updating food entry:", error);
		}
	};

	// function to handle the food entry submission attempt
	const handleSubmit = async (e, specifiedDay) => {
		e.preventDefault();

		// clear previous errors
        setAddFoodNameError("");
        setAddCaloriesError("");
        setAddGeneralError("");

		let hasError = false;

		// perform input validation
		if (foodName === "") {
			setAddFoodNameError("Food name is required.");
			hasError = true;
			addFoodNameRef.current.focus();
		}
		else if (totalCalories === "" 
				|| isNaN(parseInt(totalCalories)) 
				|| parseInt(totalCalories) <= 0
				|| !/^\d+$/.test(totalCalories)) {
			setAddCaloriesError("Calories must be a positive whole number.");
			hasError = true;
			addCaloriesRef.current.focus();
		}
		else if (mealType === "") {
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
			console.log("Submitting food entry now!");
			const response = await fetch('http://localhost:5000/food/add', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}` // use the JWT token for authentication
				},
				body: JSON.stringify({
					// user_id: localStorage.getItem('userId'), // get user id from local storage
					food_name: foodName,
					total_calories: parseInt(totalCalories),
					meal_type: mealType,
					created_at: specifiedDay
				}),
			});
			// check if the response is ok
			if (response.ok) {
				const data = await response.json();
				console.log("Food entry submitted successfully:", data);
				// fetch the specified day change results
				handleSpecifiedDayChange(specifiedDay);
				// clear the input fields
				setFoodName("");
				setTotalCalories(0);
				setMealType("");
				setAddModalOpen(false); // close modal on success
			} else {
				setAddGeneralError("Failed to add food entry. Please try again.");
				console.log("Failed to submit food entry:", response.statusText);
			}
		} catch (error) {
			setAddGeneralError("Error adding food entry. Please try again.");
			console.error("Error submitting food entry:", error);
		}
	};

	// function to handle the deletion of a food entry
	const handleDeleteEntry = async (food_entries_id, specifiedDay) => {
		try {
			const response = await fetch(`http://localhost:5000/food/delete/${food_entries_id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			if (response.ok) {
				const data = await response.json();
				console.log("Food entry deleted successfully:", data);
				// fetch the specified day change results
				handleSpecifiedDayChange(specifiedDay);
			} else {
				console.error("Failed to delete food entry:", response.statusText);
			}
		} catch (error) {
			console.error("Error deleting food entry:", error);
		}
	};

	//  function to fetch food entries for the user
	const fetchFoodEntries = async () => {
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

		// // first fetch all food entries for the user
		// try {
		// 	const response = await fetch(`http://localhost:5000/food/entries/${userId}`);
		// 	if (response.ok) {
		// 		const data = await response.json();
		// 		setAllFoodEntries(data);
		// 		console.log("All user food entries fetched successfully:", data);
		// 	} else {
		// 		console.error("Failed to fetch all user food entries:", response.statusText);
		// 	}
		// } catch (error) {
		// 	console.error("Error fetching all user food entries:", error);
		// }
		// second fetch today's food entries for the user
		try {
			const response = await fetch(`http://localhost:5000/food/entries/today`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}` // use the JWT token for authentication
				},
			});
			if (response.ok) {
				const data = await response.json();
				setTodayFoodEntries(data);
				console.log("Today's user food entries fetched successfully:", data);
			} else {
				console.error("Failed to fetch today's user food entries:", response.statusText);
			}
		} catch (error) {
			console.error("Error fetching today's user food entries:", error);
		}
	};

	// useEffect to fetch food entries on component mount
	useEffect(() => {
		fetchFoodEntries();
	}, []);

	// function to calculate today's total calories
	const calcTodayTotalCalories = (entries) => {
		return Object.values(entries).reduce((sum, entry) => {
			const calories = Number(entry.total_calories) || 0;
			return sum + calories;
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

	// function to group entries by meal type
	const groupEntriesByMealType = (entries) => {
		const groups = {
			Breakfast: [],
			Lunch: [],
			Dinner: [],
			Snack: [],
		};
		Object.values(entries).forEach(entry => {
			if (groups[entry.meal_type]) {
				groups[entry.meal_type].push(entry);
			}
		});
		return groups;
	};

	const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];
	const grouped = groupEntriesByMealType(todayFoodEntries);
		
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
				<Card 
					sx={{ 
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
            <Box sx={{ flex: 2, minWidth: 350}}>
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
                            Total Calories: <b>{calcTodayTotalCalories(todayFoodEntries)}</b>
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
						{mealTypes.map((type) => (
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
									setMealType(type);
									setAddFoodNameError("");
									setAddCaloriesError("");
									setAddGeneralError("");
									setAddModalOpen(true);
									}}
								>
									<Add />
								</IconButton>
								</Box>
								{grouped[type].length === 0 ? (
								<Typography color="text.secondary" fontStyle={'italic'} sx={{ mb: 1, ml: 2, fontFamily: 'kanit, sans-serif' }}>
									No {type.toLowerCase()} entries.
								</Typography>
								) : (
								grouped[type].map((entry) => (
									<Box key={entry.food_entries_id} sx={{ mb: 1, p: 1, borderRadius: 1, bgcolor: "#f9f9f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
									<Box>
										<Typography 
											variant="subtitle2"
											sx={{ fontFamily: 'kanit, sans-serif' }}
										>
											<b>{entry.food_name}</b>
										</Typography>
										<Typography 
											variant="body2"
											sx={{ fontFamily: 'kanit, sans-serif' }}
										>
											<b>{entry.total_calories}</b> cals
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
											handleDeleteEntry(entry.food_entries_id, formattedDate);
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

			{/* Add Food Entry Modal */}
			<Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)}>
				<DialogTitle>Add New {mealType ? mealType : "Food"} Entry</DialogTitle>
				<DialogContent>
					<Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1, fontFamily: 'kanit, sans-serif' }}>
						<TextField
							label="Food Name"
							variant="outlined"
							value={foodName}
							onChange={(e) => {
								setFoodName(e.target.value);
								setAddFoodNameError("");
							}}
							error={!!addFoodNameError}
                            helperText={addFoodNameError}
                            fullWidth
                            inputRef={addFoodNameRef}
						/>
						<TextField
							label="Calories"
							variant="outlined"
							type="number"
							value={totalCalories}
							onChange={(e) => {
								setTotalCalories(e.target.value);
								setAddCaloriesError("");
							}}
							error={!!addCaloriesError}
                            helperText={addCaloriesError}
                            inputProps={{ step: 1, min: 0 }}
                            fullWidth
                            inputRef={addCaloriesRef}
						/>
						{/* <TextField
							label="Meal Type"
							variant="outlined"
							value={mealType}
							onChange={(e) => setMealType(e.target.value)}
							select
							fullWidth
						>
							<MenuItem value="Breakfast">Breakfast</MenuItem>
							<MenuItem value="Lunch">Lunch</MenuItem>
							<MenuItem value="Dinner">Dinner</MenuItem>
							<MenuItem value="Snack">Snack</MenuItem>
						</TextField> */}
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
						setFoodName("");
                        setTotalCalories("");
                        setMealType("");
                        setAddFoodNameError("");
                        setAddCaloriesError("");
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

			{/* Edit Food Entry Modal */}
            <Dialog open={editModalOpen} onClose={closeEditModal}>
                <DialogTitle>Edit Food Entry</DialogTitle>
                <DialogContent>
                    {editEntry && (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1, fontFamily: 'kanit, sans-serif' }}>
                            <TextField
                                label="Food Name"
                                name="food_name"
                                value={editEntry.food_name}
                                onChange={handleEditChange}
                                error={!!editFoodNameError}
                                helperText={editFoodNameError}
                                fullWidth
                                inputRef={editFoodNameRef}
                            />
                            <TextField
                                label="Total Calories"
                                name="total_calories"
                                type="number"
                                value={editEntry.total_calories}
                                onChange={handleEditChange}
                                error={!!editCaloriesError}
                                helperText={editCaloriesError}
                                inputProps={{ step: 1, min: 0 }}
                                fullWidth
                                inputRef={editCaloriesRef}
                            />
                            <TextField
                                label="Meal Type"
                                name="meal_type"
                                value={editEntry.meal_type}
                                onChange={handleEditChange}
                                error={!!editMealTypeError}
                                helperText={editMealTypeError}
                                select
                                fullWidth
                                inputRef={editMealTypeRef}
                            >
                                <MenuItem value="Breakfast">Breakfast</MenuItem>
                                <MenuItem value="Lunch">Lunch</MenuItem>
                                <MenuItem value="Dinner">Dinner</MenuItem>
                                <MenuItem value="Snack">Snack</MenuItem>
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

export default CalorieCounter;