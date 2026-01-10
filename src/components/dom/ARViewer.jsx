import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ARViewer = ({ modelSrc, iosSrc, poster }) => {
  const viewerRef = useRef(null);
  const [arStatus, setArStatus] = useState('not-presenting'); // 'not-presenting', 'session-started', 'object-placed'

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

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <model-viewer
        ref={viewerRef}
        src={modelSrc}
        ios-src={iosSrc}
        poster={poster}
        ar
        ar-modes="scene-viewer quick-look webxr"
        ar-scale="fixed"
        disable-zoom
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

        {/* AR Context Instructions (Only for WebXR fallback) */}
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
      </model-viewer>

      <style jsx>{`
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
