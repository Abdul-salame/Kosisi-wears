"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

const GOLD = "#d4af65";
const CHARCOAL = "#1a1a1a";

/**
 * Procedurally built hoodie silhouette (no external 3D asset required).
 * Swap this out for a real .glb model later via useGLTF("/models/hoodie.glb")
 * once product-accurate 3D scans/models are available.
 */
function Hoodie() {
  const group = useRef<THREE.Group>(null);

  // gentle idle bob so the piece feels alive even before the user drags
  useFrame((state) => {
    if (!group.current) return;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.04;
  });

  const fabric = (
    <meshStandardMaterial color={CHARCOAL} roughness={0.85} metalness={0.05} />
  );
  const gold = (
    <meshStandardMaterial color={GOLD} roughness={0.25} metalness={0.85} />
  );

  return (
    <group ref={group} position={[0, -0.2, 0]} scale={1.15}>
      {/* Torso */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.62, 0.95, 8, 24]} />
        {fabric}
      </mesh>

      {/* Left sleeve */}
      <mesh position={[-0.92, 0.35, 0]} rotation={[0, 0, Math.PI / 2.6]} castShadow>
        <capsuleGeometry args={[0.24, 0.85, 8, 16]} />
        {fabric}
      </mesh>

      {/* Right sleeve */}
      <mesh position={[0.92, 0.35, 0]} rotation={[0, 0, -Math.PI / 2.6]} castShadow>
        <capsuleGeometry args={[0.24, 0.85, 8, 16]} />
        {fabric}
      </mesh>

      {/* Hood */}
      <mesh position={[0, 0.85, -0.18]} rotation={[0.35, 0, 0]} castShadow>
        <sphereGeometry args={[0.42, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
        {fabric}
      </mesh>

      {/* Neckline ring */}
      <mesh position={[0, 0.72, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.22, 0.045, 12, 24]} />
        {fabric}
      </mesh>

      {/* Drawstrings */}
      {[-0.09, 0.09].map((x, i) => (
        <group key={i} position={[x, 0.55, 0.58]}>
          <mesh rotation={[0.15, 0, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.4, 8]} />
            {gold}
          </mesh>
          <mesh position={[0, -0.22, 0.03]}>
            <sphereGeometry args={[0.03, 12, 12]} />
            {gold}
          </mesh>
        </group>
      ))}

      {/* Zipper line */}
      <mesh position={[0, 0.15, 0.6]}>
        <boxGeometry args={[0.03, 0.85, 0.02]} />
        {gold}
      </mesh>
      <mesh position={[0, 0.55, 0.6]}>
        <boxGeometry args={[0.08, 0.05, 0.03]} />
        {gold}
      </mesh>

      {/* Chest emblem */}
      <mesh position={[0.28, 0.28, 0.58]} rotation={[0, 0, 0]}>
        <circleGeometry args={[0.07, 24]} />
        {gold}
      </mesh>

      {/* Waistband */}
      <mesh position={[0, -0.42, 0]}>
        <cylinderGeometry args={[0.64, 0.6, 0.14, 24, 1, true]} />
        <meshStandardMaterial color={CHARCOAL} roughness={0.9} metalness={0.05} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export function HeroProductViewer() {
  return (
    <div className="relative h-85 sm:h-105 w-full">
      <div className="absolute inset-0 viewer-glow" />
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.35, 3.4], fov: 38 }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.55} />
          <spotLight
            position={[2.5, 3, 2]}
            angle={0.32}
            penumbra={0.6}
            intensity={1.25}
            color="#f4e4c1"
            castShadow
          />
          <pointLight position={[-2, 1, -1.5]} intensity={0.55} color="#4fae8f" />
          <Hoodie />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.02, 0]}>
            <planeGeometry args={[8, 8]} />
            <meshStandardMaterial color="#050505" transparent opacity={0.65} />
          </mesh>
          <ContactShadows position={[0, -0.85, 0]} opacity={0.52} blur={2.2} far={2} />
          <Environment preset="city" />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={1.4}
            minPolarAngle={Math.PI / 2.6}
            maxPolarAngle={Math.PI / 1.8}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
