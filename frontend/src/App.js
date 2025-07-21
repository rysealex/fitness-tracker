import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AudioProvider } from './AudioContext';
import { StatsProvider } from './StatsContext';
import Navbar from './navbar';
import Welcome from "./pages/welcome";
import Login from "./pages/login"
import CreateAccount from "./pages/createAccount"
import Home from "./pages/home"
import EnterInformation from "./pages/enterInformation"
import Stats from "./pages/stats"
import Profile from "./pages/profile"
import Settings from "./pages/settings"
import CalorieCounter from './pages/calorieCounter';
import WorkoutLog from './pages/workoutLog';
import Goals from './pages/goals';
import './App.css';

function App() {


  return (
    <Router>
      <StatsProvider>
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/home" element={<Home />} />
          <Route path="/enter-info" element={<EnterInformation />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/calorie-counter" element={<CalorieCounter />} />
          <Route path="/workout-log" element={<WorkoutLog />} />
          <Route path="/goals" element={<Goals />} />
        </Routes>
      </StatsProvider>
    </Router>
  )
};

export default App;
