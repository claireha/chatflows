import React from 'react';
import { GripVertical, Sparkles, ExternalLink, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { StatusToggle } from '@/components/StatusToggle';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';


export interface ChatflowRow {
  id: number;
  priority: number;
  name: string;
  inbox: string;
  type: string;
  modifiedOn: string;
  modifiedBy: string;
  createdOn: string;
  createdBy: string;
  feedback: string;
  status: boolean;
  feedbackIsLink?: boolean;
  hasAiBadge?: boolean;
}

interface ChatflowTableRowProps {
  row: ChatflowRow;
  onToggleStatus: () => void;
  isOverlay?: boolean;
}

const GRID_COLS = 'grid-cols-[40px_60px_1fr_100px_100px_140px_140px_180px_130px]';

export const ChatflowTableRow: React.FC<ChatflowTableRowProps> = ({ row, onToggleStatus, isOverlay }) => {
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

  if (isOverlay) {
    return (
      <div
        className={`grid ${GRID_COLS} text-sm text-text-primary border border-border-primary items-center h-[135px] bg-background shadow-lg scale-[1.01] rounded opacity-95`}
      >
        <RowContent row={row} onToggleStatus={onToggleStatus} dragListeners={{}} dragAttributes={{}} isDragHandle />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group grid ${GRID_COLS} text-sm text-text-primary border-b border-border-primary last:border-b-0 items-center h-[135px] transition-[transform,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] ${
        isDragging ? 'opacity-40 bg-muted/20' : 'hover:bg-[#f5f5f5]'
      }`}
    >
      <RowContent
        row={row}
        onToggleStatus={onToggleStatus}
        dragListeners={listeners}
        dragAttributes={attributes}
        isDragHandle={false}
        isDragging={isDragging}
      />
    </div>
  );
};


interface RowContentProps {
  row: ChatflowRow;
  onToggleStatus: () => void;
  dragListeners: any;
  dragAttributes: any;
  isDragHandle: boolean;
  isDragging?: boolean;
}

const RowContent: React.FC<RowContentProps> = ({ row, onToggleStatus, dragListeners, dragAttributes, isDragHandle, isDragging }) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  return (
  <>
    <div
      className="px-2 py-3 flex items-center justify-center cursor-grab active:cursor-grabbing"
      {...(isDragHandle ? {} : dragListeners)}
      {...(isDragHandle ? {} : dragAttributes)}
    >
      <GripVertical className={`w-4 h-4 transition-colors duration-150 ${isDragging ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'}`} />
    </div>
    <div className="px-2 py-3">{row.priority}</div>
    <div className="px-2 py-3 relative min-w-0">
      <div className="flex items-center gap-2 min-w-0">
        {row.hasAiBadge && (
          <span className="inline-flex items-center gap-0.5 text-white text-[10px] font-light px-1.5 py-0.5 rounded shrink-0" style={{ background: 'linear-gradient(to right, #f70b50, #d70781)' }}>
            <Sparkles className="w-2.5 h-2.5" />
            AI
          </span>
        )}
        <span className="truncate">{row.name}</span>
      </div>
      <div className={`absolute inset-y-0 left-2 right-2 flex bg-[#f5f5f5] items-center gap-2 pointer-events-none ${menuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        <span className="truncate max-w-[20px] text-text-primary">{row.name}</span>
        <div className={`flex items-center gap-2 ${menuOpen ? 'pointer-events-auto' : 'pointer-events-none group-hover:pointer-events-auto'}`}>
          <Link to={`/chatflows/edit/${encodeURIComponent(row.name)}`} className="px-3 py-1 rounded-full border border-text-primary bg-background text-sm font-light hover:bg-surface-secondary">Edit</Link>
          <button className="px-3 py-1 rounded-full border border-text-primary bg-background text-sm font-light hover:bg-surface-secondary">Details</button>
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-text-primary bg-background text-sm font-light hover:bg-surface-secondary">
                More
                <ChevronDown className="w-3 h-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[240px] rounded-xl p-0 py-2 bg-background border border-border-primary shadow-lg z-50">

              {['Clone', 'Delete', 'Set custom priority', 'Move to bottom priority'].map((label) => (
                <DropdownMenuItem key={label} className="px-4 py-2.5 text-sm font-light text-text-primary cursor-pointer rounded-none focus:bg-surface-secondary">
                  {label}
                </DropdownMenuItem>
              ))}
              <div className="my-2 border-t border-border-primary" />
              <DropdownMenuItem className="px-4 py-2.5 text-sm font-light text-text-primary cursor-pointer rounded-none focus:bg-surface-secondary">
                Go to help desk settings
                <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>
    </div>

    <div className="px-2 py-3">{row.inbox}</div>
    <div className="px-2 py-3">{row.type}</div>
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
    <div className="px-2 py-3 flex items-center justify-center">
      <StatusToggle enabled={row.status} onToggle={onToggleStatus} />
    </div>
  </>
  );
};


export default ChatflowTableRow;
