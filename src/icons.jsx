/* Minimal inline icons. Platform glyphs are simplified, non-branded marks
   used purely as labels (each renders inside a colored chip). */

const Icon = ({ children, size = 16, stroke = 1.5, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

const IconArrow = (p) => <Icon {...p}><path d="M5 12h14M13 6l6 6-6 6"/></Icon>;
const IconCheck = (p) => <Icon {...p}><path d="M5 12.5l4.5 4.5L19 7"/></Icon>;
const IconSparkle = (p) => <Icon {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/></Icon>;
const IconCal = (p) => <Icon {...p}><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/></Icon>;
const IconChart = (p) => <Icon {...p}><path d="M4 19V5M4 19h16M8 15v-4M12 15V8M16 15v-7"/></Icon>;
const IconBolt = (p) => <Icon {...p}><path d="M13 3L4 14h7l-1 7 9-11h-7l1-7z"/></Icon>;
const IconLayers = (p) => <Icon {...p}><path d="M12 3L3 8l9 5 9-5-9-5zM3 13l9 5 9-5M3 18l9 5 9-5"/></Icon>;
const IconGlobe = (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18"/></Icon>;
const IconBrain = (p) => <Icon {...p}><path d="M9 4a3 3 0 00-3 3v1a3 3 0 00-2 2.8v.4A3 3 0 006 14v.5A3 3 0 009 17.5V20"/><path d="M15 4a3 3 0 013 3v1a3 3 0 012 2.8v.4a3 3 0 01-2 2.8v.5A3 3 0 0115 17.5V20"/><path d="M9 4h6M9 20h6"/></Icon>;
const IconImg = (p) => <Icon {...p}><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="M3 17l5-5 4 4 3-3 6 6"/></Icon>;
const IconShield = (p) => <Icon {...p}><path d="M12 3l8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z"/></Icon>;
const IconChat = (p) => <Icon {...p}><path d="M4 5h16v11H8l-4 4V5z"/></Icon>;
const IconPlus = (p) => <Icon {...p}><path d="M12 5v14M5 12h14"/></Icon>;
const IconMinus = (p) => <Icon {...p}><path d="M5 12h14"/></Icon>;
const IconDots = (p) => <Icon {...p}><circle cx="6" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="18" cy="12" r="1"/></Icon>;
const IconHeart = (p) => <Icon {...p}><path d="M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z"/></Icon>;
const IconBubble = (p) => <Icon {...p}><path d="M4 5h16v11H9l-5 4V5z"/></Icon>;
const IconRepeat = (p) => <Icon {...p}><path d="M3 9l3-3 3 3M6 6v9a3 3 0 003 3h7M21 15l-3 3-3-3M18 18V9a3 3 0 00-3-3H8"/></Icon>;
const IconBookmark = (p) => <Icon {...p}><path d="M6 4h12v17l-6-4-6 4V4z"/></Icon>;
const IconSend = (p) => <Icon {...p}><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></Icon>;
const IconPlay = (p) => <Icon {...p}><path d="M7 4l13 8-13 8V4z" fill="currentColor"/></Icon>;
const IconMusic = (p) => <Icon {...p}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></Icon>;
const IconStar = (p) => <Icon {...p}><path d="M12 3l2.7 5.7 6.3.9-4.6 4.4 1.1 6.2L12 17.3 6.5 20.2l1.1-6.2L3 9.6l6.3-.9L12 3z"/></Icon>;

/* Simple solid-fill platform mark components.
   Not real logos — abstract glyphs that read as the platform via color + shape. */
const PlatformGlyph = ({ kind, size = 18 }) => {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "currentColor" };
  switch (kind) {
    case "facebook":
      return (
        <svg {...common}><path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.6v-2.7c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8.2v3h2.5V21h2.8z"/></svg>
      );
    case "instagram":
      return (
        <svg {...common}><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="17.2" cy="6.8" r="1.1"/></svg>
      );
    case "linkedin":
      return (
        <svg {...common}><rect x="3" y="3" width="18" height="18" rx="3"/><g fill="#fff"><circle cx="7.5" cy="8.3" r="1.5"/><rect x="6.2" y="10.6" width="2.6" height="7.2"/><path d="M11 10.6h2.5v1c.5-.8 1.5-1.2 2.6-1.2 2.1 0 3 1.4 3 3.6v3.8h-2.6v-3.3c0-1-.3-1.6-1.2-1.6-.9 0-1.4.6-1.4 1.6v3.3H11v-7.2z"/></g></svg>
      );
    case "tiktok":
      return (
        <svg {...common}><path d="M14 3v10.5a3.5 3.5 0 11-3.5-3.5V8a5.5 5.5 0 105.5 5.5V8.4c1.1.7 2.4 1.1 3.7 1.1V7c-1.9 0-3.4-1.6-3.7-4h-2z"/></svg>
      );
    default: return null;
  }
};

Object.assign(window, {
  Icon, IconArrow, IconCheck, IconSparkle, IconCal, IconChart, IconBolt,
  IconLayers, IconGlobe, IconBrain, IconImg, IconShield, IconChat, IconPlus,
  IconMinus, IconDots, IconHeart, IconBubble, IconRepeat, IconBookmark,
  IconSend, IconPlay, IconMusic, IconStar, PlatformGlyph,
});
