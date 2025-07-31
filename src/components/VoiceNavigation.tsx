import React, { useState, useEffect, useRef } from 'react';
import { ActionIcon, Tooltip, Modal, Stack, Group, Badge } from '@mantine/core';
import { IconMicrophone, IconMicrophoneOff, IconVolume, IconHelp } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { useTheme } from '../contexts/ThemeContext';
import { CustomText, ActionButton } from './ui';
import { FRONTENDROUTES } from '../constants/frontendRoutes';
import {
  detectBrowser,
  getVoiceErrorMessage,
  getBrowserSupportMessage,
  getSpeechRecognitionConfig,
  getBrowserTips
} from '../utils/voiceNavigationHelpers';

interface NavigationCommand {
  keywords: string[];
  route: string;
  description: string;
}

const VoiceNavigation: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [userInitiated, setUserInitiated] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxRetries = 2;

  const navigationCommands: NavigationCommand[] = [
    {
      keywords: ['dashboard', 'home', 'main'],
      route: FRONTENDROUTES.HOME,
      description: 'Go to Dashboard'
    },
    {
      keywords: ['customer', 'customers', 'users'],
      route: FRONTENDROUTES.CUSTOMER,
      description: 'Go to Customers'
    },
    {
      keywords: ['orders', 'order'],
      route: FRONTENDROUTES.ORDERS,
      description: 'Go to Orders'
    },
    {
      keywords: ['new orders', 'new order', 'pending orders'],
      route: FRONTENDROUTES.NEW_ORDERS,
      description: 'Go to New Orders'
    },
    {
      keywords: ['completed orders', 'completed order', 'finished orders'],
      route: FRONTENDROUTES.COMPLETED_ORDERS,
      description: 'Go to Completed Orders'
    },
    {
      keywords: ['cancelled orders', 'cancelled order', 'canceled orders'],
      route: FRONTENDROUTES.CANCELLED_ORDERS,
      description: 'Go to Cancelled Orders'
    },
    {
      keywords: ['restaurant', 'restaurants'],
      route: FRONTENDROUTES.RESTAURANT,
      description: 'Go to Restaurant'
    },
    {
      keywords: ['category', 'categories'],
      route: FRONTENDROUTES.CATEGORY,
      description: 'Go to Categories'
    },
    {
      keywords: ['global category', 'global categories'],
      route: FRONTENDROUTES.GLOBAL_CATEGORY,
      description: 'Go to Global Categories'
    },
    {
      keywords: ['food item', 'food items', 'menu items', 'products'],
      route: FRONTENDROUTES.FOOD_ITEM,
      description: 'Go to Food Items'
    },
    {
      keywords: ['profile', 'account', 'settings'],
      route: FRONTENDROUTES.PROFILE,
      description: 'Go to Profile'
    },
    {
      keywords: ['menu'],
      route: FRONTENDROUTES.MENU,
      description: 'Go to Menu'
    }
  ];

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const browserInfo = detectBrowser();
    const config = getSpeechRecognitionConfig(browserInfo);

    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();

      recognition.continuous = config.continuous;
      recognition.interimResults = config.interimResults;
      recognition.lang = config.lang;
      recognition.maxAlternatives = config.maxAlternatives;

      if ('webkitSpeechRecognition' in window && (browserInfo.isChrome || browserInfo.isEdge || browserInfo.isBrave)) {
        (recognition as any).webkitSpeechRecognition = true;
      }

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
        setRetryCount(0);

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          if (isListening && !transcript) {
            recognition.stop();
          }
        }, config.timeoutDuration);

        if (userInitiated) {
          notifications.show({
            title: 'Voice Recognition Active',
            message: browserInfo.isBrave ? 'Listening in Brave... Speak clearly after the beep' : 'Listening... Say a command like "dashboard", "orders", "customers"',
            color: 'blue',
            autoClose: 3000,
          });
        }
      };

      recognition.onresult = (event) => {
        const lastResultIndex = event.results.length - 1;
        const lastResult = event.results[lastResultIndex];

        if (lastResult.isFinal) {
          const result = lastResult[0].transcript.toLowerCase().trim();
          setTranscript(result);

          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          recognition.stop();
          setUserInitiated(false);

          processVoiceCommand(result);
        } else {
          const interimResult = lastResult[0].transcript.toLowerCase().trim();
          setTranscript(interimResult);
        }
      };

      recognition.onerror = (event) => {
        setIsListening(false);

        const errorInfo = getVoiceErrorMessage(event.error, browserInfo);
        const errorMessage = errorInfo.message;
        const shouldRetry = errorInfo.shouldRetry;

        if (shouldRetry && retryCount < maxRetries && userInitiated) {
          setRetryCount(prev => prev + 1);
          notifications.show({
            title: 'Retrying Voice Recognition',
            message: `Attempt ${retryCount + 1}/${maxRetries}. ${errorMessage}`,
            color: 'orange',
            autoClose: 3000,
          });

          setTimeout(() => {
            if (recognitionRef.current && !isListening && userInitiated) {
              try {
                recognitionRef.current.start();
              } catch (retryError) {
                setUserInitiated(false); 
              }
            }
          }, 1500);
        } else {
          setRetryCount(0);
          setUserInitiated(false);
          if (userInitiated) {
            notifications.show({
              title: 'Voice Recognition Error',
              message: errorMessage,
              color: 'red',
              autoClose: 5000,
            });
          }
        }
      };

    
      recognition.onend = () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Delay setting isListening to false for Brave browser
        if (browserInfo.isBrave && userInitiated && !transcript && retryCount < maxRetries) {
          setTimeout(() => {
            setIsListening(false);
            if (transcript || retryCount >= maxRetries) {
              setUserInitiated(false);
              setRetryCount(0);
            }
          }, 500);
        } else {
          setIsListening(false);
          if (transcript || retryCount >= maxRetries) {
            setUserInitiated(false);
            setRetryCount(0);
          }
        }
      };

      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const processVoiceCommand = (command: string) => {
    const normalizedCommand = command.toLowerCase().trim();
    
    const matchedCommand = navigationCommands.find(navCommand =>
      navCommand.keywords.some(keyword => 
        normalizedCommand.includes(keyword.toLowerCase())
      )
    );

    if (matchedCommand) {
      navigate(matchedCommand.route);
      notifications.show({
        title: 'Navigation Success',
        message: `Navigating to ${matchedCommand.description.replace('Go to ', '')}`,
        color: 'green',
        icon: <IconVolume size={16} />,
      });
    } else {
      notifications.show({
        title: 'Command Not Recognized',
        message: `Could not understand "${command}". Try saying "dashboard", "orders", "customers", etc.`,
        color: 'orange',
      });
    }
  };

  const getBrowserSpecificMessage = () => {
    const browserInfo = detectBrowser();
    return getBrowserSupportMessage(browserInfo);
  };

  const startListening = () => {
    if (!isSupported) {
      notifications.show({
        title: 'Voice Recognition Not Supported',
        message: getBrowserSpecificMessage(),
        color: 'orange',
        autoClose: 8000,
      });
      return;
    }

    if (recognitionRef.current && !isListening) {
      try {
        setUserInitiated(true);
        setRetryCount(0);

        // Check for microphone permissions first (especially important for Brave)
        if (navigator.permissions) {
          navigator.permissions.query({ name: 'microphone' as PermissionName }).then((result) => {
            if (result.state === 'denied') {
              notifications.show({
                title: 'Microphone Permission Denied',
                message: 'Please allow microphone access in your browser settings to use voice navigation.',
                color: 'red',
                autoClose: 5000,
              });
              setUserInitiated(false);
              return;
            }
          }).catch(() => {
            // Permission API not supported, continue anyway
          });
        }

        recognitionRef.current.start();
      } catch (error) {
        setUserInitiated(false);
        const browserInfo = detectBrowser();
        notifications.show({
          title: 'Voice Recognition Error',
          message: browserInfo.isBrave
            ? 'Failed to start voice recognition in Brave. Please check your browser settings and ensure Google services are enabled.'
            : 'Failed to start voice recognition. Please try again.',
          color: 'red',
          autoClose: browserInfo.isBrave ? 8000 : 3000,
        });
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        setUserInitiated(false); 
        setRetryCount(0); 

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        recognitionRef.current.stop();
      } catch (error) {
        setIsListening(false);
        setUserInitiated(false);
      }
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isSupported) {
    return (
      <Tooltip
        label={getBrowserSpecificMessage()}
        position="bottom"
        multiline
        w={300}
      >
        <ActionIcon
          variant="subtle"
          size="lg"
          disabled
          style={{ color: theme.colors.textSecondary, opacity: 0.5 }}
        >
          <IconMicrophoneOff size={20} />
        </ActionIcon>
      </Tooltip>
    );
  }

  return (
    <>
      <Group gap="xs">
        <Tooltip
          label={isListening ? "Stop Voice Navigation" : "Start Voice Navigation"}
          position="bottom"
        >
          <ActionIcon
            variant={isListening ? "filled" : "subtle"}
            color={isListening ? "blue" : "gray"}
            size="lg"
            onClick={toggleListening}
            style={{
              backgroundColor: isListening ? theme.colors.primary : 'transparent',
              color: isListening ? 'white' : theme.colors.textSecondary,
              animation: isListening ? 'pulse 1.5s infinite' : 'none',
            }}
          >
            {isListening ? <IconMicrophone size={20} /> : <IconMicrophoneOff size={20} />}
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Voice Commands Help" position="bottom">
          <ActionIcon
            variant="subtle"
            size="sm"
            onClick={() => setShowModal(true)}
            style={{ color: theme.colors.textSecondary }}
          >
            <IconHelp size={16} />
          </ActionIcon>
        </Tooltip>
      </Group>

      {/* Help Modal */}
      <Modal
        opened={showModal}
        onClose={() => setShowModal(false)}
        title={
          <Group gap="xs">
            <IconVolume size={20} style={{ color: theme.colors.primary }} />
            <CustomText fontWeight={600} color="primary">Voice Navigation Commands</CustomText>
          </Group>
        }
        size="lg"
        centered
        styles={{
          content: {
            maxHeight: '85vh',
            overflow: 'hidden'
          },
          body: {
            padding: '20px',
            maxHeight: '70vh',
            overflow: 'auto'
          }
        }}
      >
        <Stack gap="md">
          <CustomText size="sm" color="secondary">
            Say any of these commands to navigate:
          </CustomText>

          <CustomText size="xs" color="warning" style={{
            backgroundColor: '#fff3cd',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ffeaa7'
          }}>
{getBrowserTips()}
          </CustomText>

          <Stack gap="xs">
            {navigationCommands.map((command, index) => (
              <Group key={index} justify="space-between" align="center">
                <div>
                  <CustomText size="sm" fontWeight={500} color="primary">
                    {command.description.replace('Go to ', '')}
                  </CustomText>
                  <Group gap="xs" mt={2}>
                    {command.keywords.slice(0, 2).map((keyword, i) => (
                      <Badge key={i} size="xs" variant="light">
                        "{keyword}"
                      </Badge>
                    ))}
                  </Group>
                </div>
              </Group>
            ))}
          </Stack>

          <Group justify="space-between" mt="md">
            <ActionButton
              variant="ghost"
              onClick={() => {
                setShowModal(false);
                navigator.mediaDevices?.getUserMedia({ audio: true })
                  .then(() => {
                    notifications.show({
                      title: 'Microphone Test',
                      message: 'Microphone access granted! Voice navigation should work.',
                      color: 'green',
                    });
                  })
                  .catch(() => {
                    notifications.show({
                      title: 'Microphone Test Failed',
                      message: 'Please allow microphone access in your browser settings.',
                      color: 'red',
                    });
                  });
              }}
            >
              Test Microphone
            </ActionButton>
            <ActionButton variant="outline" onClick={() => setShowModal(false)}>
              Close
            </ActionButton>
          </Group>
        </Stack>
      </Modal>

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </>
  );
};

export default VoiceNavigation;
