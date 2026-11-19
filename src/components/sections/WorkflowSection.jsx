import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  Compass,
  Database,
  BarChart3,
  Layers,
  MapPin,
  Globe,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import edpPhase1Visual from '../../assets/edp-phase1-hero.png';
import { ORBIT_ITEMS } from '../../data/orbitItems';

const STATUS_TEXT =
  'Enviroportal · Air Quality Portal · Abu Dhabi Nature · Environmental Insights';

const WORKFLOW_STEPS = [
  {
    id: 'applications',
    title: 'Discover Applications',
    icon: Compass,
    desc: "Access EAD's digital applications to explore environmental information, interactive maps, and specialized tools.",
    apps: ['Enviroportal', 'Air Quality Portal', 'Abu Dhabi Nature'],
  },
  {
    id: 'data',
    title: 'Explore Environmental Data',
    icon: Database,
    desc: 'Browse environmental data across air quality, biodiversity, water resources, marine ecosystems, soil, and more.',
    layers: [
      { name: 'Air Quality & Atmospheric Data', meta: 'Real-time stations' },
      { name: 'Biodiversity & Marine Ecosystems', meta: 'Protected habitats' },
      { name: 'Water Resources & Soil', meta: 'Groundwater & land' },
    ],
  },
  {
    id: 'insights',
    title: 'Access Environmental Insights',
    icon: BarChart3,
    desc: 'Explore available maps, visualizations, and environmental information to support research and informed decisions.',
    outputs: [
      { label: 'Map View', format: 'Geospatial Explorer' },
      { label: 'Environmental Insights', format: 'Regional Summaries' },
      { label: 'Data Catalogue', format: 'Verified Datasets' },
      { label: 'Applications', format: 'Digital Portals' },
    ],
  },
];

export default function WorkflowSection({ reducedMotion = false }) {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const beamRef = useRef(null);
  const headlineLinesRef = useRef([]);
  const rightColRef = useRef(null);

  const [activeStep, setActiveStep] = useState(0);
  const [typedCount, setTypedCount] = useState(0);
  const [userLocked, setUserLocked] = useState(false);
  const [tweakLayers, setTweakLayers] = useState([true, true, true]);

  // Subtle mouse-responsive ambient lighting on left preview (desktop fine pointer only)
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reducedMotion) return undefined;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;

    const onMove = (e) => {
      const rect = stage.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      stage.style.setProperty('--mx', `${x.toFixed(1)}%`);
      stage.style.setProperty('--my', `${y.toFixed(1)}%`);
    };

    stage.addEventListener('pointermove', onMove, { passive: true });
    return () => stage.removeEventListener('pointermove', onMove);
  }, [reducedMotion]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return undefined;

    const ctx = gsap.context(() => {
      const lines = headlineLinesRef.current.filter(Boolean);
      const isDesktop = window.innerWidth >= 992;

      gsap.set(stageRef.current, {
        xPercent: isDesktop ? 36 : 0,
        scale: isDesktop ? 1.12 : 1,
        transformOrigin: 'center center',
      });
      gsap.set(beamRef.current, { opacity: 0.08, xPercent: -25 });
      gsap.set(rightColRef.current, { opacity: 0, y: 28 });
      gsap.set(lines, { opacity: 0.22 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.round(window.innerHeight * 3.2)}`,
          pin: true,
          pinSpacing: true,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            const typeProgress = Math.min(1, Math.max(0, (p - 0.1) / 0.24));
            setTypedCount(Math.round(typeProgress * STATUS_TEXT.length));

            if (userLocked) return;
            if (p < 0.34) setActiveStep(0);
            else if (p < 0.52) setActiveStep(1);
            else setActiveStep(2);
          },
        },
      });

      tl.to(
        stageRef.current,
        { xPercent: 0, scale: 1, duration: 0.35, ease: 'none' },
        0.04
      )
        .to(
          beamRef.current,
          { opacity: 0.95, xPercent: 0, duration: 0.38, ease: 'none' },
          0.08
        )
        .to(
          rightColRef.current,
          { opacity: 1, y: 0, duration: 0.28, ease: 'none' },
          0.14
        )
        .to(
          lines,
          { opacity: 1, duration: 0.22, stagger: 0.07, ease: 'none' },
          0.18
        )
        .to(beamRef.current, { opacity: 0.75, duration: 0.45, ease: 'none' }, 0.55);
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion, userLocked]);

  const handleSelectStep = (idx) => {
    setUserLocked(true);
    setActiveStep(idx);
    setTypedCount(STATUS_TEXT.length);
  };

  const toggleLayer = (idx) => {
    setTweakLayers((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };

  return (
    <section id="workflow" ref={sectionRef} className="ead-workflow">
      <div className="ead-workflow_grid" aria-hidden="true" />
      <div ref={beamRef} className="ead-workflow_beam" aria-hidden="true" />

      <div className="ead-workflow_inner">
        {/* Layer 01-02: Atmospheric blurred EAD orbs behind the frosted glass stage */}
        <div className="ead-workflow_stage_atmo" aria-hidden="true" />

        {/* Layer 03-05: Frosted glass outer frame + floating UI */}
        <div ref={stageRef} className="ead-workflow_stage">
          <div className="ead-stage_ambient_sheen" aria-hidden="true" />
          <div className="ead-canvas_topbar">
            <span className="ead-canvas_pill_icon">
              <MapPin size={12} aria-hidden="true" />
              <span>Map View</span>
            </span>
            <a href="#benefits" className="ead-canvas_pill_share">
              <Database size={12} aria-hidden="true" />
              <span>Data Catalogue</span>
            </a>
          </div>

          <div className="ead-canvas_toolbar" aria-hidden="true">
            <span className="ead-tool_btn"><Compass size={14} /></span>
            <span className="ead-tool_btn"><Layers size={14} /></span>
            <span className="ead-tool_btn"><Database size={14} /></span>
            <span className="ead-tool_btn"><MapPin size={14} /></span>
            <span className="ead-tool_divider" />
            <span className="ead-tool_btn"><BarChart3 size={14} /></span>
          </div>

          {/* Step 01 Preview: Clean Dark Surface + Collected Environmental Cards */}
          {activeStep === 0 && (
            <div className="ead-canvas_overlay">
              <div className="ead-stage_app_preview" data-quick-access-preview>
                <img
                  src={edpPhase1Visual}
                  alt="EAD Environmental Data Platform applications preview"
                  className="ead-stage_preview_img"
                  data-quick-access-city-bg
                />
                <div className="ead-collected_grid" data-collected-grid>
                  {ORBIT_ITEMS.slice(0, 12).map((item, idx) => (
                    <div
                      key={item.label}
                      className="ead-collected_card"
                      data-collected-slot={idx}
                    >
                      <img
                        src={item.img}
                        alt={item.label}
                        className="ead-collected_img"
                        loading="eager"
                      />
                      <span className="ead-collected_label">{item.label}</span>
                    </div>
                  ))}
                </div>
                <div className="ead-stage_app_tags">
                  {WORKFLOW_STEPS[0].apps.map((app) => (
                    <span key={app} className="ead-stage_app_chip">
                      <ExternalLink size={11} aria-hidden="true" />
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 02 Preview: Environmental Data Catalogue Categories */}
          {activeStep === 1 && (
            <div className="ead-canvas_overlay">
              <div className="ead-tweak_list">
                {WORKFLOW_STEPS[1].layers.map((layer, idx) => {
                  const isOn = tweakLayers[idx];
                  return (
                    <button
                      key={layer.name}
                      type="button"
                      className={`ead-tweak_row${isOn ? ' is-on' : ''}`}
                      onClick={() => toggleLayer(idx)}
                    >
                      <div className="ead-tweak_row_left">
                        <span className="ead-tweak_switch" aria-hidden="true" />
                        <span>{layer.name}</span>
                      </div>
                      <span className="ead-tweak_val">{layer.meta}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 03 Preview: Maps & Environmental Insights */}
          {activeStep === 2 && (
            <div className="ead-canvas_overlay">
              <div className="ead-output_grid">
                {WORKFLOW_STEPS[2].outputs.map((out) => (
                  <div key={out.label} className="ead-output_card">
                    <CheckCircle2 size={15} className="ead-output_check" aria-hidden="true" />
                    <strong>{out.label}</strong>
                    <span>{out.format}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom-center EDP Data Discovery Status Bar */}
          <div className="ead-canvas_prompt">
            <div className="ead-canvas_prompt_head">
              <Globe size={12} aria-hidden="true" />
              <span>Explore Data</span>
            </div>
            <div className="ead-canvas_prompt_body">
              <span className="ead-canvas_prompt_txt">
                {reducedMotion ? STATUS_TEXT : STATUS_TEXT.slice(0, typedCount)}
              </span>
              <span className="ead-canvas_cursor" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Right Column: QUICK ACCESS */}
        <div ref={rightColRef} className="ead-workflow_right">
          <div className="ead-workflow_right_top">
            <span className="ead-workflow_eyebrow">QUICK ACCESS</span>
            <h2 className="ead-workflow_h2">
              <span
                ref={(el) => {
                  headlineLinesRef.current[0] = el;
                }}
                className="ead-h2_line"
              >
                Discover.{' '}
              </span>
              <span
                ref={(el) => {
                  headlineLinesRef.current[1] = el;
                }}
                className="ead-h2_line"
              >
                Explore.{' '}
              </span>
              <span
                ref={(el) => {
                  headlineLinesRef.current[2] = el;
                }}
                className="ead-h2_line"
              >
                Understand.
              </span>
            </h2>
            <p className="ead-workflow_sub">
              Your gateway to environmental datasets, geospatial information, and digital
              applications—all in one connected platform.
            </p>
          </div>

          <div className="ead-workflow_steps" role="tablist" aria-label="Quick Access steps">
            {WORKFLOW_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = idx === activeStep;
              return (
                <button
                  key={step.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`ead-step_row${isActive ? ' is-active' : ''}`}
                  onClick={() => handleSelectStep(idx)}
                >
                  <div className="ead-step_rail" aria-hidden="true">
                    <span className="ead-step_node">
                      <span className="ead-step_node_dash" />
                      <Icon size={14} />
                    </span>
                    {idx < WORKFLOW_STEPS.length - 1 && <span className="ead-step_line" />}
                  </div>

                  <div className="ead-step_card">
                    <div className="ead-step_head">
                      <h3 className="ead-step_title">{step.title}</h3>
                    </div>
                    <div className="ead-step_panel">
                      <div className="ead-step_panel_inner">
                        <p className="ead-step_desc">{step.desc}</p>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="ead-workflow_ctas">
            <a href="#card" className="button">
              Explore the Platform
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
