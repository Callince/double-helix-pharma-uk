"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import * as THREE from "three";
import { services } from "@/lib/site";

const LEVELS = 26; // helix levels (x2 strands = strand points)
const R_HELIX = 1.05;
const STEP = 0.25;
const TWIST = 0.46;
const R_CIRCLE = 2.5;
const SVC_COLORS = ["#042a63", "#0b5394", "#136c9c", "#0a8a8f", "#1f8a55", "#2f7d22"];
const STRAND_A = new THREE.Color("#5ab63c");
const STRAND_B = new THREE.Color("#2b9acd");

const smooth = (t: number) => t * t * (3 - 2 * t);

const labelStyle = (color: string): CSSProperties => ({
  pointerEvents: "auto",
  display: "inline-block",
  whiteSpace: "nowrap",
  background: "rgba(255,255,255,0.94)",
  border: `1px solid ${color}33`,
  borderLeft: `3px solid ${color}`,
  color: "#06295c",
  fontSize: "12px",
  fontWeight: 600,
  lineHeight: 1.1,
  padding: "4px 9px",
  borderRadius: "7px",
  boxShadow: "0 6px 18px rgba(6,41,92,0.18)",
  textDecoration: "none",
  fontFamily: "inherit",
});

function Morph({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const svcRefs = useRef<(THREE.Group | null)[]>([]);
  const time = useRef(0);
  const spin = useRef(0);

  const { strandHelix, strandCircle, strandColors, count } = useMemo(() => {
    const count = LEVELS * 2;
    const strandHelix = new Float32Array(count * 3);
    const strandCircle = new Float32Array(count * 3);
    const strandColors = new Float32Array(count * 3);
    let n = 0;
    for (let l = 0; l < LEVELS; l++) {
      for (let s = 0; s < 2; s++) {
        const ang = l * TWIST + s * Math.PI;
        strandHelix[n * 3] = Math.cos(ang) * R_HELIX;
        strandHelix[n * 3 + 1] = (l - (LEVELS - 1) / 2) * STEP;
        strandHelix[n * 3 + 2] = Math.sin(ang) * R_HELIX;
        const theta = (n / count) * Math.PI * 2 - Math.PI / 2;
        strandCircle[n * 3] = Math.cos(theta) * R_CIRCLE;
        strandCircle[n * 3 + 1] = Math.sin(theta) * R_CIRCLE;
        strandCircle[n * 3 + 2] = 0;
        (s === 0 ? STRAND_A : STRAND_B).toArray(strandColors, n * 3);
        n++;
      }
    }
    return { strandHelix, strandCircle, strandColors, count };
  }, []);

  const svc = useMemo(
    () =>
      services.map((s, k) => {
        const l = Math.round((k + 0.5) * (LEVELS / services.length));
        const ang = l * TWIST;
        const helix: [number, number, number] = [
          Math.cos(ang) * R_HELIX,
          (l - (LEVELS - 1) / 2) * STEP,
          Math.sin(ang) * R_HELIX,
        ];
        const theta = (k / services.length) * Math.PI * 2 - Math.PI / 2;
        const circle: [number, number, number] = [Math.cos(theta) * R_CIRCLE, Math.sin(theta) * R_CIRCLE, 0];
        return { helix, circle, color: SVC_COLORS[k], title: s.title, href: s.href };
      }),
    [],
  );

  const morphPos = useMemo(() => new Float32Array(strandHelix), [strandHelix]);

  // Soft round glow sprite so the points read as luminous orbs, not flat squares.
  const sprite = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.35, "rgba(255,255,255,0.65)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, Math.PI * 2);
    ctx.fill();
    return new THREE.CanvasTexture(c);
  }, []);

  useFrame((_, delta) => {
    if (reduced) return;
    const d = Math.min(delta, 0.05);
    time.current += d;
    spin.current += d * 0.3;

    const cycle = 9.4;
    const tt = time.current % cycle;
    let m: number;
    if (tt < 2.2) m = 0;
    else if (tt < 4.2) m = smooth((tt - 2.2) / 2);
    else if (tt < 6.8) m = 1;
    else m = 1 - smooth((tt - 6.8) / 2.6);

    const pts = pointsRef.current;
    if (pts) {
      const arr = pts.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count * 3; i++) arr[i] = strandHelix[i] * (1 - m) + strandCircle[i] * m;
      pts.geometry.attributes.position.needsUpdate = true;
    }
    for (let k = 0; k < svc.length; k++) {
      const g = svcRefs.current[k];
      if (!g) continue;
      const a = svc[k].helix;
      const b = svc[k].circle;
      g.position.set(a[0] * (1 - m) + b[0] * m, a[1] * (1 - m) + b[1] * m, a[2] * (1 - m) + b[2] * m);
    }
    if (group.current) group.current.rotation.y = spin.current * (1 - m);
  });

  return (
    <group ref={group} rotation={[0.14, 0, 0]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[morphPos, 3]} />
          <bufferAttribute attach="attributes-color" args={[strandColors, 3]} />
        </bufferGeometry>
        <pointsMaterial map={sprite} size={0.26} sizeAttenuation vertexColors transparent opacity={0.96} depthWrite={false} />
      </points>
      {svc.map((sv, k) => (
        <group key={k} ref={(el) => { svcRefs.current[k] = el; }} position={sv.helix}>
          <mesh>
            <sphereGeometry args={[0.24, 24, 24]} />
            <meshStandardMaterial color={sv.color} emissive={sv.color} emissiveIntensity={0.35} metalness={0.35} roughness={0.28} />
          </mesh>
          <Html position={[0, 0.44, 0]} center distanceFactor={9} zIndexRange={[9, 3]} occlude>
            <a href={sv.href} aria-label={sv.title} style={labelStyle(sv.color)}>
              {sv.title}
            </a>
          </Html>
        </group>
      ))}
    </group>
  );
}

function Rig({ children }: { children: ReactNode }) {
  const { viewport } = useThree();
  const wide = viewport.width / viewport.height > 1.1;
  const x = wide ? Math.min(viewport.width * 0.2, 2.9) : 0;
  return <group position={[x, 0, 0]} scale={wide ? 1 : 0.86}>{children}</group>;
}

export default function MorphScene({ reduced = false }: { reduced?: boolean }) {
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
        camera={{ position: [0, 0, 9.5], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        frameloop={reduced ? "demand" : visible ? "always" : "never"}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 6, 6]} intensity={2} color="#ffffff" />
        <directionalLight position={[-5, -2, 2]} intensity={0.7} color="#2b9acd" />
        <pointLight position={[3, 2, 5]} intensity={1.4} color="#ffffff" />
        <Rig>
          <Morph reduced={reduced} />
        </Rig>
      </Canvas>
    </div>
  );
}
