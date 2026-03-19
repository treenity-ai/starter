import { type NodeData } from '@treenity/core';
import { registerPrefab } from '@treenity/core/mod';

registerPrefab('profile', 'seed', [
  { $path: 'profile', $type: 'profile', label: 'My Profile' },
] as NodeData[]);
