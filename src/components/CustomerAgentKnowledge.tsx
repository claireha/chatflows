import { Sparkles, Info, Search, ExternalLink, FileSearch, Check } from 'lucide-react';

const tabs = [
  { title: 'Knowledge Base', sub: "Irina Nica's Knowledge Base", active: true },
  { title: 'Knowledge Base', sub: 'Zen Plants Knowledge Base' },
  { title: 'Knowledge Base', sub: "Jeje's Datenbank" },
  { title: 'Website', sub: '' },
  { title: 'Landing Page', sub: '' },
  { title: 'Blog', sub: 'Zen Plants' },
  { title: 'Blog', sub: 'Zen Plant Care' },
  { title: 'Imported URL', sub: '' },
];

export default function CustomerAgentKnowledge() {
  return (
    <div className="flex-1 px-10 py-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-[22px] font-semibold text-text-primary">Knowledge</h2>
        <button className="flex items-center gap-1 text-sm font-medium text-[#E91E63]">
          <Sparkles className="w-4 h-4" />
          Ask Breeze
        </button>
      </div>
      <p className="text-[14px] text-text-secondary font-light mb-10">
        Add and manage sources your agent uses to answer customer questions with relevant replies.
      </p>

      {/* Sources */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <h3 className="text-[15px] font-semibold text-text-primary">Sources (32)</h3>
          <Info className="w-3.5 h-3.5 text-text-muted" />
        </div>
        <button className="px-3 py-1.5 text-sm font-light text-text-muted bg-surface-secondary rounded-md cursor-not-allowed">
          Add content
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-end border-b border-border-primary mb-6 overflow-x-auto">
        {tabs.map((tab, i) => (
          <button
            key={i}
            className={`flex-shrink-0 px-5 py-3 text-left border-t border-l border-r rounded-t-md -mb-px ${
              tab.active
                ? 'border-border-primary bg-background'
                : 'border-transparent hover:bg-surface-secondary'
            }`}
          >
            <div className="text-[14px] font-semibold text-text-primary whitespace-nowrap">{tab.title}</div>
            {tab.sub && (
              <div className="text-[12px] font-light text-text-secondary whitespace-nowrap">{tab.sub}</div>
            )}
          </button>
        ))}
        <button className="flex-shrink-0 px-5 py-3 text-[14px] font-light text-text-primary">
          More ▾
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search"
              className="pl-9 pr-4 py-2 border border-border-primary rounded-full text-sm font-light w-[260px] focus:outline-none focus:border-text-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-light text-text-primary">Category:</span>
            <select className="border border-border-primary rounded-md px-3 py-1.5 text-sm font-light bg-background">
              <option>All</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-light text-text-primary">Status:</span>
            <select className="border border-border-primary rounded-md px-3 py-1.5 text-sm font-light bg-background">
              <option>All</option>
            </select>
          </div>
        </div>
        <div className="inline-flex border border-border-primary rounded-md overflow-hidden">
          <button className="px-4 py-1.5 text-sm font-medium bg-surface-secondary">Using</button>
          <button className="px-4 py-1.5 text-sm font-light hover:bg-surface-secondary">Unused</button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-border-primary rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-secondary/40 border-b border-border-primary">
            <tr className="text-left">
              <th className="px-4 py-3 w-10">
                <input type="checkbox" className="rounded" />
              </th>
              <th className="px-4 py-3 font-semibold text-text-primary">Name</th>
              <th className="px-4 py-3 font-semibold text-text-primary">Category</th>
              <th className="px-4 py-3 font-semibold text-text-primary">Status</th>
              <th className="px-4 py-3 font-semibold text-text-primary">Last Synced</th>
              <th className="px-4 py-3 font-semibold text-text-primary">
                <div className="flex items-center gap-1">Segment</div>
              </th>
              <th className="px-4 py-3 font-semibold text-text-primary">
                <div className="flex items-center gap-1">Access <Info className="w-3 h-3 text-text-muted" /></div>
              </th>
              <th className="px-4 py-3 font-semibold text-text-primary">
                <div className="flex items-center gap-1">Citations <Info className="w-3 h-3 text-text-muted" /></div>
              </th>
              <th className="px-4 py-3 font-semibold text-text-primary">Created</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-border-primary">
              <td className="px-4 py-4"><input type="checkbox" className="rounded" /></td>
              <td className="px-4 py-4">
                <a className="text-[#006162] font-light underline inline-flex items-center gap-1">
                  FAQs: HubSpot's AI assistant <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </td>
              <td className="px-4 py-4 font-light text-text-primary">FAQs</td>
              <td className="px-4 py-4">
                <span className="inline-flex items-center gap-2 font-light text-text-primary">
                  Synced <FileSearch className="w-4 h-4 text-text-secondary" />
                </span>
              </td>
              <td className="px-4 py-4 font-light text-text-primary">
                May 26, 2026<br />8:45 AM EDT
              </td>
              <td className="px-4 py-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-surface-secondary text-xs font-light">All</span>
              </td>
              <td className="px-4 py-4 font-light text-text-primary">Public</td>
              <td className="px-4 py-4">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-border-primary rounded">
                  <span className="w-6 h-3 bg-surface-secondary rounded-sm" />
                  <Check className="w-3.5 h-3.5 text-text-secondary" />
                </span>
              </td>
              <td className="px-4 py-4 font-light text-text-primary">
                May 26, 2026<br />8:45 AM EDT
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
