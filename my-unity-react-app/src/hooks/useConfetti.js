import { useCallback } from 'react';
import confetti from 'canvas-confetti';

export default function useConfetti() {
  // Full-screen rain effect for 3 seconds
  const fireRain = useCallback(() => {
    const duration = 2000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      if (Date.now() > animationEnd) {
        clearInterval(interval);
        return;
      }

      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 999,
        particleCount: 20,
        scalar: 1.5,
        origin: {
          x: Math.random(),
          y: Math.random() * 0.9, // spread across screen height
        },
      });
    }, 150);
  }, []);

  // Confetti burst at center
  const fireBurst = useCallback(() => {
    confetti({
      startVelocity: 50,
      spread: 360,
      ticks: 100,
      zIndex: 999,
      particleCount: 300,
      scalar: 2,
      origin: {
        x: 0.5,
        y: 0.5,
      },
    });
  }, []);

  return {
    fireRain,
    fireBurst
  };
}
