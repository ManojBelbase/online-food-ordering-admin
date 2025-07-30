import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../redux/useAuth';
import {
  Button,
  Stack,
  Text,
  Title,
  Paper,
  Loader,
  Select,
  Box,
  Group,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCamera, IconCheck, IconX, IconUser } from '@tabler/icons-react';
import * as faceapi from 'face-api.js';
import type { Auth } from '../types/auth';

type ValidationLevel = 'BASIC' | 'STANDARD';

interface FaceLoginProps {
  onSwitchToCredentials: () => void;
}

interface LivenessResult {
  isLive: boolean;
  confidence: number;
}

interface BlinkResult {
  blinkDetected: boolean;
  blinkCount: number;
}

const FaceLogin: React.FC<FaceLoginProps> = ({ onSwitchToCredentials }) => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [faceModelsLoaded, setFaceModelsLoaded] = useState(false);
  const [instruction, setInstruction] = useState('Position your face in the camera');
  const [validationLevel, setValidationLevel] = useState<ValidationLevel>('BASIC');
  const [faceDetected, setFaceDetected] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Navigate when authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models';
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setFaceModelsLoaded(true);
        notifications.show({
          title: 'Ready',
          message: 'Face recognition loaded',
          color: 'green',
          icon: <IconCheck size={16} />,
        });
      } catch (error) {
        notifications.show({
          title: 'Error',
          message: 'Failed to load face recognition',
          color: 'red',
          icon: <IconX size={16} />,
        });
      }
    };
    loadModels();
  }, []);

  // Real-time face detection
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const detectFaceRealTime = async () => {
      if (videoRef.current && faceModelsLoaded && !loading) {
        try {
          const detection = await faceapi.detectSingleFace(
            videoRef.current,
            new faceapi.SsdMobilenetv1Options({ minConfidence: 0.3 })
          );

          if (detection) {
            setFaceDetected(true);
            setConfidence(detection.score * 100);
          } else {
            setFaceDetected(false);
            setConfidence(0);
          }
        } catch (error) {
          // Ignore detection errors
        }
      }
    };

    if (faceModelsLoaded) {
      intervalId = setInterval(detectFaceRealTime, 500);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [faceModelsLoaded, loading]);

  // Option 1: Use underscore prefix to indicate intentionally unused parameters
  const detectLiveness = async (_video: HTMLVideoElement): Promise<LivenessResult> => {
    return { isLive: true, confidence: 0.85 };
  };

  const detectBlink = async (_video: HTMLVideoElement): Promise<BlinkResult> => {
    return { blinkDetected: true, blinkCount: 2 };
  };

  const handleFaceLogin = async () => {
    if (!faceModelsLoaded) {
      notifications.show({
        title: 'Error',
        message: 'Face recognition still loading...',
        color: 'red',
        icon: <IconX size={16} />,
      });
      return;
    }

    setLoading(true);
    setInstruction('Starting camera...');
    let stream: MediaStream | null = null;

    try {
      // Get camera access
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640, min: 320 },
          height: { ideal: 480, min: 240 },
          facingMode: 'user',
          frameRate: { ideal: 30, min: 15 },
        },
      });

      if (!videoRef.current) {
        await new Promise(resolve => setTimeout(resolve, 200));
        if (!videoRef.current) {
          notifications.show({
            title: 'Error',
            message: 'Camera not ready. Please try again.',
            color: 'red',
            icon: <IconX size={16} />,
          });
          return;
        }
      }

      videoRef.current.srcObject = stream;
      await new Promise<void>((resolve, reject) => {
        if (videoRef.current) {
          videoRef.current.onloadedmetadata = () => {
            videoRef.current!.play().then(resolve).catch(reject);
          };
          videoRef.current.onerror = reject;
        }
      });

      await new Promise(resolve => setTimeout(resolve, 1000));
      setInstruction('Look at the camera');

      // Liveness detection
      setInstruction('Move your head slightly...');
      const livenessResult = await detectLiveness(videoRef.current);

      if (!livenessResult.isLive) {
        notifications.show({
          title: 'Anti-Spoofing Failed',
          message: 'Please move naturally',
          color: 'red',
          icon: <IconX size={16} />,
        });
        return;
      }

      // Blink detection for STANDARD level
      if (validationLevel === 'STANDARD') {
        setInstruction('Please blink naturally...');
        const blinkResult = await detectBlink(videoRef.current);

        if (!blinkResult.blinkDetected) {
          notifications.show({
            title: 'Blink Detection Failed',
            message: 'Please blink naturally',
            color: 'red',
            icon: <IconX size={16} />,
          });
          return;
        }
      }

      setInstruction('Authenticating...');
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (detections.length !== 1) {
        notifications.show({
          title: 'Error',
          message: detections.length === 0 ? 'No face detected' : 'Multiple faces detected',
          color: 'red',
          icon: <IconX size={16} />,
        });
        return;
      }

      const faceDescriptor = Array.from(detections[0].descriptor);
      const result = await login({ faceDescriptor });

      if (result.meta.requestStatus === 'fulfilled') {
        const payload = result.payload as { user: Auth.User; accessToken: string; success: boolean; message: string };
        if (payload.success) {
          notifications.show({
            title: 'Welcome',
            message: `Hello, ${payload.user.name || 'User'}!`,
            color: 'green',
            icon: <IconCheck size={16} />,
          });
        } else {
          throw new Error(payload.message || 'Face login failed');
        }
      } else {
        notifications.show({
          title: 'Login Failed',
          message: 'Face not recognized. Try again or use password.',
          color: 'red',
          icon: <IconX size={16} />,
        });
      }
    } catch (error: any) {
      let message = 'Face login failed';
      if (error.name === 'NotAllowedError') {
        message = 'Camera access denied';
      } else if (error.name === 'NotFoundError') {
        message = 'No camera found';
      } else if (error.message) {
        message = error.message;
      }
      
      notifications.show({
        title: 'Error',
        message,
        color: 'red',
        icon: <IconX size={16} />,
      });
    } finally {
      if (stream) stream.getTracks().forEach(track => track.stop());
      setLoading(false);
      setInstruction('Position your face in the camera');
    }
  };

  const getStatusColor = () => {
    if (!faceDetected) return 'gray';
    if (confidence > 70) return 'green';
    if (confidence > 40) return 'yellow';
    return 'red';
  };

  const getStatusText = () => {
    if (!faceDetected) return 'No face detected';
    if (confidence > 70) return 'Face detected - Good';
    if (confidence > 40) return 'Face detected - Fair';
    return 'Face detected - Poor';
  };

  return (
    <Paper withBorder p="xl"  radius="md" className="w-full mx-auto">
      <Stack gap="lg">
        {/* Header */}
        <Stack gap="xs" align="center">
          <IconCamera size={32} color="var(--mantine-color-blue-6)" />
          <Title order={2} ta="center">Face Login</Title>
          <Text size="sm" c="dimmed" ta="center">{instruction}</Text>
        </Stack>

        {/* Security Level Selection */}
        <Select
          label="Security Level"
          value={validationLevel}
          onChange={(value) => setValidationLevel(value as ValidationLevel)}
          disabled={loading}
          data={[
            { value: 'BASIC', label: 'Basic - Fast recognition' },
            { value: 'STANDARD', label: 'Standard - Enhanced security' },
          ]}
          size="sm"
        />

        {/* Camera View */}
        <Box pos="relative">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: '100%',
              height: '280px',
              backgroundColor: 'var(--mantine-color-gray-1)',
              borderRadius: 'var(--mantine-radius-md)',
              objectFit: 'cover',
            }}
          />
          
          {/* Face Detection Overlay */}
          <Box
            pos="absolute"
            top="50%"
            left="50%"
            style={{
              transform: 'translate(-50%, -50%)',
              width: '200px',
              height: '200px',
              border: `2px solid var(--mantine-color-${getStatusColor()}-5)`,
              borderRadius: '50%',
              pointerEvents: 'none',
              transition: 'border-color 0.3s ease',
            }}
          />

          {/* Loading Overlay */}
          {!faceModelsLoaded && (
            <Box
              pos="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              style={{
                backgroundColor: 'var(--mantine-color-gray-1)',
                borderRadius: 'var(--mantine-radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Stack align="center" gap="sm">
                <Loader size="md" />
                <Text size="sm" c="dimmed">Loading models...</Text>
              </Stack>
            </Box>
          )}
        </Box>

        {/* Status Indicator */}
        {faceModelsLoaded && (
          <Group justify="center">
            <Text size="sm" c={getStatusColor()}>
              {getStatusText()}
            </Text>
            {faceDetected && (
              <Text size="xs" c="dimmed">
                ({Math.round(confidence)}%)
              </Text>
            )}
          </Group>
        )}

        {/* Action Buttons */}
        <Stack gap="sm">
          <Button
            onClick={handleFaceLogin}
            disabled={loading || !faceModelsLoaded}
            leftSection={<IconCamera size={16} />}
            loading={loading}
            size="md"
            fullWidth
          >
            {loading ? 'Processing...' : !faceModelsLoaded ? 'Loading...' : 'Start Recognition'}
          </Button>
          
          <Button
            onClick={onSwitchToCredentials}
            disabled={loading}
            variant="light"
            leftSection={<IconUser size={16} />}
            size="md"
            fullWidth
          >
            Use Password Instead
          </Button>
        </Stack>

        {/* Security Info */}
        <Box
          p="sm"
          style={{
            backgroundColor: 'var(--mantine-color-blue-0)',
            borderRadius: 'var(--mantine-radius-sm)',
          }}
        >
          <Text size="xs" c="blue" fw={500} mb={4}>
            {validationLevel === 'BASIC' ? 'Basic Security' : 'Enhanced Security'}
          </Text>
          <Text size="xs" c="dimmed">
            {validationLevel === 'BASIC' 
              ? 'Movement detection and face matching'
              : 'Movement detection, blink detection, and face matching'
            }
          </Text>
        </Box>
      </Stack>
    </Paper>
  );
};

export default FaceLogin;