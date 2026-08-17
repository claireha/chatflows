import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationItem } from './NavigationItem';
import { navigationItems } from '../data/navigationData';
import { ExpandCollapseIcon } from './icons/ExpandCollapseIcon';
import { NavPromoBanner } from './NavPromoBanner';

interface LeftNavigationProps {
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
  bookmarkedSections?: any[];
  onBookmarkClick?: (itemId: string, itemLabel: string, sectionTitle: string) => void;
  isItemBookmarked?: (itemId: string) => boolean;
  promoDismissed?: boolean;
  onDismissPromo?: () => void;
  onTryItOut?: () => void;
}

export const LeftNavigation: React.FC<LeftNavigationProps> = ({ 
  isExpanded = false, 
  onToggleExpanded,
  bookmarkedSections = [],
  onBookmarkClick,
  isItemBookmarked,
  promoDismissed = false,
  onDismissPromo,
  onTryItOut
}) => {
  const [activeItem, setActiveItem] = useState('home');
  const [activePopover, setActivePopover] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  // Close popover when clicking outside in expanded mode
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isExpanded && activePopover && navRef.current) {
        const target = event.target as Node;
        const isInsideNav = navRef.current.contains(target);
        const isInsideNavPopover = (target as Element)?.closest('[data-navigation-popover="true"]');
        
        if (!isInsideNav && !isInsideNavPopover) {
          setActivePopover(null);
        }
      }
    };

    if (isExpanded && activePopover) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isExpanded, activePopover]);

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
    if (itemId === 'home') {
      navigate('/');
    }
  };

  const handlePopoverToggle = (itemId: string) => {
    setActivePopover(activePopover === itemId ? null : itemId);
  };

  const handlePopoverHover = (itemId: string) => {
    if (activePopover && isExpanded) {
      setActivePopover(itemId);
    }
  };

  const handleItemHover = (itemId: string) => {
    // Clear active state when hovering in expanded mode with any active popover
    if (isExpanded && activePopover) {
      setActiveItem('');
    }
    
    // For expanded mode, switch popovers when one is already open
    const item = itemId === 'bookmarks' ? { sections: bookmarkedSections } : navigationItems.find(nav => nav.id === itemId);
    const hasValidSections = item && (item.sections?.length > 0 || itemId === 'bookmarks');
    
    if (isExpanded && activePopover && activePopover !== itemId && hasValidSections) {
      setActivePopover(itemId);
    }
  };

  return (
    <nav ref={navRef} className={`fixed left-0 bg-sidebar px-3 pt-2 pb-2 flex flex-col max-md:hidden transition-all duration-200 ${isExpanded ? 'w-[236px]' : 'w-16'}`} style={{ top: 'var(--toolbar-height)', height: 'calc(100vh - var(--toolbar-height))' }}>
      <div className="w-full flex-1 overflow-y-auto scrollbar-none">
        <NavigationItem
          icon={navigationItems[0].icon}
          label={navigationItems[0].label}
          isActive={activeItem === 'home'}
          onClick={() => handleItemClick('home')}
          className="mt-0"
          isExpanded={isExpanded}
          sections={navigationItems[0].sections}
          itemId="home"
          isPopoverOpen={activePopover === 'home'}
          onPopoverToggle={() => handlePopoverToggle('home')}
          onPopoverHover={handleItemHover}
        />
        
        {/* Bookmarks - positioned right under Home */}
        {(() => {
          const bookmarksItem = navigationItems.find(item => item.id === 'bookmarks');
          if (bookmarksItem) {
            return (
              <NavigationItem
                key={bookmarksItem.id}
                icon={bookmarksItem.icon}
                label={bookmarksItem.label}
                isActive={activeItem === 'bookmarks'}
                onClick={() => handleItemClick('bookmarks')}
                isExpanded={isExpanded}
                sections={bookmarkedSections}
                itemId="bookmarks"
                isPopoverOpen={activePopover === 'bookmarks'}
                onPopoverToggle={() => handlePopoverToggle('bookmarks')}
                onPopoverHover={handleItemHover}
                onBookmarkClick={onBookmarkClick}
                isItemBookmarked={isItemBookmarked}
              />
            );
          }
          return null;
        })()}
        
        <div className="flex min-h-px bg-sidebar-border mt-3 mx-auto" style={{ width: isExpanded ? '188px' : '16px' }} />
        
        {navigationItems.slice(1, -1).filter(item => item.id !== 'bookmarks').map((item) => {
          return (
            <NavigationItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={activeItem === item.id}
              onClick={() => handleItemClick(item.id)}
              isExpanded={isExpanded}
              sections={item.sections}
              itemId={item.id}
              isPopoverOpen={activePopover === item.id}
              onPopoverToggle={() => handlePopoverToggle(item.id)}
              onPopoverHover={handleItemHover}
              onBookmarkClick={onBookmarkClick}
              isItemBookmarked={isItemBookmarked}
            />
          );
        })}
        
        <div className="flex min-h-px bg-sidebar-border mt-3 mx-auto" style={{ width: isExpanded ? '188px' : '16px' }} />
        
        <NavigationItem
          icon={navigationItems[navigationItems.length - 1].icon}
          label={navigationItems[navigationItems.length - 1].label}
          isActive={activeItem === 'breeze'}
          onClick={() => handleItemClick('breeze')}
          isExpanded={isExpanded}
          sections={navigationItems[navigationItems.length - 1].sections}
          itemId="breeze"
          isPopoverOpen={activePopover === 'breeze'}
          onPopoverToggle={() => handlePopoverToggle('breeze')}
          onPopoverHover={handleItemHover}
        />
      </div>
      
      <div className="rounded-md pt-3">
        <button
          onClick={onToggleExpanded}
          className={`flex items-center gap-2 p-3 hover:bg-sidebar-accent rounded-md transition-colors ${
            isExpanded ? 'ml-auto' : ''
          }`}
          aria-label={isExpanded ? "Collapse navigation" : "Expand navigation"}
        >
          <ExpandCollapseIcon
            className={`w-4 h-4 text-sidebar-foreground transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>
    </nav>
  );
};
