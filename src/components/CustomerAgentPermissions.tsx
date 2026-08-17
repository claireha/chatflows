import React from 'react';
import { Plus, ExternalLink } from 'lucide-react';

interface Row {
  property: string;
  description: string;
  view: 'Enabled' | 'Disabled';
  edit: 'Enabled' | 'Disabled';
  user: { name: string; email: string; initial?: string; color?: string };
  date: string;
  time: string;
}

const rows: Row[] = [
  { property: 'Street Address', description: "Contact's street address, including a", view: 'Enabled', edit: 'Enabled', user: { name: 'Bhargava Gade', email: 'bgade@hubspot.com', initial: 'B', color: 'bg-[#94A3B8]' }, date: 'Oct 29, 2025', time: '5:39 PM EDT' },
  { property: 'Care type', description: 'Type of plant care the contact is loo', view: 'Enabled', edit: 'Enabled', user: { name: 'Karina Romero', email: 'kromero@hubspot.com', initial: 'K', color: 'bg-[#EF4444]' }, date: 'Sep 17, 2025', time: '1:01 PM EDT' },
  { property: 'City', description: "A contact's city of residence", view: 'Enabled', edit: 'Enabled', user: { name: 'Bhargava Gade', email: 'bgade@hubspot.com', initial: 'B', color: 'bg-[#94A3B8]' }, date: 'Nov 7, 2025', time: '11:31 AM EST' },
  { property: 'Date of birth', description: "Contact's date of birth. Required for", view: 'Enabled', edit: 'Enabled', user: { name: 'Yves Solorzano', email: 'ysolorzano@hubspot.com', initial: 'Y', color: 'bg-[#F97316]' }, date: 'Apr 9, 2026', time: '4:12 PM EDT' },
  { property: 'First Name', description: "A contact's first name", view: 'Enabled', edit: 'Disabled', user: { name: 'Bhargava Gade', email: 'bgade@hubspot.com', initial: 'B', color: 'bg-[#94A3B8]' }, date: 'Oct 6, 2025', time: '4:23 PM EDT' },
  { property: 'Follower Count', description: 'The number of Twitter followers a co', view: 'Enabled', edit: 'Enabled', user: { name: 'Yves Solorzano', email: 'ysolorzano@hubspot.com', initial: 'Y', color: 'bg-[#F97316]' }, date: 'Apr 3, 2026', time: '2:12 PM EDT' },
  { property: 'Email address automate…', description: 'The automated reason why the ema', view: 'Enabled', edit: 'Disabled', user: { name: 'Bhargava Gade', email: 'bgade@hubspot.com', initial: 'B', color: 'bg-[#94A3B8]' }, date: 'Jan 16, 2026', time: '9:33 AM EST' },
  { property: 'Lifecycle Stage', description: 'The qualification of contacts to sale', view: 'Disabled', edit: 'Enabled', user: { name: 'Kirthika Muthukumaran', email: 'kmuthukumaran@hubspot.com', initial: 'K', color: 'bg-[#E5E7EB] text-text-primary' }, date: 'Aug 14, 2025', time: '12:10 PM EDT' },
  { property: 'Subscription', description: 'Subscription that contact is interest', view: 'Enabled', edit: 'Enabled', user: { name: 'Kirthika Muthukumaran', email: 'kmuthukumaran@hubspot.com', initial: 'K', color: 'bg-[#E5E7EB] text-text-primary' }, date: 'Aug 27, 2025', time: '5:15 PM EDT' },
];

const CustomerAgentPermissions: React.FC = () => {
  return (
    <div className="flex-1 px-10 py-8">
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-[22px] font-semibold text-text-primary">Permissions</h2>
        <a href="#" className="inline-flex items-center gap-1 text-sm font-medium text-[#d63384] hover:underline">
          <span className="text-base leading-none">✦</span>
          Ask Breeze
        </a>
      </div>
      <p className="text-sm text-text-secondary font-light mb-3 leading-relaxed">
        Manage who can configure this agent and what CRM data it can access.
      </p>
      <a
        href="#"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-primary hover:underline mb-10"
      >
        Global permissions settings
        <ExternalLink className="w-3.5 h-3.5" />
      </a>

      {/* CRM data access section */}
      <div className="flex items-center justify-between mt-6 mb-4">
        <h3 className="text-[18px] font-semibold text-text-primary">CRM data access</h3>
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border-primary rounded-md text-sm font-light text-text-secondary hover:bg-surface-secondary transition-colors">
          <Plus className="w-3.5 h-3.5" />
          CRM Data
        </button>
      </div>

      <div className="border border-border-primary rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-secondary border-b border-border-primary">
              <th className="text-left px-4 py-3 text-[13px] font-semibold text-text-primary">Property</th>
              <th className="text-left px-4 py-3 text-[13px] font-semibold text-text-primary w-[110px]">View</th>
              <th className="text-left px-4 py-3 text-[13px] font-semibold text-text-primary w-[110px]">Edit</th>
              <th className="text-left px-4 py-3 text-[13px] font-semibold text-text-primary w-[220px]">Last Updated By</th>
              <th className="text-left px-4 py-3 text-[13px] font-semibold text-text-primary w-[160px]">Last Updated Time</th>
              <th className="text-left px-4 py-3 text-[13px] font-semibold text-text-primary w-[80px]">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-border-primary last:border-b-0 hover:bg-surface-secondary/40">
                <td className="px-4 py-3 align-top">
                  <a href="#" className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#006162] hover:underline">
                    {row.property}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <p className="text-[12px] text-text-secondary font-light mt-0.5 line-clamp-1">{row.description}</p>
                </td>
                <td className="px-4 py-3 align-top text-[13px] font-light text-text-primary">{row.view}</td>
                <td className="px-4 py-3 align-top text-[13px] font-light text-text-primary">{row.edit}</td>
                <td className="px-4 py-3 align-top">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold text-white shrink-0 ${row.user.color}`}>
                      {row.user.initial}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13px] text-text-primary font-light truncate">{row.user.name}</div>
                      <div className="text-[12px] text-text-secondary font-light truncate">{row.user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 align-top text-[13px] font-light text-text-primary">
                  <div>{row.date}</div>
                  <div>{row.time}</div>
                </td>
                <td className="px-4 py-3 align-top">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#15803D]" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerAgentPermissions;
