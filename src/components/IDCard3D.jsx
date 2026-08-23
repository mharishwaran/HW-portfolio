import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Helper to draw a rounded rectangle on a 2D canvas
function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Helper to draw the card graphics on canvas
function drawCard(canvas, img) {
  const ctx = canvas.getContext('2d');

  // Make canvas transparent initially
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw card background panel (with transparent border margin)
  const margin = 10;
  const cw = canvas.width - margin * 2;
  const ch = canvas.height - margin * 2;
  const r = 32;

  ctx.save();
  
  // Draw Glassmorphic Card Base
  drawRoundedRect(ctx, margin, margin, cw, ch, r);
  const bgGrad = ctx.createLinearGradient(margin, margin, margin, ch);
  bgGrad.addColorStop(0, '#0a0f24'); // deep indigo-black
  bgGrad.addColorStop(0.5, '#020617'); // slate-950
  bgGrad.addColorStop(1, '#0c0a1c'); // dark violet-black
  ctx.fillStyle = bgGrad;
  ctx.fill();

  // Subtle Grid pattern overlay
  ctx.strokeStyle = 'rgba(99, 102, 241, 0.04)';
  ctx.lineWidth = 1;
  const gridSize = 24;
  for (let x = margin; x < cw; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, margin);
    ctx.lineTo(x, ch);
    ctx.stroke();
  }
  for (let y = margin; y < ch; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(margin, y);
    ctx.lineTo(cw, y);
    ctx.stroke();
  }

  // High tech glowing borders
  ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
  ctx.lineWidth = 4;
  drawRoundedRect(ctx, margin, margin, cw, ch, r);
  ctx.stroke();

  // Inner details border
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.15)';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, margin + 12, margin + 12, cw - 24, ch - 24, r - 8);
  ctx.stroke();

  // 3. Large Profile Photo Section (Spans almost full card width, matching Target Reference Image 2)
  const px = 24;
  const py = 24;
  const pw = canvas.width - px * 2; // 464
  const ph = 470; // 470 height for vertical dominance
  const pr = 24;  // Corner radius

  // Subtle outer edge glow around the border of the profile photo
  ctx.save();
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.75)'; // neon purple photo border
  ctx.lineWidth = 3.5;
  ctx.shadowColor = 'rgba(168, 85, 247, 0.5)';
  ctx.shadowBlur = 10;
  drawRoundedRect(ctx, px, py, pw, ph, pr);
  ctx.stroke();
  ctx.restore();

  // Draw & clip the photo inside the rounded rectangle
  ctx.save();
  drawRoundedRect(ctx, px + 1.5, py + 1.5, pw - 3, ph - 3, pr - 1.5);
  ctx.clip();

  if (img) {
    const imgW = img.width;
    const imgH = img.height;
    const aspect = imgW / imgH;
    let drawW, drawH, drawX, drawY;

    // Fill container maintaining aspect ratio
    const containerAspect = pw / ph;
    if (aspect > containerAspect) {
      drawH = ph;
      drawW = ph * aspect;
      drawX = px + (pw - drawW) / 2;
      drawY = py;
    } else {
      drawW = pw;
      drawH = pw / aspect;
      drawX = px;
      // Shift slightly up (0.15 factor) to center face perfectly
      drawY = py - (drawH - ph) * 0.15;
    }

    // Draw the profile photo (with its baked-in silhouette outline glow)
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  } else {
    // Fallback: draw dark slate space with simple indicator
    const fallbackGrad = ctx.createRadialGradient(px + pw/2, py + ph/2, 10, px + pw/2, py + ph/2, pw/2);
    fallbackGrad.addColorStop(0, '#1e1b4b');
    fallbackGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = fallbackGrad;
    ctx.fill();

    ctx.fillStyle = 'rgba(168, 85, 247, 0.4)';
    ctx.font = '500 20px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('NO IMAGE', px + pw/2, py + ph/2);
  }
  ctx.restore();

  // 4. Name and Title Below Photo (Compact, natural vertical placement matching Ref Image 2)
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Primary text: HARISHWARAN
  ctx.font = 'bold 44px "Outfit", sans-serif';
  const nameGrad = ctx.createLinearGradient(px, 560, px + pw, 560);
  nameGrad.addColorStop(0, '#a855f7'); // purple-500
  nameGrad.addColorStop(0.5, '#e879f9'); // fuchsia-400
  nameGrad.addColorStop(1, '#f472b6'); // pink-400

  ctx.save();
  ctx.shadowColor = 'rgba(232, 121, 249, 0.4)';
  ctx.shadowBlur = 12;
  ctx.fillStyle = nameGrad;
  ctx.fillText('HARISHWARAN', canvas.width / 2, 560);
  ctx.restore();

  // Secondary text: DEVELOPER
  ctx.font = 'bold 24px "Outfit", sans-serif';
  ctx.save();
  ctx.shadowColor = 'rgba(99, 102, 241, 0.3)';
  ctx.shadowBlur = 8;
  ctx.fillStyle = '#818cf8'; // Soft indigo/blue tone matching the theme
  ctx.fillText('DEVELOPER', canvas.width / 2, 620);
  ctx.restore();

  ctx.restore();
}

export default function IDCard3D() {
  const cardRef = useRef();
  const strapLeftRef = useRef();
  const strapRightRef = useRef();

  const { camera, mouse, viewport } = useThree();

  // Load profile image
  const [profileImg, setProfileImg] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.src = '/assets/profile.png?t=' + Date.now();
    img.onload = () => {
      console.log("Profile image loaded successfully inside component:", img.width, img.height);
      setProfileImg(img);
    };
    img.onerror = (err) => {
      console.error("Failed to load profile image from /assets/profile.png:", err);
    };
  }, []);

  // Generate canvas in memory once
  const canvas = useMemo(() => {
    const el = document.createElement('canvas');
    el.width = 512;
    el.height = 768;
    
    // Draw the fallback content synchronously on creation
    drawCard(el, null);
    return el;
  }, []);

  // Create shared CanvasTexture instance
  const cardTexture = useMemo(() => {
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [canvas]);

  // Update canvas contents when image loads and flag texture updates
  useEffect(() => {
    if (profileImg) {
      console.log("Redrawing canvas with loaded profile image");
      drawCard(canvas, profileImg);
      cardTexture.needsUpdate = true;
    }
  }, [canvas, profileImg, cardTexture]);

  // Verlet Physics Engine setup
  const PHYSICS_NODES = 8;
  const spacing = 0.35; // spacing between lanyard links
  const gravity = new THREE.Vector3(0, -9.81, 0);
  const dragFactor = 0.95; // damping of velocity
  const constraintIterations = 12; // stiffness

  // Initializing physics nodes
  const nodes = useMemo(() => {
    const list = [];
    for (let i = 0; i < PHYSICS_NODES; i++) {
      const pos = new THREE.Vector3(0, 2.5 - i * spacing, 0);
      list.push({
        pos: pos.clone(),
        oldPos: pos.clone(),
        acc: new THREE.Vector3(),
        fixed: i === 0, // only node 0 (top anchor) is fixed
      });
    }
    return list;
  }, []);

  // Tracking cursor interaction state
  const [isDragging, setIsDragging] = useState(false);
  const dragTarget = useRef(new THREE.Vector3());
  const cardRotation = useRef(new THREE.Euler(0, 0, 0));
  const cardRotVel = useRef(new THREE.Vector3(0, 0, 0));

  // Raycaster offset relative to card center when dragging
  const dragOffset = useRef(new THREE.Vector3());

  // Mouse raycaster projection
  const handlePointerDown = (e) => {
    e.stopPropagation();
    e.target.setPointerCapture(e.pointerId);
    setIsDragging(true);
    
    const cardPos = nodes[PHYSICS_NODES - 1].pos;
    dragOffset.current.copy(e.point).sub(cardPos);
    dragTarget.current.copy(e.point);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    e.stopPropagation();
    
    const targetX = (mouse.x * viewport.width) / 2;
    const targetY = (mouse.y * viewport.height) / 2;
    dragTarget.current.set(targetX, targetY, 0).sub(dragOffset.current);
  };

  const handlePointerUp = (e) => {
    e.stopPropagation();
    e.target.releasePointerCapture(e.pointerId);
    setIsDragging(false);
  };

  // Physics Loop inside useFrame
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.03);

    const anchor = nodes[0];
    anchor.pos.set(mouse.x * 0.4, 2.5 + Math.abs(mouse.x * 0.1), mouse.y * 0.2);

    for (let i = 0; i < PHYSICS_NODES; i++) {
      const node = nodes[i];
      if (node.fixed) continue;

      if (i === PHYSICS_NODES - 1 && isDragging) {
        node.oldPos.copy(node.pos);
        node.pos.lerp(dragTarget.current, 0.25);
        node.acc.set(0, 0, 0);
      } else {
        const vel = new THREE.Vector3().subVectors(node.pos, node.oldPos).multiplyScalar(dragFactor);
        node.oldPos.copy(node.pos);
        node.acc.copy(gravity);
        
        const t = state.clock.getElapsedTime();
        node.acc.x += Math.sin(t * 2 + i) * 0.6;
        node.acc.z += Math.cos(t * 1.5 + i) * 0.4;
        
        node.pos.add(vel).addScaledVector(node.acc, dt * dt);
      }
    }

    for (let iter = 0; iter < constraintIterations; iter++) {
      for (let i = 0; i < PHYSICS_NODES - 1; i++) {
        const nA = nodes[i];
        const nB = nodes[i + 1];

        const deltaVec = new THREE.Vector3().subVectors(nB.pos, nA.pos);
        const dist = deltaVec.length();
        const difference = dist - spacing;
        const dir = deltaVec.normalize();
        
        if (nA.fixed) {
          nB.pos.addScaledVector(dir, -difference);
        } else {
          nA.pos.addScaledVector(dir, difference * 0.5);
          nB.pos.addScaledVector(dir, -difference * 0.5);
        }
      }
    }

    const leftAnchorOffset = new THREE.Vector3(-0.4, 0, 0);
    const rightAnchorOffset = new THREE.Vector3(0.4, 0, 0);
    const leftStrapPoints = [];
    const rightStrapPoints = [];

    for (let i = 0; i < PHYSICS_NODES; i++) {
      const node = nodes[i];
      const factor = 1 - (i / (PHYSICS_NODES - 1));
      const leftPt = node.pos.clone().addScaledVector(leftAnchorOffset, factor);
      const rightPt = node.pos.clone().addScaledVector(rightAnchorOffset, factor);
      leftStrapPoints.push(leftPt);
      rightStrapPoints.push(rightPt);
    }

    if (strapLeftRef.current) strapLeftRef.current.geometry.setFromPoints(leftStrapPoints);
    if (strapRightRef.current) strapRightRef.current.geometry.setFromPoints(rightStrapPoints);

    const card = cardRef.current;
    if (card) {
      const cardNode = nodes[PHYSICS_NODES - 1];
      const parentNode = nodes[PHYSICS_NODES - 2];
      card.position.copy(cardNode.pos);

      const lanyardDir = new THREE.Vector3().subVectors(cardNode.pos, parentNode.pos).normalize();
      const targetQuat = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, -1, 0),
        lanyardDir
      );

      const cardVel = new THREE.Vector3().subVectors(cardNode.pos, cardNode.oldPos);
      const targetTiltX = -cardVel.y * 3 - cardVel.z * 5;
      const targetTiltZ = cardVel.x * 5;
      const targetTiltY = cardVel.x * 2;

      const tiltQuat = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(targetTiltX, targetTiltY, targetTiltZ)
      );

      const finalQuat = targetQuat.multiply(tiltQuat);
      card.quaternion.slerp(finalQuat, 0.15);
    }
  });

  return (
    <group>
      {/* Lanyard Line - Left Strand */}
      <line ref={strapLeftRef}>
        <bufferGeometry />
        <lineBasicMaterial color="#6366f1" linewidth={2} transparent opacity={0.6} />
      </line>

      {/* Lanyard Line - Right Strand */}
      <line ref={strapRightRef}>
        <bufferGeometry />
        <lineBasicMaterial color="#6366f1" linewidth={2} transparent opacity={0.6} />
      </line>

      {/* 3D Card Mesh */}
      <group
        ref={cardRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerOut={handlePointerUp}
      >
        {/* Lanyard Clip Holder (Mini-connector ring on card top) */}
        <mesh position={[0, 0.95, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.1, 8]} />
          <meshStandardMaterial color="#818cf8" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 1.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.06, 0.015, 8, 16]} />
          <meshStandardMaterial color="#a855f7" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Main Card Plane (Double sided layout) */}
        {/* Front Plate */}
        <mesh castShadow receiveShadow position={[0, 0, 0.005]}>
          <boxGeometry args={[1.2, 1.8, 0.01]} />
          <meshStandardMaterial
            transparent
            roughness={0.2}
            metalness={0.15}
            side={THREE.DoubleSide}
            emissive="#ffffff"
            emissiveIntensity={0.36}
            map={cardTexture}
            emissiveMap={cardTexture}
          />
        </mesh>

        {/* Outer Transparent Glass Border Shield (Slightly larger, glossy reflection overlay) */}
        <mesh position={[0, 0, 0.01]}>
          <boxGeometry args={[1.24, 1.84, 0.01]} />
          <meshPhysicalMaterial
            transparent
            opacity={0.12}
            roughness={0.05}
            transmission={0.95}
            thickness={0.05}
            ior={1.5}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
            depthWrite={false}
          />
        </mesh>

        {/* Back Plate (Plain carbon fiber look / verified badge print) */}
        <mesh position={[0, 0, -0.005]}>
          <boxGeometry args={[1.2, 1.8, 0.01]} />
          <meshStandardMaterial color="#080711" roughness={0.7} metalness={0.8} />
        </mesh>
      </group>
    </group>
  );
}
