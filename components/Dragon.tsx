'use client';

import React, { useMemo, useRef, useLayoutEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const generateVoxels = () => {
  const voxels: Record<string, number[][]> = {
    beige: [], blue: [], darkBlue: [], teal: [], red: [], white: [], yellow: [], black: []
  };

  function fillSym(color: string, xEnd: number, yStart: number, yEnd: number, zStart: number, zEnd: number) {
    for (let x = 0; x <= xEnd; x++) {
      for (let y = yStart; y <= yEnd; y++) {
        for (let z = zStart; z <= zEnd; z++) {
          voxels[color].push([x, y, z]);
          if (x !== 0) voxels[color].push([-x, y, z]);
        }
      }
    }
  }

  function fillOffsetSym(color: string, x1: number, x2: number, y1: number, y2: number, z1: number, z2: number) {
    for (let x = x1; x <= x2; x++) {
      for (let y = y1; y <= y2; y++) {
        for (let z = z1; z <= z2; z++) {
          voxels[color].push([x, y, z]);
          if (x !== 0) voxels[color].push([-x, y, z]);
        }
      }
    }
  }

  // Body
  fillSym('blue', 3, 5, 12, -6, 4);
  fillSym('blue', 4, 6, 14, 0, 5);
  fillSym('blue', 3, 5, 12, -4, -1);
  fillSym('blue', 4, 5, 13, -9, -5);
  fillSym('blue', 5, 7, 13, 1, 4); // Chest width

  // Underbelly
  fillSym('teal', 2, 4, 5, 0, 5);
  fillSym('teal', 2, 3, 4, -4, -1);
  fillSym('teal', 2, 4, 4, -9, -5);

  // Neck
  fillSym('blue', 2, 12, 16, 4, 7);
  fillSym('blue', 2, 15, 18, 6, 9);
  fillSym('blue', 3, 13, 15, 5, 8); // Neck width
  fillSym('teal', 1, 11, 15, 5, 8);
  fillSym('teal', 1, 14, 17, 7, 10);

  // Head Base
  fillSym('beige', 3, 19, 23, 7, 12);
  fillSym('beige', 2, 19, 21, 13, 17);
  fillSym('beige', 2, 18, 20, 18, 19);
  fillOffsetSym('beige', 4, 5, 17, 19, 11, 14); // Cheek
  fillOffsetSym('beige', 4, 5, 21, 22, 9, 11); // Eye ridge

  // Horns
  fillOffsetSym('beige', 2, 3, 23, 24, 5, 8);
  fillOffsetSym('beige', 3, 4, 24, 25, 2, 5);
  fillOffsetSym('beige', 4, 5, 25, 26, -1, 2);
  fillOffsetSym('beige', 5, 5, 26, 27, -3, -2);

  // Side spikes
  fillOffsetSym('beige', 4, 5, 19, 20, 8, 10);

  // Eye
  fillOffsetSym('yellow', 3, 3, 20, 21, 10, 11);
  fillOffsetSym('black', 3, 3, 20, 20, 11, 11);

  // Lower Jaw
  fillSym('blue', 2, 15, 16, 10, 15);
  fillSym('blue', 2, 16, 17, 16, 17);
  fillSym('blue', 3, 15, 16, 11, 14); // Jaw width
  fillSym('teal', 1, 14, 14, 10, 15);
  fillSym('beige', 1, 13, 14, 14, 16);

  // Mouth Interior
  fillSym('red', 1, 17, 18, 11, 16);

  // Teeth
  fillOffsetSym('white', 2, 2, 18, 18, 13, 17);
  fillOffsetSym('white', 2, 2, 17, 17, 13, 16);
  fillOffsetSym('white', 1, 2, 17, 18, 17, 17);

  // Front Legs
  fillOffsetSym('blue', 4, 6, 8, 12, 1, 5);
  fillOffsetSym('darkBlue', 4, 6, 4, 7, 1, 4);
  fillOffsetSym('darkBlue', 4, 6, 0, 3, 2, 5);
  fillOffsetSym('darkBlue', 4, 7, -1, 0, 3, 7);
  fillOffsetSym('beige', 4, 4, -1, -1, 8, 9);
  fillOffsetSym('beige', 6, 6, -1, -1, 8, 9);
  fillOffsetSym('beige', 7, 7, 5, 7, 0, 1);

  // Back Legs
  fillOffsetSym('blue', 4, 7, 7, 13, -9, -4);
  fillOffsetSym('blue', 5, 8, 8, 12, -8, -5); // Thigh width
  fillOffsetSym('darkBlue', 4, 6, 4, 6, -10, -6);
  fillOffsetSym('darkBlue', 4, 6, 1, 3, -8, -5);
  fillOffsetSym('darkBlue', 4, 7, -1, 0, -7, -3);
  fillOffsetSym('beige', 4, 4, -1, -1, -2, -1);
  fillOffsetSym('beige', 6, 6, -1, -1, -2, -1);
  fillOffsetSym('beige', 8, 8, 9, 11, -8, -6);

  // Tail
  fillSym('blue', 3, 9, 12, -12, -9);
  fillSym('blue', 2, 7, 10, -16, -12);
  fillSym('blue', 2, 8, 11, -15, -13); // Tail width
  fillSym('blue', 1, 5, 8, -20, -16);
  fillSym('blue', 1, 3, 5, -24, -20);
  fillSym('beige', 0, 2, 3, -27, -24);

  fillSym('teal', 1, 8, 8, -12, -9);
  fillSym('teal', 1, 6, 6, -16, -12);
  fillSym('teal', 0, 4, 4, -20, -16);
  fillSym('teal', 0, 2, 2, -24, -20);

  fillSym('beige', 0, 13, 14, -11, -9);
  fillSym('beige', 0, 11, 12, -15, -13);
  fillSym('beige', 0, 9, 10, -19, -17);

  // Back spikes
  fillSym('beige', 0, 15, 16, 0, 2);
  fillSym('beige', 0, 14, 15, -4, -2);
  fillSym('beige', 0, 13, 14, -8, -6);

  // Wings (Stepped)
  fillOffsetSym('beige', 3, 4, 14, 15, -2, 2);
  fillOffsetSym('beige', 5, 6, 15, 16, -3, 1);
  fillOffsetSym('beige', 7, 8, 16, 17, -4, 0);
  fillOffsetSym('beige', 9, 10, 17, 18, -5, -1);
  fillOffsetSym('beige', 11, 12, 18, 19, -6, -2);
  fillOffsetSym('beige', 13, 14, 19, 20, -7, -3);
  fillOffsetSym('beige', 15, 16, 20, 21, -8, -4);
  fillOffsetSym('beige', 17, 18, 21, 22, -9, -5);

  fillOffsetSym('beige', 19, 20, 20, 21, -11, -7);
  fillOffsetSym('beige', 21, 22, 19, 20, -13, -9);

  fillOffsetSym('beige', 17, 18, 18, 19, -11, -7);
  fillOffsetSym('beige', 19, 20, 16, 17, -13, -9);

  fillOffsetSym('beige', 15, 16, 16, 17, -10, -6);
  fillOffsetSym('beige', 17, 18, 14, 15, -12, -8);

  fillOffsetSym('teal', 5, 8, 14, 15, -5, -1);
  fillOffsetSym('blue', 9, 12, 15, 16, -7, -3);
  fillOffsetSym('teal', 13, 16, 16, 17, -9, -5);
  fillOffsetSym('blue', 17, 20, 17, 18, -11, -7);

  return voxels;
};

const FireParticles = ({ isFiring }: { isFiring: boolean }) => {
  const particlesRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particleCount = 150;
  const [particles] = useState(() => {
    return Array.from({ length: particleCount }).map(() => ({
      position: new THREE.Vector3(0, 17, 18),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        Math.random() * 40 + 30
      ),
      life: Math.random(),
      maxLife: Math.random() * 0.6 + 0.2,
      scale: Math.random() * 2 + 1
    }));
  });

  useFrame((state, delta) => {
    if (!particlesRef.current) return;
    
    let needsUpdate = false;
    particles.forEach((p, i) => {
      if (isFiring) {
        p.life += delta;
        if (p.life > p.maxLife) {
          p.life = 0;
          p.position.set(0, 17, 18);
          p.velocity.set(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            Math.random() * 40 + 30
          );
        }
        
        p.position.addScaledVector(p.velocity, delta);
        const progress = p.life / p.maxLife;
        const currentScale = Math.max(0, p.scale * (1 - progress));
        
        dummy.position.copy(p.position);
        dummy.scale.set(currentScale, currentScale, currentScale);
        dummy.updateMatrix();
        particlesRef.current!.setMatrixAt(i, dummy.matrix);
        needsUpdate = true;
      } else {
        if (p.life < p.maxLife) {
          p.life += delta;
          p.position.addScaledVector(p.velocity, delta);
          const progress = p.life / p.maxLife;
          const currentScale = Math.max(0, p.scale * (1 - progress));
          
          dummy.position.copy(p.position);
          dummy.scale.set(currentScale, currentScale, currentScale);
          dummy.updateMatrix();
          particlesRef.current!.setMatrixAt(i, dummy.matrix);
          needsUpdate = true;
        } else {
          if (p.life !== p.maxLife + 1) {
            dummy.scale.set(0.001, 0.001, 0.001);
            dummy.updateMatrix();
            particlesRef.current!.setMatrixAt(i, dummy.matrix);
            needsUpdate = true;
            p.life = p.maxLife + 1; // Mark as hidden
          }
        }
      }
    });
    
    if (needsUpdate) {
      particlesRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={particlesRef} args={[undefined as any, undefined as any, particleCount]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#ff5500" transparent opacity={0.8} />
    </instancedMesh>
  );
};

const VoxelMesh = ({ positions, color }: { positions: number[][], color: string }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const matrix = useMemo(() => new THREE.Matrix4(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    positions.forEach((pos, i) => {
      let targetX = pos[0];
      let targetY = pos[1];
      let targetZ = pos[2];
      
      // Wing flapping
      if (Math.abs(pos[0]) >= 3 && pos[1] >= 14 && pos[2] <= 2) {
        const wingFactor = Math.abs(pos[0]) - 2;
        targetY += Math.sin(t * 8) * wingFactor * 0.4;
      }
      
      // Tail swishing
      if (pos[2] < -8 && Math.abs(pos[0]) < 4) {
        const tailFactor = Math.abs(pos[2] + 8);
        targetX += Math.sin(t * 4 - tailFactor * 0.2) * tailFactor * 0.3;
      }

      // Head bobbing
      if (pos[2] > 12) {
        const headFactor = pos[2] - 12;
        targetY += Math.sin(t * 4) * headFactor * 0.1;
      }

      // Walking animation
      const isLeg = pos[1] < 12 && Math.abs(pos[0]) >= 4;
      if (isLeg) {
        const isFront = pos[2] > 0;
        const isRight = pos[0] > 0;
        
        // Offset phase based on front/back and left/right
        const phaseOffset = (isFront ? 0 : Math.PI) + (isRight ? 0 : Math.PI);
        const legFactor = (12 - pos[1]) * 0.2; // Move more at the bottom
        
        targetZ += Math.sin(t * 6 + phaseOffset) * legFactor * 2;
        targetY += Math.max(0, Math.cos(t * 6 + phaseOffset)) * legFactor;
      }

      matrix.makeTranslation(targetX, targetY, targetZ);
      meshRef.current!.setMatrixAt(i, matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined as any, undefined as any, positions.length]} castShadow receiveShadow frustumCulled={false}>
      <boxGeometry args={[0.98, 0.98, 0.98]} />
      <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
    </instancedMesh>
  );
};

export default function Dragon({ theme }: { theme: any }) {
  const groupRef = useRef<THREE.Group>(null);
  const voxels = useMemo(() => generateVoxels(), []);
  
  const [isFiring, setIsFiring] = useState(false);
  const fireTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = (e: any) => {
    e.stopPropagation();
    
    setIsFiring(true);
    
    if (fireTimeoutRef.current) {
      clearTimeout(fireTimeoutRef.current);
    }
    
    fireTimeoutRef.current = setTimeout(() => {
      setIsFiring(false);
    }, 2000);
  };

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    
    groupRef.current.position.y = Math.sin(t * 2) * 0.1; 
    const scale = 0.1 + Math.sin(t * 3) * 0.001;
    groupRef.current.scale.set(scale, scale, scale);

    const mouseX = (state.mouse.x * Math.PI) / 8;
    const mouseY = (state.mouse.y * Math.PI) / 8;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouseX, 0.05);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -mouseY, 0.05);
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[0.1, 0.1, 0.1]} onClick={handleClick}>
      {Object.entries(voxels).map(([colorName, positions]) => {
        if (positions.length === 0) return null;
        return (
          <VoxelMesh
            key={colorName}
            positions={positions}
            color={theme.colors[colorName]}
          />
        );
      })}
      <FireParticles isFiring={isFiring} />
    </group>
  );
}
