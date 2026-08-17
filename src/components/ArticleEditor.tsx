import React, { useState } from 'react';
import { ArrowLeft, Bookmark, MoreHorizontal, X, ChevronDown, Sparkles, Send } from 'lucide-react';

interface ArticleEditorProps {
  open: boolean;
  onClose: () => void;
  topic: string;
  recommendation: string;
}

interface CopilotMessage {
  role: 'copilot' | 'user';
  content: string;
}

export const ArticleEditor: React.FC<ArticleEditorProps> = ({ open, onClose, topic, recommendation }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [body, setBody] = useState(
    `Summarize your article content to let people quickly see their answer is here, and help search engines find it too.`
  );

  React.useEffect(() => {
    if (open) {
      setMessages([
        {
          role: 'copilot',
          content: `I noticed a content gap around "${topic}" based on recent customer conversations.`,
        },
        {
          role: 'copilot',
          content: `Here's what I recommend: ${recommendation}.\n\nWould you like me to implement this change?`,
        },
      ]);
    }
  }, [open, topic, recommendation]);

  if (!open) return null;

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: CopilotMessage = { role: 'user', content: input };
    let reply: CopilotMessage;
    if (/^(yes|yeah|sure|ok|okay|please|do it|go ahead)/i.test(input.trim())) {
      reply = {
        role: 'copilot',
        content: `Great — I've drafted the update for "${topic}" in the article body. Review the changes on the left and click Save when you're ready.`,
      };
      setBody(
        `${recommendation}\n\nThis section was drafted by Co-pilot based on recent customer conversations. Edit freely before publishing.`
      );
    } else {
      reply = {
        role: 'copilot',
        content: `Got it. Let me know if you'd like me to revise the recommendation or draft something different.`,
      };
    }
    setMessages([...messages, userMsg, reply]);
    setInput('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-background font-lexend flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-primary">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="text-[13px] font-light text-text-primary hover:underline">
            Back
          </button>
          {['File', 'Edit', 'View', 'Settings', 'Help'].map(item => (
            <button key={item} className="inline-flex items-center gap-0.5 text-[13px] font-light text-text-primary hover:underline">
              {item}
              <ChevronDown className="w-3 h-3 text-text-secondary" />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold bg-[#006162] text-white px-1.5 py-0.5 rounded-sm">✦ AI</span>
          <span className="text-[14px] font-semibold text-text-primary">{topic}</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-[13px] font-light text-text-primary hover:underline">Save</button>
          <button className="px-3 py-1.5 border border-border-primary rounded-md text-[13px] font-light text-text-primary hover:bg-surface-secondary">Dismiss suggestion</button>
          <button className="px-3 py-1.5 border border-border-primary rounded-md text-[13px] font-light text-text-primary hover:bg-surface-secondary">Preview</button>
          <button className="px-4 py-1.5 bg-[#141414] text-white text-[13px] font-medium rounded-md hover:opacity-90">Publish</button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left + center area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-surface-secondary/40">
          <div className="flex items-center justify-end gap-2 px-6 py-2 border-b border-border-primary bg-background">
            <span className="text-[12px] font-light text-text-secondary">Focus Mode</span>
            <button className="px-3 py-1.5 border border-border-primary rounded-md text-[12px] font-light text-text-primary hover:bg-surface-secondary">Settings</button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Site header preview */}
            <div className="bg-[#3f8278] text-white px-10 py-8">
              <div className="text-[28px] font-semibold tracking-wider">BIKETOOLS</div>
            </div>
            <div className="bg-[#cfe6c4] px-10 py-12">
              <h2 className="text-[28px] font-semibold text-text-primary mb-4">How can we help you?</h2>
              <div className="bg-background border border-border-primary rounded-md px-4 py-2.5 text-[13px] font-light text-text-muted max-w-[600px]">
                Search for answers
              </div>
            </div>

            <div className="px-10 py-8">
              <a className="text-[#0b6cda] text-[13px] font-medium hover:underline" href="#">Biketools Knowledge Base</a>

              <div className="mt-6 grid grid-cols-[180px_1fr] gap-10">
                <nav className="text-[13px] flex flex-col gap-3">
                  {['FAQs', 'General', 'Getting started', 'Support'].map(s => (
                    <a key={s} href="#" className="text-[#0b6cda] font-light hover:underline">{s}</a>
                  ))}
                </nav>
                <article>
                  <h1 className="text-[26px] font-semibold text-text-primary mb-3">{topic}</h1>
                  <div className="text-text-muted text-[13px] mb-2">Subtitle (optional)</div>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={10}
                    className="w-full text-[15px] font-light text-text-primary bg-transparent border border-dashed border-border-primary rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-border-primary resize-none"
                  />
                </article>
              </div>
            </div>
          </div>
        </div>

        {/* Co-pilot side panel */}
        <aside className="w-[380px] border-l border-border-primary flex flex-col bg-background">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-primary">
            <button onClick={onClose} className="inline-flex items-center gap-1 text-[13px] font-light text-text-primary hover:underline">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <div className="flex items-center gap-2 text-text-secondary">
              <button className="hover:text-text-primary"><MoreHorizontal className="w-4 h-4" /></button>
              <button className="hover:text-text-primary"><Sparkles className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
            <div className="text-[11px] uppercase tracking-wide text-text-muted font-semibold">AI Co-pilot</div>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[90%] text-[13px] font-light px-3 py-2 rounded-lg whitespace-pre-line ${
                  m.role === 'copilot'
                    ? 'bg-surface-secondary text-text-primary self-start'
                    : 'bg-[#141414] text-white self-end'
                }`}
              >
                {m.content}
                {m.role === 'copilot' && (
                  <button className="block mt-1 text-text-muted hover:text-text-primary">
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
            {messages.length > 0 && messages[messages.length - 1].role === 'copilot' && (
              <div className="flex gap-2 self-start">
                <button
                  onClick={() => { setInput('Yes, please implement it'); setTimeout(handleSend, 0); }}
                  className="px-3 py-1.5 bg-[#141414] text-white text-[12px] font-medium rounded-md hover:opacity-90"
                >
                  Yes, implement
                </button>
                <button
                  onClick={() => { setInput('No, suggest something different'); setTimeout(handleSend, 0); }}
                  className="px-3 py-1.5 border border-border-primary text-[12px] font-light text-text-primary rounded-md hover:bg-surface-secondary"
                >
                  Not yet
                </button>
              </div>
            )}
          </div>

          <div className="px-4 py-3 border-t border-border-primary">
            <div className="relative">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type @ to mention a record"
                className="w-full pl-3 pr-9 py-2.5 border border-border-primary rounded-md text-[13px] font-light text-text-primary bg-background placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-border-primary"
              />
              <button
                onClick={handleSend}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] text-text-muted font-light mt-2 text-center">AI-generated content may be inaccurate.</p>
          </div>
        </aside>
      </div>
    </div>
  );
};
