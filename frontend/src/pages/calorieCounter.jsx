import { Button, Dialog, DialogContent, DialogActions, DialogTitle, TextField } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import BasicSpeedDial from "../basicSpeedDial";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Box from "@mui/material/Box"
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
				<form onSubmit={handleSubmit}>
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