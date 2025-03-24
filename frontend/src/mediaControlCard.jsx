import React from 'react';
import { Button } from '@mui/material';

const MediaControlCard = ({ isPlaying, currentTrack, togglePlayPause, skipNext, skipPrevious }) => {
  return (
    <div>
      <h3>{currentTrack}</h3>
      <Button onClick={skipPrevious}>Prev</Button>
			<Button onClick={togglePlayPause}>{isPlaying ? 'Pause' : 'Play'}</Button>
      <Button onClick={skipNext}>Next</Button>
    </div>
  );
};

export default MediaControlCard;