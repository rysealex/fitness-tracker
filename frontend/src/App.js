import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AudioProvider } from './AudioContext';
import Welcome from "./pages/welcome";
import Login from "./pages/login"
import CreateAccount from "./pages/createAccount"
import Home from "./pages/home"
import EnterInformation from "./pages/enterInformation"
import Stats from "./pages/stats"
import Profile from "./pages/profile"
import Settings from "./pages/settings"
import CalorieCounter from './pages/calorieCounter';
import './App.css';
import React from 'react';

function App() {


  return (
    <AudioProvider>
      <Router>
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
        </Routes>
      </Router>
    </AudioProvider>
    
  )
};

export default App;
