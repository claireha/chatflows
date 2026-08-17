import React from 'react';

interface AssistantIconProps {
  className?: string;
  size?: number;
  color?: string;
}

export const AssistantIcon: React.FC<AssistantIconProps> = ({ className = "", size = 16, color = "#FB31A7" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 16 16" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_6989_167)">
        <path 
          d="M15.2641 7.52001C11.5627 7.52001 8.46939 4.32332 8.46939 0.491712C8.46939 0.226701 8.25606 0.00585938 8.00006 0.00585938C7.74406 0.00585938 7.53072 0.226701 7.53072 0.491712C7.53072 4.32332 4.43739 7.52001 0.736057 7.52001C0.474724 7.52001 0.266724 7.74085 0.266724 8.00586C0.266724 8.27639 0.474724 8.49171 0.736057 8.49171C4.43739 8.49171 7.53072 11.6884 7.53072 15.52C7.53072 15.785 7.74406 16.0059 8.00006 16.0059C8.25606 16.0059 8.46939 15.785 8.46939 15.52C8.46939 11.6884 11.5627 8.49171 15.2641 8.49171C15.5254 8.49171 15.7334 8.27087 15.7334 8.00586C15.7334 7.73533 15.5254 7.52001 15.2641 7.52001Z" 
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_6989_167">
          <rect width="16" height="16" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
};