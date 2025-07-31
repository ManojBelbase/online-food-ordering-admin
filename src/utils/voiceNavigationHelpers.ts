/**
 * Voice Navigation Helper Functions
 * 
 * This file contains utility functions and configurations for voice navigation
 * to keep the main VoiceNavigation component clean and focused.
 */

export interface BrowserInfo {
  isBrave: boolean;
  isChrome: boolean;
  isEdge: boolean;
  isSafari: boolean;
  isFirefox: boolean;
}

/**
 * Detects the current browser type for voice navigation compatibility
 */
export const detectBrowser = (): BrowserInfo => {
  const isBrave = (navigator as any).brave && (navigator as any).brave.isBrave;
  const isChrome = /Chrome/.test(navigator.userAgent) && !isBrave;
  const isEdge = /Edg/.test(navigator.userAgent);
  const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  const isFirefox = /Firefox/.test(navigator.userAgent);

  return { isBrave, isChrome, isEdge, isSafari, isFirefox };
};

/**
 * Gets browser-specific error messages for voice recognition errors
 */
export const getVoiceErrorMessage = (error: string, browserInfo: BrowserInfo): { message: string; shouldRetry: boolean } => {
  const { isBrave } = browserInfo;

  switch (error) {
    case 'not-allowed':
      return {
        message: isBrave 
          ? 'Microphone access denied. In Brave browser: Go to Settings → Privacy & Security → Site Settings → Microphone, and allow this site to use your microphone.'
          : 'Microphone access denied. Please allow microphone permissions and try again.',
        shouldRetry: false
      };

    case 'no-speech':
      return {
        message: 'No speech detected. Please try speaking clearly and try again.',
        shouldRetry: true
      };

    case 'audio-capture':
      return {
        message: isBrave 
          ? 'No microphone found. Brave browser may block microphone access. Please check your microphone connection and Brave settings.'
          : 'No microphone found. Please check your microphone connection.',
        shouldRetry: false
      };

    case 'network':
      return {
        message: isBrave 
          ? 'Speech recognition service blocked. Brave browser blocks Google services by default. Try enabling "Use Google services for messaging" in Brave settings.'
          : 'Speech recognition service temporarily unavailable. This is a common browser limitation - please try again.',
        shouldRetry: !isBrave
      };

    case 'aborted':
      return {
        message: 'Voice recognition was cancelled.',
        shouldRetry: false
      };

    case 'bad-grammar':
      return {
        message: 'Speech recognition grammar error.',
        shouldRetry: false
      };

    case 'service-not-allowed':
      return {
        message: isBrave 
          ? 'Speech recognition service not allowed. Brave browser blocks this by default. Please enable Google services in Brave settings.'
          : 'Speech recognition service not allowed.',
        shouldRetry: false
      };

    default:
      return {
        message: isBrave 
          ? `Voice recognition error in Brave browser: ${error}. Try enabling Google services or use Chrome/Edge for better compatibility.`
          : `Voice recognition error: ${error}. Please try again.`,
        shouldRetry: !isBrave
      };
  }
};

/**
 * Gets browser-specific support messages
 */
export const getBrowserSupportMessage = (browserInfo: BrowserInfo): string => {
  const { isBrave, isFirefox } = browserInfo;
  
  if (isBrave) {
    return 'Voice recognition is supported in Brave but may require enabling Google services. Go to Settings → Privacy & Security → Use Google services for messaging.';
  } else if (isFirefox) {
    return 'Voice recognition is not supported in Firefox. Please use Chrome, Edge, Safari, or Brave browser.';
  } else {
    return 'Your browser does not support voice recognition. Please use Chrome, Edge, Safari, or Brave browser.';
  }
};

/**
 * Gets browser-specific configuration for speech recognition
 */
export const getSpeechRecognitionConfig = (browserInfo: BrowserInfo) => {
  const { isBrave } = browserInfo;
  
  return {
    continuous: !isBrave, // Brave works better with non-continuous mode
    interimResults: !isBrave, // Disable interim results for Brave
    timeoutDuration: isBrave ? 15000 : 10000, // Longer timeout for Brave
    lang: 'en-US',
    maxAlternatives: 1
  };
};

/**
 * Browser compatibility tips for the help modal
 */
export const getBrowserTips = (): string => {
  return `💡 Browser Tips:
• Brave: Enable "Use Google services for messaging" in Settings → Privacy & Security
• Chrome/Edge: Best compatibility, works out of the box
• Firefox: Not supported, use other browsers
• If you get "network error", try speaking immediately after clicking the microphone`;
};
