import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CURRENCIES, NUMBERS_PILLARS } from '../../data/siteContent';

export default function NumbersSection({ reducedMotion = false }) {
  const sectionRef = useRef(null);
  const listItemsRef = useRef([]);
  const arcTrackRef = useRef(null);
  const arcItemsRef = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return undefined;

    const ctx = gsap.context(() => {
      const items = listItemsRef.current.filter(Boolean);
      if (items.length) {
        gsap.set(items, { opacity: 0, yPercent: 60, filter: 'blur(5px)' });
        gsap.to(items, {
          opacity: 1,
          yPercent: 0,
          filter: 'blur(0px)',
          duration: 0.9,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 65%',
            once: true,
          },
        });
      }

      // Scrubbed Currency Arc progression
      const arcItems = arcItemsRef.current.filter(Boolean);
      if (arcTrackRef.current && arcItems.length) {
        gsap.to(arcTrackRef.current, {
          xPercent: -18,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
            onUpdate: (self) => {
              const p = self.progress;
              const centerIdx = p * (arcItems.length - 1);
              arcItems.forEach((el, idx) => {
                const dist = Math.abs(idx - centerIdx);
                const norm = Math.max(0, 1 - dist / 2.6);
                const scale = 0.82 + norm * 0.36;
                const arcY = Math.pow(dist, 1.6) * 8;
                const opacity = 0.42 + norm * 0.58;
                gsap.set(el, { scale, y: arcY, opacity });
              });
            },
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="numbers theme-invert">
      <div className="numbers_inner">
        <div className="numbers_header">
          <span className="section_eyebrow">Global Infrastructure</span>
          <h2 className="text-style-h2">
            Spend globally.
            <br />0 FX Fees built in.
          </h2>
        </div>

        <div className="numbers_list">
          {NUMBERS_PILLARS.map((item, idx) => (
            <div
              key={item.title}
              ref={(el) => {
                listItemsRef.current[idx] = el;
              }}
              className="numbers_list_item"
            >
              <span className="numbers_index">0{idx + 1}</span>
              <h3 className="numbers_item_title">{item.title}</h3>
              <p className="numbers_item_desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="numbers_arc_wrap" aria-label="Global currencies supported with 0% FX fees">
        <div ref={arcTrackRef} className="numbers_arc_track">
          {[...CURRENCIES, ...CURRENCIES.slice(0, 3)].map((cur, idx) => (
            <div
              key={`${cur.code}-${idx}`}
              ref={(el) => {
                arcItemsRef.current[idx] = el;
              }}
              className="numbers_arc_chip"
            >
              <span className="numbers_arc_amount">{cur.label}</span>
              <span className="numbers_arc_city">
                {cur.code} · {cur.city}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
