import React, { useState, useEffect } from 'react';
import { useUser } from '../userContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/index.css'
import MediaControlCard from '../mediaControlCard';
import { useAudio } from '../AudioContext';
import FormDialog from '../formDialog';
import Navbar from '../navbar';

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
      <Navbar stats={stats} />
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