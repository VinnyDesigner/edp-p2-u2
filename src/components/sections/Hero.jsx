import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Globe, ArrowUpRight, Database } from 'lucide-react';
import { ORBIT_ITEMS } from '../../data/orbitItems';

export default function Hero({ onOpenAccess, reducedMotion = false }) {
  const heroRef = useRef(null);
  const orbitStageRef = useRef(null);
  const cardRefs = useRef([]);
  const mistRefs = useRef([]);
  const centerRef = useRef(null);
  const h1Ref = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);

  // Orbit physics + drag inertia + scroll expansion
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return undefined;

    const total = ORBIT_ITEMS.length;
    const state = {
      angle: Math.PI * 0.28,
      velocity: 0.0014,
      dragVelocity: 0,
      scrollProgress: 0,
      dragging: false,
      lastX: 0,
    };

    const positionCards = () => {
      const w = hero.clientWidth || window.innerWidth;
      const h = hero.clientHeight || window.innerHeight;
      const rx = Math.min(w * 0.45, 650) * (1 + state.scrollProgress * 0.35);
      const ry = Math.min(h * 0.34, 285) * (1 + state.scrollProgress * 0.25);
      const orbitOffsetY = h * 0.07;

      cardRefs.current.forEach((el, idx) => {
        if (!el) return;
        const theta = state.angle + (idx / total) * Math.PI * 2;
        const cos = Math.cos(theta);
        const sin = Math.sin(theta);

        // Depth: front bottom (+1) vs back top (-1)
        const depth = (sin + 1) * 0.5; // 0..1
        const x = cos * rx;
        const y = sin * ry + orbitOffsetY;
        const scale = 0.42 + Math.pow(depth, 1.35) * 0.62;
        const zIndex = Math.round(10 + depth * 90);
        const tilt = cos * -3.5;

        // Keep foreground cards 100% crisp & opaque; softly mist far-back top cards
        const scrollFade = 1 - state.scrollProgress * 0.9;
        el.style.transform = `translate3d(calc(${x.toFixed(1)}px - 50%), calc(${y.toFixed(
          1
        )}px - 50%), 0) scale(${scale.toFixed(3)}) rotate(${tilt.toFixed(2)}deg)`;
        el.style.opacity = `${Math.max(0, scrollFade).toFixed(3)}`;
        el.style.zIndex = `${zIndex}`;

        const mistEl = mistRefs.current[idx];
        if (mistEl) {
          const mistAmount = Math.max(0, (1 - depth) * 0.72);
          mistEl.style.opacity = mistAmount.toFixed(3);
        }
      });
    };

    let rafId = 0;
    const tick = () => {
      if (!reducedMotion) {
        if (!state.dragging) {
          state.angle += state.velocity + state.dragVelocity;
          state.dragVelocity *= 0.94;
        }
      }
      positionCards();
      if (!reducedMotion) {
        rafId = requestAnimationFrame(tick);
      }
    };

    positionCards();
    if (!reducedMotion) {
      rafId = requestAnimationFrame(tick);
    }

    const onPointerDown = (e) => {
      if (e.target.closest('button, a')) return;
      state.dragging = true;
      state.lastX = e.clientX;
      setIsDragging(true);
    };

    const onPointerMove = (e) => {
      if (!state.dragging) return;
      const dx = e.clientX - state.lastX;
      state.lastX = e.clientX;
      const deltaAngle = dx * 0.003;
      state.angle += deltaAngle;
      state.dragVelocity = deltaAngle * 0.85;
    };

    const onPointerUp = () => {
      if (!state.dragging) return;
      state.dragging = false;
      setIsDragging(false);
    };

    const stage = orbitStageRef.current;
    stage?.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('resize', positionCards);

    // GSAP Entrance & Scroll Scrub into EarthSection
    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set([h1Ref.current, subRef.current, ctaRef.current].filter(Boolean), {
          opacity: 1,
          y: 0,
        });
        return;
      }

      gsap.set(h1Ref.current, { y: 24, opacity: 0, filter: 'blur(6px)' });
      gsap.set([subRef.current, ctaRef.current], { y: 18, opacity: 0 });

      const intro = gsap.timeline({ delay: 0.12 });
      intro
        .to(h1Ref.current, {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.95,
          ease: 'power3.out',
        })
        .to(subRef.current, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.55')
        .to(ctaRef.current, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.65');

      gsap.to(state, {
        scrollProgress: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to(centerRef.current, {
        yPercent: -12,
        scale: 0.96,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: '25% top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, heroRef);

    return () => {
      ctx.revert();
      if (rafId) cancelAnimationFrame(rafId);
      stage?.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', positionCards);
    };
  }, [reducedMotion]);

  return (
    <header id="top" ref={heroRef} className="melius-hero theme-invert">
      <div className="melius-hero_dots" aria-hidden="true" />

      <div
        ref={orbitStageRef}
        className={`melius-orbit_stage${isDragging ? ' is-dragging' : ''}`}
      >
        <div className="melius-orbit_origin" data-hero-orbit-origin>
          {ORBIT_ITEMS.map((item, idx) => (
            <button
              key={item.label}
              type="button"
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              data-hero-orbit-card={idx}
              className="melius-orbit_card"
              onClick={onOpenAccess}
              tabIndex={-1}
            >
              <span className="melius-orbit_label">
                <Globe size={11} aria-hidden="true" />
                {item.label}
              </span>
              <div className="melius-orbit_thumb" style={{ aspectRatio: item.aspect }}>
                <img
                  src={item.img}
                  alt={item.label}
                  loading="eager"
                  draggable="false"
                  className="melius-orbit_img"
                />
                <div
                  ref={(el) => {
                    mistRefs.current[idx] = el;
                  }}
                  className="melius-orbit_mist"
                  aria-hidden="true"
                />
                <span className="melius-orbit_chip">
                  Explore Insights <ArrowUpRight size={11} aria-hidden="true" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div ref={centerRef} className="melius-hero_center">
        <h1 ref={h1Ref} className="melius-hero_h1">
          Explore Environmental Data. Discover New Perspectives.
        </h1>

        <p ref={subRef} className="melius-hero_sub">
          One connected platform to discover environmental datasets, explore geospatial insights,
          and access digital applications supporting a sustainable Abu Dhabi.
        </p>

        <div ref={ctaRef} className="melius-hero_ctas">
          <a href="#earth" className="melius-btn_orange">
            Explore the Platform
          </a>

          <a href="#benefits" className="melius-btn_agent">
            <Database size={15} className="melius-agent_icon" aria-hidden="true" />
            <span>Browse Data Catalogue</span>
          </a>
        </div>
      </div>
    </header>
  );
}
