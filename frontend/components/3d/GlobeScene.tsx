"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";

const hazeSpots: [number, number, number, string][] = [
  [0.2, 0.3, 0.95, "#F97316"], [-0.4, 0.1, 0.9, "#EF4444"], [0.5, -0.3, 0.8, "#F4B942"],
];
const fires: [number, number, number][] = [[-0.7, 0.7, 0.2], [-0.55, 0.8, 0.15], [-0.8, 0.55, 0.25]];

function Particles({ still }: { still: boolean }) {
  const ref = useRef<THREE.Points>(null!);
  const pos = useMemo(() => {
    const a = new Float32Array(150 * 3);
    for (let i = 0; i < 150; i++) {
      const theta = i * 2.399963229728653;
      const y = 1 - (i / 149) * 2;
      const radial = Math.sqrt(1 - y * y);
      const v = new THREE.Vector3(Math.cos(theta) * radial, y, Math.sin(theta) * radial).multiplyScalar(1.15 + (i % 7) * 0.05);
      a.set([v.x, v.y, v.z], i * 3);
    }
    return a;
  }, []);
  useFrame((_, d) => { if (!still) ref.current.rotation.y += d * 0.02; });
  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[pos, 3]} /></bufferGeometry>
      <pointsMaterial size={0.02} color="#CCFBF1" transparent opacity={0.6} />
    </points>
  );
}

// Curved wind stream toward Delhi (approx. front-center of the sphere).
function Wind({ from }: { from: [number, number, number] }) {
  const line = useMemo(() => {
    const c = new THREE.QuadraticBezierCurve3(new THREE.Vector3(...from), new THREE.Vector3(-0.2, 1.0, 0.9), new THREE.Vector3(0.1, 0.25, 1.0));
    const g = new THREE.BufferGeometry().setFromPoints(c.getPoints(30));
    return new THREE.Line(g, new THREE.LineBasicMaterial({ color: "#14B8A6", transparent: true, opacity: 0.7 }));
  }, [from]);
  useEffect(()=>()=>{line.geometry.dispose();(line.material as THREE.Material).dispose();},[line]);
  return <primitive object={line} />;
}

function Globe({ still }: { still: boolean }) {
  const group = useRef<THREE.Group>(null!);
  const [hover, setHover] = useState(false);
  // Gentle pointer tilt only; no endless auto-rotation.
  useFrame(({ pointer }) => {
    if (still) return;
    group.current.rotation.y += (pointer.x * 0.3 - group.current.rotation.y) * 0.04;
    group.current.rotation.x += (-pointer.y * 0.2 - group.current.rotation.x) * 0.04;
  });
  return (
    <group ref={group}>
      <mesh><sphereGeometry args={[1, 48, 48]} /><meshPhysicalMaterial color="#0F766E" transparent opacity={0.25} roughness={0.2} /></mesh>
      <mesh><sphereGeometry args={[1.005, 24, 16]} /><meshBasicMaterial color="#9CDBBF" wireframe transparent opacity={0.12} /></mesh>
      {[[0.65,0.55,0.55],[-0.25,-0.65,0.7],[0.8,0,0.5]].map((p,i)=><mesh key={"clean-"+i} position={p as [number,number,number]}><sphereGeometry args={[0.025,8,8]}/><meshBasicMaterial color="#14B8A6"/></mesh>)}
      {[1.15, 1.3].map((r, i) => (
        <mesh key={r} rotation={[Math.PI / 2.4 + i * 0.3, 0, 0]}><torusGeometry args={[r, 0.004, 8, 100]} /><meshBasicMaterial color="#CCFBF1" transparent opacity={0.4} /></mesh>
      ))}
      {hazeSpots.map(([x, y, z, c]) => (
        <mesh key={c} position={[x, y, z]} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
          <sphereGeometry args={[0.22, 20, 20]} /><meshBasicMaterial color={c} transparent opacity={hover ? 0.55 : 0.35} />
        </mesh>
      ))}
      {fires.map((p, i) => <mesh key={i} position={p}><sphereGeometry args={[0.03, 12, 12]} /><meshBasicMaterial color="#F4B942" /></mesh>)}
      {fires.map((p, i) => <Wind key={i} from={p} />)}
      <Particles still={still} />
    </group>
  );
}

function ContextGuard({onFailure}:{onFailure:()=>void}){const gl=useThree(state=>state.gl);useEffect(()=>{const lost=(event:Event)=>{event.preventDefault();onFailure();};gl.domElement.addEventListener("webglcontextlost",lost);return()=>gl.domElement.removeEventListener("webglcontextlost",lost);},[gl,onFailure]);return null;}
export default function GlobeScene({ still,onFailure }: { still: boolean;onFailure:()=>void }) {
  return (
    <Canvas camera={{ position: [0, 0, 3.4], fov: 45 }} dpr={[1, 1.25]} gl={{antialias:true,powerPreference:"low-power"}} frameloop={still ? "demand" : "always"} aria-hidden>
      <ContextGuard onFailure={onFailure}/>
      <ambientLight intensity={0.8} /><pointLight position={[3, 3, 3]} intensity={1.2} />
      <Suspense fallback={null}><Globe still={still} /></Suspense>
    </Canvas>
  );
}
