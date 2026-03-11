import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const HeartbeatECG: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x030308, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 2, 0.1, 100);
    camera.position.set(0, 0, 5);

    // ---- ECG wave shape function ----
    const ecgShape = (t: number): number => {
      const x = t % 1;
      // P wave
      if (x > 0.05 && x < 0.15) return 0.15 * Math.sin((x - 0.05) * Math.PI / 0.1);
      // Q dip
      if (x >= 0.28 && x < 0.32) return -0.15 * Math.sin((x - 0.28) * Math.PI / 0.04);
      // R peak (sharp)
      if (x >= 0.32 && x < 0.36) return 0.9 * Math.sin((x - 0.32) * Math.PI / 0.04);
      // S dip
      if (x >= 0.36 && x < 0.40) return -0.25 * Math.sin((x - 0.36) * Math.PI / 0.04);
      // T wave
      if (x > 0.50 && x < 0.65) return 0.2 * Math.sin((x - 0.50) * Math.PI / 0.15);
      return 0;
    };

    // ---- Build ECG line geometry ----
    const totalPoints = 300;
    const linePositions = new Float32Array(totalPoints * 3);

    const updateECGLine = (offset: number) => {
      for (let i = 0; i < totalPoints; i++) {
        const t = i / totalPoints;
        const x = (t - 0.5) * 10;
        const y = ecgShape(t + offset);
        linePositions[i * 3] = x;
        linePositions[i * 3 + 1] = y;
        linePositions[i * 3 + 2] = 0;
      }
    };
    updateECGLine(0);

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    // Main neon line
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.9,
    });
    const ecgLine = new THREE.Line(lineGeo, lineMat);
    scene.add(ecgLine);

    // Glow line
    const glowGeo = lineGeo.clone();
    const glowMat = new THREE.LineBasicMaterial({
      color: 0x2563eb,
      transparent: true,
      opacity: 0.4,
    });
    const glowLine = new THREE.Line(glowGeo, glowMat);
    glowLine.position.z = -0.05;
    glowLine.scale.y = 1.3;
    scene.add(glowLine);

    // Subtle violet glow layer
    const violetGeo = lineGeo.clone();
    const violetMat = new THREE.LineBasicMaterial({
      color: 0xa78bfa,
      transparent: true,
      opacity: 0.15,
    });
    const violetLine = new THREE.Line(violetGeo, violetMat);
    violetLine.position.z = -0.1;
    violetLine.scale.y = 1.6;
    scene.add(violetLine);

    // ---- Tracking dot ----
    const dotGeo = new THREE.SphereGeometry(0.06, 16, 16);
    const dotMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa });
    const dot = new THREE.Mesh(dotGeo, dotMat);
    scene.add(dot);

    // ---- Horizontal grid lines ----
    const gridMat = new THREE.LineBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.04,
    });
    for (let i = -3; i <= 3; i++) {
      const pts = [new THREE.Vector3(-6, i * 0.3, -0.2), new THREE.Vector3(6, i * 0.3, -0.2)];
      const gGeo = new THREE.BufferGeometry().setFromPoints(pts);
      scene.add(new THREE.Line(gGeo, gridMat));
    }

    // ---- Particles ----
    const pCount = 80;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(pCount * 3);
    const pSpeeds = new Float32Array(pCount);
    for (let i = 0; i < pCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 10;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 2;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
      pSpeeds[i] = 0.002 + Math.random() * 0.005;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x60a5fa,
      size: 0.025,
      transparent: true,
      opacity: 0.3,
    });
    const particleSystem = new THREE.Points(pGeo, pMat);
    scene.add(particleSystem);

    // ---- Resize ----
    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // ---- Animate with performance.now() for smoother timing ----
    let animId: number;
    let startTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) * 0.0003;

      // Scroll the ECG wave
      updateECGLine(elapsed);
      lineGeo.attributes.position.needsUpdate = true;

      // Update glow layers to match
      const posArr = lineGeo.attributes.position.array as Float32Array;
      const glowArr = glowGeo.attributes.position.array as Float32Array;
      const violetArr = violetGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < posArr.length; i++) {
        glowArr[i] = posArr[i];
        violetArr[i] = posArr[i];
      }
      glowGeo.attributes.position.needsUpdate = true;
      violetGeo.attributes.position.needsUpdate = true;

      // Move tracking dot
      const dotIdx = Math.floor((elapsed * 80) % totalPoints);
      dot.position.x = posArr[dotIdx * 3];
      dot.position.y = posArr[dotIdx * 3 + 1];
      dot.position.z = 0.05;

      // Drift particles
      const pp = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < pCount; i++) {
        pp[i * 3] += pSpeeds[i];
        if (pp[i * 3] > 5) pp[i * 3] = -5;
      }
      pGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      glowGeo.dispose();
      glowMat.dispose();
      violetGeo.dispose();
      violetMat.dispose();
      dotGeo.dispose();
      dotMat.dispose();
      pGeo.dispose();
      pMat.dispose();
    };
  }, []);

  return (
    <section className="relative h-[300px] md:h-[420px] overflow-hidden bg-[#030308]">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 text-center z-10 pointer-events-none">
        <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent tracking-tight mb-1">
          Au c\u0153ur de votre sant\u00e9
        </h3>
        <p className="text-xs sm:text-sm text-slate-400">Une technologie au service du vivant</p>
      </div>
    </section>
  );
};

export default HeartbeatECG;
