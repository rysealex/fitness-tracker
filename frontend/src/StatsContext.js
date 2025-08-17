import { createContext, useState, useEffect, useContext } from 'react';

const StatsContext = createContext();

export const StatsProvider = ({ children }) => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
	// const [userId, setUserId] = useState(localStorage.getItem('userId'));

	// // listen for changes in local storage to update userId
	// useEffect(() => {
  //   const handleStorageChange = () => {
  //     setUserId(localStorage.getItem('userId'));
  //   };
  //   window.addEventListener('storage', handleStorageChange);
  //   return () => window.removeEventListener('storage', handleStorageChange);
  // }, []);

  // // fetch user stats on component mount
	// useEffect(() => {
	// 	if (!userId) {
  //     setStats(null);
  //     setIsLoading(false);
  //     setError(null);
  //     return;
  //   }
  //   setIsLoading(true);
  //   setError(null);
	// 	const fetchStats = async () => {
	// 		try {
	// 			const response = await fetch(`http://localhost:5000/auth/user/${userId}`);
	// 			if (response.ok) {
	// 				const data = await response.json();
	// 				setIsLoading(false);
	// 				setStats(data);
	// 				console.log("User stats fetched successfully:", data);
	// 			} else {
	// 				setIsLoading(false);
	// 				setError(new Error("Failed to fetch user stats"));
	// 				console.error("Failed to fetch user stats:", response.statusText);
	// 			}
	// 		} catch (error) {
	// 			setIsLoading(false);
	// 			setError(error);
	// 			console.error("Error fetching user stats:", error);
	// 		}
	// 	};
	// 	// call the fetchStats function to get user stats
	// 	fetchStats();
	// }, [userId]);

  // fetch logic with JWT token
  useEffect(() => {
    const token = localStorage.getItem('token'); // get the JWT token

    // if token does not exist, user is not authenticated
    if (!token) {
      setStats(null);
      setIsLoading(false);
      setError(new Error("User is not authenticated"));
      return;
    }
    // continue with the fetch logic
    setIsLoading(true);
    setError(null);

    const fetchStats = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/stats`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // use the JWT token for authentication
          },
        });

        // check if response if ok
        if (response.ok) {
          const data = await response.json();
          setStats(data);
          setIsLoading(false);
          console.log("User stats fetched successfully:", data);
        } else if (response.status === 401) {
          console.error("Unauthorized: Token is invalid or expired.");
          localStorage.removeItem('token'); // clear the invalid token
          setIsLoading(false);
          setError(new Error("Session expired. Please log in again."));
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