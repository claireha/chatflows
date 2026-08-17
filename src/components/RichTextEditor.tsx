import React, { useRef, useCallback, useEffect, useState } from 'react';
import { Link2, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const USER_TOKENS = [
  { value: 'firstname', label: 'First name' },
  { value: 'lastname', label: 'Last name' },
  { value: 'email', label: 'Email' },
  { value: 'company', label: 'Company name' },
  { value: 'jobtitle', label: 'Job title' },
  { value: 'phone', label: 'Phone number' },
];

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  defaultValue?: string;
  disabled?: boolean;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, defaultValue, disabled = false, className }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef(false);
  const [personalizeOpen, setPersonalizeOpen] = useState(false);
  const [token, setToken] = useState('');
  const [fallback, setFallback] = useState('');

  const insertToken = () => {
    const selected = USER_TOKENS.find((t) => t.value === token);
    if (!selected) return;
    const label = fallback.trim() ? `${selected.label} (${fallback.trim()})` : selected.label;
    const html = `<span class="personalization-token" contenteditable="false" data-token="contact.${selected.value}">${label}</span>&nbsp;`;
    editorRef.current?.focus();
    document.execCommand('insertHTML', false, html);
    if (editorRef.current) {
      isInternalChange.current = true;
      onChange(editorRef.current.innerHTML);
    }
    setPersonalizeOpen(false);
    setToken('');
    setFallback('');
  };


  useEffect(() => {
    if (editorRef.current && !isInternalChange.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value;
      }
    }
    isInternalChange.current = false;
  }, [value]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      isInternalChange.current = true;
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const execCommand = (command: string, val?: string) => {
    if (disabled) return;
    editorRef.current?.focus();
    document.execCommand(command, false, val);
  };

  const handleLink = () => {
    if (disabled) return;
    const url = prompt('Enter URL:');
    if (!url) return;
    const trimmed = url.trim();
    // Only allow safe http(s) and mailto schemes; block javascript:, data:, etc.
    if (!/^(https?:\/\/|mailto:)/i.test(trimmed)) {
      alert('Only http://, https://, and mailto: URLs are allowed.');
      return;
    }
    execCommand('createLink', trimmed);
  };


  const toolbarBtnClass = cn(
    "p-1.5 rounded hover:bg-muted transition-colors",
    disabled && "opacity-50 cursor-not-allowed"
  );

  return (
    <div className={cn(
      "w-full max-w-[520px] border border-border-primary rounded-md bg-background overflow-hidden",
      disabled && "opacity-50 cursor-not-allowed",
      className
    )}>
      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={handleInput}
        className={cn(
          "px-3 py-2 text-sm font-light text-text-primary min-h-[80px] outline-none",
          disabled && "text-text-muted cursor-not-allowed"
        )}
        suppressContentEditableWarning
      />
      <div className="flex items-center gap-0.5 px-2 py-0.5 border-t border-border-primary">
        <button type="button" className={toolbarBtnClass} onClick={() => execCommand('bold')} disabled={disabled}>
          <span className="text-text-primary text-xs font-bold">B</span>
        </button>
        <button type="button" className={toolbarBtnClass} onClick={() => execCommand('italic')} disabled={disabled}>
          <span className="text-text-primary text-xs italic font-serif">I</span>
        </button>
        <button type="button" className={toolbarBtnClass} onClick={() => execCommand('underline')} disabled={disabled}>
          <span className="text-text-primary text-xs underline">U</span>
        </button>
        <div className="w-px h-3.5 bg-border-primary mx-1" />
        <button type="button" className={toolbarBtnClass} onClick={handleLink} disabled={disabled}>
          <Link2 className="w-3.5 h-3.5 text-text-primary" />
        </button>

        <Popover open={personalizeOpen} onOpenChange={setPersonalizeOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              disabled={disabled}
              className={cn(
                "ml-auto flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold text-text-primary hover:bg-muted transition-colors",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              Personalize
              <ChevronDown className="w-3 h-3" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-4">
            <p className="text-base font-semibold text-text-primary">Insert personalization token</p>

            <div className="mt-4">
              <label className="text-sm font-semibold text-text-primary">
                User token <span className="text-text-primary">*</span>
              </label>
              <Select value={token} onValueChange={setToken}>
                <SelectTrigger className="mt-1.5 rounded-full">
                  <SelectValue placeholder="Search" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {USER_TOKENS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4">
              <label className="text-sm font-semibold text-text-primary">Fallback value</label>
              <Input
                value={fallback}
                onChange={(e) => setFallback(e.target.value)}
                placeholder="Enter fallback value (optional)"
                className="mt-1.5 rounded-full"
              />
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={insertToken}
                disabled={!token}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-light transition-colors",
                  token
                    ? "bg-text-primary text-background hover:opacity-90"
                    : "bg-muted text-text-muted cursor-not-allowed"
                )}
              >
                Insert
              </button>
              <button
                type="button"
                onClick={() => setPersonalizeOpen(false)}
                className="rounded-full border border-text-primary px-4 py-1.5 text-sm font-light text-text-primary hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default RichTextEditor;
