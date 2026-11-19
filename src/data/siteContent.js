export const EYEBROW_PHRASES = [
  'Visa Infinite · Self-Custodial',
  'Zero FX Fees · Global Credit',
  '24/7 Private Concierge',
];

export const CURRENCIES = [
  { code: 'JPY', label: '¥20,000', city: 'Tokyo' },
  { code: 'CHF', label: 'CHF 40.000', city: 'Zurich' },
  { code: 'GBP', label: '£15.000', city: 'London' },
  { code: 'KRW', label: '₩22.000', city: 'Seoul' },
  { code: 'EUR', label: '€12.500', city: 'Paris' },
  { code: 'TRY', label: '₺28.000', city: 'Istanbul' },
];

export const NUMBERS_PILLARS = [
  {
    title: 'Frictionless',
    desc: 'Collateral-backed credit settled monthly without draining your balance on every swipe.',
  },
  {
    title: 'One system everywhere',
    desc: 'Accepted globally wherever Visa Infinite is welcomed, online or in person.',
  },
  {
    title: 'Global spend',
    desc: '0% FX fees built into every currency conversion across 150+ countries.',
  },
];

export const TIMEZONES = [
  { key: 'edt', zone: 'America/New_York', label: 'EDT' },
  { key: 'cest', zone: 'Europe/Warsaw', label: 'CEST' },
  { key: 'gst', zone: 'Asia/Dubai', label: 'GST' },
  { key: 'jst', zone: 'Asia/Tokyo', label: 'JST' },
];

export const MARQUEE_BENEFITS = [
  'One system everywhere',
  'Global spend',
  'Frictionless',
  '0% FX globally',
  'Global support',
  'Dedicated concierge',
  'Private inventory',
  'Premium Card',
];

export const MADE_CATEGORIES = [
  {
    id: '01',
    title: 'Hotels',
    desc: 'Preferred stays, selected rates, and member benefits.',
    palette: ['#182028', '#47649e', '#a3afbd'],
    tag: 'Preferred Stays',
  },
  {
    id: '02',
    title: 'Dining',
    desc: 'Access connected to restaurants and hospitality moments.',
    palette: ['#1f1a18', '#6b5344', '#c9b39c'],
    tag: 'Private Tables',
  },
  {
    id: '03',
    title: 'Travel',
    desc: 'Benefits designed around movement between cities and countries.',
    palette: ['#141b24', '#31475e', '#9cb2c9'],
    tag: 'Seamless Transit',
  },
  {
    id: '04',
    title: 'Experiences',
    desc: 'Selected access across retail, culture, and events.',
    palette: ['#1a1722', '#4c3f63', '#b3a4cc'],
    tag: 'Culture & Events',
  },
  {
    id: '05',
    title: 'Wellness',
    desc: 'Selected access to spaces and services designed for recovery, balance, and wellbeing.',
    palette: ['#14201c', '#35574b', '#9bc2b4'],
    tag: 'Recovery & Balance',
  },
];

export const LUXURY_TAGS = ['LUXURY', 'TRAVEL', 'DINING', 'LOCAL REWARDS'];

export const FAQ_GROUPS = [
  {
    category: 'ABOUT MOTO',
    items: [
      {
        q: 'What is Moto?',
        a: 'Moto is infrastructure for how you move. At home, abroad, and everywhere in between, Moto gives its members a quieter way to move through the world. It starts with a Visa Infinite card built for global spending, with zero FX fees and one system that works wherever you go.',
      },
      {
        q: 'How does Moto work?',
        a: 'Moto combines a Visa Infinite credit card and a self-custodial wallet into a single app. Deposit funds, receive a collateral-backed credit limit, and use your card anywhere Visa is accepted. You spend on credit and settle your balance monthly.',
      },
      {
        q: 'Do I need to own crypto to use Moto?',
        a: 'No. Moto is built for both mainstream and crypto-native members. You do not need an external wallet, prior crypto experience, or an understanding of DeFi. Bank accounts are also supported.',
      },
    ],
  },
  {
    category: 'COSTS & BENEFITS',
    items: [
      {
        q: 'What does Moto Membership cost?',
        a: 'Moto Membership costs $2,500 per year or $250 per month. Annual membership includes two months complimentary.',
      },
      {
        q: 'What does Moto Membership include?',
        a: 'Members earn points on every dollar spent: 1x points on all purchases, 3x on dining and retail, and 5x on travel. Points can be redeemed for flights, hotels, or up to $200 per month in statement credits, alongside 24/7 dedicated concierge access.',
      },
      {
        q: 'How can I apply for Moto Membership?',
        a: 'Applications are open on the Moto website and reviewed periodically. If your application is approved, you will receive an email with the next steps to activate your membership.',
      },
    ],
  },
  {
    category: 'USAGE',
    items: [
      {
        q: 'How do I fund my Moto account?',
        a: 'You can fund your account with fiat or digital assets like USDC. Moto offers Virtual IBANs for EUR transfers and dedicated deposit addresses for supported networks.',
      },
      {
        q: 'How long do deposits and withdrawals take?',
        a: 'Processing time depends on the asset, network, and withdrawal method. Network conditions and additional security or compliance checks may extend processing times.',
      },
      {
        q: 'Why is my transaction under review?',
        a: 'Some transactions require an additional security or compliance review to protect Moto members and platform integrity. Most reviews are completed within 24 hours.',
      },
      {
        q: 'How does identity verification work?',
        a: 'Every Moto member completes identity verification during onboarding to meet regulatory obligations and keep the platform secure.',
      },
      {
        q: 'What happens if I send funds to the wrong address?',
        a: 'Onchain transactions are irreversible. Funds sent to an incorrect address, unsupported asset, or unsupported network may not be recoverable. Always verify transfer details before confirming.',
      },
      {
        q: 'How does Moto protect my account and personal information?',
        a: 'Moto uses encrypted communications, device-bound passkeys, multisignature wallet infrastructure, and ongoing fraud monitoring.',
      },
      {
        q: 'What should I do if a payment is declined?',
        a: 'A payment can be declined due to insufficient available credit, a merchant restriction, a security check, a payment-network issue, or a temporary service interruption. Contact 24/7 concierge support in-app for immediate assistance.',
      },
    ],
  },
];

export const FOOTER_COLUMNS = [
  {
    title: 'Navigation',
    links: [
      { label: 'Home', href: '#top' },
      { label: 'About the Platform', href: '#workflow' },
      { label: 'Applications', href: '#featured-canvas' },
      { label: 'Data Catalogue', href: '#solutions' },
      { label: 'Contact Us', href: 'mailto:contact@tamm.abudhabi' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Environmental Datasets', href: '#solutions' },
      { label: 'Geospatial Information', href: '#featured-canvas' },
      { label: 'Privacy Policy', href: 'https://www.ead.gov.ae/en/privacy-policy', external: true },
      { label: 'Terms of Use', href: 'https://www.ead.gov.ae/en/terms-and-conditions', external: true },
    ],
  },
  {
    title: 'Contact',
    links: [
      { label: '800 555', href: 'tel:800555' },
      { label: 'contact@tamm.abudhabi', href: 'mailto:contact@tamm.abudhabi' },
      { label: 'ead.gov.ae', href: 'https://www.ead.gov.ae/', external: true },
    ],
  },
  {
    title: 'Socials',
    links: [
      { label: 'Instagram', href: 'https://www.instagram.com/eadabudhabi', external: true },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/company/environment-agency-abu-dhabi', external: true },
      { label: 'X', href: 'https://twitter.com/EADabudhabi', external: true },
    ],
  },
];
