import React from 'react';
import {Composition} from 'remotion';
import {Scene} from './Scene';

export const Root: React.FC = () => (
  <Composition
    id="Scene"
    component={Scene}
    durationInFrames={2434}
    fps={30}
    width={720}
    height={1280}
  />
);
