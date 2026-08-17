import React, { useState } from 'react';
import { MessageSquare, Mail, Mic, Info, ChevronDown, ExternalLink } from 'lucide-react';

type ChannelTab = 'Chat' | 'Email' | 'Voice';
type EmailCapture = 'start' | 'after_first' | 'before_handoff' | 'never';

const CustomerAgentChannelSettings: React.FC = () => {
  const [tab, setTab] = useState<ChannelTab>('Chat');
  const [emailCapture, setEmailCapture] = useState<EmailCapture>('before_handoff');

  const tabs: { key: ChannelTab; icon: React.ReactNode }[] = [
    { key: 'Chat', icon: <MessageSquare className="w-4 h-4" /> },
    { key: 'Email', icon: <Mail className="w-4 h-4" /> },
    { key: 'Voice', icon: <Mic className="w-4 h-4" /> },
  ];

  return (
    <div className="flex-1 flex">
      {/* Left: settings */}
      <div className="flex-1 px-10 py-8 max-w-[640px]">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-[22px] font-semibold text-text-primary">Channel settings</h2>
          <a href="#" className="inline-flex items-center gap-1 text-[13px] font-medium text-[#d63384] hover:underline">
            <span className="text-sm leading-none">✦</span> Ask Breeze
          </a>
        </div>
        <p className="text-sm text-text-secondary font-light leading-relaxed mb-8 max-w-[560px]">
          Customize how your agent handles conversations, responds across messaging, email, and voice channels
        </p>

        {/* Tabs */}
        <div className="border-b border-border-primary mb-8">
          <div className="flex items-center gap-8">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 pb-3 -mb-px text-[13px] transition-colors ${
                  tab === t.key
                    ? 'border-b-2 border-text-primary text-text-primary font-semibold'
                    : 'text-text-secondary font-light hover:text-text-primary'
                }`}
              >
                {t.icon}
                {t.key}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation behaviors */}
        <section className="mb-10">
          <h3 className="text-[16px] font-semibold text-text-primary mb-5">Conversation behaviors</h3>

          <div className="mb-2 flex items-center gap-1.5">
            <span className="text-[13px] font-semibold text-text-primary">Email capture</span>
            <Info className="w-3.5 h-3.5 text-text-muted" />
          </div>
          <p className="text-[13px] font-semibold text-text-primary mb-4">
            Choose when the agent should ask for the customer's email
          </p>

          <div className="space-y-3">
            {[
              { id: 'start', label: 'At the start of the conversation' },
              { id: 'after_first', label: 'After answering the first question' },
              { id: 'before_handoff', label: 'Before handing off to a human' },
              { id: 'never', label: "Don't ask for their email" },
            ].map((opt) => (
              <label key={opt.id} className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="email-capture"
                  checked={emailCapture === opt.id}
                  onChange={() => setEmailCapture(opt.id as EmailCapture)}
                  className="accent-[#141414]"
                />
                <span className="text-[13px] text-text-secondary font-light">{opt.label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Inactivity behavior */}
        <section>
          <h3 className="text-[16px] font-semibold text-text-primary mb-5">Inactivity behavior</h3>

          <div className="mb-2 flex items-center gap-1.5">
            <span className="text-[13px] font-semibold text-text-primary">Handle inactive threads</span>
            <Info className="w-3.5 h-3.5 text-text-muted" />
          </div>
          <p className="text-[13px] text-text-secondary font-light mb-4 leading-relaxed">
            Automatically close the conversation after a period of no customer response. This change might impact how you are billed.{' '}
            <a href="#" className="text-[#006162] font-medium hover:underline inline-flex items-center gap-1">
              Learn more here <ExternalLink className="w-3 h-3" />
            </a>
          </p>

          <button className="flex items-center justify-between min-w-[180px] px-3 py-2 border border-border-primary rounded-md text-[13px] text-text-primary font-light hover:bg-surface-secondary transition-colors">
            15 minutes
            <ChevronDown className="w-3.5 h-3.5 text-text-secondary ml-3" />
          </button>
        </section>
      </div>

      {/* Right: sample chat */}
      <div className="flex-1 px-10 py-8">
        <div className="max-w-[420px] ml-auto space-y-4">
          {/* Customer message */}
          <div className="flex flex-col items-end">
            <div className="border border-border-primary rounded-lg px-4 py-3 text-[13px] text-text-primary font-light max-w-[340px]">
              I can't find a large order I placed. Order #1234567
            </div>
            <span className="text-[11px] text-text-muted font-light mt-1.5">2:22 PM</span>
          </div>

          {/* Agent message */}
          <div className="flex items-start gap-2">
            <div className="w-7 h-7 rounded-full bg-[#a8c0a0] flex items-center justify-center text-[12px] flex-shrink-0">
              🌱
            </div>
            <div className="flex flex-col">
              <div className="border border-border-primary rounded-lg px-4 py-3 text-[13px] text-text-primary font-light max-w-[340px]">
                It seems I can't find it either. Let me get a human to help you. Can I have your email?
              </div>
              <span className="text-[11px] text-text-muted font-light mt-1.5">2:23 PM</span>
            </div>
          </div>

          <p className="text-[11px] text-text-muted font-light text-right pt-2">
            This sample chat is for illustration only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerAgentChannelSettings;
