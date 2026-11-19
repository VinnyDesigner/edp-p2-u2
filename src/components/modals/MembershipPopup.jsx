import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export default function MembershipPopup({ open, onClose, onApply }) {
  const [annual, setAnnual] = useState(true);

  useEffect(() => {
    if (!open) return undefined;
    const id = setInterval(() => {
      setAnnual((prev) => !prev);
    }, 3200);
    return () => clearInterval(id);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="modal_backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="membership-title"
    >
      <div className="modal_card">
        <button type="button" className="modal_close" aria-label="Close modal" onClick={onClose}>
          <X size={20} />
        </button>

        <span className="section_eyebrow">Visa Infinite · Metal</span>
        <h2 id="membership-title" className="modal_title">
          Moto Membership
        </h2>

        <div className="membership_price_row">
          <strong className="membership_price">{annual ? '$2,500' : '$250'}</strong>
          <span className="membership_cadence">
            {annual ? 'per year · 2 months complimentary' : 'per month · billed monthly'}
          </span>
        </div>

        <div className="membership_toggle">
          <button
            type="button"
            className={`membership_tab${annual ? ' is-active' : ''}`}
            onClick={() => setAnnual(true)}
          >
            Annual
          </button>
          <button
            type="button"
            className={`membership_tab${!annual ? ' is-active' : ''}`}
            onClick={() => setAnnual(false)}
          >
            Monthly
          </button>
        </div>

        <ul className="membership_perks">
          <li>0% FX fees globally across 150+ countries</li>
          <li>5x points on travel · 3x on dining &amp; retail · 1x everywhere</li>
          <li>24/7 dedicated private concierge &amp; airport lounge access</li>
          <li>Up to $200/month in statement credits</li>
        </ul>

        <button
          type="button"
          className="button modal_submit"
          onClick={() => {
            onClose();
            onApply();
          }}
        >
          Apply for Access
        </button>
      </div>
    </div>
  );
}
