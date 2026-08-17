import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Pencil, Filter } from 'lucide-react';
import TargetTabContent from '@/components/TargetTabContent';
import { getVariantStatus, setVariantStatus } from '@/hooks/useVariantStatus';

const tabs = ['Target', 'Display', 'Tabs', 'Options'] as const;
type Tab = typeof tabs[number];

const VariantEdit: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const variantName = decodeURIComponent(name || 'Unknown Variant');
  const [activeTab, setActiveTab] = useState<Tab>('Target');
  const [enabled, setEnabled] = useState(() => getVariantStatus(variantName, true));

  const handleToggle = () => {
    const newStatus = !enabled;
    setEnabled(newStatus);
    setVariantStatus(variantName, newStatus);
  };

  return (
    <div className="min-h-screen bg-background font-['Lexend_Deca']">
      <div>
        {/* Black header bar */}
        <div className="bg-[#1a1a1a] px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link
              to="/crm/chat/chatflows"
              className="text-white text-sm font-light hover:underline mr-8"
            >
              ‹ Back to variants
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white text-lg font-medium">{variantName}</span>
            <Pencil className="w-4 h-4 text-white/70" />
          </div>
          <div className="flex items-center gap-3">
            <button className="px-5 py-2 text-sm font-light bg-white text-[#1a1a1a] rounded hover:bg-gray-100 transition-colors">
              Preview
            </button>
            <button
              onClick={handleToggle}
              className={`relative w-[44px] h-[22px] rounded-full transition-colors duration-250 ease-in-out border border-white ${
                enabled ? 'bg-white/20' : 'bg-white/5'
              }`}
              aria-label={enabled ? 'Enabled' : 'Disabled'}
              role="switch"
              aria-checked={enabled}
            >
              {enabled && (
                <span className="absolute left-[6px] top-1/2 -translate-y-1/2 text-[8px] font-bold text-white uppercase tracking-wide">
                  on
                </span>
              )}
              <div className={`absolute top-[2px] w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-transform duration-250 ease-in-out ${
                enabled ? 'translate-x-[23px]' : 'translate-x-[2px]'
              }`} />
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="border-b border-border bg-white">
          <div className="flex items-center justify-center gap-8 px-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 text-sm font-light border-b-[3px] transition-colors ${
                  activeTab === tab
                    ? 'border-[#006162] text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  {tab === 'Target' && <Filter className="w-3.5 h-3.5" />}
                  {tab}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="px-8 py-8 max-w-[1200px] mx-auto">
          {activeTab === 'Target' && <TargetTabContent description="Choose which pages this specific variant of the chat widget should appear on, and who it should appear for." showFilterIcon />}
          {activeTab === 'Display' && (
            <div>
              <h2 className="text-[24px] font-light text-text-primary mb-6">Display</h2>
              <p className="text-sm font-light text-text-secondary">Display configuration will appear here.</p>
            </div>
          )}
          {activeTab === 'Tabs' && (
            <div>
              <h2 className="text-[24px] font-light text-text-primary mb-6">Tabs</h2>
              <p className="text-sm font-light text-text-secondary">Options configuration for Knowledge Base and Customer Portal will appear here.</p>
            </div>
          )}
          {activeTab === 'Options' && (
            <div>
              <h2 className="text-[24px] font-light text-text-primary mb-6">Options</h2>
              <p className="text-sm font-light text-text-secondary">Options configuration for language, marketing contacts, and feedback survey will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VariantEdit;
