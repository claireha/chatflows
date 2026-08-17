import { Sparkles, Plus, ExternalLink, RotateCw, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useState } from 'react';

export default function CustomerAgentReplyRecommendations() {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="flex-1 px-10 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <h2 className="text-[22px] font-semibold text-text-primary">Reply recommendations</h2>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#E04E1F] text-white text-[10px] font-bold tracking-wider">
          NO CREDITS USED
        </span>
        <button className="flex items-center gap-1 text-sm font-medium text-[#E91E63]">
          <Sparkles className="w-4 h-4" />
          Ask Breeze
        </button>
      </div>
      <p className="text-[14px] text-text-secondary font-light max-w-[820px] mb-5">
        A low-risk, controlled way to use Customer Agent with your support teams in Help Desk before deploying it
        to customers. Reps can review and edit recommendations before sending them. This feature doesn't use
        credits and is available only to users in Help Desk with a Service Seat.{' '}
        <a href="#" className="font-semibold text-[#006162] underline inline-flex items-center gap-1">
          Learn more about Help Desk <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </p>

      {/* Training content */}
      <button className="inline-flex items-center gap-2 px-3 py-2 border border-border-primary rounded-md text-sm font-light text-text-primary hover:bg-surface-secondary mb-8">
        <Plus className="w-4 h-4" />
        Training content
      </button>

      <hr className="border-border-primary mb-8" />

      {/* Two column */}
      <div className="grid grid-cols-2 gap-10">
        {/* Left: enable */}
        <div>
          <h3 className="text-[15px] font-semibold text-text-primary mb-1">Enable reply recommendations</h3>
          <p className="text-[13px] font-semibold text-text-secondary mb-4">
            Your agent suggests draft replies for your team in Help Desk
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setEnabled(!enabled)}
              className="inline-flex border border-border-primary rounded overflow-hidden"
            >
              <span className={`px-4 py-2 text-[13px] font-semibold ${enabled ? 'bg-surface-secondary text-text-muted' : 'text-text-muted'}`}>
                {enabled ? 'ON' : 'OFF'}
              </span>
              <span className="px-3 py-2 border-l border-border-primary text-text-secondary">✓</span>
            </button>
            <span className="text-[14px] font-light text-text-primary">
              for This Customer Agent, Luma
            </span>
          </div>
        </div>

        {/* Right: chat preview */}
        <div>
          <div className="border border-border-primary rounded-md px-4 py-3 mb-2">
            <p className="text-[14px] font-light text-text-primary">
              Hi. I'm locked out of my account. Tried resetting the password no change. Not sure if it's me or the system. Can you help me get back in?
            </p>
          </div>
          <div className="text-right text-[11px] text-text-muted font-light mb-5">1:41 PM Delivered</div>

          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-text-secondary" />
            <span className="text-[13px] font-light text-text-primary">
              <a href="#" className="text-[#006162] font-semibold underline">Customer Agent</a> reply recommendations
            </span>
          </div>
          <p className="text-[12px] text-text-muted font-light mb-3 ml-6">Only visible to you</p>

          <div className="flex items-start gap-3">
            <div className="flex-1 border-2 border-[#E91E63] rounded-md px-4 py-3">
              <p className="text-[14px] font-semibold text-[#006162] mb-1">
                Hey there — I can help with that!
              </p>
              <p className="text-[13px] font-light text-text-primary truncate">
                Let's get you back into your account. Can you …
              </p>
            </div>
            <div className="flex items-center gap-2 pt-3 text-text-secondary">
              <button className="hover:text-[#E91E63]"><RotateCw className="w-4 h-4" /></button>
              <button className="hover:text-text-primary"><ThumbsUp className="w-4 h-4" /></button>
              <button className="hover:text-text-primary"><ThumbsDown className="w-4 h-4" /></button>
            </div>
          </div>
          <p className="text-right text-[12px] text-text-muted font-light mt-3">
            This sample chat is for illustration only.
          </p>
        </div>
      </div>
    </div>
  );
}
