import { createContext, useState, useEffect, useContext } from 'react';

const StatsContext = createContext();

export const StatsProvider = ({ children }) => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetch user stats on component mount
	useEffect(() => {
		const fetchStats = async () => {
			// get the current users user_id from local storage
			const userId = localStorage.getItem('userId');
			if (!userId) {
				console.error("User ID not found in local storage.");
				return;
			}
			setIsLoading(true);
      setError(null);
			try {
				const response = await fetch(`http://localhost:5000/auth/user/${userId}`);
				if (response.ok) {
					const data = await response.json();
					setIsLoading(false);
					setStats(data);
					console.log("User stats fetched successfully:", data);
				} else {
					setIsLoading(false);
					setError(new Error("Failed to fetch user stats"));
					console.error("Failed to fetch user stats:", response.statusText);
				}
			} catch (error) {
				setIsLoading(false);
				setError(error);
				console.error("Error fetching user stats:", error);
			}
		};
		// call the fetchStats function to get user stats
		fetchStats();
	}, []);

  return (
    <StatsContext.Provider value={{ stats, isLoading, error, setStats }}>
      {children}
    </StatsContext.Provider>
  );
};

export const useStats = () => {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
};