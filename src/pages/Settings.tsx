import React, { useState } from 'react';
import { ChevronLeft, ChevronDown, ChevronUp, ExternalLink, Info, Search } from 'lucide-react';
import InboxesSettings from '@/components/InboxesSettings';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GlobalToolbar } from '@/components/GlobalToolbar';
import { LeftNavigation } from '@/components/LeftNavigation';
import { SimplifiedLeftNavigation } from '@/components/SimplifiedLeftNavigation';
import { useBookmarks } from '@/hooks/useBookmarks';
import { navigationItems } from '@/data/navigationData';
import { useToast } from '@/hooks/use-toast';

const settingsNav = [
  {
    heading: 'Your Preferences',
    items: [
      { id: 'general', label: 'General' },
      { id: 'notifications', label: 'Notifications' },
    ],
  },
  {
    heading: 'Organization Management',
    items: [
      { id: 'multi-account', label: 'Multi-Account' },
      { id: 'asset-copying', label: 'Asset Copying' },
    ],
  },
  {
    heading: 'Account Management',
    items: [
      { id: 'account-defaults', label: 'Account Defaults' },
      { id: 'account-billing', label: 'Account & Billing', external: true },
      { id: 'account-cleanup', label: 'Account Cleanup', badge: 'Beta' },
      { id: 'audit-log', label: 'Audit Log' },
      { id: 'users-teams', label: 'Users & Teams' },
      { id: 'product-updates', label: 'Product Updates', external: true },
      { id: 'integrations', label: 'Integrations', expandable: true, subItems: [
        { id: 'connected-apps', label: 'Connected Apps' },
        { id: 'service-keys', label: 'Service Keys' },
        { id: 'private-apps', label: 'Private Apps' },
      ]},
      { id: 'marketplace-downloads', label: 'Marketplace Downloads' },
      { id: 'tracking-analytics', label: 'Tracking & Analytics', expandable: true, subItems: [
        { id: 'tracking-code', label: 'Tracking Code' },
        { id: 'attribution', label: 'Attribution' },
        { id: 'tracking-urls', label: 'Tracking URLs' },
        { id: 'external-web-urls', label: 'External Web URLs' },
      ]},
      { id: 'privacy-consent', label: 'Privacy & Consent' },
      { id: 'sandboxes', label: 'Sandboxes' },
      { id: 'security', label: 'Security' },
      { id: 'multi-brand', label: 'Multi-Brand' },
      { id: 'approvals', label: 'Approvals' },
      { id: 'routing', label: 'Routing' },
      { id: 'ai', label: 'AI' },
      { id: 'payments-account', label: 'Payments Account' },
    ],
  },
  {
    heading: 'Data Management',
    items: [
      { id: 'properties', label: 'Properties' },
      { id: 'objects', label: 'Objects' },
      { id: 'translations', label: 'Translations' },
      { id: 'data-enrichment', label: 'Data Enrichment' },
      { id: 'markets', label: 'Markets', badge: 'Beta' },
    ],
  },
  {
    heading: 'Tools',
    items: [
      { id: 'meetings', label: 'Meetings' },
      { id: 'calling', label: 'Calling', expandable: true, subItems: [
        { id: 'call-setup', label: 'Call Setup' },
        { id: 'blocked-numbers', label: 'Blocked Numbers List' },
        { id: 'ivr', label: 'Interactive Voice Response' },
      ]},
      { id: 'sales-workspace', label: 'Sales Workspace' },
      { id: 'inbox-helpdesk', label: 'Inbox & Help Desk', expandable: true, subItems: [
        { id: 'inboxes', label: 'Inboxes' },
        { id: 'help-desk', label: 'Help Desk' },
        { id: 'availability-management', label: 'Availability Management' },
        { id: 'allow-deny-list', label: 'Allow & Deny List' },
      ]},
      { id: 'customer-success', label: 'Customer Success' },
      { id: 'marketing-tools', label: 'Marketing', expandable: true, subItems: [
        { id: 'ads', label: 'Ads' },
        { id: 'emails', label: 'Emails' },
        { id: 'campaigns', label: 'Campaigns' },
        { id: 'forms', label: 'Forms' },
      ]},
      { id: 'sms', label: 'SMS' },
      { id: 'content-tools', label: 'Content', expandable: true, subItems: [
        { id: 'domains-urls', label: 'Domains & URLs' },
        { id: 'case-studies', label: 'Case Studies' },
        { id: 'knowledge-base', label: 'Knowledge Base' },
        { id: 'private-content', label: 'Private Content' },
        { id: 'customer-portal', label: 'Customer Portal' },
      ]},
      { id: 'commerce-tools', label: 'Commerce', expandable: true, subItems: [
        { id: 'payments', label: 'Payments' },
        { id: 'tax', label: 'Tax' },
      ]},
    ],
  },
];

const profileTabs = ['Profile', 'Email', 'Calling', 'Calendar', 'Tasks', 'Security', 'Automation'];

const Settings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as { settingsItem?: string; expandSection?: string } | null;
  const [isNavExpanded, setIsNavExpanded] = useState(() => localStorage.getItem('nav-expanded') !== 'false');
  const [useSimplifiedSidebar] = useState(() => localStorage.getItem('use-simplified-sidebar') === 'true');
  
  // Derive active item from route
  const getActiveItemFromRoute = () => {
    if (location.pathname.startsWith('/settings/inboxes')) return 'inboxes';
    return locationState?.settingsItem || 'general';
  };
  const [activeSettingsItem, setActiveSettingsItem] = useState(getActiveItemFromRoute);
  const [expandedItems, setExpandedItems] = useState<string[]>(() => {
    const saved = sessionStorage.getItem('settings-expanded-items');
    const initial = saved ? JSON.parse(saved) : [];
    if (locationState?.expandSection && !initial.includes(locationState.expandSection)) {
      initial.push(locationState.expandSection);
      sessionStorage.setItem('settings-expanded-items', JSON.stringify(initial));
    }
    return initial;
  });
  const [activeTab, setActiveTab] = useState('Profile');
  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();
  const { toast } = useToast();

  const handleToggleNav = () => { const next = !isNavExpanded; setIsNavExpanded(next); localStorage.setItem('nav-expanded', next ? 'true' : 'false'); };

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

  const isItemBookmarked = (itemId: string) => isBookmarked(itemId, 'main-nav');
  const allNavItems = navigationItems.flatMap(n => n.sections?.flatMap(s => s.items) || []);
  const bookmarkedSections = bookmarks.length > 0 ? [{
    title: 'Saved Items',
    items: bookmarks.map(b => ({ id: b.id, label: b.label, href: b.href || allNavItems.find(i => i.id === b.id)?.href }))
  }] : [];

  return (
    <div className="min-h-screen font-lexend" style={{ paddingTop: 'var(--toolbar-height)', backgroundColor: useSimplifiedSidebar ? '#333333' : 'hsl(var(--secondary))' }}>
      <GlobalToolbar
        onSearch={() => {}}
        onCreateClick={() => {}}
        isNavExpanded={isNavExpanded}
        useSimplifiedSidebar={useSimplifiedSidebar}
        onToggleSidebarMode={() => {}}
        isSwitchingNav={false}
      />

      <div className="flex">
        {useSimplifiedSidebar ? (
          <SimplifiedLeftNavigation isExpanded={isNavExpanded} onToggleExpanded={handleToggleNav} />
        ) : (
          <LeftNavigation
            isExpanded={isNavExpanded}
            onToggleExpanded={handleToggleNav}
            bookmarkedSections={bookmarkedSections}
            onBookmarkClick={handleBookmarkClick}
            isItemBookmarked={isItemBookmarked}
            promoDismissed={true}
            onDismissPromo={() => {}}
            onTryItOut={() => {}}
          />
        )}

        {/* Content area */}
        <div
          className={`fixed right-0 bottom-0 bg-background rounded-tl-[12px] overflow-hidden transition-all duration-200 ${isNavExpanded ? 'left-60' : 'left-16'}`}
          style={{ top: 'var(--toolbar-height)' }}
        >
          <div className="h-full overflow-y-auto flex">
            {/* Settings sidebar */}
            <div className="w-[240px] min-w-[240px] border-r border-border-primary p-4 overflow-y-auto">
              <Link to="/" className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary mb-4">
                <ChevronLeft className="w-4 h-4" />
                Back
              </Link>

              <div className="mb-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search Settings"
                    className="w-full border border-border-primary rounded-full px-3 pr-9 py-1.5 text-sm bg-background text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-border-secondary"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                </div>
              </div>

              {settingsNav.map((section) => (
                <div key={section.heading} className="mb-8">
                  <h3 className="text-[16px] font-semibold text-text-primary leading-[20px] mb-3">{section.heading}</h3>
                  <ul className="space-y-3">
                    {section.items.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => {
                            if (item.subItems) {
                              setExpandedItems(prev => {
                                const next = prev.includes(item.id) ? prev.filter(i => i !== item.id) : [...prev, item.id];
                                sessionStorage.setItem('settings-expanded-items', JSON.stringify(next));
                                return next;
                              });
                            } else {
                              if (item.id === 'inboxes') {
                                navigate('/settings/inboxes');
                              } else {
                                navigate('/settings');
                              }
                              setActiveSettingsItem(item.id);
                            }
                          }}
                          className={`w-full flex items-center justify-between text-left text-sm px-2 py-1 rounded transition-colors font-light ${
                            activeSettingsItem === item.id
                              ? 'bg-muted text-text-primary border-l-[4px] border-text-primary'
                              : 'text-text-secondary hover:text-text-primary hover:bg-muted/50'
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            {item.label}
                            {item.external && <ExternalLink className="w-3 h-3" />}
                            {item.badge && (
                              <span className="text-[10px] bg-[#6431da] text-white px-1.5 py-0.5 rounded-full font-medium">
                                {item.badge}
                              </span>
                            )}
                          </span>
                          {item.expandable && (expandedItems.includes(item.id) ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                        </button>
                        {item.subItems && expandedItems.includes(item.id) && (
                          <ul className="ml-4 mt-3 space-y-3">
                            {item.subItems.map((sub) => (
                              <li key={sub.id}>
                                <button
                                  onClick={() => {
                                    if (sub.id === 'inboxes') {
                                      navigate('/settings/inboxes');
                                    } else {
                                      navigate('/settings');
                                    }
                                    setActiveSettingsItem(sub.id);
                                  }}
                                  className={`w-full text-left text-sm px-2 py-1 rounded transition-colors font-light ${
                                    activeSettingsItem === sub.id
                                      ? 'bg-muted text-text-primary border-l-[4px] border-text-primary'
                                      : 'text-text-secondary hover:text-text-primary hover:bg-muted/50'
                                  }`}
                                >
                                  {sub.label}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Main settings content */}
            <div className="flex-1 p-8 overflow-y-auto">
              {activeSettingsItem === 'inboxes' ? (
                <InboxesSettings />
              ) : (
              <>
              <h1 className="text-2xl font-bold text-text-primary mb-4">General</h1>

              {/* Tabs */}
              <div className="flex mb-6">
                {profileTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-4 py-2 text-sm transition-colors ${
                      activeTab === tab
                        ? 'bg-background font-medium text-text-primary border-t border-l border-r border-border-primary border-b-0'
                        : 'bg-[rgb(245,245,245)] text-text-secondary hover:text-text-primary font-light border border-border-primary'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <p className="text-sm text-text-secondary mb-6">These preferences only apply to you.</p>
              <hr className="border-border-primary mb-6" />

              {/* Global section */}
              <h2 className="text-xl font-bold text-text-primary mb-1">Global</h2>
              <p className="text-sm text-text-secondary mb-6">This applies across any HubSpot accounts you have.</p>

              {/* Profile Image */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-text-primary mb-2">Profile Image</label>
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-xl font-bold">
                  CH
                </div>
              </div>

              {/* First name */}
              <div className="mb-5 max-w-md">
                <label className="block text-sm font-bold text-text-primary mb-1">First name</label>
                <input
                  type="text"
                  defaultValue="Claire"
                  className="w-full border border-border-primary rounded px-3 py-2 text-sm bg-background text-text-primary focus:outline-none focus:ring-1 focus:ring-border-secondary"
                />
              </div>

              {/* Last name */}
              <div className="mb-5 max-w-md">
                <label className="block text-sm font-bold text-text-primary mb-1">Last name</label>
                <input
                  type="text"
                  defaultValue="Ha"
                  className="w-full border border-border-primary rounded px-3 py-2 text-sm bg-background text-text-primary focus:outline-none focus:ring-1 focus:ring-border-secondary"
                />
              </div>

              {/* Language */}
              <div className="mb-5 max-w-md">
                <label className="flex items-center gap-1 text-sm font-bold text-text-primary mb-1">
                  Language <Info className="w-3.5 h-3.5 text-text-muted" />
                </label>
                <select className="w-full border border-border-primary rounded px-3 py-2 text-sm bg-background text-text-primary focus:outline-none focus:ring-1 focus:ring-border-secondary">
                  <option>English</option>
                </select>
              </div>

              {/* Date format */}
              <div className="mb-5 max-w-md">
                <label className="flex items-center gap-1 text-sm font-bold text-text-primary mb-1">
                  Date, time, and number format <Info className="w-3.5 h-3.5 text-text-muted" />
                </label>
                <p className="text-xs text-text-muted mb-1">
                  Format: April 1, 2026, 04/01/2026, 4:26 PM EDT, and 1,234.56
                </p>
                <select className="w-full border border-border-primary rounded px-3 py-2 text-sm bg-background text-text-primary focus:outline-none focus:ring-1 focus:ring-border-secondary">
                  <option>United States</option>
                </select>
              </div>

              {/* Phone number */}
              <div className="mb-8 max-w-md">
                <label className="block text-sm font-bold text-text-primary mb-1">Phone number</label>
                <p className="text-xs text-text-muted mb-1">
                  We may use this phone number to contact you about security events. Please refer to our privacy policy for{' '}
                  <a href="#" className="text-text-accent underline">more information</a>
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 border border-border-primary rounded px-2 py-2 text-sm">
                    🇺🇸 <ChevronDown className="w-3 h-3" />
                  </div>
                  <input
                    type="text"
                    defaultValue="+1"
                    className="border border-border-primary rounded px-3 py-2 text-sm bg-background text-text-primary focus:outline-none focus:ring-1 focus:ring-border-secondary w-32"
                  />
                </div>
              </div>

              <hr className="border-border-primary mb-6" />

              {/* Defaults */}
              <h2 className="text-xl font-bold text-text-primary mb-1">Defaults</h2>
              <p className="text-sm text-text-secondary mb-6">This only applies to this HubSpot account.</p>

              <div className="mb-5 max-w-md">
                <label className="flex items-center gap-1 text-sm font-bold text-text-primary mb-1">
                  Default Home Page <Info className="w-3.5 h-3.5 text-text-muted" />
                </label>
                <select className="w-full border border-border-primary rounded px-3 py-2 text-sm bg-background text-text-primary focus:outline-none focus:ring-1 focus:ring-border-secondary">
                  <option>Pick a default home page</option>
                </select>
              </div>
              </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
