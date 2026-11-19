import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { MARQUEE_BENEFITS, TIMEZONES } from '../../data/siteContent';

function formatZones() {
  const now = new Date();
  const out = {};
  TIMEZONES.forEach((tz) => {
    const fmt = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: tz.zone,
    });
    out[tz.key] = `${fmt.format(now)} ${tz.label}`;
  });
  return out;
}

export default function ConciergeSection({ reducedMotion = false }) {
  const sectionRef = useRef(null);
  const imgPrimaryRef = useRef(null);
  const imgSecondaryRef = useRef(null);
  const marqueeTrackRef = useRef(null);
  const [clocks, setClocks] = useState(() => formatZones());

  useEffect(() => {
    const id = setInterval(() => {
      setClocks(formatZones());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return undefined;

    const ctx = gsap.context(() => {
      // Scrubbed dual-depth image parallax
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
      tl.fromTo(imgPrimaryRef.current, { yPercent: -10 }, { yPercent: 10 }, 0);
      tl.fromTo(imgSecondaryRef.current, { yPercent: 12 }, { yPercent: -12 }, 0);

      // Infinite horizontal benefit marquee (pauses when offscreen)
      if (marqueeTrackRef.current) {
        const items = marqueeTrackRef.current.querySelectorAll('.marquee_item');
        const marqueeAnim = gsap.to(items, {
          xPercent: -100,
          repeat: -1,
          duration: 28,
          ease: 'none',
          paused: true,
        });
        marqueeAnim.totalProgress(0.5);

        gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            onToggle: (self) => {
              if (self.isActive) marqueeAnim.play();
              else marqueeAnim.pause();
            },
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section id="benefits" ref={sectionRef} className="concierge">
      <div className="concierge_inner">
        <div className="concierge_left">
          <span className="section_eyebrow">24/7 Private Access</span>
          <h2 className="text-style-h2">
            24/7 Concierge.
            <br />
            Anything.
            <br />
            Anytime.
          </h2>
          <p className="text-medium text-cl-grey300 concierge_copy">
            Moto Membership includes dedicated concierge access for last-minute dining, private
            aviation, sold-out cultural moments, and global itinerary coordination.
          </p>

          <div className="concierge_pills">
            <span className="concierge_pill">Dedicated concierge</span>
            <span className="concierge_pill">Global support</span>
            <span className="concierge_pill">Private inventory</span>
          </div>

          <div className="concierge_clocks" aria-label="Live global concierge desk clocks">
            {TIMEZONES.map((tz) => (
              <div key={tz.key} className="concierge_clock_item">
                <span className="concierge_clock_dot" aria-hidden="true" />
                <span>{clocks[tz.key]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="concierge_visuals">
          <div ref={imgPrimaryRef} className="concierge_card concierge_card--primary">
            <div className="concierge_card_art concierge_card_art--lounge" />
            <div className="concierge_card_meta">
              <span>24/7 Desk</span>
              <strong>Private Aviation &amp; Suites</strong>
            </div>
          </div>

          <div ref={imgSecondaryRef} className="concierge_card concierge_card--secondary">
            <div className="concierge_card_art concierge_card_art--pool" />
            <div className="concierge_card_meta">
              <span>Global Inventory</span>
              <strong>Preferred Hospitality</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="marquee" aria-hidden="true">
        <div ref={marqueeTrackRef} className="marquee_item_wrap">
          {[0, 1].map((dup) => (
            <div key={dup} className="marquee_item">
              {MARQUEE_BENEFITS.map((b) => (
                <span key={`${dup}-${b}`} className="marquee_text">
                  {b}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
