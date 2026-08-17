import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, ExternalLink, Check, X, Send, ChevronDown, Eye } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';
import AvailabilitySettings, { type PreviewState, type PreviewData } from '@/components/AvailabilitySettings';

interface ChatChannelEditProps {
  onBack: () => void;
}

const accentColors = [
  { color: '#425b76', gradient: ['#33475b', '#506e8f'], selected: true },
  { color: '#6ec6c8', gradient: ['#56b0b2', '#86dce0'], selected: false },
  { color: '#e6457a', gradient: ['#d03060', '#f06a94'], selected: false },
  { color: '#f5a623', gradient: ['#e0901a', '#ffc040'], selected: false },
  { color: '#7c4dff', gradient: ['#6035e0', '#9a70ff'], selected: false },
];

const ChatChannelEdit: React.FC<ChatChannelEditProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [sidebarItem, setSidebarItem] = useState('Display');
  const [selectedColor, setSelectedColor] = useState('#425b76');
  const [selectedGradient, setSelectedGradient] = useState<[string, string] | null>(['#33475b', '#506e8f']);
  const [hexInput, setHexInput] = useState('425b76');
  const [attachmentsOn, setAttachmentsOn] = useState(true);
  const [chatTranscript, setChatTranscript] = useState(true);
  const [widgetMovement, setWidgetMovement] = useState(false);
  const [screenCapture, setScreenCapture] = useState(false);
  const [replyTimeSubtitle, setReplyTimeSubtitle] = useState('We typically reply in a few minutes');
  const [previewState, setPreviewState] = useState<PreviewState>('available');
  const [previewData, setPreviewData] = useState<PreviewData>({ state: 'available', message: '', behavior: 'show' });
  const [configureTab, setConfigureTab] = useState<'web-chat' | 'mobile-sdk'>('web-chat');
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
    if (previewState === 'available') {
      return "Got any questions? I'm happy to help.";
    }
    if (previewData.behavior === 'hide') return null; // widget hidden
    if (previewData.behavior === 'nothing') return "Got any questions? I'm happy to help.";
    if (previewData.behavior === 'return') return "Got any questions? I'm happy to help.";
    return previewData.message || "Got any questions? I'm happy to help.";
  };

  const isWidgetHidden = previewData.behavior === 'hide' && previewState !== 'available';

  const sidebarItems = ['Configure', 'Display'];

  const topTabs = ['Channels', 'SLAs', 'Access'];

  return (
    <div className="text-[14px] font-light leading-[24px]">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Inboxes</h1>

      {/* Current view bar */}
      <div className="flex items-center justify-between mb-6 bg-[rgb(245,245,245)] rounded-lg px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-text-primary">Current view:</span>
          <div className="flex items-center gap-2 bg-background border border-border-primary rounded px-3 py-1.5 text-sm font-light text-text-primary">
            Inbox
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-light text-text-secondary">You're only modifying this view.</span>
          <button className="border border-border-primary rounded px-3 py-1.5 text-sm font-light text-text-primary bg-background hover:bg-muted/50 flex items-center gap-1">
            Actions <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Top Tabs */}
      <div className="flex mb-6 border-b border-border-primary">
        {topTabs.map((tab) => (
          <button
            key={tab}
            className={`px-5 py-2 text-sm transition-colors -mb-px ${
              tab === 'Channels'
                ? 'bg-background font-medium text-text-primary border-t border-l border-r border-border-primary border-b-white border-b'
                : 'bg-[rgb(245,245,245)] text-text-secondary hover:text-text-primary font-light border border-border-primary'
            }`}
            onClick={() => { if (tab === 'Channels') onBack(); }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-1">
        <button onClick={onBack} className="text-text-primary hover:underline font-semibold">Channels</button>
        <span className="text-text-muted">›</span>
        <span className="text-text-muted font-light">Chat</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Chat</h2>
        <button onClick={() => navigate('/chatflows')} className="px-4 h-[36px] text-sm font-bold text-white bg-[#141414] rounded hover:opacity-90 transition-opacity">
          Manage chatflows
        </button>
      </div>

      <div className="flex gap-8">
        {/* Left sidebar */}
        <div className="w-[160px] shrink-0">
          <ul className="space-y-3">
            {sidebarItems.map((item) => (
              <li key={item}>
                <button
                  onClick={() => setSidebarItem(item)}
                  className={`block w-full text-left text-sm px-2 py-1 rounded transition-colors ${
                    sidebarItem === item
                      ? 'bg-muted text-text-primary border-l-[4px] border-text-primary font-light'
                      : 'text-text-secondary hover:text-text-primary hover:bg-muted/50 font-light'
                  }`}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1">

              {sidebarItem !== 'Configure' && (
                <h3 className="text-lg font-bold text-text-primary mb-4 xl:hidden">Widget Styling</h3>
              )}
              <div className="flex flex-col xl:flex-row gap-8">
                {/* Main content */}
                <div className={`flex-1 order-2 xl:order-1 ${sidebarItem !== 'Configure' ? 'max-w-[520px]' : ''}`}>
              {sidebarItem === 'Configure' && (
                <div className="max-w-[700px]">
                  
                  {/* Sub-tabs */}
                  <div className="flex border-b border-border-primary mb-6">
                    <button
                      onClick={() => setConfigureTab('web-chat')}
                      className={`px-5 py-2.5 text-sm font-medium transition-colors relative ${
                        configureTab === 'web-chat'
                          ? 'text-text-primary'
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      Web Chat
                      {configureTab === 'web-chat' && (
                        <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-text-primary rounded-t" />
                      )}
                    </button>
                    <button
                      onClick={() => setConfigureTab('mobile-sdk')}
                      className={`px-5 py-2.5 text-sm font-medium transition-colors relative ${
                        configureTab === 'mobile-sdk'
                          ? 'text-text-primary'
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      Mobile SDK
                      {configureTab === 'mobile-sdk' && (
                        <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-text-primary rounded-t" />
                      )}
                    </button>
                  </div>

                  {/* Web Chat (Desktop) content */}
                  {configureTab === 'web-chat' && (
                  <div className="mb-10">
                    <h3 className="text-lg font-bold text-text-primary mb-3">Desktop</h3>
                    <p className="text-sm font-light text-text-secondary mb-4">
                      No need for tracking code. Install the HubSpot WordPress plugin to track your web pages in HubSpot. And use HubSpot's free conversion tools like live chat and lead-capture forms.
                    </p>

                    <h5 className="text-sm font-bold text-text-primary mb-3">How to install the plugin</h5>

                    <ol className="list-decimal list-inside text-sm font-light text-text-secondary space-y-3 mb-4">
                      <li>Click this button to find the HubSpot plugin in the WordPress plugin directory
                        <div className="mt-3 ml-1 border border-border-primary rounded-md p-5 flex items-center gap-5">
                          <div className="w-16 h-16 shrink-0 flex items-center justify-center">
                            <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none">
                              <circle cx="32" cy="32" r="30" stroke="#333" strokeWidth="2.5" fill="none" />
                              <text x="32" y="44" textAnchor="middle" fontSize="36" fontWeight="bold" fontFamily="serif" fill="#333">W</text>
                            </svg>
                          </div>
                          <div>
                            <p className="text-base font-bold text-text-primary mb-2">Connect your HubSpot account to your WordPress site</p>
                            <button className="px-5 py-2.5 text-sm font-bold text-white bg-[#e8744f] rounded hover:opacity-90 transition-opacity flex items-center gap-1.5">
                              Find the HubSpot plugin
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </li>
                      <li>Click <span className="font-bold text-text-primary">Install Now</span></li>
                      <li>When it's installed, click <span className="font-bold text-text-primary">Activate</span></li>
                      <li>Sign in to your HubSpot account when prompted to complete the connection and start using HubSpot with WordPress.</li>
                    </ol>

                    <h5 className="text-sm font-bold text-text-primary mb-2">Need help?</h5>
                    <p className="text-sm font-light text-text-secondary mb-3">
                      Find more detailed instructions{' '}
                      <a href="#" className="text-[#016162] hover:text-[#014a4b] font-medium underline inline-flex items-center gap-0.5">
                        here <ExternalLink className="w-3 h-3" />
                      </a>{' '}.
                    </p>

                    <button className="text-sm font-medium text-[#016162] hover:text-[#014a4b] hover:underline mb-6">
                      I don't host my site on WordPress
                    </button>

                    <div className="mt-4">
                      <h5 className="text-sm font-bold text-text-primary mb-1">Email a team member</h5>
                      <p className="text-sm font-light text-text-secondary mb-2">Email the tracking code to your web developer or admin.</p>
                      <div className="flex items-center gap-2 max-w-md">
                        <input
                          type="email"
                          placeholder="Enter email address"
                          className="flex-1 border border-border-primary rounded-md px-3 py-2 text-sm bg-[#f5f8fa] text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-border-secondary"
                        />
                        <button className="px-4 py-2 text-sm font-medium text-[#016162] border border-border-primary rounded-md hover:bg-muted/50 transition-colors">
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                  )}

                  {/* Mobile SDK content */}
                  {configureTab === 'mobile-sdk' && (
                  <>
                   {/* Help Links */}
                   <div className="flex gap-4 mb-6">
                     <a href="https://github.com/HubSpot/mobile-chat-sdk-android" target="_blank" rel="noopener noreferrer" className="text-[#016162] hover:text-[#014a4b] underline font-medium text-sm">
                       View mobile chat source code<ExternalLink className="w-3 h-3 inline ml-0.5 -mt-0.5" />
                     </a>
                     <a href="https://developers.hubspot.com/docs/api/integrate-the-hubspot-mobile-chat-sdk-into-your-android-app" target="_blank" rel="noopener noreferrer" className="text-[#016162] hover:text-[#014a4b] underline font-medium text-sm">
                       View developer documentation<ExternalLink className="w-3 h-3 inline ml-0.5 -mt-0.5" />
                     </a>
                   </div>

                   {/* Mobile SDK - iOS Section */}
                  <div className="mb-10">
                    <h3 className="text-lg font-bold text-text-primary mb-3">iOS Setup</h3>

                    {/* Configuration file */}
                    <h5 className="text-sm font-bold text-text-primary mb-1">Configuration file</h5>
                    <p className="text-sm font-light text-text-secondary mb-3">Your development team should paste this code in your app</p>

                    <div className="bg-[#f5f8fa] border border-border-primary rounded-md p-4 mb-3 overflow-x-auto max-h-[200px] overflow-y-auto">
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
                      <button className="px-5 py-2 text-sm font-bold text-white bg-[#141414] rounded hover:opacity-90 transition-opacity">
                        Copy
                      </button>
                      <button className="px-5 py-2 text-sm font-bold text-[#e8744f] border border-[#e8744f] rounded hover:bg-[#e8744f]/5 transition-colors">
                        Download Code
                      </button>
                    </div>

                    {/* Enable Push Notifications */}
                    <h5 className="text-lg font-bold text-text-primary mb-1">Enable Push Notifications</h5>
                    <p className="text-sm font-light text-text-secondary mb-4">Push notification settings will apply to all inboxes across your portal</p>

                    <div className="flex items-center gap-2 mb-5">
                      <span className="text-sm font-bold text-text-primary">Status</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#b0b0b0]" />
                      <span className="text-sm font-light text-[#0091ae]">Not Set Up</span>
                    </div>

                    <div className="space-y-5 max-w-lg">
                      <div>
                        <label className="block text-sm font-bold text-text-primary mb-1">Key ID <span className="text-[#e8744f]">*</span></label>
                        <input
                          type="text"
                          className="w-full border border-border-primary rounded-md px-3 py-2.5 text-sm bg-[#f5f8fa] text-text-primary focus:outline-none focus:ring-1 focus:ring-border-secondary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-text-primary mb-1">Private Key <span className="text-[#e8744f]">*</span></label>
                        <textarea
                          rows={5}
                          className="w-full border border-border-primary rounded-md px-3 py-2.5 text-sm bg-[#f5f8fa] text-text-primary focus:outline-none focus:ring-1 focus:ring-border-secondary resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-text-primary mb-1">Team ID <span className="text-[#e8744f]">*</span></label>
                        <input
                          type="text"
                          className="w-full border border-border-primary rounded-md px-3 py-2.5 text-sm bg-[#f5f8fa] text-text-primary focus:outline-none focus:ring-1 focus:ring-border-secondary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-text-primary mb-1">App Bundle ID <span className="text-[#e8744f]">*</span></label>
                        <input
                          type="text"
                          className="w-full border border-border-primary rounded-md px-3 py-2.5 text-sm bg-[#f5f8fa] text-text-primary focus:outline-none focus:ring-1 focus:ring-border-secondary"
                        />
                      </div>

                      <button className="px-5 py-2 text-sm font-bold text-white bg-[#e8744f] rounded hover:opacity-90 transition-opacity">
                        Save
                      </button>
                    </div>
                  </div>

                  <hr className="border-border-primary mb-8" />

                  {/* Mobile SDK - Android Section */}
                  <div className="mb-10">
                    <h3 className="text-lg font-bold text-text-primary mb-3">Android Setup</h3>

                    {/* Configuration file */}
                    <h5 className="text-sm font-bold text-text-primary mb-1">Configuration file</h5>
                    <p className="text-sm font-light text-text-secondary mb-3">Your development team should paste this code in your app</p>

                    <div className="bg-[#f5f8fa] border border-border-primary rounded-md p-4 mb-3 overflow-x-auto max-h-[200px] overflow-y-auto">
                      <pre className="text-sm font-mono text-text-primary whitespace-pre leading-relaxed">{`{
  "portalId": "883197886",
  "hublet": "na1",
  "environment": "qa",
  "defaultChatFlow": "----"
}`}</pre>
                    </div>

                    <div className="flex items-center gap-3 mb-8">
                      <button className="px-5 py-2 text-sm font-bold text-white bg-[#141414] rounded hover:opacity-90 transition-opacity">
                        Copy
                      </button>
                      <button className="px-5 py-2 text-sm font-bold text-[#e8744f] border border-[#e8744f] rounded hover:bg-[#e8744f]/5 transition-colors">
                        Download Code
                      </button>
                    </div>

                    {/* Enable Push Notifications */}
                    <h5 className="text-lg font-bold text-text-primary mb-1">Enable Push Notifications</h5>
                    <p className="text-sm font-light text-text-secondary mb-4">Push notification settings will apply to all inboxes across your portal</p>

                    <div className="flex items-center gap-2 mb-5">
                      <span className="text-sm font-bold text-text-primary">Status</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#b0b0b0]" />
                      <span className="text-sm font-light text-[#0091ae]">Not Set Up</span>
                    </div>

                    <div className="space-y-5 max-w-lg">
                      <div>
                        <label className="block text-sm font-bold text-text-primary mb-1">Project ID <span className="text-[#e8744f]">*</span></label>
                        <input
                          type="text"
                          className="w-full border border-border-primary rounded-md px-3 py-2.5 text-sm bg-[#f5f8fa] text-text-primary focus:outline-none focus:ring-1 focus:ring-border-secondary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-text-primary mb-1">Sender ID <span className="text-[#e8744f]">*</span></label>
                        <input
                          type="text"
                          className="w-full border border-border-primary rounded-md px-3 py-2.5 text-sm bg-[#f5f8fa] text-text-primary focus:outline-none focus:ring-1 focus:ring-border-secondary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-text-primary mb-1">Service account JSON <span className="text-[#e8744f]">*</span></label>
                        <textarea
                          rows={5}
                          className="w-full border border-border-primary rounded-md px-3 py-2.5 text-sm bg-[#f5f8fa] text-text-primary focus:outline-none focus:ring-1 focus:ring-border-secondary resize-none"
                        />
                      </div>

                      <button className="px-5 py-2 text-sm font-bold text-white bg-[#e8744f] rounded hover:opacity-90 transition-opacity">
                        Save
                      </button>
                    </div>
                  </div>
                  </>
                  )}
                </div>
              )}
              {sidebarItem === 'Display' && (
                <div>
                  <h3 className="text-lg font-bold text-text-primary mb-4 xl:block hidden">Widget Styling</h3>

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
                          onChange={(e) => {
                            setHexInput(e.target.value);
                            if (e.target.value.length === 6) { setSelectedColor(`#${e.target.value}`); setSelectedGradient(null); }
                          }}
                          onClick={() => {
                            const picker = document.getElementById('color-picker-input');
                            if (picker) picker.click();
                          }}
                          className="w-[80px] border border-[#8a8a8a] rounded px-2 py-1 text-sm font-light text-text-primary cursor-pointer"
                          maxLength={6}
                        />
                        <input
                          id="color-picker-input"
                          type="color"
                          value={selectedColor}
                          onChange={(e) => {
                            const hex = e.target.value;
                            setSelectedColor(hex);
                            setSelectedGradient(null);
                            setHexInput(hex.replace('#', ''));
                          }}
                          className="absolute top-full left-0 mt-1 w-0 h-0 opacity-0 pointer-events-none"
                        />
                      </div>
                      <button
                        className="w-9 h-9 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: selectedColor }}
                      >
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
                          <div className={`w-9 h-9 rounded border-2 flex items-center justify-center ${
                            widgetPosition === side ? 'border-[#2563eb] text-[#2563eb]' : 'border-[#8a8a8a] text-[#8a8a8a]'
                          }`}>
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              {side === 'left' ? (
                                <>
                                  <path d="M12 6L6 12" />
                                  <path d="M6 6L6 12L12 12" />
                                </>
                              ) : (
                                <>
                                  <path d="M6 6L12 12" />
                                  <path d="M12 6L12 12L6 12" />
                                </>
                              )}
                            </svg>
                          </div>
                          <span className={`text-sm font-light ${widgetPosition === side ? 'text-text-primary' : 'text-text-secondary'}`}>
                            {side === 'left' ? 'Left' : 'Right'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-text-primary mb-4 mt-10">Widget Features</h3>

                  {/* Attachments */}
                  <div className="mb-6">
                    <p className="text-sm font-medium text-text-primary mb-2">Attachments</p>
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => setAttachmentsOn(!attachmentsOn)}
                        className={`relative w-[52px] h-[26px] rounded-full transition-colors duration-250 ease-in-out shrink-0 ${attachmentsOn ? 'bg-[#141414]' : 'bg-[#cbd6d8]'}`}
                        role="switch"
                        aria-checked={attachmentsOn}
                      >
                        {attachmentsOn && (
                          <span className="absolute left-[7px] top-1/2 -translate-y-1/2 text-[9px] font-bold text-white uppercase tracking-wide">on</span>
                        )}
                        <div className={`absolute top-[3px] w-[20px] h-[20px] rounded-full bg-white shadow-sm transition-transform duration-250 ease-in-out ${attachmentsOn ? 'translate-x-[28px]' : 'translate-x-[3px]'}`} />
                      </button>
                      
                      <p className="text-sm font-light text-text-secondary">
                        Allow visitors to attach files to their messages. Attachments can also be disabled on a per-page basis using the{' '}
                        <a href="#" className="text-[#016162] hover:text-[#014a4b] underline font-medium">
                          Chat Widget SDK<ExternalLink className="w-3 h-3 inline ml-0.5 -mt-0.5" />
                        </a>.
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
                      <button
                        onClick={() => setScreenCapture(!screenCapture)}
                        className={`relative w-[52px] h-[26px] rounded-full transition-colors duration-250 ease-in-out shrink-0 ${screenCapture ? 'bg-[#141414]' : 'bg-[#cbd6d8]'}`}
                        role="switch"
                        aria-checked={screenCapture}
                      >
                        {screenCapture && (
                          <span className="absolute left-[7px] top-1/2 -translate-y-1/2 text-[9px] font-bold text-white uppercase tracking-wide">on</span>
                        )}
                        <div className={`absolute top-[3px] w-[20px] h-[20px] rounded-full bg-white shadow-sm transition-transform duration-250 ease-in-out ${screenCapture ? 'translate-x-[28px]' : 'translate-x-[3px]'}`} />
                      </button>
                      <p className="text-sm font-light text-text-secondary">
                        Allow visitors to capture a screenshot and attach it to their message. Supported on desktop and tablet browsers.
                      </p>
                    </div>
                  </div>

                  {/* Chat widget movement */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-sm font-medium text-text-primary">Chat widget movement</p>
                      <span className="text-[10px] font-medium text-white bg-[#6431da] rounded-full px-1.5 py-0.5">Web only</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => setWidgetMovement(!widgetMovement)}
                        className={`relative w-[52px] h-[26px] rounded-full transition-colors duration-250 ease-in-out shrink-0 ${widgetMovement ? 'bg-[#141414]' : 'bg-[#cbd6d8]'}`}
                        role="switch"
                        aria-checked={widgetMovement}
                      >
                        {widgetMovement && (
                          <span className="absolute left-[7px] top-1/2 -translate-y-1/2 text-[9px] font-bold text-white uppercase tracking-wide">on</span>
                        )}
                        <div className={`absolute top-[3px] w-[20px] h-[20px] rounded-full bg-white shadow-sm transition-transform duration-250 ease-in-out ${widgetMovement ? 'translate-x-[28px]' : 'translate-x-[3px]'}`} />
                      </button>
                      <p className="text-sm font-light text-text-secondary">
                        Allow your chat widget to be dragged and repositioned on your website.
                      </p>
                    </div>
                  </div>

                  {/* Chat transcript */}
                  <div className="mb-6">
                    <p className="text-sm font-medium text-text-primary mb-2">Chat transcript</p>
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => setChatTranscript(!chatTranscript)}
                        className={`relative w-[52px] h-[26px] rounded-full transition-colors duration-250 ease-in-out shrink-0 ${chatTranscript ? 'bg-[#141414]' : 'bg-[#cbd6d8]'}`}
                        role="switch"
                        aria-checked={chatTranscript}
                      >
                        {chatTranscript && (
                          <span className="absolute left-[7px] top-1/2 -translate-y-1/2 text-[9px] font-bold text-white uppercase tracking-wide">on</span>
                        )}
                        <div className={`absolute top-[3px] w-[20px] h-[20px] rounded-full bg-white shadow-sm transition-transform duration-250 ease-in-out ${chatTranscript ? 'translate-x-[28px]' : 'translate-x-[3px]'}`} />
                      </button>
                      <p className="text-sm font-light text-text-primary">
                        Automatically send a chat transcript at the end of a chat.{' '}
                        <a href="#" className="text-sm text-[#016162] hover:text-[#014a4b] underline font-medium">
                          Preview chat transcript
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Send from */}
                  <div className="mb-8 ml-[64px]">
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-sm font-light text-text-primary">Send from</span>
                      <TooltipProvider delayDuration={200}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3.5 h-3.5 text-text-muted cursor-default" />
                          </TooltipTrigger>
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


                  {/* Availability sections */}
                  <div className="mt-10">
                    <AvailabilitySettings 
                      onReplyTimeChange={setReplyTimeSubtitle}
                      previewState={previewState}
                      onPreviewStateChange={setPreviewState}
                      onPreviewDataChange={handlePreviewDataChange}
                    />
                  </div>
                </div>
              )}

              {sidebarItem === 'Personalize' && (
                <div className="text-sm font-light text-text-secondary">Personalize settings will appear here.</div>
              )}

              {sidebarItem === 'Performance' && (
                <div className="text-sm font-light text-text-secondary">Performance settings will appear here.</div>
              )}
            </div>

            {/* Chat preview widget */}
            {sidebarItem !== 'Configure' && (
            <div className="w-[380px] shrink-0 order-1 xl:order-2 xl:sticky xl:top-[140px] xl:self-start transition-all duration-300 ease-in-out">
              {/* Preview state indicator */}
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
                  {/* Widget header */}
                  <div className="flex items-center justify-between px-4" style={{ background: selectedGradient ? `linear-gradient(to right, ${selectedGradient[0]}, ${selectedGradient[1]})` : selectedColor, minHeight: '70px', padding: '12px 16px' }}>
                    <div className="flex items-center gap-2">
                      <button onClick={onBack} className="text-white hover:opacity-80">
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
                          <span className="text-white/80 text-[11px] font-light leading-tight">
                            We'll return tomorrow at 09:00 AM
                          </span>
                        )}
                      </div>
                    </div>
                    <button className="text-white hover:opacity-80">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Chat body */}
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

                  {/* Chat input */}
                  <div className="border-t border-border-primary px-4 py-3 flex items-center gap-2 bg-background">
                    <input
                      type="text"
                      placeholder="Ask me anything..."
                      className="flex-1 text-sm font-light text-text-primary placeholder:text-text-muted outline-none bg-transparent"
                      readOnly
                    />
                    <Send className="w-4 h-4 text-text-muted" />
                  </div>
                </div>
              </div>

              {/* Close button */}
              <div className={`flex mt-4 ${widgetPosition === 'right' ? 'justify-end' : 'justify-start'}`}>
                <div className="flex items-center gap-1.5" style={{ flexDirection: widgetPosition === 'right' ? 'row' : 'row-reverse' }}>
                  {widgetMovement && (
                    <div className="flex flex-col gap-[2px]">
                      <div className="flex gap-[2px]">
                        <span className="w-[3px] h-[3px] rounded-full bg-[#676565]" />
                        <span className="w-[3px] h-[3px] rounded-full bg-[#676565]" />
                      </div>
                      <div className="flex gap-[2px]">
                        <span className="w-[3px] h-[3px] rounded-full bg-[#676565]" />
                        <span className="w-[3px] h-[3px] rounded-full bg-[#676565]" />
                      </div>
                      <div className="flex gap-[2px]">
                        <span className="w-[3px] h-[3px] rounded-full bg-[#676565]" />
                        <span className="w-[3px] h-[3px] rounded-full bg-[#676565]" />
                      </div>
                    </div>
                  )}
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md" style={{ backgroundColor: selectedColor }}>
                    <X className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
            )}
              </div>

        </div>
      </div>

      {/* Move to help desk section */}
      <div className="mt-12 border-t border-border-primary pt-8">
        <h2 className="text-xl font-bold text-text-primary mb-1">Move your support workspace to help desk</h2>
        <p className="text-sm font-light text-text-secondary mb-4">
          Bring your support team into HubSpot's modern support workspace without disrupting active workflows.
        </p>
        <button className="px-4 py-2 text-sm font-light text-white bg-[#141414] rounded hover:opacity-90 transition-opacity">
          Learn how to move to help desk
        </button>
      </div>
    </div>
  );
};

export default ChatChannelEdit;
