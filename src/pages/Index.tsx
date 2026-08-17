import React, { useState, useMemo, useCallback } from 'react';
import { format } from 'date-fns';
import { Settings } from 'lucide-react';
import { GlobalToolbar } from '@/components/GlobalToolbar';
import { LeftNavigation } from '@/components/LeftNavigation';
import { SimplifiedLeftNavigation } from '@/components/SimplifiedLeftNavigation';
import { SidebarTransition } from '@/components/SidebarTransition';
import { ShepherdTour } from '@/components/ShepherdTour';
import { useBookmarks } from '@/hooks/useBookmarks';
import { navigationItems } from '@/data/navigationData';
import { useToast } from '@/hooks/use-toast';
import { MeetingsWidget } from '@/components/MeetingsWidget';
import { TasksWidget } from '@/components/TasksWidget';
import { RecentActivityWidget } from '@/components/RecentActivityWidget';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isNavExpanded, setIsNavExpanded] = useState(() => localStorage.getItem('nav-expanded') !== 'false');
  const [promoDismissed, setPromoDismissed] = useState(() => localStorage.getItem('nav-promo-dismissed') === 'true');
  const [useSimplifiedSidebar, setUseSimplifiedSidebar] = useState(() => localStorage.getItem('use-simplified-sidebar') === 'true');
  const [isSwitchingNav, setIsSwitchingNav] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [showDismissTip, setShowDismissTip] = useState(false);
  const [tourKey, setTourKey] = useState(0);
  const [dismissTipKey, setDismissTipKey] = useState(0);
  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();
  const { toast } = useToast();

  const handleDismissPromo = useCallback(() => {
    setPromoDismissed(true);
    localStorage.setItem('nav-promo-dismissed', 'true');
    setDismissTipKey(k => k + 1);
    setShowDismissTip(true);
  }, []);

  const handleResetPromo = () => {
    setPromoDismissed(false);
    localStorage.removeItem('nav-promo-dismissed');
    setUseSimplifiedSidebar(false);
    localStorage.removeItem('use-simplified-sidebar');
    setShowTour(false);
  };

  const handleToggleSidebarMode = (simplified: boolean) => {
    setUseSimplifiedSidebar(simplified);
    localStorage.setItem('use-simplified-sidebar', simplified ? 'true' : 'false');
    if (simplified) {
      // Just dismiss the promo without showing the tip
      setPromoDismissed(true);
      localStorage.setItem('nav-promo-dismissed', 'true');
    }
  };

  const handleTryItOut = useCallback(() => {
    setIsSwitchingNav(true);
    setTimeout(() => {
      handleToggleSidebarMode(true);
      setIsSwitchingNav(false);
      // Show tour after a brief delay for the new sidebar to render
      // Wait for nav items cascade animation to finish (~1.1s) before showing tour
      setTimeout(() => { setTourKey(k => k + 1); setShowTour(true); }, 1300);
    }, 7500);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log('Searching for:', query);
  };

  const handleCreateClick = () => {
    console.log('Create button clicked');
  };

  const handleToggleNav = () => {
    const next = !isNavExpanded;
    setIsNavExpanded(next);
    localStorage.setItem('nav-expanded', next ? 'true' : 'false');
  };

  const handleBookmarkClick = (itemId: string, itemLabel: string, sectionTitle: string) => {
    const wasBookmarked = isBookmarked(itemId, 'main-nav');
    const href = navigationItems.flatMap(n => n.sections?.flatMap(s => s.items) || []).find(i => i.id === itemId)?.href;
    toggleBookmark({ id: itemId, label: itemLabel, href }, 'main-nav', sectionTitle);
    
    toast({
      title: wasBookmarked ? 'Bookmark removed' : 'Bookmark added',
      description: `${itemLabel} ${wasBookmarked ? 'removed from' : 'added to'} your bookmarks.`,
      duration: 2000,
    });
  };

  const isItemBookmarked = (itemId: string) => {
    return isBookmarked(itemId, 'main-nav');
  };

  // Convert bookmarks to sections format for the navigation
  const allNavItems = navigationItems.flatMap(n => n.sections?.flatMap(s => s.items) || []);
  const bookmarkedSections = bookmarks.length > 0 ? [{
    title: 'Saved Items',
    items: bookmarks.map(bookmark => ({
      id: bookmark.id,
      label: bookmark.label,
      href: bookmark.href || allNavItems.find(i => i.id === bookmark.id)?.href
    }))
  }] : [];

  return (
    <div className="min-h-screen font-lexend" style={{ paddingTop: 'var(--toolbar-height)', backgroundColor: useSimplifiedSidebar ? '#333333' : 'hsl(var(--secondary))' }}>
      <GlobalToolbar 
        onSearch={handleSearch}
        onCreateClick={handleCreateClick}
        isNavExpanded={isNavExpanded}
        useSimplifiedSidebar={useSimplifiedSidebar}
        onToggleSidebarMode={handleToggleSidebarMode}
        isSwitchingNav={isSwitchingNav}
      />
      
      <div className="flex">
        {isSwitchingNav ? (
          <SidebarTransition isExpanded={isNavExpanded} />
        ) : useSimplifiedSidebar ? (
          <SimplifiedLeftNavigation
            isExpanded={isNavExpanded}
            onToggleExpanded={handleToggleNav}
          />
        ) : (
          <LeftNavigation 
            isExpanded={isNavExpanded} 
            onToggleExpanded={handleToggleNav}
            bookmarkedSections={bookmarkedSections}
            onBookmarkClick={handleBookmarkClick}
            isItemBookmarked={isItemBookmarked}
            promoDismissed={promoDismissed}
            onDismissPromo={handleDismissPromo}
            onTryItOut={handleTryItOut}
          />
        )}
        
        <ShepherdTour key={tourKey} active={showTour} onComplete={() => setShowTour(false)} />
        <ShepherdTour
          key={`dismiss-${dismissTipKey}`}
          active={showDismissTip}
          onComplete={() => setShowDismissTip(false)}
          customSteps={[{
            title: 'Switch to the new sidebar anytime',
            description: "It's always available in your account menu.",
            targetSelector: '[data-tour="account-menu"]',
            highlightSelector: '[data-tour="account-menu"]',
            placement: 'bottom',
            lastButtonLabel: 'Got it',
          }]}
        />
        {/* Fixed white content container with rounded top-left corner */}
        <div className={`fixed right-0 bottom-0 bg-background rounded-tl-[12px] overflow-hidden transition-all duration-200 ${isNavExpanded ? 'left-60' : 'left-16'}`} style={{ top: 'var(--toolbar-height)' }}>
          {/* Scrollable content area */}
          <main className="h-full overflow-y-auto px-12 py-8 pt-12">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-text-primary">
                    {format(new Date(), 'EEEE, MMMM d, yyyy')}
                  </p>
                  <button className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors">
                    <Settings className="w-4 h-4" />
                    Customize
                  </button>
                </div>
                {(() => {
                  const hour = new Date().getHours();
                  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
                  return (
                    <h1 className="text-3xl font-bold text-text-primary">
                      {greeting}, Gabby
                    </h1>
                  );
                })()}
              </div>
              
              <MeetingsWidget />
              <div className="mt-8">
                <TasksWidget />
              </div>
              <div className="mt-8">
                <RecentActivityWidget />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
