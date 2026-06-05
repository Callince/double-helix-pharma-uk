"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";

const COUNT = 24; // base pairs
const RADIUS = 1.15;
const STEP = 0.24; // vertical spacing
const ANGLE = 0.52; // radians of twist per step

function Helix({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Group>(null);

  const nodes = useMemo(() => {
    const up = new THREE.Vector3(0, 1, 0);
    return Array.from({ length: COUNT }, (_, i) => {
      const angle = i * ANGLE;
      const y = (i - (COUNT - 1) / 2) * STEP;
      const x = Math.cos(angle) * RADIUS;
      const z = Math.sin(angle) * RADIUS;
      const quat = new THREE.Quaternion().setFromUnitVectors(
        up,
        new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle)),
      );
      return { x, y, z, quat };
    });
  }, []);

  useFrame((_, delta) => {
    if (ref.current && !reduced) ref.current.rotation.y += delta * 0.35;
  });

  return (
    <group ref={ref} rotation={[0.16, 0, 0.2]}>
      {nodes.map((n, i) => (
        <group key={i}>
          {/* strand A node — logo green */}
          <mesh position={[n.x, n.y, n.z]}>
            <sphereGeometry args={[0.16, 24, 24]} />
            <meshStandardMaterial color="#5ab63c" metalness={0.15} roughness={0.4} />
          </mesh>
          {/* strand B node — brand navy */}
          <mesh position={[-n.x, n.y, -n.z]}>
            <sphereGeometry args={[0.16, 24, 24]} />
            <meshStandardMaterial color="#06295c" metalness={0.2} roughness={0.4} />
          </mesh>
          {/* base-pair rung */}
          <mesh position={[0, n.y, 0]} quaternion={n.quat}>
            <cylinderGeometry args={[0.03, 0.03, RADIUS * 2, 10]} />
            <meshStandardMaterial color="#2b9acd" metalness={0.1} roughness={0.55} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Positions the helix toward the right on wide viewports, centred on narrow ones. */
function Rig({ children }: { children: ReactNode }) {
  const { viewport } = useThree();
  const aspect = viewport.width / viewport.height;
  const wide = aspect > 1.1;
  const x = wide ? Math.min(viewport.width * 0.14, 2.4) : 0;
  const scale = wide ? 1.25 : 1.05;
  return (
    <group position={[x, 0, 0]} scale={scale}>
      {children}
    </group>
  );
}

export default function DnaScene({ reduced = false }: { reduced?: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8.5], fov: 36 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 6]} intensity={2.1} color="#ffffff" />
      <directionalLight position={[-5, -2, 2]} intensity={0.8} color="#2b9acd" />
      <directionalLight position={[0, 0, 8]} intensity={0.7} color="#ffffff" />

      <Rig>
        <Float
          speed={reduced ? 0 : 1.2}
          rotationIntensity={reduced ? 0 : 0.45}
          floatIntensity={reduced ? 0 : 0.7}
        >
          <Helix reduced={reduced} />
        </Float>
      </Rig>
    </Canvas>
  );
}
