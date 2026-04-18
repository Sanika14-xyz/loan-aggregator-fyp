import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const SessionTimeout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Only run the timeout timer if a user is actively logged in
    if (!user) return;

    let timeoutId;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      // Set timeout for 15 minutes (15 mins * 60 seconds * 1000 milliseconds)
      timeoutId = setTimeout(() => {
        logout(); // Clear JWT token and user data
        alert("🔒 For your security, your session has expired due to 15 minutes of inactivity. Please log in again.");
        navigate('/login');
      }, 900000); 
    };

    // Listen for any kind of user activity to reset the timer
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => document.addEventListener(event, resetTimer));

    resetTimer(); // Start the timer immediately on mount

    // Cleanup event listeners when component unmounts
    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => document.removeEventListener(event, resetTimer));
    };
  }, [user, logout, navigate]);

  // This component is completely invisible! It just runs security logic in the background.
  return null; 
};

export default SessionTimeout;