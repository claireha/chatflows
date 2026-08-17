import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SearchInput } from './SearchInput';
import { UserProfile } from './UserProfile';
import { LogoIcon } from './icons/LogoIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { MarketplaceIcon } from './icons/MarketplaceIcon';
import { HelpIcon } from './icons/HelpIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { NotificationsIcon } from './icons/NotificationsIcon';
import { AssistantIcon } from './icons/AssistantIcon';
import { AssistantPanel } from './AssistantPanel';


interface GlobalToolbarProps {
  onSearch?: (query: string) => void;
  onCreateClick?: () => void;
  isNavExpanded?: boolean;
  useSimplifiedSidebar?: boolean;
  onToggleSidebarMode?: (simplified: boolean) => void;
  isSwitchingNav?: boolean;
}
export const GlobalToolbar: React.FC<GlobalToolbarProps> = ({
  onSearch,
  onCreateClick,
  isNavExpanded = false,
  useSimplifiedSidebar = false,
  onToggleSidebarMode,
  isSwitchingNav = false,
}) => {
  const [assistantOpen, setAssistantOpen] = useState(false);
  const isDarkShell = useSimplifiedSidebar;
  const hoverBg = isDarkShell ? 'hover:bg-[#4D4D4D]' : 'hover:bg-[hsl(var(--hover-overlay))]';
  return <>
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center w-full px-0" style={{ height: 'var(--toolbar-height)', backgroundColor: 'hsl(var(--toolbar-background))' }}>

      {/* Fixed logo section */}
      <div className="fixed left-3 top-2 z-10">
        <Link to="/" className={`flex items-center px-2 py-1.5 ${hoverBg} rounded transition-colors`}>
          <LogoIcon className="w-6 h-6" />
        </Link>
      </div>
      
      {/* Search section that shifts based on nav state */}
      <div className={`flex items-center gap-3 flex-1 transition-all duration-200 ${isNavExpanded ? 'ml-60' : 'ml-16'}`}>
        <div className="flex items-center flex-1 max-w-3xl pr-4 min-w-0">
          <SearchInput onSearch={onSearch} useSimplifiedSidebar={isDarkShell} />
          <button onClick={onCreateClick} className={`flex items-center justify-center w-8 h-8 border border-[hsl(0_0%_54%)] rounded-full ${hoverBg} transition-colors flex-shrink-0 ml-3`} aria-label="Create new item">
            <Plus className="w-4 h-4 text-sidebar-foreground" />
          </button>
        </div>
      </div>
      
      {/* Right section - Actions and Profile */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="hidden md:flex items-center gap-2">
          <button className={`flex items-center justify-center w-8 h-8 p-2 rounded-md ${hoverBg} transition-colors text-sidebar-foreground`} aria-label="Phone">
            <PhoneIcon className="w-4 h-4" />
          </button>
          <button className={`flex items-center justify-center w-8 h-8 p-2 rounded-md ${hoverBg} transition-colors text-sidebar-foreground`} aria-label="Marketplace">
            <MarketplaceIcon className="w-4 h-4" />
          </button>
          <button className={`flex items-center justify-center w-8 h-8 p-2 rounded-md ${hoverBg} transition-colors text-sidebar-foreground`} aria-label="Help">
            <HelpIcon className="w-4 h-4" />
          </button>
          <Link to="/settings" className={`flex items-center justify-center w-8 h-8 p-2 rounded-md ${hoverBg} transition-colors text-sidebar-foreground`} aria-label="Settings">
            <SettingsIcon className="w-4 h-4" />
          </Link>
          <button className={`flex items-center justify-center w-8 h-8 p-2 rounded-md ${hoverBg} transition-colors text-sidebar-foreground`} aria-label="Notifications">
            <NotificationsIcon className="w-4 h-4" />
          </button>
          
          <div className="w-px h-6 bg-[hsl(0_0%_54%)] mx-2" />
          
          <button onClick={() => setAssistantOpen(v => !v)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-sidebar-foreground font-extralight rounded-full hover:bg-[#4D4D4D] transition-colors">
            <AssistantIcon className="w-4 h-4" color="#FFFFFF" />
            <span className="text-sidebar-foreground text-sm font-extralight">Assistant</span>
          </button>


          
          <div className="w-px h-6 bg-[hsl(0_0%_54%)] mx-2" />
        </div>
        
        <UserProfile
          useSimplifiedSidebar={useSimplifiedSidebar}
          onToggleSidebarMode={onToggleSidebarMode}
        />
      </div>
    </header>
    <AssistantPanel open={assistantOpen} onClose={() => setAssistantOpen(false)} />
  </>;
};
