import React, { useState } from 'react';
import { ArrowRight, Play, Plus, Trash2, X } from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';

interface FilterGroup {
  id: string;
  filters: string[];
}

const CustomerAgentUseCases: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [groups, setGroups] = useState<FilterGroup[]>([{ id: 'g1', filters: [] }]);

  const addGroup = () => setGroups(prev => [...prev, { id: `g${Date.now()}`, filters: [] }]);
  const removeGroup = (id: string) => setGroups(prev => prev.filter(g => g.id !== id));
  const addFilter = (id: string) =>
    setGroups(prev => prev.map(g => (g.id === id ? { ...g, filters: [...g.filters, `Filter ${g.filters.length + 1}`] } : g)));

  const canSave = name.trim().length > 0;
  const reset = () => {
    setName('');
    setDescription('');
    setGroups([{ id: 'g1', filters: [] }]);
  };
  const handleClose = () => {
    setOpen(false);
    reset();
  };

  return (
    <div className="flex-1 px-10 py-8">
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-[22px] font-semibold text-text-primary">Segments</h2>
        <span className="text-[11px] font-medium bg-[#6B46C1] text-white px-2 py-0.5 rounded-md">Beta</span>
      </div>
      <p className="text-sm text-text-secondary font-light leading-relaxed max-w-[720px] mb-16">
        Create different experiences for different customers. Segments let your agent adjust what it knows and how it behaves.
      </p>

      <div className="grid grid-cols-2 gap-12 items-center max-w-[1100px] mx-auto">
        <div>
          <h3 className="text-[28px] font-semibold text-text-primary leading-tight mb-8">
            Personalize your agent for every customer
          </h3>

          <div className="space-y-5 mb-8">
            <Bullet
              title="Target specific customers"
              description="Define segments using filters like contact properties, behavior, or lifecycle stage so your agent knows who it's talking to."
            />
            <Bullet
              title="Tailor responses by segment"
              description="Give each segment its own knowledge sources so your agent responds with the right information for each customer."
            />
            <Bullet
              title="Set the priority"
              description="Control which segment takes precedence when a customer matches multiple criteria."
            />
          </div>

          <button
            onClick={() => setOpen(true)}
            className="px-5 py-2.5 bg-[#141414] text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity"
          >
            Create segment
          </button>
        </div>

        <div className="relative aspect-video bg-[#1a1a1a] rounded-lg overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2a2a2a] to-[#141414]" />
          <button
            aria-label="Play video"
            className="relative z-10 w-16 h-16 rounded-full bg-[#FF7A59] flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
          >
            <Play className="w-6 h-6 text-white fill-white ml-1" />
          </button>
        </div>
      </div>

      {/* Create segment side panel */}
      <Sheet open={open} onOpenChange={(v) => (v ? setOpen(true) : handleClose())}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-[560px] p-0 flex flex-col gap-0"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-border-primary">
            <h2 className="text-[18px] font-semibold text-text-primary">Create a segment</h2>
            <button
              onClick={handleClose}
              aria-label="Close"
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Segment name <span className="text-red-500">*</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                className="w-full px-3 py-2.5 border border-border-primary rounded-md text-sm font-light text-text-primary bg-background focus:outline-none focus:ring-1 focus:ring-text-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Segment description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                rows={4}
                className="w-full px-3 py-2.5 border border-border-primary rounded-md text-sm font-light text-text-primary bg-background focus:outline-none focus:ring-1 focus:ring-text-primary resize-y"
              />
            </div>

            <div>
              <h3 className="text-[16px] font-semibold text-text-primary mb-4">Segment matching</h3>
              <label className="block text-sm font-semibold text-text-primary mb-1">
                Segment filters <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-text-secondary font-light mb-3">
                Add filters your agent uses to identify a match.
              </p>

              <div className="space-y-3">
                {groups.map((group, idx) => (
                  <div key={group.id} className="border border-border-primary rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-text-primary">Group {idx + 1}</span>
                      {groups.length > 1 && (
                        <button
                          onClick={() => removeGroup(group.id)}
                          aria-label="Remove group"
                          className="text-text-muted hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {group.filters.map((f, i) => (
                        <div key={i} className="px-3 py-2 border border-border-primary rounded-md text-sm font-light text-text-secondary bg-surface-secondary">
                          {f}
                        </div>
                      ))}
                      <button
                        onClick={() => addFilter(group.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border-primary rounded-md text-sm font-light text-text-primary hover:bg-surface-secondary transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Filter
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addGroup}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border-primary rounded-md text-sm font-light text-text-primary hover:bg-surface-secondary transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add group
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 px-8 py-4 border-t border-border-primary">
            <button
              disabled={!canSave}
              onClick={handleClose}
              className={`px-5 py-2 text-sm font-medium rounded-md transition-opacity ${
                canSave
                  ? 'bg-[#141414] text-white hover:opacity-90'
                  : 'bg-[#e0e0e0] text-text-secondary cursor-not-allowed'
              }`}
            >
              Save
            </button>
            <button
              onClick={handleClose}
              className="px-5 py-2 border border-border-primary text-sm font-medium text-text-primary rounded-md hover:bg-surface-secondary transition-colors"
            >
              Cancel
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

const Bullet: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="flex items-start gap-3">
    <div className="w-6 h-6 rounded-full border border-border-primary flex items-center justify-center shrink-0 mt-0.5">
      <ArrowRight className="w-3.5 h-3.5 text-text-primary" />
    </div>
    <p className="text-sm text-text-primary leading-relaxed">
      <span className="font-semibold">{title}</span>
      <span className="font-light text-text-secondary"> — {description}</span>
    </p>
  </div>
);

export default CustomerAgentUseCases;
