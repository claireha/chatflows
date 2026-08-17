import React, { useState } from 'react';
import { Search, ChevronDown, Filter, ArrowUpDown, BarChart3, Download, Copy, Save, Plus, MoreVertical, X, ChevronLeft, ChevronRight, LayoutGrid, Settings2, ExternalLink } from 'lucide-react';
import { GlobalToolbar } from '@/components/GlobalToolbar';
import { LeftNavigation } from '@/components/LeftNavigation';
import { useBookmarks } from '@/hooks/useBookmarks';
import { navigationItems } from '@/data/navigationData';

interface Contact {
  initials: string;
  name: string;
  email: string;
  hasExternalLink?: boolean;
  phone: string;
  owner: string;
  company: string;
  companyIcon?: string;
  lastActivity: string;
  leadStatus: string;
}

const contacts: Contact[] = [
  { initials: 'AA', name: 'Aiden Adams', email: 'aadams@silverscreenprops....', phone: '--', owner: 'No owner', company: 'Silver Screen Props', lastActivity: 'Yesterday at 2:36 PM EDT', leadStatus: '--' },
  { initials: 'LH', name: 'Lily Hall', email: 'lhall@thefancave.com', hasExternalLink: true, phone: '--', owner: 'No owner', company: 'The Fan Cave', lastActivity: 'Yesterday at 2:36 PM EDT', leadStatus: '--' },
  { initials: 'NT', name: 'Nora Taylor', email: 'ntaylor@retrozonetoysgam...', phone: '--', owner: 'No owner', company: 'RetroZone Toys & Ga...', lastActivity: 'Yesterday at 2:36 PM EDT', leadStatus: '--' },
  { initials: 'SJ', name: 'Sebastian Johnson', email: 'sjohnson@infinityshelfcolle...', phone: '--', owner: 'No owner', company: 'Infinity Shelf Collectib...', lastActivity: 'Yesterday at 2:36 PM EDT', leadStatus: '--' },
  { initials: 'MJ', name: 'Mason Jackson', email: 'mjackson@herosjourneycо...', phone: '--', owner: 'No owner', company: "Hero's Journey Comics", companyIcon: '🛡️', lastActivity: 'Yesterday at 2:36 PM EDT', leadStatus: '--' },
  { initials: 'JS', name: 'Jackson Smith', email: 'jsmith@silverscreenprops.c...', phone: '--', owner: 'No owner', company: 'Silver Screen Props', lastActivity: 'Yesterday at 2:36 PM EDT', leadStatus: '--' },
  { initials: 'HA', name: 'Henry Anderson', email: 'handerson@atomiccomicsc...', phone: '--', owner: 'No owner', company: 'Atomic Comics & Cards', lastActivity: 'Yesterday at 2:36 PM EDT', leadStatus: '--' },
  { initials: 'HW', name: 'Harper White', email: 'hwhite@legendscomicshop...', phone: '--', owner: 'No owner', company: 'Legends Comic Shop', lastActivity: 'Yesterday at 2:36 PM EDT', leadStatus: '--' },
  { initials: 'GA', name: 'Grace Adams', email: 'gadams@capecowlcomics.c...', phone: '--', owner: 'No owner', company: 'Cape & Cowl Comics', lastActivity: 'Yesterday at 2:36 PM EDT', leadStatus: '--' },
  { initials: 'AY', name: 'Ava Young', email: 'ayoung@thegeekygoblin.co...', phone: '--', owner: 'No owner', company: 'The Geeky Goblin', lastActivity: 'Yesterday at 2:36 PM EDT', leadStatus: '--' },
  { initials: 'LA', name: 'Logan Anderson', email: 'landerson@popculturepala...', phone: '--', owner: 'No owner', company: 'Pop Culture Palace', companyIcon: '🎮', lastActivity: 'Yesterday at 2:36 PM EDT', leadStatus: '--' },
  { initials: 'JM', name: 'Jayden Martin', email: 'jmartin@dragonshoardgam...', phone: '--', owner: 'No owner', company: "Dragon's Hoard Game ...", companyIcon: '🐉', lastActivity: 'Yesterday at 2:36 PM EDT', leadStatus: '--' },
  { initials: 'MA', name: 'Mia Allen', email: 'mallen@thecollectorsden.c...', phone: '--', owner: 'No owner', company: "The Collector's Den", lastActivity: 'Yesterday at 2:36 PM EDT', leadStatus: '--' },
  { initials: 'CJ', name: 'Carter Jones', email: 'cjones@nostalgiacorner.co...', phone: '--', owner: 'No owner', company: 'Nostalgia Corner', lastActivity: 'Yesterday at 2:36 PM EDT', leadStatus: '--' },
  { initials: 'CS', name: 'Chloe Scott', email: 'cscott@fandomfortress.co...', phone: '--', owner: 'No owner', company: 'Fandom Fortress', lastActivity: 'Yesterday at 2:36 PM EDT', leadStatus: '--' },
  { initials: 'VA', name: 'Violet Adams', email: 'vadams@thegeekygoblin.c...', phone: '--', owner: 'No owner', company: 'The Geeky Goblin', lastActivity: 'Yesterday at 2:36 PM EDT', leadStatus: '--' },
  { initials: 'LC', name: 'Logan Clark', email: 'lclark@geekgalaxy.com', hasExternalLink: true, phone: '--', owner: 'No owner', company: 'Geek Galaxy', lastActivity: 'Yesterday at 2:36 PM EDT', leadStatus: '--' },
];

const Contacts: React.FC = () => {
  const [isNavExpanded, setIsNavExpanded] = useState(() => localStorage.getItem('nav-expanded') !== 'false');
  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();
  const [currentPage, setCurrentPage] = useState(1);

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
        <div className="h-[calc(100vh-var(--toolbar-height))] flex flex-col">
          {/* Top bar */}
          <div className="px-6 py-3 flex items-center justify-between border-b border-border-primary bg-[#f0f0f0]">
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border-primary rounded-md text-[13px] font-medium text-text-primary hover:bg-surface-secondary transition-colors">
                <LayoutGrid className="w-3.5 h-3.5" />
                Contacts
                <ChevronDown className="w-3 h-3 text-text-secondary" />
              </button>
              <div className="flex items-center gap-1 bg-surface-secondary rounded-md px-3 py-1.5">
                <span className="text-[13px] font-medium text-text-primary">All contacts</span>
                <span className="text-[11px] font-semibold bg-[#006162] text-white px-1.5 py-0.5 rounded-sm ml-1">235</span>
                <button className="ml-1 text-text-muted hover:text-text-primary"><MoreVertical className="w-3 h-3" /></button>
                <button className="text-text-muted hover:text-text-primary"><X className="w-3 h-3" /></button>
              </div>
              <button className="text-[13px] font-medium text-text-primary hover:bg-surface-secondary px-3 py-1.5 rounded-md transition-colors">My contacts</button>
              <button className="text-[13px] font-medium text-text-primary hover:bg-surface-secondary px-3 py-1.5 rounded-md transition-colors">Unassigned contacts</button>
              <button className="p-1.5 border border-border-primary rounded-full hover:bg-surface-secondary transition-colors">
                <Plus className="w-3.5 h-3.5 text-text-secondary" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 hover:bg-surface-secondary rounded transition-colors">
                <MoreVertical className="w-4 h-4 text-text-secondary" />
              </button>
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-[13px] font-medium rounded-md hover:opacity-90 transition-opacity">
                Add contacts
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Search + toolbar */}
          <div className="px-6 py-3 space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-[600px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-9 pr-4 py-2 border border-border-primary rounded-md text-[13px] font-light text-text-primary bg-background placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-border-primary"
                />
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border-primary rounded-md text-[13px] font-light text-text-primary hover:bg-surface-secondary transition-colors">
                  <LayoutGrid className="w-3.5 h-3.5" />
                  Table view
                  <ChevronDown className="w-3 h-3 text-text-secondary" />
                </button>
                <button className="p-1.5 border border-border-primary rounded-md hover:bg-surface-secondary transition-colors">
                  <Settings2 className="w-4 h-4 text-text-secondary" />
                </button>
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border-primary rounded-md text-[13px] font-light text-text-primary hover:bg-surface-secondary transition-colors">Edit columns</button>
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border-primary rounded-md text-[13px] font-light text-text-primary hover:bg-surface-secondary transition-colors">
                  <Filter className="w-3.5 h-3.5" />
                  Filters
                </button>
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border-primary rounded-md text-[13px] font-light text-text-primary hover:bg-surface-secondary transition-colors">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  Sort
                </button>
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border-primary rounded-md text-[13px] font-light text-text-primary hover:bg-surface-secondary transition-colors">
                  <BarChart3 className="w-3.5 h-3.5" />
                  Metrics
                </button>
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border-primary rounded-md text-[13px] font-light text-text-primary hover:bg-surface-secondary transition-colors">
                  <Download className="w-3.5 h-3.5" />
                  Export
                </button>
                <button className="p-1.5 border border-border-primary rounded-md hover:bg-surface-secondary transition-colors">
                  <Copy className="w-4 h-4 text-text-secondary" />
                </button>
                <button className="px-3 py-1.5 text-[13px] font-light text-text-muted">Save</button>
              </div>
            </div>

            {/* Filter chips */}
            <div className="flex items-center gap-3">
              {['Contact owner', 'Create date', 'Last activity date', 'Lead status'].map(f => (
                <button key={f} className="inline-flex items-center gap-1 text-[13px] font-medium text-text-primary hover:underline">
                  {f}
                  <ChevronDown className="w-3 h-3 text-text-secondary" />
                </button>
              ))}
              <button className="inline-flex items-center gap-1 text-[13px] font-light text-text-primary hover:underline">
                <Plus className="w-3 h-3" /> More
              </button>
              <button className="inline-flex items-center gap-1.5 text-[13px] font-light text-text-primary hover:underline ml-2">
                <Filter className="w-3.5 h-3.5 text-text-secondary" />
                Advanced filters
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto px-6">
            <table className="w-full text-[12px] min-w-[1100px] border border-border-primary rounded-lg overflow-hidden" style={{ borderCollapse: 'separate', borderSpacing: 0, borderRadius: '8px' }}>
              <thead className="sticky top-0 z-10">
                <tr className="bg-surface-secondary border-b border-border-primary">
                  <th className="w-10 px-3 py-2"><input type="checkbox" className="rounded border-border-primary" /></th>
                  <th className="text-left px-3 py-2 font-semibold text-text-primary">Name</th>
                  <th className="text-left px-3 py-2 font-semibold text-text-primary">Email</th>
                  <th className="text-left px-3 py-2 font-semibold text-text-primary">Phone Number</th>
                  <th className="text-left px-3 py-2 font-semibold text-text-primary">Contact owner</th>
                  <th className="text-left px-3 py-2 font-semibold text-text-primary">Primary company</th>
                  <th className="text-left px-3 py-2 font-semibold text-text-primary">Last Activity Date (EDT)</th>
                  <th className="text-left px-3 py-2 font-semibold text-text-primary">Lead Status</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact, i) => (
                  <tr key={i} className="border-b border-border-primary hover:bg-surface-secondary/50 transition-colors">
                    <td className="px-3 py-2.5"><input type="checkbox" className="rounded border-border-primary" /></td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-full bg-surface-secondary text-[10px] font-semibold text-text-secondary flex items-center justify-center shrink-0">
                          {contact.companyIcon || contact.initials}
                        </span>
                        <a href="#" className="text-[#0b6cda] font-medium hover:underline">{contact.name}</a>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-[#0b6cda] font-light">{contact.email}</span>
                      {contact.hasExternalLink && <ExternalLink className="w-3 h-3 inline ml-1 text-text-muted" />}
                    </td>
                    <td className="px-3 py-2.5 text-text-secondary font-light">{contact.phone}</td>
                    <td className="px-3 py-2.5 text-text-secondary font-light">{contact.owner}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded bg-surface-secondary text-[9px] flex items-center justify-center shrink-0 text-text-muted">🏢</span>
                        <a href="#" className="text-[#0b6cda] font-medium hover:underline truncate max-w-[180px]">{contact.company}</a>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-text-secondary font-light">{contact.lastActivity}</td>
                    <td className="px-3 py-2.5 text-text-secondary font-light">{contact.leadStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-3 border-t border-border-primary flex items-center justify-center gap-2">
            <button className="inline-flex items-center gap-1 text-[13px] text-text-muted font-light hover:text-text-primary">
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(p => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-7 h-7 rounded text-[13px] transition-colors ${
                  currentPage === p
                    ? 'border border-text-primary font-semibold text-text-primary'
                    : 'text-text-secondary font-light hover:bg-surface-secondary'
                }`}
              >
                {p}
              </button>
            ))}
            <button className="inline-flex items-center gap-1 text-[13px] text-text-primary font-light hover:text-text-primary">
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button className="inline-flex items-center gap-1 ml-4 text-[13px] text-text-primary font-light hover:bg-surface-secondary px-2 py-1 rounded transition-colors">
              25 per page <ChevronDown className="w-3 h-3 text-text-secondary" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contacts;
