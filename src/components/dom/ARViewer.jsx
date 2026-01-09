import { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, Video, Square, Download, Loader2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ARViewer = ({ modelSrc, poster }) => {
  const viewerRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [arStatus, setArStatus] = useState('not-presenting'); // 'not-presenting', 'session-started', 'object-placed'
  const [isLongPress, setIsLongPress] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const longPressTimer = useRef(null);
  const timerIntervalRef = useRef(null);

  useEffect(() => {
    import('@google/model-viewer');
  }, []);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const handleARStatus = (event) => {
      console.log('AR Status:', event.detail.status);
      setArStatus(event.detail.status);
    };

    viewer.addEventListener('ar-status', handleARStatus);
    return () => {
      viewer.removeEventListener('ar-status', handleARStatus);
    };
  }, []);

  // Timer logic for recording
  useEffect(() => {
    if (isRecording) {
      setRecordingTime(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [isRecording]);

  const takeScreenshot = async () => {
    if (!viewerRef.current) return;
    try {
      const blob = await viewerRef.current.toBlob({ idealAspect: true });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `4seasons-snapshot-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Snapshot failed:', err);
    }
  };

  const startRecording = useCallback(() => {
    if (!viewerRef.current || isRecording) return;

    // Attempt to find canvas in shadowRoot or standard query
    const canvas = viewerRef.current.shadowRoot?.querySelector('canvas') || viewerRef.current.querySelector('canvas');
    if (!canvas) {
      console.error('Could not find canvas');
      return;
    }

    try {
      const stream = canvas.captureStream(30);
      const mimeType = MediaRecorder.isTypeSupported('video/webm; codecs=vp9')
        ? 'video/webm; codecs=vp9'
        : 'video/webm';

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `4seasons-recording-${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
      };

      recorder.start();
      setIsRecording(true);

      // Haptic feedback if available
      if (window.navigator?.vibrate) {
        window.navigator.vibrate(50);
      }
    } catch (err) {
      console.error('Recording failed to start:', err);
    }
  }, [isRecording]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (window.navigator?.vibrate) {
        window.navigator.vibrate([30, 30]);
      }
    }
  }, [isRecording]);

  const handlePointerDown = (e) => {
    // Prevent context menu or default behavior that might interrupt
    if (isRecording) return;

    longPressTimer.current = setTimeout(() => {
      setIsLongPress(true);
      startRecording();
    }, 500);
  };

  const handlePointerUp = (e) => {
    clearTimeout(longPressTimer.current);
    if (isLongPress) {
      stopRecording();
      setIsLongPress(false);
    } else if (!isRecording) {
      takeScreenshot();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Determine when to show UI
  const isInAR = arStatus === 'session-started' || arStatus === 'object-placed';
  const showCaptureUI = arStatus === 'session-started' || arStatus === 'object-placed';
  const showAREntry = arStatus === 'not-presenting';

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <model-viewer
        ref={viewerRef}
        src={modelSrc}
        poster={poster}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
        shadow-intensity="1"
        style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
        alt="A 3D model of the seasonal outfit"
      >
        <button
          slot="ar-button"
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '24px',
            backgroundColor: 'white',
            color: 'black',
            border: 'none',
            borderRadius: '24px',
            padding: '12px 20px',
            fontWeight: '600',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: 100,
            cursor: 'pointer'
          }}
        >
          <div style={{ width: 18, height: 18, border: '2px solid black', borderRadius: '4px' }} />
          View in your space
        </button>
        {/* AR Context Instructions */}
        <AnimatePresence>
          {arStatus === 'session-started' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                top: '20%',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                zIndex: 1000,
                pointerEvents: 'none',
                textAlign: 'center',
                width: 'max-content'
              }}
            >
              <Loader2 className="animate-spin" size={20} />
              <span>바닥을 인식하여 모델을 배치해주세요...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Shutter Button UI */}
        <AnimatePresence>
          {showCaptureUI && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{
                position: 'absolute',
                bottom: '40px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '15px'
              }}
            >
              {/* Shutter Button */}
              <div
                style={{
                  position: 'relative',
                  width: '80px',
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  WebkitTouchCallout: 'none'
                }}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerLeave={() => {
                  clearTimeout(longPressTimer.current);
                  if (isLongPress) {
                    stopRecording();
                    setIsLongPress(false);
                  }
                }}
              >
                {/* Outer Ring */}
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: '4px solid white',
                  boxShadow: '0 0 15px rgba(0,0,0,0.3)',
                  transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  transform: isLongPress ? 'scale(1.2)' : 'scale(1)'
                }} />

                {/* Inner Circle / Shutter */}
                <motion.div
                  animate={{
                    scale: isLongPress ? 0.8 : 1,
                    borderRadius: isLongPress ? '8px' : '50%',
                    backgroundColor: isLongPress ? '#ff3b30' : 'white'
                  }}
                  style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)'
                  }}
                />

                {/* Recording Progress Ring (visible when long press) */}
                {isRecording && (
                  <svg
                    style={{
                      position: 'absolute',
                      top: -5,
                      left: -5,
                      width: '90px',
                      height: '90px',
                      transform: 'rotate(-90deg)',
                      pointerEvents: 'none'
                    }}
                  >
                    <circle
                      cx="45"
                      cy="45"
                      r="41"
                      fill="none"
                      stroke="rgba(255, 59, 48, 0.5)"
                      strokeWidth="4"
                    />
                    <motion.circle
                      cx="45"
                      cy="45"
                      r="41"
                      fill="none"
                      stroke="#ff3b30"
                      strokeWidth="4"
                      strokeDasharray="257.6" // 2 * PI * 41
                      initial={{ strokeDashoffset: 257.6 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ duration: 30, ease: "linear" }} // Max 30s recording visualization
                    />
                  </svg>
                )}
              </div>

              {/* Instruction Text */}
              <div style={{
                color: 'white',
                fontSize: '11px',
                fontWeight: '600',
                textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                backgroundColor: 'rgba(0,0,0,0.3)',
                padding: '4px 12px',
                borderRadius: '10px',
                backdropFilter: 'blur(4px)',
                whiteSpace: 'nowrap'
              }}>
                {isRecording ? '촬영 중...' : '탭: 사진 / 길게 누름: 비디오'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recording Info Overlay */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                top: '40px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(255, 0, 0, 0.85)',
                color: 'white',
                padding: '6px 16px',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                zIndex: 1001,
                fontFamily: 'monospace',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(255, 0, 0, 0.3)'
              }}
            >
              <div style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: 'white',
                animation: 'pulse 1s infinite'
              }} />
              <span>REC {formatTime(recordingTime)}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </model-viewer>

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ARViewer;
