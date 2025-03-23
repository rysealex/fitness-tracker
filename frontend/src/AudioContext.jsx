import React, { createContext, useState, useEffect, useContext, useRef } from 'react';

// Create AudioContext
const AudioContext = createContext();

// Custom hook to access audio context
export const useAudio = () => {
  return useContext(AudioContext);
};

// AudioProvider component to manage the audio globally
export const AudioProvider = ({ children }) => {
  const songs = [
    { name: "Track 1", url: '/audio/Luke%20Bergs%20%26%20Waesto%20-%20Take%20Off%20(freetouse.com).mp3' },
    { name: "Track 2", url: '/audio/Epic%20Spectrum%20-%20Wayfarer%20(freetouse.com).mp3' },
    { name: "Track 3", url: '/audio/Lukrembo%20-%20Marshmallow%20(freetouse.com).mp3' }
  ];

  const audioRef = useRef(new Audio(songs[0].url)); // Initially set to the first song
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0); // Index to track current song

  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;

    // Ensure the audio starts playing if it's not already playing
    if (isPlaying) {
      audio.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
    }

    // Cleanup: stop audio when the app is closed or navigated away
    return () => {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    };
  }, [isPlaying]);

  // Function to start playing the current audio
  const startAudio = () => {
  const audio = audioRef.current;
  audio.oncanplaythrough = () => { // Ensure the audio is fully loaded
    audio.play().catch((error) => {
      console.error('Error playing audio:', error);
    });
  };
  if (audio.readyState === 4) { // Check if it's already ready to play
    audio.play().catch((error) => {
      console.error('Error playing audio:', error);
    });
  }
};

  // Function to stop (pause) the audio
  const stopAudio = () => {
    const audio = audioRef.current;
    audio.pause();
    setIsPlaying(false);
  };

  // Function to toggle play/pause
  const togglePlayPause = () => {
    const audio = audioRef.current;
  
    if (isPlaying) {
      audio.pause();
      setTimeout(() => {
        setIsPlaying(false); // Update state after the pause is effective
      }, 100); // Slight delay to allow pause to complete
    } else {
      audio.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
      setTimeout(() => {
        setIsPlaying(true); // Update state after the play is effective
      }, 100); // Slight delay to allow play to complete
    }
  };

  // Function to skip to the next song
  const skipNext = () => {
    let nextIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIndex);
    
    const audio = audioRef.current;
    audio.pause(); // Pause before changing source
    audio.src = songs[nextIndex].url; // Change the audio source to the next song
    
    // Play the new song if it's already playing
    audio.play().catch((error) => {
      console.error('Error playing audio after skipping:', error);
    });
  };
  
  const skipPrevious = () => {
    let prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    setCurrentSongIndex(prevIndex);
  
    const audio = audioRef.current;
    audio.pause(); // Pause before changing source
    audio.src = songs[prevIndex].url; // Change the audio source to the previous song
  
    // Play the new song if it's already playing
    audio.play().catch((error) => {
      console.error('Error playing audio after skipping:', error);
    });
  };

  return (
    <AudioContext.Provider value={{
      audioRef, 
      isPlaying, 
      setIsPlaying, 
      startAudio, 
      stopAudio, 
      togglePlayPause,
      skipNext, 
      skipPrevious, 
      currentSongIndex, 
      songs
    }}>
      {children}
    </AudioContext.Provider>
  );
};
