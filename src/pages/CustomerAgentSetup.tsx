import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Settings, FileText, Plus, Info, ExternalLink } from 'lucide-react';
import CustomerAgentIdentity from '@/components/CustomerAgentIdentity';
import CustomerAgentPermissions from '@/components/CustomerAgentPermissions';
import CustomerAgentChannels from '@/components/CustomerAgentChannels';
import CustomerAgentChannelSettings from '@/components/CustomerAgentChannelSettings';
import CustomerAgentUseCases from '@/components/CustomerAgentUseCases';
import CustomerAgentAnalyze from '@/components/CustomerAgentAnalyze';
import CustomerAgentKnowledge from '@/components/CustomerAgentKnowledge';
import CustomerAgentActions from '@/components/CustomerAgentActions';
import CustomerAgentGuidelines from '@/components/CustomerAgentGuidelines';
import CustomerAgentHumanHandoff from '@/components/CustomerAgentHumanHandoff';
import CustomerAgentKnowledgeGaps from '@/components/CustomerAgentKnowledgeGaps';
import CustomerAgentCoachingOpportunities from '@/components/CustomerAgentCoachingOpportunities';
import CustomerAgentReplyRecommendations from '@/components/CustomerAgentReplyRecommendations';
import CustomerAgentWorkflowsBots from '@/components/CustomerAgentWorkflowsBots';
import { GlobalToolbar } from '@/components/GlobalToolbar';
import { LeftNavigation } from '@/components/LeftNavigation';
import { useBookmarks } from '@/hooks/useBookmarks';
import { navigationItems } from '@/data/navigationData';

type SidebarSection = 'Define' | 'Train' | 'Deploy' | 'Analyze';

const CustomerAgentSetup: React.FC = () => {
  const [isNavExpanded, setIsNavExpanded] = useState(() => localStorage.getItem('nav-expanded') !== 'false');
  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();
  const [activeTab, setActiveTab] = useState('Overview');
  const [expandedSections, setExpandedSections] = useState<Record<SidebarSection, boolean>>({
    Define: true,
    Train: true,
    Deploy: true,
    Analyze: true,
  });

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

  const toggleSection = (section: SidebarSection) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const sidebarSections: { title: SidebarSection; items: string[] }[] = [
    { title: 'Define', items: ['Identity', 'Segments', 'Permissions'] },
    { title: 'Train', items: ['Knowledge', 'Actions', 'Guidelines', 'Human handoff'] },
    { title: 'Deploy', items: ['Channels', 'Channel settings', 'Workflows and bots', 'Reply recommendations'] },
    { title: 'Analyze', items: ['Performance', 'Coaching opportunities', 'Knowledge gaps', 'Lead qualification'] },
  ];

  const metrics = [
    { label: 'CONVERSATIONS HANDLED', value: '17', change: '+7', arrow: 'up' as const, changeColor: 'text-green-600' },
    { label: 'CONVERSATIONS RESOLVED', value: '11', change: '+3', arrow: 'up' as const, changeColor: 'text-green-600' },
    { label: 'RESOLUTION RATE', value: '65%', change: '−15%', arrow: 'down' as const, changeColor: 'text-red-500' },
    { label: 'TIME TO RESOLUTION', value: '20 hr', change: '+20 hr', arrow: 'up' as const, changeColor: 'text-red-500' },
  ];

  const boostCards = [
    { title: 'Add more content', desc: 'Give your agent knowledge to answer questions accurately.', time: '~ 15min', emoji: '📚' },
    { title: 'Deploy another channel', desc: 'Connect your agent to more channels to reach customers wherever they are.', time: '~ 2min', emoji: '💬' },
  ];

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
        {/* Header */}
        <div className="border-b border-border-primary bg-background px-8 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-[18px] font-semibold text-text-primary whitespace-nowrap">Customer Agent, Luma</h1>
            <span className="text-[11px] font-medium bg-[#4A6CF7] text-white px-3 py-0.5 rounded-full whitespace-nowrap shrink-0">Uses HubSpot Credits</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border-primary rounded-md text-[13px] font-light text-text-primary hover:bg-surface-secondary transition-colors">
              View credits
              <ExternalLink className="w-3 h-3" />
            </button>
            <button className="px-3 py-1.5 bg-[#141414] text-white text-[13px] font-light rounded-md hover:opacity-90 transition-opacity whitespace-nowrap">
              Test Luma
            </button>
          </div>
        </div>

        {/* Content area with sidebar */}
        <div className="flex">
          {/* Inner sidebar */}
          <div className="w-[220px] flex-shrink-0 border-r border-border-primary min-h-[calc(100vh-var(--toolbar-height)-72px)]">
            <div className="py-3 px-4">
              {/* Overview */}
              <button
                onClick={() => setActiveTab('Overview')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-light mb-2 transition-colors ${
                  activeTab === 'Overview'
                    ? 'bg-surface-secondary font-medium border-l-[3px] border-text-primary'
                    : 'hover:bg-surface-secondary'
                }`}
              >
                Overview
              </button>

              {/* Sections */}
              {sidebarSections.map((section) => (
                <div key={section.title} className="mb-1">
                  <div className="border-t border-border-primary my-2" />
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-text-primary hover:bg-surface-secondary rounded-md transition-colors"
                  >
                    {section.title}
                    {expandedSections[section.title] ? (
                      <ChevronUp className="w-4 h-4 text-text-secondary" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-text-secondary" />
                    )}
                  </button>
                  {expandedSections[section.title] && section.items.length > 0 && (
                    <div className="ml-1 mt-1 space-y-0.5">
                      {section.items.map((item) => (
                        <button
                          key={item}
                          onClick={() => setActiveTab(item)}
                          className={`w-full text-left px-3 py-1.5 rounded-md text-sm font-light transition-colors ${
                            activeTab === item
                              ? 'bg-surface-secondary font-medium border-l-[3px] border-text-primary'
                              : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main content */}
          {activeTab === 'Identity' ? (
            <CustomerAgentIdentity />
          ) : activeTab === 'Segments' ? (
            <CustomerAgentUseCases />
          ) : activeTab === 'Permissions' ? (
            <CustomerAgentPermissions />
          ) : activeTab === 'Channels' ? (
            <CustomerAgentChannels />
          ) : activeTab === 'Channel settings' ? (
            <CustomerAgentChannelSettings />
          ) : activeTab === 'Knowledge' ? (
            <CustomerAgentKnowledge />
          ) : activeTab === 'Actions' ? (
            <CustomerAgentActions />
          ) : activeTab === 'Guidelines' ? (
            <CustomerAgentGuidelines />
          ) : activeTab === 'Human handoff' ? (
            <CustomerAgentHumanHandoff />
          ) : activeTab === 'Knowledge gaps' ? (
            <CustomerAgentKnowledgeGaps />
          ) : activeTab === 'Coaching opportunities' ? (
            <CustomerAgentCoachingOpportunities />
          ) : activeTab === 'Reply recommendations' ? (
            <CustomerAgentReplyRecommendations />
          ) : activeTab === 'Workflows and bots' ? (
            <CustomerAgentWorkflowsBots />
          ) : activeTab === 'Performance' || activeTab === 'Lead qualification' ? (
            <CustomerAgentAnalyze />
          ) : (
          <div className="flex-1 px-10 py-8">
            {/* Top knowledge gaps */}
            <h2 className="text-[22px] font-semibold text-text-primary mb-4">Top knowledge gaps</h2>
            <div className="border border-border-primary rounded-lg px-6 py-10 mb-10 text-center">
              <h3 className="text-[16px] font-semibold text-text-primary mb-2">Everything is covered</h3>
              <p className="text-[13px] text-text-secondary font-light max-w-[640px] mx-auto">
                When topics appear that Luma can't answer with confidence, they'll show up here as knowledge gaps.
              </p>
            </div>

            {/* Impact past week */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[22px] font-semibold text-text-primary">Impact past week</h2>
              <button className="px-4 py-2 border border-border-primary rounded-md text-sm font-light text-text-primary hover:bg-surface-secondary transition-colors">
                View all reports
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-10">
              {metrics.map((metric, i) => (
                <div key={i} className="border border-border-primary rounded-lg p-6 flex flex-col items-center justify-center min-h-[180px]">
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="text-[11px] font-semibold text-text-secondary tracking-wider">{metric.label}</span>
                    <Info className="w-3.5 h-3.5 text-text-muted" />
                  </div>
                  <span className="text-[34px] font-semibold text-text-primary mb-2 leading-none">{metric.value}</span>
                  <div className="flex items-center gap-1 text-xs">
                    <span className={metric.arrow === 'up' ? 'text-green-600' : 'text-red-500'}>
                      {metric.arrow === 'up' ? '▲' : '▼'}
                    </span>
                    <span className={`${metric.changeColor} font-medium`}>{metric.change}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Boost your agent's responses */}
            <h2 className="text-[22px] font-semibold text-text-primary mb-4">Boost your agent's responses</h2>
            <div className="grid grid-cols-3 gap-4">
              {boostCards.map((card, i) => (
                <button key={i} className="border border-border-primary rounded-lg p-6 text-center hover:bg-surface-secondary transition-colors flex flex-col items-center">
                  <div className="text-[32px] mb-3">{card.emoji}</div>
                  <h3 className="text-[15px] font-semibold text-text-primary mb-2">{card.title}</h3>
                  <p className="text-[12px] text-text-secondary font-light mb-4 max-w-[260px]">{card.desc}</p>
                  <span className="text-[12px] text-text-muted font-light mt-auto">{card.time}</span>
                </button>
              ))}
            </div>
          </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerAgentSetup;
