import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { EYEBROW_PHRASES } from '../../data/siteContent';

function createCardFaceTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext('2d');

  // Brushed dark titanium base
  const grad = ctx.createLinearGradient(0, 0, 1024, 640);
  grad.addColorStop(0, '#14171c');
  grad.addColorStop(0.45, '#1e232a');
  grad.addColorStop(1, '#0c0e12');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 640);

  // Subtle horizontal brushed metal lines
  ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
  for (let y = 0; y < 640; y += 3) {
    ctx.fillRect(0, y, 1024, 1);
  }

  // Diagonal specular sheen
  const sheen = ctx.createLinearGradient(120, 0, 820, 640);
  sheen.addColorStop(0, 'rgba(255,255,255,0)');
  sheen.addColorStop(0.5, 'rgba(225,229,229,0.08)');
  sheen.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, 1024, 640);

  // MOTO wordmark top-left
  ctx.fillStyle = '#e1e5e5';
  ctx.font = '500 44px "Plus Jakarta Sans", Inter, sans-serif';
  ctx.fillText('MOTO', 64, 98);

  // Subtle EMV metallic chip
  ctx.strokeStyle = 'rgba(225, 229, 229, 0.45)';
  ctx.lineWidth = 2;
  ctx.fillStyle = 'rgba(163, 175, 189, 0.16)';
  ctx.beginPath();
  ctx.roundRect(68, 250, 112, 82, 12);
  ctx.fill();
  ctx.stroke();

  // Chip contact lines
  ctx.beginPath();
  ctx.moveTo(68, 291);
  ctx.lineTo(180, 291);
  ctx.moveTo(124, 250);
  ctx.lineTo(124, 332);
  ctx.stroke();

  // Bottom-right Visa Infinite badge
  ctx.fillStyle = 'rgba(225, 229, 229, 0.85)';
  ctx.font = '600 30px "Plus Jakarta Sans", Inter, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('VISA', 956, 548);
  ctx.fillStyle = 'rgba(163, 175, 189, 0.72)';
  ctx.font = '500 18px "Plus Jakarta Sans", Inter, sans-serif';
  ctx.fillText('INFINITE', 956, 578);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function createTubeTileTexture(seed) {
  const canvas = document.createElement('canvas');
  canvas.width = 192;
  canvas.height = 288;
  const ctx = canvas.getContext('2d');

  const palettes = [
    ['#161b24', '#3a4b63', '#8ca0ba'],
    ['#1a1715', '#4f4036', '#a89280'],
    ['#101816', '#2b473e', '#7ca396'],
    ['#181820', '#42425c', '#9999bd'],
  ];
  const pal = palettes[seed % palettes.length];
  const g = ctx.createLinearGradient(0, 0, 192, 288);
  g.addColorStop(0, pal[0]);
  g.addColorStop(0.55, pal[1]);
  g.addColorStop(1, pal[2]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 192, 288);

  // Subtle architectural / horizon motif
  ctx.fillStyle = 'rgba(8, 8, 8, 0.35)';
  ctx.beginPath();
  ctx.arc(96, 175, 58, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(225, 229, 229, 0.16)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(10, 10, 172, 268);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export default function CardSection({ onOpenAccess, reducedMotion = false }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const [eyebrowIdx, setEyebrowIdx] = useState(0);
  const eyebrowRef = useRef(null);

  // Eyebrow phrase cycling
  useEffect(() => {
    if (reducedMotion) return undefined;
    const interval = setInterval(() => {
      if (!eyebrowRef.current) return;
      gsap.to(eyebrowRef.current, {
        opacity: 0,
        yPercent: -40,
        filter: 'blur(6px)',
        duration: 0.45,
        ease: 'power2.in',
        onComplete: () => {
          setEyebrowIdx((prev) => (prev + 1) % EYEBROW_PHRASES.length);
          if (!eyebrowRef.current) return;
          gsap.fromTo(
            eyebrowRef.current,
            { opacity: 0, yPercent: 40, filter: 'blur(6px)' },
            { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.55, ease: 'power2.out' }
          );
        },
      });
    }, 2800);
    return () => clearInterval(interval);
  }, [reducedMotion]);

  // Three.js 3D Metallic Card + Cylindrical Tube Scene
  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return undefined;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(canvas.clientWidth || window.innerWidth, canvas.clientHeight || window.innerHeight, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      36,
      (canvas.clientWidth || window.innerWidth) / (canvas.clientHeight || window.innerHeight),
      0.1,
      100
    );
    camera.position.set(0, 0, 9.5);

    // Studio lighting for metallic card
    const ambient = new THREE.AmbientLight('#8fa0b5', 0.9);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight('#ffffff', 2.4);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight('#47649e', 1.8);
    rimLight.position.set(-5, -3, 3);
    scene.add(rimLight);

    // 3D Rounded Card Geometry
    const cardW = 3.4;
    const cardH = 2.14;
    const radius = 0.16;
    const shape = new THREE.Shape();
    shape.moveTo(-cardW / 2 + radius, -cardH / 2);
    shape.lineTo(cardW / 2 - radius, -cardH / 2);
    shape.quadraticCurveTo(cardW / 2, -cardH / 2, cardW / 2, -cardH / 2 + radius);
    shape.lineTo(cardW / 2, cardH / 2 - radius);
    shape.quadraticCurveTo(cardW / 2, cardH / 2, cardW / 2 - radius, cardH / 2);
    shape.lineTo(-cardW / 2 + radius, cardH / 2);
    shape.quadraticCurveTo(-cardW / 2, cardH / 2, -cardW / 2, cardH / 2 - radius);
    shape.lineTo(-cardW / 2, -cardH / 2 + radius);
    shape.quadraticCurveTo(-cardW / 2, -cardH / 2, -cardW / 2 + radius, -cardH / 2);

    const cardGeo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.045,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.015,
      bevelSegments: 4,
    });
    cardGeo.center();

    const metalMat = new THREE.MeshStandardMaterial({
      color: '#1b2026',
      metalness: 0.88,
      roughness: 0.26,
    });

    const cardMesh = new THREE.Mesh(cardGeo, metalMat);

    // Card front face with texture
    const cardFaceTex = createCardFaceTexture();
    const faceGeo = new THREE.PlaneGeometry(cardW - 0.04, cardH - 0.04);
    const faceMat = new THREE.MeshStandardMaterial({
      map: cardFaceTex,
      metalness: 0.72,
      roughness: 0.28,
      transparent: true,
    });
    const faceMesh = new THREE.Mesh(faceGeo, faceMat);
    faceMesh.position.z = 0.039;

    const cardGroup = new THREE.Group();
    cardGroup.add(cardMesh);
    cardGroup.add(faceMesh);
    cardGroup.rotation.set(0.18, -0.32, 0.04);
    scene.add(cardGroup);

    // Cylindrical Tube of Lifestyle Tiles around the Card
    const tubeGroup = new THREE.Group();
    const rows = 4;
    const cols = 14;
    const tubeRadius = 11.2;
    const tileGeo = new THREE.PlaneGeometry(1.7, 2.55);
    const tileTextures = Array.from({ length: 4 }, (_, i) => createTubeTileTexture(i));
    const tileMaterials = tileTextures.map(
      (tex) =>
        new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true,
          opacity: 0.42,
          side: THREE.DoubleSide,
        })
    );

    const rowGroups = [];
    for (let r = 0; r < rows; r += 1) {
      const rg = new THREE.Group();
      const y = (r - (rows - 1) / 2) * 3.4;
      for (let c = 0; c < cols; c += 1) {
        const angle = (c / cols) * Math.PI * 2;
        const mesh = new THREE.Mesh(tileGeo, tileMaterials[(r + c) % tileMaterials.length]);
        mesh.position.set(Math.sin(angle) * tubeRadius, y, Math.cos(angle) * tubeRadius - 4);
        mesh.lookAt(0, y, -4);
        rg.add(mesh);
      }
      tubeGroup.add(rg);
      rowGroups.push(rg);
    }
    scene.add(tubeGroup);

    // Pointer tilt interaction
    const pointer = { x: 0, y: 0 };
    const onPointerMove = (e) => {
      const rect = section.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    section.addEventListener('pointermove', onPointerMove, { passive: true });

    const onResize = () => {
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener('resize', onResize);

    // Scroll-linked card & tube motion
    const scrollState = { progress: 0 };
    const ctx = gsap.context(() => {
      if (reducedMotion) return;
      gsap.to(scrollState, {
        progress: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, sectionRef);

    let rafId = 0;
    let last = performance.now();
    const renderLoop = (now) => {
      const dt = Math.min((now - last) * 0.001, 0.05);
      last = now;

      if (!reducedMotion) {
        const targetRotY = -0.35 + scrollState.progress * 0.75 + pointer.x * 0.25;
        const targetRotX = 0.16 - scrollState.progress * 0.22 - pointer.y * 0.18;
        cardGroup.rotation.y += (targetRotY - cardGroup.rotation.y) * 0.08;
        cardGroup.rotation.x += (targetRotX - cardGroup.rotation.x) * 0.08;
        cardGroup.position.y = Math.sin(now * 0.0012) * 0.08;

        rowGroups.forEach((rg, idx) => {
          const dir = idx % 2 === 0 ? 1 : -1;
          rg.rotation.y += dt * 0.06 * dir;
        });
        tubeGroup.rotation.y = scrollState.progress * 0.55;
      }

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(renderLoop);
    };
    rafId = requestAnimationFrame(renderLoop);

    return () => {
      ctx.revert();
      section.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      if (rafId) cancelAnimationFrame(rafId);
      cardGeo.dispose();
      faceGeo.dispose();
      tileGeo.dispose();
      metalMat.dispose();
      faceMat.dispose();
      cardFaceTex.dispose();
      tileTextures.forEach((t) => t.dispose());
      tileMaterials.forEach((m) => m.dispose());
      renderer.dispose();
    };
  }, [reducedMotion]);

  return (
    <section id="card" ref={sectionRef} className="card">
      <div className="card_canvas_wrap">
        <canvas
          ref={canvasRef}
          id="card_canvas"
          aria-label="3D metallic Moto Visa Infinite card surrounded by rotating lifestyle tiles"
        />
      </div>

      <div className="card_content">
        <div className="card_eyebrow_wrap">
          <span ref={eyebrowRef} className="card_eyebrow">
            {EYEBROW_PHRASES[eyebrowIdx]}
          </span>
        </div>

        <h2 className="text-style-h2 card_heading">THE CARD IS ONLY THE BEGINNING</h2>

        <div className="card_cta_wrap">
          <button type="button" className="button" onClick={onOpenAccess}>
            Apply for Access
          </button>
        </div>
      </div>
    </section>
  );
}
