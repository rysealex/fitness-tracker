import { useState, useEffect } from "react";
import { FaTrophy } from "react-icons/fa";

function GoalsMini() {

    const [goals, setGoals] = useState([]);

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

    // filter goals by status
    const activeGoals = goals.filter(goal => goal.status === 'Active');
    const completedGoals = goals.filter(goal => goal.status === 'Completed');
    const abandonedGoals = goals.filter(goal => goal.status === 'Abandoned');

    // get the count for each goal status
    const activeCount = activeGoals.length;
    const completedCount = completedGoals.length;
    const abandonedCount = abandonedGoals.length;

    return (
        <div className="mini-container"> 
            <FaTrophy className="goals-mini-trophy-icon" />
            <div className="mini-text-value-group">
                <span className="workout-log-mini-text">Active Goals</span>
                <span className="mini-value">{activeCount}</span>
            </div>
        </div>
    )
};

export default GoalsMini;