import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { SecondaryNavigation } from './SecondaryNavigation';
import { NavigationSection } from '../data/navigationData';
import { ChevronRight } from 'lucide-react';

interface NavigationItemProps {
  icon: string | React.ComponentType<{ className?: string; size?: number }>;
  label?: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
  isExpanded?: boolean;
  sections?: NavigationSection[];
  itemId?: string;
  isPopoverOpen?: boolean;
  onPopoverToggle?: () => void;
  onPopoverHover?: (itemId: string) => void;
  onBookmarkClick?: (itemId: string, itemLabel: string, sectionTitle: string) => void;
  isItemBookmarked?: (itemId: string) => boolean;
}

export const NavigationItem: React.FC<NavigationItemProps> = ({
  icon,
  label,
  isActive = false,
  onClick,
  className = "",
  isExpanded = false,
  sections,
  itemId,
  isPopoverOpen = false,
  onPopoverToggle,
  onPopoverHover,
  onBookmarkClick,
  isItemBookmarked
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  
  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setIsHovered(true);
    // Call onPopoverHover for both expanded and collapsed modes
    if (onPopoverHover && itemId && sections && (sections.length > 0 || itemId === 'bookmarks')) {
      onPopoverHover(itemId);
    }
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsHovered(false);
    }, isExpanded ? 150 : 250); // Longer delay for collapsed state to prevent flickering
    setHoverTimeout(timeout);
  };

  const handleExpandedClick = () => {
    if (sections && (sections.length > 0 || itemId === 'bookmarks') && onPopoverToggle) {
      onPopoverToggle();
    }
    onClick?.();
  };

  const handleItemClick = (itemId: string) => {
    console.log('Secondary nav item clicked:', itemId);
  };

  const shouldShowPopover = !isExpanded && sections && (sections.length > 0 || itemId === 'bookmarks');
  const shouldShowClickPopover = isExpanded && sections && (sections.length > 0 || itemId === 'bookmarks');
  
  if (shouldShowPopover) {
    return (
      <Popover open={isHovered} onOpenChange={setIsHovered}>
        <PopoverTrigger asChild>
          <button
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`items-center rounded-md flex min-h-10 w-full gap-3 mt-3 px-3 py-2 hover:bg-sidebar-accent transition-colors focus:outline-none ${
              isActive ? 'bg-[hsl(var(--active-overlay))]' : ''
            } ${className}`}
          >
            <div className="flex min-h-6 w-4 items-center justify-center flex-shrink-0">
              {typeof icon === 'string' ? (
                <img
                  src={icon}
                  alt="Navigation icon"
                  className="aspect-[1] object-contain w-4"
                />
              ) : (
                React.createElement(icon, { 
                  className: "text-sidebar-foreground", 
                  size: 16 
                })
              )}
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent 
          side="right" 
          align="start"
          alignOffset={-40}
          sideOffset={16}
          className="p-0 border-0 bg-sidebar shadow-lg w-56"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <SecondaryNavigation
            title={label || ''}
            sections={sections}
            onItemClick={handleItemClick}
            parentId={itemId}
            onBookmarkClick={onBookmarkClick}
            isItemBookmarked={isItemBookmarked}
            isExpanded={isExpanded}
          />
        </PopoverContent>
      </Popover>
    );
  }

  if (shouldShowClickPopover) {
    return (
      <Popover open={isPopoverOpen}>
        <PopoverTrigger asChild>
          <button
            onClick={handleExpandedClick}
            onMouseEnter={handleMouseEnter}
            className={`items-center rounded-md flex min-h-10 w-full gap-3 mt-3 px-3 py-2 hover:bg-sidebar-accent transition-colors focus:outline-none group ${
              isActive ? 'bg-[hsl(var(--active-overlay))]' : ''
            } ${className}`}
          >
            <div className="flex min-h-6 w-4 items-center justify-start flex-shrink-0">
              {typeof icon === 'string' ? (
                <img
                  src={icon}
                  alt="Navigation icon"
                  className="aspect-[1] object-contain w-4"
                />
              ) : (
                React.createElement(icon, { 
                  className: "text-sidebar-foreground", 
                  size: 16 
                })
              )}
            </div>
            {label && (
              <span className="text-sidebar-foreground text-sm font-light truncate flex-1 text-left leading-6">
                {label}
              </span>
            )}
            <ChevronRight 
              className={`w-4 h-4 text-sidebar-foreground transition-opacity duration-200 ${
                isPopoverOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`} 
            />
          </button>
        </PopoverTrigger>
        <PopoverContent 
          side="right" 
          align="start"
          alignOffset={-5}
          sideOffset={20}
          className="p-0 border-0 bg-sidebar shadow-lg w-56"
          data-navigation-popover="true"
        >
          <SecondaryNavigation
            title={label || ''}
            sections={sections}
            onItemClick={handleItemClick}
            parentId={itemId}
            onBookmarkClick={onBookmarkClick}
            isItemBookmarked={isItemBookmarked}
            isExpanded={isExpanded}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`items-center rounded-md flex min-h-10 w-full gap-3 mt-3 px-3 py-2 hover:bg-sidebar-accent transition-colors focus:outline-none ${
        isActive ? 'bg-[hsl(var(--active-overlay))]' : ''
      } ${className}`}
    >
      <div className="flex min-h-6 w-4 items-center justify-center flex-shrink-0">
        {typeof icon === 'string' ? (
          <img
            src={icon}
            alt="Navigation icon"
            className="aspect-[1] object-contain w-4"
          />
        ) : (
          React.createElement(icon, { 
            className: "text-sidebar-foreground", 
            size: 16 
          })
        )}
      </div>
      {isExpanded && label && (
        <span className="text-sidebar-foreground text-sm font-light truncate leading-6">
          {label}
        </span>
      )}
    </button>
  );
};
