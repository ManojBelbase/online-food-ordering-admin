import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Stack, Text, Loader, Box, Badge } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { IconCamera, IconCheck, IconX, IconKey } from "@tabler/icons-react"
import * as faceapi from "face-api.js"
import { useTheme } from "../../contexts/ThemeContext"
import { useAuth } from "../../redux/useAuth"
import type { Auth } from "../../types/auth"

interface FaceLoginProps {
  onSwitchToCredentials: () => void
}

const FaceLogin: React.FC<FaceLoginProps> = ({ onSwitchToCredentials }) => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { login, isAuthenticated, isLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [faceModelsLoaded, setFaceModelsLoaded] = useState(false)
  const [instruction, setInstruction] = useState("Position your face in the camera")
  const [faceDetected, setFaceDetected] = useState(false)
  const [confidence, setConfidence] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/", { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate])

  useEffect(() => {
    const loadModels = async () => {
      try {
        // Check if models are already preloaded
        const { areFaceRecognitionModelsLoaded, loadFaceRecognitionModels } = await import('../../server-action/api/faceRecognition');
        
        if (areFaceRecognitionModelsLoaded()) {
          setFaceModelsLoaded(true);
          notifications.show({
            title: "Ready",
            message: "Face recognition ready",
            color: "green",
            icon: <IconCheck size={16} />,
          });
        } else {
          // Load models if not already preloaded
          await loadFaceRecognitionModels();
          setFaceModelsLoaded(true);
          notifications.show({
            title: "Ready",
            message: "Face recognition loaded",
            color: "green",
            icon: <IconCheck size={16} />,
          });
        }
      } catch (error) {
        notifications.show({
          title: "Error",
          message: "Failed to load face recognition",
          color: "red",
          icon: <IconX size={16} />,
        });
      }
    };
    
    loadModels();
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout
    const detectFaceRealTime = async () => {
      if (videoRef.current && faceModelsLoaded && !loading) {
        try {
          const detection = await faceapi.detectSingleFace(
            videoRef.current,
            new faceapi.SsdMobilenetv1Options({ minConfidence: 0.3 }),
          )
          if (detection) {
            setFaceDetected(true)
            setConfidence(detection.score * 100)
          } else {
            setFaceDetected(false)
            setConfidence(0)
          }
        } catch (error) {
          // Ignore detection errors
        }
      }
    }

    if (faceModelsLoaded) {
      intervalId = setInterval(detectFaceRealTime, 500)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [faceModelsLoaded, loading])

  const handleFaceLogin = async () => {
    if (!faceModelsLoaded) {
      notifications.show({
        title: "Error",
        message: "Face recognition still loading...",
        color: "red",
        icon: <IconX size={16} />,
      })
      return
    }

    setLoading(true)
    setInstruction("Starting camera...")
    let stream: MediaStream | null = null
    streamRef.current = null

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640, min: 320 },
          height: { ideal: 480, min: 240 },
          facingMode: "user",
          frameRate: { ideal: 30, min: 15 },
        },
      })
      streamRef.current = stream

      if (!videoRef.current) {
        await new Promise((resolve) => setTimeout(resolve, 200))
        if (!videoRef.current) {
          notifications.show({
            title: "Error",
            message: "Camera not ready. Please try again.",
            color: "red",
            icon: <IconX size={16} />,
          })
          return
        }
      }

      videoRef.current.srcObject = stream
      await new Promise<void>((resolve, reject) => {
        if (videoRef.current) {
          videoRef.current.onloadedmetadata = () => {
            videoRef.current!.play().then(resolve).catch(reject)
          }
          videoRef.current.onerror = reject
        }
      })

      await new Promise((resolve) => setTimeout(resolve, 1000))
      setInstruction("Look at the camera")

      setInstruction("Authenticating...")
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
        .withFaceLandmarks()
        .withFaceDescriptors()

      if (detections.length !== 1) {
        notifications.show({
          title: "Error",
          message: detections.length === 0 ? "No face detected" : "Multiple faces detected",
          color: "red",
          icon: <IconX size={16} />,
        })
        return
      }

      const faceDescriptor = Array.from(detections[0].descriptor)
      const result = await login({ faceDescriptor })

      if (result.meta.requestStatus === "fulfilled") {
        const payload = result.payload as { user: Auth.User; accessToken: string; success: boolean; message: string }
        if (payload.success) {
          notifications.show({
            title: "Welcome",
            message: `Hello, ${payload.user.name || "User"}!`,
            color: "green",
            icon: <IconCheck size={16} />,
          })
        } else {
          throw new Error(payload.message || "Face login failed")
        }
      } else {
        notifications.show({
          title: "Login Failed",
          message: "Face not recognized. Try again or use password.",
          color: "red",
          icon: <IconX size={16} />,
        })
      }
    } catch (error: any) {
      let message = "Face login failed"
      if (error.name === "NotAllowedError") {
        message = "Camera access denied"
      } else if (error.name === "NotFoundError") {
        message = "No camera found"
      } else if (error.message) {
        message = error.message
      }

      notifications.show({
        title: "Error",
        message,
        color: "red",
        icon: <IconX size={16} />,
      })
    } finally {
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach(track => track.stop());
        streamRef.current = null;
      } else if (videoRef.current && videoRef.current.srcObject) {
        const videoStream = videoRef.current.srcObject as MediaStream;
        const tracks = videoStream.getTracks();
        tracks.forEach(track => track.stop());
      }
      setLoading(false);
    }
  }

  const getStatusColor = () => {
    if (!faceDetected) return theme.colors.textSecondary
    if (confidence > 70) return "#10b981"
    if (confidence > 40) return "#f59e0b"
    return "#ef4444"
  }

  const getStatusText = () => {
    if (!faceDetected) return "No face detected"
    if (confidence > 70) return "Ready"
    if (confidence > 40) return "Adjusting"
    return "Move closer"
  }

  return (
    <Stack gap={8}>
      <Text size="sm" c={theme.colors.textSecondary} ta="center">
        {instruction}
      </Text>

      <Box pos="relative">
        <Box
          style={{
            borderRadius: "8px",
            overflow: "hidden",
            backgroundColor: theme.colors.inputBackground,
            border: `1px solid ${theme.colors.inputBorder}`,
            height: "240px",
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          <Box
            pos="absolute"
            top="50%"
            left="50%"
            style={{
              transform: "translate(-50%, -50%)",
              width: "120px",
              height: "120px",
              border: `2px solid ${getStatusColor()}`,
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />

          {!faceModelsLoaded && (
            <Box
              pos="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              style={{
                backgroundColor: theme.colors.inputBackground,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <Loader size="md" color={theme.colors.primary} />
              <Text size="xs" c={theme.colors.textSecondary}>
                Loading...
              </Text>
            </Box>
          )}
        </Box>

        {faceModelsLoaded && (
          <Box pos="absolute" top={8} right={8}>
            <Badge
              size="sm"
              style={{
                backgroundColor: getStatusColor() + "20",
                color: getStatusColor(),
              }}
            >
              {getStatusText()}
            </Badge>
          </Box>
        )}
      </Box>

      <Stack gap={3}>
        <Button
          onClick={handleFaceLogin}
          disabled={loading || !faceModelsLoaded}
          leftSection={<IconCamera size={18} />}
          loading={loading}
          size="md"
          fullWidth
          styles={{
            root: {
              backgroundColor: theme.colors.primary,
              border: "none",
              borderRadius: "8px",
              height: "40px",
              fontSize: "14px",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: theme.colors.primaryHover,
              },
            },
          }}
        >
          {loading ? "Processing..." : !faceModelsLoaded ? "Loading..." : "Start Recognition"}
        </Button>

        <Button
          variant="subtle"
          onClick={onSwitchToCredentials}
          size="sm"
          fullWidth
          leftSection={<IconKey size={16} />}
          style={{
            color: theme.colors.textSecondary,
            fontWeight: 400,
          }}
        >
          Use password instead
        </Button>
        
      </Stack>
    </Stack>
  )
}

export default FaceLogin
