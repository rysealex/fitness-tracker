import { useState, useEffect } from "react";
import { FaFire } from "react-icons/fa";
import './styles/index.css';

function CalorieCounterMini() {

    const [todayFoodEntries, setTodayFoodEntries] = useState({});

    //  function to fetch food entries for the user
	const fetchFoodEntries = async () => {
		// get the current users user_id from local storage
		const userId = localStorage.getItem('userId');
		if (!userId) {
			console.error("User ID not found in local storage.");
			return;
		}
		// continue to fetch today's food entries for the user
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

    const totalCalories = calcTodayTotalCalories(todayFoodEntries);

    return (
        <div className="mini-container">
            <FaFire className="calorie-counter-mini-flame-icon" />
            <div className="mini-text-value-group">
                <span className="calorie-counter-mini-text">Today's Calories</span>
                <span className="mini-value">{totalCalories}</span>
            </div>
        </div>
    )
};

export default CalorieCounterMini;