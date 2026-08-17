import React, { useState } from 'react';
import { Search, ExternalLink, ChevronDown, Link2, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { GlobalToolbar } from '@/components/GlobalToolbar';
import { LeftNavigation } from '@/components/LeftNavigation';
import { ShortAnswerPanel } from '@/components/ShortAnswerPanel';
import { ArticleEditor } from '@/components/ArticleEditor';
import { RecommendationsQueue } from '@/components/RecommendationsQueue';
import { useBookmarks } from '@/hooks/useBookmarks';
import { navigationItems } from '@/data/navigationData';

interface Article {
  title: string;
  recommendation: string;
  sourceType: 'Customer Agent' | 'Human';
  sources: number;
  lastConversationOn: string;
  lastConversationTime: string;
}

const articles: Article[] = [
  { title: 'Service Level Agreements', recommendation: 'Update Biketools support article to include details on Service Level Agreements', sourceType: 'Customer Agent', sources: 5, lastConversationOn: 'Mar 24, 2025', lastConversationTime: '9:28 PM' },
  { title: 'How to Get Help', recommendation: 'Update Support article to include specific instructions on how users can get help', sourceType: 'Human', sources: 4, lastConversationOn: 'Mar 24, 2025', lastConversationTime: '9:28 PM' },
  { title: 'Bike vendors', recommendation: 'Create a short answer on which bike vendors Biketools partners with', sourceType: 'Customer Agent', sources: 2, lastConversationOn: 'Mar 24, 2025', lastConversationTime: '9:28 PM' },
  { title: 'Tire Pressure Guidance', recommendation: 'Create an article explaining recommended tire pressure ranges for road, mountain, and hybrid bikes', sourceType: 'Customer Agent', sources: 2, lastConversationOn: 'Mar 25, 2025', lastConversationTime: '7:31 PM' },
  { title: 'Warranty Coverage', recommendation: 'Update Warranty article to clarify what parts and labor are covered under the Biketools warranty', sourceType: 'Human', sources: 3, lastConversationOn: 'Mar 25, 2025', lastConversationTime: '7:31 PM' },
  { title: 'Shipping & Returns', recommendation: 'Add a dedicated article outlining shipping timelines and the return process for bike accessories', sourceType: 'Human', sources: 4, lastConversationOn: 'Mar 25, 2025', lastConversationTime: '7:31 PM' },
  { title: 'Bike Fitting Services', recommendation: 'Create an article describing in-store bike fitting services and how to book an appointment', sourceType: 'Customer Agent', sources: 2, lastConversationOn: 'Mar 29, 2025', lastConversationTime: '4:29 PM' },
  { title: 'Seasonal Tune-Ups', recommendation: 'Update Maintenance article to include seasonal tune-up packages and pricing', sourceType: 'Customer Agent', sources: 3, lastConversationOn: 'Mar 29, 2025', lastConversationTime: '4:29 PM' },
];

const KnowledgeBase: React.FC = () => {
  const [isNavExpanded, setIsNavExpanded] = useState(() => localStorage.getItem('nav-expanded') !== 'false');
  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();
  const [activeTab, setActiveTab] = useState<'Manage' | 'Analyze' | 'Content gaps' | 'Recommendations'>('Recommendations');
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceTypeFilter, setSourceTypeFilter] = useState<'All' | 'Customer Agent' | 'Human'>('All');
  const [sourcesFilter, setSourcesFilter] = useState<'All' | '1-2' | '3-4' | '5+'>('All');
  const [lastConvFilter, setLastConvFilter] = useState<'All' | 'Last 7 days' | 'Last 30 days'>('All');
  const [shortAnswerGap, setShortAnswerGap] = useState<Article | null>(null);
  const [editorGap, setEditorGap] = useState<Article | null>(null);

  const handleGapClick = (a: Article) => {
    if (/short answer/i.test(a.recommendation) || /^create /i.test(a.recommendation)) {
      setShortAnswerGap(a);
    } else {
      setEditorGap(a);
    }
  };

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

  const filtered = articles.filter(a => {
    if (!a.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (sourceTypeFilter !== 'All' && a.sourceType !== sourceTypeFilter) return false;
    if (sourcesFilter !== 'All') {
      if (sourcesFilter === '1-2' && (a.sources < 1 || a.sources > 2)) return false;
      if (sourcesFilter === '3-4' && (a.sources < 3 || a.sources > 4)) return false;
      if (sourcesFilter === '5+' && a.sources < 5) return false;
    }
    return true;
  });

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
        <div className="px-8 pt-6 pb-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-[22px] font-semibold text-text-primary">Knowledge base</h1>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border-primary rounded-md text-[13px] font-light text-text-primary hover:bg-surface-secondary transition-colors">
                    Configure
                    <ChevronDown className="w-3 h-3 text-text-secondary" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem>Theme</DropdownMenuItem>
                  <DropdownMenuItem>Header</DropdownMenuItem>
                  <DropdownMenuItem>Footer</DropdownMenuItem>
                  <DropdownMenuItem>Categories</DropdownMenuItem>
                  <DropdownMenuItem>Agent</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <button className="px-4 py-1.5 bg-[#141414] text-white text-[13px] font-medium rounded-md hover:opacity-90 transition-opacity">
                Create article
              </button>
            </div>
          </div>

          {/* KB selector + URL */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2 text-[13px] text-text-primary">
              <span className="text-text-muted">📁</span>
              <span className="font-light">Knowledge base:</span>
              <button className="inline-flex items-center gap-1 font-medium hover:underline">
                Knowledge Base
                <ChevronDown className="w-3 h-3 text-text-secondary" />
              </button>
            </div>
            <div className="flex items-center gap-1.5 text-[13px]">
              <Link2 className="w-3.5 h-3.5 text-text-muted" />
              <span className="text-text-muted font-light">URL:</span>
              <a href="#" className="text-[#0b6cda] font-medium hover:underline inline-flex items-center gap-1">
                https://46271100.hs-sites.com
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-border-primary">
            {(['Manage', 'Analyze', 'Content gaps', 'Recommendations'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-[13px] font-medium transition-colors relative ${
                  activeTab === tab
                    ? 'text-text-primary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {tab}
                  {(tab === 'Content gaps' || tab === 'Recommendations') && (
                    <span className="text-[9px] font-semibold bg-[#006162] text-white px-1.5 py-0.5 rounded-sm">✦ AI</span>
                  )}
                </span>
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6">
        {activeTab === 'Recommendations' ? (
          <>
            <p className="text-[13px] font-light text-text-secondary mb-4 max-w-3xl">
              A prioritized queue of recommended changes to your knowledge base, sourced from real conversations. Accept, edit before accepting, reject, or mark as done — accepted changes write back to your knowledge base.
            </p>
            <RecommendationsQueue />
          </>
        ) : (
          <>
          {/* Description */}
          <p className="text-[13px] font-light text-text-secondary mb-4 max-w-3xl">
            See what gaps you have in your content based on real conversation data sourced from Customer Agent and human agents. Then fill the gaps by adding or updating knowledge sources.
          </p>

          {/* Search */}
          <div className="mb-3">
            <div className="relative w-[280px]">
              <input
                type="text"
                placeholder="Search suggestions"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-9 py-2 border border-border-primary rounded-md text-[13px] font-light text-text-primary bg-background placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-border-primary"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mb-4">
            <select
              value={sourceTypeFilter}
              onChange={(e) => setSourceTypeFilter(e.target.value as typeof sourceTypeFilter)}
              className="px-3 py-1.5 border border-border-primary rounded-md text-[13px] font-light text-text-primary bg-background hover:bg-surface-secondary focus:outline-none focus:ring-1 focus:ring-border-primary"
            >
              <option value="All">Source type: All</option>
              <option value="Customer Agent">Source type: Customer Agent</option>
              <option value="Human">Source type: Human</option>
            </select>
            <select
              value={sourcesFilter}
              onChange={(e) => setSourcesFilter(e.target.value as typeof sourcesFilter)}
              className="px-3 py-1.5 border border-border-primary rounded-md text-[13px] font-light text-text-primary bg-background hover:bg-surface-secondary focus:outline-none focus:ring-1 focus:ring-border-primary"
            >
              <option value="All">Sources: All</option>
              <option value="1-2">Sources: 1-2</option>
              <option value="3-4">Sources: 3-4</option>
              <option value="5+">Sources: 5+</option>
            </select>
            <select
              value={lastConvFilter}
              onChange={(e) => setLastConvFilter(e.target.value as typeof lastConvFilter)}
              className="px-3 py-1.5 border border-border-primary rounded-md text-[13px] font-light text-text-primary bg-background hover:bg-surface-secondary focus:outline-none focus:ring-1 focus:ring-border-primary"
            >
              <option value="All">Last Conversation: All</option>
              <option value="Last 7 days">Last Conversation: Last 7 days</option>
              <option value="Last 30 days">Last Conversation: Last 30 days</option>
            </select>
          </div>

          {/* Table */}
          <div className="border border-border-primary rounded-lg overflow-hidden">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-surface-secondary border-b border-border-primary">
                  {([
                    { label: 'Content Gap', align: 'left', width: '', tip: 'Topic gaps that were identified through Customer Agent and human agent conversations, with recommended next steps' },
                    { label: 'Source type', align: 'center', width: 'w-[140px]', tip: "The source of the topic gap. Customer Agent topic gaps are based on questions Customer Agent couldn't answer. Human topic gaps are derived from human rep only conversations where content is lacking in the Knowledge Base today" },
                    { label: 'Frequency', align: 'center', width: 'w-[120px]', tip: 'The number of conversations associated with the Content Gap, indicating the level of importance of filling this gap' },
                    { label: 'Last Conversation', align: 'left', width: 'w-[160px]', tip: 'The last time there was a conversation associated with the topic' },
                  ] as const).map(col => (
                    <th key={col.label} className={`text-${col.align} px-5 py-3 font-semibold text-text-primary ${col.width}`}>
                      <TooltipProvider delayDuration={150}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className={`inline-flex items-center gap-1 ${col.align === 'center' ? 'justify-center' : ''}`}>
                              {col.label}
                              <HelpCircle className="w-3.5 h-3.5 text-text-muted" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs bg-[#141414] text-white border-[#141414] text-[12px] font-light" hasArrow>
                            {col.tip}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((article, i) => (
                  <tr key={i} className="border-b border-border-primary last:border-b-0 hover:bg-surface-secondary/50 transition-colors">
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleGapClick(article)}
                        className="font-semibold text-text-primary underline text-left hover:opacity-80"
                      >
                        {article.title}
                      </button>
                      <div className="text-text-secondary font-light mt-0.5">{article.recommendation}</div>
                    </td>
                    <td className="px-5 py-4 text-center text-text-primary font-light">{article.sourceType}</td>
                    <td className="px-5 py-4 text-text-primary font-light text-center">{article.sources}</td>
                    <td className="px-5 py-4">
                      <div className="text-text-primary font-light">{article.lastConversationOn}</div>
                      <div className="text-[11px] text-text-muted font-light">{article.lastConversationTime}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}
        </div>
      </main>

      <ShortAnswerPanel
        open={!!shortAnswerGap}
        onClose={() => setShortAnswerGap(null)}
        topic={shortAnswerGap?.title || ''}
        suggestedQuestion={shortAnswerGap ? `What is ${shortAnswerGap.title}?` : ''}
      />
      <ArticleEditor
        open={!!editorGap}
        onClose={() => setEditorGap(null)}
        topic={editorGap?.title || ''}
        recommendation={editorGap?.recommendation || ''}
      />
    </div>
  );
};

export default KnowledgeBase;
