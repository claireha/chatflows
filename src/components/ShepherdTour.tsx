import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';

interface TourStep {
  title: string;
  description: string;
  targetSelector: string;
  highlightSelector?: string;
  placement: 'right' | 'bottom';
  lastButtonLabel?: string;
}

const tourSteps: TourStep[] = [
  {
    title: 'Welcome to your new personalized sidebar',
    description: 'Your most-used tools are now front and center.',
    targetSelector: '[data-tour="sidebar"]',
    highlightSelector: '[data-tour="nav-items"]',
    placement: 'right',
  },
  {
    title: 'Everything else lives in "More"',
    description: 'Pin or unpin them anytime.',
    targetSelector: '[data-tour="more-menu"]',
    highlightSelector: '[data-tour="more-menu"]',
    placement: 'right',
  },
  {
    title: 'Switch back anytime',
    description: 'You can switch back to your previous sidebar anytime through your account menu.',
    targetSelector: '[data-tour="account-menu"]',
    highlightSelector: '[data-tour="account-menu"]',
    placement: 'bottom',
    lastButtonLabel: 'Got it',
  },
];

interface ShepherdTourProps {
  active: boolean;
  onComplete: () => void;
  customSteps?: TourStep[];
}

export const ShepherdTour: React.FC<ShepherdTourProps> = ({ active, onComplete, customSteps }) => {
  const steps = customSteps || tourSteps;
  const [step, setStep] = useState(0);
  const [positioned, setPositioned] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number; arrowSide: 'left' | 'top' }>({ top: 0, left: 0, arrowSide: 'left' });
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    const currentStep = steps[step];
    const target = document.querySelector(currentStep.targetSelector);
    if (!target) return;

    const rect = target.getBoundingClientRect();

    if (currentStep.placement === 'right') {
      const sidebar = document.querySelector('[data-tour="sidebar"]');
      const sidebarRight = sidebar ? sidebar.getBoundingClientRect().right : rect.right;
      // Use highlight element for vertical centering if available
      const highlightEl = currentStep.highlightSelector
        ? document.querySelector(currentStep.highlightSelector)
        : null;
      const verticalRect = highlightEl ? highlightEl.getBoundingClientRect() : rect;
      setPosition({
        top: verticalRect.top + verticalRect.height / 2,
        left: sidebarRight + 16,
        arrowSide: 'left',
      });
    } else {
      // bottom placement - right-align so it stays on screen
      setPosition({
        top: rect.bottom + 16,
        left: rect.right,
        arrowSide: 'top',
      });
    }

    // Update highlight rect
    const highlightEl = currentStep.highlightSelector
      ? document.querySelector(currentStep.highlightSelector)
      : null;
    setHighlightRect(highlightEl ? highlightEl.getBoundingClientRect() : null);

    setPositioned(true);
  }, [step, steps]);

  // Reset positioned state when step changes
  useEffect(() => {
    setPositioned(false);
  }, [step]);

  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(updatePosition, 150);
    window.addEventListener('resize', updatePosition);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePosition);
    };
  }, [active, step, updatePosition]);

  if (!active) return null;

  const currentStep = steps[step];
  const isLast = step === steps.length - 1;
  const isFirst = step === 0;

  const tooltipStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 9999,
    opacity: positioned ? 1 : 0,
    ...(currentStep.placement === 'right'
      ? { top: position.top, left: position.left, transform: 'translateY(-50%)' }
      : { top: position.top, right: window.innerWidth - position.left }
    ),
  };

  return (
    <>
      {/* Overlay - subtle, non-blocking */}
      <div className="fixed inset-0 z-[9998]" onClick={onComplete} />

      {/* Purple highlight border */}
      {positioned && highlightRect && (
        <div
          className="fixed z-[9998] rounded-lg pointer-events-none"
          style={{
            top: highlightRect.top - 4,
            left: highlightRect.left - 4,
            width: highlightRect.width + 8,
            height: highlightRect.height + 8,
            border: '2px solid #7C3AED',
            boxShadow: '0 0 12px rgba(124, 58, 237, 0.4)',
          }}
        />
      )}

      <div
        ref={tooltipRef}
        style={tooltipStyle}
        className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 max-w-[340px] w-[340px]"
      >
        {/* Arrow */}
        {position.arrowSide === 'left' && (
          <div
            className="absolute w-3 h-3 bg-white border-l border-b border-gray-200 rotate-45"
            style={{ left: -7, top: '50%', transform: 'translateY(-50%) rotate(45deg)' }}
          />
        )}
        {position.arrowSide === 'top' && (
          <div
            className="absolute w-3 h-3 bg-white border-l border-t border-gray-200 rotate-45"
            style={{ top: -7, right: 40, transform: 'rotate(45deg)' }}
          />
        )}

        {/* Close button */}
        <button
          onClick={onComplete}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close tour"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <h3 className="text-xl font-semibold text-gray-900 pr-8 mb-2">{currentStep.title}</h3>
        <p className="text-sm text-gray-500 mb-6">{currentStep.description}</p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {steps.length > 1 && <span className="text-sm text-gray-400">{step + 1} of {steps.length}</span>}
          <div className="flex gap-2">
            <button
              onClick={() => isLast ? onComplete() : setStep(step + 1)}
              className="px-5 py-2 text-sm font-semibold rounded-md bg-black text-white hover:bg-gray-800 transition-colors"
            >
              {isLast ? (currentStep.lastButtonLabel || 'Done') : 'Next'}
            </button>
            {!isFirst && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-5 py-2 text-sm font-semibold rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
