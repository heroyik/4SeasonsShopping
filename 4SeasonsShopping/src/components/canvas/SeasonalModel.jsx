"use client";

import { useGLTF, Float, Html } from '@react-three/drei';
import { Suspense } from 'react';
import { getAssetPath } from '@/config';

function Model({ url, scale = 1, ...props }) {
  const { scene } = useGLTF(url);
  
  return (
    <Float 
      speed={2} // Animation speed
      rotationIntensity={0.5} // XYZ rotation intensity
      floatIntensity={0.5} // Up/down float intensity
    >
      <primitive 
        object={scene} 
        scale={scale} 
        {...props} 
      />
    </Float>
  );
}

// Preload all seasonal models
useGLTF.preload(getAssetPath('spring.glb'));
useGLTF.preload(getAssetPath('summer.glb'));
useGLTF.preload(getAssetPath('autumn.glb'));
useGLTF.preload(getAssetPath('winter.glb'));

import Box from './Box';

export default function SeasonalModel({ season }) {
  // Map season name to file
  const modelFiles = {
    spring: getAssetPath('spring.glb'),
    summer: getAssetPath('summer.glb'),
    autumn: getAssetPath('autumn.glb'),
    winter: getAssetPath('winter.glb'),
  };

  const url = modelFiles[season.toLowerCase()] || getAssetPath('spring.glb');

  return (
    <Suspense fallback={<Box scale={0.5} />}>
      <Model url={url} scale={2.5} position={[0, -2, 0]} />
    </Suspense>
  );
}
