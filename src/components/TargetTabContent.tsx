import React, { useState } from 'react';
import { ChevronDown, Trash2, Filter } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TargetRule {
  id: string;
  urlType: 'website-url' | 'query-parameter';
  condition: 'is-all-pages' | 'is' | 'contains' | 'begins-with' | 'matches-wildcard';
  value: string;
  error: string;
}

interface FilterGroup {
  id: string;
  showChatOpen: boolean;
  hideChatOpen: boolean;
  showRules: TargetRule[];
  hideRules: TargetRule[];
  filterType: string;
}

const conditionOptions = [
  { value: 'is-all-pages', label: 'is all pages' },
  { value: 'is', label: 'is' },
  { value: 'contains', label: 'contains' },
  { value: 'begins-with', label: 'begins with' },
  { value: 'matches-wildcard', label: 'matches wildcard' },
];

const needsValueInput = (condition: string) => condition !== 'is-all-pages';

const InfoIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-text-secondary cursor-default flex-shrink-0 ${className}`}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
);

interface RuleRowProps {
  rule: TargetRule;
  index: number;
  onUpdate: (id: string, updates: Partial<TargetRule>) => void;
  onValidate: (id: string) => void;
  onDelete?: (id: string) => void;
  showDelete?: boolean;
  isExclusion?: boolean;
}

const RuleRow: React.FC<RuleRowProps> = ({ rule, index, onUpdate, onValidate, onDelete, showDelete, isExclusion }) => {
  const filteredConditions = isExclusion ? conditionOptions.filter(o => o.value !== 'is-all-pages') : conditionOptions;
  return (
  <div className={`${index > 0 ? 'mt-4' : ''}`}>
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-xs font-bold text-text-secondary tracking-wider uppercase w-12">
        {index === 0 ? 'When' : 'Or'}
      </span>

      <div className="relative">
        <select
          value={rule.urlType}
          onChange={(e) => onUpdate(rule.id, { urlType: e.target.value as TargetRule['urlType'] })}
          className="appearance-none bg-white border border-border rounded px-4 py-2.5 pr-10 text-sm text-text-primary cursor-pointer min-w-[180px]"
        >
          <option value="website-url">Website URL</option>
          <option value="query-parameter">Query Parameter</option>
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-primary pointer-events-none" />
      </div>

      <div className="relative">
        <select
          value={rule.condition}
          onChange={(e) => onUpdate(rule.id, { condition: e.target.value as TargetRule['condition'] })}
          className="appearance-none bg-white border border-border rounded px-4 py-2.5 pr-10 text-sm text-text-primary cursor-pointer min-w-[160px]"
        >
          {filteredConditions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-primary pointer-events-none" />
      </div>

      {needsValueInput(rule.condition) && (
        <div className="flex items-center gap-2">
          <div>
            <input
              type="text"
              value={rule.value}
              onChange={(e) => onUpdate(rule.id, { value: e.target.value })}
              onBlur={() => onValidate(rule.id)}
              placeholder="yoursite.com"
              className={`border rounded px-4 py-2.5 text-sm text-text-primary min-w-[240px] outline-none transition-colors ${
                rule.error ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-text-secondary'
              }`}
            />
            {rule.error && (
              <p className="text-xs text-red-500 mt-1 font-medium">{rule.error}</p>
            )}
          </div>
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon />
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-[#1a1a1a] text-white text-xs leading-relaxed max-w-[240px] p-3 rounded-lg shadow-lg">
                <p>Enter the URL of the page where you want the chatflow to appear.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {showDelete && onDelete && (
            <button onClick={() => onDelete(rule.id)} className="text-text-secondary hover:text-text-primary transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {!needsValueInput(rule.condition) && showDelete && onDelete && (
        <button onClick={() => onDelete(rule.id)} className="text-text-secondary hover:text-text-primary transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  </div>
);
};

interface TargetTabContentProps {
  description?: string;
  showFilterIcon?: boolean;
}

const TargetTabContent: React.FC<TargetTabContentProps> = ({ description = 'Choose which pages the chat widget should appear on, and who it should appear for.', showFilterIcon = false }) => {
  const [showChatOpen, setShowChatOpen] = useState(true);
  const [hideChatOpen, setHideChatOpen] = useState(true);
  const [showRules, setShowRules] = useState<TargetRule[]>([
    { id: '1', urlType: 'website-url', condition: 'is-all-pages', value: '', error: '' }
  ]);
  const [hideRules, setHideRules] = useState<TargetRule[]>([]);

  // Filter groups for visitor info
  const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([
    {
      id: 'fg1',
      showChatOpen: true,
      hideChatOpen: true,
      showRules: [{ id: 'v1', urlType: 'website-url', condition: 'is', value: '', error: '' }],
      hideRules: [],
      filterType: 'visitor',
    }
  ]);

  const makeUpdater = (setter: React.Dispatch<React.SetStateAction<TargetRule[]>>) =>
    (id: string, updates: Partial<TargetRule>) => {
      setter(prev => prev.map(r => {
        if (r.id !== id) return r;
        const updated = { ...r, ...updates };
        if (updates.condition === 'is-all-pages') { updated.value = ''; updated.error = ''; }
        if (updates.value !== undefined) { updated.error = ''; }
        return updated;
      }));
    };

  const makeValidator = (setter: React.Dispatch<React.SetStateAction<TargetRule[]>>) =>
    (id: string) => {
      setter(prev => prev.map(r => {
        if (r.id !== id) return r;
        if (r.condition !== 'is-all-pages' && r.value.trim() === '') {
          return { ...r, error: 'Please enter a valid URL' };
        }
        return r;
      }));
    };

  const addShowRule = () => {
    setShowRules(prev => [...prev, { id: String(Date.now()), urlType: 'website-url', condition: 'is-all-pages', value: '', error: '' }]);
  };

  const addExclusionRule = () => {
    setHideRules(prev => [...prev, { id: String(Date.now()), urlType: 'website-url', condition: 'is', value: '', error: '' }]);
  };

  const deleteHideRule = (id: string) => {
    setHideRules(prev => prev.filter(r => r.id !== id));
  };

  const deleteShowRule = (id: string) => {
    setShowRules(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div>
      <h2 className="text-[24px] font-light text-text-primary mb-2 flex items-center gap-2">
        {showFilterIcon && <Filter className="w-5 h-5" />}
        Target
      </h2>
      <p className="text-sm font-light text-text-secondary mb-8">
        {description}{' '}
        <a href="https://knowledge.hubspot.com/chatflows/create-a-live-chat#2-target-decide-where-the-live-chat-should-appear" target="_blank" rel="noopener noreferrer" className="text-sm text-[#016162] hover:text-[#014a4b] underline font-medium inline-flex items-center gap-1">
          Learn more about targeting
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>
      </p>

      <h3 className="text-[20px] font-semibold text-text-primary mb-2">Website URL</h3>
      <p className="text-sm font-light text-text-secondary mb-4 flex items-center gap-1">
        Target your visitors by choosing the web pages where you'd like your chatflow to appear
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon className="w-3.5 h-3.5" />
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-[#1a1a1a] text-white text-xs leading-relaxed max-w-[280px] p-3 rounded-lg shadow-lg">
              <p>Choose which pages your chatflow will appear on based on URL rules.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </p>

      <div className="border border-border rounded-lg">
        {/* SHOW CHAT */}
        <div>
          <button
            onClick={() => setShowChatOpen(!showChatOpen)}
            className="flex items-center gap-2 w-full px-6 py-4 text-left"
          >
            <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform ${showChatOpen ? '' : '-rotate-90'}`} />
            <span className="text-xs font-bold text-text-primary tracking-wider uppercase">Show Chat</span>
          </button>

          {showChatOpen && (
            <div className="px-6 pb-6">
              {showRules.map((rule, index) => (
                <RuleRow key={rule.id} rule={rule} index={index} onUpdate={makeUpdater(setShowRules)} onValidate={makeValidator(setShowRules)} onDelete={deleteShowRule} showDelete={index > 0} />
              ))}
              <div className="flex items-center gap-4 mt-5">
                <button onClick={addShowRule} className="text-sm text-[#016162] hover:text-[#014a4b] underline font-medium">
                  + Add rule
                </button>
                {hideRules.length === 0 && (
                  <button onClick={addExclusionRule} className="text-sm text-[#016162] hover:text-[#014a4b] underline font-medium">
                    + Add exclusion rule
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* HIDE CHAT */}
        {hideRules.length > 0 && (
          <>
            <div className="border-t border-border" />
            <div>
              <button
                onClick={() => setHideChatOpen(!hideChatOpen)}
                className="flex items-center gap-2 w-full px-6 py-4 text-left"
              >
                <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform ${hideChatOpen ? '' : '-rotate-90'}`} />
                <span className="text-xs font-bold text-text-primary tracking-wider uppercase">Hide Chat</span>
              </button>

              {hideChatOpen && (
                <div className="px-6 pb-6">
                  {hideRules.map((rule, index) => (
                    <RuleRow key={rule.id} rule={rule} index={index} onUpdate={makeUpdater(setHideRules)} onValidate={makeValidator(setHideRules)} onDelete={deleteHideRule} showDelete isExclusion />
                  ))}
                  <div className="mt-5">
                    <button onClick={addExclusionRule} className="text-sm text-[#016162] hover:text-[#014a4b] underline font-medium">
                      + Add exclusion rule
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Visitor information and behavior */}
      <h3 className="text-[20px] font-semibold text-text-primary mb-2 mt-10">Visitor information and behavior (Optional)</h3>
      <p className="text-sm font-light text-text-secondary mb-4">
        Have more control over who sees your chatflow by adding rules based on your visitors' identity or behavior
      </p>

      {filterGroups.map((group, groupIndex) => {
        const updateGroup = (updates: Partial<FilterGroup>) => {
          setFilterGroups(prev => prev.map(g => g.id === group.id ? { ...g, ...updates } : g));
        };
        const updateShowRule = (ruleId: string, updates: Partial<TargetRule>) => {
          updateGroup({ showRules: group.showRules.map(r => r.id === ruleId ? { ...r, ...updates } : r) });
        };
        const updateHideRule = (ruleId: string, updates: Partial<TargetRule>) => {
          updateGroup({ hideRules: group.hideRules.map(r => r.id === ruleId ? { ...r, ...updates } : r) });
        };

        const visitorConditions = [
          { value: 'is', label: 'is a contact' },
          { value: 'contains', label: 'is not a contact' },
          { value: 'begins-with', label: 'is a known contact' },
          { value: 'matches-wildcard', label: 'is an unknown visitor' },
        ];

        return (
          <React.Fragment key={group.id}>
            {groupIndex > 0 && (
              <div className="flex items-center ml-6 my-0">
                <div className="flex flex-col items-center">
                  <div className="w-px h-4 bg-border" />
                  <span className="text-sm text-text-secondary font-light">and</span>
                  <div className="w-px h-4 bg-border" />
                </div>
              </div>
            )}

            <div className="border border-border rounded-lg">
              {/* SHOW CHAT */}
              <div>
                <button
                  onClick={() => updateGroup({ showChatOpen: !group.showChatOpen })}
                  className="flex items-center gap-2 w-full px-6 py-4 text-left"
                >
                  <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform ${group.showChatOpen ? '' : '-rotate-90'}`} />
                  <span className="text-xs font-bold text-text-primary tracking-wider uppercase">Show Chat</span>
                </button>

                {group.showChatOpen && (
                  <div className="px-6 pb-6">
                    {group.showRules.map((rule, index) => (
                      <div key={rule.id} className={`${index > 0 ? 'mt-4' : ''}`}>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-xs font-bold text-text-secondary tracking-wider uppercase w-12">
                            {index === 0 ? 'When' : 'Or'}
                          </span>

                          <div className="relative">
                            <select
                              value={group.filterType === 'new' ? '' : 'visitor'}
                              onChange={() => {}}
                              className="appearance-none bg-white border border-border rounded px-4 py-2.5 pr-10 text-sm text-text-primary cursor-pointer min-w-[180px]"
                            >
                              {group.filterType === 'new' ? (
                                <>
                                  <option value="">Select filter</option>
                                  <option value="visitor">Visitor</option>
                                </>
                              ) : (
                                <option value="visitor">Visitor</option>
                              )}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-primary pointer-events-none" />
                          </div>

                          {group.filterType === 'new' ? (
                            <>
                              <span className="text-sm text-text-secondary font-light">(Optional)</span>
                              <button onClick={() => {
                                setFilterGroups(prev => prev.filter(g => g.id !== group.id));
                              }} className="text-text-secondary hover:text-text-primary transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <div className="relative">
                                <select
                                  value={rule.condition}
                                  onChange={(e) => updateShowRule(rule.id, { condition: e.target.value as TargetRule['condition'] })}
                                  className="appearance-none bg-white border border-border rounded px-4 py-2.5 pr-10 text-sm text-text-primary cursor-pointer min-w-[280px]"
                                >
                                  {visitorConditions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                  ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-primary pointer-events-none" />
                              </div>

                              {index > 0 && (
                                <button onClick={() => {
                                  updateGroup({ showRules: group.showRules.filter(r => r.id !== rule.id) });
                                }} className="text-text-secondary hover:text-text-primary transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))}

                    <div className="flex items-center gap-4 mt-5">
                      <button onClick={() => updateGroup({ showRules: [...group.showRules, { id: String(Date.now()), urlType: 'website-url', condition: 'is', value: '', error: '' }] })} className="text-sm text-[#016162] hover:text-[#014a4b] underline font-medium">
                        + Add rule
                      </button>
                      {group.hideRules.length === 0 && (
                        <button onClick={() => updateGroup({ hideRules: [{ id: String(Date.now()), urlType: 'website-url', condition: 'is', value: '', error: '' }] })} className="text-sm text-[#016162] hover:text-[#014a4b] underline font-medium">
                          + Add exclusion rule
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* HIDE CHAT */}
              {group.hideRules.length > 0 && (
                <>
                  <div className="border-t border-border" />
                  <div>
                    <button
                      onClick={() => updateGroup({ hideChatOpen: !group.hideChatOpen })}
                      className="flex items-center gap-2 w-full px-6 py-4 text-left"
                    >
                      <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform ${group.hideChatOpen ? '' : '-rotate-90'}`} />
                      <span className="text-xs font-bold text-text-primary tracking-wider uppercase">Hide Chat</span>
                    </button>

                    {group.hideChatOpen && (
                      <div className="px-6 pb-6">
                        {group.hideRules.map((rule, index) => (
                          <div key={rule.id} className={`${index > 0 ? 'mt-4' : ''}`}>
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="text-xs font-bold text-text-secondary tracking-wider uppercase w-12">
                                {index === 0 ? 'When' : 'Or'}
                              </span>

                              <div className="relative">
                                <select className="appearance-none bg-white border border-border rounded px-4 py-2.5 pr-10 text-sm text-text-primary cursor-pointer min-w-[180px]">
                                  <option value="visitor">Visitor</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-primary pointer-events-none" />
                              </div>

                              <div className="relative">
                                <select
                                  value={rule.condition}
                                  onChange={(e) => updateHideRule(rule.id, { condition: e.target.value as TargetRule['condition'] })}
                                  className="appearance-none bg-white border border-border rounded px-4 py-2.5 pr-10 text-sm text-text-primary cursor-pointer min-w-[280px]"
                                >
                                  {visitorConditions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                  ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-primary pointer-events-none" />
                              </div>

                              <button onClick={() => {
                                updateGroup({ hideRules: group.hideRules.filter(r => r.id !== rule.id) });
                              }} className="text-text-secondary hover:text-text-primary transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                        <div className="mt-5">
                          <button onClick={() => updateGroup({ hideRules: [...group.hideRules, { id: String(Date.now()), urlType: 'website-url', condition: 'is', value: '', error: '' }] })} className="text-sm text-[#016162] hover:text-[#014a4b] underline font-medium">
                            + Add exclusion rule
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </React.Fragment>
        );
      })}

      {/* Add filter group */}
      <div className="flex items-start ml-6">
        <div className="w-px h-8 bg-border" />
      </div>
      <button
        onClick={() => setFilterGroups(prev => [...prev, {
          id: String(Date.now()),
          showChatOpen: true,
          hideChatOpen: true,
          showRules: [{ id: String(Date.now() + 1), urlType: 'website-url', condition: 'is', value: '', error: '' }],
          hideRules: [],
          filterType: 'new',
        }])}
        className="border border-border rounded-md px-4 py-2 text-sm text-text-primary hover:bg-muted transition-colors"
      >
        Add filter group
      </button>
    </div>
  );
};

export default TargetTabContent;
