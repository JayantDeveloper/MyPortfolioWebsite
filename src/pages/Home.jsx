import { Link } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text3D, Environment } from '@react-three/drei';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import { useState, useRef, useCallback, Suspense, useEffect } from 'react';
import * as THREE from 'three';

// Individual draggable 3D letter
function PhysicsLetter({ char, position, index, resetKey }) {
  const rigidBodyRef = useRef();
  const meshRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false); // keep in sync for global listener
  const [isHovered, setIsHovered] = useState(false);
  const dragPlane = useRef(new THREE.Plane());
  const dragOffset = useRef(new THREE.Vector3());
  const { camera, gl } = useThree();
  const velocity = useRef(new THREE.Vector3());
  const prevPos = useRef(new THREE.Vector3());
  const currentPos = useRef(new THREE.Vector3());
  const isHoveredRef = useRef(false);

  // Black letter color
  const color = '#111111';

  const resetPosition = useCallback(() => {
    if (rigidBodyRef.current) {
      rigidBodyRef.current.setTranslation(
        { x: position[0], y: position[1], z: position[2] },
        true
      );
      rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
      rigidBodyRef.current.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
    }
  }, [position]);

  useEffect(() => {
    resetPosition();
  }, [resetKey, resetPosition]);

  // Global pointerup: release drag if mouse button released anywhere on canvas
  useEffect(() => {
    const onGlobalUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      setIsDragging(false);
      gl.domElement.style.cursor = isHoveredRef.current ? 'grab' : 'auto';
      if (rigidBodyRef.current) {
        rigidBodyRef.current.setGravityScale(1, true);
        const throwVel = velocity.current.clone().multiplyScalar(8);
        const maxSpeed = 20;
        if (throwVel.length() > maxSpeed) throwVel.setLength(maxSpeed);
        rigidBodyRef.current.setLinvel({ x: throwVel.x, y: throwVel.y, z: throwVel.z }, true);
        rigidBodyRef.current.setAngvel(
          { x: (Math.random() - 0.5) * 10, y: (Math.random() - 0.5) * 10, z: (Math.random() - 0.5) * 10 },
          true
        );
      }
    };
    gl.domElement.addEventListener('pointerup', onGlobalUp);
    return () => gl.domElement.removeEventListener('pointerup', onGlobalUp);
  }, [gl]);

  const handlePointerDown = useCallback((e) => {
    e.stopPropagation();
    isDraggingRef.current = true;
    setIsDragging(true);
    gl.domElement.style.cursor = 'grabbing';

    if (rigidBodyRef.current) {
      rigidBodyRef.current.setGravityScale(0, true);
      rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }

    const letterPos = new THREE.Vector3(...position);
    if (rigidBodyRef.current) {
      const t = rigidBodyRef.current.translation();
      letterPos.set(t.x, t.y, t.z);
    }
    dragPlane.current.setFromNormalAndCoplanarPoint(
      camera.getWorldDirection(new THREE.Vector3()).negate(),
      letterPos
    );

    const ray = new THREE.Raycaster();
    ray.setFromCamera(e.pointer, camera);
    const intersect = new THREE.Vector3();
    ray.ray.intersectPlane(dragPlane.current, intersect);
    dragOffset.current.copy(intersect).sub(letterPos);
    prevPos.current.copy(letterPos);
    currentPos.current.copy(letterPos);
  }, [camera, gl, position]);

  const handlePointerUp = useCallback((e) => {
    // handled by global listener — just stop propagation
    e.stopPropagation();
  }, []);

  useFrame(({ pointer, camera: cam }) => {
    if (isDragging && rigidBodyRef.current) {
      const ray = new THREE.Raycaster();
      ray.setFromCamera(pointer, cam);
      const intersect = new THREE.Vector3();
      ray.ray.intersectPlane(dragPlane.current, intersect);
      const target = intersect.sub(dragOffset.current);

      prevPos.current.copy(currentPos.current);
      currentPos.current.copy(target);
      velocity.current.subVectors(currentPos.current, prevPos.current);
      rigidBodyRef.current.setTranslation(
        { x: target.x, y: target.y, z: target.z },
        true
      );
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={position}
      colliders="cuboid"
      restitution={0.4}
      friction={0.6}
      mass={1}
      linearDamping={0.2}
      angularDamping={0.3}
    >
      <Text3D
        ref={meshRef}
        font="/fonts/helvetiker_bold.typeface.json"
        size={1.1}
        height={0.525}
        curveSegments={8}
        bevelEnabled
        bevelThickness={0.06}
        bevelSize={0.03}
        bevelOffset={0}
        bevelSegments={4}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerEnter={() => { isHoveredRef.current = true; setIsHovered(true); gl.domElement.style.cursor = isDragging ? 'grabbing' : 'grab'; }}
        onPointerLeave={() => { isHoveredRef.current = false; setIsHovered(false); if (!isDragging) gl.domElement.style.cursor = 'auto'; }}
        center
      >
        {char}
        <meshStandardMaterial
          color={isDragging ? '#444444' : isHovered ? '#333333' : color}
          roughness={0.3}
          metalness={0.1}
          envMapIntensity={1.0}
        />
      </Text3D>
    </RigidBody>
  );
}

// Floor and walls (invisible colliders)
function Room() {
  return (
    <>
      {/* Floor */}
      <RigidBody type="fixed" position={[0, -1.92, 0]}>
        <CuboidCollider args={[50, 0.5, 50]} />
      </RigidBody>
      {/* Ceiling */}
      <RigidBody type="fixed" position={[0, 12, 0]}>
        <CuboidCollider args={[50, 0.5, 50]} />
      </RigidBody>
      {/* Left wall */}
      <RigidBody type="fixed" position={[-20, 0, 0]}>
        <CuboidCollider args={[0.5, 30, 50]} />
      </RigidBody>
      {/* Right wall */}
      <RigidBody type="fixed" position={[20, 0, 0]}>
        <CuboidCollider args={[0.5, 30, 50]} />
      </RigidBody>
      {/* Back wall */}
      <RigidBody type="fixed" position={[0, 0, -8]}>
        <CuboidCollider args={[50, 30, 0.5]} />
      </RigidBody>
      {/* Front wall (behind camera) */}
      <RigidBody type="fixed" position={[0, 0, 14]}>
        <CuboidCollider args={[50, 30, 0.5]} />
      </RigidBody>
      {/* Shelf on back wall — JAYANT sits here. 2-unit deep so letters can't fall forward */}
      <RigidBody type="fixed" position={[0, 1.0, -0.2]}>
        <CuboidCollider args={[4.55, 0.1, 2.0]} />
        {/* Visible wooden shelf */}
        <mesh>
          <boxGeometry args={[9.1, 0.18, 4.0]} />
          <meshStandardMaterial color="#7a5028" roughness={0.7} metalness={0.05} />
        </mesh>
      </RigidBody>
    </>
  );
}

// Calculate letter positions for two lines: JAYANT / MAHESHWARI
function getLetterPositions(word, yOffset, totalWidth) {
  const letterSpacing = 1.4;
  const wordWidth = (word.length - 1) * letterSpacing;
  const startX = -wordWidth / 2;
  return word.split('').map((char, i) => ({
    char,
    position: [startX + i * letterSpacing, yOffset, 0],
  }));
}

// Floor top surface at y=-1.42; letter half-height ~0.6 → center at -0.82
const LINE1 = getLetterPositions('JAYANT', 1.72);     // resting on shelf
const LINE2 = getLetterPositions('MAHESHWARI', -0.82); // resting on floor
const ALL_LETTERS = [...LINE1, ...LINE2];





function Scene({ resetKey }) {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-5, 5, -3]} intensity={0.5} color="#ffccd5" />
      <pointLight position={[0, 8, 3]} intensity={0.8} color="#ffd6de" />
      <Environment preset="city" />

      <Physics gravity={[0, -9.8, 0]}>
        <Room />
        {ALL_LETTERS.map((l, i) => (
          <PhysicsLetter
            key={`${i}-${l.char}`}
            char={l.char}
            position={l.position}
            index={i}
            resetKey={resetKey}
          />
        ))}
      </Physics>
    </>
  );
}


export default function Home() {
  const [resetKey, setResetKey] = useState(0);

  return (
    <div style={{ paddingTop: 56, height: '100vh', width: '100%', overflow: 'hidden', position: 'relative' }}>
      <section
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          background: 'linear-gradient(135deg, #f5d0c5 0%, #b76e79 100%)',
        }}
      >
        {/* Subtle grid lines background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(144,144,184,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(144,144,184,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Three.js Canvas */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          <Canvas
            camera={{ position: [0, 2, 10], fov: 50 }}
            shadows
            gl={{ antialias: true, alpha: true }}
            style={{ background: 'transparent' }}
          >
            <Suspense fallback={null}>
              <Scene resetKey={resetKey} />
            </Suspense>
          </Canvas>
        </div>

        {/* UI overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <p
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '0.72rem',
              color: '#3a2226',
              opacity: 0.7,
              letterSpacing: '0.08em',
              margin: 0,
              textAlign: 'center',
            }}
          >
            CS student at the University of Maryland building AI systems, developer tools, and interactive web apps. I've worked on machine learning at JHU APL and Booz Allen, and I like creating software that is useful, fast, and well designed.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => setResetKey(k => k + 1)}
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '0.7rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#3a2226',
                textDecoration: 'none',
                background: 'rgba(255,240,242,0.6)',
                border: '1px solid rgba(183,110,121,0.4)',
                padding: '10px 22px',
                borderRadius: 4,
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { e.target.style.background = 'rgba(255,240,242,0.85)'; }}
              onMouseLeave={e => { e.target.style.background = 'rgba(255,240,242,0.6)'; }}
            >
              ↺ Reset
            </button>

            <Link
              to="/projects"
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '0.7rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#e8e8f4',
                textDecoration: 'none',
                background: 'rgba(20,20,20,0.8)',
                border: '1px solid #3f3f46',
                padding: '10px 22px',
                borderRadius: 4,
                transition: 'background 0.15s, border-color 0.15s',
              }}
              onMouseEnter={e => { e.target.style.background = 'rgba(20,20,20,0.95)'; }}
              onMouseLeave={e => { e.target.style.background = 'rgba(20,20,20,0.8)'; }}
            >
              View Projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
