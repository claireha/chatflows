import React, { useState } from 'react';
import { ChevronDown, ExternalLink, Info, Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const RuleGroup: React.FC<{
  collapsed: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ collapsed, onToggle, children }) => (
  <div className="rounded border border-border-primary bg-background px-6 py-5">
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-text-primary"
    >
      <ChevronDown className={`w-4 h-4 transition-transform ${collapsed ? '-rotate-90' : ''}`} />
      Show chat
    </button>
    {!collapsed && <div className="mt-5 pl-6">{children}</div>}
  </div>
);

const AddLinks: React.FC = () => (
  <div className="mt-4 flex items-center gap-6">
    <button
      type="button"
      className="inline-flex items-center gap-0.5 text-sm font-semibold text-text-muted hover:underline"
    >
      <Plus className="w-3.5 h-3.5" /> Add rule
    </button>
    <button
      type="button"
      className="inline-flex items-center gap-0.5 text-sm font-semibold text-text-link hover:underline"
    >
      <Plus className="w-3.5 h-3.5" /> Add exclusion rule
    </button>
  </div>
);

const ChatflowTarget: React.FC = () => {
  const [urlCollapsed, setUrlCollapsed] = useState(false);
  const [visitorCollapsed, setVisitorCollapsed] = useState(false);
  const [urlType, setUrlType] = useState('website-url');
  const [urlMatch, setUrlMatch] = useState('all-pages');
  const [filter, setFilter] = useState('');

  return (
    <div className="max-w-[1180px] mx-auto w-full">
      <h2 className="text-2xl font-semibold text-text-primary">Target</h2>
      <p className="mt-2 text-sm font-light text-text-secondary">
        Choose which pages the chat widget should appear on, and who it should appear for.{' '}
        <a href="#" className="font-semibold text-text-link hover:underline inline-flex items-center gap-1">
          Learn more about targeting <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </p>

      <h3 className="mt-8 text-base font-semibold text-text-primary">Website URL</h3>
      <p className="mt-1 flex items-center gap-1.5 text-sm font-light text-text-secondary">
        Target your visitors by choosing the web pages where you'd like your chatflow to appear
        <Info className="w-3.5 h-3.5 text-text-muted" />
      </p>

      <div className="mt-4">
        <RuleGroup collapsed={urlCollapsed} onToggle={() => setUrlCollapsed((v) => !v)}>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">When</span>
            <Select value={urlType} onValueChange={setUrlType}>
              <SelectTrigger className="w-[260px] h-11 font-light">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="website-url">Website URL</SelectItem>
                <SelectItem value="query-parameter">Query parameter</SelectItem>
                <SelectItem value="page-language">Page language</SelectItem>
              </SelectContent>
            </Select>
            <Select value={urlMatch} onValueChange={setUrlMatch}>
              <SelectTrigger className="w-[220px] h-11 font-light">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-pages">is all pages</SelectItem>
                <SelectItem value="contains">contains</SelectItem>
                <SelectItem value="exactly">is exactly</SelectItem>
                <SelectItem value="starts-with">starts with</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AddLinks />
        </RuleGroup>
      </div>

      <h3 className="mt-12 text-base font-semibold text-text-primary">
        Visitor information and behavior (Optional)
      </h3>
      <p className="mt-1 text-sm font-light text-text-secondary">
        Have more control over who sees your chatflow by adding rules based on your visitors' identity or behavior
      </p>

      <div className="mt-4">
        <RuleGroup collapsed={visitorCollapsed} onToggle={() => setVisitorCollapsed((v) => !v)}>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">When</span>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[260px] h-11 font-light">
                <SelectValue placeholder="Select filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contact-property">Contact property</SelectItem>
                <SelectItem value="lifecycle-stage">Lifecycle stage</SelectItem>
                <SelectItem value="country">Country</SelectItem>
                <SelectItem value="device">Device type</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm font-light text-text-muted">(Optional)</span>
          </div>
          <AddLinks />
        </RuleGroup>

        <div className="relative pl-16 pt-6">
          <span className="absolute left-16 top-0 h-6 w-px bg-border-secondary" />
          <button
            type="button"
            className="rounded border border-border-secondary bg-background px-4 h-10 text-sm font-light text-text-primary hover:bg-surface-hover"
          >
            Add filter group
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatflowTarget;
