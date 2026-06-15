"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useEffect, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import gsap from "gsap";

const COUNT = 24; // base pairs
const RADIUS = 1.15;
const STEP = 0.24; // vertical spacing
const ANGLE = 0.52; // radians of twist per step
const TILT_X = 0.16;
const TILT_Z = 0.2;

function Helix({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Group>(null); // whole helix — entrance spin, continuous rotation, parallax
  const pairs = useRef<(THREE.Group | null)[]>([]); // each base pair — staggered assemble
  const ready = useRef(false); // continuous rotation starts only after the entrance settles
  const pointer = useRef({ x: 0, y: 0 });

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

  // GSAP entrance: strands assemble bottom-to-top, the model unwinds into place,
  // then settles into a slow "breathing" pulse.
  useEffect(() => {
    const group = ref.current;
    if (!group) return;
    if (reduced) {
      ready.current = true;
      return;
    }
    const items = pairs.current.filter(Boolean) as THREE.Group[];
    const tl = gsap.timeline({ onComplete: () => (ready.current = true) });
    tl.to(group.scale, { x: 1, y: 1, z: 1, duration: 1.3, ease: "power3.out" }, 0)
      .to(group.rotation, { y: 0, duration: 1.7, ease: "power2.out" }, 0)
      .to(
        items.map((p) => p.scale),
        { x: 1, y: 1, z: 1, duration: 0.55, ease: "back.out(2.2)", stagger: { each: 0.045, from: "start" } },
        0.2,
      )
      .add(() => {
        gsap.to(group.scale, {
          x: 1.04, y: 1.04, z: 1.04,
          duration: 3.4, ease: "sine.inOut", yoyo: true, repeat: -1,
        });
      });
    return () => {
      tl.kill();
      gsap.killTweensOf(group.scale);
    };
  }, [reduced]);

  // Cursor parallax target (whole window, so it reacts across the hero).
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
    const g = ref.current;
    if (!g || reduced) return;
    const d = Math.min(delta, 0.05); // clamp on tab refocus
    if (ready.current) g.rotation.y += d * 0.3; // gentle continuous spin
    // smooth tilt toward the cursor
    const tx = TILT_X + pointer.current.y * 0.22;
    const tz = TILT_Z + pointer.current.x * 0.18;
    g.rotation.x += (tx - g.rotation.x) * d * 3.5;
    g.rotation.z += (tz - g.rotation.z) * d * 3.5;
  });

  return (
    <group
      ref={ref}
      rotation={[TILT_X, reduced ? 0 : -Math.PI * 0.85, TILT_Z]}
      scale={reduced ? 1 : 0.5}
    >
      {nodes.map((n, i) => (
        <group key={i} ref={(el) => { pairs.current[i] = el; }} scale={reduced ? 1 : 0}>
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
          speed={reduced ? 0 : 1.1}
          rotationIntensity={reduced ? 0 : 0.15}
          floatIntensity={reduced ? 0 : 0.5}
        >
          <Helix reduced={reduced} />
        </Float>
      </Rig>
    </Canvas>
  );
}
