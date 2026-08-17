import React, { useState, useCallback } from 'react';
import { Search, Info, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { GlobalToolbar } from '@/components/GlobalToolbar';
import { LeftNavigation } from '@/components/LeftNavigation';
import { useBookmarks } from '@/hooks/useBookmarks';
import { navigationItems } from '@/data/navigationData';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ChatflowTableRow, type ChatflowRow } from '@/components/ChatflowTableRow';

const tabs = ['Web Chat', 'Mobile Chat', 'Facebook Messenger'];

export const chatflowsData: ChatflowRow[] = [
  { id: 1, priority: 1, name: 'Sales Chatflow', inbox: 'Help Desk', type: 'Live Chat', modifiedOn: 'Mar 23, 2026', modifiedBy: 'Kelly Kapoor', createdOn: 'Mar 23, 2026', createdBy: 'Michael Scott', feedback: '--', status: true, hasAiBadge: true },
  { id: 2, priority: 2, name: 'Support Chatflow', inbox: 'Help Desk', type: 'Live Chat', modifiedOn: 'Mar 23, 2026', modifiedBy: 'Kelly Kapoor', createdOn: 'Mar 23, 2026', createdBy: 'Kelly Kapoor', feedback: '--', status: true, hasAiBadge: true },
  { id: 3, priority: 3, name: 'Logged In Portal Chatflow', inbox: 'Inbox', type: 'Live Chat', modifiedOn: 'Mar 10, 2026', modifiedBy: 'Kelly Kapoor', createdOn: 'Sep 29, 2022', createdBy: 'Dwight Schrute', feedback: 'CSAT chat (Onsite + InApp EN)', feedbackIsLink: true, status: true },
  { id: 4, priority: 4, name: 'Pricing Page Chatflow', inbox: 'Inbox', type: 'Bot', modifiedOn: 'Mar 11, 2026', modifiedBy: 'Pam Beesly', createdOn: 'Mar 11, 2026', createdBy: 'Michael Scott', feedback: '--', status: true },
  { id: 5, priority: 5, name: 'New chatflow (March 2, 2026 2:5...', inbox: 'Inbox', type: 'Live Chat', modifiedOn: 'Mar 2, 2026', modifiedBy: 'Andy Bernard', createdOn: 'Mar 2, 2026', createdBy: 'Andy Bernard', feedback: '--', status: false },
  { id: 6, priority: 6, name: 'New chatflow (March 5, 2026 2:5...', inbox: 'Inbox', type: 'Live Chat', modifiedOn: 'Mar 5, 2026', modifiedBy: 'Angela Martin', createdOn: 'Mar 5, 2026', createdBy: 'Angela Martin', feedback: '--', status: false },
  { id: 7, priority: 7, name: 'New chatflow (March 13, 2026 2:1...', inbox: 'Inbox', type: 'Bot', modifiedOn: 'Mar 13, 2026', modifiedBy: 'Kevin Malone', createdOn: 'Mar 13, 2026', createdBy: 'Angela Martin', feedback: '--', status: false },
  { id: 8, priority: 8, name: 'New chatflow (March 13, 2026 2:2...', inbox: 'Inbox', type: 'Live Chat', modifiedOn: 'Mar 13, 2026', modifiedBy: 'Oscar Martinez', createdOn: 'Mar 13, 2026', createdBy: 'Oscar Martinez', feedback: '--', status: false },
  { id: 9, priority: 9, name: 'New chatflow (March 13, 2026 2:2...', inbox: 'Inbox', type: 'Live Chat', modifiedOn: 'Mar 13, 2026', modifiedBy: 'Stanley Hudson', createdOn: 'Mar 13, 2026', createdBy: 'Stanley Hudson', feedback: '--', status: false },
  { id: 10, priority: 10, name: 'New chatflow (March 13, 2026 2:2...', inbox: 'Inbox', type: 'Bot', modifiedOn: 'Mar 13, 2026', modifiedBy: 'Ryan Howard', createdOn: 'Mar 13, 2026', createdBy: 'Jim Halpert', feedback: '--', status: false },
  { id: 11, priority: 11, name: 'New chatflow (March 13, 2026 2:3...', inbox: 'Inbox', type: 'Live Chat', modifiedOn: 'Mar 13, 2026', modifiedBy: 'Kelly Kapoor', createdOn: 'Mar 13, 2026', createdBy: 'Kelly Kapoor', feedback: '--', status: false },
  { id: 12, priority: 12, name: 'Onboarding Bot', inbox: 'Inbox', type: 'Bot', modifiedOn: 'Mar 15, 2026', modifiedBy: 'Toby Flenderson', createdOn: 'Mar 15, 2026', createdBy: 'Toby Flenderson', feedback: '--', status: false },
  { id: 13, priority: 13, name: 'Sales Qualification Flow', inbox: 'Help Desk', type: 'Live Chat', modifiedOn: 'Mar 18, 2026', modifiedBy: 'Darryl Philbin', createdOn: 'Mar 18, 2026', createdBy: 'Michael Scott', feedback: '--', status: false },
  { id: 14, priority: 14, name: 'Product Demo Scheduler', inbox: 'Inbox', type: 'Bot', modifiedOn: 'Mar 20, 2026', modifiedBy: 'Creed Bratton', createdOn: 'Mar 20, 2026', createdBy: 'Dwight Schrute', feedback: '--', status: true },
  { id: 15, priority: 15, name: 'Feedback Collection Flow', inbox: 'Help Desk', type: 'Live Chat', modifiedOn: 'Mar 22, 2026', modifiedBy: 'Meredith Palmer', createdOn: 'Mar 22, 2026', createdBy: 'Meredith Palmer', feedback: '--', status: false },
];

const Chatflows: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Web Chat');
  const [searchQuery, setSearchQuery] = useState('');
  const [rows, setRows] = useState(chatflowsData);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [isNavExpanded, setIsNavExpanded] = useState(() => localStorage.getItem('nav-expanded') !== 'false');
  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();

  const isItemBookmarked = (itemId: string) => isBookmarked(itemId, 'main-nav');

  const allNavItems = navigationItems.flatMap(n => n.sections?.flatMap(s => s.items) || []);
  const bookmarkedSections = bookmarks.length > 0 ? [{
    title: 'Saved Items',
    items: bookmarks.map(b => ({ id: b.id, label: b.label, href: b.href || allNavItems.find(i => i.id === b.id)?.href }))
  }] : [];

  const handleBookmarkClick = (itemId: string, itemLabel: string, sectionTitle: string) => {
    const href = navigationItems.flatMap(n => n.sections?.flatMap(s => s.items) || []).find(i => i.id === itemId)?.href;
    toggleBookmark({ id: itemId, label: itemLabel, href }, 'main-nav', sectionTitle);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;

    setRows(prev => {
      const oldIndex = prev.findIndex(r => r.id === active.id);
      const newIndex = prev.findIndex(r => r.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return prev;
      const newRows = [...prev];
      const [moved] = newRows.splice(oldIndex, 1);
      newRows.splice(newIndex, 0, moved);
      return newRows.map((r, i) => ({ ...r, priority: i + 1 }));
    });
  }, []);

  const activeRow = activeId ? rows.find(r => r.id === activeId) : null;

  return (
    <div className="min-h-screen bg-background font-lexend">
      <GlobalToolbar isNavExpanded={isNavExpanded} />
      <LeftNavigation
        isExpanded={isNavExpanded}
        onToggleExpanded={() => { const next = !isNavExpanded; setIsNavExpanded(next); localStorage.setItem('nav-expanded', next ? 'true' : 'false'); }}
        bookmarkedSections={bookmarkedSections}
        onBookmarkClick={handleBookmarkClick}
        isItemBookmarked={isItemBookmarked}
      />

      <main
        className={`transition-all duration-200 ${isNavExpanded ? 'ml-[236px]' : 'ml-16'} max-md:ml-0`}
        style={{ paddingTop: 'var(--toolbar-height)' }}
      >
        <div className="p-8 text-[14px] font-light leading-[24px] max-w-[1200px] mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-[20px] font-semibold leading-[24px] text-text-primary">Chatflows</h1>
            <button className="px-4 py-2 text-[12px] font-light leading-[13px] text-white bg-[#141414] rounded hover:opacity-90 transition-opacity">
              Create chatflow
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border-primary mb-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-[14px] leading-[24px] transition-colors border-b-2 ${
                  activeTab === tab
                    ? 'border-text-primary text-text-primary font-medium'
                    : 'border-transparent text-text-secondary hover:text-text-primary font-light'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Info message */}
          <p className="text-sm text-text-secondary mb-4">
            To customize your chat widget's appearance and availability, go to your{' '}
            <Link to="/settings" state={{ settingsItem: 'inboxes', expandSection: 'inbox-helpdesk' }} className="text-[#016162] hover:text-[#014a4b] font-medium underline inline-flex items-center gap-1">
              inbox settings <ExternalLink className="w-3 h-3" />
            </Link>.
          </p>

          {/* Filters row */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div className="relative">
              <input
                type="text"
                placeholder="Search chatflows"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-border-primary rounded-full pl-3 pr-9 h-10 text-sm bg-background text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-border-secondary w-56"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            </div>
            <span className="text-sm text-text-secondary">Inbox: <strong className="font-medium text-text-primary">All inboxes</strong> <span className="inline-block w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent border-t-text-primary ml-1 align-middle" /></span>
            <span className="text-sm text-text-secondary">Types: <strong className="font-medium text-text-primary">All types</strong> <span className="inline-block w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent border-t-text-primary ml-1 align-middle" /></span>
            <span className="text-sm text-text-secondary">Created by: <strong className="font-medium text-text-primary">All users</strong> <span className="inline-block w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent border-t-text-primary ml-1 align-middle" /></span>
            <span className="text-sm text-text-secondary">Status: <strong className="font-medium text-text-primary">All</strong> <span className="inline-block w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent border-t-text-primary ml-1 align-middle" /></span>
          </div>

          {/* Table */}
          <div className="border border-border-primary rounded overflow-hidden">
            {/* Header row */}
            <TooltipProvider delayDuration={200}>
            <div className="grid grid-cols-[40px_60px_1fr_100px_100px_140px_140px_180px_130px] bg-[rgb(245,245,245)] text-xs font-medium text-[#141414] border-b border-border-primary">
              <div className="px-2 py-3 flex items-center justify-center gap-1 border-r border-border-primary col-span-2">
                Priority
                <Tooltip>
                  <TooltipTrigger asChild><Info className="w-3 h-3" /></TooltipTrigger>
                  <TooltipContent className="bg-[#141414] text-white border-none max-w-[280px] text-xs font-light" side="bottom" hasArrow>
                    Drag and drop to reorder chatflows. If a visitor to your website matches more than one chatflow based on targeting settings, they will only see the one with the highest priority.
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="px-2 py-3 flex items-center border-r border-border-primary">Name</div>
              <div className="px-2 py-3 flex items-center gap-1 border-r border-border-primary">
                Inbox
                <Tooltip>
                  <TooltipTrigger asChild><Info className="w-3 h-3" /></TooltipTrigger>
                  <TooltipContent className="bg-[#141414] text-white border-none max-w-[250px] text-xs font-light" side="bottom" hasArrow>
                    This is where conversations with this chatflow will be routed. Clone your chatflow to change this.
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="px-2 py-3 flex items-center border-r border-border-primary">Type</div>
              <div className="px-2 py-3 flex items-center border-r border-border-primary">Modified On</div>
              <div className="px-2 py-3 flex items-center border-r border-border-primary">Created On</div>
              <div className="px-2 py-3 flex items-center gap-1 border-r border-border-primary">
                Feedback Survey
                <Tooltip>
                  <TooltipTrigger asChild><Info className="w-3 h-3" /></TooltipTrigger>
                  <TooltipContent className="bg-[#141414] text-white border-none max-w-[280px] text-xs font-light" side="bottom" hasArrow>
                    Collect feedback from chat visitors. You can connect a CSAT survey to your chatflow and ask visitors for feedback when a chat conversation is closed. Visit the options tab within the chatflow to connect a survey.
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="px-2 py-3 flex items-center justify-center">Status</div>
            </div>
            </TooltipProvider>

            {/* Data rows */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            >
              <SortableContext items={rows.map(r => r.id)} strategy={verticalListSortingStrategy}>
                {rows.map((row) => (
                  <ChatflowTableRow
                    key={row.id}
                    row={row}
                    onToggleStatus={() => {
                      setRows(prev => prev.map(r => r.id === row.id ? { ...r, status: !r.status } : r));
                    }}
                  />
                ))}
              </SortableContext>
              <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.25, 1, 0.5, 1)' }}>
                {activeRow ? (
                  <ChatflowTableRow
                    row={activeRow}
                    onToggleStatus={() => {}}
                    isOverlay
                  />
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chatflows;
