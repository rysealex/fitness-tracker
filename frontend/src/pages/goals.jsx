import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { TextField } from "@mui/material";

function Goals() {
	const navigate = useNavigate();
		const handleNavigate = (url) => {
		navigate(url);
	};

	const [goalTitle, setGoalTitle] = useState("");
	const [goalType, setGoalType] = useState("");
	// const [startDate, setStartDate] = useState(Date());
	// const [endDate, setEndDate] = useState(Date());
	// const [status, setStatus] = useState("");
	const [goals, setGoals] = useState({});

	// function to handle the goal submission attempt
	const handleSubmit = async (e) => {
		e.preventDefault();

		// perform input validation
		if (!goalTitle || !goalType) {
			alert("Please fill in all fields.");
			return;
		} else {
			// proceed with form submission
			try {
				console.log("Submitting goal now!");
				const response = await fetch('http://localhost:5000/goal/add', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						user_id: localStorage.getItem('userId'), // get user id from local storage
						goal_title: goalTitle,
						goal_type: goalType
						// start_date: startDate,
						// end_date: endDate,
						// status: status
					}),
				});
				// check if the response is ok
				if (response.ok) {
					const data = await response.json();
					console.log("Goal submitted successfully:", data);
					// fetch the goals to update UI for new goal added
					fetchGoals();
					// clear the input fields
					setGoalTitle("");
					setGoalType("");
					// setStartDate(Date());
					// setEndDate(Date());
					// setStatus("");

				} else {
					console.log("Failed to submit goal:", response.statusText);
					return;
				}
			} catch (error) {
				console.error("Error submitting goal:", error);
				return;
			}
		}
	};

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

	return (
		<div>
			<div>Goals Page</div>
			<div>
				<h1>Add Goal Here</h1>
				<form onSubmit={handleSubmit}>
					<TextField
						label="Goal Title"
						variant="outlined"
						value={goalTitle}
						onChange={(e) => setGoalTitle(e.target.value)}
						fullWidth
					/>
					<TextField
						label="Goal Type"
						variant="outlined"
						value={goalType}
						onChange={(e) => setGoalType(e.target.value)}
						fullWidth
					/>
					{/* <TextField
						label="Start Date"
						variant="outlined"
						value={startDate}
						type="date"
						onChange={(e) => setStartDate(e.target.value)}
						fullWidth
					/>
					<TextField
						label="End Date"
						variant="outlined"
						type="date"
						value={endDate}
						onChange={(e) => setEndDate(e.target.value)}
						fullWidth
					/>
					<TextField
						label="Status"
						variant="outlined"
						value={status}
						onChange={(e) => setStatus(e.target.value)}
						fullWidth
					/> */}
					<button type="submit">
						Add
					</button>
				</form>
			</div>
			<ul>
        {goals.length > 0 ? (
          goals.map((goal) => (
            <li key={goal.goal_id}>
              <h3>{goal.goal_title}</h3>
              <p>Type: {goal.goal_type}</p>
              <p>Start Date: {goal.start_date}</p>
              <p>End Date: {goal.end_date ? goal.end_date : "N/A"}</p>
              <p>Status: {goal.status}</p>
            </li>
          ))
        ) : (
          <li>No goals to display</li>
        )}
      </ul>
			<button onClick={() => handleNavigate('/home')}>
				Exit
			</button>
		</div>
	)
};

export default Goals;