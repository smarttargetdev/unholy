import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const AbbeyCrossIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className} 
    width={size} 
    height={size}
    stroke="currentColor" 
    strokeWidth="0.5"
  >
    <path d="M11 2h2v6h6v2h-6v12h-2V10H5V8h6V2z" />
    <circle cx="12" cy="9" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

export const MonkHoodIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} width={size} height={size}>
    <path d="M12 2C8 2 5 6 5 11c0 3 1.5 6 3 8v3h8v-3c1.5-2 3-5 3-8 0-5-3-9-7-9zm0 6c2.2 0 4 1.8 4 4 0 1.2-.5 2.2-1.3 3-.7.7-1.7 1-2.7 1s-2-.3-2.7-1c-.8-.8-1.3-1.8-1.3-3 0-2.2 1.8-4 4-4z" />
  </svg>
);

export const EvilNunIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} width={size} height={size}>
    <path d="M12 2C6.5 2 4 7 4 12c0 5 2 9 4 10h8c2-1 4-5 4-10 0-5-2.5-10-8-10z" opacity="0.9" />
    <path d="M7 6h10v3c0 3-2 5-5 5s-5-2-5-5V6z" fill="#f8fafc" />
    <path d="M9 13l-1.5 5 4.5-2 4.5 2L15 13c-1.5 1-4.5 1-6 0z" fill="#0f172a" />
    <circle cx="10" cy="9.5" r="1.2" fill="#ef4444" />
    <circle cx="14" cy="9.5" r="1.2" fill="#ef4444" />
    <path d="M10 7.5l2 1 2-1" stroke="#000" strokeWidth="1" fill="none" />
  </svg>
);

export const BellIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} width={size} height={size}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    <path d="M12 2v2" />
  </svg>
);

export const CandleIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} width={size} height={size}>
    <rect x="9" y="10" width="6" height="12" rx="1" fill="currentColor" fillOpacity="0.4" />
    <path d="M12 10V6" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 2c-1.5 2-2 3-2 4.5 0 1.4.9 2.5 2 2.5s2-1.1 2-2.5C14 5 13.5 4 12 2z" fill="#f59e0b" stroke="#f59e0b" />
  </svg>
);

export const ChaliceIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} width={size} height={size}>
    <path d="M6 3h12v4c0 4-3 7-6 7s-6-3-6-7V3zm5 11v5H8v2h8v-2h-3v-5c2.3-.5 4-2 4.7-4H6.3c.7 2 2.4 3.5 4.7 4z" />
    <circle cx="12" cy="7" r="1.5" fill="#fef08a" />
  </svg>
);

export const BookIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} width={size} height={size}>
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
    <path d="M6 6h10" />
    <path d="M6 10h10" />
    <path d="M6 14h6" />
  </svg>
);

export const RelicIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} width={size} height={size}>
    <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
    <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.3" />
    <path d="M12 9v6M9 12h6" strokeWidth="2" />
  </svg>
);

export const WaterGrateIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} width={size} height={size}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M7 3v18M12 3v18M17 3v18" strokeDasharray="3 3" />
    <path d="M3 8h18M3 13h18M3 18h18" />
  </svg>
);

export const TombstoneIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} width={size} height={size}>
    <path d="M6 21h12v-9a6 6 0 0 0-12 0v9z" opacity="0.8" />
    <path d="M11 7h2v6h-2zM9 9h6v2H9z" fill="#1c1917" />
    <path d="M4 21h16v2H4z" />
  </svg>
);

export const LeafPrunerIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} width={size} height={size}>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

export const DaggerIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} width={size} height={size}>
    <path d="m14.5 17.5 7-7a2.12 2.12 0 0 0-3-3l-7 7" />
    <path d="m4 20 3-3" />
    <path d="m6 16 2 2" />
    <path d="M11 11 3 19l2 2 8-8" fill="currentColor" fillOpacity="0.4" />
    <path d="M16 8l4 4" />
  </svg>
);

export const SkullIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} width={size} height={size}>
    <path d="M12 2a9 9 0 0 0-9 9c0 3.2 1.7 6 4.2 7.6.2.1.3.4.3.7l.5 2.7h8l.5-2.7c0-.3.2-.6.4-.7A9 9 0 0 0 21 11a9 9 0 0 0-9-9zm-3.5 12a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm7 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm-4.5 4v-2h2v2h-2z" />
  </svg>
);

export const VentIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} width={size} height={size}>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M7 8h10M7 12h10M7 16h10" />
  </svg>
);

export const SabotageIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} width={size} height={size}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" fill="#ef4444" fillOpacity="0.4" />
  </svg>
);

export const MapIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} width={size} height={size}>
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
    <line x1="9" x2="9" y1="3" y2="18" />
    <line x1="15" x2="15" y1="6" y2="21" />
  </svg>
);

export const VolumeOnIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} width={size} height={size}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);

export const VolumeOffIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} width={size} height={size}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="22" x2="16" y1="9" y2="15" />
    <line x1="16" x2="22" y1="9" y2="15" />
  </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} width={size} height={size}>
    <line x1="18" x2="6" y1="6" y2="18" />
    <line x1="6" x2="18" y1="6" y2="18" />
  </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} width={size} height={size}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const AlertTriangleIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} width={size} height={size}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" x2="12" y1="9" y2="13" />
    <line x1="12" x2="12.01" y1="17" y2="17" />
  </svg>
);

export const UserIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} width={size} height={size}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const SendIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} width={size} height={size}>
    <line x1="22" x2="11" y1="2" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

export const PlayIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} width={size} height={size}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

export const HolyWaterIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} width={size} height={size}>
    <path d="M10 2h4v3h-4z" fill="currentColor" fillOpacity="0.4" />
    <path d="M7 8a5 5 0 0 1 10 0v8a5 5 0 0 1-10 0V8z" />
    <path d="M12 11c-1.5 2-2 3-2 4 0 1.1.9 2 2 2s2-.9 2-2c0-1-1.5-2-2-4z" fill="#38bdf8" stroke="#0284c7" />
  </svg>
);

export const WoodSplintersIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} width={size} height={size}>
    <path d="M11 2h2v5h-2z" fill="#d97706" />
    <path d="M13 8l5-2-1 4-4 1z" fill="#b45309" />
    <path d="M11 9L6 7l1 4 4 1z" fill="#92400e" />
    <path d="M11 12h2v10h-2z" fill="#78350f" />
    <circle cx="12" cy="10" r="1.5" fill="#fef08a" />
  </svg>
);

export const ExorcismBookIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} width={size} height={size}>
    <rect x="4" y="3" width="16" height="18" rx="2" fill="currentColor" fillOpacity="0.2" />
    <path d="M12 7v8M8 10h8" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
    <path d="M16 3v18" strokeWidth="1" strokeDasharray="2 2" />
  </svg>
);

export const SacredCrossIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} width={size} height={size}>
    <path d="M10 2h4v6h5v4h-5v10h-4V12H5V8h5V2z" />
    <circle cx="12" cy="10" r="4" fill="none" stroke="#fef08a" strokeWidth="1" />
  </svg>
);

export const HolyGrailBloodIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} width={size} height={size}>
    <path d="M5 3h14v5c0 4.5-3.5 7.5-7 7.5S5 12.5 5 8V3z" fill="#eab308" />
    <path d="M11 15.5v5H8v2h8v-2h-3v-5c1.8-.3 3.3-1.1 4.3-2.5H6.7c1 1.4 2.5 2.2 4.3 2.5z" fill="#ca8a04" />
    <path d="M7 5h10v2c0 2.5-2.2 4.5-5 4.5S7 9.5 7 7V5z" fill="#dc2626" />
    <circle cx="12" cy="7.5" r="1.5" fill="#fca5a5" />
  </svg>
);

export const LevitateKillIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} width={size} height={size}>
    <path d="M12 3v4M8 5l4-2 4 2" stroke="#dc2626" strokeWidth="2" />
    <circle cx="12" cy="11" r="2.5" fill="#f87171" stroke="#dc2626" />
    <path d="M8 17c1.5-2 2.5-2 4-2s2.5 0 4 2v4H8v-4z" fill="#991b1b" stroke="#dc2626" />
    <path d="M5 21h14" stroke="#e11d48" strokeWidth="2" strokeDasharray="2 2" />
    <path d="M15 7l3 3M18 7l-3 3" stroke="#fca5a5" strokeWidth="1.5" />
  </svg>
);
