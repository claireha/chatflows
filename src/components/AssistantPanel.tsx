import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { X, MoreHorizontal, Folder, Maximize2, Minimize2, Paperclip, Bookmark, AtSign, ArrowUp, RotateCcw, ChevronLeft, ChevronRight, ChevronDown, Calendar, Search, Plus, SquarePen, CircleCheck, ExternalLink, Pencil, ArrowUpDown, Save, Bold, Italic, Underline, Link2, Image as ImageIcon, Mail, ThumbsUp, ThumbsDown, Copy } from 'lucide-react';
import { AppsModal } from './AppsModal';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

type PromptSet = { summarize: string[]; create: string[]; howto: string[] };

const PAGE_PROMPTS: Record<string, PromptSet> = {
  '/chatflows': {
    summarize: [
      'Summarize the list of existing chatflows.',
      'Provide a brief overview of chatflow types and statuses.',
      'Summarize the recent activity on chatflows.',
    ],
    create: [
      'Generate a new chatflow for customer support',
      'Create a mobile chatflow for on-the-go engagement',
      'Build a Facebook Messenger chatflow for social media',
    ],
    howto: [
      "How do I create a new chatflow from the 'Create chatflow' button?",
      'How do I toggle the ON/OFF status of a chatflow?',
      'How do I search for specific chatflows using the search bar?',
    ],
  },
  '/': {
    summarize: [
      'Summarize what needs my attention today.',
      'Give me a quick overview of recent activity across my workspace.',
      'Summarize open tickets assigned to me.',
    ],
    create: [
      'Create a new ticket from a recent customer email.',
      'Draft a quick reply to my most recent conversation.',
      'Create a follow-up task for an unresolved chat.',
    ],
    howto: [
      'How do I customize what shows up on my home dashboard?',
      'How do I pin frequently used tools to my workspace?',
      'How do I see notifications I may have missed?',
    ],
  },
  '/settings': {
    summarize: [
      'Summarize my current Service Hub settings.',
      'Give an overview of recent settings changes.',
      'Summarize which integrations are currently enabled.',
    ],
    create: [
      'Create a new inbox for a support team.',
      'Set up a new automated ticket assignment rule.',
      'Create a new business hours schedule.',
    ],
    howto: [
      'How do I add a new user and assign permissions?',
      'How do I connect a new email channel?',
      'How do I change notification preferences for my team?',
    ],
  },
  '/customer-agent': {
    summarize: [
      "Summarize my customer agent's current configuration.",
      'Summarize recent conversations the agent has handled.',
      'Give an overview of agent performance this week.',
    ],
    create: [
      'Create a new use case for the customer agent.',
      'Draft a custom greeting for the customer agent.',
      'Create a new escalation rule for the agent.',
    ],
    howto: [
      "How do I change the customer agent's tone of voice?",
      'How do I let the agent hand off conversations to a human?',
      'How do I add knowledge sources for the agent to reference?',
    ],
  },
  '/crm/chat': {
    summarize: [
      'Summarize recent CRM chat conversations.',
      'Give an overview of chat volume by channel.',
      'Summarize unresolved chats from the past 24 hours.',
    ],
    create: [
      'Create a new chat channel for live support.',
      'Draft a welcome message for new visitors.',
      'Create a chat routing rule for VIP customers.',
    ],
    howto: [
      'How do I install the chat widget on my website?',
      'How do I customize the chat widget appearance?',
      'How do I route chats to specific teammates?',
    ],
  },
  '/help-desk': {
    summarize: [
      'Summarize open tickets by priority.',
      "Give an overview of today's ticket activity.",
      "Summarize my team's response times this week.",
    ],
    create: [
      'Create a new ticket from a customer issue.',
      'Draft a reply to the oldest unanswered ticket.',
      'Create a saved view for unresolved high-priority tickets.',
    ],
    howto: [
      'How do I assign a ticket to a teammate?',
      'How do I set up a ticket pipeline?',
      'How do I create a custom ticket status?',
    ],
  },
  '/contacts': {
    summarize: [
      'Summarize my most recently added contacts.',
      "Give an overview of contacts by lifecycle stage.",
      'Summarize contacts that need follow-up.',
    ],
    create: [
      'Create a new contact record.',
      'Create a contact list for a marketing campaign.',
      'Draft an outreach email to a recent contact.',
    ],
    howto: [
      'How do I import contacts from a CSV file?',
      'How do I merge duplicate contacts?',
      'How do I create a custom contact property?',
    ],
  },
  '/knowledge-base': {
    summarize: [
      'Summarize the most viewed knowledge base articles.',
      'Give an overview of articles by category.',
      'Summarize articles that may need updating.',
    ],
    create: [
      'Create a new knowledge base article.',
      'Draft a how-to article from a common support question.',
      'Create a new category to organize articles.',
    ],
    howto: [
      'How do I publish a new knowledge base article?',
      'How do I share an article with my chat or email reply?',
      'How do I track which articles solve customer issues?',
    ],
  },
};

const matchPagePrompts = (pathname: string): PromptSet | null => {
  if (PAGE_PROMPTS[pathname]) return PAGE_PROMPTS[pathname];
  // Match by longest prefix
  const keys = Object.keys(PAGE_PROMPTS)
    .filter((k) => k !== '/' && pathname.startsWith(k))
    .sort((a, b) => b.length - a.length);
  return keys[0] ? PAGE_PROMPTS[keys[0]] : null;
};

const prettifyPath = (p: string) => {
  const seg = p.replace(/^\/+|\/+$/g, '').split('/')[0] || 'home';
  return seg.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

type MetricCard = { title: string; filters: string[]; label: string; value: string };
type TableRow = { id: string; cells: (string | { link: string })[] };

const FeedbackBar: React.FC = () => (
  <div className="flex items-center gap-1 text-text-secondary">
    <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted/40" aria-label="Good response"><ThumbsUp className="w-4 h-4" strokeWidth={1.5} /></button>
    <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted/40" aria-label="Bad response"><ThumbsDown className="w-4 h-4" strokeWidth={1.5} /></button>
    <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted/40" aria-label="Copy"><Copy className="w-4 h-4" strokeWidth={1.5} /></button>
  </div>
);

type ChatBlock =
  | { type: 'user'; text: string }
  | { type: 'text'; text: string }
  | { type: 'rich'; segments: ({ kind: 'text'; text: string } | { kind: 'mention'; label: string } | { kind: 'bold'; text: string })[] }
  | { type: 'heading'; text: string }
  | { type: 'subheading'; text: string }
  | { type: 'step'; label: string; substeps: string[] }
  | { type: 'metrics'; cards: MetricCard[] }
  | { type: 'table'; title: string; filters: string[]; columns: string[]; rows: TableRow[] }
  | { type: 'meetings-cta' }
  | { type: 'label'; text: string }
  | { type: 'badge'; text: string }
  | { type: 'artifact-card'; title: string; version: string }
  | { type: 'feedback' };

const TICKET_ROWS: TableRow[] = [
  { id: 'test', cells: [{ link: 'test' }, { link: 'test' }, 'New (Support Pipeline)', '8/19/2024'] },
  { id: 'test ticket', cells: [{ link: 'test ticket' }, { link: 'test ticket' }, 'New (Support Pipeline)', '10/24/2024'] },
  { id: 'New form channel connected', cells: [{ link: 'New form channel connected' }, { link: 'New form channel connected' }, 'New (Support Pipeline)', '2/28/2025'] },
  { id: 'Change Password ticket', cells: [{ link: 'Change Password ticket' }, { link: 'Change Password ticket' }, 'New (Support Pipeline)', '5/6/2025'] },
  { id: 'Need refund ticket', cells: [{ link: 'Need refund ticket' }, { link: 'Need refund ticket' }, 'New (Support Pipeline)', '5/6/2025'] },
  { id: 'Billing error', cells: [{ link: 'Billing error' }, { link: 'Billing error' }, 'New (Support Pipeline)', '5/6/2025'] },
  { id: 'T1', cells: [{ link: 'Ticket #43567871401' }, { link: 'Ticket #43567871401' }, 'New (Support Pipeline)', '3/23/2025'] },
  { id: 'T2', cells: [{ link: 'Ticket #43856517389' }, { link: 'Ticket #43856517389' }, 'New (Support Pipeline)', '3/27/2025'] },
  { id: 'T3', cells: [{ link: 'Ticket #44286146223' }, { link: 'Ticket #44286146223' }, 'New (Support Pipeline)', '4/8/2025'] },
  { id: 'T4', cells: [{ link: 'Ticket #44494190615' }, { link: 'Ticket #44494190615' }, 'New (Support Pipeline)', '4/15/2025'] },
  { id: 'T5', cells: [{ link: 'Ticket #45630538556' }, { link: 'Ticket #45630538556' }, 'New (Support Pipeline)', '5/28/2025'] },
];

const CARRYOVER_ROWS: TableRow[] = [
  { id: 'c1', cells: [{ link: 'Prepare appointment materials' }, 'Prepare appointment materials', 'Not Started', 'Aug 24, 2022'] },
  { id: 'c2', cells: [{ link: 'Prepare appointment materials' }, 'Prepare appointment materials', 'Not Started', 'Aug 24, 2022'] },
  { id: 'c3', cells: [{ link: 'Prepare appointment materials' }, 'Prepare appointment materials', 'Not Started', 'Oct 24, 2022'] },
  { id: 'c4', cells: [{ link: 'email kiona' }, 'email kiona', 'Not Started', 'Nov 15, 2023'] },
  { id: 'c5', cells: [{ link: 'Prepare appointment materials' }, 'Prepare appointment materials', 'Not Started', 'Feb 23, 2024'] },
];

const CHAT_SCRIPTS: Record<string, ChatBlock[]> = {
  'Summarize open tickets for today': [
    { type: 'user', text: 'Can you help me summarize my open tickets and things to do today?' },
    { type: 'text', text: "I'll pull your current open support work and today's actionable items, then I'll give you a concise summary with any priorities or gaps I spot." },
    { type: 'step', label: 'Checked HubSpot setup and 2 more', substeps: ['Loaded tools', 'Searched HubSpot data', 'Checked HubSpot setup'] },
    { type: 'text', text: "I've confirmed the right record types and your owner ID, and I'm querying both your assigned open tickets and anything due today so I can separate support backlog from today's action list." },
    { type: 'step', label: 'Queried HubSpot data and 3 more', substeps: ['Queried HubSpot data', 'Queried HubSpot data', 'Queried HubSpot data', 'Queried HubSpot data'] },
    { type: 'text', text: "I found 11 tickets assigned to you and, so far, no tasks with a due date set for today—I'm checking the status labels so I can summarize that cleanly rather than showing internal values." },
    { type: 'step', label: 'Queried HubSpot data and 3 more', substeps: ['Checked HubSpot setup', 'Checked HubSpot setup', 'Queried HubSpot data', 'Queried HubSpot data'] },
    { type: 'text', text: 'I confirmed there aren\u2019t any tasks actually due today, but you do have a small overdue task backlog, so I\u2019m packaging this as a "today" snapshot with open support work plus carryover items.' },
    { type: 'step', label: 'Queried HubSpot data', substeps: ['Queried HubSpot data'] },
    { type: 'text', text: 'Here\u2019s your current snapshot: your day is dominated by ticket backlog rather than scheduled tasks, and the main action gap is that none of your work is explicitly due today. If you want, I can next sort these into a practical priority order for today\u2014oldest tickets first, likely quick wins, or customer-facing urgency.' },
    { type: 'heading', text: "Today's support snapshot" },
    { type: 'subheading', text: 'As of Jun 5, 2026' },
    { type: 'text', text: 'You have open ticket backlog assigned to you, no tasks due today, and a small set of overdue tasks that are the most likely carryover actions for today.' },
    {
      type: 'metrics',
      cards: [
        { title: 'Open tickets', filters: ['All time', 'Filters (2)'], label: '(COUNT) TICKETS', value: '11' },
        { title: 'Tasks due today', filters: ['From 6/5/2026 to 6/5/2026', 'Filters (2)'], label: '(COUNT) TASKS', value: '0' },
        { title: 'Overdue open tasks', filters: ['Before 6/5/2026', 'Filters (2)'], label: '(COUNT) TASKS', value: '5' },
      ],
    },
    {
      type: 'table',
      title: 'Your open tickets',
      filters: ['All time', 'Filters (2)'],
      columns: ['Record ID', 'Ticket name', 'Ticket status', 'Create date'],
      rows: TICKET_ROWS,
    },
    {
      type: 'table',
      title: 'Carryover tasks to tackle today',
      filters: ['Before 6/5/2026', 'Filters (2)'],
      columns: ['Record ID', 'Task Title', 'Task Status', 'Due date'],
      rows: CARRYOVER_ROWS,
    },
  ],
  'Draft reply to VIP customer escalation': [
    { type: 'user', text: 'I have to escalate to my manager that the Collectors Den wants to churn. Can you help me craft the email?' },
    { type: 'text', text: "I\u2019ll pull together the relevant context on Collectors Den first, then I\u2019ll draft a concise escalation email you can send to your manager." },
    { type: 'step', label: 'Read uploaded file and 1 more', substeps: ['Loaded tools', 'Read uploaded file'] },
    { type: 'text', text: "I\u2019ve confirmed this should be delivered as an editable email draft, and I\u2019m now gathering any CRM context we have on Collectors Den so the escalation is grounded in specifics." },
    { type: 'label', text: 'Researched' },
    { type: 'meetings-cta' },
    { type: 'text', text: "I found a solid CRM-backed case for the escalation: there\u2019s a recent closed-won deal plus positive momentum, but it\u2019s offset by multiple support issues, supply/fulfillment strain, and competitor pricing pressure." },
    { type: 'label', text: 'Generated artifact' },
    {
      type: 'rich',
      segments: [
        { kind: 'text', text: 'I drafted the escalation email and grounded it in the CRM signals I found for ' },
        { kind: 'mention', label: "The Collector\u2019s Den" },
        { kind: 'text', text: ': recent issue volume, competitor pricing pressure, and possible post-sale follow-through gaps, while also acknowledging the earlier positive momentum.' },
      ],
    },
    { type: 'badge', text: '1' },
    {
      type: 'rich',
      segments: [
        { kind: 'text', text: "You\u2019ll probably want to replace " },
        { kind: 'bold', text: '[Manager Name]' },
        { kind: 'text', text: " before sending. If you share your manager\u2019s name or email, I can update the draft and make the tone sharper or more urgent." },
      ],
    },
    { type: 'artifact-card', title: 'Escalation email draft: Collectors Den churn risk', version: 'v1' },
    
  ],
};

const ChatConversation: React.FC<{
  title: string;
  expandedSteps: Record<number, boolean>;
  setExpandedSteps: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
}> = ({ title, expandedSteps, setExpandedSteps }) => {
  const blocks = CHAT_SCRIPTS[title];
  if (!blocks) {
    return (
      <div className="text-[14px] font-light text-text-secondary mt-4">
        This conversation has no saved transcript yet.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-5">
      {blocks.map((block, i) => {
        if (block.type === 'user') {
          return (
            <div key={i} className="flex justify-end">
              <div className="max-w-[80%] bg-[hsl(var(--muted)/0.5)] rounded-2xl px-4 py-3 text-[14px] font-light text-text-primary">
                {block.text}
              </div>
            </div>
          );
        }
        if (block.type === 'step') {
          const open = !!expandedSteps[i];
          return (
            <div key={i} className="flex flex-col gap-2">
              <button
                onClick={() => setExpandedSteps((s) => ({ ...s, [i]: !s[i] }))}
                className="flex items-center gap-2 text-[13px] font-light text-text-secondary hover:text-text-primary"
              >
                <ChevronRight className={`w-4 h-4 transition-transform ${open ? 'rotate-90' : ''}`} />
                <span>{block.label}</span>
              </button>
              {open && (
                <ul className="flex flex-col pl-6">
                  {block.substeps.map((s, j) => (
                    <li key={j} className="relative flex items-center gap-2 text-[13px] font-light text-text-secondary py-1">
                      <CircleCheck className="w-4 h-4 text-text-tertiary" strokeWidth={1.5} />
                      {j < block.substeps.length - 1 && (
                        <span className="absolute left-[7px] top-[26px] bottom-[-4px] w-px bg-border" />
                      )}
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        }
        if (block.type === 'heading') {
          return <h3 key={i} className="text-[18px] font-semibold text-text-primary mt-2">{block.text}</h3>;
        }
        if (block.type === 'subheading') {
          return <p key={i} className="text-[14px] font-semibold text-text-primary -mt-3">{block.text}</p>;
        }
        if (block.type === 'metrics') {
          return (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {block.cards.map((c, j) => (
                <div key={j} className="border border-border rounded-lg p-4 flex flex-col gap-3 bg-background">
                  <div className="text-[14px] font-semibold text-text-primary">{c.title}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {c.filters.map((f, k) => (
                      <span key={k} className="px-2 py-0.5 rounded-full bg-muted text-[11px] font-semibold text-text-primary">{f}</span>
                    ))}
                  </div>
                  <div className="flex flex-col items-center gap-1 py-2 border-b border-border">
                    <div className="text-[10px] font-semibold tracking-wider text-text-primary">{c.label}</div>
                    <div className="text-[32px] font-light text-text-primary leading-none">{c.value}</div>
                    <div className="h-1 w-3/4 bg-muted rounded-full mt-2" />
                  </div>
                  <div className="flex gap-2 justify-center">
                    <button className="flex items-center gap-1.5 text-[12px] font-light text-text-primary border border-border rounded-full px-3 py-1 hover:bg-muted">
                      <Save className="w-3.5 h-3.5" /> Save
                    </button>
                    <button className="flex items-center gap-1.5 text-[12px] font-light text-text-primary border border-border rounded-full px-3 py-1 hover:bg-muted">
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          );
        }
        if (block.type === 'table') {
          return (
            <div key={i} className="border border-border rounded-lg p-4 flex flex-col gap-3 bg-background">
              <div className="text-[15px] font-semibold text-text-primary">{block.title}</div>
              <div className="flex flex-wrap gap-1.5">
                {block.filters.map((f, k) => (
                  <span key={k} className="px-2 py-0.5 rounded-full bg-muted text-[11px] font-semibold text-text-primary">{f}</span>
                ))}
              </div>
              <div className="overflow-x-auto border border-border rounded">
                <table className="w-full text-[13px] font-light">
                  <thead className="bg-muted">
                    <tr>
                      {block.columns.map((col, k) => (
                        <th key={k} className="text-left px-3 py-2 font-semibold text-text-primary whitespace-nowrap">
                          <span className="inline-flex items-center gap-1">{col} <ArrowUpDown className="w-3 h-3" /></span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, r) => (
                      <tr key={row.id} className="border-t border-border">
                        {row.cells.map((cell, k) => (
                          <td key={k} className="px-3 py-2 whitespace-nowrap">
                            {typeof cell === 'string' ? (
                              <span className="text-text-primary">{cell}</span>
                            ) : (
                              <a href="#" className="inline-flex items-center gap-1 text-primary font-semibold hover:underline">
                                {cell.link} <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-2 justify-end">
                <button className="flex items-center gap-1.5 text-[12px] font-light text-text-primary border border-border rounded-full px-3 py-1 hover:bg-muted">
                  <Save className="w-3.5 h-3.5" /> Save
                </button>
                <button className="flex items-center gap-1.5 text-[12px] font-light text-text-primary border border-border rounded-full px-3 py-1 hover:bg-muted">
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
              </div>
            </div>
          );
        }
        if (block.type === 'text') {
          return (
            <div key={i} className="flex flex-col gap-2">
              <p className="text-[14px] font-light text-text-primary leading-relaxed">
                {block.text}
              </p>
              <FeedbackBar />
            </div>
          );
        }
        if (block.type === 'rich') {
          return (
            <div key={i} className="flex flex-col gap-2">
              <p className="text-[14px] font-light text-text-primary leading-relaxed">
                {block.segments.map((s, j) => {
                  if (s.kind === 'mention') {
                    return (
                      <span key={j} className="inline-flex items-center gap-1 px-1.5 py-0.5 mx-0.5 rounded bg-muted text-[13px] font-light text-text-primary">
                        <span className="inline-flex items-center justify-center w-4 h-4 rounded-sm bg-[#ff7a59] text-white text-[10px] font-semibold">h</span>
                        {s.label}
                      </span>
                    );
                  }
                  if (s.kind === 'bold') {
                    return <strong key={j} className="font-semibold">{s.text}</strong>;
                  }
                  return <span key={j}>{s.text}</span>;
                })}
              </p>
              <FeedbackBar />
            </div>
          );
        }
        if (block.type === 'label') {
          return <div key={i} className="text-[13px] font-light text-text-secondary">{block.text}</div>;
        }
        if (block.type === 'badge') {
          return (
            <div key={i}>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-muted text-[12px] font-light text-text-primary">{block.text}</span>
            </div>
          );
        }
        if (block.type === 'meetings-cta') {
          return (
            <div key={i} className="flex flex-col gap-3">
              <h3 className="text-[16px] font-semibold text-text-primary">Prepare for meetings</h3>
              <p className="text-[14px] font-light text-text-primary leading-relaxed">
                Connect your calendar to see meetings and prepare with context from your CRM
              </p>
              <button className="self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#1a1a1a] text-white text-[13px] font-light hover:opacity-90">
                Connect <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        }
        if (block.type === 'artifact-card') {
          return (
            <button key={i} className="flex items-center gap-3 px-4 py-3 border border-border-primary rounded-xl text-left hover:bg-[hsl(var(--muted)/0.3)]">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-text-secondary">
                <Mail className="w-4 h-4" />
              </div>
              <div className="flex-1 text-[14px] font-semibold text-text-primary truncate">
                {block.title}
              </div>
              <span className="text-[13px] font-light text-text-secondary">{block.version}</span>
            </button>
          );
        }
        if (block.type === 'feedback') {
          return (
            <div key={i} className="flex items-center gap-3 text-text-secondary">
              <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted/40"><ThumbsUp className="w-4 h-4" /></button>
              <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted/40"><ThumbsDown className="w-4 h-4" /></button>
              <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted/40"><Copy className="w-4 h-4" /></button>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

const ESCALATION_CHAT = 'Draft reply to VIP customer escalation';

const EmailDraftView: React.FC = () => {
  const [showFields, setShowFields] = useState(false);
  return (
    <div className="flex-1 flex flex-col overflow-hidden border-l border-border-primary">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border-primary">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1 text-[13px] font-light text-text-primary hover:text-text-secondary">
            v1 <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <h3 className="text-[15px] font-semibold text-text-primary">
            Escalation email draft: Collectors Den churn risk
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-stretch rounded-md border border-border-primary overflow-hidden">
            <button
              onClick={() => setShowFields(true)}
              className="px-3 py-1.5 text-[13px] font-light text-text-primary hover:bg-muted/40"
            >
              Send email
            </button>
            <div className="w-px bg-border-primary" />
            <button className="px-2 flex items-center text-text-secondary hover:bg-muted/40">
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
          <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted/40 text-text-secondary">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {showFields && (
          <div className="px-8 pt-6 flex flex-col gap-4 text-[14px]">
            <div className="flex items-center gap-3 pb-3 border-b border-border-primary">
              <span className="text-text-secondary w-12">To:</span>
              <input
                placeholder="Enter or choose an email address"
                className="flex-1 outline-none bg-transparent text-text-primary placeholder:text-text-muted"
              />
              <button className="text-[13px] font-light underline" style={{ color: '#006162' }}>Cc</button>
              <button className="text-[13px] font-light underline" style={{ color: '#006162' }}>Bcc</button>
            </div>
            <div className="flex items-center gap-3 pb-3 border-b border-border-primary">
              <span className="text-text-secondary w-12">From:</span>
              <span className="text-text-primary font-semibold">Claire Ha (cha@hubspot.com)</span>
            </div>
            <div className="flex items-center gap-3 pb-3 border-b border-border-primary">
              <span className="text-text-secondary w-16">Subject:</span>
              <span className="text-text-primary font-semibold">Escalation: Collectors Den at churn risk</span>
            </div>
          </div>
        )}
        <div className="px-8 py-6 flex flex-col gap-4 text-[14px] font-light text-text-primary leading-relaxed">
          <p>Hi [Manager Name],</p>
          <p>I wanted to flag that Collectors Den appears to be at risk of churning and I think this needs immediate attention.</p>
          <p>While there were positive signs recently — including a closed-won deal and indications that budget had been approved to move forward — the overall account pattern now suggests elevated risk. We're seeing several customer issues clustered around the account, including damaged items, wrong items in an order, missing items from a shipment, and broader quality concerns. In addition, prior conversations point to competitor pricing pressure, and there may also be some post-sale follow-through gaps that are contributing to the situation. My concern is that the account had momentum, but the customer experience after the sale may not be matching expectations. Given that they are already a current customer, this feels less like a routine support issue and more like a retention risk that could impact expansion and overall account health.</p>
          <p>Could you help me align on an escalation path and save plan? I'd recommend we quickly review:</p>
          <ul className="list-disc pl-8 flex flex-col gap-1">
            <li>the open customer issues and whether there is a clear remediation owner,</li>
            <li>any unresolved post-sale follow-up items,</li>
            <li>the renewal/retention strategy and timeline, and</li>
            <li>whether we should involve additional leadership or service support in outreach.</li>
          </ul>
          <p>If helpful, I can also pull together a short account timeline and proposed next steps before we reach out more broadly.</p>
          <p>Thanks,<br />Claire</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="border-t border-border-primary px-6 py-3 flex items-center gap-4 text-text-secondary">
        <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted/40"><Bold className="w-4 h-4" /></button>
        <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted/40"><Italic className="w-4 h-4" /></button>
        <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted/40"><Underline className="w-4 h-4" /></button>
        <button className="flex items-center gap-1 text-[13px] font-light text-text-primary hover:text-text-secondary">More <ChevronDown className="w-3.5 h-3.5" /></button>
        <div className="w-px h-5 bg-border-primary" />
        <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted/40"><Link2 className="w-4 h-4" /></button>
        <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted/40"><ImageIcon className="w-4 h-4" /></button>
        <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted/40"><Paperclip className="w-4 h-4" /></button>
        <button className="ml-auto flex items-center gap-1 text-[13px] font-light text-text-primary hover:text-text-secondary">Insert <ChevronDown className="w-3.5 h-3.5" /></button>
      </div>

      {/* Footer task */}
      <div className="border-t border-border-primary px-6 py-3 flex items-center gap-2 text-[13px] font-light text-text-primary">
        <input type="checkbox" className="w-4 h-4 rounded border-border-primary" />
        <span>Create a</span>
        <button className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-border-primary hover:bg-muted/40">
          To-do <ChevronDown className="w-3 h-3" />
        </button>
        <span>task to follow up</span>
        <button className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-border-primary hover:bg-muted/40 font-semibold">
          In 3 business days (Wednesday) <ChevronDown className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};



interface AssistantPanelProps {
  open: boolean;
  onClose: () => void;
}

export const AssistantPanel: React.FC<AssistantPanelProps> = ({ open, onClose }) => {
  const [text, setText] = useState('');
  const [activeMenu, setActiveMenu] = useState<null | 'summarize' | 'create' | 'howto'>(null);
  const [appsOpen, setAppsOpen] = useState(false);
  const [attachOpen, setAttachOpen] = useState(false);
  const [bookmarkOpen, setBookmarkOpen] = useState(false);
  const [meetingsOpen, setMeetingsOpen] = useState(false);
  const [folderOpen, setFolderOpen] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [navExpanded, setNavExpanded] = useState(() => localStorage.getItem('nav-expanded') !== 'false');
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({});
  const [liveMessages, setLiveMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [liveLoading, setLiveLoading] = useState(false);
  const liveScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    liveScrollRef.current?.scrollTo({ top: liveScrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [liveMessages]);

  const sendLiveMessage = async (input: string) => {
    const trimmed = input.trim();
    if (!trimmed || liveLoading) return;
    const next = [...liveMessages, { role: 'user' as const, content: trimmed }];
    setLiveMessages(next);
    setText('');
    setActiveChat('__live__');
    setLiveLoading(true);
    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/breeze-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: next }),
      });
      if (resp.status === 429) { toast.error('Rate limit reached. Please try again shortly.'); setLiveLoading(false); return; }
      if (resp.status === 402) { toast.error('Workspace credits exhausted. Please add credits.'); setLiveLoading(false); return; }
      if (!resp.ok || !resp.body) { toast.error('Failed to reach assistant.'); setLiveLoading(false); return; }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';
      let assistant = '';
      setLiveMessages((p) => [...p, { role: 'assistant', content: '' }]);
      let done = false;
      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf('\n')) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const json = line.slice(6).trim();
          if (json === '[DONE]') { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistant += delta;
              setLiveMessages((p) => {
                const copy = [...p];
                copy[copy.length - 1] = { role: 'assistant', content: assistant };
                return copy;
              });
            }
          } catch {
            buf = line + '\n' + buf;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      toast.error('Something went wrong.');
    } finally {
      setLiveLoading(false);
    }
  };

  useEffect(() => {
    const check = () => setNavExpanded(localStorage.getItem('nav-expanded') !== 'false');
    window.addEventListener('storage', check);
    const interval = setInterval(check, 300);
    return () => { window.removeEventListener('storage', check); clearInterval(interval); };
  }, []);

  const today = new Date();
  const baseSunday = new Date(today);
  baseSunday.setDate(today.getDate() - today.getDay() + weekOffset * 7);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(baseSunday);
    d.setDate(baseSunday.getDate() + i);
    return d;
  });
  const activeDate = weekOffset === 0 ? today : weekDays[0];
  const dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const headerDate = activeDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const location = useLocation();
  const isChatflows = location.pathname === '/chatflows';
  const pageName = prettifyPath(location.pathname);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuTriggersRef = useRef<HTMLDivElement>(null);
  const [aiPrompts, setAiPrompts] = useState<Record<string, string[]>>({});
  const [loadingPrompts, setLoadingPrompts] = useState(false);

  // Reset AI cache when route changes
  useEffect(() => { setAiPrompts({}); }, [location.pathname]);

  const toggle = (key: 'summarize' | 'create' | 'howto') => {
    setMeetingsOpen(false);
    setActiveMenu(prev => (prev === key ? null : key));
  };

  // Fetch AI-generated prompts as fallback when no hardcoded set exists for this page
  useEffect(() => {
    if (!activeMenu) return;
    if (matchPagePrompts(location.pathname)) return;
    const cacheKey = `${location.pathname}:${activeMenu}`;
    if (aiPrompts[cacheKey]) return;
    let cancelled = false;
    setLoadingPrompts(true);
    supabase.functions
      .invoke('generate-prompts', { body: { page: pageName, category: activeMenu } })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data?.prompts?.length) {
          setAiPrompts(p => ({ ...p, [cacheKey]: [] }));
        } else {
          setAiPrompts(p => ({ ...p, [cacheKey]: data.prompts }));
        }
      })
      .finally(() => { if (!cancelled) setLoadingPrompts(false); });
    return () => { cancelled = true; };
  }, [activeMenu, location.pathname, pageName, aiPrompts]);


  useEffect(() => {
    if (!activeMenu) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuRef.current?.contains(target)) return;
      if (menuTriggersRef.current?.contains(target)) return;
      setActiveMenu(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [activeMenu]);


  if (!open) return null;

  return (
    <aside
      className="fixed right-0 z-40 bg-background flex flex-col font-lexend transition-[width] duration-300 ease-out"
      style={{ top: 'var(--toolbar-height)', bottom: 0, width: maximized ? `calc(100vw - ${navExpanded ? 240 : 80}px)` : 420, border: '1px solid #ff4800' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-primary">
        {activeChat ? (
          <button
            onClick={() => { setActiveChat(null); setLiveMessages([]); }}
            className="flex items-center gap-1 text-[15px] font-medium text-text-primary hover:text-text-secondary"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        ) : (
          <button className="text-[15px] font-medium underline underline-offset-4 decoration-1" style={{ color: '#006162' }}>
            Add assistant
          </button>
        )}
        <div className="flex items-center gap-1 text-text-secondary">
          <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted/40" aria-label="More">
            <MoreHorizontal className="w-4 h-4" />
          </button>
          <div className="relative">
            <button onClick={() => activeChat ? (setActiveChat(null), setLiveMessages([])) : setFolderOpen(v => !v)} className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted/40" aria-label={activeChat ? 'New chat' : 'Projects'}>
              {activeChat ? <SquarePen className="w-4 h-4" /> : <Folder className="w-4 h-4" />}
            </button>
            {folderOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setFolderOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-[200px] bg-background border border-border-primary rounded-xl shadow-lg overflow-hidden z-20">
                  {['Chats', 'Prompts', 'Memories'].map((label) => (
                    <button
                      key={label}
                      onClick={() => setFolderOpen(false)}
                      className="block w-full text-left px-5 py-4 text-[14px] font-light text-text-primary hover:bg-[hsl(var(--muted)/0.4)]"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <button onClick={() => setMaximized(v => !v)} className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted/40" aria-label={maximized ? 'Minimize' : 'Expand'}>
            {maximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted/40" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        {maximized && activeChat !== ESCALATION_CHAT && (
          <div className="w-[340px] border-r border-border-primary flex flex-col overflow-y-auto py-5 px-4 gap-5">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full h-10 pl-4 pr-10 rounded-full border border-border-primary text-[14px] font-light text-text-primary placeholder:text-text-muted outline-none focus:border-text-primary"
              />
              <Search className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary" />
            </div>
            <div>
              <div className="text-[11px] font-medium tracking-wider text-text-secondary uppercase px-2 mb-2">Projects</div>
              <button className="flex items-center gap-2 w-full text-left px-2 py-2 text-[14px] font-light text-text-primary hover:bg-[hsl(var(--muted)/0.4)] rounded-md">
                <Plus className="w-4 h-4" />
                <span className="font-medium">New project</span>
              </button>
            </div>
            <div>
              <div className="text-[11px] font-medium tracking-wider text-text-secondary uppercase px-2 mb-2">Recents</div>
              <div className="flex flex-col">
                {[
                  { label: 'New Chat', active: true },
                  { label: 'Summarize open tickets for today' },
                  { label: 'Draft reply to VIP customer escalation' },
                  { label: 'Knowledge base gaps analysis' },
                  { label: 'Customer agent tone adjustments' },
                  { label: 'Weekly chat volume overview' },
                  { label: 'Refund policy article draft', readonly: true },
                  { label: 'Onboarding flow for new reps', readonly: true },
                  { label: 'Top FAQs from last month', readonly: true },
                  { label: 'Chat routing rule for EU region', readonly: true },
                  { label: 'Ticket SLA breach summary', readonly: true },
                  { label: 'Holiday hours announcement', readonly: true },
                  { label: 'Macros for shipping inquiries', readonly: true },
                ].map((item, i) => {
                  const isActive = activeChat ? activeChat === item.label : item.active;
                  return (
                    <button
                      key={i}
                      onClick={() => { setActiveChat(item.label); setExpandedSteps({}); if (item.label === ESCALATION_CHAT) setMaximized(true); }}
                      className={`flex items-center justify-between gap-2 w-full text-left px-3 py-3 text-[14px] font-light text-text-primary rounded-md ${
                        isActive ? 'bg-[hsl(var(--muted)/0.5)]' : 'hover:bg-[hsl(var(--muted)/0.3)]'
                      }`}
                    >
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        <div className={`overflow-y-auto px-5 pt-12 pb-4 flex flex-col ${activeChat === ESCALATION_CHAT ? 'w-[440px] flex-shrink-0 border-r border-border-primary' : `flex-1 ${maximized ? 'items-center' : ''}`}`}>
          <div className={maximized && activeChat !== ESCALATION_CHAT ? 'w-full max-w-[720px] flex flex-col' : 'contents'}>
        {activeChat === '__live__' ? (
          <div ref={liveScrollRef} className="flex flex-col gap-4 overflow-y-auto">
            {liveMessages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'flex justify-end' : ''}>
                {m.role === 'user' ? (
                  <div className="max-w-[80%] bg-[hsl(var(--muted)/0.5)] rounded-2xl px-4 py-3 text-[14px] font-light text-text-primary whitespace-pre-wrap">
                    {m.content}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="prose prose-sm max-w-none text-[14px] font-light text-text-primary leading-relaxed [&_p]:my-2 [&_ul]:my-2 [&_ol]:my-2 [&_strong]:font-semibold">
                      {m.content ? <ReactMarkdown>{m.content}</ReactMarkdown> : <span className="text-text-secondary">Thinking…</span>}
                    </div>
                    {m.content && <FeedbackBar />}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : activeChat ? (
          <ChatConversation
            title={activeChat}
            expandedSteps={expandedSteps}
            setExpandedSteps={setExpandedSteps}
          />
        ) : meetingsOpen ? (
          <h2 className="text-[34px] leading-[42px] font-light tracking-tight">
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg,#f15a3a 0%,#f15a8d 60%,#9b5cf6 100%)' }}
            >
              Get more from your meetings
            </span>
          </h2>
        ) : (
          <h2 className="text-[34px] leading-[42px] font-light tracking-tight">
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg,#f15a3a 0%,#f15a8d 50%,#9b5cf6 100%)' }}
            >
              Hi Claire,
            </span>
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg,#f15a8d 0%,#9b5cf6 100%)' }}
            >
              how can I help you?
            </span>
          </h2>
        )}

        {/* Input */}
        <div className={`group mt-8 border border-border-primary shadow-sm transition-all duration-300 ease-out ${meetingsOpen ? 'rounded-full py-1.5 px-3' : 'rounded-xl p-3'}`}>
          {!meetingsOpen && (
            <textarea
              placeholder="Type @ to mention a record"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendLiveMessage(text);
                }
              }}
              className="w-full resize-none outline-none text-[14px] text-text-primary placeholder:text-text-muted bg-transparent min-h-[80px] h-[80px]"
            />
          )}
          {meetingsOpen ? (
            <div className="flex items-center justify-between">
              <button onClick={() => setText(t => t + '@')} className="w-7 h-7 flex items-center justify-center rounded text-text-secondary hover:bg-muted/40">
                <AtSign className="w-4 h-4" />
              </button>
              <button
                className="w-7 h-7 flex items-center justify-center rounded-full text-white transition-all"
                style={{
                  background: text.trim()
                    ? 'linear-gradient(135deg,#f15a3a,#e91e63)'
                    : '#fce4ec',
                }}
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                <button
                  onClick={() => setAppsOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border-primary text-[12px] font-medium text-text-primary hover:bg-muted/40"
                >
                  <span
                    className="text-[11px] font-bold bg-clip-text text-transparent"
                    style={{ backgroundImage: 'linear-gradient(90deg,#f15a3a,#9b5cf6)' }}
                  >
                    M✦
                  </span>
                  Apps
                </button>
              </div>
              <div className="flex items-center gap-1 text-text-secondary ml-auto">
                <div className={`flex items-center gap-1 transition-opacity ${attachOpen || bookmarkOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'}`}>
                  <div className="relative">
                    <button
                      onClick={() => { setAttachOpen(v => !v); setBookmarkOpen(false); }}
                      className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted/40"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                    {attachOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setAttachOpen(false)} />
                        <div className="fixed right-[60px] top-[294px] w-[300px] bg-background border border-border-primary rounded-xl shadow-lg overflow-hidden z-20">
                          <button className="block w-full text-left px-5 py-4 text-[14px] font-light text-text-primary hover:bg-[hsl(var(--muted)/0.4)]">
                            Upload from computer
                          </button>
                          <button className="block w-full text-left px-5 py-4 text-[14px] font-light text-text-primary border-t border-border-primary hover:bg-[hsl(var(--muted)/0.4)]">
                            Choose file
                          </button>
                          <div className="px-5 py-4 border-t border-border-primary text-[12px] text-text-secondary leading-relaxed">
                            Supports CSV, DOCX, GIF, JSON, JPG, LOG, MD, PDF, PNG, PPTX, RTF, TXT, and XLSX.
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => { setBookmarkOpen(v => !v); setAttachOpen(false); }}
                      className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted/40"
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                    {bookmarkOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setBookmarkOpen(false)} />
                        <div className="fixed right-[60px] top-[294px] w-[300px] bg-background border border-border-primary rounded-xl shadow-lg overflow-hidden z-20">
                          <div className="px-5 py-4 text-[14px] font-light text-text-primary leading-relaxed">
                            You don't have any saved prompts yet. Select add new prompt to create one you can reuse.
                          </div>
                          <button className="block w-full text-left px-5 py-4 text-[15px] font-light text-text-primary border-t border-border-primary hover:bg-[hsl(var(--muted)/0.4)]">
                            Add new prompt
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                  <button onClick={() => setText(t => t + '@')} className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted/40"><AtSign className="w-4 h-4" /></button>
                </div>
                <button
                  onClick={() => sendLiveMessage(text)}
                  disabled={!text.trim() || liveLoading}
                  className="w-7 h-7 flex items-center justify-center rounded-full text-white ml-1 transition-all"
                  style={{
                    background: text.trim()
                      ? 'linear-gradient(135deg,#f15a3a,#e91e63)'
                      : '#fce4ec',
                  }}
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>


        {!activeChat && (<>
        {/* Quick actions */}
        <div className="relative">
          <div ref={menuTriggersRef} className="flex items-center gap-5 mt-5 text-[13px] font-light text-text-primary">
            <button
              onClick={() => toggle('summarize')}
              className="font-light hover:text-text-secondary"
            >
              Summarize
            </button>
            <button
              onClick={() => toggle('create')}
              className="font-light hover:text-text-secondary"
            >
              Create
            </button>
            <button
              onClick={() => toggle('howto')}
              className="font-light hover:text-text-secondary"
            >
              How do I
            </button>
            <button
              onClick={() => { setMeetingsOpen(v => !v); setActiveMenu(null); }}
              className="flex items-center gap-1 font-light hover:text-text-secondary"
            >
              <Calendar className="w-4 h-4" /> Meetings
            </button>
          </div>

          {activeMenu && (
            <div ref={menuRef} className="relative mt-3">
              <div
                className="absolute -top-1.5 w-3 h-3 bg-background border-l border-t border-border-primary rotate-45"
                style={{
                  left:
                    activeMenu === 'summarize'
                      ? '1.5rem'
                      : activeMenu === 'create'
                      ? '6.25rem'
                      : '10.5rem',
                }}
              />
              <div className="relative bg-background border border-border-primary rounded-xl shadow-lg overflow-hidden">
                {(() => {
                  const hardcoded = matchPagePrompts(location.pathname);
                  const cacheKey = `${location.pathname}:${activeMenu}`;
                  const prompts = hardcoded ? hardcoded[activeMenu] : aiPrompts[cacheKey];
                  if (!prompts || prompts.length === 0) {
                    return (
                      <div className="px-4 py-3 text-[14px] font-light text-text-secondary">
                        {loadingPrompts ? 'Generating suggestions…' : 'No suggestions available.'}
                      </div>
                    );
                  }
                  return prompts.map((label, i) => (
                    <button
                      key={i}
                      onClick={() => { setText(label); setActiveMenu(null); }}
                      className={`block w-full text-left px-4 py-3 text-[14px] font-light text-text-primary ${
                        i === 0 && activeMenu === 'summarize' && isChatflows
                          ? 'bg-[hsl(var(--muted)/0.5)] hover:bg-[hsl(var(--muted)/0.7)]'
                          : 'hover:bg-[hsl(var(--muted)/0.4)]'
                      }`}
                    >
                      {label}
                    </button>
                  ));
                })()}
              </div>

            </div>
          )}
        </div>
        {meetingsOpen ? (
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-[15px] font-light text-text-primary">{headerDate}</div>
                <button
                  onClick={() => setWeekOffset(0)}
                  className="w-7 h-7 flex items-center justify-center rounded-full border border-border-primary text-text-secondary hover:bg-muted/40"
                  aria-label="Reset to today"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setWeekOffset(w => w - 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-full border border-border-primary text-text-secondary hover:bg-muted/40"
                  aria-label="Previous week"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setWeekOffset(w => w + 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-full border border-border-primary text-text-secondary hover:bg-muted/40"
                  aria-label="Next week"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 mt-5 text-center">
              {weekDays.map((d, i) => {
                const isActive =
                  d.toDateString() === activeDate.toDateString();
                return (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className="text-[13px] font-light text-text-secondary">{dayLabels[i]}</div>
                    <div
                      className={`text-[15px] font-light text-text-primary px-2 ${
                        isActive ? 'border-b border-text-primary' : ''
                      }`}
                    >
                      {d.getDate()}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center text-[13px] text-text-secondary mt-6">
              You have no customer or team meetings today.
            </div>
          </div>
        ) : (
          /* Breeze projects card */
          <div className="mt-6 border border-border-primary rounded-xl p-4 bg-[hsl(var(--muted)/0.3)] relative">
            <button className="absolute right-3 top-3 text-text-secondary hover:text-text-primary" aria-label="Dismiss">
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-md bg-[hsl(var(--muted))] flex items-center justify-center text-text-secondary">
                <Folder className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[14px] font-semibold text-text-primary">Get started with Breeze projects</div>
                <div className="text-[13px] text-text-secondary mt-1">
                  You can now organize your chats into projects to keep things tidy and easier to find.
                </div>
              </div>
            </div>
          </div>
        )}
        </>)}

          <div className="flex-1" />
          <div className="text-center text-[12px] text-text-muted pt-4">
            AI-generated content may be inaccurate.
          </div>
          </div>
        </div>
        {activeChat === ESCALATION_CHAT && <EmailDraftView />}
      </div>
      <AppsModal open={appsOpen} onClose={() => setAppsOpen(false)} />
    </aside>
  );
};

export default AssistantPanel;
