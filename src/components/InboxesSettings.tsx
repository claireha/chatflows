import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, Mail, ChevronDown, Info, ExternalLink } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ChatChannelEdit from '@/components/ChatChannelEdit';

const InboxesSettings: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isChatRoute = location.pathname.startsWith('/settings/inboxes/chat');
  const [activeTab, setActiveTab] = useState('Channels');
  const [editingChannel, setEditingChannel] = useState<string | null>(() => isChatRoute ? 'chat' : null);
  const tabs = ['Channels', 'SLAs', 'Access'];

  if (editingChannel === 'chat') {
    return <ChatChannelEdit onBack={() => { setEditingChannel(null); navigate('/settings/inboxes'); }} />;
  }

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

      {/* Tabs */}
      <div className="flex mb-6 border-b border-border-primary">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 text-sm transition-colors -mb-px ${
              activeTab === tab
                ? 'bg-background font-medium text-text-primary border-t border-l border-r border-border-primary border-b-white border-b'
                : 'bg-[rgb(245,245,245)] text-text-secondary hover:text-text-primary font-light border border-border-primary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Channels' && (
        <>
          {/* Channels header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-text-primary">Channels</h2>
            <div className="flex items-center gap-3">
              <button className="border border-border-primary rounded px-4 h-[30px] text-xs font-light text-text-primary bg-background hover:bg-muted/50">
                Move channels to help desk
              </button>
              <button className="px-4 h-[30px] text-xs font-light text-white bg-[#141414] rounded hover:opacity-90 transition-opacity">
                Connect a channel
              </button>
            </div>
          </div>

          {/* Channels table */}
          <div className="border border-border-primary overflow-hidden mb-8">
            {/* Header */}
            <div className="grid grid-cols-[1fr_auto_150px] bg-[rgb(245,245,245)] border-b border-border-primary">
              <div className="px-4 py-3 text-xs font-medium text-text-primary uppercase">Name</div>
              <div></div>
              <div className="px-4 py-3 text-xs font-medium text-text-primary uppercase text-center">Status</div>
            </div>

            {/* Chat row */}
            <div className="grid grid-cols-[1fr_auto_150px] border-b border-border-primary items-center h-[100px] group hover:bg-[#ebebeb] transition-colors">
              <div className="px-4 py-4 flex items-center gap-3">
                <div className="w-[70px] h-[70px] rounded-full bg-[#f0f0f0] flex items-center justify-center shrink-0">
                  <MessageSquare className="w-7 h-7 text-text-secondary" />
                </div>
                <div>
                  <div className="text-[14px] font-light text-text-primary">Chat</div>
                  <div className="text-xs font-light text-text-muted">Live chat & chatbots</div>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <span className="flex items-center gap-1 text-xs font-light text-text-secondary">
                    <span className="w-2 h-2 rounded-full bg-[#00823a]" /> Web
                  </span>
                  <span className="flex items-center gap-1 text-xs font-light text-text-secondary">
                    <span className="w-2 h-2 rounded-full bg-[#8a8a8a]" /> Mobile
                  </span>
                </div>
              </div>
              <div className="px-4 py-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditingChannel('chat'); navigate('/settings/inboxes/chat/general'); }} className="border border-[#8a8a8a] rounded px-3 py-1 text-xs font-light text-text-primary bg-background hover:bg-muted/50">
                  Edit
                </button>
              </div>
              <div className="px-4 py-4 flex justify-center">
                <button className="border border-[#8a8a8a] rounded w-[120px] h-[30px] text-xs font-light text-text-primary bg-background hover:bg-muted/50 whitespace-nowrap">
                  Connect Mobile
                </button>
              </div>
            </div>

            {/* Email row 1 */}
            <div className="grid grid-cols-[1fr_auto_150px] border-b border-border-primary items-center h-[100px] group hover:bg-[#ebebeb] transition-colors">
              <div className="px-4 py-4 flex items-center gap-3">
                <div className="w-[70px] h-[70px] rounded-full bg-[#f0f0f0] flex items-center justify-center shrink-0">
                  <Mail className="w-7 h-7 text-text-secondary" />
                </div>
                <div>
                  <div className="text-[14px] font-light text-text-primary">Dunder Mifflin Paper Company, Inc. (support-shopify@dundermifflin.com)</div>
                  <div className="text-xs font-light text-text-muted">Hosted Email</div>
                </div>
              </div>
              <div className="px-4 py-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="border border-[#8a8a8a] rounded px-3 py-1 text-xs font-light text-text-primary bg-background hover:bg-muted/50">
                  Edit
                </button>
              </div>
              <div className="px-4 py-4 flex justify-center">
                <button className="border border-[#8a8a8a] rounded w-[120px] h-[30px] text-xs font-light text-text-primary bg-background hover:bg-muted/50 whitespace-nowrap">
                  Connect Mobile
                </button>
              </div>
            </div>

            {/* Email row 2 */}
            <div className="grid grid-cols-[1fr_auto_150px] items-center h-[100px] group hover:bg-[#ebebeb] transition-colors">
              <div className="px-4 py-4 flex items-center gap-3">
                <div className="w-[70px] h-[70px] rounded-full bg-[#f0f0f0] flex items-center justify-center shrink-0">
                  <Mail className="w-7 h-7 text-text-secondary" />
                </div>
                <div>
                  <div className="text-[14px] font-light text-text-primary">Dunder Mifflin Paper Company, Inc. (support-community@dundermifflin.com)</div>
                  <div className="text-xs font-light text-text-muted">Hosted Email</div>
                </div>
              </div>
              <div className="px-4 py-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="border border-[#8a8a8a] rounded px-3 py-1 text-xs font-light text-text-primary bg-background hover:bg-muted/50">
                  Edit
                </button>
              </div>
              <div className="px-4 py-4 flex justify-center">
                <button className="border border-[#8a8a8a] rounded w-[120px] h-[30px] text-xs font-light text-text-primary bg-background hover:bg-muted/50 whitespace-nowrap">
                  Connect Mobile
                </button>
              </div>
            </div>
          </div>

          {/* Fallback email section */}
          <h2 className="text-xl font-bold text-text-primary mb-1">HubSpot fallback email</h2>
          <p className="text-sm font-light text-text-secondary mb-4">
            This fallback HubSpot address was automatically created for you when you first set up your account, making it easier to configure workflows and automation.
          </p>

          <div className="border border-border-primary rounded-lg px-4 flex items-center justify-between mb-8 bg-background h-[100px]">
            <div className="flex items-center gap-3">
              <div className="w-[70px] h-[70px] rounded-full bg-[#f0f0f0] flex items-center justify-center shrink-0">
                <Mail className="w-7 h-7 text-text-secondary" />
              </div>
              <div>
                <div className="text-sm font-medium text-text-primary">hubspot.com (support@dundermifflin.com.hs-inbox.com)</div>
                <div className="text-xs font-light text-text-muted">Hosted email (HubSpot fallback)</div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="flex items-center gap-1 text-sm font-bold text-text-primary">
                Use for sending
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-3.5 h-3.5 text-text-muted cursor-default" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-background text-text-primary border border-border-primary shadow-lg max-w-[280px] text-sm font-light p-4" side="left" hasArrow>
                      <p className="mb-2">Allow other users in your portal to send new outbound emails using this account</p>
                      <a href="#" className="text-[#016162] hover:text-[#014a4b] underline font-medium inline-flex items-center gap-1">
                        Learn more <ExternalLink className="w-3 h-3" />
                      </a>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </span>
              <div className="flex items-center gap-2">
                <span className="border border-[#d94c53] rounded-full px-3 py-0.5 text-xs font-light text-[#d94c53]">Turned off</span>
                <a href="#" className="text-sm text-[#016162] hover:text-[#014a4b] underline font-medium">Edit</a>
              </div>
            </div>
          </div>

          {/* Move to help desk section */}
          <h2 className="text-xl font-bold text-text-primary mb-1">Move your support workspace to help desk</h2>
          <p className="text-sm font-light text-text-secondary mb-4">
            Bring your support team into HubSpot's modern support workspace without disrupting active workflows.
          </p>
          <button className="px-4 py-2 text-sm font-light text-white bg-[#141414] rounded hover:opacity-90 transition-opacity">
            Learn how to move to help desk
          </button>
        </>
      )}

      {activeTab === 'SLAs' && (
        <div className="text-sm font-light text-text-secondary">SLA settings content will appear here.</div>
      )}
    </div>
  );
};

export default InboxesSettings;
