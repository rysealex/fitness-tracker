import { Button, Dialog, DialogContent, DialogActions, DialogTitle, TextField, Card, CardContent, Typography, Box, Divider, IconButton, MenuItem } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Edit, Delete } from '@mui/icons-material';
import BasicSpeedDial from "../basicSpeedDial";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Slider from "@mui/material/Slider";
import { faFireFlameCurved } from '@fortawesome/free-solid-svg-icons';

function CalorieCounter() {
    const navigate = useNavigate();
			const handleNavigate = (url) => {
			navigate(url);
		};

		const [foodName, setFoodName] = useState("");
		const [totalCalories, setTotalCalories] = useState(0);
		const [mealType, setMealType] = useState("");
		const [allFoodEntries, setAllFoodEntries] = useState({});
		const [todayFoodEntries, setTodayFoodEntries] = useState({});
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

		// function to handle the food entry edit submission
		const handleEditSubmit = async () => {
			try {
        const response = await fetch(`http://localhost:5000/food/edit/${editEntry.food_entries_id}`, {
					method: 'PUT',
					headers: {
							'Content-Type': 'application/json',
					},
					body: JSON.stringify({
							food_name: editEntry.food_name,
							total_calories: editEntry.total_calories,
							meal_type: editEntry.meal_type,
					}),
        });
        if (response.ok) {
					const data = await response.json();
					console.log("Food entry edited successfully: ", data);
					// close the edit modal and fetch updated food entries
					closeEditModal();
					fetchFoodEntries();
        } else {
					console.error("Failed to update food entry:", response.statusText);
					return;
				}
			} catch (error) {
				console.error("Error updating food entry:", error);
				return;
			}
		};

		// function to handle the food entry submission attempt
		const handleSubmit = async (e) => {
			e.preventDefault();

			// perform input validation
			if (!foodName || !totalCalories || !mealType) {
				alert("Please fill in all fields.");
				return;
			} else {
				// proceed with form submission
				try {
					console.log("Submitting food entry now!");
					const response = await fetch('http://localhost:5000/food/add', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							user_id: localStorage.getItem('userId'), // get user id from local storage
							food_name: foodName,
							total_calories: totalCalories,
							meal_type: mealType,
						}),
					});
					// check if the response is ok
					if (response.ok) {
						const data = await response.json();
						console.log("Food entry submitted successfully:", data);
						// fetch the updated food entries after submission
						fetchFoodEntries();
					} else {
						console.log("Failed to submit food entry:", response.statusText);
						return;
					}
				} catch (error) {
					console.error("Error submitting food entry:", error);
					return;
				}
			}
		};

		// function to handle the deletion of a food entry
		const handleDeleteEntry = async (food_entries_id) => {
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
					// fetch the updated food entries after deletion
					fetchFoodEntries();
				} else {
					console.error("Failed to delete food entry:", response.statusText);
				}
			} catch (error) {
				console.error("Error deleting food entry:", error);
			}
		};

		//  function to fetch food entries for the user
		const fetchFoodEntries = async () => {
			// get the current users user_id from local storage
			const userId = localStorage.getItem('userId');
			if (!userId) {
				console.error("User ID not found in local storage.");
				return;
			}
			// first fetch all food entries for the user
			try {
				const response = await fetch(`http://localhost:5000/food/entries/${userId}`);
				if (response.ok) {
					const data = await response.json();
					setAllFoodEntries(data);
					console.log("All user food entries fetched successfully:", data);
				} else {
					console.error("Failed to fetch all user food entries:", response.statusText);
				}
			} catch (error) {
				console.error("Error fetching all user food entries:", error);
			}
			// second fetch today's food entries for the user
			try {
				const response = await fetch(`http://localhost:5000/food/entries/today/${userId}`);
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

		// const [fireBurstVisible, setFireBurstVisible] = useState(false);
		// const [calorieValue, setCalorieValue] = useState(0);
		// // state for all the modals
		// const [breakfastMode, setBreakfastMode] = useState(false);
		// const [lunchMode, setLunchMode] = useState(false);
		// const [dinnerMode, setDinnerMode] = useState(false);
		// const [snacksMode, setSnacksMode] = useState(false);
		// // state for each input
		// const [breakfastInput, setBreakfastInput] = useState("");
		// const [lunchInput, setLunchInput] = useState("");
		// const [dinnerInput, setDinnerInput] = useState("");
		// const [snacksInput, setSnacksInput] = useState("");
		// // event handler for exit calorie counter
		// const handleClickExit = () => {
		// 	handleNavigate('/home');
		// };
		// // event handler for the fire burst
		// const handleFireClick = () => {
		// 	setFireBurstVisible(true);
		// 	setTimeout(() => setFireBurstVisible(false), 1000); // remove burst after 1 sec
		// }
		// // event handler for the calorie slider
		// const handleSliderChange = (event, newValue) => {
		// 	setCalorieValue(newValue);
		// };
		// // event handlers for each click
		// const handleBreakfastClick = () => {
		// 	console.log("Success");
		// 	setBreakfastMode(true);
		// };
		// const handleLunchClick = () => {
		// 	console.log("Success");
		// 	setLunchMode(true);
		// };
		// const handleDinnerClick = () => {
		// 	console.log("Success");
		// 	setDinnerMode(true);
		// };
		// const handleSnacksClick = () => {
		// 	console.log("Success");
		// 	setSnacksMode(true);
		// };
		// // handle the input change for all
		// const handleInputChange = (meal, event) => {
		// 	if (meal === 'breakfast') {
		// 		setBreakfastInput(event.target.value);
		// 	} else if (meal === 'lunch') {
		// 		setLunchInput(event.target.value);
		// 	} else if (meal === 'dinner') {
		// 		setDinnerInput(event.target.value);
		// 	} else if (meal === 'snacks') {
		// 		setSnacksInput(event.target.value);
		// 	}
		// };
		// // handle the form submission
		// const handleSubmit = (meal) => {
		// 	if (meal === 'breakfast') {
		// 		console.log(`${breakfastInput}`);
		// 		setBreakfastMode(false);
		// 		setBreakfastInput('');
		// 	} else if (meal === 'lunch') {
		// 		console.log(`${lunchInput}`);
		// 		setLunchMode(false);
		// 		setLunchInput('');
		// 	} else if (meal === 'dinner') {
		// 		console.log(`${dinnerInput}`);
		// 		setDinnerMode(false);
		// 		setDinnerInput('');
		// 	} else if (meal === 'snacks') {
		// 		console.log(`${snacksInput}`);
		// 		setSnacksMode(false);
		// 		setSnacksInput('');
		// 	} 
		// };
		// // handle the modal close
		// const handleCloseModal = () => {
		// 	setBreakfastMode(false);
		// 	setLunchMode(false);
		// 	setDinnerMode(false);
		// 	setSnacksMode(false);
		// };
		
		return (
			<div>
        <Box sx={{ maxWidth: 700, mx: "auto", mt: 4, p: 2 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Calorie Counter
            </Typography>
            <Card sx={{ mb: 4, p: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Add New Food Entry
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                        <TextField
                            label="Food Name"
                            variant="outlined"
                            value={foodName}
                            onChange={(e) => setFoodName(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Calories"
                            variant="outlined"
                            type="number"
                            value={totalCalories}
                            onChange={(e) => setTotalCalories(e.target.value)}
                            inputProps={{ step: 1, min: 0 }}
														fullWidth
                        />
                        <TextField
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
												</TextField>
                    </Box>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Add Food
                    </Button>
                </form>
            </Card>

            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Today's Food Entries
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        Total Calories: <b>{calcTodayTotalCalories(todayFoodEntries)}</b>
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    {Object.keys(todayFoodEntries).length === 0 ? (
                        <Typography color="text.secondary">No entries for today.</Typography>
                    ) : (
                        Object.entries(todayFoodEntries).map(([id, entry]) => (
                            <Box key={id} sx={{ mb: 2, p: 1, borderRadius: 1, bgcolor: "#f9f9f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Box>
                                    <Typography variant="subtitle1">{entry.food_name}</Typography>
                                    <Typography variant="body2">Calories: {entry.total_calories}</Typography>
                                    <Typography variant="body2">Meal: {entry.meal_type}</Typography>
                                    <Typography variant="body2" color="text.secondary">Date: {entry.created_at}</Typography>
                                </Box>
                                <Box>
                                    <IconButton color="primary" onClick={() => openEditModal(entry)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDeleteEntry(entry.food_entries_id)}>
                                        <Delete />
                                    </IconButton>
                                </Box>
                            </Box>
                        ))
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        All Food Entries
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    {Object.keys(allFoodEntries).length === 0 ? (
                        <Typography color="text.secondary">No entries found.</Typography>
                    ) : (
                        Object.entries(allFoodEntries).map(([id, entry]) => (
                            <Box key={id} sx={{ mb: 2, p: 1, borderRadius: 1, bgcolor: "#f9f9f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Box>
                                    <Typography variant="subtitle1">{entry.food_name}</Typography>
                                    <Typography variant="body2">Calories: {entry.total_calories}</Typography>
                                    <Typography variant="body2">Meal: {entry.meal_type}</Typography>
                                    <Typography variant="body2" color="text.secondary">Date: {entry.created_at}</Typography>
                                </Box>
                                <Box>
                                    <IconButton color="primary" onClick={() => openEditModal(entry)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDeleteEntry(entry.food_entries_id)}>
                                        <Delete />
                                    </IconButton>
                                </Box>
                            </Box>
                        ))
                    )}
                </CardContent>
            </Card>

            <Box sx={{ mt: 4, textAlign: "center" }}>
                <Button variant="outlined" color="secondary" onClick={() => handleNavigate('/home')}>
                    Exit
                </Button>
            </Box>

            <Dialog open={editModalOpen} onClose={closeEditModal}>
                <DialogTitle>Edit Food Entry</DialogTitle>
                <DialogContent>
                    {editEntry && (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                            <TextField
                                label="Food Name"
                                name="food_name"
                                value={editEntry.food_name}
                                onChange={handleEditChange}
                                fullWidth
                            />
                            <TextField
                                label="Total Calories"
                                name="total_calories"
                                type="number"
                                value={editEntry.total_calories}
                                onChange={handleEditChange}
																inputProps={{ step: 1, min: 0 }}
                                fullWidth
                            />
                            <TextField
                                label="Meal Type"
                                name="meal_type"
                                value={editEntry.meal_type}
                                onChange={handleEditChange}
																select
                                fullWidth
                            >
															<MenuItem value="Breakfast">Breakfast</MenuItem>
															<MenuItem value="Lunch">Lunch</MenuItem>
															<MenuItem value="Dinner">Dinner</MenuItem>
															<MenuItem value="Snack">Snack</MenuItem>
														</TextField>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeEditModal}>Cancel</Button>
                    <Button onClick={handleEditSubmit} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
				{/* <form onSubmit={handleSubmit}>
					<div>
						<h1>Food Name: </h1>
						<TextField 
							label="Enter food name"
							variant="outlined"
							fullWidth
							autoFocus
							style={{ marginBottom: '20px' }}
							onChange={(e) => setFoodName(e.target.value)}
						/>
					</div>
					<div>
						<h1>Total Calories: </h1>
						<TextField 
							label="Enter total calories"
							variant="outlined"
							fullWidth
							style={{ marginBottom: '20px' }}
							onChange={(e) => setTotalCalories(e.target.value)}
						/>
					</div>
					<div>
						<h1>Meal Type: </h1>
						<TextField 
							label="Enter meal type"
							variant="outlined"
							fullWidth
							style={{ marginBottom: '20px' }}
							onChange={(e) => setMealType(e.target.value)}
						/>
					</div>
					<div>
						<button type="submit">
							Enter New Food
						</button>
					</div>
				</form>
				<div>
					<button onClick={(e) => handleNavigate('/home')}>Exit</button>
				</div>
				<div>
					<h1>Today's Food Entries</h1>
					<h2>Today's Total Calories: {calcTodayTotalCalories(todayFoodEntries)}</h2>
					<ul>
						{Object.entries(todayFoodEntries).map(([id, entry]) => (
								<li key={id}>
									<h2>{entry.food_name}</h2>
								<p>Calories: {entry.total_calories}</p>
								<p>Meal Type: {entry.meal_type}</p>
								<p>Date: {entry.created_at}</p>
								<button onClick={() => openEditModal(entry)}>Edit</button>
								<button onClick={() => handleDeleteEntry(entry.food_entries_id)}>Delete</button>
							</li>
						))}
					</ul>
				</div>
				<div>
					<h1>All Food Entries</h1>
					<ul>
						{Object.entries(allFoodEntries).map(([id, entry]) => (
							<li key={id}>
								<h2>{entry.food_name}</h2>
								<p>Calories: {entry.total_calories}</p>
								<p>Meal Type: {entry.meal_type}</p>
								<p>Date: {entry.created_at}</p>
								<button onClick={() => openEditModal(entry)}>Edit</button>
								<button onClick={() => handleDeleteEntry(entry.food_entries_id)}>Delete</button>
							</li>
						))}
					</ul>
				</div>
				<Dialog open={editModalOpen} onClose={closeEditModal}>
					<DialogTitle>Edit Food Entry</DialogTitle>
					<DialogContent>
						{editEntry && (
							<>
								<TextField
									margin="dense"
									label="Food Name"
									name="food_name"
									value={editEntry.food_name}
									onChange={handleEditChange}
									fullWidth
								/>
								<TextField
									margin="dense"
									label="Total Calories"
									name="total_calories"
									type="number"
									value={editEntry.total_calories}
									onChange={handleEditChange}
									fullWidth
								/>
								<TextField
									margin="dense"
									label="Meal Type"
									name="meal_type"
									value={editEntry.meal_type}
									onChange={handleEditChange}
									fullWidth
								/>
							</>
						)}
					</DialogContent>
					<DialogActions>
						<Button onClick={closeEditModal}>Cancel</Button>
						<Button onClick={handleEditSubmit} variant="contained">Save</Button>
					</DialogActions>
        </Dialog> */}
			</div>
			// <div>
			// 	<div className="calorie-counter-container">
			// 		<h1>Calorie Counter</h1>
			// 		<div className="icon-container" onClick={handleFireClick}>
			// 			<FontAwesomeIcon 
			// 				icon={faFireFlameCurved} 
			// 				style={{ 
			// 					fontSize: '250px', 
			// 					color: '#ff6801'	
			// 					//background-image: linear-gradient(319deg, #ffb347 0%, #ff6801 37%, #F6C324 100%);

			// 				}} 
			// 			/>
			// 			{fireBurstVisible && (
			// 				<div className="fireburst"></div>
			// 			)}
			// 		</div>
			// 		<div className="exit-container">
			// 			<Button
			// 				variant='contained'
			// 				style={{
			// 					backgroundColor: '#C51D34'
			// 				}}
			// 				onClick={handleClickExit}> 
			// 				Exit
			// 			</Button>
			// 		</div>
			// 		<div className="speed-dial-container">
			// 			<BasicSpeedDial 
			// 				onBreakfastClick={handleBreakfastClick}
			// 				onLunchClick={handleLunchClick}
			// 				onDinnerClick={handleDinnerClick}
			// 				onSnacksClick={handleSnacksClick}
			// 			/>
			// 		</div>
			// 		<div className="slider-container">
			// 			<Box sx={{ width: 300 }}>
			// 				<Slider
			// 					aria-label="Calories"
			// 					value={calorieValue}
			// 					onChange={handleSliderChange}
			// 					valueLabelDisplay="auto"
			// 					step={10}
			// 					marks
			// 					min={0}
			// 					max={100}
			// 				/>
			// 			</Box>
			// 		</div>
			// 	</div>
			// 	<Dialog open={breakfastMode} onClose={handleCloseModal}>
			// 		<DialogTitle>Enter Your Breakfast</DialogTitle>
			// 		<DialogContent sx={{ width: '500px', height: '400px' }}>
			// 			<TextField
			// 				label="Breakfast Item"
			// 				variant="outlined"
			// 				fullWidth
			// 				value={breakfastInput}
			// 				onChange={(e) => handleInputChange('breakfast', e)}
			// 				autoFocus
			// 				style={{
			// 					marginTop: '10px',
			// 				}}
			// 			/>
			// 			<h2>Calories:</h2>
			// 			<Box sx={{ width: 300 }}>
			// 				<Slider
			// 					aria-label="Calories"
			// 					value={calorieValue}
			// 					onChange={handleSliderChange}
			// 					valueLabelDisplay="auto"
			// 					step={10}
			// 					marks
			// 					min={0}
			// 					max={100}
			// 				/>
			// 			</Box>
			// 		</DialogContent>
			// 		<DialogActions>
			// 			<Button onClick={handleCloseModal}>
			// 				Cancel
			// 			</Button>
			// 			<Button onClick={() => handleSubmit('breakfast')}>
			// 				Submit
			// 			</Button>
			// 		</DialogActions>
			// 	</Dialog>
			// 	<Dialog open={lunchMode} onClose={handleCloseModal}>
			// 		<DialogTitle>Enter Your Lunch</DialogTitle>
			// 		<DialogContent>
			// 			<TextField
			// 				label="Lunch"
			// 				variant="outlined"
			// 				fullWidth
			// 				value={lunchInput}
			// 				onChange={(e) => handleInputChange('lunch', e)}
			// 				autoFocus
			// 			/>
			// 		</DialogContent>
			// 		<DialogActions>
			// 			<Button onClick={handleCloseModal}>
			// 				Cancel
			// 			</Button>
			// 			<Button onClick={() => handleSubmit('lunch')}>
			// 				Submit
			// 			</Button>
			// 		</DialogActions>
			// 	</Dialog>
			// 	<Dialog open={dinnerMode} onClose={handleCloseModal}>
			// 		<DialogTitle>Enter Your Dinner</DialogTitle>
			// 		<DialogContent>
			// 			<TextField
			// 				label="Dinner"
			// 				variant="outlined"
			// 				fullWidth
			// 				value={dinnerInput}
			// 				onChange={(e) => handleInputChange('dinner', e)}
			// 				autoFocus
			// 			/>
			// 		</DialogContent>
			// 		<DialogActions>
			// 			<Button onClick={handleCloseModal}>
			// 				Cancel
			// 			</Button>
			// 			<Button onClick={() => handleSubmit('dinner')}>
			// 				Submit
			// 			</Button>
			// 		</DialogActions>
			// 	</Dialog>
			// 	<Dialog open={snacksMode} onClose={handleCloseModal}>
			// 		<DialogTitle>Enter Your Snacks</DialogTitle>
			// 		<DialogContent>
			// 			<TextField
			// 				label="Snacks"
			// 				variant="outlined"
			// 				fullWidth
			// 				value={snacksInput}
			// 				onChange={(e) => handleInputChange('snacks', e)}
			// 				autoFocus
			// 			/>
			// 		</DialogContent>
			// 		<DialogActions>
			// 			<Button onClick={handleCloseModal}>
			// 				Cancel
			// 			</Button>
			// 			<Button onClick={() => handleSubmit('snacks')}>
			// 				Submit
			// 			</Button>
			// 		</DialogActions>
			// 	</Dialog>
			// </div>
		)
};

export default CalorieCounter;