import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { FOOTER_COLUMNS } from '../../data/siteContent';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer({ onOpenAccess, reducedMotion = false }) {
  const footerRef = useRef(null);
  const topLeftRef = useRef(null);
  const colsRef = useRef([]);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer || reducedMotion) return undefined;

    const ctx = gsap.context(() => {
      const topEls = topLeftRef.current ? Array.from(topLeftRef.current.children) : [];
      const colEls = colsRef.current.filter(Boolean);
      const allChildren = colEls.flatMap((c) => Array.from(c.children));

      gsap.set(topEls, { opacity: 0, y: 40 });
      gsap.set(allChildren, { opacity: 0, y: 24 });

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: 'power2.out' },
      });

      tl.to(topEls, { opacity: 1, y: 0, duration: 0.85, stagger: 0.08 });
      colEls.forEach((col, idx) => {
        tl.to(
          Array.from(col.children),
          { opacity: 1, y: 0, duration: 0.65, stagger: 0.05 },
          0.18 + idx * 0.08
        );
      });

      gsap.timeline({
        scrollTrigger: {
          trigger: footer,
          start: 'top 65%',
          onEnter: () => tl.play(),
          onLeaveBack: () => tl.pause(0),
        },
      });
    }, footerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <footer ref={footerRef} className="footer2">
      <div className="footer2_inner">
        <div className="footer2_top">
          <div ref={topLeftRef} className="footer2_top_left">
            <h2 className="text-style-h2">
              EXPLORE DATA.
              <br />
              UNDERSTAND OUR ENVIRONMENT.
            </h2>
            <button type="button" className="button" onClick={onOpenAccess}>
              Explore the Platform <span aria-hidden="true">→</span>
            </button>
          </div>

          <div className="footer2_cols">
            {FOOTER_COLUMNS.map((col, idx) => (
              <div
                key={col.title}
                ref={(el) => {
                  colsRef.current[idx] = el;
                }}
                className="footer2_col"
              >
                <span className="footer2_col_title">{col.title}</span>
                {col.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noreferrer' : undefined}
                    className="footer2_link"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="footer2_bottom">
          <span className="footer2_legal">Environment Agency – Abu Dhabi</span>
          <span className="footer2_legal">
            © {CURRENT_YEAR} Environment Agency – Abu Dhabi. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
