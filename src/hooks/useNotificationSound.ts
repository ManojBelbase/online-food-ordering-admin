import { useCallback, useRef } from 'react';

export const useNotificationSound = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create notification sound using Web Audio API
  const createNotificationSound = useCallback(() => {
    try {
      // Create audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Create oscillator for the notification sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Configure the sound (pleasant notification tone)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // Start frequency
      oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1); // Drop to lower frequency
      oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.2); // Back up

      // Configure volume envelope
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05); // Quick attack
      gainNode.gain.exponentialRampToValueAtTime(0.1, audioContext.currentTime + 0.2); // Sustain
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4); // Fade out

      // Set waveform type
      oscillator.type = 'sine';

      // Play the sound
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.4);

      return true;
    } catch (error) {
      console.warn('Could not create notification sound:', error);
      return false;
    }
  }, []);

  // Alternative method using data URL for better browser compatibility
  const playNotificationSound = useCallback(() => {
    try {
      // Try Web Audio API first
      if (createNotificationSound()) {
        return;
      }

      // Fallback to HTML Audio with data URL
      if (!audioRef.current) {
        // Create a simple notification sound using data URL
        const audioData = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';
        audioRef.current = new Audio(audioData);
        audioRef.current.volume = 0.5;
      }

      // Play the sound
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        console.warn('Could not play notification sound:', error);
      });
    } catch (error) {
      console.warn('Notification sound failed:', error);
    }
  }, [createNotificationSound]);

  return { playNotificationSound };
};