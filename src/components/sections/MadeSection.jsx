import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { MADE_CATEGORIES } from '../../data/siteContent';

export default function MadeSection({ reducedMotion = false }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const prevIndexRef = useRef(0);
  const revealRefs = useRef([]);
  const innerRefs = useRef([]);

  useEffect(() => {
    const nextIdx = activeIndex;
    const prevIdx = prevIndexRef.current;
    if (nextIdx === prevIdx) return;
    prevIndexRef.current = nextIdx;

    const nextReveal = revealRefs.current[nextIdx];
    const nextInner = innerRefs.current[nextIdx];
    if (!nextReveal || !nextInner) return;

    revealRefs.current.forEach((el, idx) => {
      if (!el) return;
      if (idx === nextIdx) gsap.set(el, { zIndex: 11 });
      else if (idx === prevIdx) gsap.set(el, { zIndex: 10 });
      else gsap.set(el, { zIndex: 1 });
    });

    if (reducedMotion) {
      gsap.set(nextReveal, { xPercent: 0 });
      gsap.set(nextInner, { xPercent: 0 });
      return;
    }

    gsap
      .timeline({ defaults: { duration: 0.78, ease: 'power3.inOut' } })
      .fromTo(nextReveal, { xPercent: 100 }, { xPercent: 0 }, 0)
      .fromTo(nextInner, { xPercent: -100 }, { xPercent: 0 }, 0);
  }, [activeIndex, reducedMotion]);

  return (
    <section className="made theme-invert">
      <div className="made_inner">
        <div className="made_header">
          <span className="section_eyebrow">Curated Ecosystem</span>
          <h2 className="text-style-h2">
            Made for the places you
            <br />
            already move through.
          </h2>
        </div>

        <div className="made_grid">
          <div className="made_points" role="tablist" aria-label="Moto membership categories">
            {MADE_CATEGORIES.map((cat, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`made_point${isActive ? ' is-active' : ''}`}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => setActiveIndex(idx)}
                >
                  <span className="made_point_num">{cat.id}</span>
                  <div className="made_point_body">
                    <h3 className="made_point_title">{cat.title}</h3>
                    <p className="made_point_desc">{cat.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="made_imgs" aria-live="polite">
            {MADE_CATEGORIES.map((cat, idx) => (
              <div
                key={cat.id}
                ref={(el) => {
                  revealRefs.current[idx] = el;
                }}
                className="made_img_reveal"
                style={{ zIndex: idx === 0 ? 11 : 1 }}
              >
                <div
                  ref={(el) => {
                    innerRefs.current[idx] = el;
                  }}
                  className="made_img_item"
                  style={{
                    background: `radial-gradient(circle at 30% 25%, ${cat.palette[2]}33, transparent 55%), linear-gradient(145deg, ${cat.palette[0]} 0%, ${cat.palette[1]} 65%, #08080a 100%)`,
                  }}
                >
                  <div className="made_img_overlay">
                    <span className="made_img_num">{cat.id}</span>
                    <span className="made_img_tag">{cat.tag}</span>
                    <strong className="made_img_title">{cat.title}</strong>
                    <p className="made_img_sub">{cat.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
