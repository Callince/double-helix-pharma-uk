"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, Environment, Lightformer } from "@react-three/drei";
import { useEffect, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";

/** A glossy, distorting orb that reacts to the cursor and reflects colour. */
function Blob({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = e.clientX / window.innerWidth - 0.5;
      pointer.current.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  useFrame((_, delta) => {
    if (!ref.current || reduced) return;
    const d = Math.min(delta, 0.05);
    ref.current.rotation.y += d * 0.12;
    const tx = pointer.current.y * 0.6;
    const tz = -pointer.current.x * 0.6;
    ref.current.rotation.x += (tx - ref.current.rotation.x) * d * 3;
    ref.current.rotation.z += (tz - ref.current.rotation.z) * d * 3;
  });

  return (
    <mesh ref={ref} scale={1.45}>
      <icosahedronGeometry args={[1, 48]} />
      <MeshDistortMaterial
        color="#cfe6f0"
        metalness={1}
        roughness={0.08}
        distort={reduced ? 0.15 : 0.46}
        speed={reduced ? 0 : 1.9}
        envMapIntensity={1.5}
      />
    </mesh>
  );
}

/** Pushes the blob toward the right on wide viewports. */
function Rig({ children }: { children: ReactNode }) {
  const { viewport } = useThree();
  const wide = viewport.width / viewport.height > 1.1;
  const x = wide ? Math.min(viewport.width * 0.2, 2.8) : 0;
  return <group position={[x, 0, 0]} scale={wide ? 1 : 0.82}>{children}</group>;
}

export default function BlobScene({ reduced = false }: { reduced?: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        frameloop={reduced ? "demand" : visible ? "always" : "never"}
      >
        <ambientLight intensity={0.35} />
        {/* Procedural reflection environment (no external HDRI -> CSP-safe). */}
        <Environment resolution={256}>
          <mesh scale={60}>
            <sphereGeometry args={[1, 24, 24]} />
            <meshBasicMaterial color="#16385c" side={THREE.BackSide} />
          </mesh>
          <Lightformer intensity={2.6} position={[0, 4, 5]} scale={[10, 5, 1]} color="#ffffff" />
          <Lightformer intensity={2} position={[-6, 2, 3]} scale={[3, 10, 1]} color="#45c7f2" />
          <Lightformer intensity={2} position={[6, -1, 3]} scale={[3, 10, 1]} color="#2f9fbe" />
          <Lightformer intensity={1.7} position={[3, 4, -2]} scale={[5, 5, 1]} color="#7c5cff" />
          <Lightformer intensity={1.4} position={[-4, -3, 2]} scale={[6, 3, 1]} color="#1f8a55" />
        </Environment>
        <Rig>
          <Blob reduced={reduced} />
        </Rig>
      </Canvas>
    </div>
  );
}
