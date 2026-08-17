import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Pencil, Info, ExternalLink, ChevronRight, ChevronLeft, ChevronDown, X, Send, Search, Folder, Trash2, AlertTriangle, Sparkle, GripVertical, Plus, MessageCircle, ArrowUp, MessageSquare, FileText, HelpCircle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import ReplaceIcon from '@/components/icons/ReplaceMediaIcon';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import noResultsImg from '@/assets/no-search-results.png';
import hubspotQuestionsAsset from '@/assets/hubspot-questions.png.asset.json';
import welcomeVideoAsset from '@/assets/welcome-video.mp4.asset.json';
import welcomeVideoPosterAsset from '@/assets/welcome-video-poster.jpg.asset.json';
import welcomeGif from '@/assets/welcome-gif.gif';
import { WidgetVideo } from '@/components/WidgetVideo';

import RichTextEditor from '@/components/RichTextEditor';
import ChatflowOptions from '@/components/ChatflowOptions';
import ChatflowTarget from '@/components/ChatflowTarget';
import ChatflowKnowledgeBase, { KB_ARTICLES, KB_CATEGORIES, KB_SAMPLE_ARTICLES, KB_SAMPLE_CATEGORIES } from '@/components/ChatflowKnowledgeBase';


import { chatflowsData } from '@/pages/Chatflows';

export type MediaFile = { id: string; name: string; url: string; type: 'image' | 'video'; poster?: string };

const tabs = ['Chat', 'Knowledge Base', 'Target', 'Options'] as const;
type Tab = typeof tabs[number];

const suggestions = [
  'How can I set up multiple devices?',
  'What are the benefits of upgrading?',
  'Best way to secure data and protect my customers',
];

const quickReplies = [
  'I want to book a meeting',
  'I want to know the differences in pricing plans',
  'I want to know more about your refund policy',
];

const autoQuickReplies = [
  'What can your AI agent do for my team?',
  'How does pricing work for growing teams?',
  'Can I see a quick product demo?',
];

const QuickReplies: React.FC<{ replies: string[]; onChange: (r: string[]) => void; auto: boolean; onAutoChange: (v: boolean) => void }> = ({ replies, onChange, auto, onAutoChange }) => {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const handleDrop = (target: number) => {
    if (dragIndex === null || dragIndex === target) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }
    const next = [...replies];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(target, 0, moved);
    onChange(next);
    setDragIndex(null);
    setOverIndex(null);
  };

  return (
    <div className="max-w-[760px]">
      <p className="text-sm font-light text-text-secondary">
        These appear as clickable buttons in the chat interface. Adding a quick reply here will override AI generated suggestions.
      </p>

      <div className="mt-4 flex items-start justify-between gap-6 rounded-lg border border-border-primary p-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-text-primary">Auto-generate prompts</span>
            <Sparkle className="w-4 h-4 text-text-primary" />
          </div>
          <p className="mt-2 text-sm font-light text-text-secondary">
            AI generates conversation starters from your training data. Quick replies you add will take priority.
          </p>
        </div>
        <Switch checked={auto} onCheckedChange={onAutoChange} />
      </div>

      {!auto && (
      <div className="mt-5 space-y-3">
        {replies.map((reply, i) => (
          <div
            key={i}
            draggable={dragIndex === i}
            onDragStart={() => setDragIndex(i)}
            onDragOver={(e) => {
              e.preventDefault();
              setOverIndex(i);
            }}
            onDrop={(e) => {
              e.preventDefault();
              handleDrop(i);
            }}
            onDragEnd={() => {
              setDragIndex(null);
              setOverIndex(null);
            }}
            className={`flex items-center gap-3 rounded-md transition-opacity ${dragIndex === i ? 'opacity-50' : ''} ${overIndex === i && dragIndex !== null && dragIndex !== i ? 'ring-2 ring-ring' : ''}`}
          >
            <span
              onMouseDown={() => setDragIndex(i)}
              onMouseUp={() => dragIndex === i && setDragIndex(null)}
              className="shrink-0 cursor-grab active:cursor-grabbing"
              aria-label="Drag to reorder"
            >
              <GripVertical className="w-4 h-4 text-text-muted" />
            </span>
            <input
              value={reply}
              onChange={(e) => {
                const next = [...replies];
                next[i] = e.target.value;
                onChange(next);
              }}
              className="flex-1 h-11 px-3 rounded-md border border-border-secondary bg-background text-sm font-light text-text-primary focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="button"
              aria-label="Remove quick reply"
              onClick={() => onChange(replies.filter((_, idx) => idx !== i))}
              className="p-1 text-text-primary hover:text-text-secondary"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}


        <div className="flex items-center gap-3">
          <span className="w-4 shrink-0" />
          <button
            type="button"
            onClick={() => onChange([...replies, ''])}
            className="flex-1 h-11 inline-flex items-center justify-center gap-2 rounded-full border border-border-secondary text-sm font-light text-text-primary hover:bg-surface-secondary transition-colors"
          >
            <Plus className="w-4 h-4" /> Add quick reply
          </button>
          <span className="w-6 shrink-0" />
        </div>
      </div>
      )}
    </div>
  );
};


const AccordionRow: React.FC<{ label: string; hasInfo?: boolean; children?: React.ReactNode }> = ({ label, hasInfo, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border-primary">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 py-5 text-left"
      >
        <ChevronRight className={`w-4 h-4 text-text-primary transition-transform ${open ? 'rotate-90' : ''}`} />
        <span className="text-base font-semibold text-text-primary">{label}</span>
        {hasInfo && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-3.5 h-3.5 text-text-muted" />
              </TooltipTrigger>
              <TooltipContent>More information</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </button>
      {open && (
        <div className="pb-6 pl-7 text-sm font-light text-text-secondary">
          {children ?? `Configure ${label.toLowerCase()} settings for this chatflow.`}
        </div>
      )}
    </div>
  );
};

const LAUNCHER_TYPES = [
  {
    id: 'spotlight',
    title: 'Spotlight',
    isNew: true,
    description: 'A prominent search bar-style launcher that invites visitors to start a conversation.',
  },
  {
    id: 'prompt-bar',
    title: 'Prompt bar',
    hasInfo: true,
    description:
      'When visitors hover on the prompt bar, they will see a suggested prompt only on pages with training data.',
    link: 'Want prompts to appear? Add your website pages to Knowledge Sources.',
  },
  {
    id: 'icon',
    title: 'Icon',
    description: "Prompts won't appear on hover. Visitors can click the icon to open the chat.",
  },
];

const ChatDisplayBehavior: React.FC<{
  autoOpen: { Desktop: boolean; Mobile: boolean };
  onAutoOpenChange: (v: { Desktop: boolean; Mobile: boolean }) => void;
  launcher: string;
  onLauncherChange: (v: string) => void;
}> = ({ autoOpen, onAutoOpenChange, launcher, onLauncherChange }) => {
  const [device, setDevice] = useState<'Desktop' | 'Mobile'>('Desktop');


  return (
    <div className="max-w-[760px]">
      <p className="text-sm font-light text-text-secondary">
        Customize how the chatflow will appear to targeted visitors for desktop, tablet and mobile.{' '}
        <a href="#" className="font-semibold text-text-link hover:underline inline-flex items-center gap-1">
          Learn more <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </p>

      {/* Device tabs */}
      <div className="mt-5 flex border-b border-border-primary">
        {(['Desktop', 'Mobile'] as const).map((d) => (
          <button
            key={d}
            onClick={() => setDevice(d)}
            className={`px-6 py-2.5 text-sm rounded-t-md border border-b-0 -mb-px ${
              device === d
                ? 'bg-background border-border-primary font-semibold text-text-primary'
                : 'bg-surface-secondary border-border-primary font-light text-text-secondary'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="pt-6 pl-4">
        <h3 className="text-lg font-semibold text-text-primary">Launcher type</h3>
        <p className="mt-2 text-sm font-light text-text-secondary">
          Choose how visitors start a chat. This only changes the launcher's look.
        </p>

        <div className="mt-4 space-y-4">
          {LAUNCHER_TYPES.map((opt) => {
            const sunset = opt.id === 'prompt-bar';
            return (
            <div key={opt.id} className="relative">
              {sunset && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-amber-50/80 backdrop-blur-[1px]">
                  <span className="rounded-md border border-amber-300 bg-amber-100 px-4 py-2 text-sm font-light text-amber-900 shadow-sm">
                    This launcher type will be sunset
                  </span>
                </div>
              )}
              <label className={`flex gap-3 ${sunset ? 'pointer-events-none select-none opacity-40' : 'cursor-pointer'}`}>
                <input
                  type="radio"
                  name="launcher-type"
                  disabled={sunset}
                  checked={launcher === opt.id}
                  onChange={() => onLauncherChange(opt.id)}
                  className="mt-1 h-4 w-4 accent-[#2d2d2d]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-light text-text-primary">{opt.title}</span>
                    {opt.isNew && (
                      <span className="rounded-full bg-hubspot-green px-2 py-0.5 text-xs font-semibold text-primary-foreground">New</span>
                    )}
                    {opt.hasInfo && <Info className="w-3.5 h-3.5 text-text-muted" />}
                  </div>
                  <p className="mt-1 text-sm font-light text-text-secondary">{opt.description}</p>
                  {opt.link && (
                    <a href="#" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-text-link hover:underline">
                      {opt.link} <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </label>
            </div>
            );
          })}
        </div>


        <h3 className="mt-8 text-lg font-semibold text-text-primary">Initial state</h3>
        <p className="mt-2 text-sm font-light text-text-secondary">
          Choose whether the chat opens automatically or stays collapsed until the visitor clicks the launcher.
        </p>
        <div className="mt-4 flex items-start justify-between gap-6 rounded-lg border border-border-primary p-5">
          <div>
            <span className="text-sm font-semibold text-text-primary">Open chat automatically on {device.toLowerCase()}</span>
            <p className="mt-2 text-sm font-light text-text-secondary">
              When off, visitors see only the launcher until they start a chat.
            </p>
          </div>
          <Switch
            checked={autoOpen[device]}
            onCheckedChange={(v) => onAutoOpenChange({ ...autoOpen, [device]: v })}
          />
        </div>
      </div>
    </div>
  );
};

const ChooseChatAvatar: React.FC = () => (
  <div className="max-w-[760px]">
    <p className="text-sm font-light text-text-secondary">
      Add a custom image or logo to give your chat a personalized touch.
    </p>

    <div className="mt-6 flex items-center gap-2">
      <span className="text-base font-semibold text-text-primary">Chat heading</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="w-3.5 h-3.5 text-text-muted" />
          </TooltipTrigger>
          <TooltipContent>More information</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>

    <div className="mt-3 max-w-[420px] space-y-3">
      <div className="flex items-center justify-between rounded-md border border-border-secondary px-4 py-3">
        <span className="text-base font-light text-text-primary">Specific users and teams</span>
        <ChevronDown className="w-4 h-4 text-text-primary" />
      </div>
      <div className="flex items-center justify-between rounded-md border border-border-secondary px-3 py-2.5">
        <span className="inline-flex items-center gap-2 rounded-md bg-surface-secondary border border-border-primary px-2.5 py-1.5">
          <span className="w-5 h-5 rounded-full bg-[#a4552a]/20 flex items-center justify-center text-[10px] font-semibold text-[#a4552a]">L</span>
          <span className="text-sm font-semibold text-text-primary">Luma</span>
          <X className="w-3.5 h-3.5 text-text-primary" />
        </span>
        <ChevronDown className="w-4 h-4 text-text-primary" />
      </div>
    </div>
  </div>
);

const RECENT_FILES: MediaFile[] = [
  { id: 'f1', name: 'have-questions-banner.png', url: hubspotQuestionsAsset.url, type: 'image' },
  { id: 'f2', name: 'welcome-video.mp4', url: welcomeVideoAsset.url, type: 'video', poster: welcomeVideoPosterAsset.url },
  { id: 'f3', name: 'welcome-animation.gif', url: welcomeGif, type: 'image' },
];

const FileManagerPanel: React.FC<{
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSelect: (file: MediaFile) => void;
}> = ({ open, onOpenChange, onSelect }) => {
  const [query, setQuery] = useState('');
  const files = RECENT_FILES.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[720px] p-0 flex flex-col font-['Lexend_Deca']">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border-primary">
          <h2 className="text-2xl font-semibold text-text-primary">Select image</h2>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <p className="text-sm font-light text-text-secondary">
            Select an image. File extension svg is not supported.
          </p>

          <div className="relative mt-5">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, descriptions, or folders"
              className="w-full rounded-md border border-border-secondary px-4 py-2.5 pr-11 text-sm font-light text-text-primary bg-background focus:outline-none focus:border-text-link"
            />
            {query ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-text-secondary" />
              </button>
            ) : (
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-primary" />
            )}
          </div>

          {query && files.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <img
                src={noResultsImg}
                alt="No search results"
                loading="lazy"
                width={512}
                height={512}
                className="w-56 h-56 object-contain"
              />
              <p className="mt-4 text-base font-semibold text-text-primary">No matches for "{query}"</p>
              <p className="mt-2 text-sm font-light text-text-secondary">Check your spelling and try again.</p>
            </div>
          ) : (
            <>
              <div className="mt-8 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary">
                  {query ? 'Results' : 'Recently updated'}
                </h3>
                {!query && (
                  <button className="text-sm font-semibold text-text-link hover:underline">View all</button>
                )}
              </div>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {files.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      onSelect(f);
                      onOpenChange(false);
                    }}
                    className="group rounded-md bg-surface-secondary p-3 text-left hover:ring-2 hover:ring-text-link transition"
                  >
                    {f.type === 'video' ? (
                      <video
                        src={f.url}
                        poster={f.poster}
                        muted
                        playsInline
                        preload="metadata"
                        className="w-full h-[110px] object-cover rounded bg-black"
                      />
                    ) : (
                      <img
                        src={f.url}
                        alt={f.name}
                        loading="lazy"
                        className="w-full h-[110px] object-cover rounded"
                      />
                    )}
                    <p className="mt-2 truncate text-xs font-light text-text-secondary">{f.name}</p>
                  </button>
                ))}
              </div>


              {!query && (
                <>
                  <div className="mt-8 border-t border-border-primary pt-6 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-text-primary">Recently updated folders</h3>
                    <button className="text-sm font-semibold text-text-link hover:underline">View all</button>
                  </div>

                  <div className="mt-4">
                    <button className="w-[140px] text-center">
                      <Folder className="mx-auto w-14 h-14 text-text-primary" strokeWidth={1.5} />
                      <p className="mt-2 truncate text-sm font-semibold text-text-link">placeholder_folder</p>
                      <p className="text-xs font-light text-text-muted">2 items</p>
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <div className="border-t border-border-primary px-6 py-4">
          <div className="inline-flex items-center rounded-full border border-text-primary overflow-hidden">
            <label className="px-5 py-2 text-sm font-light text-text-primary cursor-pointer hover:bg-surface-secondary transition-colors">
              Upload
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onSelect({
                      id: `upload-${Date.now()}`,
                      name: file.name,
                      url: URL.createObjectURL(file),
                      type: file.type.startsWith('video') ? 'video' : 'image',
                    });
                    onOpenChange(false);
                  }
                }}
              />
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button aria-label="More upload options" className="border-l border-text-primary px-3 py-2.5 hover:bg-surface-secondary transition-colors">
                  <ChevronDown className="w-4 h-4 text-text-primary" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" side="top" className="w-[260px] rounded-md p-1 font-['Lexend_Deca']">
                <DropdownMenuItem className="rounded-md px-3 py-2.5 text-sm font-light text-text-primary">
                  Add from URL
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-md px-3 py-2.5 text-sm font-light text-text-primary">
                  Design with Adobe Express
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const HELLO_TOKEN =
  '<b>Hello <span class="personalization-token" contenteditable="false" data-token="contact.firstname">First name (there)</span></b>';

const DEFAULT_WELCOME =
  `<div>${HELLO_TOKEN}!</div><div>I'm Luma. Do you have any questions about our services or pricing?</div>`;

const SUPPORT_WELCOME = `<div>${HELLO_TOKEN} Got any questions? I'm happy to help.</div>`;


/** Character count based on visible text, not markup. */
const plainLength = (html: string) =>
  html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').length;

const WelcomeMessage: React.FC<{ media: MediaFile | null; onMediaChange: (m: MediaFile | null) => void; mediaDisabled?: boolean; initialMessage?: string; mediaSize?: string; onMediaSizeChange?: (v: string) => void }> = ({ media, onMediaChange, mediaDisabled, initialMessage, mediaSize = 'auto', onMediaSizeChange }) => {
  const [message, setMessage] = useState(initialMessage ?? DEFAULT_WELCOME);
  
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div className="max-w-[760px]">
      <p className="text-sm font-light text-text-secondary">
        Set the first message visitors see when the chat widget opens.
      </p>

      <div className="mt-6">
        <label className="text-base font-semibold text-text-primary">Welcome message text</label>
        <div className="mt-2">
          <RichTextEditor value={message} onChange={setMessage} defaultValue={initialMessage ?? DEFAULT_WELCOME} />
        </div>
        {plainLength(message).valueOf() === 0 ? (
          <div className="mt-2 flex items-center gap-3 rounded-lg border border-[#f5c26b] bg-[#fef8f0] px-4 py-3">
            <AlertTriangle className="h-4 w-4 shrink-0 text-[#b98217]" />
            <p className="text-sm font-light text-text-secondary">
              <span className="font-semibold text-text-primary">Can't leave blank</span>{' '}
              Welcome message text is required.
            </p>
          </div>
        ) : null}
        <p className="mt-1 text-xs font-light text-text-muted">{plainLength(message)}/1000 characters</p>
      </div>


      <div className="relative mt-6">
        {mediaDisabled && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-amber-50/80 backdrop-blur-[1px]">
            <span className="rounded-md border border-amber-300 bg-amber-100 px-4 py-2 text-sm font-light text-amber-900 shadow-sm">
              Welcome media is not supported for bots
            </span>

          </div>
        )}
        <div className={mediaDisabled ? 'pointer-events-none select-none opacity-40' : undefined}>
        <span className="inline-flex items-center gap-2">
          <span className="text-base font-semibold text-text-primary">Welcome media</span>
          <span className="rounded-full bg-hubspot-green px-2 py-0.5 text-xs font-semibold text-primary-foreground">New</span>
        </span>
        <p className="mt-1 text-sm font-light text-text-secondary">
          Add an image, video, or GIF to show alongside your welcome message.
        </p>

        <div className="mt-3 max-w-[420px] space-y-3">
          {media ? (
            <div>
              <div className="flex items-center justify-end">

                <TooltipProvider delayDuration={100}>
                  <div className="flex items-center gap-4">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          aria-label="Replace media"
                          onClick={() => setPickerOpen(true)}
                          className="text-text-primary hover:text-text-link"
                        >
                          <ReplaceIcon className="w-5 h-5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Replace</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          aria-label="Remove media"
                          onClick={() => onMediaChange(null)}
                          className="text-text-primary hover:text-text-link"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Remove</TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>

              </div>
              <div className="mt-3 border border-dashed border-border-primary p-1">
                <button
                  type="button"
                  onClick={() => setPickerOpen(true)}
                  className="group relative block w-full overflow-hidden rounded-sm"
                  aria-label="Replace media"
                >
                  {media.type === 'video' ? (
                    <video src={media.url} poster={media.poster} muted playsInline preload="metadata" className="w-full rounded-sm bg-black" />
                  ) : (
                    <img src={media.url} alt={media.name} loading="lazy" className="w-full rounded-sm" />
                  )}
                  <span className="absolute inset-0 hidden items-center justify-center bg-foreground/60 backdrop-blur-[3px] text-base font-light text-background group-hover:flex">
                    Replace
                  </span>
                </button>
              </div>

              <div className="mt-4 border-l-2 border-border-primary pl-4">
                <span className="text-base font-semibold text-text-primary">Size</span>
                <Select value={mediaSize} onValueChange={(v) => onMediaSizeChange?.(v)}>
                  <SelectTrigger className="mt-2 h-auto w-full rounded-md border-border-secondary px-4 py-3 text-base font-light text-text-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-w-[440px]">
                    <SelectItem value="auto" className="py-3">
                      <span className="block text-base font-light text-text-primary">Automatically adjust (recommended)</span>
                      <span className="block text-sm font-light text-text-secondary">Images will responsively scale based on device size</span>
                    </SelectItem>
                    <SelectItem value="exact" className="py-3">
                      <span className="block text-base font-light text-text-primary">Use exact width and height</span>
                      <span className="block text-sm font-light text-text-secondary">Image will always be this size regardless of device size</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>
          ) : (

            <div className="rounded-md border border-dashed border-border-primary px-4 py-8 text-center">
              <p className="text-sm font-light text-text-secondary">Drag and drop a file here, or</p>
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="mt-2 inline-block rounded-md border border-border-secondary px-4 py-1.5 text-sm font-light text-text-primary"
              >
                Choose file
              </button>
              <p className="mt-2 text-xs font-light text-text-muted">Supports images, videos, and GIFs</p>
            </div>
          )}
        </div>


        </div>
      </div>


      <FileManagerPanel open={pickerOpen} onOpenChange={setPickerOpen} onSelect={onMediaChange} />
    </div>
  );
};

const ChatflowEdit: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const chatflowName = decodeURIComponent(name || 'New chatflow');
  const [activeTab, setActiveTab] = useState<Tab>('Chat');
  const [enabled, setEnabled] = useState(true);
  const [welcomeMedia, setWelcomeMedia] = useState<MediaFile | null>(null);
  const [mediaSize, setMediaSize] = useState('auto');
  const [previewWidth, setPreviewWidth] = useState<number | null>(null);
  const [previewHeight, setPreviewHeight] = useState<number | null>(null);
  const [autoOpen, setAutoOpen] = useState({ Desktop: true, Mobile: false });
  const [launcher, setLauncher] = useState('prompt-bar');
  const [replies, setReplies] = useState<string[]>(quickReplies);
  const [autoReplies, setAutoReplies] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(true);
  const [kbEnabled, setKbEnabled] = useState(true);
  const [kbLibrary, setKbLibrary] = useState('help-center');
  const [kbRecommendations, setKbRecommendations] = useState('highest-rated');

  useEffect(() => {
    setPreviewOpen(autoOpen.Desktop);
  }, [autoOpen.Desktop]);
  useEffect(() => {
    setPreviewWidth(null);
    setPreviewHeight(null);
  }, [launcher]);
  const isBot = chatflowsData.find((c) => c.name === chatflowName)?.type === 'Bot';
  const isSupport = chatflowName === 'Support Chatflow';

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-background font-['Lexend_Deca']">
      {/* Dark header bar */}
      <div className="shrink-0 bg-[#2d2d2d] px-6 py-3 flex items-center">
        <Link to="/chatflows" className="text-white text-sm font-light hover:underline inline-flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" />
          Back to chatflows
        </Link>
        <div className="flex-1 flex items-center justify-center gap-2">
          <span className="text-white text-lg font-semibold">{chatflowName}</span>
          <Pencil className="w-4 h-4 text-white/70" />
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-1.5 text-sm font-light bg-transparent text-white border border-white rounded-full hover:bg-white/10 transition-colors">
            Preview
          </button>
          <button
            onClick={() => setEnabled(!enabled)}
            role="switch"
            aria-checked={enabled}
            aria-label="Enable chatflow"
            className="relative w-[52px] h-[26px] rounded-md bg-white"
          >
            <div className={`absolute top-[3px] w-[22px] h-[20px] rounded bg-[#e5e5e5] transition-transform ${enabled ? 'translate-x-[26px]' : 'translate-x-[3px]'}`} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="shrink-0 border-b border-border-primary bg-background">
        <div className="flex items-center justify-center gap-10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-sm border-b-[3px] transition-colors ${
                activeTab === tab
                  ? 'border-border-secondary text-text-primary font-semibold'
                  : 'border-transparent text-text-secondary font-light hover:text-text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      {activeTab === 'Options' || activeTab === 'Target' ? (
        <div className="flex-1 min-h-0 overflow-y-auto px-8 py-10">
          {activeTab === 'Options' ? <ChatflowOptions /> : <ChatflowTarget />}
        </div>
      ) : (

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[30%_minmax(0,1fr)] gap-10 px-8 max-w-[1600px] w-full">
        <div className="min-w-0 overflow-y-auto py-10 pr-2">

          {activeTab === 'Chat' ? (
            <>
              <h2 className="text-2xl font-semibold text-text-primary">Assignment</h2>
              <p className="mt-2 text-sm font-light text-text-secondary">
                Assign tickets created from this chat to specific team members.
              </p>

              <div className="mt-6">
                <div className="flex items-center gap-1.5">
                  <label className="text-sm font-semibold text-text-primary">Ticket assignment</label>
                  <Info className="w-3.5 h-3.5 text-text-muted" />
                </div>
                <select className="mt-2 w-full h-11 px-3 rounded border border-border-secondary bg-background text-sm font-light">
                  <option>Customer agent</option>
                  <option>Specific users and teams</option>
                  <option>No one</option>
                </select>
                <select className="mt-3 w-full h-11 px-3 rounded border border-border-secondary bg-background text-sm font-light">
                  <option>Luma</option>
                  <option>Claire</option>
                </select>
              </div>

              <div className="mt-6 rounded-lg border border-border-primary p-6">
                <p className="text-sm font-light text-text-primary leading-relaxed">
                  <span className="font-semibold">Note:</span> When a ticket is routed to the customer agent, the ticket moves to the "Customer agent" view. If the agent can't answer, the ticket is reassigned based on your customer agent settings.
                </p>
                <a href="#" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-text-link hover:underline">
                  View customer agent settings <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <h2 className="mt-12 text-2xl font-semibold text-text-primary">Personalize</h2>
              <p className="mt-2 text-sm font-light text-text-secondary">
                Greet your site visitors and capture their email address for future contact.
              </p>
              <div className="mt-4 border-t border-border-primary">
                <AccordionRow label="Welcome message">
                  <WelcomeMessage key={chatflowName} media={isBot ? null : welcomeMedia} onMediaChange={setWelcomeMedia} mediaDisabled={isBot} initialMessage={isSupport ? SUPPORT_WELCOME : DEFAULT_WELCOME} mediaSize={mediaSize} onMediaSizeChange={setMediaSize} />
                </AccordionRow>
                {!isBot && (
                  <AccordionRow label="Quick replies">
                    <QuickReplies replies={replies} onChange={setReplies} auto={autoReplies} onAutoChange={setAutoReplies} />
                  </AccordionRow>
                )}

                <AccordionRow label="Email capture">
                  <div className="max-w-[760px]">
                    <p className="text-sm font-light text-text-secondary">
                      AI will ask the visitor for their email address when sending the conversation to a team member.
                    </p>
                    <a href="#" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-text-link hover:underline">
                      Configure email capture settings in Customer Agent <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </AccordionRow>
              </div>

              <h2 className="mt-12 text-2xl font-semibold text-text-primary">Display</h2>
              <p className="mt-2 text-sm font-light text-text-secondary">
                Customize the chat heading, chat display behavior, and timing controls. Manage the accent color, chat placement and more under{' '}
                <a href="#" className="font-semibold text-text-link hover:underline inline-flex items-center gap-1">
                  help desk settings <ExternalLink className="w-3.5 h-3.5" />
                </a>{' '}.
              </p>
              <div className="mt-4 border-t border-border-primary">
                <AccordionRow label="Choose chat avatar">
                  <ChooseChatAvatar />
                </AccordionRow>
                <AccordionRow label="Chat display behavior" hasInfo>
                  <ChatDisplayBehavior autoOpen={autoOpen} onAutoOpenChange={setAutoOpen} launcher={launcher} onLauncherChange={setLauncher} />
                </AccordionRow>
              </div>
            </>
          ) : activeTab === 'Knowledge Base' ? (
            <ChatflowKnowledgeBase
              enabled={kbEnabled}
              onEnabledChange={setKbEnabled}
              library={kbLibrary}
              onLibraryChange={setKbLibrary}
              recommendations={kbRecommendations}
              onRecommendationsChange={setKbRecommendations}
              spotlight={launcher === 'spotlight'}
            />
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-text-primary">{activeTab}</h2>
              <p className="mt-2 text-sm font-light text-text-secondary">
                {activeTab} settings for {chatflowName}.
              </p>
            </>
          )}

        </div>

        {/* Chat widget preview */}
        <div data-preview-col className={`h-full overflow-hidden py-10 flex items-end justify-center ${launcher === 'spotlight' ? '' : 'lg:justify-start'}`}>
        <div className={`flex w-[740px] max-w-full items-end ${launcher === 'spotlight' ? 'justify-center' : 'justify-end'}`}>
          <div
            className="group/resize relative flex flex-col justify-end"
            style={{ width: previewWidth ?? (launcher === 'spotlight' ? 600 : 420) }}
          >
            {/* Width resize handles (left always; right only for centered spotlight) */}
            {(['left', 'right'] as const)
              .filter((side) => side === 'left' || launcher === 'spotlight')
              .map((side) => (
                <div
                  key={side}
                  role="separator"
                  aria-label="Resize chat widget width"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    const startX = e.clientX;
                    const startW = previewWidth ?? (launcher === 'spotlight' ? 600 : 420);
                    const dir = side === 'left' ? -1 : 1;
                    const factor = launcher === 'spotlight' ? 2 : 1;
                    const onMove = (ev: PointerEvent) => {
                      const next = Math.min(720, Math.max(320, startW + (ev.clientX - startX) * dir * factor));
                      setPreviewWidth(next);
                    };
                    const onUp = () => {
                      window.removeEventListener('pointermove', onMove);
                      window.removeEventListener('pointerup', onUp);
                    };
                    window.addEventListener('pointermove', onMove);
                    window.addEventListener('pointerup', onUp);
                  }}
                  className={`absolute ${side === 'left' ? 'left-[-10px]' : 'right-[-10px]'} top-0 bottom-0 z-10 flex w-5 cursor-ew-resize items-center justify-center opacity-0 transition-opacity group-hover/resize:opacity-100`}
                >
                  <span className="h-16 w-1 rounded-full bg-border-secondary" />
                </div>
              ))}

            {/* Height resize handle (top edge only) */}
            {previewOpen && (
              <div
                role="separator"
                aria-label="Resize chat widget height"
                onPointerDown={(e) => {
                  e.preventDefault();
                  const startY = e.clientY;
                  const card = (e.currentTarget.parentElement?.querySelector('[data-widget-card]') as HTMLElement | null);
                  const startH = previewHeight ?? card?.offsetHeight ?? 480;
                  const col = (e.currentTarget.closest('[data-preview-col]') as HTMLElement | null);
                  const colTop = col ? col.getBoundingClientRect().top + 24 : 80;
                  const cardBottom = card?.getBoundingClientRect().bottom ?? 0;
                  const maxH = Math.max(240, Math.min(760, cardBottom - colTop));
                  const onMove = (ev: PointerEvent) => {
                    const next = Math.min(maxH, Math.max(240, startH - (ev.clientY - startY)));
                    setPreviewHeight(next);
                  };

                  const onUp = () => {
                    window.removeEventListener('pointermove', onMove);
                    window.removeEventListener('pointerup', onUp);
                  };
                  window.addEventListener('pointermove', onMove);
                  window.addEventListener('pointerup', onUp);
                }}
                className="absolute left-0 right-0 top-[-10px] z-10 flex h-5 cursor-ns-resize items-center justify-center opacity-0 transition-opacity group-hover/resize:opacity-100"
              >
                <span className="h-1 w-16 rounded-full bg-border-secondary" />
              </div>
            )}

            {previewOpen && activeTab === 'Knowledge Base' && (
              <div className="flex flex-col">
              {!kbEnabled && (
                <div className="mb-2 flex justify-end">
                  <span className="inline-flex items-center gap-1.5 rounded bg-[#5c46d4] px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                    Sample data <Info className="w-3 h-3" />
                  </span>
                </div>
              )}
              <div
                data-widget-card
                className="rounded-lg overflow-hidden shadow-lg border border-border-primary bg-background flex flex-col"
                style={previewHeight ? { height: previewHeight } : undefined}
              >

                <div className="bg-[#a4552a] px-5 pt-4 pb-5">
                  <div className="flex items-center gap-3">
                    <span className="flex-1 text-white text-lg font-semibold">Help</span>
                    <MessageSquare className="w-5 h-5 text-white" />
                    <button type="button" aria-label="Close chat widget" onClick={() => setPreviewOpen(false)}>
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  <div className="mt-4 flex items-center gap-2 rounded-full bg-white px-4 py-2.5">
                    <Search className="w-4 h-4 text-text-muted" />
                    <span className="text-sm font-light text-text-muted">Search articles</span>
                  </div>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4">
                  <p className="text-sm font-semibold text-text-primary">
                    {!kbEnabled
                      ? 'Trending Articles'
                      : kbRecommendations === 'most-viewed'
                      ? 'Most Viewed Articles'
                      : kbRecommendations === 'recently-published'
                      ? 'Recently Published Articles'
                      : 'Highest Rated Articles'}
                  </p>
                  <div className="mt-3 flex flex-col gap-3">
                    {(kbEnabled ? KB_ARTICLES : KB_SAMPLE_ARTICLES).map((a) => (
                      <div key={a} className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-text-secondary shrink-0" />
                        <span className="text-sm font-semibold text-text-primary">{a}</span>
                      </div>
                    ))}
                  </div>

                  <p className="mt-6 text-sm font-semibold text-text-primary">Browse Categories</p>
                  <div className="mt-2">
                    {(kbEnabled ? KB_CATEGORIES : KB_SAMPLE_CATEGORIES).map((c) => (
                      <div key={c.name} className="flex items-center gap-3 py-3 border-b border-border-primary last:border-b-0">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-text-primary">{c.name}</p>
                          <p className="text-xs font-light text-text-secondary">{c.count} articles</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#a4552a]" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-5 py-4 flex justify-center">
                  <div className="flex items-center rounded-full bg-surface-secondary p-1">
                    <button type="button" className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-light text-text-primary">
                      <MessageSquare className="w-4 h-4" /> Chat
                    </button>
                    <button type="button" className="inline-flex items-center gap-2 rounded-full bg-[#a4552a] px-5 py-2 text-sm font-light text-white">
                      <HelpCircle className="w-4 h-4" /> Help
                    </button>
                  </div>
                </div>
              </div>
              </div>
            )}


            {previewOpen && activeTab !== 'Knowledge Base' && (
            <div
              data-widget-card
              className="rounded-lg overflow-hidden shadow-lg border border-border-primary bg-background flex flex-col"
              style={previewHeight ? { height: previewHeight } : undefined}
            >
              <div className={`px-4 py-3 flex items-center gap-3 ${launcher === 'spotlight' ? 'bg-white border-b border-border-primary' : 'bg-[#a4552a]'}`}>
                <ChevronLeft className={`w-5 h-5 ${launcher === 'spotlight' ? 'text-foreground' : 'text-white'}`} />
                <div className={`w-8 h-8 rounded-full ${launcher === 'spotlight' ? 'bg-muted' : 'bg-white/30'}`} />
                <span className={`font-semibold text-sm flex-1 ${launcher === 'spotlight' ? 'text-foreground' : 'text-white'}`}>Claire</span>
                <button
                  type="button"
                  aria-label="Close chat widget"
                  onClick={() => setPreviewOpen(false)}
                  className="shrink-0"
                >
                  <X className={`w-5 h-5 ${launcher === 'spotlight' ? 'text-foreground' : 'text-white'}`} />
                </button>
              </div>

              <div className="p-4 flex flex-col flex-1 min-h-0">
                <div className="flex-1 min-h-0 overflow-y-auto">
                {/* Welcome media */}

                {welcomeMedia && (
                  <div className={`mb-3 rounded-lg overflow-hidden border border-border-primary ${mediaSize === 'exact' ? 'bg-surface-secondary' : ''}`}>
                    {welcomeMedia.type === 'video' ? (
                      <WidgetVideo
                        src={welcomeMedia.url}
                        poster={welcomeMedia.poster}
                        className={mediaSize === 'exact' ? 'w-full h-auto object-contain bg-black' : 'w-full max-h-[200px] object-cover bg-black'}
                      />
                    ) : (
                      <img
                        src={welcomeMedia.url}
                        alt={welcomeMedia.name}
                        loading="lazy"
                        className={mediaSize === 'exact' ? 'w-full h-auto object-contain' : 'w-full max-h-[200px] object-cover'}
                      />
                    )}
                  </div>
                )}

                {/* Welcome message */}
                <div className="text-sm font-light text-text-primary">
                  {isSupport ? (
                    <p>
                      <span className="font-semibold">Hello there</span> Got any questions? I'm happy to help.
                    </p>
                  ) : (
                    <>
                      <p className="font-semibold">Hello there!</p>
                      <p className="mt-1">
                        I'm Luma. Do you have any questions about our services or pricing?
                      </p>

                    </>
                  )}
                </div>

                {/* Quick replies */}
                <div className="mt-4 flex flex-col items-start gap-2">
                  {(isBot ? [] : autoReplies ? autoQuickReplies : replies).filter(Boolean).map((s, i) => (

                    <button
                      key={`${s}-${i}`}
                      type="button"
                      className="px-4 py-2 rounded-full border border-border-primary text-sm font-light text-text-primary hover:bg-surface-secondary transition-colors text-left"
                    >
                      {s}
                    </button>
                  ))}
                </div>
                </div>

                <p className="mt-6 text-center text-xs font-light text-text-muted">
                  AI-generated content may be inaccurate.
                </p>


                {launcher !== 'spotlight' && (
                  <div className="mt-4 flex items-center gap-2 rounded-full border border-border-primary px-4 py-2.5">
                    <span className="flex-1 text-sm font-light text-text-muted">Ask me anything...</span>
                    <Send className="w-4 h-4 text-text-muted" />
                  </div>
                )}
              </div>
            </div>
            )}
            {launcher === 'spotlight' && (
              <button
                type="button"
                aria-label={previewOpen ? 'Chat composer' : 'Open chat widget'}
                onClick={() => { if (!previewOpen) setPreviewOpen(true); }}
                className={`w-full text-left flex items-center gap-3 rounded-full bg-background border border-border-primary shadow-lg px-2.5 py-2 ${previewOpen ? 'mt-3' : ''}`}
              >
                <span className="w-8 h-8 rounded-full bg-surface-secondary flex items-center justify-center shrink-0">
                  <Plus className="w-4 h-4 text-text-primary" />
                </span>
                <span className="flex-1 text-sm font-light text-text-muted">Ask me anything</span>
                <span className="w-8 h-8 rounded-full bg-surface-secondary flex items-center justify-center shrink-0">
                  <ArrowUp className="w-4 h-4 text-text-primary" />
                </span>
              </button>
            )}

            {launcher !== 'spotlight' && (
            <div className="flex justify-end mt-3">
              <button
                type="button"
                aria-label={previewOpen ? 'Close chat widget' : 'Open chat widget'}
                onClick={() => setPreviewOpen((v) => !v)}
                className="w-12 h-12 rounded-full bg-[#a4552a] flex items-center justify-center"
              >
                {previewOpen ? <X className="w-5 h-5 text-white" /> : <MessageCircle className="w-5 h-5 text-white" />}
              </button>
            </div>
            )}

          </div>
        </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default ChatflowEdit;
