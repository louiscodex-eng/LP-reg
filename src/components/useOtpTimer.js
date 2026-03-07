import { useEffect, useState, useCallback } from "react";

const useOtpTimer = (initialSeconds = 600) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    // If it reaches 0, stop the timer
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Clean up the interval on unmount or when secondsLeft changes
    return () => clearInterval(timer);
  }, [secondsLeft]);

  // Use useCallback so the function reference stays stable
  const startTimer = useCallback(() => {
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return {
    minutes,
    seconds,
    expired: secondsLeft === 0,
    startTimer // Renamed 'reset' to 'startTimer' to match your component
  };
};

export default useOtpTimer;