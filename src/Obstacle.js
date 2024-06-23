// src/components/Obstacle.js
import React from 'react';
import './Obstacle.css';

const Obstacle = ({ position, top }) => {
  return (
    <div className="obstacle" style={{ left: `${position}px`, top: `${top}px` }}>
      🚧
    </div>
  );
};

export default Obstacle;
