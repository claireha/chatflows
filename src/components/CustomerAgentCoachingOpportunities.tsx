import { Sparkles, RotateCw, ChevronDown, Search, ArrowUpDown, ArrowDown, Filter } from 'lucide-react';
import { useState } from 'react';

type Tab = 'Open' | 'Review later' | 'Closed' | 'All';

export default function CustomerAgentCoachingOpportunities() {
  const [activeTab, setActiveTab] = useState<Tab>('Open');

  const tabs: { label: Tab; count: number }[] = [
    { label: 'Open', count: 0 },
    { label: 'Review later', count: 0 },
    { label: 'Closed', count: 3 },
    { label: 'All', count: 3 },
  ];

  return (
    <div className="flex-1 px-10 py-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-[22px] font-semibold text-text-primary">Coaching opportunities</h2>
        <button className="flex items-center gap-1 text-sm font-medium text-[#E91E63]">
          <Sparkles className="w-4 h-4" />
          Ask Breeze
        </button>
      </div>
      <p className="text-[14px] text-text-secondary font-light mb-6">
        Areas where your agent can be improved
      </p>

      {/* Date range + refresh */}
      <div className="flex items-center justify-between mb-4">
        <button className="flex items-center gap-1 text-[14px] font-semibold text-text-primary">
          Last 6 months <ChevronDown className="w-4 h-4" />
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border-primary rounded-md text-sm font-light text-text-muted">
          <RotateCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Chart */}
      <div className="border border-border-primary rounded-lg p-6 mb-6">
        <div className="text-center text-[14px] font-semibold text-text-primary mb-4">
          Opportunities closed
        </div>
        <div className="flex">
          {/* Y-axis */}
          <div className="flex flex-col justify-between items-end pr-3 text-[11px] text-text-muted font-light" style={{ height: 280 }}>
            <span>4</span>
            <span>3</span>
            <span>2</span>
            <span>1</span>
            <span>0</span>
          </div>
          {/* Plot */}
          <div className="flex-1 relative" style={{ height: 280 }}>
            {/* gridlines */}
            {[0, 1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="absolute left-0 right-0 border-t border-dashed border-border-primary"
                style={{ top: `${(i / 4) * 100}%` }}
              />
            ))}
            {/* bar */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div
                className="bg-[#6D28D9] rounded-sm"
                style={{ width: 220, height: (3 / 4) * 280 }}
              />
            </div>
            {/* y-axis label */}
            <div className="absolute -left-10 top-1/2 -translate-y-1/2 -rotate-90 text-[11px] font-semibold text-text-primary">
              Opportunities
            </div>
          </div>
        </div>
        <div className="text-center text-[12px] font-semibold text-text-primary mt-3">Knowledge</div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-border-primary mb-5">
        {tabs.map(t => (
          <button
            key={t.label}
            onClick={() => setActiveTab(t.label)}
            className={`relative pb-3 text-[14px] ${
              activeTab === t.label
                ? 'font-semibold text-text-primary'
                : 'font-light text-text-secondary'
            }`}
          >
            {t.label} ({t.count})
            {activeTab === t.label && (
              <span className="absolute -bottom-px left-0 right-0 h-[3px] bg-[#141414] rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4 w-[320px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="Search opportunities"
          className="w-full pl-9 pr-4 py-2 border border-border-primary rounded-full text-sm font-light focus:outline-none focus:border-text-primary"
        />
      </div>

      {/* Table */}
      <div className="border border-border-primary rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-secondary/60 border-b border-border-primary">
            <tr className="text-left">
              <th className="px-5 py-3 font-semibold text-text-primary">Opportunity</th>
              <th className="px-5 py-3 font-semibold text-text-primary">
                <div className="flex items-center gap-1.5">Conversations <ArrowUpDown className="w-3 h-3 text-text-muted" /></div>
              </th>
              <th className="px-5 py-3 font-semibold text-text-primary">
                <div className="flex items-center gap-1.5">Reason <Filter className="w-3 h-3 text-text-muted" /></div>
              </th>
              <th className="px-5 py-3 font-semibold text-text-primary">Status</th>
              <th className="px-5 py-3 font-semibold text-text-primary bg-surface-secondary">
                <div className="flex items-center gap-1.5">Created <ArrowDown className="w-3 h-3 text-text-muted" /></div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="px-5 py-10 text-center text-[14px] font-light text-text-secondary">
                No open opportunities
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
