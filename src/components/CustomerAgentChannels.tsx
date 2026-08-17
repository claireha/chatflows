import React, { useState } from 'react';
import { Search, Mail, MessageSquare, Phone, ExternalLink, X, Info, ChevronDown, ChevronRight, Clock, Plus } from 'lucide-react';

interface Channel {
  name: string;
  subtitle?: string;
  workspace: string;
  workspaceType: string;
  type: string;
  typeIcon: 'email' | 'chat' | 'calling';
  workingHours: string;
  workingHoursDetail?: string;
  coverage: string;
  isOff?: boolean;
  isBeta?: boolean;
  avgVolume?: number;
}

const channels: Channel[] = [
  { name: 'Content assistant Batch 2 demo', subtitle: 'aidemostation@gmail.com', workspace: 'Inbox', workspaceType: 'Inbox', type: 'Email', typeIcon: 'email', workingHours: 'During hours', workingHoursDetail: 'Mon-Fri, 9:00 AM-5:00 PM EDT', coverage: '90%', avgVolume: 0 },
  { name: 'Generate Leads', workspace: 'Inbox', workspaceType: 'Inbox', type: 'Live chat', typeIcon: 'chat', workingHours: 'During hours', workingHoursDetail: 'Mon-Fri, 9:00 AM-5:00 PM EDT', coverage: '100%', avgVolume: 2 },
  { name: 'Zen Plant Care', subtitle: 'julietestsrhings@gmail.com', workspace: 'Help Desk', workspaceType: 'Help Desk', type: 'Email', typeIcon: 'email', workingHours: 'All hours', coverage: '25%', avgVolume: 0 },
  { name: 'Lucy Solaski', subtitle: '+1 (205) 851-9720', workspace: 'Help Desk', workspaceType: 'Help Desk', type: 'Calling', typeIcon: 'calling', workingHours: 'All hours', coverage: '100%', isBeta: true, avgVolume: 0 },
  { name: 'Neuer Chatflow (13. April 2026 10:18)', workspace: 'Inbox', workspaceType: 'Inbox', type: 'Live chat', typeIcon: 'chat', workingHours: 'All hours', coverage: '100%', isOff: true, avgVolume: 0 },
  { name: 'Neuer Chatflow (13. April 2026 10:23)', workspace: 'Inbox', workspaceType: 'Inbox', type: 'Live chat', typeIcon: 'chat', workingHours: 'All hours', coverage: '100%', isOff: true, avgVolume: 0 },
  { name: 'New chatflow (April 2, 2026 8:06 AM)', workspace: 'Help Desk', workspaceType: 'Help Desk', type: 'Live chat', typeIcon: 'chat', workingHours: 'All hours', coverage: '100%', isOff: true, avgVolume: 0 },
  { name: 'New chatflow (April 3, 2026 1:30 PM)', workspace: 'Help Desk', workspaceType: 'Help Desk', type: 'Live chat', typeIcon: 'chat', workingHours: 'All hours', coverage: '100%', isOff: true, avgVolume: 0 },
  { name: 'New chatflow (March 25, 2026 1:16 PM)', workspace: 'Help Desk', workspaceType: 'Help Desk', type: 'Live chat', typeIcon: 'chat', workingHours: 'All hours', coverage: '100%', isOff: true, avgVolume: 0 },
  { name: 'New chatflow (March 26, 2026 3:24 PM)', workspace: 'Help Desk', workspaceType: 'Help Desk', type: 'Live chat', typeIcon: 'chat', workingHours: 'All hours', coverage: '100%', isOff: true, avgVolume: 0 },
  { name: 'Resolve Issues', workspace: 'Help Desk', workspaceType: 'Help Desk', type: 'Live chat', typeIcon: 'chat', workingHours: 'All hours', coverage: '100%', avgVolume: 0 },
];

const TypeIcon: React.FC<{ type: Channel['typeIcon'] }> = ({ type }) => {
  switch (type) {
    case 'email': return <Mail className="w-3.5 h-3.5 text-text-secondary" />;
    case 'chat': return <MessageSquare className="w-3.5 h-3.5 text-text-secondary" />;
    case 'calling': return <Phone className="w-3.5 h-3.5 text-text-secondary" />;
  }
};

/* ── Side Panel ── */
const DeploymentPanel: React.FC<{ channel: Channel; onClose: () => void }> = ({ channel, onClose }) => {
  const isEmail = channel.typeIcon === 'email';
  const [workingHours, setWorkingHours] = useState<'all' | 'specific' | 'outside'>(
    channel.workingHours === 'All hours' ? 'all' : 'specific'
  );
  const [coverage, setCoverage] = useState(channel.coverage);
  const [assignmentsExpanded, setAssignmentsExpanded] = useState(isEmail);

  return (
    <div className="w-[380px] flex-shrink-0 border-l border-border-primary bg-background flex flex-col h-full overflow-y-auto">
      <div className="px-6 pt-6 pb-4 flex items-center justify-between">
        <h3 className="text-[18px] font-semibold text-text-primary">Edit a deployment</h3>
        <button onClick={onClose} className="p-1 hover:bg-surface-secondary rounded transition-colors">
          <X className="w-4 h-4 text-text-secondary" />
        </button>
      </div>

      <div className="px-6 space-y-6 pb-6 flex-1">
        {/* Channel */}
        <div>
          <label className="text-[13px] font-semibold text-text-primary mb-2 block">Channel</label>
          <div className="px-3 py-2 bg-surface-secondary rounded-md text-[13px] text-text-primary font-light">{channel.name}</div>
          <p className="text-[11px] text-text-muted font-light mt-1.5">
            For channel specific settings visit the <a href="#" className="text-text-primary underline font-medium">channel configuration page</a> <ExternalLink className="w-3 h-3 inline" />
          </p>
        </div>

        {/* Working hours */}
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <label className="text-[13px] font-semibold text-text-primary">Working hours</label>
            <Info className="w-3.5 h-3.5 text-text-muted" />
          </div>
          <div className="space-y-3">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="radio" name="hours" checked={workingHours === 'all'} onChange={() => setWorkingHours('all')} className="mt-0.5 accent-[#141414]" />
              <div>
                <div className="text-[13px] font-medium text-text-primary">All hours</div>
                <div className="text-[11px] text-text-muted font-light">The agent responds to new conversations at any time</div>
              </div>
            </label>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="radio" name="hours" checked={workingHours === 'specific'} onChange={() => setWorkingHours('specific')} className="mt-0.5 accent-[#141414]" />
              <div>
                <div className="text-[13px] font-semibold text-text-primary">During specific hours</div>
                <div className="text-[11px] text-text-muted font-light">The agent responds only within the hours you set</div>
              </div>
            </label>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="radio" name="hours" checked={workingHours === 'outside'} onChange={() => setWorkingHours('outside')} className="mt-0.5 accent-[#141414]" />
              <div>
                <div className="text-[13px] font-medium text-text-primary">Only outside specific hours</div>
                <div className="text-[11px] text-text-muted font-light">The agent responds only outside the hours you set</div>
              </div>
            </label>
          </div>
        </div>

        {/* Time zone + schedule (when specific hours) */}
        {workingHours !== 'all' && (
          <div className="space-y-4">
            <div>
              <label className="text-[13px] font-semibold text-text-primary mb-2 block">Time zone</label>
              <div className="flex items-center justify-between px-3 py-2 border border-border-primary rounded-md cursor-pointer hover:bg-surface-secondary transition-colors">
                <span className="text-[13px] text-text-primary font-light">UTC -04:00 Eastern Time</span>
                <ChevronDown className="w-3.5 h-3.5 text-text-secondary" />
              </div>
            </div>
            <div>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <span className="text-[12px] font-semibold text-text-primary">Day</span>
                <span className="text-[12px] font-semibold text-text-primary">Start time</span>
                <span className="text-[12px] font-semibold text-text-primary">End time</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center justify-between px-2.5 py-1.5 border border-border-primary rounded-md text-[12px] text-text-primary font-light">
                  Mon-Fri <ChevronDown className="w-3 h-3 text-text-secondary" />
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1.5 border border-border-primary rounded-md text-[12px] text-text-primary font-light">
                  <Clock className="w-3 h-3 text-text-muted" /> 9:00 AM
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1.5 border border-border-primary rounded-md text-[12px] text-text-primary font-light">
                  <Clock className="w-3 h-3 text-text-muted" /> 5:00 PM
                </div>
              </div>
              <button className="flex items-center gap-1 mt-2 text-[12px] font-medium text-text-primary hover:underline">
                <Plus className="w-3 h-3" /> Add time slot
              </button>
            </div>
          </div>
        )}

        {/* Conversation coverage */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <label className="text-[13px] font-semibold text-text-primary">Conversation coverage</label>
            <Info className="w-3.5 h-3.5 text-text-muted" />
            <span className="text-[10px] font-semibold bg-[#006162] text-white px-1.5 py-0.5 rounded-sm">New</span>
          </div>
          <div className="flex items-center">
            <input
              type="text"
              value={coverage}
              onChange={(e) => setCoverage(e.target.value)}
              className="w-[80px] px-3 py-1.5 border border-border-primary rounded-md text-[13px] text-text-primary font-light focus:outline-none focus:ring-1 focus:ring-border-primary"
            />
            <div className="flex flex-col ml-1">
              <button className="text-text-muted hover:text-text-primary"><ChevronDown className="w-3 h-3 rotate-180" /></button>
              <button className="text-text-muted hover:text-text-primary"><ChevronDown className="w-3 h-3" /></button>
            </div>
          </div>
        </div>

        {/* Assignments section */}
        <div>
          <button
            onClick={() => setAssignmentsExpanded(!assignmentsExpanded)}
            className="flex items-center gap-1.5 text-[13px] font-semibold text-text-primary hover:underline"
          >
            {assignmentsExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            Assignments when the Customer Agent isn't set to respond
          </button>
          {assignmentsExpanded && (
            <div className="mt-3 space-y-4">
              <p className="text-[12px] text-text-secondary font-light leading-relaxed">
                Choose who should handle conversations when the customer agent isn't configured to reply. For advanced settings visit your channel specific settings.
              </p>
              <a href="#" className="text-[12px] text-[#0b6cda] font-medium hover:underline inline-flex items-center gap-1">
                Channel settings <ExternalLink className="w-3 h-3" />
              </a>
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <label className="text-[13px] font-semibold text-text-primary">Assign to</label>
                  <Info className="w-3.5 h-3.5 text-text-muted" />
                </div>
                <div className="flex items-center justify-between px-3 py-2 border border-border-primary rounded-md cursor-pointer hover:bg-surface-secondary transition-colors">
                  <span className="text-[13px] text-text-primary font-light">Specific users and teams</span>
                  <ChevronDown className="w-3.5 h-3.5 text-text-secondary" />
                </div>
              </div>
              <div className="flex items-center justify-between px-3 py-2 border border-border-primary rounded-md">
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px] text-text-primary font-light">Outdoor Plant Care Specialists</span>
                  <span className="text-[11px] text-text-muted">(5)</span>
                  <button className="text-text-muted hover:text-text-primary"><X className="w-3 h-3" /></button>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-text-secondary" />
              </div>
            </div>
          )}
        </div>

        {/* Average volume */}
        <p className="text-[12px] text-text-secondary font-light">
          Average volume is <span className="font-semibold text-text-primary">{channel.avgVolume ?? 0}</span> new conversations a day.
        </p>

        {/* Credits banner */}
        <div className="border border-border-primary rounded-lg p-4">
          <p className="text-[13px] font-semibold text-text-primary">Uses HubSpot Credits</p>
          <p className="text-[12px] text-text-secondary font-light mt-0.5">
            Your credits reset on May 1, 2026. <a href="#" className="text-[#0b6cda] font-medium hover:underline">Learn more</a> <ExternalLink className="w-3 h-3 inline" />
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-border-primary flex items-center gap-3">
        <button className="px-4 py-1.5 text-[13px] font-light text-text-muted hover:text-text-primary transition-colors">Save</button>
        <button className="px-4 py-1.5 border border-border-primary rounded-md text-[13px] font-medium text-text-primary hover:bg-surface-secondary transition-colors" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

/* ── Main Component ── */
const CustomerAgentChannels: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  const filtered = channels.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex">
      <div className={`flex-1 px-10 py-8 overflow-y-auto ${selectedChannel ? 'max-w-[calc(100%-380px)]' : ''}`}>
        <h2 className="text-[22px] font-semibold text-text-primary mb-3">Deploy a channel</h2>
        <p className="text-sm text-text-secondary font-light leading-relaxed mb-1 max-w-[720px]">
          Deploy this agent to a channel to handle incoming conversations during its working hours. Once deployed, new conversations in that channel will be routed directly to this agent. If paused, it keeps existing chats but won't get new ones.
        </p>

        <a href="#" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#d63384] border border-[#d63384] rounded-full px-4 py-1.5 hover:bg-[#d63384]/5 transition-colors mt-4 mb-8">
          <span className="text-base leading-none">✦</span>
          Learn more
        </a>

        <div className="flex items-center justify-between mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 border border-border-primary rounded-md text-sm font-light text-text-primary bg-background placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-border-primary w-[200px]"
            />
          </div>
          <button className="px-4 py-1.5 bg-[#141414] text-white text-[13px] font-medium rounded-md hover:opacity-90 transition-opacity">
            Deploy agent
          </button>
        </div>

        <div className="border border-border-primary rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-secondary border-b border-border-primary">
                <th className="text-left px-4 py-2.5 font-semibold text-text-primary text-[13px]">Channel</th>
                <th className="text-left px-4 py-2.5 font-semibold text-text-primary text-[13px]">Workspace</th>
                <th className="text-left px-4 py-2.5 font-semibold text-text-primary text-[13px]">Type</th>
                <th className="text-left px-4 py-2.5 font-semibold text-text-primary text-[13px]">Working Hours</th>
                <th className="text-left px-4 py-2.5 font-semibold text-text-primary text-[13px]">Coverage</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((channel, i) => (
                <tr key={i} className={`border-b border-border-primary last:border-b-0 hover:bg-surface-secondary/50 transition-colors ${selectedChannel?.name === channel.name ? 'bg-surface-secondary/70' : ''}`}>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedChannel(channel)}
                      className="text-[#0b6cda] text-[13px] font-medium hover:underline text-left"
                    >
                      {channel.name}
                    </button>
                    {channel.subtitle && (
                      <div className="text-[11px] text-text-muted font-light mt-0.5">{channel.subtitle}</div>
                    )}
                    {channel.isOff && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                        <span className="text-[11px] text-text-muted font-light">Off</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-[13px] text-text-primary font-light">{channel.workspace}</div>
                    <div className="text-[11px] text-text-muted font-light">{channel.workspaceType}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <TypeIcon type={channel.typeIcon} />
                      <span className="text-[13px] text-text-primary font-light">{channel.type}</span>
                      {channel.isBeta && (
                        <span className="text-[10px] font-semibold bg-[#141414] text-white px-1.5 py-0.5 rounded-sm">Beta</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-[13px] text-text-primary font-light">{channel.workingHours}</div>
                    {channel.workingHoursDetail && (
                      <div className="text-[11px] text-text-muted font-light">{channel.workingHoursDetail}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-text-primary font-light">{channel.coverage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side panel */}
      {selectedChannel && (
        <DeploymentPanel channel={selectedChannel} onClose={() => setSelectedChannel(null)} />
      )}
    </div>
  );
};

export default CustomerAgentChannels;
