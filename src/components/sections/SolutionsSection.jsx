import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import catalogueEcosystem from '../../assets/catalogue-ecosystem.jpg';
import catalogueGroundwater from '../../assets/catalogue-groundwater.jpg';
import catalogueSoil from '../../assets/catalogue-soil.jpg';
import catalogueWaste from '../../assets/catalogue-waste.jpg';
import catalogueAirQuality from '../../assets/catalogue-air-quality.jpg';
import HeroGisBackground from './HeroGisBackground';

gsap.registerPlugin(ScrollTrigger);

const SOLUTIONS = [
  {
    id: 'ecosystem',
    tab: 'Ecosystem',
    title: 'Ecosystem',
    desc: 'Explore verified datasets on terrestrial and marine habitats, protected reserves, mangroves, and biodiversity corridors across Abu Dhabi.',
    mainImg: catalogueEcosystem,
    satellites: [
      {
        tag: 'Protected Habitats',
        img: catalogueEcosystem,
      },
      {
        tag: 'Coastal Mangroves',
        img: catalogueAirQuality,
      },
      {
        tag: 'Biodiversity Index',
        img: catalogueSoil,
      },
      {
        tag: 'Wetland Reserves',
        img: catalogueGroundwater,
      },
    ],
  },
  {
    id: 'groundwater',
    tab: 'Groundwater',
    title: 'Groundwater',
    desc: 'Access aquifer monitoring wells, water table depth series, salinity profiles, and sustainable extraction records across the emirate.',
    mainImg: catalogueGroundwater,
    satellites: [
      {
        tag: 'Well Telemetry',
        img: catalogueGroundwater,
      },
      {
        tag: 'Aquifer Levels',
        img: catalogueEcosystem,
      },
      {
        tag: 'Salinity Grids',
        img: catalogueSoil,
      },
      {
        tag: 'Recharge Zones',
        img: catalogueAirQuality,
      },
    ],
  },
  {
    id: 'soil',
    tab: 'Soil',
    title: 'Soil',
    desc: 'Review soil classification maps, land degradation indicators, geochemical surveys, and agricultural suitability layers.',
    mainImg: catalogueSoil,
    satellites: [
      {
        tag: 'Soil Surveys',
        img: catalogueSoil,
      },
      {
        tag: 'Land Cover',
        img: catalogueEcosystem,
      },
      {
        tag: 'Arid Formations',
        img: catalogueAirQuality,
      },
      {
        tag: 'Moisture Profiles',
        img: catalogueGroundwater,
      },
    ],
  },
  {
    id: 'waste',
    tab: 'Waste Management',
    title: 'Waste Management',
    desc: 'Track municipal, industrial, and hazardous waste streams, material recovery facilities, and circular economy diversion metrics.',
    mainImg: catalogueWaste,
    satellites: [
      {
        tag: 'Material Recovery',
        img: catalogueWaste,
      },
      {
        tag: 'Diversion Rates',
        img: catalogueAirQuality,
      },
      {
        tag: 'Facility Registry',
        img: catalogueGroundwater,
      },
      {
        tag: 'Landfill Monitoring',
        img: catalogueSoil,
      },
    ],
  },
  {
    id: 'air-quality',
    tab: 'Air Quality',
    title: 'Air Quality',
    desc: 'Inspect real-time ambient air monitoring stations, particulate concentrations (PM2.5/PM10), emissions inventories, and atmospheric forecasts.',
    mainImg: catalogueAirQuality,
    satellites: [
      {
        tag: 'Ambient Stations',
        img: catalogueAirQuality,
      },
      {
        tag: 'PM2.5 & PM10',
        img: catalogueEcosystem,
      },
      {
        tag: 'Emissions Grid',
        img: catalogueWaste,
      },
      {
        tag: 'Dust Forecasts',
        img: catalogueSoil,
      },
    ],
  },
];

export default function SolutionsSection({ reducedMotion = false }) {
  const sectionRef = useRef(null);
  const deckRef = useRef(null);
  const cardRefs = useRef([]);
  const satRefs = useRef([]);
  const satInnerRefs = useRef([]);
  const tabRefs = useRef([]);
  const indicatorRef = useRef(null);
  const prevIdxRef = useRef(0);
  const isFirstRender = useRef(true);
  const scrollTriggerRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const current = SOLUTIONS[activeIdx];

  const handleSelectTab = (idx) => {
    const st = scrollTriggerRef.current;
    if (st && !reducedMotion) {
      const targetProgress = (idx + 0.35) / SOLUTIONS.length;
      const targetScroll = st.start + (st.end - st.start) * targetProgress;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
      return;
    }
    setActiveIdx(idx);
  };

  // Pin section and auto-switch tabs on vertical scroll, then release to next section
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return undefined;

    const ctx = gsap.context(() => {
      const sats = satRefs.current.filter(Boolean);
      const speeds = [-18, 14, -22, 16];

      sats.forEach((sat, idx) => {
        gsap.fromTo(
          sat,
          { yPercent: -speeds[idx] * 0.6 },
          {
            yPercent: speeds[idx],
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      });

      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=240%',
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const nextIdx = Math.min(
            SOLUTIONS.length - 1,
            Math.floor(self.progress * SOLUTIONS.length)
          );
          setActiveIdx((prev) => (prev !== nextIdx ? nextIdx : prev));
        },
      });
    }, sectionRef);

    return () => {
      scrollTriggerRef.current = null;
      ctx.revert();
    };
  }, [reducedMotion]);

  // Sliding active tab pill indicator
  useEffect(() => {
    const activeTab = tabRefs.current[activeIdx];
    const indicator = indicatorRef.current;
    if (!activeTab || !indicator) return;

    const { offsetLeft, offsetWidth, offsetTop, offsetHeight } = activeTab;
    if (reducedMotion || isFirstRender.current) {
      gsap.set(indicator, {
        x: offsetLeft,
        y: offsetTop,
        width: offsetWidth,
        height: offsetHeight,
      });
    } else {
      gsap.to(indicator, {
        x: offsetLeft,
        y: offsetTop,
        width: offsetWidth,
        height: offsetHeight,
        duration: 0.4,
        ease: 'power3.out',
      });
    }
  }, [activeIdx, reducedMotion]);

  // Directional card deck animation + staggered satellite pop-in when switching tabs
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevIdxRef.current = activeIdx;
      return;
    }

    const prevIdx = prevIdxRef.current;
    if (reducedMotion || prevIdx === activeIdx) {
      prevIdxRef.current = activeIdx;
      return;
    }

    const isNext = activeIdx > prevIdx;
    const frontCard = cardRefs.current[activeIdx];
    const prevCard = cardRefs.current[prevIdx];
    const satInners = satInnerRefs.current.filter(Boolean);

    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      gsap.killTweensOf(card);
      const off = (i - activeIdx + SOLUTIONS.length) % SOLUTIONS.length;
      card.style.opacity = '';
      card.style.transition = '';
      card.style.zIndex = String(SOLUTIONS.length - off);
      card.style.transform = `translateY(${-off * 1.8}rem) scale(${1 - off * 0.048})`;
    });

    if (isNext) {
      // Moving to NEXT tab: outgoing front card moves DOWN off the deck while the next card steps forward
      if (prevCard) {
        const prevOffset = (prevIdx - activeIdx + SOLUTIONS.length) % SOLUTIONS.length;
        const targetY = -prevOffset * 1.8;
        const targetScale = 1 - prevOffset * 0.048;

        gsap.fromTo(
          prevCard,
          { y: 0, opacity: 1, scale: 1, zIndex: SOLUTIONS.length + 2, transition: 'none' },
          {
            y: 140,
            opacity: 0,
            scale: 0.97,
            duration: 0.42,
            ease: 'power2.in',
            onComplete: () => {
              gsap.set(prevCard, {
                x: 0,
                y: 0,
                scale: targetScale,
                opacity: 1,
                zIndex: SOLUTIONS.length - prevOffset,
                transition: 'none',
              });
              prevCard.style.transform = `translateY(${targetY}rem) scale(${targetScale})`;
              requestAnimationFrame(() => {
                prevCard.style.transition = '';
              });
            },
          }
        );
      }
    } else {
      // Moving to PREVIOUS tab: incoming tab card rises from DOWN to UP onto the front of the deck
      if (frontCard) {
        gsap.fromTo(
          frontCard,
          { y: 140, opacity: 0, scale: 1.02, zIndex: SOLUTIONS.length + 2, transition: 'none' },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.48,
            ease: 'power3.out',
            onComplete: () => {
              frontCard.style.zIndex = String(SOLUTIONS.length);
              frontCard.style.transform = 'translateY(0rem) scale(1)';
              frontCard.style.opacity = '';
              frontCard.style.transition = '';
            },
          }
        );
      }
    }

    if (satInners.length) {
      gsap.fromTo(
        satInners,
        { opacity: 0, scale: 0.86, y: isNext ? -14 : 18 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.055,
          ease: 'back.out(1.4)',
          clearProps: 'transform,opacity',
        }
      );
    }

    prevIdxRef.current = activeIdx;
  }, [activeIdx, reducedMotion]);

  return (
    <section id="solutions" ref={sectionRef} className="melius-solutions theme-invert">
      <HeroGisBackground reducedMotion={reducedMotion} />

      <div className="melius-solutions_stage">
        {/* 4 Floating Satellite Cards */}
        {current.satellites.map((sat, idx) => (
          <div
            key={`sat-slot-${idx}`}
            ref={(el) => {
              satRefs.current[idx] = el;
            }}
            className={`melius-sat_card melius-sat_card--${idx + 1}`}
          >
            <div
              ref={(el) => {
                satInnerRefs.current[idx] = el;
              }}
              className="melius-sat_inner"
            >
              <span className="melius-sat_tag">{sat.tag}</span>
              <div className="melius-sat_frame">
                <img src={sat.img} alt={sat.tag} className="melius-sat_img" loading="lazy" />
              </div>
            </div>
          </div>
        ))}

        {/* Center Stacked Editorial Card Deck */}
        <div ref={deckRef} className="melius-sol_deck">
          {SOLUTIONS.map((sol, idx) => {
            const offset = (idx - activeIdx + SOLUTIONS.length) % SOLUTIONS.length;
            const isFront = offset === 0;
            const translateY = -offset * 1.8;
            const scale = 1 - offset * 0.048;

            return (
              <div
                key={sol.id}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                className={`melius-sol_card${isFront ? ' is-front' : ''}`}
                style={{
                  zIndex: SOLUTIONS.length - offset,
                  transform: `translateY(${translateY}rem) scale(${scale})`,
                }}
                onClick={!isFront ? () => handleSelectTab(idx) : undefined}
              >
                <div className="melius-sol_media">
                  <img
                    src={sol.mainImg}
                    alt={sol.title}
                    className="melius-sol_img"
                    loading="lazy"
                  />

                  {/* Top-center dark glass icon pill */}
                  <div className="melius-sol_badge" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="14" rx="2" />
                      <path d="M13 13h5v4h-5z" />
                      <path d="M7 8l4 4m0-4v4H7" />
                    </svg>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="5" width="15" height="12" rx="2" />
                      <path d="M9 9l4 2.5L9 14V9z" />
                      <path d="M19 15l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" />
                    </svg>
                  </div>

                  {/* Smooth curved left white notch */}
                  <div className="melius-sol_notch" aria-hidden="true">
                    <svg
                      className="melius-sol_notch_bg"
                      viewBox="0 0 30 180"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0,0 C0,24 26,38 26,90 C26,142 0,156 0,180 Z"
                        fill="#ffffff"
                      />
                    </svg>
                    <span className="melius-sol_notch_text">EAD</span>
                  </div>
                </div>

                <div className="melius-sol_body">
                  <h2 className="melius-sol_title">{sol.title}</h2>
                  <p className="melius-sol_desc">{sol.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Pill Switcher + Explore Catalogues CTA */}
      <div className="melius-sol_tabs_wrap">
        <div className="melius-sol_tabs" role="tablist" aria-label="Environmental Data Catalogue">
          <span ref={indicatorRef} className="melius-sol_tab_indicator" aria-hidden="true" />
          {SOLUTIONS.map((sol, idx) => (
            <button
              key={sol.id}
              ref={(el) => {
                tabRefs.current[idx] = el;
              }}
              type="button"
              role="tab"
              aria-selected={idx === activeIdx}
              className={`melius-sol_tab${idx === activeIdx ? ' is-active' : ''}`}
              onClick={() => handleSelectTab(idx)}
            >
              {sol.tab}
            </button>
          ))}
        </div>

        <a href="#benefits" className="button melius-sol_explore_btn">
          Explore Catalogues <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}
