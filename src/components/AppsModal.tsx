import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, ExternalLink } from 'lucide-react';

interface AppsModalProps {
  open: boolean;
  onClose: () => void;
}

interface App {
  name: string;
  installs: string;
  description: string;
  slug: string;
  color: string;
  beta?: boolean;
}

const APPS: App[] = [
  { name: 'Google Drive for Breeze', installs: '5K installs', description: 'Get answers from all your work apps within Breeze Assistant', slug: 'googledrive', color: '#1a73e8' },
  { name: 'Microsoft Teams for Breeze', installs: '700+ installs', description: 'Get answers from all your work apps within Breeze Assistant', slug: 'microsoftteams', color: '#4b53bc' },
  { name: 'SharePoint for Breeze', installs: '600+ installs', description: 'Get answers from all your work apps within Breeze Assistant', slug: 'microsoftsharepoint', color: '#0078d4' },
  { name: 'OneDrive for Breeze', installs: '500+ installs', description: 'Get answers from all your work apps within Breeze Assistant', slug: 'microsoftonedrive', color: '#0364b8' },
  { name: 'Asana for Breeze', installs: '400+ installs', description: 'Get answers from Asana within Breeze Assistant', slug: 'asana', color: '#f06a6a' },
  { name: 'Confluence for Breeze', installs: '300+ installs', description: 'Get answers from all your work apps within Breeze Assistant', slug: 'confluence', color: '#2684ff' },
  { name: 'Dropbox for Breeze', installs: '300+ installs', description: 'Get answers from Dropbox within Breeze Assistant', slug: 'dropbox', color: '#0061ff' },
  { name: 'Linear for Breeze', installs: '200+ installs', description: 'Get answers from Linear within Breeze Assistant', slug: 'linear', color: '#5e6ad2' },
  { name: 'Jira for Breeze', installs: '200+ installs', description: 'Get answers from all your work apps within Breeze Assistant', slug: 'jira', color: '#2684ff' },
  { name: 'Smartsheet for Breeze', installs: '90+ installs', description: 'Get answers from Smartsheet within Breeze Assistant', slug: 'smartsheet', color: '#1f3a68' },
  { name: 'Box for Breeze', installs: '80+ installs', description: 'Get answers from Box within Breeze Assistant', slug: 'box', color: '#0061d5' },
  { name: 'GitBook for Breeze', installs: '50+ installs', description: 'Get answers from GitBook within Breeze Assistant', slug: 'gitbook', color: '#3884ff' },
  { name: 'Slack for Breeze', installs: '40+ installs', description: 'Get answers from Slack within Breeze Assistant', slug: 'slack', color: '#611f69', beta: true },
  { name: 'Azure DevOps for Breeze', installs: '30+ installs', description: 'Get answers from all your work apps within Breeze Assistant', slug: 'azuredevops', color: '#0078d7' },
  { name: 'Guru for Breeze', installs: '20+ installs', description: 'Get answers from Guru within Breeze Assistant', slug: 'guru', color: '#111111' },
  { name: 'ReadMe for Breeze', installs: '10+ installs', description: 'Get answers from ReadMe within Breeze Assistant', slug: 'readme', color: '#018ef5' },
  { name: 'Productboard for Breeze', installs: '10+ installs', description: 'Get answers from Productboard within Breeze Assistant', slug: 'productboard', color: '#ffcb00' },
  { name: 'Helpjuice for Breeze', installs: '10+ installs', description: 'Get answers from Helpjuice within Breeze Assistant', slug: 'helpjuice', color: '#1f8ceb' },
  { name: 'Document360 for Breeze', installs: '<10 installs', description: 'Get answers from Document360 within Breeze Assistant', slug: 'document360', color: '#7d2ae8' },
];

const AppLogo: React.FC<{ app: App }> = ({ app }) => {
  const [errored, setErrored] = useState(false);
  if (errored) {
    return (
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-[20px] font-bold"
        style={{ background: app.color }}
      >
        {app.name.charAt(0)}
      </div>
    );
  }
  return (
    <img
      src={`https://cdn.simpleicons.org/${app.slug}/${app.color.replace('#', '')}`}
      alt=""
      className="w-10 h-10 object-contain"
      onError={() => setErrored(true)}
    />
  );
};

export const AppsModal: React.FC<AppsModalProps> = ({ open, onClose }) => {
  const [query, setQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const filtered = APPS.filter(a => a.name.toLowerCase().includes(query.toLowerCase()));
  const visible = showAll || query ? filtered : filtered.slice(0, 6);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden flex flex-col font-lexend p-0 bg-[hsl(var(--muted))]">
        <DialogHeader className="px-6 pt-5 pb-3 bg-background border-b border-border-primary">
          <DialogTitle className="text-[20px] font-semibold text-text-primary">
            Apps for Breeze Assistant
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto">
          <div className="px-6 pt-6 pb-4 flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="w-full h-11 pl-5 pr-11 rounded-full border border-border-primary bg-background text-[14px] outline-none focus:ring-2 focus:ring-ring/30"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            </div>
            <div className="text-[14px] text-text-secondary whitespace-nowrap">
              {filtered.length} results
            </div>
          </div>

          <div className="px-6 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visible.map((app) => (
                <button
                  key={app.name}
                  className="text-left border border-border-primary rounded-xl p-5 bg-background hover:shadow-md transition-shadow relative"
                >
                  {app.beta && (
                    <span className="absolute -top-2 left-4 px-2 py-0.5 rounded text-[10px] font-bold text-white"
                      style={{ background: '#7c3aed' }}
                    >
                      BETA
                    </span>
                  )}
                  <div className="w-12 h-12 flex items-center justify-center mb-4">
                    <AppLogo app={app} />
                  </div>
                  <div className="text-[15px] font-semibold text-text-primary">{app.name}</div>
                  <div className="text-[12px] text-text-secondary mt-1">
                    By HubSpot &nbsp;&nbsp; {app.installs}
                  </div>
                  <div className="text-[13px] text-text-secondary mt-3 leading-relaxed min-h-[40px]">
                    {app.description}
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <span className="px-3 py-1 rounded-full bg-[hsl(var(--muted))] text-[12px] font-medium text-text-primary">
                      App
                    </span>
                    <span className="px-3 py-1 rounded-full text-[12px] font-semibold text-white flex items-center gap-1"
                      style={{ background: 'linear-gradient(135deg,#f15a3a,#e91e63)' }}
                    >
                      ✦ Breeze
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {!showAll && !query && filtered.length > 6 && (
              <div className="flex justify-center mt-6 mb-2">
                <button
                  onClick={() => setShowAll(true)}
                  className="text-[14px] font-semibold text-text-primary hover:underline"
                >
                  See more
                </button>
              </div>
            )}
          </div>

          <div className="mx-6 mb-6 mt-2 bg-background border border-border-primary rounded-xl py-10 px-6 text-center">
            <div className="text-[18px] font-semibold text-text-primary">Explore the Marketplace</div>
            <div className="text-[14px] text-text-secondary mt-2">
              Can't find what you're looking for? Browse all available products.
            </div>
            <button className="inline-flex items-center gap-2 mt-5 px-5 h-11 rounded-md bg-[hsl(var(--text-primary))] text-white text-[14px] font-semibold hover:opacity-90 transition-opacity">
              Go to Marketplace
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppsModal;
