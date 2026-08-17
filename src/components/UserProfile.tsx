import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Info, MessageSquare } from 'lucide-react';
import avatarIcon from '../assets/avatar-icon.svg';

interface UserProfileProps {
  profileName?: string;
  onProfileClick?: () => void;
  useSimplifiedSidebar?: boolean;
  onToggleSidebarMode?: (simplified: boolean) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  profileName = "Gabby G",
  onProfileClick,
  useSimplifiedSidebar = false,
  onToggleSidebarMode
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    setIsOpen(!isOpen);
    onProfileClick?.();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return <div className="relative mr-4" ref={menuRef} data-tour="account-menu">
      <button onClick={handleClick} className={`justify-center items-center rounded-md self-stretch flex gap-1.5 text-sm text-sidebar-foreground font-extralight text-center tracking-[0px] leading-6 my-auto px-2 py-1 ${useSimplifiedSidebar ? 'hover:bg-[#4D4D4D]' : 'hover:bg-[hsl(var(--hover-overlay))]'} transition-colors`}>
        <img src={avatarIcon} alt="User avatar" className="w-4 h-4 shrink-0 my-auto" />
        <div className="self-stretch flex items-center gap-1.5 my-auto">
          <div className="text-sidebar-foreground text-sm font-extralight leading-6 tracking-[0px] self-stretch my-auto hidden md:block">
            {profileName}
          </div>
          <ChevronDown className={`w-3 h-3 text-sidebar-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>
      
      {isOpen && <div className="absolute right-0 top-full mt-1 bg-background border border-border rounded-lg shadow-lg min-w-[280px] z-50">
          {/* Profile header */}
          <div className="px-5 py-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-muted flex items-center justify-center flex-shrink-0">
              <img src={avatarIcon} alt="User avatar" className="w-7 h-7" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">Gabby Garcia</span>
              <span className="text-xs text-muted-foreground font-light">gabbyg@hubspot.com</span>
              <a href="#" className="text-xs text-[hsl(var(--hubspot-teal))] underline mt-0.5 font-light">Profile &amp; Preferences</a>
            </div>
          </div>

        </div>}
    </div>;
};