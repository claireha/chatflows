import { Sparkles, Pencil } from 'lucide-react';

const customActions = [
  { name: 'Order Status', desc: 'Track the status of the order', by: 'Bhargava Gade', status: 'Published' },
  { name: 'New action (May 29, 2026 5:14 PM)', desc: '', by: 'Kriti Senrayan', status: 'Draft' },
  { name: 'New action (May 29, 2026 9:41 AM)', desc: '', by: 'Lara Greenberg', status: 'Draft' },
  { name: 'Trust Level With Email Appending Test', desc: 'This will let the user know if they are trusted.', by: 'Nick Delfino', status: 'Draft' },
  { name: 'Password reset', desc: "If the customer can't login send them the password reset email", by: 'Bhargava Gade', status: 'Draft' },
];

export default function CustomerAgentActions() {
  return (
    <div className="flex-1 px-10 py-8">
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-[22px] font-semibold text-text-primary">Actions</h2>
        <button className="flex items-center gap-1 text-sm font-medium text-[#E91E63]">
          <Sparkles className="w-4 h-4" />
          Ask Breeze
        </button>
      </div>
      <p className="text-[14px] text-text-secondary font-light mb-10 max-w-[720px]">
        Integrate your agent with external business systems to complete tasks like checking order status, resetting passwords, or pulling account details.
      </p>

      {/* Built-in actions */}
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-[15px] font-semibold text-text-primary">Built-in actions</h3>
        <span className="px-2 py-0.5 text-[11px] font-medium text-white bg-[#6B46C1] rounded-full">Beta</span>
      </div>
      <div className="border border-border-primary rounded-lg p-5 mb-10 flex items-center justify-between">
        <div>
          <h4 className="text-[14px] font-semibold text-text-primary mb-1">Lead qualification</h4>
          <p className="text-[13px] text-text-secondary font-light">
            Automatically qualify inbound leads based on fit criteria and route high-intent visitors.
          </p>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <span className="inline-flex items-center gap-2 text-sm font-light text-text-primary">
            <span className="w-2 h-2 rounded-full bg-text-muted" />
            Draft
          </span>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border-primary rounded-md text-sm font-light hover:bg-surface-secondary">
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>
        </div>
      </div>

      {/* Custom actions */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[15px] font-semibold text-text-primary">Custom actions</h3>
        <button className="px-3 py-1.5 text-sm font-light text-text-muted bg-surface-secondary rounded-md cursor-not-allowed">
          Add action
        </button>
      </div>
      <div className="border border-border-primary rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-secondary/40 border-b border-border-primary">
            <tr className="text-left">
              <th className="px-5 py-3 font-semibold text-text-primary">Action</th>
              <th className="px-5 py-3 font-semibold text-text-primary w-[280px]">Created By</th>
              <th className="px-5 py-3 font-semibold text-text-primary w-[160px]">Status</th>
            </tr>
          </thead>
          <tbody>
            {customActions.map((a, i) => (
              <tr key={i} className="border-t border-border-primary">
                <td className="px-5 py-4">
                  <a className="text-[#006162] font-light underline block">{a.name}</a>
                  {a.desc && <div className="text-[13px] text-text-secondary font-light mt-0.5">{a.desc}</div>}
                </td>
                <td className="px-5 py-4 font-light text-text-primary">{a.by}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-2 font-light text-text-primary">
                    <span className={`w-2 h-2 rounded-full ${a.status === 'Published' ? 'bg-green-600' : 'bg-text-muted'}`} />
                    {a.status}
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
