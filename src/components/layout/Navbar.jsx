import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import brandLogoDark from '../../assets/brand-logo.png';
import brandLogoWhite from '../../assets/brand-logo-white.png';

export default function Navbar({ onOpenAccess, reducedMotion = false }) {
  const navRef = useRef(null);
  const [inverted, setInverted] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const navEl = navRef.current;
    if (!navEl) return undefined;

    const updatePolarity = () => {
      const stack = document.elementsFromPoint(window.innerWidth * 0.5, 32);
      const underlying = stack.find(
        (el) => !el.closest('.nav') && !el.closest('.hero-transition-layer')
      );
      const isOverLight = Boolean(underlying && underlying.closest('.theme-invert'));
      setInverted(isOverLight);
    };

    updatePolarity();

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        onUpdate: updatePolarity,
      });
    }, navRef);

    window.addEventListener('scroll', updatePolarity, { passive: true });
    window.addEventListener('resize', updatePolarity);

    return () => {
      window.removeEventListener('scroll', updatePolarity);
      window.removeEventListener('resize', updatePolarity);
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <nav
      ref={navRef}
      className={`nav${inverted ? ' is-inverted' : ''}`}
      aria-label="Primary navigation"
    >
      <div className="nav_inner">
        <a href="#top" className="nav_brand">
          <img
            src={inverted ? brandLogoDark : brandLogoWhite}
            alt="Environment Agency - Abu Dhabi"
            className="nav_logo_img"
          />
        </a>

        <div className="nav_links">
          <a href="#top" className="nav_link">
            Home
          </a>
          <a href="#featured-canvas" className="nav_link">
            Applications
          </a>
          <a href="#solutions" className="nav_link">
            Catalogue
          </a>
          <a href="#workflow" className="nav_link">
            About
          </a>
          <a href="mailto:contact@tamm.abudhabi" className="nav_link">
            Contact Us
          </a>
        </div>

        <div className="nav_actions">
          <button type="button" className="button nav_cta" onClick={onOpenAccess}>
            Sign In
          </button>
          <button
            type="button"
            className={`nav_burger${menuOpen ? ' is-open' : ''}`}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="nav_mobile_drawer">
          <a href="#top" className="nav_mobile_item" onClick={() => setMenuOpen(false)}>
            Home
          </a>
          <a href="#featured-canvas" className="nav_mobile_item" onClick={() => setMenuOpen(false)}>
            Applications
          </a>
          <a href="#solutions" className="nav_mobile_item" onClick={() => setMenuOpen(false)}>
            Catalogue
          </a>
          <a href="#workflow" className="nav_mobile_item" onClick={() => setMenuOpen(false)}>
            About
          </a>
          <a href="#faq" className="nav_mobile_item" onClick={() => setMenuOpen(false)}>
            Contact Us
          </a>
          <button
            type="button"
            className="button"
            onClick={() => {
              setMenuOpen(false);
              onOpenAccess();
            }}
          >
            Sign In
          </button>
        </div>
      )}
    </nav>
  );
}
