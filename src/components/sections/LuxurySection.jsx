import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { LUXURY_TAGS } from '../../data/siteContent';

export default function LuxurySection({ onOpenAccess, reducedMotion = false }) {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !bgRef.current || reducedMotion) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bgRef.current,
        { yPercent: -10 },
        {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section id="luxury" ref={sectionRef} className="luxury">
      <div ref={bgRef} className="luxury_bg_img" aria-hidden="true" />
      <div className="luxury_scrim" aria-hidden="true" />

      <div className="luxury_inner">
        <div className="luxury_tags">
          {LUXURY_TAGS.map((tag) => (
            <span key={tag} className="luxury_tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="luxury_center">
          <h2 className="text-style-h1">ACCESS OUR NETWORK</h2>
          <p className="text-medium text-cl-grey300 luxury_copy">
            Membership includes preferred rates and exclusive experiences across our catalogue of
            partners.
          </p>
          <button type="button" className="button" onClick={onOpenAccess}>
            Apply for Access
          </button>
        </div>
      </div>
    </section>
  );
}
