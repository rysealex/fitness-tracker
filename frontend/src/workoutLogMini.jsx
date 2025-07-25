import { useState, useEffect } from 'react';
import { GiWeightLiftingUp } from "react-icons/gi";

function WorkoutLogMini() {

    const [todayWorkoutLogs, setTodayWorkoutLogs] = useState({});

    // function to fetch workout logs for the user
	const fetchWorkoutLogs = async () => {
		// get the current users user_id from local storage
		const userId = localStorage.getItem('userId');
		if (!userId) {
			console.error("User ID not found in local storage.");
			return;
		}
		// continue to fetch today's workout logs for the user
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

    const totalWorkoutsToday = Object.values(todayWorkoutLogs).length;

    return (
        <div className="mini-container">
            <GiWeightLiftingUp className="workout-log-mini-weight-lifting-icon" />
            <div className="mini-text-value-group">
                <span className="workout-log-mini-text">Today's Workouts</span>
                <span className="mini-value">{totalWorkoutsToday}</span>
            </div>
        </div>
    )
};

export default WorkoutLogMini;