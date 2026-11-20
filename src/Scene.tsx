import React from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useCurrentFrame, useVideoConfig} from 'remotion';

export const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  return (
    <ThreeCanvas
      width={width}
      height={height}
      style={{backgroundColor: '#0b1020'}}
      camera={{position: [0, 0, 5], fov: 50}}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={80} />
      <mesh rotation={[frame * 0.02, frame * 0.03, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#2f6bff" />
      </mesh>
    </ThreeCanvas>
  );
};
