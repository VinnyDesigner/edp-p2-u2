import React, { useState } from 'react';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useLenis } from './hooks/useLenis';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import HeroToQuickAccessTransition from './components/common/HeroToQuickAccessTransition';
import SectionOverlapTransition from './components/common/SectionOverlapTransition';
import WorkflowSection from './components/sections/WorkflowSection';
import FeaturedCanvasSection from './components/sections/FeaturedCanvasSection';
import SolutionsSection from './components/sections/SolutionsSection';
import AccessPopup from './components/modals/AccessPopup';
import MembershipPopup from './components/modals/MembershipPopup';

export default function App() {
  const reducedMotion = useReducedMotion();
  useLenis(reducedMotion);

  const [accessOpen, setAccessOpen] = useState(false);
  const [membershipOpen, setMembershipOpen] = useState(false);

  const openAccess = () => setAccessOpen(true);

  return (
    <div className="page-wrapper">
      <Navbar
        onOpenAccess={openAccess}
        onOpenMembership={() => setMembershipOpen(true)}
        reducedMotion={reducedMotion}
      />

      <Hero onOpenAccess={openAccess} reducedMotion={reducedMotion} />
      <HeroToQuickAccessTransition reducedMotion={reducedMotion} />

      <main className="main-wrapper">
        <WorkflowSection onOpenAccess={openAccess} reducedMotion={reducedMotion} />
        <SectionOverlapTransition reducedMotion={reducedMotion} />
        <FeaturedCanvasSection onOpenAccess={openAccess} reducedMotion={reducedMotion} />
        <SolutionsSection reducedMotion={reducedMotion} />
      </main>

      <Footer onOpenAccess={openAccess} reducedMotion={reducedMotion} />

      <AccessPopup open={accessOpen} onClose={() => setAccessOpen(false)} />
      <MembershipPopup
        open={membershipOpen}
        onClose={() => setMembershipOpen(false)}
        onApply={openAccess}
      />
    </div>
  );
}
