import React, { useState } from 'react';
import { X, Bold, Italic, List, ChevronDown, Link as LinkIcon } from 'lucide-react';

interface ShortAnswerPanelProps {
  open: boolean;
  onClose: () => void;
  topic: string;
  suggestedQuestion?: string;
}

export const ShortAnswerPanel: React.FC<ShortAnswerPanelProps> = ({ open, onClose, topic, suggestedQuestion }) => {
  const [question, setQuestion] = useState(suggestedQuestion || '');
  const [answer, setAnswer] = useState('');

  React.useEffect(() => {
    setQuestion(suggestedQuestion || '');
    setAnswer('');
  }, [suggestedQuestion, open]);

  if (!open) return null;

  const canSubmit = question.trim().length > 0 && answer.trim().length > 0;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-label="Resolve knowledge gap"
        className="fixed top-0 right-0 h-full w-[520px] bg-background z-50 shadow-xl border-l border-border-primary flex flex-col font-lexend"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-primary">
          <h2 className="text-[16px] font-semibold text-text-primary">Resolve knowledge gap</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <button className="inline-flex items-center gap-1 text-[14px] font-semibold text-text-primary mb-2">
            Create a short answer
            <ChevronDown className="w-3.5 h-3.5 text-text-secondary" />
          </button>
          <p className="text-[13px] font-light text-text-secondary mb-5">
            Short answers help your agent respond to specific questions. They're like short articles, brief and to the point.
          </p>

          <div className="mb-4">
            <label className="block text-[13px] font-semibold text-text-primary mb-1.5">
              Question <span className="text-[#cb2431]">*</span>
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={`What is ${topic}?`}
              className="w-full px-3 py-2 border border-border-primary rounded-md text-[13px] font-light text-text-primary bg-background placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-border-primary"
            />
          </div>

          <div className="mb-4">
            <label className="block text-[13px] font-semibold text-text-primary mb-1.5">
              Short answer <span className="text-[#cb2431]">*</span>
            </label>
            <div className="border border-border-primary rounded-md focus-within:ring-1 focus-within:ring-border-primary">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Write a clear and concise answer"
                rows={6}
                className="w-full px-3 py-2 text-[13px] font-light text-text-primary bg-background placeholder:text-text-muted focus:outline-none resize-none rounded-t-md"
              />
              <div className="flex items-center gap-2 px-3 py-2 border-t border-border-primary text-text-secondary">
                <button className="hover:text-text-primary p-1"><Bold className="w-3.5 h-3.5" /></button>
                <button className="hover:text-text-primary p-1"><Italic className="w-3.5 h-3.5" /></button>
                <button className="hover:text-text-primary p-1 inline-flex items-center gap-0.5">
                  <List className="w-3.5 h-3.5" />
                  <ChevronDown className="w-3 h-3" />
                </button>
                <button className="hover:text-text-primary p-1"><LinkIcon className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border-primary">
          <button
            disabled={!canSubmit}
            onClick={onClose}
            className={`w-full py-2.5 rounded-md text-[13px] font-semibold transition-colors ${
              canSubmit
                ? 'bg-[#141414] text-white hover:opacity-90'
                : 'bg-surface-secondary text-text-muted cursor-not-allowed'
            }`}
          >
            Create and resolve
          </button>
        </div>
      </aside>
    </>
  );
};
