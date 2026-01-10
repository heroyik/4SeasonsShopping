"use client";

import { useGLTF, Float, Center } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { getAssetPath } from '@/config';

function Model({ url, scale = 1, ...props }) {
  const { scene } = useGLTF(url);
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5; // Rotate in place
    }
  });

  return (
    <Float
      speed={1.5} // Slightly slower
      rotationIntensity={0.2}
      floatIntensity={0.5}
    >
      <group ref={groupRef} {...props}>
        <Center top>
          <primitive
            object={scene}
            scale={scale}
          />
        </Center>
      </group>
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

  const url = modelFiles[season.id.toLowerCase()] || getAssetPath('spring.glb');

  return (
    <Suspense fallback={<Box scale={0.5} />}>
      <Model
        key={url}
        url={url}
        scale={season.modelScale || 2.5}
        position={season.modelPosition || [0, -2.5, 0]}
      />
    </Suspense>
  );
}
