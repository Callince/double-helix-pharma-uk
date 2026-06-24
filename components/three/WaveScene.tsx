"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const COLS = 54;
const ROWS = 54;
const SPACING = 0.3;
const AMP = 0.5;
const C_LOW = new THREE.Color("#042a63"); // navy troughs
const C_HIGH = new THREE.Color("#2f9fbe"); // teal crests

/** A flowing field of points whose height ripples on a sine/cosine wave. */
function Wave({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const pointer = useRef(0);
  const time = useRef(0);
  const tmp = useMemo(() => new THREE.Color(), []);

  const { positions, colors, base } = useMemo(() => {
    const count = COLS * ROWS;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const base = new Float32Array(count * 2);
    let i = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const x = (c - COLS / 2) * SPACING;
        const z = (r - ROWS / 2) * SPACING;
        positions[i * 3] = x;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = z;
        base[i * 2] = x;
        base[i * 2 + 1] = z;
        C_LOW.toArray(colors, i * 3);
        i++;
      }
    }
    return { positions, colors, base };
  }, []);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      pointer.current = e.clientX / window.innerWidth - 0.5;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  useFrame((_, delta) => {
    const pts = ref.current;
    if (!pts || reduced) return;
    const d = Math.min(delta, 0.05);
    time.current += d;
    const t = time.current;
    const pos = pts.geometry.attributes.position.array as Float32Array;
    const col = pts.geometry.attributes.color.array as Float32Array;
    const n = COLS * ROWS;
    for (let i = 0; i < n; i++) {
      const x = base[i * 2];
      const z = base[i * 2 + 1];
      const y = Math.sin(x * 0.55 + t) * AMP + Math.cos(z * 0.5 + t * 0.8) * AMP * 0.8;
      pos[i * 3 + 1] = y;
      const h = Math.min(1, Math.max(0, y / (AMP * 1.8) + 0.5));
      tmp.copy(C_LOW).lerp(C_HIGH, h);
      tmp.toArray(col, i * 3);
    }
    pts.geometry.attributes.position.needsUpdate = true;
    pts.geometry.attributes.color.needsUpdate = true;
    pts.rotation.y += (pointer.current * 0.22 - pts.rotation.y) * d * 2;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.062} sizeAttenuation vertexColors transparent opacity={0.92} depthWrite={false} />
    </points>
  );
}

export default function WaveScene({ reduced = false }: { reduced?: boolean }) {
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
        camera={{ position: [0, 4.4, 10], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        frameloop={reduced ? "demand" : visible ? "always" : "never"}
        onCreated={({ camera }) => camera.lookAt(0, -0.6, 0)}
      >
        <Wave reduced={reduced} />
      </Canvas>
    </div>
  );
}
