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
useGLTF.preload(getAssetPath('spring_nick_high_quality.glb'));
useGLTF.preload(getAssetPath('summer_nick_high_quality.glb'));
useGLTF.preload(getAssetPath('autumn_nick_high_quality.glb'));
useGLTF.preload(getAssetPath('winter_nick_high_quality.glb'));

import Box from './Box';

export default function SeasonalModel({ season }) {
  // Map season name to file
  const modelFiles = {
    spring: getAssetPath('spring_nick_high_quality.glb'),
    summer: getAssetPath('summer_nick_high_quality.glb'),
    autumn: getAssetPath('autumn_nick_high_quality.glb'),
    winter: getAssetPath('winter_nick_high_quality.glb'),
  };

  const url = modelFiles[season.toLowerCase()] || getAssetPath('spring.glb');

  return (
    <Suspense fallback={<Box scale={0.5} />}>
      <Model url={url} scale={2.5} position={[0, -2, 0]} />
    </Suspense>
  );
}
