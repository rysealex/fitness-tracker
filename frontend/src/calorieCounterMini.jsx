import { useState, useEffect } from "react";
import { FaFire } from "react-icons/fa";
import CircularProgress from '@mui/material/CircularProgress';
import './styles/index.css';

function CalorieCounterMini() {

	const [todayFoodEntries, setTodayFoodEntries] = useState({});
	const [isLoading, setIsLoading] = useState(false);

	// //  function to fetch food entries for the user
	// const fetchFoodEntries = async () => {
	// 	// get the current users user_id from local storage
	// 	const userId = localStorage.getItem('userId');
	// 	if (!userId) {
	// 		console.error("User ID not found in local storage.");
	// 		return;
	// 	}
	// 	// continue to fetch today's food entries for the user
	// 	try {
	// 		const response = await fetch(`http://localhost:5000/food/entries/today/${userId}`);
	// 		if (response.ok) {
	// 			const data = await response.json();
	// 			setTodayFoodEntries(data);
	// 			console.log("Today's user food entries fetched successfully:", data);
	// 		} else {
	// 			console.error("Failed to fetch today's user food entries:", response.statusText);
	// 		}
	// 	} catch (error) {
	// 		console.error("Error fetching today's user food entries:", error);
	// 	}
	// };

	// function to fetch food entries for the user with JWT token
	const fetchFoodEntries = async () => {
		// start loading state
    	setIsLoading(true);

		// get the JWT token from local storage
		const token = localStorage.getItem('token');

		// if token does not exist, user is not authenticated
		if (!token) {
			console.error("User is not authenticated.");
			setIsLoading(false);
			return;
		}

		// continue to fetch today's food entries for the user
		try {
			const response = await fetch(`http://localhost:5000/food/stats`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}` // use the JWT token for authentication
				},
			});

			// check if response is ok
			if (response.ok) {
				const data = await response.json();
				setIsLoading(false);
				setTodayFoodEntries(data);
				console.log("Today's user food entries fetched successfully:", data);
			} else {
				setIsLoading(false);
				console.error("Failed to fetch today's user food entries:", response.statusText);
			}
		} catch (error) {
			setIsLoading(false);
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

	const totalCalories = calcTodayTotalCalories(todayFoodEntries);

	return (
		<div className="mini-container">
			<FaFire className="calorie-counter-mini-flame-icon" />
			<div className="mini-text-value-group">
				<span className="calorie-counter-mini-text">Calories</span>
				<span className="mini-value">
					{isLoading ? (
						// <Box sx={{ mt: 2, textAlign: 'center' }}>
						<CircularProgress sx={{ color: '#00ff7f' }} />
						// </Box>
					) : (
						totalCalories
					)}
				</span>
			</div>
		</div>
	)
};

export default CalorieCounterMini;