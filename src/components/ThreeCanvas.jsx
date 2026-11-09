import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import IDCard3D from './IDCard3D';

// Pre-allocated scratch variables for zero-allocation animation loops
const _focusTarget = new THREE.Vector3();
const _adaptedPos = new THREE.Vector3();
const _adaptedScale = new THREE.Vector3();

// Target positions, scales, and precomputed rotation quaternions for each section
const SECTION_TARGETS = {
  home: {
    pos: new THREE.Vector3(0, 0.1, 0),
    scale: new THREE.Vector3(1.0, 1.0, 1.0),
    rot: new THREE.Euler(0, 0, 0)
  },
  about: {
    pos: new THREE.Vector3(1.4, 0.4, 0.2),
    scale: new THREE.Vector3(0.85, 0.85, 0.85),
    rot: new THREE.Euler(0, -Math.PI / 8, 0)
  },
  skills: {
    pos: new THREE.Vector3(-1.4, 0.1, 0.2),
    scale: new THREE.Vector3(0.8, 0.8, 0.8),
    rot: new THREE.Euler(0, Math.PI / 8, 0)
  },
  projects: {
    pos: new THREE.Vector3(1.6, 0.5, -0.4),
    scale: new THREE.Vector3(0.75, 0.75, 0.75),
    rot: new THREE.Euler(0, -Math.PI / 6, 0)
  },
  experience: {
    pos: new THREE.Vector3(1.35, 0.35, 0.15),
    scale: new THREE.Vector3(0.82, 0.82, 0.82),
    rot: new THREE.Euler(0, -Math.PI / 8, 0)
  },
  certifications: {
    pos: new THREE.Vector3(1.4, -0.2, -0.5),
    scale: new THREE.Vector3(0.7, 0.7, 0.7),
    rot: new THREE.Euler(0, -Math.PI / 8, 0)
  },
  contact: {
    pos: new THREE.Vector3(1.3, 0.2, 0.1),
    scale: new THREE.Vector3(0.85, 0.85, 0.85),
    rot: new THREE.Euler(0, -Math.PI / 10, 0)
  }
};

// Precompute quaternions once at module load
Object.values(SECTION_TARGETS).forEach(t => {
  t.quat = new THREE.Quaternion().setFromEuler(t.rot);
});

// 1. Camera Rig for smooth cinematic parallax matching cursor
function CameraRig({ activeSection }) {
  const { camera, mouse, size } = useThree();

  useFrame(() => {
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
      case 'experience': {
        const isNarrow = size.width < 1150;
        targetX = isNarrow ? -0.5 : -0.45;
        targetY = 0.65;
        targetZ = isNarrow ? 4.0 : 3.8;
        break;
      }
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

    // Dynamic focus point sways slightly without object allocation
    _focusTarget.set(targetX * 0.2, 0.4, 0);
    camera.lookAt(_focusTarget);
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
  const { size } = useThree();

  useFrame(() => {
    if (!groupRef.current) return;
    const target = SECTION_TARGETS[activeSection] || SECTION_TARGETS.home;

    let targetPos = target.pos;
    let targetScale = target.scale;

    if (activeSection === 'experience') {
      const isNarrow = size.width < 1150;
      const posX = isNarrow ? 1.4 : 1.35;
      const scaleVal = isNarrow ? 0.78 : 0.82;
      _adaptedPos.set(posX, target.pos.y, target.pos.z);
      _adaptedScale.set(scaleVal, scaleVal, scaleVal);
      targetPos = _adaptedPos;
      targetScale = _adaptedScale;
    }

    groupRef.current.position.lerp(targetPos, 0.08);
    groupRef.current.scale.lerp(targetScale, 0.08);
    groupRef.current.quaternion.slerp(target.quat, 0.08);
  });

  return (
    <group ref={groupRef}>
      <IDCard3D />
    </group>
  );
}

// 5. WebGL Shader Prewarmer to compile all shaders in background on mount
function WebGLPrewarmer() {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    try {
      gl.compile(scene, camera);
    } catch {
      // Graceful fallback if compile is unsupported
    }
  }, [gl, scene, camera]);
  return null;
}

export default function ThreeCanvas({ activeSection }) {
  return (
    <div className="fixed inset-0 w-full h-full z-0 select-none pointer-events-auto bg-radial from-slate-950 via-slate-950 to-black">
      <Canvas
        camera={{ position: [0, 0.5, 4], fov: 45 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 5]} intensity={1.8} />

        {/* Compile shaders early to avoid first-frame shader linking jank */}
        <WebGLPrewarmer />

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
