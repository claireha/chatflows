import React from 'react';

const ReplaceMediaIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* top-right square */}
    <rect x="14" y="2" width="8" height="8" rx="2" />
    {/* bottom-left square */}
    <rect x="2" y="14" width="8" height="8" rx="2" />
    {/* arrow curving from bottom-left area up to the top-right square */}
    <path d="M2 10V6a2 2 0 0 1 2-2h6" />
    <path d="m7 1 3 3-3 3" />
    {/* arrow curving from top-right area down to the bottom-left square */}
    <path d="M22 14v4a2 2 0 0 1-2 2h-6" />
    <path d="m17 23-3-3 3-3" />
  </svg>
);

export default ReplaceMediaIcon;
