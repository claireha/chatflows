import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExternalLink, Info, Check, X, Send, Eye, ChevronUp, ChevronDown, ChevronRight, BookOpen, CheckCircle2, AlertTriangle, ToggleLeft, ToggleRight } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { GlobalToolbar } from '@/components/GlobalToolbar';
import { LeftNavigation } from '@/components/LeftNavigation';
import { useBookmarks } from '@/hooks/useBookmarks';
import { navigationItems } from '@/data/navigationData';
import AvailabilitySettings, { type PreviewState, type PreviewData } from '@/components/AvailabilitySettings';
import { StatusToggle } from '@/components/StatusToggle';
import TargetTabContent from '@/components/TargetTabContent';
import RichTextEditor from '@/components/RichTextEditor';
import { languageDefaults } from '@/data/languageDefaults';
import RulesTabContent from '@/components/RulesTabContent';
import AssignTabContent from '@/components/AssignTabContent';



const accentColors = [
  { color: '#425b76', gradient: ['#33475b', '#506e8f'], selected: true },
  { color: '#6ec6c8', gradient: ['#56b0b2', '#86dce0'], selected: false },
  { color: '#e6457a', gradient: ['#d03060', '#f06a94'], selected: false },
  { color: '#f5a623', gradient: ['#e0901a', '#ffc040'], selected: false },
  { color: '#7c4dff', gradient: ['#6035e0', '#9a70ff'], selected: false },
];

const tabSlugMap: Record<string, string> = {
  'overview': 'Overview',
  'install': 'Install',
  'display': 'Display',
  'messages': 'Messages',
  'default': 'Default',
  'data-privacy-security': 'Data Privacy & Security',
  'target': 'Target',
  'tabs': 'Tabs',
  'nudges': 'Nudges',
  'chatflows': 'Chatflows',
  'analyze': 'Analyze',
};

const tabToSlug: Record<string, string> = Object.fromEntries(
  Object.entries(tabSlugMap).map(([slug, name]) => [name, slug])
);

const CrmChat: React.FC = () => {
  const { tab: tabParam } = useParams<{ tab?: string }>();
  const navigate = useNavigate();

  const resolvedTab = tabParam && tabSlugMap[tabParam] ? tabSlugMap[tabParam] : 'Overview';
  const [activeTab, setActiveTabState] = useState(resolvedTab);

  const setActiveTab = useCallback((tab: string) => {
    setActiveTabState(tab);
    const slug = tabToSlug[tab] || 'overview';
    navigate(`/crm/chat/${slug}`, { replace: true });
  }, [navigate]);

  useEffect(() => {
    const resolved = tabParam && tabSlugMap[tabParam] ? tabSlugMap[tabParam] : 'Overview';
    setActiveTabState(resolved);
    // Open configure category if the tab is inside it
    if (['Install', 'Target', 'Data Privacy & Security'].includes(resolved)) {
      setConfigureCategoryOpen(true);
    }
    if (['Display', 'Messages', 'Tabs'].includes(resolved)) {
      setDisplayCategoryOpen(true);
    }
    if (['Default', 'Chatflows', 'Nudges'].includes(resolved)) {
      setChatflowsCategoryOpen(true);
    }
  }, [tabParam]);
  const [configureCategoryOpen, setConfigureCategoryOpen] = useState(true);
  const [displayCategoryOpen, setDisplayCategoryOpen] = useState(true);
  const [chatflowsCategoryOpen, setChatflowsCategoryOpen] = useState(true);
  const [configureTab, setConfigureTab] = useState<'web-chat' | 'mobile-sdk'>('web-chat');
  const [trackingCodeInstalled, setTrackingCodeInstalled] = useState(true);
  const [isNavExpanded, setIsNavExpanded] = useState(() => localStorage.getItem('nav-expanded') !== 'false');
  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();

  // Design tab state
  const [selectedColor, setSelectedColor] = useState('#425b76');
  const [selectedGradient, setSelectedGradient] = useState<[string, string] | null>(['#33475b', '#506e8f']);
  const [hexInput, setHexInput] = useState('425b76');
  const [attachmentsOn, setAttachmentsOn] = useState(true);
  const [chatTranscript, setChatTranscript] = useState(true);
  const [widgetMovement, setWidgetMovement] = useState(false);
  const [cookieConsentEnabled, setCookieConsentEnabled] = useState(false);
  const [knowledgeBaseEnabled, setKnowledgeBaseEnabled] = useState(false);
  const [customerPortalEnabled, setCustomerPortalEnabled] = useState(false);
  const [knowledgeBaseSelection, setKnowledgeBaseSelection] = useState('knowledgebase-english');
  const [searchRecommendation, setSearchRecommendation] = useState('trending');
  const [widgetPreviewTab, setWidgetPreviewTab] = useState<'chat' | 'help' | 'tickets'>('chat');
  const [visitorVerificationEnabled, setVisitorVerificationEnabled] = useState(false);
  const [consentCommsEnabled, setConsentCommsEnabled] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState('');
  const [processDataEnabled, setProcessDataEnabled] = useState(false);
  const [consentType, setConsentType] = useState('legitimate-interest');
  const [processConsentText, setProcessConsentText] = useState("By using this chat service, you agree to the monitoring and recording of the chat and the processing of your personal data in accordance with our Privacy Policy.");
  const [cookieBannerTiming, setCookieBannerTiming] = useState('before-chat');
  const [cookieConsentText, setCookieConsentText] = useState("This chat service uses a cookie to interact with you and maintain your chat history. Our service provider, HubSpot, will monitor and record this chat for quality assurance (see their Privacy Policy).");
  const [welcomeMessageOpen, setWelcomeMessageOpen] = useState(false);
  const [welcomeMessages, setWelcomeMessages] = useState([
    { lang: 'Welcome Message', text: "Got any questions? I'm happy to help." },
  ]);
  const [genericErrorMessage, setGenericErrorMessage] = useState('Sorry, we are currently experiencing technical difficulties. Please try sending your message again shortly.');
  const [consentCookiesText, setConsentCookiesText] = useState('This chat service uses a cookie to interact with you and maintain your chat history. Our service provider will monitor and record this chat for quality assurance (see their Privacy Policy).');
  const [processConsentPersonalizeText, setProcessConsentPersonalizeText] = useState('By using this chat service, you agree to the monitoring and recording of the chat and the processing of your personal data in accordance with our Privacy Policy.');

  // Multi-language state
  const [openLanguageCards, setOpenLanguageCards] = useState<Record<string, boolean>>({ English: false });
  const [languageTexts, setLanguageTexts] = useState<Record<string, { welcomeMessage: string; genericErrorMessage: string; consentCookiesText: string; processConsentText: string }>>(() => {
    const initial: Record<string, { welcomeMessage: string; genericErrorMessage: string; consentCookiesText: string; processConsentText: string }> = {};
    languageDefaults.forEach(lang => {
      initial[lang.language] = {
        welcomeMessage: lang.welcomeMessage,
        genericErrorMessage: lang.genericErrorMessage,
        consentCookiesText: lang.consentCookiesText,
        processConsentText: lang.processConsentText,
      };
    });
    return initial;
  });

  const codeBlockRef = useRef<HTMLDivElement>(null);
  const iosCodeRef = useRef<HTMLDivElement>(null);
  const androidCodeRef = useRef<HTMLDivElement>(null);

  // Save button state
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const handleSave = async () => {
    setSaveState('saving');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 2000);
    } catch {
      setSaveState('error');
      setTimeout(() => setSaveState('idle'), 3000);
    }
  };

  const selectAndCopy = (ref: React.RefObject<HTMLDivElement>, text: string) => {
    const pre = ref.current?.querySelector('pre');
    if (pre) {
      const range = document.createRange();
      range.selectNodeContents(pre);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
    navigator.clipboard.writeText(text);
  };
  const [screenCapture, setScreenCapture] = useState(false);
  const [replyTimeSubtitle, setReplyTimeSubtitle] = useState('We typically reply in a few minutes');
  const [previewState, setPreviewState] = useState<PreviewState>('available');
  const [previewData, setPreviewData] = useState<PreviewData>({ state: 'available', message: '', behavior: 'show' });
  const [widgetPosition, setWidgetPosition] = useState<'left' | 'right'>('right');

  const handlePreviewDataChange = useCallback((data: PreviewData) => {
    setPreviewData(data);
  }, []);

  const previewStateLabels: Record<PreviewState, string> = {
    available: 'Available',
    away: 'Away',
    capacity: 'At Capacity',
    outside: 'Outside Hours',
  };

  const previewStateColors: Record<PreviewState, string> = {
    available: '#00823a',
    away: '#fccb57',
    capacity: '#d94c53',
    outside: '#8a8a8a',
  };

  const getPreviewMessage = () => {
    const welcomeText = welcomeMessages[0]?.text || "Got any questions? I'm happy to help.";
    if (previewState === 'available') return welcomeText;
    if (previewData.behavior === 'hide') return null;
    if (previewData.behavior === 'nothing') return welcomeText;
    if (previewData.behavior === 'return') return welcomeText;
    return previewData.message || welcomeText;
  };

  const isWidgetHidden = previewData.behavior === 'hide' && previewState !== 'available';

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
        <div className="flex flex-col h-[calc(100vh-var(--toolbar-height))]">
          {/* Page title */}
          <div className="px-6 pt-5 pb-4 flex-shrink-0 flex items-center justify-between min-h-[72px]">
            <h1 className="text-[20px] font-semibold leading-[24px] text-text-primary">Chat</h1>
            {activeTab !== 'Install' && activeTab !== 'Chatflows' && activeTab !== 'Analyze' && activeTab !== 'Overview' && <div className="flex items-center gap-3">
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 border border-black rounded-md text-xs font-light text-text-primary hover:bg-muted transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                  Learn
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-border-primary rounded-md shadow-lg opacity-0 invisible group-focus-within:opacity-100 group-focus-within:visible transition-all z-50">
                  <a href="#" className="flex items-center gap-2 px-4 py-2.5 text-xs text-text-primary hover:bg-muted transition-colors rounded-t-md">
                    <BookOpen className="w-3.5 h-3.5 text-text-secondary flex-shrink-0" />
                    <span className="flex-1">Set up chat</span>
                    <ExternalLink className="w-3.5 h-3.5 text-text-secondary flex-shrink-0" />
                  </a>
                  <a href="#" className="flex items-center gap-2 px-4 py-2.5 text-xs text-text-primary hover:bg-muted transition-colors rounded-b-md">
                    <BookOpen className="w-3.5 h-3.5 text-text-secondary flex-shrink-0" />
                    <span className="flex-1">Troubleshoot chat</span>
                    <ExternalLink className="w-3.5 h-3.5 text-text-secondary flex-shrink-0" />
                  </a>
                </div>
              </div>
              <button
                onClick={handleSave}
                disabled={saveState === 'saving'}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-light transition-all duration-200 min-w-[140px] justify-center ${
                  saveState === 'error' ? 'bg-red-600 hover:bg-red-700 text-white' :
                  saveState === 'saved' ? 'bg-[#2e7d32] text-white' :
                  'bg-black hover:bg-black/90 text-white'
                } ${saveState === 'saving' ? 'opacity-80 cursor-not-allowed' : ''}`}
                aria-live="polite"
              >
                {saveState === 'saving' && (
                  <svg className="animate-spin w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {saveState === 'saved' && (
                  <Check className="w-3.5 h-3.5" />
                )}
                {saveState === 'idle' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                )}
                {saveState === 'idle' && 'Save and set live'}
                {saveState === 'saving' && 'Saving...'}
                {saveState === 'saved' && 'Saved'}
                {saveState === 'error' && 'Failed to save'}
              </button>
            </div>}
          </div>
          <div className="w-full border-b border-border-primary flex-shrink-0" />
          <div className="flex flex-1 min-h-0">
            {/* Left sidebar */}
            <div className="w-[220px] border-r border-border-primary bg-background flex-shrink-0 pt-4">
              <nav className="px-4 space-y-1">
                {/* Overview */}
                <button
                  onClick={() => setActiveTab('Overview')}
                  className={`w-full text-left text-sm px-2 py-1.5 rounded transition-colors ${
                    activeTab === 'Overview'
                      ? 'bg-muted text-text-primary border-l-[4px] border-text-primary font-medium'
                      : 'text-text-secondary hover:text-text-primary hover:bg-muted/50 font-light'
                  }`}
                >
                  Overview
                </button>

                {/* Divider */}
                <div className="border-b border-border-primary !my-3" />

                {/* Configure category */}
                <div>
                  <button
                    onClick={() => setConfigureCategoryOpen(!configureCategoryOpen)}
                    className="w-full flex items-center justify-between text-sm font-bold text-text-primary px-2 py-1.5"
                  >
                    Configure
                    {configureCategoryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {configureCategoryOpen && (
                    <div className="mt-1 space-y-0.5">
                      {['Install', 'Target', 'Data Privacy & Security'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`group w-full text-left text-sm px-2 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                            activeTab === tab
                              ? 'bg-muted text-text-primary border-l-[4px] border-text-primary font-medium'
                              : 'text-text-secondary hover:text-text-primary hover:bg-muted/50 font-light'
                          }`}
                        >
                          {tab}
                          {tab === 'Install' && trackingCodeInstalled && (
                            <Check className="w-3.5 h-3.5 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="border-b border-border-primary !my-3" />

                {/* Display category */}
                <div>
                  <button
                    onClick={() => setDisplayCategoryOpen(!displayCategoryOpen)}
                    className="w-full flex items-center justify-between text-sm font-bold text-text-primary px-2 py-1.5"
                  >
                    Design
                    {displayCategoryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {displayCategoryOpen && (
                    <div className="mt-1 space-y-0.5">
                      {['Messages', 'Display', 'Tabs'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`w-full text-left text-sm px-2 py-1.5 rounded transition-colors ${
                            activeTab === tab
                              ? 'bg-muted text-text-primary border-l-[4px] border-text-primary font-medium'
                              : 'text-text-secondary hover:text-text-primary hover:bg-muted/50 font-light'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="border-b border-border-primary !my-3" />

                {/* Chatflows category */}
                <div>
                  <button
                    onClick={() => setChatflowsCategoryOpen(!chatflowsCategoryOpen)}
                    className="w-full flex items-center justify-between text-sm font-bold text-text-primary px-2 py-1.5"
                  >
                    Assist
                    {chatflowsCategoryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {chatflowsCategoryOpen && (
                    <div className="mt-1 space-y-0.5">
                      {['Default', 'Chatflows', 'Nudges'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`w-full text-left text-sm px-2 py-1.5 rounded transition-colors ${
                            activeTab === tab
                              ? 'bg-muted text-text-primary border-l-[4px] border-text-primary font-medium'
                              : 'text-text-secondary hover:text-text-primary hover:bg-muted/50 font-light'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

              </nav>
            </div>

            {/* Main content area */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-8 text-[14px] font-light leading-[24px]">

                {/* ===== INSTALL TAB ===== */}
                {activeTab === 'Install' && (
                  <>
                   <h2 className="text-[24px] font-light text-text-primary mb-6">Install</h2>

                   {/* Tracking Code Status Indicator */}
                   <div className={`w-full mb-6 rounded-lg border px-5 py-4 transition-colors duration-300 ${trackingCodeInstalled ? 'bg-[#e1f2fb] border-[#006de1]' : 'bg-[#fef8f0] border-[#f5c26b]'}`}>
                     <div className="flex items-start justify-between">
                       <div>
                         <div className="flex items-center gap-2">
                           <span className="text-sm font-semibold text-text-primary">
                             {trackingCodeInstalled 
                               ? 'Tracking code installed' 
                               : 'Tracking code not detected'}
                           </span>
                           <span className="text-sm font-light text-text-primary">
                             {trackingCodeInstalled 
                               ? 'Your tracking code is active and sending data from your website.' 
                               : 'We haven\'t detected the tracking code on your website yet. Install it to add live chat to your website.'}
                           </span>
                         </div>
                       </div>
                       <button
                         onClick={() => setTrackingCodeInstalled(!trackingCodeInstalled)}
                         className="text-text-muted hover:text-text-primary transition-colors flex-shrink-0 ml-4 mt-0.5"
                         title="Toggle installation status (demo)"
                       >
                         <X className="w-4 h-4" />
                       </button>
                     </div>
                   </div>

                   <div className="w-full">
                    <div className="flex border-b border-border-primary mb-6">
                      <button
                        onClick={() => setConfigureTab('web-chat')}
                        className={`px-5 py-2.5 text-sm font-medium transition-colors relative ${configureTab === 'web-chat' ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                      >
                        Web Chat
                        {configureTab === 'web-chat' && <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-text-primary rounded-t" />}
                      </button>
                      <button
                        onClick={() => setConfigureTab('mobile-sdk')}
                        className={`px-5 py-2.5 text-sm font-medium transition-colors relative ${configureTab === 'mobile-sdk' ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                      >
                        Mobile SDK
                        {configureTab === 'mobile-sdk' && <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-text-primary rounded-t" />}
                      </button>
                    </div>

                    {configureTab === 'web-chat' && (
                      <div className="mb-10">
                        <h3 className="text-[20px] font-semibold text-text-primary mb-2">Tracking Code</h3>
                        <p className="text-sm font-light text-text-secondary mb-4">
                          To install the tracking code on your website, place the code right before the end of the &lt;body&gt; tag on any page that you want to enable HubSpot on.
                        </p>

                        <div ref={codeBlockRef} className="bg-[#f5f5f5] border border-[#e6e6e6] rounded-md p-4 mb-3 overflow-x-auto">
                          <pre className="text-sm font-mono text-text-primary whitespace-pre leading-relaxed">{`<!-- Start of HubSpot Embed Code -->
    <script type="text/javascript" id="hs-script-loader" async defer
    src="//js-na1.hs-scriptsqa.com/883197886.js"></script>
<!-- End of HubSpot Embed Code -->`}</pre>
                        </div>

                        <div className="mb-8">
                          <div className="relative group inline-block">
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#1a1a1a] text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                              Copy to clipboard
                              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-[#1a1a1a]" />
                            </div>
                            <button
                              onClick={() => selectAndCopy(codeBlockRef, `<!-- Start of HubSpot Embed Code -->\n<script type="text/javascript" id="hs-script-loader" async defer\nsrc="//js-na1.hs-scriptsqa.com/883197886.js"></script>\n<!-- End of HubSpot Embed Code -->`)}
                              className="px-5 py-2 text-sm font-bold text-text-primary border border-[#8a8a8a] rounded hover:bg-muted/50 transition-colors"
                            >
                              Copy
                            </button>
                          </div>
                        </div>

                        <h5 className="text-[20px] font-semibold text-text-primary mb-1">Need help?</h5>
                        <p className="text-sm font-light text-text-secondary mb-2">If you use a CMS tool to build your website, select the website type below to see specific instructions.</p>
                        <select className="border border-[#8f8f8f] rounded-md px-3 py-2.5 bg-white w-[240px] mb-8 text-sm font-light text-text-primary focus:outline-none focus:ring-2 focus:ring-[#006de1] focus:border-[#006de1] appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%238a8a8a%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_12px_center]">
                          <option value="">Select website type</option>
                          <option value="blogger">Blogger</option>
                          <option value="drupal">Drupal</option>
                          <option value="godaddy">GoDaddy</option>
                          <option value="google-tag-manager">Google Tag Manager</option>
                          <option value="hubspot">HubSpot</option>
                          <option value="joomla">Joomla</option>
                          <option value="wordpress">WordPress</option>
                        </select>

                        <div>
                          <h5 className="text-[20px] font-semibold text-text-primary mb-1">Email a team member</h5>
                          <p className="text-sm font-light text-text-secondary mb-2">Email the tracking code to your web developer or admin.</p>
                          <div className="flex items-center gap-2 max-w-md">
                            <input type="email" placeholder="Enter email address" className="flex-1 border border-[#8f8f8f] rounded-md px-3 py-2 text-sm bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-[#006de1] focus:border-[#006de1]" />
                            <button className="px-4 py-2 text-sm font-medium text-text-muted border border-[#8a8a8a] rounded-md hover:bg-muted/50 transition-colors">Send</button>
                          </div>
                        </div>
                      </div>
                    )}

                    {configureTab === 'mobile-sdk' && (
                      <>
                        <div className="flex gap-4 mb-6">
                          <a href="#" className="text-[#016162] hover:text-[#014a4b] underline font-medium text-sm">View mobile chat source code<ExternalLink className="w-3 h-3 inline ml-0.5 -mt-0.5" /></a>
                          <a href="#" className="text-[#016162] hover:text-[#014a4b] underline font-medium text-sm">View developer documentation<ExternalLink className="w-3 h-3 inline ml-0.5 -mt-0.5" /></a>
                        </div>
                        <div className="mb-10">
                          <h3 className="text-[20px] font-semibold text-text-primary mb-3">iOS Setup</h3>
                          <h5 className="text-sm font-bold text-text-primary mb-1">Configuration file</h5>
                          <p className="text-sm font-light text-text-secondary mb-3">Your development team should paste this code in your app</p>
                          <div ref={iosCodeRef} className="bg-[#f5f5f5] border border-[#e6e6e6] rounded-md p-4 mb-3 overflow-x-auto max-h-[200px] overflow-y-auto">
                            <pre className="text-sm font-mono text-text-primary whitespace-pre leading-relaxed">{`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
"http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>portalId</key>
    <string>883197886</string>
    <key>hublet</key>
    <string>na1</string>
    <key>environment</key>
    <string>qa</string>
    <key>defaultChatFlow</key>
    <string>----</string>
</dict>
</plist>`}</pre>
                          </div>
                          <div className="flex items-center gap-3 mb-8">
                            <div className="relative group inline-block">
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#1a1a1a] text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                Copy to clipboard
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-[#1a1a1a]" />
                              </div>
                              <button onClick={() => selectAndCopy(iosCodeRef, `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"\n"http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0">\n<dict>\n    <key>portalId</key>\n    <string>883197886</string>\n    <key>hublet</key>\n    <string>na1</string>\n    <key>environment</key>\n    <string>qa</string>\n    <key>defaultChatFlow</key>\n    <string>----</string>\n</dict>\n</plist>`)} className="px-5 py-2 text-sm font-bold text-text-primary bg-white border border-[#8a8a8a] rounded hover:bg-muted/50 transition-colors">Copy</button>
                            </div>
                            <button className="px-5 py-2 text-sm font-bold text-text-primary bg-white border border-[#8a8a8a] rounded hover:bg-muted/50 transition-colors">Download Code</button>
                          </div>
                          <h5 className="text-sm font-bold text-text-primary mb-1">Enable Push Notifications</h5>
                          <p className="text-sm font-light text-text-secondary mb-4">Push notification settings will apply to all inboxes across your portal</p>
                          <div className="flex items-center gap-2 mb-5">
                            <span className="text-sm font-bold text-text-primary">Status</span>
                            <span className="w-2.5 h-2.5 rounded-full bg-[#b0b0b0]" />
                            <span className="text-sm font-light text-[#0091ae]">Not Set Up</span>
                          </div>
                          <div className="space-y-5 max-w-lg">
                            <div><label className="block text-sm font-bold text-text-primary mb-1">Key ID <span className="text-[#e8744f]">*</span></label><input type="text" className="w-full border border-[#8f8f8f] rounded-md px-3 py-2.5 text-sm bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-[#006de1] focus:border-[#006de1]" /></div>
                            <div><label className="block text-sm font-bold text-text-primary mb-1">Private Key <span className="text-[#e8744f]">*</span></label><textarea rows={5} className="w-full border border-[#8f8f8f] rounded-md px-3 py-2.5 text-sm bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-[#006de1] focus:border-[#006de1] resize-none" /></div>
                            <div><label className="block text-sm font-bold text-text-primary mb-1">Team ID <span className="text-[#e8744f]">*</span></label><input type="text" className="w-full border border-[#8f8f8f] rounded-md px-3 py-2.5 text-sm bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-[#006de1] focus:border-[#006de1]" /></div>
                            <div><label className="block text-sm font-bold text-text-primary mb-1">App Bundle ID <span className="text-[#e8744f]">*</span></label><input type="text" className="w-full border border-[#8f8f8f] rounded-md px-3 py-2.5 text-sm bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-[#006de1] focus:border-[#006de1]" /></div>
                            <button className="px-5 py-2 text-sm font-bold text-text-primary bg-white border border-[#8a8a8a] rounded hover:bg-muted/50 transition-colors">Save</button>
                          </div>
                        </div>
                        <hr className="border-border-primary mb-8" />
                        <div className="mb-10">
                          <h3 className="text-[20px] font-semibold text-text-primary mb-3">Android Setup</h3>
                          <h5 className="text-sm font-bold text-text-primary mb-1">Configuration file</h5>
                          <p className="text-sm font-light text-text-secondary mb-3">Your development team should paste this code in your app</p>
                          <div ref={androidCodeRef} className="bg-[#f5f5f5] border border-[#e6e6e6] rounded-md p-4 mb-3 overflow-x-auto max-h-[200px] overflow-y-auto">
                            <pre className="text-sm font-mono text-text-primary whitespace-pre leading-relaxed">{`{
  "portalId": "883197886",
  "hublet": "na1",
  "environment": "qa",
  "defaultChatFlow": "----"
}`}</pre>
                          </div>
                          <div className="flex items-center gap-3 mb-8">
                            <div className="relative group inline-block">
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#1a1a1a] text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                Copy to clipboard
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-[#1a1a1a]" />
                              </div>
                              <button onClick={() => selectAndCopy(androidCodeRef, `{\n  "portalId": "883197886",\n  "hublet": "na1",\n  "environment": "qa",\n  "defaultChatFlow": "----"\n}`)} className="px-5 py-2 text-sm font-bold text-text-primary bg-white border border-[#8a8a8a] rounded hover:bg-muted/50 transition-colors">Copy</button>
                            </div>
                            <button className="px-5 py-2 text-sm font-bold text-text-primary bg-white border border-[#8a8a8a] rounded hover:bg-muted/50 transition-colors">Download Code</button>
                          </div>
                          <h5 className="text-sm font-bold text-text-primary mb-1">Enable Push Notifications</h5>
                          <p className="text-sm font-light text-text-secondary mb-4">Push notification settings will apply to all inboxes across your portal</p>
                          <div className="flex items-center gap-2 mb-5">
                            <span className="text-sm font-bold text-text-primary">Status</span>
                            <span className="w-2.5 h-2.5 rounded-full bg-[#b0b0b0]" />
                            <span className="text-sm font-light text-[#0091ae]">Not Set Up</span>
                          </div>
                          <div className="space-y-5 max-w-lg">
                            <div><label className="block text-sm font-bold text-text-primary mb-1">Project ID <span className="text-[#e8744f]">*</span></label><input type="text" className="w-full border border-[#8f8f8f] rounded-md px-3 py-2.5 text-sm bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-[#006de1] focus:border-[#006de1]" /></div>
                            <div><label className="block text-sm font-bold text-text-primary mb-1">Sender ID <span className="text-[#e8744f]">*</span></label><input type="text" className="w-full border border-[#8f8f8f] rounded-md px-3 py-2.5 text-sm bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-[#006de1] focus:border-[#006de1]" /></div>
                            <div><label className="block text-sm font-bold text-text-primary mb-1">Service account JSON <span className="text-[#e8744f]">*</span></label><textarea rows={5} className="w-full border border-[#8f8f8f] rounded-md px-3 py-2.5 text-sm bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-[#006de1] focus:border-[#006de1] resize-none" /></div>
                            <button className="px-5 py-2 text-sm font-bold text-text-primary bg-white border border-[#8a8a8a] rounded hover:bg-muted/50 transition-colors">Save</button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  </>
                )}

                {/* ===== DESIGN TAB ===== */}
                {activeTab === 'Display' && (
                  <>
                  <h2 className="text-[24px] font-light text-text-primary mb-6">Display</h2>
                  <div className="flex flex-col xl:flex-row gap-8">
                    {/* Main content */}
                    <div className="flex-1 order-2 xl:order-1 max-w-[600px]">
                      <h3 className="text-[20px] font-semibold text-text-primary mb-4">Widget Styling</h3>

                      {/* Color */}
                      <div className="mb-6">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-sm font-medium text-text-primary">Color</span>
                          <TooltipProvider delayDuration={200}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-3.5 h-3.5 text-text-muted cursor-default" />
                              </TooltipTrigger>
                              <TooltipContent className="bg-[#141414] text-white shadow-lg max-w-[280px] text-sm font-light p-4" side="right" hasArrow>
                                When inputting a custom color, you may want to test it on your websites background to make sure that it meets accessibility standards.
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <p className="text-sm font-light text-text-secondary mb-3">Choose an accent color</p>
                        <div className="flex items-center gap-3">
                          {accentColors.map((c) => (
                            <button
                              key={c.color}
                              onClick={() => { setSelectedColor(c.color); setSelectedGradient(c.gradient as [string, string]); setHexInput(c.color.replace('#', '')); }}
                              className="w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                              style={{ backgroundColor: c.color }}
                            >
                              {selectedColor === c.color && <Check className="w-4 h-4 text-white" />}
                            </button>
                          ))}
                          <div className="relative flex items-center gap-1 ml-2">
                            <span className="text-sm text-text-muted">#</span>
                            <input
                              type="text"
                              value={hexInput}
                              onChange={(e) => { setHexInput(e.target.value); if (e.target.value.length === 6) { setSelectedColor(`#${e.target.value}`); setSelectedGradient(null); } }}
                              onClick={() => { const picker = document.getElementById('crm-color-picker'); if (picker) picker.click(); }}
                              className="w-[80px] border border-[#8a8a8a] rounded px-2 py-1 text-sm font-light text-text-primary cursor-pointer"
                              maxLength={6}
                            />
                            <input
                              id="crm-color-picker"
                              type="color"
                              value={selectedColor}
                              onChange={(e) => { setSelectedColor(e.target.value); setSelectedGradient(null); setHexInput(e.target.value.replace('#', '')); }}
                              className="absolute top-full left-0 mt-1 w-0 h-0 opacity-0 pointer-events-none"
                            />
                          </div>
                          <button className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: selectedColor }}>
                            {!accentColors.some(c => c.color === selectedColor) && <Check className="w-4 h-4 text-white" />}
                          </button>
                        </div>
                      </div>

                      {/* Font */}
                      <div className="mb-6">
                        <p className="text-sm font-medium text-text-primary mb-1">Font</p>
                        <p className="text-sm font-light text-text-secondary mb-2">Choose a font</p>
                        <div className="flex items-center border border-[#8a8a8a] rounded px-3 py-2 bg-background w-[200px]">
                          <span className="text-sm font-light text-text-primary mr-2">System-UI</span>
                          <span className="border border-[#141414] rounded-full px-2 py-px text-[10px] font-medium text-text-primary bg-white leading-tight">Default</span>
                          <svg className="w-3.5 h-3.5 ml-auto text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>

                      {/* Positioning */}
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-text-primary">Positioning</p>
                          <span className="text-[10px] font-medium text-white bg-[#6431da] rounded-full px-1.5 py-0.5">Web only</span>
                        </div>
                        <p className="text-sm font-light text-text-secondary mb-2">Decide what side of your website you would like your chat widget to appear on.</p>
                        <div className="flex gap-4">
                          {(['left', 'right'] as const).map((side) => (
                            <button
                              key={side}
                              onClick={() => setWidgetPosition(side)}
                              className={`flex items-center gap-3 px-5 py-4 rounded-lg border transition-colors w-[160px] ${
                                widgetPosition === side
                                  ? 'border-text-primary bg-[#f0f0f0]'
                                  : 'border-border-primary bg-background hover:bg-muted/50'
                              }`}
                            >
                              <div className={`w-9 h-9 rounded border-2 flex items-center justify-center ${widgetPosition === side ? 'border-[#2563eb] text-[#2563eb]' : 'border-[#8a8a8a] text-[#8a8a8a]'}`}>
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  {side === 'left' ? (<><path d="M12 6L6 12" /><path d="M6 6L6 12L12 12" /></>) : (<><path d="M6 6L12 12" /><path d="M12 6L12 12L6 12" /></>)}
                                </svg>
                              </div>
                              <span className={`text-sm font-light ${widgetPosition === side ? 'text-text-primary' : 'text-text-secondary'}`}>
                                {side === 'left' ? 'Left' : 'Right'}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <h3 className="text-[20px] font-semibold text-text-primary mb-4 mt-10">Widget Features</h3>

                      {/* Attachments */}
                      <div className="mb-6">
                        <p className="text-sm font-medium text-text-primary mb-2">Attachments</p>
                        <div className="flex items-start gap-3">
                          <button onClick={() => setAttachmentsOn(!attachmentsOn)} className={`relative w-[52px] h-[26px] rounded-full transition-colors duration-250 ease-in-out shrink-0 ${attachmentsOn ? 'bg-[#141414]' : 'bg-[#cbd6d8]'}`} role="switch" aria-checked={attachmentsOn}>
                            {attachmentsOn && <span className="absolute left-[7px] top-1/2 -translate-y-1/2 text-[9px] font-bold text-white uppercase tracking-wide">on</span>}
                            <div className={`absolute top-[3px] w-[20px] h-[20px] rounded-full bg-white shadow-sm transition-transform duration-250 ease-in-out ${attachmentsOn ? 'translate-x-[28px]' : 'translate-x-[3px]'}`} />
                          </button>
                          <p className="text-sm font-light text-text-secondary">
                            Allow visitors to attach files to their messages. Attachments can also be disabled on a per-page basis using the{' '}
                            <a href="#" className="text-[#016162] hover:text-[#014a4b] underline font-medium">Chat Widget SDK<ExternalLink className="w-3 h-3 inline ml-0.5 -mt-0.5" /></a>.
                          </p>
                        </div>
                      </div>

                      {/* Screen capture */}
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-sm font-medium text-text-primary">Screen capture</p>
                          <span className="text-[10px] font-medium text-white bg-[#6431da] rounded-full px-1.5 py-0.5">Web only</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <button onClick={() => setScreenCapture(!screenCapture)} className={`relative w-[52px] h-[26px] rounded-full transition-colors duration-250 ease-in-out shrink-0 ${screenCapture ? 'bg-[#141414]' : 'bg-[#cbd6d8]'}`} role="switch" aria-checked={screenCapture}>
                            {screenCapture && <span className="absolute left-[7px] top-1/2 -translate-y-1/2 text-[9px] font-bold text-white uppercase tracking-wide">on</span>}
                            <div className={`absolute top-[3px] w-[20px] h-[20px] rounded-full bg-white shadow-sm transition-transform duration-250 ease-in-out ${screenCapture ? 'translate-x-[28px]' : 'translate-x-[3px]'}`} />
                          </button>
                          <p className="text-sm font-light text-text-secondary">Allow visitors to capture a screenshot and attach it to their message. Supported on desktop and tablet browsers.</p>
                        </div>
                      </div>

                      {/* Chat widget movement */}
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-sm font-medium text-text-primary">Chat widget movement</p>
                          <span className="text-[10px] font-medium text-white bg-[#6431da] rounded-full px-1.5 py-0.5">Web only</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <button onClick={() => setWidgetMovement(!widgetMovement)} className={`relative w-[52px] h-[26px] rounded-full transition-colors duration-250 ease-in-out shrink-0 ${widgetMovement ? 'bg-[#141414]' : 'bg-[#cbd6d8]'}`} role="switch" aria-checked={widgetMovement}>
                            {widgetMovement && <span className="absolute left-[7px] top-1/2 -translate-y-1/2 text-[9px] font-bold text-white uppercase tracking-wide">on</span>}
                            <div className={`absolute top-[3px] w-[20px] h-[20px] rounded-full bg-white shadow-sm transition-transform duration-250 ease-in-out ${widgetMovement ? 'translate-x-[28px]' : 'translate-x-[3px]'}`} />
                          </button>
                          <p className="text-sm font-light text-text-secondary">Allow your chat widget to be dragged and repositioned on your website.</p>
                        </div>
                      </div>

                      {/* Chat transcript */}
                      <div className="mb-6">
                        <p className="text-sm font-medium text-text-primary mb-2">Chat transcript</p>
                        <div className="flex items-start gap-3">
                          <button onClick={() => setChatTranscript(!chatTranscript)} className={`relative w-[52px] h-[26px] rounded-full transition-colors duration-250 ease-in-out shrink-0 ${chatTranscript ? 'bg-[#141414]' : 'bg-[#cbd6d8]'}`} role="switch" aria-checked={chatTranscript}>
                            {chatTranscript && <span className="absolute left-[7px] top-1/2 -translate-y-1/2 text-[9px] font-bold text-white uppercase tracking-wide">on</span>}
                            <div className={`absolute top-[3px] w-[20px] h-[20px] rounded-full bg-white shadow-sm transition-transform duration-250 ease-in-out ${chatTranscript ? 'translate-x-[28px]' : 'translate-x-[3px]'}`} />
                          </button>
                          <p className="text-sm font-light text-text-primary">
                            Automatically send a chat transcript at the end of a chat.{' '}
                            <a href="#" className="text-sm text-[#016162] hover:text-[#014a4b] underline font-medium">Preview chat transcript</a>
                          </p>
                        </div>
                      </div>

                      {/* Send from */}
                      <div className="mb-8 ml-[64px]">
                        <div className="flex items-center gap-1 mb-2">
                          <span className="text-sm font-light text-text-primary">Send from</span>
                          <TooltipProvider delayDuration={200}>
                            <Tooltip>
                              <TooltipTrigger asChild><Info className="w-3.5 h-3.5 text-text-muted cursor-default" /></TooltipTrigger>
                              <TooltipContent className="bg-[#141414] text-white shadow-lg max-w-[280px] text-sm font-light p-4" side="right" hasArrow>
                                This is the email address visitors will see when they receive chat transcripts from you.
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className={`flex items-center border rounded px-3 py-2 w-full max-w-[320px] ${chatTranscript ? 'border-[#8a8a8a] bg-background cursor-pointer' : 'border-[#cbd6d8] bg-[#f5f5f5] cursor-not-allowed opacity-60'}`}>
                          <span className={`text-sm font-light ${chatTranscript ? 'text-text-primary' : 'text-text-muted'}`}>support@cha.com.hs-inbox.com</span>
                          <svg className="w-3.5 h-3.5 ml-auto text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>

                      {/* Channel Availability */}
                      <div className="mt-10">
                        <AvailabilitySettings
                          onReplyTimeChange={setReplyTimeSubtitle}
                          previewState={previewState}
                          onPreviewStateChange={setPreviewState}
                          onPreviewDataChange={handlePreviewDataChange}
                        />
                      </div>
                    </div>

                    {/* Chat preview widget */}
                    <div className="w-[380px] shrink-0 order-1 xl:order-2 xl:sticky xl:self-start"
                      style={{ top: '0px', transition: 'top 0.3s ease-in-out' }}
                      ref={(el) => {
                        if (!el) return;
                        // Find the main scrollable container (flex-1 overflow-y-auto)
                        const scrollContainer = el.closest('.flex-1.overflow-y-auto') as HTMLElement | null;
                        if (!scrollContainer) return;
                        const updatePosition = () => {
                          const scrollTop = scrollContainer.scrollTop;
                          if (scrollTop > 80) {
                            const containerH = scrollContainer.clientHeight;
                            const elH = el.offsetHeight;
                            const centeredTop = Math.max(20, (containerH - elH) / 2);
                            el.style.top = `${centeredTop}px`;
                          } else {
                            el.style.top = '0px';
                          }
                        };
                        updatePosition();
                        const handler = () => requestAnimationFrame(updatePosition);
                        scrollContainer.addEventListener('scroll', handler);
                        (el as any).__cleanupScroll = () => scrollContainer.removeEventListener('scroll', handler);
                      }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Eye className="w-3.5 h-3.5 text-text-muted" />
                        <span className="text-xs font-medium text-text-secondary">Previewing:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: previewStateColors[previewState] }} />
                          <span className="text-xs font-semibold text-text-primary">{previewStateLabels[previewState]}</span>
                        </div>
                      </div>

                      <div className={`relative transition-opacity duration-300 ${isWidgetHidden ? 'opacity-40' : 'opacity-100'}`}>
                        {isWidgetHidden && (
                          <div className="absolute inset-0 z-10 flex items-center justify-center">
                            <div className="bg-background/90 border border-border-primary rounded-lg px-4 py-3 shadow-sm text-center">
                              <p className="text-sm font-medium text-text-primary">Widget Hidden</p>
                              <p className="text-xs font-light text-text-secondary mt-1">The chat launcher is hidden in this state</p>
                            </div>
                          </div>
                        )}
                        <div className="rounded-lg shadow-lg overflow-hidden border border-border-primary" style={{ height: '530px', display: 'flex', flexDirection: 'column' }}>
                          <div className="flex items-center justify-between px-4" style={{ background: selectedGradient ? `linear-gradient(to right, ${selectedGradient[0]}, ${selectedGradient[1]})` : selectedColor, minHeight: '70px', padding: '12px 16px' }}>
                            <div className="flex items-center gap-2">
                              <button className="text-white hover:opacity-80">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                              </button>
                              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <span className="text-white text-sm font-medium">K</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-white font-medium text-sm leading-tight">Kelly Kapoor</span>
                                {previewState === 'available' && replyTimeSubtitle && (
                                  <span className="text-white/80 text-[11px] font-light leading-tight">{replyTimeSubtitle}</span>
                                )}
                                {previewState === 'outside' && previewData.behavior === 'return' && (
                                  <span className="text-white/80 text-[11px] font-light leading-tight">We'll return tomorrow at 09:00 AM</span>
                                )}
                              </div>
                            </div>
                            <button className="text-white hover:opacity-80"><X className="w-5 h-5" /></button>
                          </div>

                          <div className="bg-background p-4 flex-1 flex flex-col">
                            {getPreviewMessage() && (
                              <div className="flex items-start gap-2 mb-auto animate-fade-in" key={previewState}>
                                <div className="w-7 h-7 rounded-full bg-[#f0f0f0] flex items-center justify-center shrink-0">
                                  <span className="text-[10px] text-text-muted">K</span>
                                </div>
                                <div className="bg-[#f0f0f0] rounded-lg px-3 py-2 text-sm font-light text-text-primary max-w-[85%]">
                                  {getPreviewMessage()}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="border-t border-border-primary px-4 py-3 flex items-center gap-2 bg-background">
                            <input type="text" placeholder="Ask me anything..." className="flex-1 text-sm font-light text-text-primary placeholder:text-text-muted outline-none bg-transparent" readOnly />
                            <Send className="w-4 h-4 text-text-muted" />
                          </div>
                        </div>
                      </div>

                      {/* Close button */}
                      <div className={`flex mt-4 ${widgetPosition === 'right' ? 'justify-end' : 'justify-start'}`}>
                        <div className="flex items-center gap-1.5" style={{ flexDirection: widgetPosition === 'right' ? 'row' : 'row-reverse' }}>
                          {widgetMovement && (
                            <div className="flex flex-col gap-[2px]">
                              <div className="flex gap-[2px]"><span className="w-[3px] h-[3px] rounded-full bg-[#676565]" /><span className="w-[3px] h-[3px] rounded-full bg-[#676565]" /></div>
                              <div className="flex gap-[2px]"><span className="w-[3px] h-[3px] rounded-full bg-[#676565]" /><span className="w-[3px] h-[3px] rounded-full bg-[#676565]" /></div>
                              <div className="flex gap-[2px]"><span className="w-[3px] h-[3px] rounded-full bg-[#676565]" /><span className="w-[3px] h-[3px] rounded-full bg-[#676565]" /></div>
                            </div>
                          )}
                          <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md" style={{ backgroundColor: selectedColor }}>
                            <X className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  </>
                )}

                {activeTab === 'Overview' && <div><h2 className="text-[24px] font-light text-text-primary mb-6">Overview</h2><div className="text-sm font-light text-text-secondary">Overview content will appear here.</div></div>}
                {/* Placeholder tabs */}
                {activeTab === 'Messages' && (
                  <div>
                    <h2 className="text-[24px] font-light text-text-primary mb-6">Messages</h2>
                    <div className="space-y-5">
                      {languageDefaults.map((langDef) => {
                        const isOpen = openLanguageCards[langDef.language] || false;
                        const texts = languageTexts[langDef.language];
                        const isEnglish = langDef.language === 'English';

                        const updateLangText = (field: string, value: string) => {
                          setLanguageTexts(prev => ({
                            ...prev,
                            [langDef.language]: { ...prev[langDef.language], [field]: value }
                          }));
                          // Sync English card with legacy state used by previews
                          if (isEnglish) {
                            if (field === 'welcomeMessage') {
                              const updated = [...welcomeMessages];
                              updated[0] = { ...updated[0], text: value };
                              setWelcomeMessages(updated);
                            }
                            if (field === 'genericErrorMessage') setGenericErrorMessage(value);
                            if (field === 'consentCookiesText') setConsentCookiesText(value);
                            if (field === 'processConsentText') setProcessConsentPersonalizeText(value);
                          }
                        };

                        return (
                          <div key={langDef.language} className="border border-border-primary rounded-lg p-4 bg-background">
                            <div className="flex items-center justify-between">
                              <button onClick={() => setOpenLanguageCards(prev => ({ ...prev, [langDef.language]: !prev[langDef.language] }))} className="flex items-center gap-3 flex-1">
                                {isOpen ? <ChevronDown className="w-4 h-4 text-text-primary" /> : <ChevronRight className="w-4 h-4 text-text-primary" />}
                                <div className="text-left">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-bold text-text-primary">{langDef.language}</h4>
                                  </div>
                                  <p className="text-xs font-light text-text-secondary mt-0.5">Customize your default messages for {langDef.language} language visitors. For more customization, you can conditionally override these defaults by creating a variant.</p>
                                </div>
                              </button>
                            </div>

                            {isOpen && (
                              <div className="mt-5 ml-7 space-y-5">
                                <div>
                                  <p className="text-sm font-bold text-text-primary mb-1.5">Welcome Message</p>
                                  <RichTextEditor
                                    value={texts.welcomeMessage}
                                    defaultValue={langDef.welcomeMessage}
                                    onChange={(val) => updateLangText('welcomeMessage', val)}
                                  />
                                </div>
                                <div className="mt-5">
                                  <p className="text-sm font-bold text-text-primary mb-1.5">Generic Error Message</p>
                                  <RichTextEditor
                                    value={texts.genericErrorMessage}
                                    defaultValue={langDef.genericErrorMessage}
                                    onChange={(val) => updateLangText('genericErrorMessage', val)}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {activeTab === 'Default' && <AssignTabContent />}
                {activeTab === 'Target' && <TargetTabContent />}
{activeTab === 'Data Privacy & Security' && (
                  <div>
                    <h2 className="text-[24px] font-light text-text-primary mb-6">Data Privacy & Security</h2>

                    {/* Data privacy & consent */}
                    <div className="mb-8">
                      <h3 className="text-[20px] font-semibold text-text-primary mb-4">Data privacy & consent</h3>

                      {/* Consent to collect chat cookies card */}
                      <div className="border border-border rounded-lg p-6">
                        <div className="flex items-start justify-between gap-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5 mb-2">
                              <span className="text-sm font-semibold text-text-primary">Consent to collect chat cookies</span>
                              <TooltipProvider delayDuration={200}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary cursor-default"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="bg-[#1a1a1a] text-white text-xs leading-relaxed max-w-[280px] p-3 rounded-lg shadow-lg">
                                    GDPR settings for consent to collect cookies won't show within the chat widget to visitors who have been identified through the Visitor Identification API. This is because HubSpot will not drop <span className="underline">the messagesUtk cookie</span>. The analytics cookie banner will not be affected. <span className="underline font-semibold">Learn more</span>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <p className="text-sm font-light text-text-secondary leading-relaxed">
                              If your website visitor leaves the page that they began chatting on but did not accept your website cookie consent banner, the chat widget will reset and the existing conversation will end. In order to maintain a chat conversation as a visitor navigates to other pages, the visitor must accept cookies.
                            </p>
                          </div>
                          <div className="flex-shrink-0 pt-1">
                            <StatusToggle enabled={cookieConsentEnabled} onToggle={() => setCookieConsentEnabled(!cookieConsentEnabled)} />
                          </div>
                        </div>

                        {cookieConsentEnabled && (
                          <div className="mt-6 space-y-5">
                            {/* Select when the consent banner should show */}
                            <div>
                              <label className="text-sm font-semibold text-text-primary mb-3 block">Select when the consent banner should show</label>
                              <div className="space-y-3">
                                <label className="flex items-start gap-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="cookie-banner-timing"
                                    value="before-chat"
                                    checked={cookieBannerTiming === 'before-chat'}
                                    onChange={() => setCookieBannerTiming('before-chat')}
                                    className="mt-1 w-4 h-4 accent-text-primary"
                                  />
                                  <span className="text-sm text-text-primary leading-relaxed">Show consent banner before visitor starts a chat</span>
                                </label>
                                <label className="flex items-start gap-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="cookie-banner-timing"
                                    value="exit-intent"
                                    checked={cookieBannerTiming === 'exit-intent'}
                                    onChange={() => setCookieBannerTiming('exit-intent')}
                                    className="mt-1 w-4 h-4 accent-text-primary"
                                  />
                                  <span className="text-sm text-text-primary leading-relaxed">Show consent banner to visitor on exit intent</span>
                                </label>
                              </div>
                            </div>

                            {/* Text area + Preview side by side */}
                            <div className="flex gap-6">
                              <div className="flex-1">
                                <label className="text-sm font-semibold text-text-primary mb-1.5 block">Consent to Collect Chat Cookies Message</label>
                                <RichTextEditor
                                  value={consentCookiesText}
                                  defaultValue="This chat service uses a cookie to interact with you and maintain your chat history. Our service provider will monitor and record this chat for quality assurance (see their Privacy Policy)."
                                  onChange={(val) => setConsentCookiesText(val)}
                                />
                              </div>
                              <div className="flex-1">
                                <label className="text-sm font-semibold text-text-primary mb-2 block">Preview</label>
                                {cookieBannerTiming === 'before-chat' ? (
                                  <div className="bg-[#f5f5f5] rounded p-4 min-h-[120px]">
                                    <p className="text-sm text-text-secondary leading-relaxed">{consentCookiesText}</p>
                                    <div className="mt-4 flex justify-center">
                                      <button className="px-6 py-2 bg-[#5bb4b7] text-white text-sm font-medium rounded-full">
                                        I agree
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="bg-[#5f7589] rounded p-6 min-h-[280px] flex items-start justify-center pt-8">
                                    <div className="bg-white rounded-lg p-5 max-w-[320px] shadow-lg">
                                      <p className="text-sm text-text-secondary leading-relaxed mb-4">{consentCookiesText}</p>
                                      <div className="flex items-center gap-3">
                                        <button className="px-5 py-2 bg-[#5bb4b7] text-white text-sm font-medium rounded-full">
                                          I agree
                                        </button>
                                        <button className="px-5 py-2 bg-white text-[#5bb4b7] text-sm font-medium rounded-full border border-[#5bb4b7]">
                                          Decline for now
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Consent to process data card */}
                      <div className="border border-border rounded-lg p-6 mt-4">
                        <div className="flex items-start justify-between gap-6">
                          <div className="flex-1">
                            <span className="text-sm font-semibold text-text-primary mb-2 block">Consent to process data</span>
                            <p className="text-sm font-light text-text-secondary leading-relaxed">
                              Use the text field below to explain why you need to store and process your customer's personal information (e.g., improve customer service, troubleshooting).
                            </p>
                          </div>
                          <div className="flex-shrink-0 pt-1">
                            <StatusToggle enabled={processDataEnabled} onToggle={() => setProcessDataEnabled(!processDataEnabled)} />
                          </div>
                        </div>

                        {processDataEnabled && (
                          <div className="mt-6 space-y-5">
                            {/* Consent type */}
                            <div>
                              <label className="text-sm font-semibold text-text-primary mb-2 block">Consent type</label>
                              <select
                                value={consentType}
                                onChange={(e) => setConsentType(e.target.value)}
                                className="w-full max-w-[400px] h-10 px-3 rounded border border-[#8f8f8f] bg-white text-sm text-text-primary focus:outline-none focus:border-[#006de1]"
                              >
                                <option value="legitimate-interest">Legitimate interest</option>
                                <option value="explicit-consent">Require explicit consent</option>
                              </select>
                            </div>

                            {/* Text area + Preview side by side */}
                            <div className="flex gap-6">
                              <div className="flex-1">
                                <label className="text-sm font-semibold text-text-primary mb-1.5 block">Process Consent Message</label>
                                <RichTextEditor
                                  value={processConsentPersonalizeText}
                                  defaultValue="By using this chat service, you agree to the monitoring and recording of the chat and the processing of your personal data in accordance with our Privacy Policy."
                                  onChange={(val) => setProcessConsentPersonalizeText(val)}
                                />
                              </div>
                              <div className="flex-1">
                                <label className="text-sm font-semibold text-text-primary mb-2 block">Preview</label>
                                <div className="bg-[#f5f5f5] rounded p-4 min-h-[120px]">
                                  <p className="text-sm text-text-secondary leading-relaxed">{processConsentPersonalizeText}</p>
                                  {consentType === 'explicit-consent' && (
                                    <div className="mt-4 flex justify-center">
                                      <button className="px-6 py-2 bg-[#5bb4b7] text-white text-sm font-medium rounded-full">
                                        I agree
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Consent for communications card */}
                      <div className="border border-border rounded-lg p-6 mt-4">
                        <div className="flex items-start justify-between gap-6">
                          <div className="flex-1">
                            <span className="text-sm font-semibold text-text-primary mb-2 block">Consent for communications</span>
                            <p className="text-sm font-light text-text-secondary leading-relaxed">
                              Use the text field below to ask customers if they consent to receive communications.
                            </p>
                          </div>
                          <div className="flex-shrink-0 pt-1">
                            <StatusToggle enabled={consentCommsEnabled} onToggle={() => setConsentCommsEnabled(!consentCommsEnabled)} />
                          </div>
                        </div>

                        {consentCommsEnabled && (
                          <div className="mt-6 space-y-5">
                            <div>
                              <label className="text-sm font-semibold text-text-primary mb-2 block">Subscription type</label>
                              <select
                                value={subscriptionType}
                                onChange={(e) => setSubscriptionType(e.target.value)}
                                className="w-full max-w-[400px] h-10 px-3 rounded border border-[#8f8f8f] bg-white text-sm text-text-primary focus:outline-none focus:border-[#006de1]"
                              >
                                <option value="">Select subscription type</option>
                                <option value="marketing-email">Marketing Email | Marketing Information</option>
                                <option value="promo">Promo</option>
                                <option value="service-email">Service Email | Customer Service Communications</option>
                                <option value="sales-email">Sales Email | One to One</option>
                              </select>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>


                    {/* Spam protection & Security */}
                    <div className="mb-8">
                      <h3 className="text-[20px] font-semibold text-text-primary mb-4">Spam protection & Security</h3>

                      <div className="border border-border rounded-lg p-6">
                        <div className="flex items-start justify-between gap-6">
                          <div className="flex-1">
                            <span className="text-sm font-semibold text-text-primary mb-2 block">Visitor verification</span>
                            <p className="text-sm font-light text-text-secondary leading-relaxed">
                              Adds an invisible spam protection check when visitors start a chat. If suspicious activity is detected, visitors will be prevented from starting a conversation.
                            </p>
                          </div>
                          <div className="flex-shrink-0 pt-1">
                            <StatusToggle enabled={visitorVerificationEnabled} onToggle={() => setVisitorVerificationEnabled(!visitorVerificationEnabled)} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'Tabs' && (
                  <>
                  <h2 className="text-[24px] font-light text-text-primary mb-6">Tabs</h2>
                  <div className="flex flex-col xl:flex-row gap-8">
                    {/* Main content */}
                    <div className="flex-1 order-2 xl:order-1 max-w-[600px]">
                    {/* Knowledge Base card */}
                    <div className="border border-border rounded-lg p-6">
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5 mb-2">
                            <span className="text-sm font-semibold text-text-primary">Knowledge Base</span>
                          </div>
                          <p className="text-sm font-light text-text-secondary leading-relaxed">
                            Within the widget, your visitors can browse & search for helpful articles and documentation for self-serve support. To manage and edit articles, visit your{' '}
                            <a href="#" className="text-[#016162] hover:text-[#014a4b] underline font-medium inline-flex items-center gap-1">
                              knowledge base settings
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </p>
                        </div>
                        <div className="flex-shrink-0 pt-1">
                          <StatusToggle enabled={knowledgeBaseEnabled} onToggle={() => setKnowledgeBaseEnabled(!knowledgeBaseEnabled)} />
                        </div>
                      </div>

                      {knowledgeBaseEnabled && (
                        <div className="mt-6 space-y-6">
                          {/* Knowledge Base dropdown */}
                          <div>
                            <label className="text-sm font-semibold text-text-primary mb-2 block">Knowledge Base</label>
                            <select
                              value={knowledgeBaseSelection}
                              onChange={(e) => setKnowledgeBaseSelection(e.target.value)}
                              className="w-full border border-[#8f8f8f] rounded-md px-3 py-2.5 bg-white text-sm font-light text-text-primary focus:outline-none focus:ring-2 focus:ring-[#006de1] focus:border-[#006de1] appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%238a8a8a%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_12px_center]"
                            >
                              <option value="knowledgebase-english">Paper Selection & Product Guide</option>
                              <option value="printing-troubleshooting">Printing, Usage & Troubleshooting</option>
                              <option value="orders-delivery">Orders, Delivery & Account Support</option>
                              <option value="paper-education">Paper Education Center</option>
                              <option value="add-knowledge-base">Add a Knowledge Base</option>
                            </select>
                          </div>

                          {/* Search recommendations */}
                          <div>
                            <div className="flex items-center gap-1.5 mb-2">
                              <label className="text-sm font-semibold text-text-primary">Search recommendations</label>
                              <TooltipProvider delayDuration={200}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary cursor-default"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="bg-[#1a1a1a] text-white text-xs leading-relaxed max-w-[280px] p-3 rounded-lg shadow-lg">
                                    Choose which articles to recommend when visitors search the knowledge base.
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <select
                              value={searchRecommendation}
                              onChange={(e) => setSearchRecommendation(e.target.value)}
                              className="w-full border border-[#8f8f8f] rounded-md px-3 py-2.5 bg-white text-sm font-light text-text-primary focus:outline-none focus:ring-2 focus:ring-[#006de1] focus:border-[#006de1] appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%238a8a8a%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_12px_center]"
                            >
                              <option value="trending">Trending articles</option>
                              <option value="highest-rated">Highest rated articles</option>
                              <option value="none">Do not suggest articles</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Customer Portal card */}
                    <div className="border border-border rounded-lg p-6 mt-4">
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5 mb-2">
                            <span className="text-sm font-semibold text-text-primary">Customer Portal</span>
                          </div>
                          <p className="text-sm font-light text-text-secondary leading-relaxed">
                            Within the widget, your visitors can view and track their support tickets. To edit your Customer Portal, visit your{' '}
                            <a href="#" className="text-[#016162] hover:text-[#014a4b] underline font-medium inline-flex items-center gap-1">
                              Customer Portal settings
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </p>
                        </div>
                        <div className="flex-shrink-0 pt-1">
                          <StatusToggle enabled={customerPortalEnabled} onToggle={() => setCustomerPortalEnabled(!customerPortalEnabled)} />
                        </div>
                      </div>
                    </div>
                    </div>

                    {/* Chat preview widget */}
                    <div className="w-[380px] shrink-0 order-1 xl:order-2 xl:sticky xl:self-start"
                      style={{ top: '0px', transition: 'top 0.3s ease-in-out' }}
                      ref={(el) => {
                        if (!el) return;
                        const scrollContainer = el.closest('.flex-1.overflow-y-auto') as HTMLElement | null;
                        if (!scrollContainer) return;
                        const updatePosition = () => {
                          const scrollTop = scrollContainer.scrollTop;
                          if (scrollTop > 80) {
                            const containerH = scrollContainer.clientHeight;
                            const elH = el.offsetHeight;
                            const centeredTop = Math.max(20, (containerH - elH) / 2);
                            el.style.top = `${centeredTop}px`;
                          } else {
                            el.style.top = '0px';
                          }
                        };
                        updatePosition();
                        const handler = () => requestAnimationFrame(updatePosition);
                        scrollContainer.addEventListener('scroll', handler);
                        (el as any).__cleanupScroll = () => scrollContainer.removeEventListener('scroll', handler);
                      }}
                    >

                      <div className="rounded-lg shadow-lg overflow-hidden border border-border-primary" style={{ height: '530px', display: 'flex', flexDirection: 'column' }}>
                        {/* Header */}
                        <div style={{ background: selectedGradient ? `linear-gradient(to right, ${selectedGradient[0]}, ${selectedGradient[1]})` : selectedColor }}>
                          <div className="flex items-center justify-between px-4" style={{ minHeight: '56px', padding: '12px 16px' }}>
                            <span className="text-white font-semibold text-base">{widgetPreviewTab === 'help' ? 'Help' : widgetPreviewTab === 'tickets' ? 'Tickets' : 'Chat'}</span>
                            <div className="flex items-center gap-3">
                              <button className="text-white hover:opacity-80">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                              </button>
                              <button className="text-white hover:opacity-80"><X className="w-5 h-5" /></button>
                            </div>
                          </div>
                          {widgetPreviewTab === 'help' && (
                            <div className="px-4 pb-3">
                              <div className="flex items-center gap-2 bg-white/90 rounded-full px-3 py-2">
                                <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                                <span className="text-sm text-text-muted">Search articles</span>
                              </div>
                            </div>
                          )}
                          {widgetPreviewTab === 'tickets' && (
                            <div className="px-4 pb-3">
                              <div className="flex items-center gap-2 bg-white/90 rounded-full px-3 py-2">
                                <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                                <span className="text-sm text-text-muted">Search tickets</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Content area */}
                        <div className="bg-background flex-1 flex flex-col overflow-y-auto">
                          {widgetPreviewTab === 'chat' && (
                            <>
                              <div className="flex items-start gap-3 px-4 py-4 border-b border-border-primary">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: selectedColor, opacity: 0.15 }}>
                                  <span className="text-sm font-semibold" style={{ color: selectedColor }}>K</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-0.5">
                                    <span className="text-sm font-semibold text-text-primary">Kelly Kapoor</span>
                                    <span className="text-xs text-text-muted whitespace-nowrap ml-2">39 sec. ago</span>
                                  </div>
                                  <p className="text-sm font-light text-text-secondary truncate">Hello! Welcome to Dunder Mifflin Paper Company. Ho...</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3 px-4 py-4 border-b border-border-primary">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: selectedColor, opacity: 0.15 }}>
                                  <span className="text-sm font-semibold" style={{ color: selectedColor }}>D</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-0.5">
                                    <span className="text-sm font-semibold text-text-primary">Dwight Schrute</span>
                                    <span className="text-xs text-text-muted whitespace-nowrap ml-2">1 day ago</span>
                                  </div>
                                  <p className="text-sm font-light text-text-secondary truncate">Your chat has ended.</p>
                                </div>
                              </div>
                            </>
                          )}

                          {widgetPreviewTab === 'help' && (
                            <div className="px-4 py-4">
                              <p className="text-sm font-semibold text-text-muted mb-3">Trending Articles</p>
                              <div className="space-y-3 mb-6">
                                {['Paper Weights & Thickness Guide', 'Common Printing FAQs', 'Paper Selection & Eligibility'].map((article) => (
                                  <div key={article} className="flex items-center gap-3 cursor-pointer hover:opacity-80">
                                    <svg className="w-5 h-5 text-text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><rect x="4" y="3" width="16" height="18" rx="1"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="12" y2="15"/></svg>
                                    <span className="text-sm font-semibold text-text-primary">{article}</span>
                                  </div>
                                ))}
                              </div>
                              <p className="text-sm font-semibold text-text-muted mb-3">Browse Categories</p>
                              <div className="space-y-1">
                                {[
                                  { name: 'Paper Selection', count: 8 },
                                  { name: 'Printing & Usage', count: 8 },
                                  { name: 'Orders & Delivery', count: 9 },
                                ].map((cat) => (
                                  <div key={cat.name} className="flex items-center justify-between py-2.5 cursor-pointer hover:opacity-80">
                                    <div>
                                      <p className="text-sm font-semibold text-text-primary">{cat.name}</p>
                                      <p className="text-xs text-text-muted">{cat.count} articles</p>
                                    </div>
                                    <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {widgetPreviewTab === 'tickets' && (
                            <div className="px-4 py-4 space-y-1">
                              {[
                                { id: '#1042', title: 'Missing paper shipment — 20 reams of Hammermill', status: 'Open', time: '2 hours ago', color: '#e8a838' },
                                { id: '#1039', title: 'Printer jam with Dunder Mifflin premium cardstock', status: 'In Progress', time: '1 day ago', color: '#0091ae' },
                                { id: '#1035', title: 'Wrong color paper delivered to Scranton branch', status: 'Resolved', time: '3 days ago', color: '#38a169' },
                              ].map((ticket) => (
                                <div key={ticket.id} className="flex items-start gap-3 py-3 border-b border-border-primary cursor-pointer hover:bg-muted/30 rounded px-1 transition-colors">
                                  <div className="shrink-0 mt-0.5">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold text-white" style={{ backgroundColor: ticket.color }}>{ticket.status}</span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-text-primary truncate">{ticket.title}</p>
                                    <p className="text-xs text-text-muted mt-0.5">{ticket.id} · {ticket.time}</p>
                                  </div>
                                  <svg className="w-4 h-4 text-text-muted shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Bottom tab bar */}
                        <div className="border-t border-border-primary px-6 py-3 flex items-center justify-center gap-2 bg-background">
                          <button
                            onClick={() => setWidgetPreviewTab('chat')}
                            className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-medium transition-colors ${widgetPreviewTab === 'chat' ? 'text-white' : 'text-text-secondary border border-border-primary'}`}
                            style={widgetPreviewTab === 'chat' ? { backgroundColor: selectedColor } : {}}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                            Chat
                          </button>
                          {knowledgeBaseEnabled && (
                            <button
                              onClick={() => setWidgetPreviewTab('help')}
                              className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-medium transition-colors ${widgetPreviewTab === 'help' ? 'text-white' : 'text-text-secondary border border-border-primary'}`}
                              style={widgetPreviewTab === 'help' ? { backgroundColor: selectedColor } : {}}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                              Help
                            </button>
                          )}
                          {customerPortalEnabled && (
                            <button
                              onClick={() => setWidgetPreviewTab('tickets')}
                              className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-medium transition-colors ${widgetPreviewTab === 'tickets' ? 'text-white' : 'text-text-secondary border border-border-primary'}`}
                              style={widgetPreviewTab === 'tickets' ? { backgroundColor: selectedColor } : {}}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2"/><path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6M9 11h6M9 15h4"/></svg>
                              Tickets
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Close button */}
                      <div className={`flex mt-4 ${widgetPosition === 'right' ? 'justify-end' : 'justify-start'}`}>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md" style={{ backgroundColor: selectedColor }}>
                          <X className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                  </>
                )}
                {activeTab === 'Nudges' && <div><h2 className="text-[24px] font-light text-text-primary mb-6">Nudges</h2><div className="text-sm font-light text-text-secondary">Nudges configuration will appear here... or in Variants... but if in Variants, how can Customer Agent take advantage of it... hmm need to think....</div></div>}
                {activeTab === 'Chatflows' && <RulesTabContent />}
                {activeTab === 'Analyze' && <div><h2 className="text-[24px] font-light text-text-primary mb-6">Analyze</h2><div className="text-sm font-light text-text-secondary">Analyze settings will appear here.</div></div>}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CrmChat;
