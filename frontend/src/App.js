import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { StatsProvider } from './StatsContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Navbar from './navbar';
import Welcome from "./pages/welcome";
import Login from "./pages/login"
import CreateAccount from "./pages/createAccount"
import Home from "./pages/home"
import EnterInformation from "./pages/enterInformation"
import Stats from "./pages/stats"
import Notifications from './pages/notifications';
import Profile from "./pages/profile"
import Settings from "./pages/settings"
import CalorieCounter from './pages/calorieCounter';
import WorkoutLog from './pages/workoutLog';
import Goals from './pages/goals';
import './App.css';

function App() {

  const customTheme = createTheme({
    palette: {
      primary: {
        main: '#C51D34',
      },
    },
    components: {
      MuiPickersDay: {
        styleOverrides: {
          root: {
            '&.Mui-selected': {
              backgroundColor: '#C51D34',
              '&:hover': {
                backgroundColor: '#A0152B',
              },
            },
            '&:hover': {
              backgroundColor: 'rgba(197, 29, 52, 0.08)',
            }
          }
        }
      }
    }
  });

  return (
    <Router>
      <Routes>
        {/* Public routes (no StatsProvder) */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/enter-info" element={<EnterInformation />} />
        {/* Protected routes (with StatsProvider) */}
        <Route
          path="/home"
          element={
            <StatsProvider>
              <Home />
            </StatsProvider>
          }
        />
        <Route
          path="/stats"
          element={
            <StatsProvider>
              <Stats />
            </StatsProvider>
          }
        />
        <Route
          path="/notifications"
          element={
            <StatsProvider>
              <Notifications />
            </StatsProvider>
          }
        />
        <Route
          path="/profile"
          element={
            <StatsProvider>
              <Profile />
            </StatsProvider>
          }
        />
        <Route
          path="/settings"
          element={
            <StatsProvider>
              <Settings />
            </StatsProvider>
          }
        />
        <Route
          path="/calorie-counter"
          element={
            <StatsProvider>
              <ThemeProvider theme={customTheme}>
                <CalorieCounter />
              </ThemeProvider>
            </StatsProvider>
          }
        />
        <Route
          path="/workout-log"
          element={
            <StatsProvider>
              <ThemeProvider theme={customTheme}>
                <WorkoutLog />
              </ThemeProvider>
            </StatsProvider>
          }
        />
        <Route
          path="/goals"
          element={
            <StatsProvider>
              <ThemeProvider theme={customTheme}>
                <Goals />
              </ThemeProvider>
            </StatsProvider>
          }
        />
      </Routes>
    </Router>
  )
};

export default App;
