'use client';

import { useState, useRef, Component, ErrorInfo, ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Dragon from '@/components/Dragon';
import { dragonThemes } from '@/lib/themes';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900 text-white p-8 z-50 overflow-auto">
          <div>
            <h1 className="text-2xl font-bold mb-4">Something went wrong.</h1>
            <pre className="bg-black p-4 rounded text-sm whitespace-pre-wrap">
              {this.state.error?.toString()}
              {'\n\n'}
              {this.state.error?.stack}
            </pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function Home() {
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const bgRef = useRef<HTMLDivElement>(null);
  
  const theme = dragonThemes[currentThemeIndex];

  useGSAP(() => {
    if (bgRef.current) {
      // Animate CSS variables instead of the background string directly
      gsap.to(bgRef.current, {
        '--bg-from': theme.bgFrom,
        '--bg-to': theme.bgTo,
        duration: 1.5,
        ease: 'power2.inOut',
        onUpdate: function() {
          if (bgRef.current) {
            const from = gsap.getProperty(bgRef.current, '--bg-from');
            const to = gsap.getProperty(bgRef.current, '--bg-to');
            bgRef.current.style.background = `linear-gradient(to bottom, ${from}, ${to})`;
          }
        }
      });
    }
  }, [theme]);

  return (
    <main 
      ref={bgRef} 
      className="w-full h-screen overflow-hidden relative" 
      style={{ 
        '--bg-from': dragonThemes[0].bgFrom, 
        '--bg-to': dragonThemes[0].bgTo,
        background: `linear-gradient(to bottom, var(--bg-from), var(--bg-to))` 
      } as React.CSSProperties}
    >
      <ErrorBoundary>
        <Canvas shadows camera={{ position: [4, 2, 6], fov: 45 }}>
          <fog attach="fog" args={[theme.bgTo, 5, 25]} />
          <ambientLight intensity={0.6} />
          
          {/* Main Directional Light */}
          <directionalLight
            position={[-5, 5, 5]}
            intensity={1.5}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0001}
          >
            <orthographicCamera attach="shadow-camera" args={[-4, 4, 4, -4, 0.1, 20]} />
          </directionalLight>
          
          {/* Fill Light */}
          <directionalLight position={[5, 3, -5]} intensity={0.4} />
          
          {/* Rim Light */}
          <directionalLight position={[0, 5, -5]} intensity={0.5} />

          <Dragon theme={theme} />

          {/* Invisible Shadow Catcher */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <shadowMaterial transparent opacity={0.4} />
          </mesh>

          <OrbitControls
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
            minDistance={3}
            maxDistance={15}
            target={[0, 1, 0]}
          />
        </Canvas>
      </ErrorBoundary>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-10">
        {dragonThemes.map((t, i) => (
          <button
            key={t.id}
            onClick={() => setCurrentThemeIndex(i)}
            className={`w-12 h-12 rounded-full border-4 transition-all duration-300 hover:scale-110 ${currentThemeIndex === i ? 'scale-110 shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'shadow-lg'}`}
            style={{
              background: `linear-gradient(135deg, ${t.colors.blue} 50%, ${t.colors.teal} 50%)`,
              borderColor: currentThemeIndex === i ? 'white' : t.colors.darkBlue,
            }}
          />
        ))}
      </div>
    </main>
  );
}
