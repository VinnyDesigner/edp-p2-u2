import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SectionOverlapTransition({ reducedMotion = false }) {
  useEffect(() => {
    if (reducedMotion) return undefined;

    const workflowEl = document.querySelector('#workflow');
    const featuredEl = document.querySelector('#featured-canvas');
    const solutionsEl = document.querySelector('#solutions');
    if (!workflowEl || !featuredEl) return undefined;

    let ctx;
    const rafId = requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        gsap.set(workflowEl, {
          transformOrigin: 'center center',
        });

        gsap.set(featuredEl, {
          transformOrigin: 'left top',
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: featuredEl,
            start: 'top bottom',
            end: 'top top',
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        // Quick Access stays pinned & stationary, subtly receding in place behind the incoming panel
        tl.fromTo(
          workflowEl,
          {
            scale: 1,
            opacity: 1,
            filter: 'brightness(1)',
          },
          {
            scale: 0.94,
            opacity: 0.65,
            filter: 'brightness(0.75)',
            ease: 'none',
            duration: 1,
          },
          0
        );

        // Featured Applications rises directly over stationary Quick Access as a tilted panel
        tl.fromTo(
          featuredEl,
          {
            rotationZ: 4,
            scale: 0.94,
            borderRadius: '32px 32px 0 0',
            boxShadow: '0 -44px 110px rgba(0, 0, 0, 0.78)',
          },
          {
            rotationZ: 0,
            scale: 1,
            borderRadius: '0px',
            boxShadow: '0 -8px 24px rgba(0, 0, 0, 0.2)',
            ease: 'none',
            duration: 1,
            clearProps: 'transform,borderRadius',
          },
          0
        );

        // Featured Applications -> Catalogue (SolutionsSection) Grail panel overlay transition
        if (solutionsEl) {
          const featuredBg = featuredEl.querySelector('.featured-canvas__sticky-background');
          const featuredDock = featuredEl.querySelector('.featured-canvas__sticky-dock');

          gsap.set(solutionsEl, {
            transformOrigin: 'left top',
          });

          const catTl = gsap.timeline({
            scrollTrigger: {
              trigger: solutionsEl,
              start: 'top bottom',
              end: 'top top',
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });

          const featuredTargets = [featuredBg, featuredDock].filter(Boolean);
          if (featuredTargets.length) {
            catTl.fromTo(
              featuredTargets,
              {
                scale: 1,
                opacity: 1,
                filter: 'brightness(1)',
              },
              {
                scale: 0.94,
                opacity: 0.6,
                filter: 'brightness(0.72)',
                ease: 'none',
                duration: 1,
                clearProps: 'transform,opacity,filter',
              },
              0
            );
          }

          catTl.fromTo(
            solutionsEl,
            {
              rotationZ: 4,
              scale: 0.94,
              borderRadius: '32px 32px 0 0',
              boxShadow: '0 -44px 110px rgba(0, 0, 0, 0.45)',
            },
            {
              rotationZ: 0,
              scale: 1,
              borderRadius: '0px',
              boxShadow: '0 -8px 24px rgba(0, 0, 0, 0.12)',
              ease: 'none',
              duration: 1,
              clearProps: 'transform,borderRadius',
            },
            0
          );
        }
      });

      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (ctx) ctx.revert();
    };
  }, [reducedMotion]);

  return null;
}
