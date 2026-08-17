import React from 'react';

interface StatusToggleProps {
  enabled: boolean;
  onToggle?: () => void;
}

export const StatusToggle: React.FC<StatusToggleProps> = ({ enabled, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`relative w-[44px] h-[22px] rounded-full transition-colors duration-250 ease-in-out ${
        enabled
          ? 'bg-[#141414]'
          : 'bg-[#cbd6d8]'
      }`}
      aria-label={enabled ? 'Enabled' : 'Disabled'}
      role="switch"
      aria-checked={enabled}
    >
      {enabled && (
        <span className="absolute left-[6px] top-1/2 -translate-y-1/2 text-[8px] font-bold text-white uppercase tracking-wide">
          on
        </span>
      )}
      <div
        className={`absolute top-[2px] w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-transform duration-250 ease-in-out ${
          enabled
            ? 'translate-x-[23px]'
            : 'translate-x-[2px]'
        }`}
      />
    </button>
  );
};
