import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { FAQ_GROUPS } from '../../data/siteContent';

export default function FaqSection() {
  const [openId, setOpenId] = useState('0-0');

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="faq theme-invert">
      <div className="faq_inner">
        <div className="faq_header">
          <span className="section_eyebrow">Support &amp; Details</span>
          <h2 className="text-style-h2">
            FREQUENTLY
            <br />
            ASKED QUESTIONS
          </h2>
        </div>

        <div className="faq_groups">
          {FAQ_GROUPS.map((group, gIdx) => (
            <div key={group.category} className="faq_group">
              <h3 className="faq_group_title">{group.category}</h3>
              <div className="faq_list">
                {group.items.map((item, iIdx) => {
                  const id = `${gIdx}-${iIdx}`;
                  const isOpen = openId === id;
                  return (
                    <div key={id} className={`faq_item${isOpen ? ' is-open' : ''}`}>
                      <button
                        type="button"
                        className="faq_trigger"
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${id}`}
                        onClick={() => toggle(id)}
                      >
                        <span>{item.q}</span>
                        <span className="faq_icon" aria-hidden="true">
                          {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                        </span>
                      </button>
                      <div
                        id={`faq-panel-${id}`}
                        className="faq_panel"
                        aria-hidden={!isOpen}
                      >
                        <div className="faq_panel_inner">
                          <p className="faq_answer">{item.a}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
