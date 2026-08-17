import React, { useState } from 'react';
import { ExpandCollapseIcon } from './icons/ExpandCollapseIcon';
import { HomeIcon } from './icons/HomeIcon';
import { CRMIcon } from './icons/CRMIcon';
import { MarketingIcon } from './icons/MarketingIcon';
import { ReportsIcon } from './icons/ReportsIcon';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { MoreHorizontal, Users, Building2, Handshake, FileText, Mail, PieChart, ChevronRight } from 'lucide-react';

interface SimplifiedNavItem {
  id: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  label: string;
}

const primaryItems: SimplifiedNavItem[] = [
  { id: 'home', icon: HomeIcon, label: 'Home' },
  { id: 'contacts', icon: ({ className, size }) => <Users className={className} size={size} />, label: 'Contacts' },
  { id: 'companies', icon: ({ className, size }) => <Building2 className={className} size={size} />, label: 'Companies' },
  { id: 'deals', icon: ({ className, size }) => <Handshake className={className} size={size} />, label: 'Deals' },
  { id: 'forms', icon: ({ className, size }) => <FileText className={className} size={size} />, label: 'Forms' },
  { id: 'marketing-email', icon: ({ className, size }) => <Mail className={className} size={size} />, label: 'Marketing Email' },
  { id: 'segments', icon: ({ className, size }) => <PieChart className={className} size={size} />, label: 'Segments' },
  { id: 'dashboards', icon: ReportsIcon, label: 'Dashboards' },
];

const moreItems: SimplifiedNavItem[] = [
  { id: 'tickets', icon: CRMIcon, label: 'Tickets' },
  { id: 'tasks', icon: ({ className, size }) => <FileText className={className} size={size} />, label: 'Tasks' },
  { id: 'calls', icon: ({ className, size }) => <Mail className={className} size={size} />, label: 'Calls' },
  { id: 'workflows', icon: MarketingIcon, label: 'Workflows' },
  { id: 'reports', icon: ReportsIcon, label: 'Reports' },
];

interface SimplifiedLeftNavigationProps {
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
}

export const SimplifiedLeftNavigation: React.FC<SimplifiedLeftNavigationProps> = ({
  isExpanded = false,
  onToggleExpanded,
}) => {
  const [activeItem, setActiveItem] = useState('home');
  const [moreOpen, setMoreOpen] = useState(false);
  const [moreHovered, setMoreHovered] = useState(false);
  const [moreHoverTimeout, setMoreHoverTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleMoreMouseEnter = () => {
    if (moreHoverTimeout) {
      clearTimeout(moreHoverTimeout);
      setMoreHoverTimeout(null);
    }
    if (!isExpanded) {
      setMoreHovered(true);
    }
  };

  const handleMoreMouseLeave = () => {
    const timeout = setTimeout(() => {
      setMoreHovered(false);
    }, isExpanded ? 150 : 250);
    setMoreHoverTimeout(timeout);
  };

  const renderItem = (item: SimplifiedNavItem, index: number) => (
    <button
      key={item.id}
      onClick={() => setActiveItem(item.id)}
      className={`items-center rounded-md flex min-h-10 w-full gap-3 mt-1 px-3 py-2 hover:bg-[#4D4D4D] transition-colors focus:outline-none ${
        activeItem === item.id ? 'bg-[#666666]' : ''
      }`}
      style={{ opacity: 0, animation: `messageSlideIn 0.35s ease-out ${index * 0.08}s forwards` }}
    >
      <div className="flex min-h-6 w-4 items-center justify-center flex-shrink-0">
        {React.createElement(item.icon, { className: 'text-sidebar-foreground', size: 16 })}
      </div>
      {isExpanded && (
        <span className="text-sidebar-foreground text-sm font-light truncate leading-6">
          {item.label}
        </span>
      )}
    </button>
  );

  const morePopoverContent = (
    <div className="min-w-[240px] max-w-[280px] font-lexend rounded-lg px-4 pt-1 pb-2" style={{ backgroundColor: '#333333' }}>
      {!isExpanded && (
        <div className="px-2 py-1 pb-2">
          <h3 className="font-medium text-base text-sidebar-foreground">More</h3>
        </div>
      )}
      <div>
        {moreItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveItem(item.id);
              setMoreOpen(false);
              setMoreHovered(false);
            }}
            className="w-full text-left px-2 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-150 font-lexend font-light flex items-center gap-3 group hover:rounded-md focus:outline-none"
          >
            <div className="flex min-h-6 w-4 items-center justify-center flex-shrink-0">
              {React.createElement(item.icon, { className: 'text-sidebar-foreground', size: 14 })}
            </div>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // Collapsed: hover to open, Expanded: click to open
  const isMorePopoverOpen = isExpanded ? moreOpen : moreHovered;

  return (
    <nav data-tour="sidebar" className={`fixed left-0 px-3 pt-4 pb-2 flex flex-col max-md:hidden transition-all duration-200 ${isExpanded ? 'w-[236px]' : 'w-16'}`} style={{ top: 'var(--toolbar-height)', height: 'calc(100vh - var(--toolbar-height))', animation: 'fade-in 0.5s ease-out both', backgroundColor: '#333333' }}>
      <div className="w-full flex-1 overflow-y-auto scrollbar-none">
        {renderItem(primaryItems[0], 0)}

        {/* Divider below Home */}
        <div className="flex min-h-px bg-sidebar-border my-3 mx-auto" style={{ width: isExpanded ? '188px' : '16px', opacity: 0, animation: 'messageSlideIn 0.35s ease-out 0.08s forwards' }} />

        <div data-tour="nav-items">
          {primaryItems.slice(1).map((item, i) => renderItem(item, i + 2))}
        </div>

        {/* More group - popover */}
        <Popover open={isMorePopoverOpen} onOpenChange={isExpanded ? setMoreOpen : undefined}>
          <PopoverTrigger asChild>
            <button
              data-tour="more-menu"
              onClick={() => isExpanded && setMoreOpen(!moreOpen)}
              onMouseEnter={handleMoreMouseEnter}
              onMouseLeave={handleMoreMouseLeave}
              className={`items-center rounded-md flex min-h-10 w-full gap-3 mt-1 px-3 py-2 hover:bg-[#4D4D4D] transition-colors focus:outline-none group ${
                isMorePopoverOpen ? 'bg-[#666666]' : ''
              }`}
              style={{ opacity: 0, animation: `messageSlideIn 0.35s ease-out ${(primaryItems.length + 1) * 0.08}s forwards` }}
            >
              <div className="flex min-h-6 w-4 items-center justify-center flex-shrink-0">
                <MoreHorizontal className="text-sidebar-foreground" size={16} />
              </div>
              {isExpanded && (
                <>
                  <span className="text-sidebar-foreground text-sm font-light truncate flex-1 text-left leading-6">
                    More
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 text-sidebar-foreground transition-opacity duration-200 ${
                      moreOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  />
                </>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent
            side="right"
            align="start"
            alignOffset={isExpanded ? -5 : -40}
            sideOffset={isExpanded ? 20 : 16}
            className="p-0 border-0 shadow-lg w-56" style={{ backgroundColor: '#333333' }}
            onMouseEnter={handleMoreMouseEnter}
            onMouseLeave={handleMoreMouseLeave}
            data-navigation-popover="true"
          >
            {morePopoverContent}
          </PopoverContent>
        </Popover>
      </div>

      <div className="rounded-md pt-3">
        <button
          onClick={onToggleExpanded}
          className={`flex items-center gap-2 p-3 hover:bg-sidebar-accent rounded-md transition-colors ${
            isExpanded ? 'ml-auto' : ''
          }`}
          aria-label={isExpanded ? 'Collapse navigation' : 'Expand navigation'}
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
