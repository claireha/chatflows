import React, { useState, useMemo } from 'react';
import {
  PanelLeft,
  Settings as SettingsIcon,
  ChevronDown,
  Filter as FilterIcon,
  BookOpen,
  MessageSquare,
  FileText,
  Copy,
  AlertTriangle,
  Plus,
  Pencil,
  Check,
  X,
  Link2,
  ExternalLink,
} from 'lucide-react';

type RecType =
  | 'Edit this article'
  | 'Add this snippet'
  | 'Create this article'
  | 'Resolve this duplicate'
  | 'Resolve this contradiction';

type GapCategory = 'CONTENT GAP' | 'DATA GAP' | 'ACTION GAP';

interface SourceConversation {
  id: string;
  title: string;
  excerpt: string;
  date: string;
}

interface Recommendation {
  id: string;
  type: RecType;
  category: GapCategory;
  title: string;
  summary: string;
  payload: string;
  targetArticle?: string;
  daysAgo: number;
  impact: 'High' | 'Medium' | 'Low';
  sources: SourceConversation[];
}

const recommendations: Recommendation[] = [
  {
    id: 'r1',
    type: 'Edit this article',
    category: 'CONTENT GAP',
    title: 'Edit snippet — Office Hours attendance',
    summary:
      "Students are confused about the office hours scale. The current article shows limited info on how to attend.",
    targetArticle: 'How to Attend Office Hours',
    payload:
      'Add a clear "How to Attend" section that lists the three attendance methods:\n\n• Virtual Office Hours: Click the video link in your course page at the scheduled time.\n• In-Person Office Hours: Visit the location listed in your syllabus.\n• Async Office Hours: Submit your question via the course portal and receive a written reply within 24h.',
    daysAgo: 22,
    impact: 'High',
    sources: [
      { id: 'c1', title: '#48211 — "how do I attend?"', excerpt: 'Student asked how to join virtual office hours…', date: 'Mar 24' },
      { id: 'c2', title: '#48190 — "where is office hours"', excerpt: 'Couldn\'t find location info in syllabus…', date: 'Mar 23' },
    ],
  },
  {
    id: 'r2',
    type: 'Add this snippet',
    category: 'CONTENT GAP',
    title: 'Add snippet — Tire pressure ranges',
    summary:
      "Customers repeatedly ask for recommended tire pressure for road, mountain and hybrid bikes.",
    payload:
      'Recommended tire pressures:\n• Road bikes: 80–130 psi\n• Mountain bikes: 22–35 psi\n• Hybrid bikes: 50–70 psi\n\nAlways check the sidewall of your tire for the manufacturer\'s recommended range.',
    daysAgo: 4,
    impact: 'High',
    sources: [
      { id: 'c3', title: '#51002 — "what psi for my road bike?"', excerpt: 'Asked about correct PSI…', date: 'Mar 25' },
      { id: 'c4', title: '#51010 — "MTB tire pressure"', excerpt: 'Wanted MTB recommendation…', date: 'Mar 25' },
    ],
  },
  {
    id: 'r3',
    type: 'Create this article',
    category: 'CONTENT GAP',
    title: 'Create article — Bike Fitting Services',
    summary:
      'No article currently describes in-store bike fitting services or how to book an appointment.',
    payload:
      '# Bike Fitting Services\n\nOur in-store bike fitting includes saddle height, reach, and cleat alignment with a certified fitter.\n\nDuration: 60–90 minutes.\nBooking: visit /book-fitting or call your local store.',
    daysAgo: 7,
    impact: 'Medium',
    sources: [
      { id: 'c5', title: '#50880 — "do you offer bike fitting?"', excerpt: 'Customer asked about fitting…', date: 'Mar 29' },
    ],
  },
  {
    id: 'r4',
    type: 'Resolve this duplicate',
    category: 'CONTENT GAP',
    title: 'Resolve duplicate — Warranty articles',
    summary:
      'Two articles cover warranty coverage with overlapping content: "Warranty" and "Bike Warranty FAQ".',
    targetArticle: 'Warranty / Bike Warranty FAQ',
    payload:
      'Merge "Bike Warranty FAQ" into the canonical "Warranty" article. Redirect the FAQ URL to the canonical article and consolidate parts/labor coverage details.',
    daysAgo: 3,
    impact: 'Medium',
    sources: [
      { id: 'c6', title: 'Duplicate detected via embedding similarity (0.94)', excerpt: 'Two KB articles overlap on warranty coverage…', date: 'Mar 25' },
    ],
  },
  {
    id: 'r5',
    type: 'Resolve this contradiction',
    category: 'CONTENT GAP',
    title: 'Resolve contradiction — Return window',
    summary:
      'The Returns article states "30 days" while the Shipping & Returns article states "14 days".',
    targetArticle: 'Returns / Shipping & Returns',
    payload:
      'Confirm the correct return window with policy owner and update both articles to a single value. Recommended: 30 days for unused items, 14 days for opened items — make this distinction explicit in both articles.',
    daysAgo: 1,
    impact: 'High',
    sources: [
      { id: 'c7', title: '#51123 — "what\'s the return window?"', excerpt: 'Customer received conflicting answers…', date: 'Mar 25' },
    ],
  },
];

const typeMeta: Record<RecType, { icon: React.ComponentType<{ className?: string }>; cta: string; color: string }> = {
  'Edit this article': { icon: Pencil, cta: 'Accept edit', color: 'text-[#0b6cda]' },
  'Add this snippet': { icon: Plus, cta: 'Accept snippet', color: 'text-[#006162]' },
  'Create this article': { icon: FileText, cta: 'Create article', color: 'text-[#7c3aed]' },
  'Resolve this duplicate': { icon: Copy, cta: 'Merge duplicates', color: 'text-[#b45309]' },
  'Resolve this contradiction': { icon: AlertTriangle, cta: 'Resolve conflict', color: 'text-[#cb2431]' },
};

export const RecommendationsQueue: React.FC = () => {
  const [selectedId, setSelectedId] = useState(recommendations[0].id);
  const [statuses, setStatuses] = useState<Record<string, 'pending' | 'accepted' | 'rejected' | 'done'>>({});
  const [editing, setEditing] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [typeFilter, setTypeFilter] = useState<RecType | 'All'>('All');
  const [impactFilter, setImpactFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');

  const visible = useMemo(
    () =>
      recommendations.filter(
        r =>
          (typeFilter === 'All' || r.type === typeFilter) &&
          (impactFilter === 'All' || r.impact === impactFilter) &&
          statuses[r.id] !== 'rejected' &&
          statuses[r.id] !== 'done',
      ),
    [typeFilter, impactFilter, statuses],
  );

  const selected =
    recommendations.find(r => r.id === selectedId) ?? visible[0] ?? recommendations[0];
  const TypeIcon = typeMeta[selected.type].icon;
  const payloadValue = drafts[selected.id] ?? selected.payload;

  const setStatus = (id: string, s: 'accepted' | 'rejected' | 'done') => {
    setStatuses(prev => ({ ...prev, [id]: s }));
    setEditing(false);
    const next = visible.find(r => r.id !== id);
    if (next) setSelectedId(next.id);
  };

  const counts = {
    content: recommendations.filter(r => r.category === 'CONTENT GAP').length,
    data: 3,
    action: 2,
  };

  return (
    <div className="border border-border-primary rounded-lg overflow-hidden bg-background">
      <div className="grid grid-cols-[minmax(360px,420px)_1fr] min-h-[640px]">
        {/* Middle queue */}
        <section className="border-r border-border-primary flex flex-col">
          <div className="px-5 py-4 border-b border-border-primary flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PanelLeft className="w-4 h-4 text-text-secondary" />
              <h2 className="text-[15px] font-semibold text-text-primary">Recommendations</h2>
            </div>
            <button className="w-7 h-7 rounded-full border border-border-primary inline-flex items-center justify-center text-text-secondary hover:bg-surface-secondary">
              <SettingsIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="px-5 py-3 border-b border-border-primary flex items-center gap-2">
            <span className="text-[12px] text-text-muted font-light">{visible.length} recommendations</span>
            <div className="flex-1" />
            <select
              value={impactFilter}
              onChange={e => setImpactFilter(e.target.value as typeof impactFilter)}
              className="px-2 py-1 border border-border-primary rounded text-[12px] font-light bg-background"
            >
              <option value="All">Impact</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value as typeof typeFilter)}
              className="px-2 py-1 border border-border-primary rounded text-[12px] font-light bg-background inline-flex items-center gap-1"
            >
              <option value="All">Filters</option>
              {(Object.keys(typeMeta) as RecType[]).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 overflow-y-auto">
            {visible.map(r => {
              const Icon = typeMeta[r.type].icon;
              const isSel = r.id === selected.id;
              return (
                <button
                  key={r.id}
                  onClick={() => { setSelectedId(r.id); setEditing(false); }}
                  className={`w-full text-left px-5 py-4 border-b border-border-primary transition-colors ${
                    isSel ? 'bg-surface-secondary' : 'hover:bg-surface-secondary/50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide font-semibold text-text-secondary mb-1.5">
                    <Icon className={`w-3 h-3 ${typeMeta[r.type].color}`} />
                    {r.category}
                    <span className="text-text-muted">·</span>
                    <span className={typeMeta[r.type].color}>{r.type}</span>
                  </div>
                  <div className="text-[14px] font-semibold text-text-primary mb-1">{r.title}</div>
                  <div className="text-[12px] font-light text-text-secondary line-clamp-2">{r.summary}</div>
                  <div className="mt-2 flex items-center gap-2 text-[11px] text-text-muted font-light">
                    <span>{r.daysAgo}d ago</span>
                    <span>·</span>
                    <span>{r.sources.length} source{r.sources.length === 1 ? '' : 's'}</span>
                    <span>·</span>
                    <span className={
                      r.impact === 'High' ? 'text-[#cb2431]' :
                      r.impact === 'Medium' ? 'text-[#b45309]' : 'text-text-muted'
                    }>{r.impact} impact</span>
                  </div>
                </button>
              );
            })}
            {visible.length === 0 && (
              <div className="px-5 py-10 text-center text-[13px] text-text-muted font-light">
                You're all caught up.
              </div>
            )}
          </div>
        </section>

        {/* Right detail */}
        <section className="flex flex-col">
          <div className="px-6 py-4 border-b border-border-primary flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TypeIcon className={`w-4 h-4 ${typeMeta[selected.type].color}`} />
              <h3 className="text-[15px] font-semibold text-text-primary">{selected.type}</h3>
            </div>
            <div className="flex items-center gap-3 text-[12px] text-text-secondary font-light">
              <span>{selected.daysAgo} days ago</span>
              {selected.targetArticle && (
                <a href="#" className="text-[#0b6cda] inline-flex items-center gap-1 hover:underline">
                  {selected.targetArticle}
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="rounded-lg border-2 border-[#f59e0b]/40 bg-[#fff7ed] p-4 mb-5">
              <div className="flex items-start gap-2 mb-2">
                <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#9a3412]">
                  <span className="w-4 h-4 rounded-full bg-[#f59e0b] inline-flex items-center justify-center text-white text-[10px]">✦</span>
                  Suggestion
                </span>
                <div className="flex-1" />
                <span className="text-[11px] text-text-muted font-light">{selected.daysAgo} days ago</span>
              </div>
              <div className="text-[13px] font-light text-text-primary whitespace-pre-wrap">
                {selected.summary}
              </div>
            </div>

            <div className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-text-secondary">
              Pre-written content
            </div>
            {editing ? (
              <textarea
                value={payloadValue}
                onChange={e => setDrafts(d => ({ ...d, [selected.id]: e.target.value }))}
                rows={10}
                className="w-full px-3 py-2 border border-border-primary rounded-md text-[13px] font-light text-text-primary bg-background focus:outline-none focus:ring-1 focus:ring-border-primary resize-y"
              />
            ) : (
              <div className="rounded-md border border-border-primary bg-surface-secondary/40 px-4 py-3 text-[13px] font-light text-text-primary whitespace-pre-wrap">
                {payloadValue}
              </div>
            )}

            <div className="mt-6 mb-2 text-[12px] font-semibold uppercase tracking-wide text-text-secondary inline-flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              Source conversations ({selected.sources.length})
            </div>
            <div className="space-y-2">
              {selected.sources.map(s => (
                <a
                  key={s.id}
                  href="#"
                  className="block rounded-md border border-border-primary px-4 py-3 hover:bg-surface-secondary/50"
                >
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-semibold text-text-primary">{s.title}</span>
                    <span className="text-[11px] text-text-muted font-light">{s.date}</span>
                  </div>
                  <div className="text-[12px] font-light text-text-secondary mt-0.5">{s.excerpt}</div>
                </a>
              ))}
            </div>

            <div className="mt-6 inline-flex items-center gap-1 text-[12px] text-text-muted font-light">
              <Link2 className="w-3.5 h-3.5" />
              Writes back to: Knowledge base · Zendesk Knowledge · Salesforce Knowledge
            </div>
          </div>

          <div className="px-6 py-4 border-t border-border-primary flex items-center gap-2">
            <button
              onClick={() => setStatus(selected.id, 'rejected')}
              className="px-3 py-2 text-[13px] font-medium text-text-primary border border-border-primary rounded-md hover:bg-surface-secondary inline-flex items-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" /> Reject
            </button>
            <button
              onClick={() => setStatus(selected.id, 'done')}
              className="px-3 py-2 text-[13px] font-medium text-text-primary border border-border-primary rounded-md hover:bg-surface-secondary inline-flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" /> Mark as done
            </button>
            <div className="flex-1" />
            <button
              onClick={() => setEditing(e => !e)}
              className="px-3 py-2 text-[13px] font-medium text-text-primary border border-border-primary rounded-md hover:bg-surface-secondary inline-flex items-center gap-1.5"
            >
              <Pencil className="w-3.5 h-3.5" /> {editing ? 'Done editing' : 'Edit before accept'}
            </button>
            <button
              onClick={() => setStatus(selected.id, 'accepted')}
              className="px-4 py-2 text-[13px] font-semibold text-white bg-[#141414] rounded-md hover:opacity-90 inline-flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" /> {typeMeta[selected.type].cta}
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
