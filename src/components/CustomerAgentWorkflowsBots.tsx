import { Sparkles, Search, ChevronDown, Workflow, Bot, ArrowUp, ArrowUpDown } from 'lucide-react';

const rows = [
  { name: '[v2] Deploy CA via workflows (based on contact + description) (cloned)', type: 'Workflow' },
  { name: 'Assign Product Tickets to Customer Agent', type: 'Workflow' },
  { name: 'Assign specific ticket categories to CA', type: 'Workflow' },
  { name: 'Assign tickets based on customer tier', type: 'Workflow' },
  { name: 'Branching Prospecting Agent Enrollment', type: 'Workflow' },
  { name: 'Deploy CA via workflows (based on contact + description)', type: 'Workflow' },
  { name: 'Deploy CA via workflows (based on contact)', type: 'Workflow' },
  { name: 'Deploy CA via workflows (based on description)', type: 'Workflow' },
  { name: 'New chatflow (April 14, 2026 5:54 AM)', type: 'Rule-based Bot (Live Chat)' },
  { name: 'New chatflow (March 26, 2026 3:24 PM)', type: 'Rule-based Bot (Live Chat)' },
  { name: 'Route by Care Type — Assign to Customer Agent', type: 'Workflow' },
];

export default function CustomerAgentWorkflowsBots() {
  return (
    <div className="flex-1 px-10 py-8">
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-[22px] font-semibold text-text-primary">Assign workflows and bots</h2>
        <button className="flex items-center gap-1 text-sm font-medium text-[#E91E63]">
          <Sparkles className="w-4 h-4" />
          Ask Breeze
        </button>
      </div>
      <p className="text-[14px] text-text-secondary font-light mb-8 max-w-[640px]">
        Deploy your agent through workflows or bot-based chatflows to control who and on what type of conversations it engages with.
      </p>

      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search"
              className="pl-9 pr-3 py-2 w-[280px] border border-border-primary rounded-full text-sm font-light focus:outline-none focus:border-text-primary"
            />
          </div>
          <button className="inline-flex items-center gap-1 text-sm font-semibold text-text-primary px-2 py-1">
            Type
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
        <button className="inline-flex items-center gap-1 px-3 py-1.5 border border-border-primary rounded-md text-sm font-light text-text-primary hover:bg-surface-secondary">
          Assign
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="border border-border-primary rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-secondary/40 border-b border-border-primary">
            <tr className="text-left">
              <th className="px-5 py-3 font-semibold text-text-primary">
                <button className="inline-flex items-center gap-1">
                  Name <ArrowUp className="w-3 h-3" />
                </button>
              </th>
              <th className="px-5 py-3 font-semibold text-text-primary w-[360px]">
                <button className="inline-flex items-center gap-1">
                  Type <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-border-primary">
                <td className="px-5 py-4">
                  <a className="text-[#006162] font-light underline block">{r.name}</a>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-[12px] text-text-secondary font-light">Off</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-text-primary font-light">
                  <span className="inline-flex items-center gap-2">
                    {r.type === 'Workflow' ? <Workflow className="w-3.5 h-3.5 text-text-secondary" /> : <Bot className="w-3.5 h-3.5 text-text-secondary" />}
                    {r.type}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
