import React from 'react';
import { ExternalLink, Info, ArrowRight } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const KB_ARTICLES = [
  'Getting started with your account',
  'Common billing questions',
  'How to contact support',
];

export const KB_CATEGORIES = [
  { name: 'Getting started', count: 8 },
  { name: 'Billing', count: 8 },
  { name: 'Troubleshooting', count: 9 },
];

export const KB_SAMPLE_ARTICLES = [
  'How to setup your account',
  'Managing your subscription plan',
  'Data privacy and security',
];

export const KB_SAMPLE_CATEGORIES = [
  { name: 'Getting Started', count: 20 },
  { name: 'Account & Billing', count: 5 },
  { name: 'Troubleshooting & FAQs', count: 12 },
];


interface Props {
  enabled: boolean;
  onEnabledChange: (v: boolean) => void;
  library: string;
  onLibraryChange: (v: string) => void;
  recommendations: string;
  onRecommendationsChange: (v: string) => void;
  spotlight?: boolean;
}

const ChatflowKnowledgeBase: React.FC<Props> = ({
  enabled,
  onEnabledChange,
  library,
  onLibraryChange,
  recommendations,
  onRecommendationsChange,
  spotlight,
}) => (
  <div className="max-w-[760px]">
    {spotlight && (
      <div className="mb-8 rounded-lg border border-amber-300 bg-amber-50 px-6 py-5">
        <h3 className="text-base font-semibold text-text-primary">
          Knowledge Base is only visible on mobile with Spotlight
        </h3>
        <p className="mt-2 text-sm font-light text-text-primary leading-relaxed">
          When the Spotlight launcher is selected, visitors can only access the Knowledge Base on mobile devices. On
          desktop, the Help tab is not available with Spotlight.
        </p>
      </div>
    )}

    <div className="flex items-start gap-6">
      <div className="flex-1">
        <h2 className="text-2xl font-semibold text-text-primary">Knowledge Base</h2>
        <p className="mt-2 text-sm font-light text-text-secondary">
          Your visitors can browse and search your library articles
        </p>
      </div>
      <Switch checked={enabled} onCheckedChange={onEnabledChange} className="mt-2" />
    </div>

    {!enabled ? (
      <div className="mt-10 flex flex-col gap-8">
        {[
          'Let customers find and read help articles right in the widget.',
          'Help your support team by deflecting common questions.',
        ].map((line) => (
          <div key={line} className="flex items-start gap-5">
            <ArrowRight className="w-5 h-5 text-[#516f90] shrink-0 mt-0.5" />
            <p className="text-base font-semibold text-text-primary">{line}</p>
          </div>
        ))}
      </div>
    ) : (
      <>
        <div className="mt-8">
          <label className="text-sm font-semibold text-text-primary">Knowledge Base</label>
          <Select value={library} onValueChange={onLibraryChange}>
            <SelectTrigger className="mt-2 h-11 font-light">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="help-center">Help Center</SelectItem>
              <SelectItem value="product-docs">Product Documentation</SelectItem>
              <SelectItem value="billing">Billing & Accounts</SelectItem>
            </SelectContent>
          </Select>
          <p className="mt-2 text-sm font-light text-text-secondary">
            To manage and edit articles, visit your{' '}
            <a href="#" className="font-semibold text-text-link hover:underline inline-flex items-center gap-1">
              knowledge base settings <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </p>
        </div>

        <div className="mt-8">
          <div className="flex items-center gap-1.5">
            <label className="text-sm font-semibold text-text-primary">Search recommendations</label>
            <Info className="w-3.5 h-3.5 text-text-muted" />
          </div>
          <Select value={recommendations} onValueChange={onRecommendationsChange}>
            <SelectTrigger className="mt-2 h-11 font-light">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="highest-rated">Highest rated articles</SelectItem>
              <SelectItem value="most-viewed">Most viewed articles</SelectItem>
              <SelectItem value="recently-published">Recently published articles</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </>
    )}

  </div>
);

export default ChatflowKnowledgeBase;
