import React, { useState } from 'react';
import { ChevronDown, Pencil, ExternalLink } from 'lucide-react';
import agentAvatar from '@/assets/agent-avatar.png';

const CustomerAgentIdentity: React.FC = () => {
  const [agentName, setAgentName] = useState('Luma');
  const [personality, setPersonality] = useState('Friendly');
  const [language, setLanguage] = useState('Auto-detect (from the customer\'s first message)');

  return (
    <div className="flex-1 px-10 py-8 max-w-[800px]">
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-[22px] font-semibold text-text-primary">Identity</h2>
        <a href="#" className="inline-flex items-center gap-1 text-sm font-medium text-[#d63384] hover:underline">
          <span className="text-base leading-none">✦</span>
          Ask Breeze
        </a>
      </div>
      <p className="text-sm text-text-secondary font-light mb-8 leading-relaxed">
        Define how your agent shows up everywhere. Set shared defaults so every interaction feels consistent and on-brand.
      </p>


      {/* Avatar */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-text-primary mb-3">Avatar</h3>
        <div className="w-10 h-10">
          <img src={agentAvatar} alt="Agent avatar" className="w-10 h-10 rounded-full object-cover" loading="lazy" width={40} height={40} />
        </div>
      </div>

      {/* Agent name */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-text-primary mb-1">
          Agent name <span className="text-red-500">*</span>
        </h3>
        <p className="text-xs text-text-secondary font-light mb-2">
          The name customers see when chatting with your agent
        </p>
        <input
          type="text"
          value={agentName}
          onChange={(e) => setAgentName(e.target.value)}
          className="w-full max-w-[480px] px-3 py-2.5 border border-border-primary rounded-md text-sm font-light text-text-primary bg-background focus:outline-none focus:ring-1 focus:ring-text-primary"
        />
      </div>

      {/* Brand */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-text-primary mb-2">Brand</h3>
        <div className="relative max-w-[480px]">
          <div className="w-full flex items-center gap-2 px-3 py-2 border border-border-primary rounded-md bg-background">
            <span className="text-lg">🪴</span>
            <span className="text-sm font-light text-text-secondary flex-1">Zen Plant Care</span>
            <ChevronDown className="w-4 h-4 text-text-secondary" />
          </div>
        </div>
        <div className="flex items-center gap-4 mt-3">
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border-primary rounded-md text-sm font-light text-text-primary hover:bg-surface-secondary">
            <Pencil className="w-3.5 h-3.5" />
            Edit Brand
          </button>
          <a href="#" className="inline-flex items-center gap-1 text-sm font-light text-[#006162] underline">
            Learn how Brand Identity works <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Personality */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-text-primary mb-1">
          Personality <span className="text-red-500">*</span>
        </h3>
        <p className="text-xs text-text-secondary font-light mb-2">
          How your agent behaves in conversations
        </p>
        <div className="relative max-w-[480px]">
          <select
            value={personality}
            onChange={(e) => setPersonality(e.target.value)}
            className="w-full appearance-none px-3 py-2.5 border border-border-primary rounded-md text-sm font-light text-text-primary bg-background focus:outline-none focus:ring-1 focus:ring-text-primary"
          >
            <option>Friendly</option>
            <option>Professional</option>
            <option>Casual</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
        </div>
      </div>

      {/* Language */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-text-primary mb-1">Language</h3>
        <p className="text-xs text-text-secondary font-light mb-2">
          The language your agent responds in, excluding voice
        </p>
        <div className="relative max-w-[480px]">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full appearance-none px-3 py-2.5 border border-border-primary rounded-md text-sm font-light text-text-primary bg-background focus:outline-none focus:ring-1 focus:ring-text-primary"
          >
            <option>Auto-detect (from the customer's first message)</option>
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
        </div>
      </div>

      {/* Save button */}
      <button className="px-5 py-2 bg-[#e0e0e0] text-text-secondary text-sm font-medium rounded-md cursor-default mb-10">
        Save
      </button>

      {/* Delete */}
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-1">Delete Luma</h3>
        <p className="text-xs text-text-secondary font-light mb-3">This action cannot be undone</p>
        <button className="px-4 py-2 bg-surface-secondary text-text-muted text-sm font-light rounded-md cursor-not-allowed">
          Delete
        </button>
      </div>

    </div>
  );
};

export default CustomerAgentIdentity;
