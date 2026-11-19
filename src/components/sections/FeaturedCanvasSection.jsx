import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import edpPhase1Visual from '../../assets/edp-phase1-hero.png';
import imgEnviroportal from '../../assets/app-enviroportal.png';
import imgAirQuality from '../../assets/app-airquality.jpg';
import imgAbuDhabiNature from '../../assets/app-abudhabinature.jpg';
import imgAlDaleela from '../../assets/app-aldaleela.jpg';
import imgMarineDebris from '../../assets/app-marinedebris.jpg';

const CHAPTERS = [
  {
    id: 'enviroportal',
    label: 'Enviroportal',
    layout: 'fork',
    description:
      'Explore Abu Dhabi’s unified geospatial environmental portal connecting habitats, groundwater, marine water quality, and coastal layers.',
    bgImg:
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=85',
    paths: [
      'M 98 178 C 145 178, 115 290, 156 290',
      'M 98 178 C 280 178, 320 68, 484 68',
    ],
    ports: [
      { cx: 98, cy: 178 },
      { cx: 156, cy: 290 },
      { cx: 484, cy: 68 },
    ],
    nodes: [
      {
        title: 'Geospatial Layers',
        meta: 'EAD Atlas',
        badge: 'Dataset',
        slotClass: 'fc-fork--1',
        img: imgAbuDhabiNature,
      },
      {
        title: 'AOI Summary',
        meta: 'Enviroportal',
        badge: 'Map',
        slotClass: 'fc-fork--2',
        img: edpPhase1Visual,
      },
      {
        title: 'Enviroportal Viewer',
        meta: 'Portal v2',
        badge: 'Video · Application',
        slotClass: 'fc-fork--3',
        img: imgEnviroportal,
        isVideo: true,
        videoSrc: '/videos/coastal-waves.mp4',
      },
    ],
  },
  {
    id: 'air-quality',
    label: 'Air Quality Portal',
    layout: 'cascade',
    description:
      'Monitor real-time ambient air quality stations, particulate dispersion forecasts, and regional emission trends across Abu Dhabi.',
    bgImg:
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1920&q=85',
    paths: ['M 295 140 C 355 140, 360 92, 418 92'],
    ports: [
      { cx: 295, cy: 140 },
      { cx: 418, cy: 92 },
    ],
    nodes: [
      {
        title: 'AQ Station Grid',
        meta: 'ADM · ADPorts · EAD',
        badge: 'Dataset',
        slotClass: 'fc-cascade--1',
        img: edpPhase1Visual,
      },
      {
        title: 'Air Quality Portal',
        meta: 'Live Forecast',
        badge: 'Video · Application',
        slotClass: 'fc-cascade--2',
        img: imgAirQuality,
        isVideo: true,
        videoSrc: '/videos/air-quality.mp4',
      },
    ],
  },
  {
    id: 'abu-dhabi-nature',
    label: 'Abu Dhabi Nature',
    layout: 'cinema',
    description:
      'Discover biodiversity sightings, protected mangrove reserves, and native terrestrial and marine habitats across the emirate.',
    bgImg:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1920&q=85',
    paths: ['M 278 136 C 325 136, 325 224, 366 224'],
    ports: [
      { cx: 278, cy: 136 },
      { cx: 366, cy: 224 },
    ],
    nodes: [
      {
        title: 'Species Sightings',
        meta: 'Spatial Search',
        badge: 'Video · Dataset',
        slotClass: 'fc-cinema--1',
        img: imgEnviroportal,
        isVideo: true,
        videoSrc: '/videos/nature-forest.mp4',
      },
      {
        title: 'Abu Dhabi Nature',
        meta: 'Protected Habitats',
        badge: 'Video · Application',
        slotClass: 'fc-cinema--2',
        img: imgAbuDhabiNature,
        isVideo: true,
        videoSrc: '/videos/ocean-surface.mp4',
      },
    ],
  },
  {
    id: 'al-daleela',
    label: 'Al Daleela',
    layout: 'twin',
    description:
      'Navigate marine protected areas, coastal bathymetry, and safe maritime corridors with Al Daleela environmental guidance.',
    bgImg:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=85',
    paths: [
      'M 0 82 C 28 92, 46 92, 66 92',
      'M 0 146 C 28 124, 42 92, 66 92',
      'M 377 92 L 459 92',
    ],
    ports: [
      { cx: 66, cy: 92 },
      { cx: 377, cy: 92 },
      { cx: 459, cy: 92 },
    ],
    nodes: [
      {
        title: 'Marine Zones',
        meta: 'MPA Core Layers',
        badge: 'Layer',
        slotClass: 'fc-twin--1',
        img: imgEnviroportal,
      },
      {
        title: 'Al Daleela',
        meta: 'Marine Navigation',
        badge: 'Application',
        slotClass: 'fc-twin--2',
        img: imgAlDaleela,
      },
    ],
  },
  {
    id: 'marine-debris',
    label: 'Marine Debris',
    layout: 'merge',
    description:
      'Track underwater and shoreline marine debris surveys, clean-up operations, and coastal ecosystem recovery metrics.',
    bgImg:
      'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1920&q=85',
    paths: [
      'M 0 100 C 42 100, 56 66, 98 66',
      'M 0 282 C 42 282, 56 308, 98 308',
      'M 312 66 C 385 66, 390 148, 459 148',
      'M 312 308 C 385 308, 390 148, 459 148',
    ],
    ports: [
      { cx: 98, cy: 66 },
      { cx: 98, cy: 308 },
      { cx: 312, cy: 66 },
      { cx: 312, cy: 308 },
      { cx: 459, cy: 148 },
    ],
    nodes: [
      {
        title: 'Survey Locations',
        meta: 'Coastal Monitoring',
        badge: 'Dataset',
        slotClass: 'fc-merge--1',
        img: imgAlDaleela,
      },
      {
        title: 'Incident Reports',
        meta: 'MWQ Field App',
        badge: 'Layer',
        slotClass: 'fc-merge--2',
        img: imgEnviroportal,
      },
      {
        title: 'Marine Debris Tracker',
        meta: 'EAD Analytics',
        badge: 'Application',
        slotClass: 'fc-merge--3',
        img: imgMarineDebris,
      },
    ],
  },
];

export default function FeaturedCanvasSection({ onOpenAccess, reducedMotion = false }) {
  const sectionRef = useRef(null);
  const chapterRefs = useRef([]);
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const ctx = gsap.context(() => {
      chapterRefs.current.forEach((chapterEl, idx) => {
        if (!chapterEl) return;

        ScrollTrigger.create({
          trigger: chapterEl,
          start: 'top 55%',
          end: 'bottom 55%',
          onEnter: () => setActiveChapterIdx(idx),
          onEnterBack: () => setActiveChapterIdx(idx),
        });

        if (reducedMotion) return;

        const board = chapterEl.querySelector('.featured-canvas__chapter-board');
        const paths = chapterEl.querySelectorAll('.featured-canvas__svg path');
        const nodes = chapterEl.querySelectorAll('.featured-canvas__node-wrap');

        paths.forEach((p) => {
          const len = p.getTotalLength ? p.getTotalLength() : 420;
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        });
        gsap.set(nodes, { y: 24, opacity: 0.4 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: chapterEl,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: true,
          },
        });

        if (board) {
          tl.fromTo(board, { xPercent: 4 }, { xPercent: -4, ease: 'none', duration: 1 }, 0);
        }
        tl.to(paths, { strokeDashoffset: 0, stagger: 0.14, ease: 'none', duration: 0.6 }, 0.05)
          .to(nodes, { y: 0, opacity: 1, stagger: 0.12, ease: 'none', duration: 0.5 }, 0.05);
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const handleSelectChapter = (idx) => {
    setActiveChapterIdx(idx);
    const target = chapterRefs.current[idx];
    if (target) {
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
    }
  };

  return (
    <section id="featured-canvas" ref={sectionRef} className="featured-canvas">
      {/* Sticky Full-Screen Crossfading Background Layer */}
      <div className="featured-canvas__background-layer" aria-hidden="true">
        <div className="featured-canvas__sticky-background">
          {CHAPTERS.map((chapter, idx) => (
            <img
              key={chapter.id}
              src={chapter.bgImg}
              alt=""
              className={`featured-canvas__bg-img${idx === activeChapterIdx ? ' is-active' : ''}`}
              loading="lazy"
            />
          ))}
          <div className="featured-canvas__bg-scrim" />
          <div className="featured-canvas__bg-noise" />
        </div>
      </div>

      {/* Sticky Floating Category / Prompt Dock Layer */}
      <div className="featured-canvas__dock-layer">
        <div className="featured-canvas__sticky-dock">
          <div className="featured-canvas__dock-card">
            <h3 className="featured-canvas__dock-title">Featured Applications</h3>

            <div className="featured-canvas__tabs" role="tablist" aria-label="Featured Applications">
              {CHAPTERS.map((chapter, idx) => (
                <button
                  key={chapter.id}
                  type="button"
                  role="tab"
                  aria-selected={idx === activeChapterIdx}
                  className={`featured-canvas__tab${idx === activeChapterIdx ? ' is-active' : ''}`}
                  onClick={() => handleSelectChapter(idx)}
                >
                  {chapter.label}
                </button>
              ))}
            </div>

            <div className="featured-canvas__dock-footer">
              <a
                href="#card"
                className="featured-canvas__dock-cta"
                onClick={onOpenAccess}
              >
                <span>Explore Applications</span>
                <ArrowRight size={14} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Vertically Arranged Showcase Chapters (5 Distinct Topologies) */}
      <div className="featured-canvas__chapters">
        {CHAPTERS.map((chapter, idx) => (
          <article
            key={chapter.id}
            ref={(el) => {
              chapterRefs.current[idx] = el;
            }}
            className="featured-canvas__chapter"
          >
            <div className="featured-canvas__dots" aria-hidden="true" />
            <div className="featured-canvas__chapter-board">
              <svg
                className="featured-canvas__svg"
                viewBox="0 0 820 520"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                {chapter.paths.map((d, pIdx) => (
                  <path
                    key={`${chapter.id}-p-${pIdx}`}
                    d={d}
                    stroke={pIdx === 0 ? '#74AA50' : '#007749'}
                    strokeWidth="1.7"
                  />
                ))}
                {chapter.ports.map((pt, ptIdx) => (
                  <g key={`${chapter.id}-pt-${ptIdx}`}>
                    <circle cx={pt.cx} cy={pt.cy} r="4.5" fill="#111312" stroke="#74AA50" strokeWidth="1.6" />
                    <circle cx={pt.cx} cy={pt.cy} r="1.6" fill="#74AA50" />
                  </g>
                ))}
              </svg>

              {chapter.nodes.map((node) => (
                <div
                  key={node.title}
                  className={`featured-canvas__node-wrap ${node.slotClass}`}
                >
                  <div className="featured-canvas__node-head">
                    <span className="featured-canvas__node-title">{node.title}</span>
                    <span className="featured-canvas__node-meta">{node.meta}</span>
                  </div>
                  <div className="featured-canvas__node-card">
                    <div className="featured-canvas__node-bar">
                      <span className="featured-canvas__node-badge">{node.badge}</span>
                    </div>
                    <div className="featured-canvas__node-box">
                      {node.isVideo ? (
                        <video
                          src={node.videoSrc}
                          poster={node.img}
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="auto"
                          aria-label={node.title}
                          className="featured-canvas__node-img"
                        />
                      ) : (
                        <img
                          src={node.img}
                          alt={node.title}
                          className="featured-canvas__node-img"
                          loading="lazy"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
