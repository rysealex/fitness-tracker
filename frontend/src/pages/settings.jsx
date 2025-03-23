import React, { useState, useEffect } from 'react';
import { useUser } from '../userContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/index.css'
import MediaControlCard from '../mediaControlCard';
import { useAudio } from '../AudioContext';
import FormDialog from '../formDialog';

function Settings() {
  const navigate = useNavigate();
  const handleNavigate = (url) => {
    navigate(url);
  };
  const { username, setUsername } = useUser();
  const [stats, setStats] = useState({});
  //const [isPlaying, setIsPlaying] = useState(false);
  //const [currentTrack, setCurrentTrack] = useState("Track 1");
  const { isPlaying, currentSongIndex, togglePlayPause, skipNext, skipPrevious, songs, stopAudio } = useAudio();
  // Event handler for nav bar buttons
  const handleSignOut = (event) => {
    setUsername("");
    stopAudio();
    handleNavigate('/');
  };
  const handleClickDashboard = () => {
    handleNavigate('/home');
  };
  const handleClickStats = () => {
    handleNavigate('/stats');
  };
  const handleClickProfile = () => {
    handleNavigate('/profile');
  };
  const handleClickSettings = () => {
    handleNavigate('/settings');
  };
  // Fetch user stats
  useEffect(() => {
    if (username) {
      axios.get(`http://127.0.0.1:5000/user/${username}/stats`)
        .then(function (response) {
          console.log(response);
          setStats(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [username]);
  // handler for controlling the audio state
  /*const togglePlayPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };
  // handlers for skipping to next and previous tracks
  const skipNext = () => {
    setCurrentTrack("Next Track");
  };
  const skipPrevious = () => {
    setCurrentTrack("Previous Track");
  };*/
  return (
    <div>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      <aside className='nav-container'>
        <div className='nav-header'>
          <img src='/images/muscle-logo.png' alt='logo'></img>
          <h2>FitnessTracker</h2>
        </div>
        <ul className='nav-links'>
          <h4>
            <span>Main Menu</span>
            <div className='menu-separator'></div>
          </h4>
          <li>
            <a href='' onClick={() => handleClickDashboard()}><span 
            class="material-symbols-outlined">
              dashboard
              </span>Dashboard</a>
          </li>
          <li>
            <a href='' onClick={() => handleClickStats()}><span 
            class="material-symbols-outlined">
              monitoring
              </span>Stats</a>
          </li>
          <li>
            <a href='#'><span 
            class="material-symbols-outlined">
              notifications_active
              </span>Notifications</a>
          </li>
          <li>
            <a href='' onClick={() => handleClickProfile()}><span 
            class="material-symbols-outlined">
              account_circle
              </span>Profile</a>
          </li>
          <li>
            <a href='' onClick={() => handleClickSettings()}><span 
            class="material-symbols-outlined">
              settings
              </span>Settings</a>
          </li>
          <li>
            <a href='' onClick={() => handleSignOut()}><span 
            class="material-symbols-outlined">
              logout
              </span>Logout</a>
          </li>
        </ul>
        <div className='user-account'>
          <div className='user-profile'>
            <img src='/images/yami.png'
            alt='profile-img'></img>
            <div className='user-detail'>
              <h3>{stats.fname} {stats.lname}</h3>
              <span>Software Engineer</span>
            </div>
          </div>
        </div>
      </aside>
      <section className='settings-container'>
        <h1>Settings</h1> 
        <h2>Change Music</h2>
        <MediaControlCard
          isPlaying={isPlaying}
          currentTrack={songs[currentSongIndex]?.name}
          togglePlayPause={togglePlayPause}
          skipNext={skipNext}
          skipPrevious={skipPrevious}
        />
        {/*<audio ref={audioRef} src='audio\Luke Bergs & Waesto - Take Off (freetouse.com).mp3'/>*/}
        <FormDialog />
      </section>
    </div>
  );
};

export default Settings;