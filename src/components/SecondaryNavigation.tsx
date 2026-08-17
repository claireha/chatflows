import React from 'react';
import { Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NavigationSection } from '../data/navigationData';

interface SecondaryNavigationProps {
  title: string;
  sections: NavigationSection[];
  onItemClick?: (itemId: string) => void;
  parentId?: string;
  onBookmarkClick?: (itemId: string, itemLabel: string, sectionTitle: string) => void;
  isItemBookmarked?: (itemId: string) => boolean;
  isExpanded?: boolean;
}

export const SecondaryNavigation: React.FC<SecondaryNavigationProps> = ({
  title,
  sections,
  onItemClick,
  parentId,
  onBookmarkClick,
  isItemBookmarked,
  isExpanded = false
}) => {
  const navigate = useNavigate();
  // Check if this is the bookmarks section and if it's empty
  const isBookmarksSection = parentId === 'bookmarks';
  const hasBookmarks = sections.length > 0;

  // Frequently visited items for bookmarks empty state
  const frequentlyVisitedItems = [
    { id: 'deals', label: 'Deals' },
    { id: 'leads', label: 'Leads' },
    { id: 'sales-workspace', label: 'Sales Workspace' },
    { id: 'commerce-overview', label: 'Commerce Overview' }
  ];

  return (
    <div className="min-w-[240px] max-w-[280px] bg-sidebar font-lexend rounded-lg px-4 pt-1 pb-4">
      {!isExpanded && !(isBookmarksSection && !hasBookmarks) && (
        <div className="px-2 py-1 pb-2">
          <h3 className="font-medium text-base text-sidebar-foreground">{title}</h3>
        </div>
      )}
      
      <div>
        {isBookmarksSection && !hasBookmarks ? (
          <>
            {/* Empty state for bookmarks */}
            <div className="px-2 pt-4 pb-2 text-center">
              <div className="flex flex-col items-center mb-1">
                <div className="w-8 h-8 bg-sidebar-accent rounded-lg flex items-center justify-center mb-3">
                  <Bookmark className="w-4 h-4 text-sidebar-foreground" />
                </div>
                <div className="text-sidebar-foreground font-medium text-sm mb-1">
                  Add your first bookmark
                </div>
                <div className="text-sidebar-foreground font-medium text-sm">
                  for quick access
                </div>
              </div>
            </div>
            
            {/* Separator line */}
            <div className="flex min-h-px w-[calc(100%-12px)] bg-sidebar-border mb-3 mx-1.5" />
            
            {/* Frequently visited section */}
            <div>
              <div className="px-2 text-sidebar-foreground font-medium text-sm mb-2">
                Frequently visited
              </div>
              <div>
                {frequentlyVisitedItems.map((item) => {
                  const isBookmarked = isItemBookmarked?.(item.id) || false;
                  
                  const handleBookmarkClick = (e: React.MouseEvent) => {
                    e.stopPropagation();
                    onBookmarkClick?.(item.id, item.label, 'Frequently visited');
                  };

                  return (
                    <button
                      key={item.id}
                      onClick={() => onItemClick?.(item.id)}
                      className="w-full text-left px-2 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-150 font-lexend font-light flex items-center justify-between group hover:rounded-md focus:outline-none"
                    >
                      <span>{item.label}</span>
                      <button
                        onClick={handleBookmarkClick}
                        className={`p-0.5 rounded hover:bg-sidebar-accent-foreground/10 transition-opacity duration-150 ${
                          isBookmarked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}
                        aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                      >
                        <Bookmark 
                          className={`w-4 h-4 transition-colors duration-150 ${
                            isBookmarked 
                              ? 'fill-sidebar-accent-foreground text-sidebar-accent-foreground' 
                              : 'text-sidebar-foreground'
                          }`} 
                        />
                      </button>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        ) : sections.length === 0 ? (
          <div className="px-2 py-4 text-center text-sidebar-foreground/60 text-sm">
            No items available
          </div>
        ) : (
          sections.map((section, sectionIndex) => (
            <div key={section.title || `section-${sectionIndex}`}>
              {sectionIndex > 0 && (
                <div className="flex min-h-px w-[calc(100%-12px)] bg-sidebar-border my-3 mx-1.5" />
              )}
              {section.title && (
                <div className="px-2 py-1 text-sidebar-foreground font-medium text-xs uppercase tracking-wider opacity-60">
                  {section.title}
                </div>
              )}
              <div>
                {section.items.map((item) => {
                  const isBookmarked = isItemBookmarked?.(item.id) || false;
                  
                  const handleBookmarkClick = (e: React.MouseEvent) => {
                    e.stopPropagation();
                    onBookmarkClick?.(item.id, item.label, section.title);
                  };

                  return (
                    <button
                      key={item.id}
                      onClick={() => { if (item.href) navigate(item.href); onItemClick?.(item.id); }}
                      className="w-full text-left px-2 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-150 font-lexend font-light flex items-center justify-between group hover:rounded-md focus:outline-none leading-6"
                    >
                      <span>{item.label}</span>
                      <button
                        onClick={handleBookmarkClick}
                        className={`p-0.5 rounded hover:bg-sidebar-accent-foreground/10 transition-opacity duration-150 ${
                          isBookmarked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}
                        aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                      >
                        <Bookmark 
                          className={`w-4 h-4 transition-colors duration-150 ${
                            isBookmarked 
                              ? 'fill-sidebar-accent-foreground text-sidebar-accent-foreground' 
                              : 'text-sidebar-foreground'
                          }`} 
                        />
                      </button>
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};