import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const Timer = ({ initialMinutes, onTimeUp }) => {
  const [seconds, setSeconds] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval = null;
    
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      if (onTimeUp) onTimeUp();
    }
    
    return () => clearInterval(interval);
  }, [isActive, seconds, onTimeUp]);

  // Format time as MM:SS
  const formatTime = () => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Determine color based on remaining time
  const getTimerColor = () => {
    if (seconds < 60) return 'text-red-600'; // Less than 1 minute
    if (seconds < 300) return 'text-yellow-600'; // Less than 5 minutes
    return 'text-green-600';
  };

  return (
    <div className={`flex items-center ${getTimerColor()} font-bold text-lg`}>
      <Clock className="mr-2" />
      <span>{formatTime()}</span>
    </div>
  );
};

export default Timer;