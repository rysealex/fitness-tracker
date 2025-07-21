import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import CurrentDate from '../currentDate';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Navbar from '../navbar';
import CalorieCounterMini from '../calorieCounterMini';
import WorkoutLogMini from '../workoutLogMini';
import GoalsMini from '../goalsMini';

function Home() {
  const navigate = useNavigate();
  const handleNavigate = (url) => {
    navigate(url);
  };
  
  const [stats, setStats] = useState({});

  const handleClickCalorieCounter = () => {
    handleNavigate("/calorie-counter");
  };
  const handleClickWorkoutLog = () => {
    handleNavigate("/workout-log");
  };
  const handleClickGoals = () => {
    handleNavigate("/goals");
  };
  
  // fetch user stats on component mount
  useEffect(() => {
    const fetchStats = async () => {
      // get the current users user_id from local storage
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error("User ID not found in local storage.");
        return;
      }
      try {
        const response = await fetch(`http://localhost:5000/auth/user/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setStats(data);
          console.log("User stats fetched successfully:", data);
        } else {
          console.error("Failed to fetch user stats:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };
    // call the fetchStats function to get user stats
    fetchStats();
  }, []);
    
  return (
    <div className='centered-page'>
      <Navbar />
      <div className='current-date'>
        <h2>Today's Date: <CurrentDate /></h2>
      </div>
      <section className='dashboard-container'>
        <h1>Welcome {stats.username}!</h1>      
        <div className='cards-container'>
          <Stack direction="row" spacing={2}>
            <Card sx={{ maxWidth: 345 }}>
              {/* <CardMedia
                sx={{ height: 140 }}
                image="/images/goals.png"
                title="goals"
              /> */}
              <CardMedia><GoalsMini/></CardMedia>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Goals
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Track and manage your personal goals here!
                </Typography>
              </CardContent>
              <CardActions>
                {/* <Button size="small">Share</Button>
                <Button size="small">Learn More</Button> */}
                <Button
                  variant='contained'
                  style={{
                    backgroundColor: '#C51D34'
                  }}
                  onClick={handleClickGoals}> 
                  Enter
                </Button>
              </CardActions>
            </Card>
            <Card sx={{ maxWidth: 345 }}>
              {/* <CardMedia
                sx={{ height: 140 }}
                image="/images/workout-log.jpg"
                title="workout-log"
              /> */}
              <CardMedia><WorkoutLogMini/></CardMedia>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Workout Log
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Enter your workouts here!
                </Typography>
              </CardContent>
              <CardActions>
                {/* <Button size="small">Share</Button>
                <Button size="small">Learn More</Button> */}
                <Button
                  variant='contained'
                  style={{
                    backgroundColor: '#C51D34'
                  }}
                  onClick={handleClickWorkoutLog}> 
                  Enter
                </Button>
              </CardActions>
            </Card>
            <Card sx={{ maxWidth: 345 }}>
              {/* <CardMedia
                sx={{ height: 140 }}
                image="/images/calorie-counter.jpeg"
                title="workout-log"
              /> */}
              <CardMedia><CalorieCounterMini/></CardMedia>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Calorie Counter
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Track your daily calories here!
                </Typography>
              </CardContent>
              <CardActions>
                {/*<Button size="small">Enter</Button>
                <Button size="small">Learn More</Button>*/}
                <Button
                  variant='contained'
                  style={{
                    backgroundColor: '#C51D34'
                  }}
                  onClick={handleClickCalorieCounter}> 
                  Enter
                </Button>
              </CardActions>
            </Card>
          </Stack>
        </div>
      </section>
    </div>
  )
};

export default Home;