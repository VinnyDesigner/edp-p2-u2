import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';

export default function AccessPopup({ open, onClose }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setEmail('');
    setName('');
    onClose();
  };

  return (
    <div className="modal_backdrop" role="dialog" aria-modal="true" aria-labelledby="access-title">
      <div className="modal_card">
        <button
          type="button"
          className="modal_close"
          aria-label="Close modal"
          onClick={resetAndClose}
        >
          <X size={20} />
        </button>

        {!submitted ? (
          <>
            <span className="section_eyebrow">Invite-Only Waitlist</span>
            <h2 id="access-title" className="modal_title">
              Get early access
            </h2>
            <p className="modal_copy">
              Applications are reviewed periodically. Enter your details to request Moto Card
              membership.
            </p>
            <form onSubmit={handleSubmit} className="modal_form">
              <input
                type="text"
                className="modal_input"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="email"
                className="modal_input"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="button modal_submit">
                Submit Application
              </button>
            </form>
          </>
        ) : (
          <div className="modal_success">
            <CheckCircle2 size={36} />
            <h3>Application Received</h3>
            <p className="modal_copy">
              Thank you{name ? `, ${name}` : ''}. Your request for Moto Membership has been logged.
            </p>
            <button type="button" className="button" onClick={resetAndClose}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
