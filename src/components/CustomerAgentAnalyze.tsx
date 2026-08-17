import React, { useState } from 'react';
import { ChevronDown, Info, ExternalLink, Plus, TrendingUp, TrendingDown } from 'lucide-react';

type DateRange = '7d' | '30d' | '90d' | 'custom';

const knowledgeGaps = [
  { question: 'How do I reset my password?', frequency: 47, status: 'Unresolved' as const },
  { question: 'What are your pricing plans?', frequency: 34, status: 'Unresolved' as const },
  { question: 'Can I upgrade mid-cycle?', frequency: 28, status: 'Resolved' as const },
  { question: 'Do you offer refunds?', frequency: 22, status: 'Unresolved' as const },
  { question: 'How do I cancel my subscription?', frequency: 19, status: 'Resolved' as const },
  { question: 'What integrations do you support?', frequency: 15, status: 'Unresolved' as const },
];

const sourcePerformance = [
  { name: 'Help Center Articles', conversations: 312, resolutionRate: '78%' },
  { name: 'Product FAQ', conversations: 198, resolutionRate: '92%' },
  { name: 'Pricing Page', conversations: 145, resolutionRate: '65%' },
  { name: 'Getting Started Guide', conversations: 89, resolutionRate: '88%' },
  { name: 'API Documentation', conversations: 56, resolutionRate: '71%' },
];

const leadQualData = {
  qualified: 124,
  partiallyQualified: 67,
  notQualified: 43,
};

const CustomerAgentAnalyze: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const total = leadQualData.qualified + leadQualData.partiallyQualified + leadQualData.notQualified;

  const dateLabels: Record<DateRange, string> = {
    '7d': 'Last 7 days',
    '30d': 'Last 30 days',
    '90d': 'Last 90 days',
    'custom': 'Custom',
  };

  return (
    <div className="flex-1 px-10 py-8 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[22px] font-semibold text-text-primary">Analyze</h2>
        <div className="flex items-center gap-2">
          {(['7d', '30d', '90d'] as DateRange[]).map(range => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1.5 rounded-md text-[13px] transition-colors ${
                dateRange === range
                  ? 'bg-[#141414] text-white font-medium'
                  : 'border border-border-primary text-text-primary font-light hover:bg-surface-secondary'
              }`}
            >
              {dateLabels[range]}
            </button>
          ))}
        </div>
      </div>

      {/* Top metrics */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <MetricCard label="Total conversations" value="534" change="+12%" positive />
        <MetricCard label="Resolution rate" value="73%" change="+5%" positive />
        <MetricCard label="Avg CSAT score" value="4.2" change="-0.1" positive={false} />
        <MetricCard label="Coaching actions taken" value="28" change="+8" positive />
      </div>

      {/* Knowledge gaps + Source performance */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Knowledge gaps */}
        <div className="border border-border-primary rounded-lg">
          <div className="px-5 py-4 border-b border-border-primary flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <h3 className="text-[15px] font-semibold text-text-primary">Knowledge gaps</h3>
              <Info className="w-3.5 h-3.5 text-text-muted" />
            </div>
            <span className="text-[12px] text-text-muted font-light">{knowledgeGaps.filter(g => g.status === 'Unresolved').length} unresolved</span>
          </div>
          <table className="w-full text-[12px]">
            <thead>
              <tr className="bg-surface-secondary border-b border-border-primary">
                <th className="text-left px-4 py-2 font-semibold text-text-primary">Question</th>
                <th className="text-left px-4 py-2 font-semibold text-text-primary">Frequency</th>
                <th className="text-left px-4 py-2 font-semibold text-text-primary">Status</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {knowledgeGaps.map((gap, i) => (
                <tr key={i} className="border-b border-border-primary last:border-b-0 hover:bg-surface-secondary/50 transition-colors">
                  <td className="px-4 py-2.5 text-text-primary font-light">{gap.question}</td>
                  <td className="px-4 py-2.5 text-text-secondary font-light">{gap.frequency}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      gap.status === 'Unresolved'
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : 'bg-green-50 text-green-600 border border-green-200'
                    }`}>
                      {gap.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    {gap.status === 'Unresolved' && (
                      <button className="inline-flex items-center gap-1 px-2.5 py-1 border border-border-primary rounded-md text-[11px] font-medium text-text-primary hover:bg-surface-secondary transition-colors">
                        <Plus className="w-3 h-3" />
                        Create short answer
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Source performance */}
        <div className="border border-border-primary rounded-lg">
          <div className="px-5 py-4 border-b border-border-primary flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <h3 className="text-[15px] font-semibold text-text-primary">Source performance</h3>
              <Info className="w-3.5 h-3.5 text-text-muted" />
            </div>
            <a href="#" className="text-[12px] text-[#0b6cda] font-medium hover:underline">View all sources</a>
          </div>
          <table className="w-full text-[12px]">
            <thead>
              <tr className="bg-surface-secondary border-b border-border-primary">
                <th className="text-left px-4 py-2 font-semibold text-text-primary">Source name</th>
                <th className="text-left px-4 py-2 font-semibold text-text-primary">Conversations referenced</th>
                <th className="text-left px-4 py-2 font-semibold text-text-primary">Resolution rate</th>
              </tr>
            </thead>
            <tbody>
              {sourcePerformance.map((source, i) => (
                <tr key={i} className="border-b border-border-primary last:border-b-0 hover:bg-surface-secondary/50 transition-colors cursor-pointer">
                  <td className="px-4 py-2.5 text-[#0b6cda] font-medium hover:underline">{source.name}</td>
                  <td className="px-4 py-2.5 text-text-secondary font-light">{source.conversations}</td>
                  <td className="px-4 py-2.5 text-text-primary font-light">{source.resolutionRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead qualification */}
      <div className="border border-border-primary rounded-lg">
        <div className="px-5 py-4 border-b border-border-primary flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <h3 className="text-[15px] font-semibold text-text-primary">Lead qualification</h3>
            <Info className="w-3.5 h-3.5 text-text-muted" />
          </div>
          <span className="text-[12px] text-text-muted font-light">{total} total conversations</span>
        </div>
        <div className="p-5">
          {/* Horizontal bar */}
          <div className="flex rounded-full h-6 overflow-hidden mb-6">
            <div
              className="bg-[#006162] flex items-center justify-center"
              style={{ width: `${(leadQualData.qualified / total) * 100}%` }}
            >
              <span className="text-white text-[10px] font-semibold">{Math.round((leadQualData.qualified / total) * 100)}%</span>
            </div>
            <div
              className="bg-[#F59E0B] flex items-center justify-center"
              style={{ width: `${(leadQualData.partiallyQualified / total) * 100}%` }}
            >
              <span className="text-white text-[10px] font-semibold">{Math.round((leadQualData.partiallyQualified / total) * 100)}%</span>
            </div>
            <div
              className="bg-[#EF4444] flex items-center justify-center"
              style={{ width: `${(leadQualData.notQualified / total) * 100}%` }}
            >
              <span className="text-white text-[10px] font-semibold">{Math.round((leadQualData.notQualified / total) * 100)}%</span>
            </div>
          </div>

          {/* Breakdown table */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 border border-border-primary rounded-lg">
              <div className="w-3 h-3 rounded-full bg-[#006162] shrink-0" />
              <div>
                <div className="text-[20px] font-semibold text-text-primary">{leadQualData.qualified}</div>
                <div className="text-[12px] text-text-secondary font-light">Qualified</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border border-border-primary rounded-lg">
              <div className="w-3 h-3 rounded-full bg-[#F59E0B] shrink-0" />
              <div>
                <div className="text-[20px] font-semibold text-text-primary">{leadQualData.partiallyQualified}</div>
                <div className="text-[12px] text-text-secondary font-light">Partially qualified</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border border-border-primary rounded-lg">
              <div className="w-3 h-3 rounded-full bg-[#EF4444] shrink-0" />
              <div>
                <div className="text-[20px] font-semibold text-text-primary">{leadQualData.notQualified}</div>
                <div className="text-[12px] text-text-secondary font-light">Not qualified</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ label: string; value: string; change: string; positive: boolean }> = ({ label, value, change, positive }) => (
  <div className="border border-border-primary rounded-lg p-5 flex flex-col">
    <div className="flex items-center gap-1.5 mb-2">
      <span className="text-[11px] font-semibold text-text-muted tracking-wider uppercase">{label}</span>
      <Info className="w-3 h-3 text-text-muted" />
    </div>
    <span className="text-[28px] font-semibold text-text-primary mb-1">{value}</span>
    <div className="flex items-center gap-1 text-[12px]">
      {positive ? (
        <TrendingUp className="w-3.5 h-3.5 text-green-600" />
      ) : (
        <TrendingDown className="w-3.5 h-3.5 text-red-500" />
      )}
      <span className={positive ? 'text-green-600 font-medium' : 'text-red-500 font-medium'}>{change}</span>
      <span className="text-text-muted font-light">vs previous period</span>
    </div>
  </div>
);

export default CustomerAgentAnalyze;
