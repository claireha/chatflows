import React from 'react';

interface SalesIconProps {
  className?: string;
  size?: number;
}

export const SalesIcon: React.FC<SalesIconProps> = ({ className = "", size = 16 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 16 16" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="16" height="16" fill="white" fillOpacity="0.01" style={{mixBlendMode: "multiply"}} />
      <g clipPath="url(#clip0_6989_264)">
        <path 
          d="M14.4995 6.335H1.50054C1.22524 6.335 1 6.11 1 5.835V1.5C1 1.225 1.22524 1 1.50054 1H14.4995C14.7748 1 15 1.225 15 1.5V5.835C15 6.11 14.7748 6.335 14.4995 6.335ZM2.00107 5.335H13.9989V2H2.00107V5.335Z" 
          fill="currentColor"
        />
        <path 
          d="M13.5233 10.6651H2.48149C2.2062 10.6651 1.98096 10.4401 1.98096 10.1651V5.83008C1.98096 5.55508 2.2062 5.33008 2.48149 5.33008H13.5233C13.7986 5.33008 14.0239 5.55508 14.0239 5.83008V10.1651C14.0239 10.4401 13.7986 10.6651 13.5233 10.6651ZM2.98203 9.66508H13.0228V6.33008H2.98203V9.66508Z" 
          fill="currentColor"
        />
        <path 
          d="M12.5424 15H3.46269C3.1874 15 2.96216 14.775 2.96216 14.5V10.165C2.96216 9.89004 3.1874 9.66504 3.46269 9.66504H12.5424C12.8177 9.66504 13.043 9.89004 13.043 10.165V14.5C13.043 14.775 12.8177 15 12.5424 15ZM3.96323 14H12.0419V10.665H3.96323V14Z" 
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_6989_264">
          <rect width="14" height="14" fill="white" transform="translate(1 1)"/>
        </clipPath>
      </defs>
    </svg>
  );
};