import React, { useState } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GlobalToolbar } from '@/components/GlobalToolbar';
import { LeftNavigation } from '@/components/LeftNavigation';
import { useBookmarks } from '@/hooks/useBookmarks';
import { navigationItems } from '@/data/navigationData';

const bulletPoints = [
  { bold: 'Instant and reliable', text: 'Get your agent trained up and running in minutes.' },
  { bold: 'On-brand', text: 'Customize responses to sound like your team.' },
  { bold: 'Omnichannel', text: 'Engage customers across web & in-app chat, email, WhatsApp, and more.' },
  { bold: '28 days of free access.', text: 'Try your agent live and explore usage with no credit impact.' },
];

const testimonials = [
  {
    quote: "The agent makes people feel welcome by responding right away, and even when it can't, customers are greeted with a friendly 'hello' and feel heard. Often the agent solves the problem on the spot.",
    name: 'MAX BOLTEN',
    title: 'Head of Marketing, Stübben',
  },
  {
    quote: "It helps us convert faster. The faster we can provide accurate information, the more likely they are to become customers.",
    name: 'CHRIS PATULLO',
    title: 'Founder & CEO, Football Play Card',
  },
  {
    quote: "We lowered support tickets by 77% and improved conversion rate through 24-hour support. It's a key tool for revenue and satisfaction.",
    name: 'PIETRO RIPANTI',
    title: 'CMO, Nutribees',
  },
];

const CustomerAgent: React.FC = () => {
  const navigate = useNavigate();
  const [isNavExpanded, setIsNavExpanded] = useState(() => localStorage.getItem('nav-expanded') !== 'false');
  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();

  const isItemBookmarked = (itemId: string) => isBookmarked(itemId, 'main-nav');

  const allNavItems = navigationItems.flatMap(n => n.sections?.flatMap(s => s.items) || []);
  const bookmarkedSections = bookmarks.length > 0 ? [{
    title: 'Saved Items',
    items: bookmarks.map(b => ({ id: b.id, label: b.label, href: b.href || allNavItems.find(i => i.id === b.id)?.href }))
  }] : [];

  const handleBookmarkClick = (itemId: string, itemLabel: string, sectionTitle: string) => {
    const href = navigationItems.flatMap(n => n.sections?.flatMap(s => s.items) || []).find(i => i.id === itemId)?.href;
    toggleBookmark({ id: itemId, label: itemLabel, href }, 'main-nav', sectionTitle);
  };

  return (
    <div className="min-h-screen bg-background font-lexend">
      <GlobalToolbar isNavExpanded={isNavExpanded} />
      <LeftNavigation
        isExpanded={isNavExpanded}
        onToggleExpanded={() => { const next = !isNavExpanded; setIsNavExpanded(next); localStorage.setItem('nav-expanded', next ? 'true' : 'false'); }}
        bookmarkedSections={bookmarkedSections}
        onBookmarkClick={handleBookmarkClick}
        isItemBookmarked={isItemBookmarked}
      />

      <main
        className={`transition-all duration-200 ${isNavExpanded ? 'ml-[236px]' : 'ml-16'} max-md:ml-0`}
        style={{ paddingTop: 'var(--toolbar-height)' }}
      >
        {/* Header bar */}
        <div className="border-b border-border-primary bg-background px-8 py-5 flex items-center gap-3">
          <h1 className="text-[20px] font-semibold text-text-primary">Customer Agent</h1>
          <span className="text-[10px] font-medium bg-[#ff5c35] text-white px-2 py-0.5 rounded-full">Uses Credits</span>
        </div>

        {/* Hero section */}
        <div className="px-8 py-12 max-w-[1200px]">
          <div className="flex gap-12 items-start">
            <div className="flex-1 min-w-0">
              <h2 className="text-[32px] font-bold text-text-primary leading-tight mb-8">
                Resolve over 65% of conversations 24/7 with Customer Agent for Marketing, Sales & Service
              </h2>

              <div className="space-y-4 mb-8">
                {bulletPoints.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <ArrowRight className="w-4 h-4 text-text-secondary mt-1 flex-shrink-0" />
                    <p className="text-sm text-text-primary font-light">
                      <strong className="font-semibold">{item.bold}</strong>: {item.text}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/customer-agent/setup')}
                className="px-6 py-3 bg-[#141414] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                Set up your agent
              </button>
            </div>

            {/* Video placeholder */}
            <div className="w-[420px] h-[280px] rounded-xl overflow-hidden flex-shrink-0 relative bg-[#f5f5f5] border border-border-primary flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-[#ff5c35] flex items-center justify-center cursor-pointer hover:bg-[#e0502e] transition-colors">
                <Play className="w-7 h-7 text-white ml-1" fill="white" />
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials section */}
        <div className="bg-[#fff5f2] px-8 py-12">
          <h3 className="text-[20px] font-semibold text-text-primary text-center mb-10">
            How real teams are using Customer Agent — in their own words
          </h3>

          <div className="grid grid-cols-3 gap-8 max-w-[1200px]">
            {testimonials.map((t, i) => (
              <div key={i} className="flex flex-col">
                <p className="text-sm text-text-primary font-light leading-relaxed mb-6 flex-1">
                  {t.quote}
                </p>
                <div>
                  <p className="text-xs font-bold text-text-primary tracking-wide">{t.name}</p>
                  <p className="text-xs font-light text-text-secondary">{t.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerAgent;
