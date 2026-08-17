import React, { useState, useEffect } from 'react';

interface SidebarTransitionProps {
  isExpanded: boolean;
}

export const SidebarTransition: React.FC<SidebarTransitionProps> = ({ isExpanded }) => {
  const messages = [
    'Setting up your sidebar',
    'Organizing your bookmarks',
    'Finding your most used tools',
    'Finalizing',
    'Done.',
  ];

  const AnimatedDots = () => {
    const [dotCount, setDotCount] = useState(0);
    useEffect(() => {
      const interval = setInterval(() => {
        setDotCount((c) => (c + 1) % 4);
      }, 400);
      return () => clearInterval(interval);
    }, []);
    return <span>{'.'.repeat(dotCount)}</span>;
  };

  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => {
        if (i >= messages.length - 1) {
          clearInterval(interval);
          return i;
        }
        return i + 1;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav
      className={`fixed left-0 bottom-0 bg-secondary flex flex-col transition-all duration-200 ${isExpanded ? 'w-60' : 'w-16'}`}
      style={{ top: 'var(--toolbar-height)' }}
    >
      <div className="flex-1 flex flex-col px-3 pt-2">
        {isExpanded && (
          <p
            key={messageIndex}
            className="text-sidebar-foreground text-sm font-light mb-4 px-3 whitespace-nowrap"
            style={{ animation: 'messageSlideIn 0.4s ease-out both' }}
          >
            {messages[messageIndex]}{messageIndex < messages.length - 1 && <AnimatedDots />}
          </p>
        )}

        {/* Shimmer skeleton lines mimicking nav items */}
        <div className="w-full">
          {isExpanded ? (
            <>
              {/* Home */}
              <div className="h-6 w-4/5 rounded-md animate-shimmer mt-2.5" />
              {/* Divider */}
              <div className="h-px w-[188px] mx-auto my-3 bg-sidebar-border/30" />
              {/* Nav items alternating short/long */}
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className={`h-6 rounded-md animate-shimmer mt-2.5 ${i % 2 === 0 ? 'w-3/5' : 'w-4/5'}`} />
              ))}
              {/* More button */}
              <div className="h-6 w-2/5 rounded-md animate-shimmer mt-2.5" />
            </>
          ) : (
            <>
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-8 w-8 rounded-md animate-shimmer mt-1 mx-auto" />
              ))}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
