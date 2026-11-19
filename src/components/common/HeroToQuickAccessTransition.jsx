import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ORBIT_ITEMS } from '../../data/orbitItems';

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

export default function HeroToQuickAccessTransition({ reducedMotion = false }) {
  const layerRef = useRef(null);
  const ghostRefs = useRef([]);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || reducedMotion) return undefined;

    const heroEl = document.querySelector('#top');
    const workflowEl = document.querySelector('#workflow');
    const heroOrigin = document.querySelector('[data-hero-orbit-origin]');
    if (!heroEl || !workflowEl || !heroOrigin) return undefined;

    let startSnapshots = [];

    const captureHeroSnapshots = () => {
      const cards = document.querySelectorAll('[data-hero-orbit-card]');
      startSnapshots = Array.from(cards).map((card, idx) => {
        const r = card.getBoundingClientRect();
        return {
          x: r.left + r.width / 2,
          y: r.top + r.height / 2,
          w: r.width || 125,
          h: r.height || 145,
          angle: (idx % 2 === 0 ? 1 : -1) * (3 + (idx % 4) * 2),
          arcAmp: (idx % 2 === 0 ? 1 : -1) * (38 + (idx % 4) * 20),
          stagger: (idx / ORBIT_ITEMS.length) * 0.14,
        };
      });
    };

    captureHeroSnapshots();

    const proxy = { progress: 0 };

    const updateTransition = () => {
      const p = proxy.progress;
      const previewEl = document.querySelector('[data-quick-access-preview]');
      const cityBg = document.querySelector('[data-quick-access-city-bg]');
      const collectedGrid = document.querySelector('[data-collected-grid]');
      const slotEls = document.querySelectorAll('[data-collected-slot]');

      if (p <= 0.01) {
        layer.style.display = 'none';
        heroOrigin.style.opacity = '1';
        if (cityBg) cityBg.style.opacity = '0.88';
        if (collectedGrid) collectedGrid.style.opacity = '0';
        captureHeroSnapshots();
        return;
      }

      // Fade out Abu Dhabi city photo smoothly as collection begins and keep it hidden
      if (cityBg) {
        const bgFade = clamp(0.88 * (1 - p / 0.35), 0, 0.88);
        cityBg.style.opacity = bgFade.toFixed(3);
      }

      if (p >= 0.995) {
        layer.style.display = 'none';
        heroOrigin.style.opacity = '0';
        if (collectedGrid) collectedGrid.style.opacity = '1';
        if (cityBg) cityBg.style.opacity = '0';
        return;
      }

      layer.style.display = 'block';

      // Smoothly crossfade out Hero's live orbit
      const heroFade = clamp(1 - (p - 0.01) / 0.06, 0, 1);
      heroOrigin.style.opacity = heroFade.toFixed(3);

      // Reveal settled grid cleanly near final alignment
      if (collectedGrid) {
        const gridReveal = clamp((p - 0.84) / 0.14, 0, 1);
        collectedGrid.style.opacity = gridReveal.toFixed(3);
      }

      const fallbackRect = previewEl
        ? previewEl.getBoundingClientRect()
        : {
            left: window.innerWidth * 0.08,
            top: window.innerHeight * 0.22,
            width: window.innerWidth * 0.44,
            height: window.innerHeight * 0.44,
          };

      const isMobile = window.innerWidth < 576;
      const isTablet = window.innerWidth < 992;
      const maxVisibleSlots = isMobile ? 6 : isTablet ? 8 : 12;

      ghostRefs.current.forEach((ghost, idx) => {
        const snap = startSnapshots[idx];
        if (!ghost || !snap) return;

        const localT = clamp((p - snap.stagger) / (1 - snap.stagger), 0, 1);
        // Smoothstep with gentle landing ease
        const ease = localT * localT * (3 - 2 * localT);

        // Align directly to the actual destination slot inside Quick Access preview
        const slotEl = slotEls[idx % maxVisibleSlots];
        let destX;
        let destY;
        let targetW;

        if (slotEl && previewEl) {
          const sr = slotEl.getBoundingClientRect();
          destX = sr.left + sr.width / 2;
          destY = sr.top + sr.height / 2;
          targetW = sr.width;
        } else {
          const cols = 4;
          const rows = 3;
          const col = idx % cols;
          const row = Math.floor(idx / cols) % rows;
          destX = fallbackRect.left + ((col + 0.5) / cols) * fallbackRect.width;
          destY = fallbackRect.top + ((row + 0.5) / rows) * (fallbackRect.height - 52);
          targetW = (fallbackRect.width - 48) / cols;
        }

        const dx = destX - snap.x;
        const dy = destY - snap.y;
        const dist = Math.hypot(dx, dy) || 1;
        const nx = -dy / dist;
        const ny = dx / dist;
        const arc = Math.sin(ease * Math.PI) * snap.arcAmp;

        const curX = snap.x + dx * ease + nx * arc;
        const curY = snap.y + dy * ease + ny * arc;

        const targetScale = clamp(targetW / snap.w, 0.28, 0.65);
        const curScale = 1 + (targetScale - 1) * ease;
        const curRot = snap.angle * (1 - ease);
        const curTiltX = (1 - ease) * 8;

        // Extra cards beyond maxVisibleSlots fade out smoothly mid-flight to avoid stacking
        const extraFade = idx >= maxVisibleSlots ? clamp(1 - (p - 0.35) / 0.35, 0, 1) : 1;
        const handoffFade = p > 0.86 ? clamp(1 - (p - 0.86) / 0.13, 0, 1) : 1;
        const enterFade = clamp((p - 0.01) / 0.04, 0, 1);

        ghost.style.width = `${snap.w}px`;
        ghost.style.height = `${snap.h}px`;
        ghost.style.transform = `perspective(1000px) translate3d(${(curX - snap.w / 2).toFixed(
          1
        )}px, ${(curY - snap.h / 2).toFixed(1)}px, 0) scale(${curScale.toFixed(
          3
        )}) rotate(${curRot.toFixed(2)}deg) rotateX(${curTiltX.toFixed(2)}deg)`;
        ghost.style.opacity = (extraFade * handoffFade * enterFade).toFixed(3);
      });
    };

    const tween = gsap.to(proxy, {
      progress: 1,
      ease: 'none',
      onUpdate: updateTransition,
      scrollTrigger: {
        trigger: heroEl,
        start: 'top top',
        endTrigger: workflowEl,
        end: 'top top',
        scrub: 1.2,
        invalidateOnRefresh: true,
        onRefresh: (self) => {
          if (self.progress <= 0.02) captureHeroSnapshots();
        },
      },
    });

    const onResize = () => {
      if (proxy.progress <= 0.02) captureHeroSnapshots();
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      tween.scrollTrigger?.kill();
      tween.kill();
      heroOrigin.style.opacity = '1';
      const cityBg = document.querySelector('[data-quick-access-city-bg]');
      const collectedGrid = document.querySelector('[data-collected-grid]');
      if (cityBg) cityBg.style.opacity = '0.88';
      if (collectedGrid) collectedGrid.style.opacity = '0';
      if (layer) layer.style.display = 'none';
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div ref={layerRef} className="hero-transition-layer" aria-hidden="true">
      {ORBIT_ITEMS.map((item, idx) => (
        <div
          key={item.label}
          ref={(el) => {
            ghostRefs.current[idx] = el;
          }}
          className="hero-transition-card"
        >
          <img
            src={item.img}
            alt=""
            draggable="false"
            className="hero-transition-img"
          />
        </div>
      ))}
    </div>
  );
}
