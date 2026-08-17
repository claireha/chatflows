import React, { useState } from 'react';
import { Bot, MessageSquare, Inbox, Zap, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RadioOption: React.FC<{
  label: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
  icon?: React.ReactNode;
}> = ({ label, description, selected, onSelect, icon }) => (
  <button
    onClick={onSelect}
    className={`w-full flex items-start gap-3 p-3.5 rounded-lg border transition-all text-left ${
      selected
        ? 'border-[#0066ff] bg-[#f0f6ff]'
        : 'border-border-primary bg-background hover:border-[#b0b0b0]'
    }`}
  >
    <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
      selected ? 'border-[#0066ff]' : 'border-[#b0b0b0]'
    }`}>
      {selected && <div className="w-2 h-2 rounded-full bg-[#0066ff]" />}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-medium text-text-primary">{label}</span>
      </div>
      {description && (
        <p className="text-xs text-text-secondary mt-0.5 font-light">{description}</p>
      )}
    </div>
  </button>
);

const ToggleRow: React.FC<{
  label: string;
  enabled: boolean;
  onToggle: () => void;
}> = ({ label, enabled, onToggle }) => (
  <div className="flex items-center justify-between py-3 border-b border-border-primary last:border-b-0">
    <span className="text-sm text-text-primary font-light">{label}</span>
    <button
      onClick={onToggle}
      className={`relative w-9 h-5 rounded-full transition-colors ${
        enabled ? 'bg-[#0066ff]' : 'bg-[#c4c4c4]'
      }`}
    >
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
        enabled ? 'translate-x-[18px]' : 'translate-x-0.5'
      }`} />
    </button>
  </div>
);

const AssignTabContent: React.FC = () => {
  const navigate = useNavigate();
  const [firstMessage, setFirstMessage] = useState<'ai' | 'bot' | 'none'>('ai');
  const [welcomeText, setWelcomeText] = useState('');
  const [handler, setHandler] = useState<'ai' | 'bot' | 'live'>('ai');
  const [destination, setDestination] = useState<'inbox' | 'helpdesk'>('inbox');
  const [collectEmail, setCollectEmail] = useState(true);
  const [saveCRM, setSaveCRM] = useState(true);
  const [createTicket, setCreateTicket] = useState(false);

  return (
    <div className="max-w-[680px] pb-16">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-[24px] font-light text-text-primary mb-2">Default</h2>
        <p className="text-sm font-light text-text-secondary mb-8">
          Set the default flow and settings for new conversations. Chat flows can override these settings for specific audiences or pages.
        </p>
      </div>

      {/* Section 2: After Visitor Replies */}
      <div className="bg-background border border-border-primary rounded-lg p-6 mb-4">
        <h3 className="text-[15px] font-semibold text-text-primary mb-1">After Visitor Replies</h3>
        <p className="text-xs text-text-secondary font-light mb-5">
          Choose who responds after the visitor sends their first message.
        </p>

        <div>
          <label className="text-sm font-medium text-text-primary mb-2.5 block">
            Who handles the conversation next?
          </label>
          <div className="space-y-2">
            <RadioOption
              label="AI Agent"
              description="Continue the conversation with an AI assistant"
              selected={handler === 'ai'}
              onSelect={() => setHandler('ai')}
            />
            <RadioOption
              label="Rules-based Bot"
              description="Hand off to a scripted chatflow"
              selected={handler === 'bot'}
              onSelect={() => setHandler('bot')}
            />
            <RadioOption
              label="Live Agent"
              description="Route the conversation to a team member"
              selected={handler === 'live'}
              onSelect={() => setHandler('live')}
            />
          </div>
        </div>
      </div>

      {/* Section 3: Conversation Destination */}
      <div className="bg-background border border-border-primary rounded-lg p-6 mb-4">
        <h3 className="text-[15px] font-semibold text-text-primary mb-1">Conversation Destination</h3>
        <p className="text-xs text-text-secondary font-light mb-5">
          This determines where conversations are managed internally.
        </p>

        <div>
          <label className="text-sm font-medium text-text-primary mb-2.5 block">
            Where should conversations be sent?
          </label>
          <div className="space-y-2">
            <RadioOption
              label="Inbox"
              description="Conversations appear in your shared team inbox"
              selected={destination === 'inbox'}
              onSelect={() => setDestination('inbox')}
            />
            <RadioOption
              label="Help Desk Workspace"
              description="Conversations are created as help desk tickets"
              selected={destination === 'helpdesk'}
              onSelect={() => setDestination('helpdesk')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignTabContent;
