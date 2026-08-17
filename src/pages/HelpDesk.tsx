import React, { useState } from 'react';
import { Search, LayoutGrid, Plus, MoreHorizontal, Filter, Pencil, ChevronDown, Star, AtSign, Bot, Users, Inbox, CheckCircle, Send, AlertCircle, MessageSquare, Clock, Eye, ArrowUpDown, User, X } from 'lucide-react';
import { GlobalToolbar } from '@/components/GlobalToolbar';
import { LeftNavigation } from '@/components/LeftNavigation';
import { useBookmarks } from '@/hooks/useBookmarks';
import { navigationItems } from '@/data/navigationData';

interface Ticket {
  channel: string;
  channelIcon: 'chat' | 'email' | 'forms' | 'unknown';
  name: string;
  contact: string;
  contactAvatar?: string;
  company: string;
  createDate: string;
  firstResponseSLA: string;
  closeSLA: string;
  lastMessageDate: string;
  priority: 'High' | 'Medium' | 'Low';
  category?: string;
}

const tickets: Ticket[] = [
  { channel: 'Live Chat', channelIcon: 'chat', name: 'Ticket #44384298609', contact: 'Unknown Visitor', company: '--', createDate: 'Apr 10, 2026 3:20 PM ...', firstResponseSLA: 'Overdue', closeSLA: 'Active', lastMessageDate: '4/10/2026', priority: 'High', category: 'Product issue' },
  { channel: 'Live Chat', channelIcon: 'chat', name: 'Ticket #44387052614', contact: 'Unknown Visitor', company: '--', createDate: 'Apr 10, 2026 3:19 PM ...', firstResponseSLA: 'Overdue', closeSLA: 'Active', lastMessageDate: '4/10/2026', priority: 'High', category: 'Product issue' },
  { channel: 'Live Chat', channelIcon: 'chat', name: 'Ticket #43969076520', contact: 'Unknown Visitor', company: '--', createDate: 'Mar 31, 2026 3:06 PM...', firstResponseSLA: 'Overdue', closeSLA: 'Overdue', lastMessageDate: '3/31/2026', priority: 'High', category: 'Billing issue' },
  { channel: 'Live Chat', channelIcon: 'chat', name: 'Ticket #43968688183', contact: 'Unknown Visitor', company: '--', createDate: 'Mar 31, 2026 3:01 PM ...', firstResponseSLA: 'Overdue', closeSLA: 'Overdue', lastMessageDate: '3/31/2026', priority: 'High', category: 'Product issue' },
  { channel: 'Live Chat', channelIcon: 'chat', name: 'Ticket #43753209656', contact: 'Unknown Visitor', company: '--', createDate: 'Mar 26, 2026 9:57 AM...', firstResponseSLA: 'Overdue', closeSLA: 'Overdue', lastMessageDate: '3/26/2026', priority: 'High' },
  { channel: 'Live Chat', channelIcon: 'chat', name: 'Ticket #43734751768', contact: 'Unknown Visitor', company: '--', createDate: 'Mar 26, 2026 9:56 AM...', firstResponseSLA: 'Overdue', closeSLA: 'Overdue', lastMessageDate: '3/26/2026', priority: 'High' },
  { channel: 'Live Chat', channelIcon: 'chat', name: 'Ticket #43704926223', contact: 'Unknown Visitor', company: '--', createDate: 'Mar 25, 2026 1:04 PM...', firstResponseSLA: 'Overdue', closeSLA: 'Overdue', lastMessageDate: '3/25/2026', priority: 'High' },
  { channel: 'Live Chat', channelIcon: 'chat', name: 'Ticket #43658123125', contact: 'Unknown Visitor', company: '--', createDate: 'Mar 24, 2026 12:10 P...', firstResponseSLA: 'Overdue', closeSLA: 'Overdue', lastMessageDate: '3/24/2026', priority: 'High' },
  { channel: 'Live Chat', channelIcon: 'chat', name: 'Ticket #43660691632', contact: 'Unknown Visitor', company: '--', createDate: 'Mar 24, 2026 12:09 P...', firstResponseSLA: 'Overdue', closeSLA: 'Overdue', lastMessageDate: '3/24/2026', priority: 'High' },
  { channel: 'Live Chat', channelIcon: 'chat', name: 'Ticket #43642715964', contact: 'Unknown Visitor', company: '--', createDate: 'Mar 24, 2026 12:06 P...', firstResponseSLA: 'Overdue', closeSLA: 'Overdue', lastMessageDate: '3/24/2026', priority: 'High' },
  { channel: 'Unknown', channelIcon: 'unknown', name: 'La la la 123', contact: 'Chris Griffin', contactAvatar: 'CG', company: '--', createDate: 'Mar 20, 2026 10:26 A...', firstResponseSLA: 'Overdue', closeSLA: 'Overdue', lastMessageDate: '--', priority: 'Low' },
  { channel: 'Live Chat', channelIcon: 'chat', name: 'Ticket #41547725934', contact: 'Unknown Visitor', company: '--', createDate: 'Feb 11, 2026 8:57 AM ...', firstResponseSLA: 'Overdue', closeSLA: 'Overdue', lastMessageDate: '2/11/2026', priority: 'High' },
  { channel: 'Unknown', channelIcon: 'unknown', name: 'xxx', contact: 'Rose 1 Petrozz...', contactAvatar: 'RL', company: '--', createDate: 'Feb 10, 2026 1:17 PM...', firstResponseSLA: 'Overdue', closeSLA: 'Overdue', lastMessageDate: '--', priority: 'Low', category: 'Billing issue' },
  { channel: 'Forms', channelIcon: 'forms', name: 'Ticket B from 1/29', contact: 'Rose Sail', contactAvatar: 'RS', company: '--', createDate: 'Jan 29, 2026 10:59 A...', firstResponseSLA: 'Completed', closeSLA: 'Overdue', lastMessageDate: '1/29/2026', priority: 'High' },
  { channel: 'Forms', channelIcon: 'forms', name: "Here's a new support ticket from 1/29", contact: '3 contacts', company: 'Test Company 1', createDate: 'Jan 29, 2026 10:51 A...', firstResponseSLA: 'Completed', closeSLA: 'Overdue', lastMessageDate: '1/29/2026', priority: 'High' },
  { channel: 'Email', channelIcon: 'email', name: 'New ticket', contact: '2 contacts', company: 'Test Company 1', createDate: 'Jan 27, 2026 5:02 PM...', firstResponseSLA: 'Completed', closeSLA: 'Overdue', lastMessageDate: '1/27/2026', priority: 'Low' },
  { channel: 'Email', channelIcon: 'email', name: 'New Ticket', contact: '3 contacts', company: 'Test Company 1', createDate: 'Jan 26, 2026 4:34 PM...', firstResponseSLA: 'Completed', closeSLA: 'Overdue', lastMessageDate: '--', priority: 'Medium' },
  { channel: 'Unknown', channelIcon: 'unknown', name: "Here's a ticket 123", contact: 'Unknown Visitor', company: '--', createDate: 'Jan 18, 2026 4:44 PM...', firstResponseSLA: 'Overdue', closeSLA: 'Overdue', lastMessageDate: '--', priority: 'High', category: 'Product issue' },
];

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  count?: number;
  active?: boolean;
  indent?: boolean;
}

const sidebarItems: SidebarItem[] = [
  { icon: LayoutGrid, label: 'Summary' },
  { icon: Filter, label: 'Analyze' },
  { icon: Users, label: 'Coaching' },
  { icon: Inbox, label: 'Assigned To Me', count: 94, active: true },
  { icon: Star, label: 'Following', count: 1 },
  { icon: AtSign, label: 'My Mentions', count: 18 },
  { icon: Bot, label: 'Customer Agent', count: 0 },
];

const lessItems: SidebarItem[] = [
  { icon: Inbox, label: 'Unassigned', count: 50 },
  { icon: Users, label: "My Team's Unassigned", count: 0 },
  { icon: Users, label: "My Team's Open", count: 105 },
  { icon: Inbox, label: 'All Open', count: 161 },
  { icon: Clock, label: 'Waitlist', count: 0 },
  { icon: Clock, label: 'Snoozed', count: 0 },
  { icon: Pencil, label: 'Drafts', count: 2 },
  { icon: CheckCircle, label: 'All Closed' },
  { icon: Send, label: 'Sent', count: 62 },
  { icon: AlertCircle, label: 'Spam', count: 31 },
];

const viewItems: SidebarItem[] = [
  { icon: Eye, label: 'Test View', count: 0 },
  { icon: MessageSquare, label: 'Live Chats', count: 54 },
];

const bottomItems: SidebarItem[] = [
  { icon: MessageSquare, label: 'Live Chats', count: 71 },
  { icon: Clock, label: 'Testing tracking', count: 22 },
  { icon: Clock, label: 'Waiting on us', count: 14 },
];

const PriorityDot: React.FC<{ priority: Ticket['priority'] }> = ({ priority }) => {
  const color = priority === 'High' ? 'bg-red-500' : priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500';
  return <span className={`w-2 h-2 rounded-full ${color} inline-block`} />;
};

const layoutOptions = [
  { value: 'table' as const, label: 'Table', desc: 'Triage and prioritize tickets efficiently.' },
  { value: 'split' as const, label: 'Split', desc: 'Handle multiple tickets seamlessly.' },
  { value: 'board' as const, label: 'Board', desc: 'Visualize and track tickets across pipelines.' },
];

const LayoutSettingsPanel: React.FC<{ current: string; onChange: (v: 'table' | 'split' | 'board') => void }> = ({ current, onChange }) => (
  <div className="absolute top-full right-0 mt-2 w-[280px] bg-background border border-border-primary rounded-lg shadow-lg z-20 p-5">
    <h4 className="text-[14px] font-semibold text-text-primary mb-4">Layout settings</h4>
    <div className="space-y-4">
      {layoutOptions.map(o => (
        <label key={o.value} className="flex items-start gap-2.5 cursor-pointer" onClick={() => onChange(o.value)}>
          <input type="radio" name="layout" checked={current === o.value} onChange={() => onChange(o.value)} className="mt-0.5 accent-[#141414]" />
          <div>
            <div className="text-[13px] font-semibold text-text-primary">{o.label}</div>
            <div className="text-[11px] text-text-muted font-light">{o.desc}</div>
          </div>
        </label>
      ))}
    </div>
  </div>
);

const HelpDesk: React.FC = () => {
  const [isNavExpanded, setIsNavExpanded] = useState(() => localStorage.getItem('nav-expanded') !== 'false');
  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();
  const [lessExpanded, setLessExpanded] = useState(true);
  const [layoutOpen, setLayoutOpen] = useState(false);
  const [layout, setLayout] = useState<'table' | 'split' | 'board'>('table');

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

  const SidebarRow: React.FC<{ item: SidebarItem }> = ({ item }) => (
    <button className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[13px] transition-colors ${item.active ? 'bg-[#006162]/10 text-[#006162] font-medium' : 'text-text-primary font-light hover:bg-surface-secondary'}`}>
      <item.icon className={`w-4 h-4 shrink-0 ${item.active ? 'text-[#006162]' : 'text-text-secondary'}`} />
      <span className="flex-1 text-left truncate">{item.label}</span>
      {item.count !== undefined && (
        <span className={`text-[12px] ${item.active ? 'text-[#006162] font-semibold' : 'text-text-muted'}`}>{item.count}</span>
      )}
    </button>
  );

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
        <div className="flex h-[calc(100vh-var(--toolbar-height))]">
          {/* Help Desk Sidebar */}
          <div className="w-[220px] flex-shrink-0 border-r border-border-primary flex flex-col">
            {/* Header */}
            <div className="px-4 pt-4 pb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-text-secondary" />
                <h2 className="text-[16px] font-semibold text-text-primary">Help Desk</h2>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1 hover:bg-surface-secondary rounded transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-text-secondary" />
                </button>
                <button className="p-1 hover:bg-surface-secondary rounded transition-colors">
                  <Plus className="w-4 h-4 text-text-secondary" />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="px-4 pb-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search in help desk"
                  className="w-full pl-8 pr-3 py-1.5 border border-border-primary rounded-md text-[12px] font-light text-text-primary bg-background placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-border-primary"
                />
              </div>
            </div>

            {/* Nav items */}
            <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
              {sidebarItems.map(item => <SidebarRow key={item.label} item={item} />)}

              {/* Less section */}
              <div className="pt-1">
                <button
                  onClick={() => setLessExpanded(!lessExpanded)}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium text-text-primary hover:bg-surface-secondary rounded-md transition-colors"
                >
                  <ChevronDown className={`w-3.5 h-3.5 text-text-secondary transition-transform ${lessExpanded ? '' : '-rotate-90'}`} />
                  <span>Less</span>
                  <Plus className="w-3.5 h-3.5 text-text-secondary ml-auto" />
                </button>
                {lessExpanded && lessItems.map(item => <SidebarRow key={item.label} item={item} />)}
              </div>

              {/* Views */}
              <div className="border-t border-border-primary mt-2 pt-2">
                {viewItems.map(item => <SidebarRow key={item.label} item={item} />)}
              </div>

              {/* Bottom */}
              <div className="border-t border-border-primary mt-2 pt-2">
                {bottomItems.map(item => <SidebarRow key={item.label} item={item} />)}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col min-w-0">
            {layout === 'split' ? (
              /* ===== SPLIT VIEW ===== */
              <>
                {/* Top bar for split */}
                <div className="px-4 pt-3 pb-2 flex items-center justify-between border-b border-border-primary">
                  <span className="text-[14px] font-semibold text-text-primary">All Open (220)</span>
                  <div className="flex items-center gap-2">
                    <a href="#" className="text-[12px] text-[#0b6cda] hover:underline font-medium">new ticket for create date</a>
                    <span className="text-[12px] text-text-muted">|</span>
                    <a href="#" className="text-[12px] text-[#0b6cda] hover:underline font-medium">+ Add Contact</a>
                    <span className="text-[12px] text-text-muted">| #15937594551</span>
                    <div className="flex items-center gap-1 ml-2 relative">
                      <button className="px-3 py-1 bg-primary text-primary-foreground text-[12px] font-medium rounded-md">Actions ▾</button>
                      <button
                        onClick={() => setLayoutOpen(!layoutOpen)}
                        className="p-1.5 rounded hover:bg-surface-secondary transition-colors"
                      >
                        <LayoutGrid className="w-4 h-4 text-text-secondary" />
                      </button>
                      {layoutOpen && <LayoutSettingsPanel current={layout} onChange={(v) => { setLayout(v); setLayoutOpen(false); }} />}
                    </div>
                  </div>
                </div>

                {/* Split content area */}
                <div className="flex flex-1 overflow-hidden">
                  {/* Ticket list panel */}
                  <div className="w-[320px] flex-shrink-0 border-r border-border-primary flex flex-col">
                    <div className="px-3 py-2 flex items-center justify-between border-b border-border-primary">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="rounded border-border-primary" />
                        <span className="text-[12px] text-text-secondary font-light">Select all</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="p-1 hover:bg-surface-secondary rounded"><ArrowUpDown className="w-3.5 h-3.5 text-text-secondary" /></button>
                        <button className="p-1 hover:bg-surface-secondary rounded"><Filter className="w-3.5 h-3.5 text-text-secondary" /></button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      {tickets.map((ticket, i) => (
                        <div
                          key={i}
                          className={`px-4 py-3 border-b border-border-primary cursor-pointer hover:bg-surface-secondary/50 transition-colors ${i === 0 ? 'bg-surface-secondary/70' : ''}`}
                        >
                          <div className="flex items-start gap-2.5">
                            <span className="w-6 h-6 rounded-full bg-surface-secondary text-[9px] font-semibold text-text-muted flex items-center justify-center shrink-0 mt-0.5">
                              {ticket.contactAvatar || '👤'}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[13px] font-semibold text-text-primary truncate">
                                  {ticket.name}
                                  {ticket.firstResponseSLA === 'Overdue' && <span className="inline-block w-2 h-2 rounded-full bg-red-500 ml-1.5 align-middle" />}
                                </span>
                                <span className="text-[11px] text-text-muted font-light shrink-0">{ticket.createDate.split(',')[0].replace('2026', '').trim()}</span>
                              </div>
                              <div className="text-[12px] text-text-secondary font-light truncate">[{ticket.contact}]</div>
                              <div className="text-[11px] text-text-muted font-light mt-0.5 truncate">
                                {ticket.lastMessageDate !== '--' ? `↩ conversation started` : 'No conversation started'}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Center content - "Get started on this ticket" */}
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex-1 flex items-center justify-center px-8">
                      <div className="max-w-[480px]">
                        <h2 className="text-[28px] font-semibold text-text-primary mb-6">Get started on this ticket</h2>
                        <div className="space-y-5">
                          <div className="flex items-start gap-3">
                            <span className="w-8 h-8 rounded-full bg-[#006162]/10 text-[#006162] flex items-center justify-center shrink-0 mt-0.5">→</span>
                            <p className="text-[14px] text-text-primary font-light"><span className="font-semibold">Send a message</span> to a customer. <a href="#" className="text-[#006162] font-semibold hover:underline">Add a contact to start your conversation.</a></p>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="w-8 h-8 rounded-full bg-[#006162]/10 text-[#006162] flex items-center justify-center shrink-0 mt-0.5">→</span>
                            <p className="text-[14px] text-text-primary font-light"><span className="font-semibold">Create a task</span> to track follow-up actions.</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="w-8 h-8 rounded-full bg-[#006162]/10 text-[#006162] flex items-center justify-center shrink-0 mt-0.5">→</span>
                            <p className="text-[14px] text-text-primary font-light"><span className="font-semibold">Create a note</span> to collaborate with your team.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Note area at bottom */}
                    <div className="border-t border-border-primary">
                      <div className="px-6 py-2 flex items-center gap-2 text-[13px] text-text-secondary">
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Note</span>
                      </div>
                      <div className="px-6 pb-3">
                        <div className="bg-[#fef9e7] rounded-md p-4 min-h-[60px]">
                          <p className="text-[13px] text-text-muted font-light italic">Start typing to leave a note...</p>
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-text-secondary">
                          <button className="font-bold text-[13px]">B</button>
                          <button className="italic text-[13px]">I</button>
                          <button className="underline text-[13px]">U</button>
                          <button className="text-[13px]">S</button>
                          <span className="text-[13px] text-text-muted ml-1">More ▾</span>
                        </div>
                      </div>
                      <div className="px-6 py-2 border-t border-border-primary flex items-center justify-between">
                        <span className="text-[12px] text-text-primary font-light">Associated with 1 record ▾</span>
                        <button className="text-[12px] text-text-muted font-light hover:text-text-primary">Create note</button>
                      </div>
                    </div>
                  </div>

                  {/* Right detail sidebar */}
                  <div className="w-[280px] flex-shrink-0 border-l border-border-primary overflow-y-auto">
                    <div className="p-4 space-y-5">
                      <div>
                        <div className="text-[12px] text-text-muted font-light mb-1">Ticket owner</div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-text-secondary" />
                          <span className="text-[13px] text-text-primary font-medium">No owner ▾</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-[12px] text-text-muted font-light mb-1">Assigned teams</div>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-border-primary rounded text-[12px] text-text-primary">Mary's team <X className="w-3 h-3 text-text-muted" /></span>
                      </div>
                      <div>
                        <div className="text-[12px] text-text-muted font-light mb-1">Pipeline</div>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-600 text-white rounded text-[12px] font-medium">Support Pipeline ▾</span>
                      </div>
                      <div>
                        <div className="text-[12px] text-text-muted font-light mb-1">Ticket status</div>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-500 text-white rounded text-[12px] font-medium">Waiting on contact ▾</span>
                      </div>

                      {/* Tabs */}
                      <div className="flex border-b border-border-primary">
                        {['Details', 'History', 'Custom Tab', 'More ▾'].map((t, i) => (
                          <button key={t} className={`px-3 py-2 text-[12px] font-medium transition-colors ${i === 0 ? 'text-text-primary border-b-2 border-text-primary' : 'text-text-secondary hover:text-text-primary'}`}>{t}</button>
                        ))}
                      </div>

                      {/* About this ticket */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[13px] font-semibold text-text-primary">▾ About this ticket</span>
                          <span className="text-[12px] text-text-muted font-light">Actions ▾</span>
                        </div>
                        <div className="space-y-3 text-[12px]">
                          <div><span className="text-text-muted font-light block">Close date</span><span className="text-text-secondary">📅 --</span></div>
                          <div><span className="text-text-muted font-light block">Ticket description</span><span className="text-text-secondary">--</span></div>
                          <div><span className="text-text-muted font-light block">Priority</span><span className="inline-flex px-2 py-0.5 bg-yellow-500 text-white rounded text-[11px] font-medium">Medium</span></div>
                          <div><span className="text-text-muted font-light block">Category</span><span className="text-text-secondary">--</span></div>
                          <div><span className="text-text-muted font-light block">Create date</span><span className="text-text-secondary">📅 03/18/2026</span></div>
                          <div><span className="text-text-muted font-light block">Steve Custom Label</span><span className="text-text-secondary">--</span></div>
                          <div><span className="text-text-muted font-light block">Ticket Tags</span><span className="text-text-secondary">--</span></div>
                          <div><span className="text-text-muted font-light block">Assigned Teams</span><span className="inline-flex items-center gap-1 px-2 py-0.5 border border-border-primary rounded text-[11px] text-text-primary">Mary's team <X className="w-2.5 h-2.5 text-text-muted" /></span></div>
                          <div><span className="text-text-muted font-light block">Shared teams</span><span className="text-text-secondary">--</span></div>
                          <div><span className="text-text-muted font-light block">HubSpot team</span><span className="text-text-secondary">--</span></div>
                          <div><span className="text-text-muted font-light block">Customer Agent ticket status</span><span className="text-text-secondary">--</span></div>
                        </div>
                      </div>

                      {/* Contacts */}
                      <div className="border-t border-border-primary pt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] font-semibold text-text-primary">▾ Contacts (0)</span>
                          <span className="text-[12px] text-[#006162] font-medium">+ Add</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* ===== TABLE VIEW ===== */
              <>
                {/* Top bar */}
                <div className="px-6 pt-4 pb-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h1 className="text-[16px] font-semibold text-text-primary">Assigned To Me (94)</h1>
                  </div>
                  <div className="flex items-center gap-2 relative">
                    <span className="text-[13px] text-text-muted font-light cursor-pointer hover:underline">Learn more</span>
                    <button
                      onClick={() => setLayoutOpen(!layoutOpen)}
                      className={`p-1.5 rounded transition-colors ${layoutOpen ? 'bg-surface-secondary' : 'hover:bg-surface-secondary'}`}
                    >
                      <LayoutGrid className="w-4 h-4 text-text-secondary" />
                    </button>

                    {layoutOpen && <LayoutSettingsPanel current={layout} onChange={(v) => { setLayout(v); setLayoutOpen(false); }} />}
                  </div>
                </div>

                {/* Filters */}
                <div className="px-6 py-2 flex items-center gap-2 flex-wrap">
                  {['Ticket owner', 'Priority', 'Pipeline', 'Ticket status', 'Assigned Teams'].map(f => (
                    <button key={f} className="inline-flex items-center gap-1 px-3 py-1 text-[13px] font-medium text-text-primary hover:bg-surface-secondary rounded-md transition-colors">
                      {f}
                      <ChevronDown className="w-3 h-3 text-text-secondary" />
                    </button>
                  ))}
                  <button className="p-1 hover:bg-surface-secondary rounded transition-colors">
                    <Plus className="w-4 h-4 text-text-secondary" />
                  </button>
                  <button className="p-1 hover:bg-surface-secondary rounded transition-colors">
                    <Pencil className="w-4 h-4 text-text-secondary" />
                  </button>
                  <button className="inline-flex items-center gap-1.5 px-3 py-1 text-[13px] font-medium text-text-primary hover:bg-surface-secondary rounded-md transition-colors">
                    <Filter className="w-3.5 h-3.5 text-text-secondary" />
                    Advanced filters
                  </button>
                </div>

                {/* Ticket count + edit columns */}
                <div className="px-6 py-2 flex items-center justify-between">
                  <span className="text-[12px] text-text-muted font-light">94 tickets</span>
                  <button className="text-[12px] text-text-primary font-light border border-border-primary px-3 py-1 rounded-md hover:bg-surface-secondary transition-colors">
                    Edit columns
                  </button>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto px-6">
                  <table className="w-full text-[12px] min-w-[1200px]">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-surface-secondary border-b border-border-primary">
                        <th className="w-8 px-2 py-2"><input type="checkbox" className="rounded border-border-primary" /></th>
                        <th className="text-left px-3 py-2 font-semibold text-text-primary">Channel</th>
                        <th className="text-left px-3 py-2 font-semibold text-text-primary">Ticket name</th>
                        <th className="text-left px-3 py-2 font-semibold text-text-primary">Ticket → Contacts</th>
                        <th className="text-left px-3 py-2 font-semibold text-text-primary">Ticket → Company (Primary)</th>
                        <th className="text-left px-3 py-2 font-semibold text-text-primary">Create date</th>
                        <th className="text-left px-3 py-2 font-semibold text-text-primary">Time to First Response SLA</th>
                        <th className="text-left px-3 py-2 font-semibold text-text-primary">Time to Close SLA Ticket Sto</th>
                        <th className="text-left px-3 py-2 font-semibold text-text-primary">Last message received date</th>
                        <th className="text-left px-3 py-2 font-semibold text-text-primary">Priority</th>
                        <th className="text-left px-3 py-2 font-semibold text-text-primary">Category</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map((ticket, i) => (
                        <tr key={i} className="border-b border-border-primary hover:bg-surface-secondary/50 transition-colors">
                          <td className="px-2 py-2.5"><input type="checkbox" className="rounded border-border-primary" /></td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-1.5">
                              <MessageSquare className="w-3.5 h-3.5 text-text-secondary" />
                              <span className="text-text-primary">{ticket.channel}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5">
                            <a href="#" className="text-[#0b6cda] hover:underline font-medium">{ticket.name}</a>
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-1.5">
                              {ticket.contactAvatar ? (
                                <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 text-[9px] font-semibold flex items-center justify-center shrink-0">{ticket.contactAvatar}</span>
                              ) : (
                                <span className="w-5 h-5 rounded-full bg-surface-secondary text-text-muted text-[9px] flex items-center justify-center shrink-0">👤</span>
                              )}
                              <span className="text-text-primary truncate">{ticket.contact}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-text-secondary">{ticket.company}</td>
                          <td className="px-3 py-2.5 text-text-secondary">{ticket.createDate}</td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-1">
                              {ticket.firstResponseSLA === 'Overdue' && <Clock className="w-3 h-3 text-red-500" />}
                              {ticket.firstResponseSLA === 'Completed' && <CheckCircle className="w-3 h-3 text-text-secondary" />}
                              <span className={ticket.firstResponseSLA === 'Overdue' ? 'text-text-primary' : 'text-text-secondary'}>{ticket.firstResponseSLA}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-1">
                              {ticket.closeSLA === 'Overdue' && <Clock className="w-3 h-3 text-red-500" />}
                              <span className={ticket.closeSLA === 'Overdue' ? 'text-text-primary' : 'text-text-secondary'}>{ticket.closeSLA}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-text-secondary">{ticket.lastMessageDate}</td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-1.5">
                              <PriorityDot priority={ticket.priority} />
                              <span className="text-text-primary">{ticket.priority}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-text-secondary">{ticket.category || '--'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HelpDesk;
