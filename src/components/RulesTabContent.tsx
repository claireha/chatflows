import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Info, GripVertical, Sparkles, ExternalLink, ChevronDown, Zap, ArrowRight } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { StatusToggle } from '@/components/StatusToggle';
import { getVariantStatus, setVariantStatus } from '@/hooks/useVariantStatus';

interface RulesRow {
  id: number;
  priority: number;
  name: string;
  tags: string[];
  modifiedOn: string;
  modifiedBy: string;
  createdOn: string;
  createdBy: string;
  feedback: string;
  status: boolean;
  feedbackIsLink?: boolean;
  hasAiBadge?: boolean;
}

const GRID_COLS = 'grid-cols-[40px_60px_1fr_140px_140px_180px_130px]';

const tagColors: Record<string, { bg: string; text: string }> = {
  'Drive Leads': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'Support': { bg: 'bg-green-100', text: 'text-green-700' },
  'Japanese': { bg: 'bg-purple-100', text: 'text-purple-700' },
  'English': { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  'Spanish': { bg: 'bg-amber-100', text: 'text-amber-700' },
  'Onboarding': { bg: 'bg-teal-100', text: 'text-teal-700' },
  'Sales': { bg: 'bg-rose-100', text: 'text-rose-700' },
  'Marketing': { bg: 'bg-pink-100', text: 'text-pink-700' },
  'Product': { bg: 'bg-cyan-100', text: 'text-cyan-700' },
  'Feedback': { bg: 'bg-orange-100', text: 'text-orange-700' },
  'Bot': { bg: 'bg-slate-100', text: 'text-slate-700' },
  'VIP': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  'EMEA': { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  'APAC': { bg: 'bg-violet-100', text: 'text-violet-700' },
  'Demo': { bg: 'bg-fuchsia-100', text: 'text-fuchsia-700' },
};

const rulesData: RulesRow[] = [
  { id: 1, priority: 1, name: 'Support Chatflow', tags: ['Support', 'English'], modifiedOn: 'Mar 23, 2026', modifiedBy: 'Kelly Kapoor', createdOn: 'Mar 23, 2026', createdBy: 'Michael Scott', feedback: '--', status: true, hasAiBadge: true },
  { id: 2, priority: 2, name: 'Marketing Nurture', tags: ['Marketing', 'Drive Leads'], modifiedOn: 'Mar 23, 2026', modifiedBy: 'Kelly Kapoor', createdOn: 'Mar 23, 2026', createdBy: 'Kelly Kapoor', feedback: '--', status: true, hasAiBadge: true },
  { id: 3, priority: 3, name: 'Retro Board Chatflow', tags: ['Support', 'EMEA'], modifiedOn: 'Mar 10, 2026', modifiedBy: 'Kelly Kapoor', createdOn: 'Sep 29, 2022', createdBy: 'Dwight Schrute', feedback: 'CSAT chat (Onsite + InApp EN)', feedbackIsLink: true, status: true },
  { id: 4, priority: 4, name: 'Meeting Chatflow', tags: ['Sales', 'Bot'], modifiedOn: 'Mar 11, 2026', modifiedBy: 'Pam Beesly', createdOn: 'Mar 11, 2026', createdBy: 'Michael Scott', feedback: '--', status: true },
  { id: 5, priority: 5, name: 'New chatflow (March 2, 2026 2:5...', tags: ['Drive Leads'], modifiedOn: 'Mar 2, 2026', modifiedBy: 'Andy Bernard', createdOn: 'Mar 2, 2026', createdBy: 'Andy Bernard', feedback: '--', status: false },
  { id: 6, priority: 6, name: 'New chatflow (March 5, 2026 2:5...', tags: ['Support', 'Japanese'], modifiedOn: 'Mar 5, 2026', modifiedBy: 'Angela Martin', createdOn: 'Mar 5, 2026', createdBy: 'Angela Martin', feedback: '--', status: false },
  { id: 7, priority: 7, name: 'New chatflow (March 13, 2026 2:1...', tags: ['Bot', 'Onboarding'], modifiedOn: 'Mar 13, 2026', modifiedBy: 'Kevin Malone', createdOn: 'Mar 13, 2026', createdBy: 'Angela Martin', feedback: '--', status: false },
  { id: 8, priority: 8, name: 'New chatflow (March 13, 2026 2:2...', tags: ['Support', 'Spanish'], modifiedOn: 'Mar 13, 2026', modifiedBy: 'Oscar Martinez', createdOn: 'Mar 13, 2026', createdBy: 'Oscar Martinez', feedback: '--', status: false },
  { id: 9, priority: 9, name: 'New chatflow (March 13, 2026 2:2...', tags: ['Drive Leads', 'VIP'], modifiedOn: 'Mar 13, 2026', modifiedBy: 'Stanley Hudson', createdOn: 'Mar 13, 2026', createdBy: 'Stanley Hudson', feedback: '--', status: false },
  { id: 10, priority: 10, name: 'New chatflow (March 13, 2026 2:2...', tags: ['Bot', 'APAC'], modifiedOn: 'Mar 13, 2026', modifiedBy: 'Ryan Howard', createdOn: 'Mar 13, 2026', createdBy: 'Jim Halpert', feedback: '--', status: false },
  { id: 11, priority: 11, name: 'New chatflow (March 13, 2026 2:3...', tags: ['Marketing', 'English'], modifiedOn: 'Mar 13, 2026', modifiedBy: 'Kelly Kapoor', createdOn: 'Mar 13, 2026', createdBy: 'Kelly Kapoor', feedback: '--', status: false },
  { id: 12, priority: 12, name: 'Onboarding Bot', tags: ['Bot', 'Onboarding'], modifiedOn: 'Mar 15, 2026', modifiedBy: 'Toby Flenderson', createdOn: 'Mar 15, 2026', createdBy: 'Toby Flenderson', feedback: '--', status: false },
  { id: 13, priority: 13, name: 'Sales Qualification Flow', tags: ['Sales', 'Drive Leads'], modifiedOn: 'Mar 18, 2026', modifiedBy: 'Darryl Philbin', createdOn: 'Mar 18, 2026', createdBy: 'Michael Scott', feedback: '--', status: false },
  { id: 14, priority: 14, name: 'Product Demo Scheduler', tags: ['Product', 'Demo', 'Bot'], modifiedOn: 'Mar 20, 2026', modifiedBy: 'Creed Bratton', createdOn: 'Mar 20, 2026', createdBy: 'Dwight Schrute', feedback: '--', status: true },
  { id: 15, priority: 15, name: 'Feedback Collection Flow', tags: ['Feedback', 'English'], modifiedOn: 'Mar 22, 2026', modifiedBy: 'Meredith Palmer', createdOn: 'Mar 22, 2026', createdBy: 'Meredith Palmer', feedback: '--', status: false },
];

const TagBadge: React.FC<{ tag: string }> = ({ tag }) => {
  const colors = tagColors[tag] || { bg: 'bg-gray-100', text: 'text-gray-700' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${colors.bg} ${colors.text}`}>
      {tag}
    </span>
  );
};

interface RulesTableRowProps {
  row: RulesRow;
  onToggleStatus: () => void;
  onAnalyze: (name: string) => void;
  onEdit: (name: string) => void;
  isOverlay?: boolean;
}

const RulesTableRow: React.FC<RulesTableRowProps> = ({ row, onToggleStatus, onAnalyze, onEdit, isOverlay }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform ? { ...transform, scaleX: 1, scaleY: 1 } : null),
    transition: transition || undefined,
    zIndex: isDragging ? 50 : undefined,
    position: 'relative' as const,
  };

  const content = (
    <>
      <div
        className="px-2 py-3 flex items-center justify-center cursor-grab active:cursor-grabbing"
        {...(isOverlay ? {} : listeners)}
        {...(isOverlay ? {} : attributes)}
      >
        <GripVertical className={`w-4 h-4 transition-colors duration-150 ${isDragging ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'}`} />
      </div>
      <div className="px-2 py-3">{row.priority}</div>
      <div className="px-2 py-3 flex items-center gap-2 relative group/name">
        {row.hasAiBadge && (
          <span className="inline-flex items-center gap-0.5 text-white text-[10px] font-light px-1.5 py-0.5 rounded shrink-0" style={{ background: 'linear-gradient(to right, #f70b50, #d70781)' }}>
            <Sparkles className="w-2.5 h-2.5" />
            AI
          </span>
        )}
        <span className="truncate">{row.name}</span>
        <div className="absolute left-[-2px] top-full mt-0.5 hidden group-hover/row:flex items-center gap-1.5 z-10">
          <button
            onClick={() => onEdit(row.name)}
            className="px-3 py-1 text-xs font-medium border border-border-primary rounded bg-white hover:bg-muted transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onAnalyze(row.name)}
            className="px-3 py-1 text-xs font-medium border border-border-primary rounded bg-white hover:bg-muted transition-colors"
          >
            Analyze
          </button>
          <button className="px-3 py-1 text-xs font-medium border border-border-primary rounded bg-white hover:bg-muted transition-colors inline-flex items-center gap-1">
            More
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>
      <div className="px-2 py-3">
        <div>{row.modifiedOn}</div>
        <div className="text-xs text-text-muted">by {row.modifiedBy}</div>
      </div>
      <div className="px-2 py-3">
        <div>{row.createdOn}</div>
        <div className="text-xs text-text-muted">by {row.createdBy}</div>
      </div>
      <div className="px-2 py-3">
        {row.feedbackIsLink ? (
          <a href="#" className="text-[#016162] hover:text-[#014a4b] font-medium underline inline items-center gap-1">
            {row.feedback} <ExternalLink className="w-[1em] h-[1em] inline align-baseline" />
          </a>
        ) : (
          <span className="text-text-muted">{row.feedback}</span>
        )}
      </div>
      <div className="px-2 py-3 flex items-center justify-center h-full">
        <StatusToggle enabled={row.status} onToggle={onToggleStatus} />
      </div>
    </>
  );

  if (isOverlay) {
    return (
      <div className={`grid ${GRID_COLS} text-sm text-text-primary border border-border-primary items-center h-[135px] bg-background shadow-lg scale-[1.01] rounded opacity-95`}>
        {content}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group/row grid ${GRID_COLS} text-sm text-text-primary border-b border-border-primary last:border-b-0 items-center h-[135px] transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] ${
        isDragging ? 'opacity-40 bg-muted/20' : 'hover:bg-muted/30'
      }`}
    >
      {content}
    </div>
  );
};

const RulesTabContent: React.FC = () => {
  const navigate = useNavigate();
  const [addedCount, setAddedCount] = useState(0);
  const allRows = rulesData.map(r => ({ ...r, status: getVariantStatus(r.name, r.status) }));
  const [rows, setRows] = useState<RulesRow[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Listen for status changes from edit page
  useEffect(() => {
    const handler = (e: Event) => {
      const { name, status } = (e as CustomEvent).detail;
      setRows(prev => prev.map(r => r.name === name ? { ...r, status } : r));
    };
    window.addEventListener('variant-status-change', handler);
    return () => window.removeEventListener('variant-status-change', handler);
  }, []);

  const handleAnalyze = useCallback((name: string) => {
    navigate(`/crm/chat/chatflows/analyze/${encodeURIComponent(name)}`);
  }, [navigate]);

  const handleEdit = useCallback((name: string) => {
    navigate(`/crm/chat/chatflows/edit/${encodeURIComponent(name)}`);
  }, [navigate]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;

    setRows(prev => {
      const oldIndex = prev.findIndex(r => r.id === active.id);
      const newIndex = prev.findIndex(r => r.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return prev;
      const newRows = [...prev];
      const [moved] = newRows.splice(oldIndex, 1);
      newRows.splice(newIndex, 0, moved);
      return newRows.map((r, i) => ({ ...r, priority: i + 1 }));
    });
  }, []);

  const handleCreateVariant = useCallback(() => {
    if (addedCount < allRows.length) {
      const nextRow = allRows[addedCount];
      setRows(prev => [...prev, { ...nextRow, priority: prev.length + 1 }]);
      setAddedCount(prev => prev + 1);
    }
  }, [addedCount, allRows]);

  const activeRow = activeId ? rows.find(r => r.id === activeId) : null;

  return (
    <div>
      <h2 className="text-[24px] font-light text-text-primary mb-2">Chatflows</h2>
      <p className="text-sm font-light text-text-secondary mb-8">
        Take personalization to the next level by customizing chat behavior for specific audiences, language, campaigns, content, and more. Chatflows override your default settings.
      </p>

      {/* Callout card */}
      <div className="bg-[#f5f8ff] border border-[#d0dfff] rounded-lg p-6 mb-8">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#0066ff]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Zap className="w-4 h-4 text-[#0066ff]" />
          </div>
          <div className="flex-1">
            <h3 className="text-[15px] font-semibold text-text-primary mb-1">
              Save time, get smarter, and skip chatflows altogether with Customer Agent.
            </h3>
            <p className="text-sm text-text-secondary font-light leading-relaxed mb-4">
              Customer Agent acts as your concierge, delivering personalized experiences for better outcomes. No chatflows necessary.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/customer-agent')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0066ff] text-white text-sm font-medium rounded-lg hover:bg-[#0052cc] transition-colors"
              >
                Check out Customer Agent
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              
            </div>
          </div>
        </div>
      </div>

      {/* Filters row */}
      <div className="flex items-center gap-3 mb-4 flex-wrap justify-between">
        <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <input
            type="text"
            placeholder="Search chat flows"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-border-primary rounded-full pl-3 pr-9 h-10 text-sm bg-background text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-border-secondary w-56"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        </div>
        <span className="text-sm text-text-secondary">Created by: <strong className="font-medium text-text-primary">All users</strong> <span className="inline-block w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent border-t-text-primary ml-1 align-middle" /></span>
        <span className="text-sm text-text-secondary">Status: <strong className="font-medium text-text-primary">All</strong> <span className="inline-block w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent border-t-text-primary ml-1 align-middle" /></span>
        </div>
        <button onClick={handleCreateVariant} className="px-4 py-2 text-[12px] font-light leading-[13px] text-white bg-[#141414] rounded hover:opacity-90 transition-opacity">
          Create chat flow
        </button>
      </div>

      <div className="border border-border-primary rounded overflow-x-auto">
          <div className="min-w-[900px]">
          {/* Header row */}
          <TooltipProvider delayDuration={200}>
            <div className={`grid ${GRID_COLS} bg-[rgb(245,245,245)] text-xs font-medium text-[#141414] border-b border-border-primary`}>
              <div className="px-2 py-3 flex items-center justify-center gap-1 border-r border-border-primary col-span-2">
                Priority
                <Tooltip>
                  <TooltipTrigger asChild><Info className="w-3 h-3" /></TooltipTrigger>
                  <TooltipContent className="bg-[#141414] text-white border-none max-w-[280px] text-xs font-light" side="bottom" hasArrow>
                    Drag and drop to reorder chatflows. If a visitor to your website matches more than one chatflow based on targeting settings, they will only see the one with the highest priority.
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="px-2 py-3 flex items-center border-r border-border-primary">Name</div>
              
              <div className="px-2 py-3 flex items-center border-r border-border-primary">Modified On</div>
              <div className="px-2 py-3 flex items-center border-r border-border-primary">Created On</div>
              <div className="px-2 py-3 flex items-center gap-1 border-r border-border-primary">
                Feedback Survey
                <Tooltip>
                  <TooltipTrigger asChild><Info className="w-3 h-3" /></TooltipTrigger>
                  <TooltipContent className="bg-[#141414] text-white border-none max-w-[280px] text-xs font-light" side="bottom" hasArrow>
                    Collect feedback from chat visitors. You can connect a CSAT survey to your chatflow and ask visitors for feedback when a chat conversation is closed. Visit the options tab within the chatflow to connect a survey.
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="px-2 py-3 flex items-center justify-center">Status</div>
            </div>
          </TooltipProvider>

      {rows.length === 0 ? (
        <div className="p-12 flex flex-col items-center justify-center text-center">
           <h3 className="text-[15px] font-semibold text-text-primary mb-1">No chat flows yet</h3>
           <p className="text-sm font-light text-text-secondary max-w-[380px]">
             Create your first chat flow to customize chat behavior for specific audiences, pages, or campaigns.
          </p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        >
          <SortableContext items={rows.map(r => r.id)} strategy={verticalListSortingStrategy}>
            {rows.map((row) => (
              <RulesTableRow
                key={row.id}
                row={row}
                onToggleStatus={() => {
                  const newStatus = !row.status;
                  setRows(prev => prev.map(r => r.id === row.id ? { ...r, status: newStatus } : r));
                  setVariantStatus(row.name, newStatus);
                }}
                onAnalyze={handleAnalyze}
                onEdit={handleEdit}
              />
            ))}
          </SortableContext>
          <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.25, 1, 0.5, 1)' }}>
            {activeRow ? (
              <RulesTableRow
                row={activeRow}
                onToggleStatus={() => {}}
                onAnalyze={() => {}}
                onEdit={() => {}}
                isOverlay
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
          </div>
        </div>
    </div>
  );
};

export default RulesTabContent;
