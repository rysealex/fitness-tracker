import { useNavigate } from 'react-router-dom';
import { useStats } from '../StatsContext';
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
  
  const { stats, isLoading, error } = useStats();
  if (isLoading) return <div className='context-container'>
    <h1>Loading...</h1></div>;
  if (error) return <div className='context-container'>
    <h1>Error</h1>: {error.message}</div>;
  if (!stats) return <div className='context-container'>
    <h1>No Stats Available</h1></div>;

  const handleClickCalorieCounter = () => {
    handleNavigate("/calorie-counter");
  };
  const handleClickWorkoutLog = () => {
    handleNavigate("/workout-log");
  };
  const handleClickGoals = () => {
    handleNavigate("/goals");
  };
    
  return (
    <div className='centered-page'>
      <Navbar />
      <section className='dashboard-container'>
        <div className='cards-container'>

          <Card 
            className='dashboard-info-card'
            sx={{ width: 400, margin: '8px', borderRadius: '10px', boxShadow: 'none', overflow: 'visible' }}
          >
            <CardContent>
              <Typography>
                <h1>Dashboard</h1> 
              </Typography>
              <Typography>
                <h2 id='dashboard-username'>{stats.username}</h2>
              </Typography>
              <Typography>
                <div className='current-date'>
                  <CurrentDate />
                </div>
              </Typography>
            </CardContent>
          </Card>

          <Card 
            className='clickable-card'
            onClick={handleClickGoals}
            sx={{ width: 400, margin: '8px', borderRadius: '10px' }}
          >
            <CardMedia><GoalsMini/></CardMedia>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div" sx={{ fontFamily: 'kanit, sans-serif' }}>
                Goals
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'kanit, sans-serif', fontStyle: 'italic' }}>
                Manage your personal goals here!
              </Typography>
            </CardContent>
            {/* <CardActions>
              <Button
                variant='contained'
                style={{ backgroundColor: '#C51D34' }}
                onClick={handleClickGoals}> 
                Enter
              </Button>
            </CardActions> */}
          </Card>

          <Card 
            className='clickable-card'
            onClick={handleClickWorkoutLog}
            sx={{ width: 400, margin: '8px', borderRadius: '10px' }}
          >
            <CardMedia><WorkoutLogMini/></CardMedia>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div" sx={{ fontFamily: 'kanit, sans-serif' }}>
                Workout Log
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'kanit, sans-serif', fontStyle: 'italic' }}>
                Enter your workouts here!
              </Typography>
            </CardContent>
            {/* <CardActions>
              <Button
                variant='contained'
                style={{ backgroundColor: '#C51D34' }}
                onClick={handleClickWorkoutLog}> 
                Enter
              </Button>
            </CardActions> */}
          </Card>

          <Card 
            className='clickable-card'
            onClick={handleClickCalorieCounter}
            sx={{ width: 400, margin: '8px', borderRadius: '10px' }}
          >
            <CardMedia><CalorieCounterMini/></CardMedia>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div" sx={{ fontFamily: 'kanit, sans-serif' }}>
                Calorie Counter
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'kanit, sans-serif', fontStyle: 'italic' }}>
                Track your daily calories here!
              </Typography>
            </CardContent>
            {/* <CardActions>
              <Button
                variant='contained'
                style={{ backgroundColor: '#C51D34' }}
                onClick={handleClickCalorieCounter}> 
                Enter
              </Button>
            </CardActions> */}
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;