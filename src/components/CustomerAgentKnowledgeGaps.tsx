import { Sparkles, RotateCw, X } from 'lucide-react';
import { useState } from 'react';

const rows = [
  { topic: 'Miscellaneous', total: '1 conversation', last: 'a day ago' },
];

export default function CustomerAgentKnowledgeGaps() {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="flex-1 px-10 py-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-[22px] font-semibold text-text-primary">Knowledge gaps</h2>
        <button className="flex items-center gap-1 text-sm font-medium text-[#E91E63]">
          <Sparkles className="w-4 h-4" />
          Ask Breeze
        </button>
      </div>
      <p className="text-[14px] text-text-secondary font-light mb-6 max-w-[760px]">
        See what questions your agent couldn't answer in the last 30 days — then fill the gaps by adding or updating knowledge sources.
      </p>

      {/* Info banner */}
      {showBanner && (
        <div className="flex items-center justify-between border border-[#B8DCF5] bg-[#E5F2FB] rounded-md px-4 py-3 mb-6">
          <p className="text-[14px] font-light text-text-primary">
            View the new coaching opportunities page that also includes knowledge gaps{' '}
            <a href="#" className="font-semibold text-[#006162] underline">here</a>.
          </p>
          <button onClick={() => setShowBanner(false)} className="text-text-secondary hover:text-text-primary">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Last updated */}
      <div className="flex items-center gap-2 text-[12px] text-text-muted font-light mb-3">
        <span>Last updated Wed, May 27, 2026 11:03 AM</span>
        <button className="hover:text-text-primary">
          <RotateCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-[14px] font-light text-text-primary mb-4">
        These are topics Luma couldn't answer in the last 30 days.
      </p>

      {/* Table */}
      <div className="border border-border-primary rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-secondary/60 border-b border-border-primary">
            <tr className="text-left">
              <th className="px-5 py-3 font-semibold text-text-primary">Topic</th>
              <th className="px-5 py-3 font-semibold text-text-primary">Total conversations</th>
              <th className="px-5 py-3 font-semibold text-text-primary">Last Conversation</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t border-border-primary">
                <td className="px-5 py-4">
                  <a className="text-[#006162] font-light underline cursor-pointer">{row.topic}</a>
                </td>
                <td className="px-5 py-4 font-light text-text-primary">{row.total}</td>
                <td className="px-5 py-4 font-light text-text-primary">{row.last}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
