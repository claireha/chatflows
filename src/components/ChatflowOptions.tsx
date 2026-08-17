import React, { useState } from 'react';
import { ExternalLink, Info, Bold, Italic, Underline, Link2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const DEFAULT_COOKIE_TEXT =
  'This chat service uses a cookie to interact with you and maintain your chat history. Our service provider will monitor and record this chat for quality assurance (see their Privacy Policy).';
const DEFAULT_PROCESS_TEXT =
  'By using this chat service, you agree to the monitoring and recording of the chat and the processing of your personal data in accordance with our Privacy Policy.';

const SectionCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="rounded-lg border border-border-primary bg-background p-6">{children}</div>
);

const MiniToolbar: React.FC = () => (
  <div className="flex items-center gap-4 border-t border-border-secondary px-3 py-2">
    {[Bold, Italic, Underline, Link2].map((Icon, i) => (
      <button key={i} type="button" className="text-text-primary hover:text-text-link">
        <Icon className="w-4 h-4" />
      </button>
    ))}
  </div>
);

const ConsentBlock: React.FC<{
  title: string;
  description: React.ReactNode;
  enabled: boolean;
  onEnabledChange: (v: boolean) => void;
  text: string;
  onTextChange: (v: string) => void;
  defaultText: string;
  showBannerTiming?: boolean;
  showConsentType?: boolean;
  previewCta?: boolean;
  textLabel: string;
}> = ({
  title,
  description,
  enabled,
  onEnabledChange,
  text,
  onTextChange,
  defaultText,
  showBannerTiming,
  showConsentType,
  previewCta,
  textLabel,
}) => (
  <SectionCard>
    <div className="flex items-start gap-6">
      <div className="flex-1">
        <div className="flex items-center gap-1.5">
          <h3 className="text-base font-semibold text-text-primary">{title}</h3>
          <Info className="w-3.5 h-3.5 text-text-muted" />
        </div>
        <p className="mt-2 max-w-[620px] text-sm font-light leading-relaxed text-text-secondary">
          {description}
        </p>
      </div>
      <Switch checked={enabled} onCheckedChange={onEnabledChange} />
    </div>

    {enabled && (
      <div className="mt-5">
        {showBannerTiming && (
          <div>
            <span className="text-sm font-semibold text-text-primary">
              Select when the consent banner should show
            </span>
            <div className="mt-2 space-y-2">
              {['Show consent banner before visitor starts a chat', 'Show consent banner to visitor on exit intent'].map(
                (label, i) => (
                  <label key={label} className="flex items-start gap-2 text-sm font-light text-text-primary">
                    <input
                      type="radio"
                      name={`${title}-timing`}
                      defaultChecked={i === 0}
                      className="mt-0.5 accent-[#006de1]"
                    />
                    <span>{label}</span>
                  </label>
                ),
              )}
            </div>
          </div>
        )}

        {showConsentType && (
          <div className="max-w-[280px]">
            <span className="text-sm font-semibold text-text-primary">Consent type</span>
            <Select defaultValue="legitimate">
              <SelectTrigger className="mt-2 h-11 w-full rounded-md border-border-secondary text-sm font-light">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="legitimate">Legitimate interest</SelectItem>
                <SelectItem value="explicit">Explicit consent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-text-primary">{textLabel}</span>
              <Info className="w-3.5 h-3.5 text-text-muted" />
            </div>
            <div className="mt-2 rounded-md border border-border-secondary">
              <textarea
                value={text}
                onChange={(e) => onTextChange(e.target.value)}
                rows={5}
                className="w-full resize-none rounded-t-md bg-background p-3 text-sm font-light text-text-primary outline-none"
              />
              <MiniToolbar />
            </div>
            <button
              type="button"
              onClick={() => onTextChange(defaultText)}
              className="mt-3 rounded-md border border-border-secondary px-4 py-2 text-sm font-light text-text-primary hover:bg-surface-secondary"
            >
              Reset to Default
            </button>
          </div>

          <div>
            <span className="text-sm font-semibold text-text-primary">Preview</span>
            <div className="mt-2 rounded-md bg-surface-secondary p-4">
              <p className="text-sm font-light leading-relaxed text-text-secondary">{text}</p>
              {previewCta && (
                <button
                  type="button"
                  className="mt-4 rounded-full bg-[#006162] px-5 py-2 text-sm font-light text-white"
                >
                  I agree
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )}
  </SectionCard>
);

const ToggleRow: React.FC<{
  title: string;
  description: React.ReactNode;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}> = ({ title, description, checked, onCheckedChange }) => (
  <SectionCard>
    <div className="flex items-start gap-6">
      <div className="flex-1">
        <h3 className="text-base font-semibold text-text-primary">{title}</h3>
        <p className="mt-2 max-w-[640px] text-sm font-light leading-relaxed text-text-secondary">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  </SectionCard>
);

const ChatflowOptions: React.FC = () => {
  const [cookieConsent, setCookieConsent] = useState(true);
  const [cookieText, setCookieText] = useState(DEFAULT_COOKIE_TEXT);
  const [processConsent, setProcessConsent] = useState(true);
  const [processText, setProcessText] = useState(DEFAULT_PROCESS_TEXT);
  const [commsConsent, setCommsConsent] = useState(false);
  const [marketingContacts, setMarketingContacts] = useState(false);
  const [visitorVerification, setVisitorVerification] = useState(false);

  return (
    <div className="mx-auto w-full max-w-[840px] pb-20">
      <h2 className="text-2xl font-semibold text-text-primary">Options</h2>

      <h3 className="mt-6 text-base font-semibold text-text-primary">Language</h3>
      <div className="mt-4 max-w-[360px]">
        <span className="text-sm font-semibold text-text-primary">Choose a language</span>
        <p className="mt-1 text-xs font-light text-text-secondary">
          Learn about our{' '}
          <a href="#" className="font-semibold text-text-link hover:underline inline-flex items-center gap-1">
            supported languages <ExternalLink className="w-3 h-3" />
          </a>
        </p>
        <Select defaultValue="en">
          <SelectTrigger className="mt-2 h-11 w-full rounded-md border-border-secondary text-sm font-light">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
            <SelectItem value="fr">French</SelectItem>
            <SelectItem value="de">German</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <hr className="my-8 border-border-primary" />

      <div className="flex items-center gap-3">
        <h3 className="text-base font-semibold text-text-primary">Data privacy &amp; consent</h3>
        <a href="#" className="inline-flex items-center gap-1 text-sm font-semibold text-text-link hover:underline">
          Learn more <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="mt-4 space-y-4">
        <ConsentBlock
          title="Consent to collect chat cookies"
          description="If your website visitor leaves the page that they began chatting on but did not accept your website cookie consent banner, the chat widget will reset and the existing conversation will end. In order to maintain a chat conversation as a visitor navigates to other pages, the visitor must accept cookies."
          enabled={cookieConsent}
          onEnabledChange={setCookieConsent}
          text={cookieText}
          onTextChange={setCookieText}
          defaultText={DEFAULT_COOKIE_TEXT}
          showBannerTiming
          previewCta
          textLabel="Consent to collect chat cookies text"
        />

        <ConsentBlock
          title="Consent to process data"
          description="Use the text field below to explain why you need to store and process your customer's personal information (e.g., improve customer service, troubleshooting)."
          enabled={processConsent}
          onEnabledChange={setProcessConsent}
          text={processText}
          onTextChange={setProcessText}
          defaultText={DEFAULT_PROCESS_TEXT}
          showConsentType
          textLabel="Process consent text"
        />

        <ToggleRow
          title="Consent for communications"
          description="Use the text field below to ask customers if they consent to receive communications."
          checked={commsConsent}
          onCheckedChange={setCommsConsent}
        />
      </div>

      <hr className="my-8 border-border-primary" />

      <h3 className="text-base font-semibold text-text-primary">Marketing Contacts</h3>
      <div className="mt-4">
        <ToggleRow
          title="Set contacts created as marketing contacts"
          description="Any contacts created through this chatflow will automatically be set as marketing and will be eligible for marketing actions. They will also be added to your marketing contacts tier."
          checked={marketingContacts}
          onCheckedChange={setMarketingContacts}
        />
      </div>

      <hr className="my-8 border-border-primary" />

      <SectionCard>
        <h3 className="text-base font-semibold text-text-primary">Collect feedback from chat visitors</h3>
        <p className="mt-2 text-sm font-light leading-relaxed text-text-secondary">
          You can connect a CSAT survey to your chatflow and ask visitors for feedback when a chat conversation is
          closed.
        </p>
        <a href="#" className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-text-link hover:underline">
          Learn more <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <div>
          <button
            type="button"
            className="mt-4 rounded-md bg-foreground px-4 py-2.5 text-sm font-light text-background hover:opacity-90"
          >
            Create new survey
          </button>
        </div>
      </SectionCard>

      <hr className="my-8 border-border-primary" />

      <h3 className="text-base font-semibold text-text-primary">Security &amp; spam protection</h3>
      <div className="mt-4">
        <ToggleRow
          title="Visitor verification"
          description="Adds an invisible spam protection check when visitors start a chat. If suspicious activity is detected, visitors will be prevented from starting a conversation."
          checked={visitorVerification}
          onCheckedChange={setVisitorVerification}
        />
      </div>
    </div>
  );
};

export default ChatflowOptions;
