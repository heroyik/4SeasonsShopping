"use client";

import { useEffect, useRef } from 'react';

const ARViewer = ({ modelSrc, poster }) => {
  const viewerRef = useRef(null);

  useEffect(() => {
    // Dynamically import model-viewer to avoid SSR issues
    import('@google/model-viewer');
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <model-viewer
        ref={viewerRef}
        src={modelSrc}
        poster={poster} // Optional placeholder
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
        shadow-intensity="1"
        style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
        alt="A 3D model of the seasonal outfit"
      >
        <button slot="ar-button" style={{
          position: 'absolute',
          bottom: '20px',
          right: '50%',
          transform: 'translateX(50%)',
          backgroundColor: '#000',
          color: 'white',
          border: 'none',
          borderRadius: '24px',
          padding: '12px 24px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          zIndex: 100
        }}>
          📷 View in your space (WebAR)
        </button>
      </model-viewer>
    </div>
  );
};

export default ARViewer;
