import React from 'react';
import { IconButton } from '@mui/material';

const MediaControlCard = ({ isPlaying, currentTrack, togglePlayPause, skipNext, skipPrevious }) => {
  return (
    <div>
      <h3>{currentTrack}</h3>
      <IconButton onClick={skipPrevious}>Prev</IconButton>
			<IconButton onClick={togglePlayPause}>{isPlaying ? 'Pause' : 'Play'}</IconButton>
      <IconButton onClick={skipNext}>Next</IconButton>
    </div>
  );
};

export default MediaControlCard;