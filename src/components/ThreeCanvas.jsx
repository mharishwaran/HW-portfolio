import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import IDCard3D from './IDCard3D';

// 1. Camera Rig for smooth cinematic parallax matching cursor
function CameraRig({ activeSection }) {
  const { camera, mouse } = useThree();

  useFrame((state, delta) => {
    // Determine base camera targets based on active section
    let targetX = 0;
    let targetY = 0.5;
    let targetZ = 4.2;

    switch (activeSection) {
      case 'home':
        targetX = 0;
        targetY = 0.6;
        targetZ = 4.0;
        break;
      case 'about':
        targetX = -0.5;
        targetY = 0.8;
        targetZ = 3.6;
        break;
      case 'skills':
        targetX = 0.5;
        targetY = 0.4;
        targetZ = 3.6;
        break;
      case 'projects':
        targetX = -0.6;
        targetY = 0.6;
        targetZ = 4.2;
        break;
      case 'experience':
        targetX = 0.6;
        targetY = 0.5;
        targetZ = 4.0;
        break;
      case 'certifications':
        targetX = 0;
        targetY = 0.8;
        targetZ = 4.5;
        break;
      case 'contact':
        targetX = -0.4;
        targetY = 0.4;
        targetZ = 3.8;
        break;
      default:
        break;
    }

    // Add mouse cursor displacement for interactive parallax (inertia camera)
    const cursorDisplaceX = mouse.x * 0.6;
    const cursorDisplaceY = mouse.y * 0.4;

    // Linearly interpolate positions for smooth easing transitions
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX + cursorDisplaceX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY + cursorDisplaceY, 0.05);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);

    // Dynamic focus point sways slightly
    const focusTarget = new THREE.Vector3(targetX * 0.2, 0.4, 0);
    camera.lookAt(focusTarget);
  });

  return null;
}


// 3. Floating ambient stellar dust
function AmbientParticles() {
  const pointsRef = useRef();
  const count = 120;

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Spread particles in a wide 3D cage around focal point
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5 - 1;
      
      spd[i] = 0.15 + Math.random() * 0.3;
    }
    return [pos, spd];
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const array = pointsRef.current.geometry.attributes.position.array;
    
    for (let i = 0; i < count; i++) {
      const idxY = i * 3 + 1;
      // Float particles upward slowly
      array[idxY] += speeds[i] * delta;
      
      // Reset if floated above bounds
      if (array[idxY] > 3) {
        array[idxY] = -3;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Subtle rotation of whole cluster
    pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#818cf8"
        size={0.035}
        transparent
        opacity={0.65}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </points>
  );
}

// 4. Wrapper to transition the 3D card position based on active section
function IDCardContainer({ activeSection }) {
  const groupRef = useRef();

  useFrame(() => {
    if (!groupRef.current) return;

    // Define target position and scale based on active navigation screen
    let targetPos = new THREE.Vector3(0, 0, 0);
    let targetScale = new THREE.Vector3(1, 1, 1);
    let targetRot = new THREE.Euler(0, 0, 0);

    switch (activeSection) {
      case 'home':
        targetPos.set(0, 0.1, 0);
        targetScale.set(1.0, 1.0, 1.0);
        break;
      case 'about':
        // Move right to yield space to left text block
        targetPos.set(1.4, 0.4, 0.2);
        targetScale.set(0.85, 0.85, 0.85);
        targetRot.set(0, -Math.PI / 8, 0); // rotated slightly toward camera
        break;
      case 'skills':
        // Move left to yield space to right skills layout
        targetPos.set(-1.4, 0.1, 0.2);
        targetScale.set(0.8, 0.8, 0.8);
        targetRot.set(0, Math.PI / 8, 0);
        break;
      case 'projects':
        // Farther right and back for list view
        targetPos.set(1.6, 0.5, -0.4);
        targetScale.set(0.75, 0.75, 0.75);
        targetRot.set(0, -Math.PI / 6, 0);
        break;
      case 'experience':
        // Left center side
        targetPos.set(-1.5, 0.3, -0.2);
        targetScale.set(0.8, 0.8, 0.8);
        targetRot.set(0, Math.PI / 7, 0);
        break;
      case 'certifications':
        // Center, pushed back, slightly low
        targetPos.set(1.4, -0.2, -0.5);
        targetScale.set(0.7, 0.7, 0.7);
        targetRot.set(0, -Math.PI / 8, 0);
        break;
      case 'contact':
        // Right side
        targetPos.set(1.3, 0.2, 0.1);
        targetScale.set(0.85, 0.85, 0.85);
        targetRot.set(0, -Math.PI / 10, 0);
        break;
      default:
        break;
    }

    // Lerp translation parameters
    groupRef.current.position.lerp(targetPos, 0.08);
    groupRef.current.scale.lerp(targetScale, 0.08);
    
    // Lerp rotation base mesh offsets
    const currentQ = groupRef.current.quaternion;
    const targetQ = new THREE.Quaternion().setFromEuler(targetRot);
    currentQ.slerp(targetQ, 0.08);
  });

  return (
    <group ref={groupRef}>
      <IDCard3D />
    </group>
  );
}

export default function ThreeCanvas({ activeSection }) {
  return (
    <div className="fixed inset-0 w-full h-full z-0 select-none pointer-events-auto bg-radial from-slate-950 via-slate-950 to-black">
      <Canvas
        shadows
        camera={{ position: [0, 0.5, 4], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
      >
        {/* Lights */}
        <ambientLight intensity={0.45} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.8}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Cinematic Particles & Starry background */}
        <AmbientParticles />
        <Stars radius={100} depth={50} count={300} factor={4} saturation={0.5} fade speed={1.5} />

        {/* 3D Interactive Card Model */}
        <IDCardContainer activeSection={activeSection} />

        {/* Camera Controls Rig */}
        <CameraRig activeSection={activeSection} />
      </Canvas>
    </div>
  );
}
