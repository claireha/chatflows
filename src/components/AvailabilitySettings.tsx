import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Clock, Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const DAYS = ['Everyday', 'Mon - Fri', 'Sat - Sun', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const TIME_OPTIONS = [
  '12:00 AM', '12:30 AM', '1:00 AM', '1:30 AM', '2:00 AM', '2:30 AM', '3:00 AM', '3:30 AM',
  '4:00 AM', '4:30 AM', '5:00 AM', '5:30 AM', '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM',
  '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM',
  '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM',
];

interface CustomHoursEntry {
  id: number;
  day: string;
  start: string;
  end: string;
}

let nextId = 3;

export type PreviewState = 'available' | 'away' | 'capacity' | 'outside';

export interface PreviewData {
  state: PreviewState;
  message: string;
  behavior: 'message' | 'hide' | 'nothing' | 'return' | 'show' | 'none';
}

interface AvailabilitySettingsProps {
  onReplyTimeChange?: (subtitle: string) => void;
  previewState?: PreviewState;
  onPreviewStateChange?: (state: PreviewState) => void;
  onPreviewDataChange?: (data: PreviewData) => void;
}

const AvailabilitySettings: React.FC<AvailabilitySettingsProps> = ({ onReplyTimeChange, previewState, onPreviewStateChange, onPreviewDataChange }) => {
  const [availabilityMode, setAvailabilityMode] = useState<'team' | 'hours'>('team');
  const [is24_7, setIs24_7] = useState(true);
  const [customHours, setCustomHours] = useState<CustomHoursEntry[]>([
    { id: 1, day: 'Monday', start: '9:00 AM', end: '5:00 PM' },
    { id: 2, day: 'Tuesday', start: '9:00 AM', end: '5:00 PM' },
  ]);

  // Visitor behavior state
  const [replyTimeOption, setReplyTimeOption] = useState<'show' | 'none'>('show');
  const [replyTime, setReplyTime] = useState('Typically replies in a few minutes');
  const [customReplyValue, setCustomReplyValue] = useState('5');
  const [customReplyUnit, setCustomReplyUnit] = useState('minutes');

  // Notify parent of reply time changes
  useEffect(() => {
    if (replyTimeOption === 'none') {
      onReplyTimeChange?.('');
      return;
    }
    if (replyTime === 'Typically replies in a few minutes') {
      onReplyTimeChange?.('We typically reply in a few minutes');
    } else if (replyTime === 'Typically replies in a few hours') {
      onReplyTimeChange?.('We typically reply in a few hours');
    } else if (replyTime === 'Typically replies within 24 hours') {
      onReplyTimeChange?.('We typically reply in a day');
    } else if (replyTime === 'Custom response') {
      onReplyTimeChange?.(`We typically reply in ${customReplyValue} ${customReplyUnit}`);
    }
  }, [replyTimeOption, replyTime, customReplyValue, customReplyUnit, onReplyTimeChange]);
  const [awayBehavior, setAwayBehavior] = useState<'message' | 'hide' | 'nothing'>('message');
  const [awayMessage, setAwayMessage] = useState("We're currently away. Leave a message and we'll get back to you.");
  const [capacityBehavior, setCapacityBehavior] = useState<'message' | 'hide' | 'nothing'>('message');
  const [capacityMessage, setCapacityMessage] = useState("Thank you for your message. Our team is busy right now but we'll get back to you as soon as we can.");
  const [outsideBehavior, setOutsideBehavior] = useState<'return' | 'message' | 'hide'>('return');
  const [outsideMessage, setOutsideMessage] = useState("We're away right now, but we'll get back to you as soon as we can.");
  const [allowOfflineMessaging, setAllowOfflineMessaging] = useState(true);
  const [offlineAutoReply, setOfflineAutoReply] = useState("Thanks for reaching out! We're currently offline but will respond as soon as we're back.");

  // Push preview data to parent whenever relevant state changes
  useEffect(() => {
    if (!previewState || !onPreviewDataChange) return;
    
    if (previewState === 'available') {
      onPreviewDataChange({ state: 'available', message: '', behavior: replyTimeOption });
    } else if (previewState === 'away') {
      onPreviewDataChange({ state: 'away', message: awayBehavior === 'message' ? awayMessage : '', behavior: awayBehavior });
    } else if (previewState === 'capacity') {
      onPreviewDataChange({ state: 'capacity', message: capacityBehavior === 'message' ? capacityMessage : '', behavior: capacityBehavior });
    } else if (previewState === 'outside') {
      onPreviewDataChange({ state: 'outside', message: outsideBehavior === 'message' ? outsideMessage : '', behavior: outsideBehavior });
    }
  }, [previewState, awayBehavior, awayMessage, capacityBehavior, capacityMessage, outsideBehavior, outsideMessage, replyTimeOption, onPreviewDataChange]);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    available: false,
    away: false,
    capacity: false,
    outside: false,
  });

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updateCustomHour = (id: number, field: keyof CustomHoursEntry, value: string) => {
    setCustomHours(prev => prev.map(h => h.id === id ? { ...h, [field]: value } : h));
  };

  const removeCustomHour = (id: number) => {
    setCustomHours(prev => prev.filter(h => h.id !== id));
  };

  const addCustomHour = () => {
    setCustomHours(prev => [...prev, { id: nextId++, day: 'Monday', start: '9:00 AM', end: '5:00 PM' }]);
  };

  const radioClasses = (selected: boolean) =>
    `w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${selected ? 'border-[#141414]' : 'border-[#8a8a8a]'}`;

  const cardClasses = (state: PreviewState) => {
    const isActive = previewState === state;
    return `border rounded-lg p-5 bg-background transition-all duration-200 ${isActive ? 'border-[#016162] ring-1 ring-[#016162]/20' : 'border-border-primary'}`;
  };

  const previewButtonClasses = (state: PreviewState) => {
    const isActive = previewState === state;
    return `text-xs font-medium px-3 py-1 rounded-full transition-all duration-200 ${
      isActive 
        ? 'bg-black text-white border border-black' 
        : 'bg-white text-black border border-black hover:bg-gray-100'
    }`;
  };

  const selectClasses = "appearance-none border border-[#c4c4c4] rounded-lg bg-white px-4 py-2.5 text-sm font-normal text-text-primary cursor-pointer pr-8";

  return (
    <div className="max-w-[680px]">
      {/* Section 1: Availability Settings */}
      <div className="mb-10">
        <h3 className="text-lg font-bold text-text-primary mb-1">Channel Availability</h3>
        <p className="text-sm font-light text-text-secondary mb-5">Choose when visitors can send messages.</p>

        <div className="space-y-3">
          {/* Option: Team member availability */}
          <button
            onClick={() => setAvailabilityMode('team')}
            className="w-full text-left transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className={radioClasses(availabilityMode === 'team')}>
                {availabilityMode === 'team' && <div className="w-2 h-2 rounded-full bg-[#141414]" />}
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">Based on team member availability</p>
                <p className="text-xs font-light text-text-secondary mt-0.5">Chat is available when at least one user in the inbox is set to available.</p>
              </div>
            </div>
          </button>

          {/* Option: Operating hours */}
          <div>
            <button
              onClick={() => setAvailabilityMode('hours')}
              className="w-full text-left"
            >
              <div className="flex items-start gap-3">
                <div className={radioClasses(availabilityMode === 'hours')}>
                  {availabilityMode === 'hours' && <div className="w-2 h-2 rounded-full bg-[#141414]" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">Based on chat operating hours</p>
                  <p className="text-xs font-light text-text-secondary mt-0.5">Chat is available during specific hours.</p>
                </div>
              </div>
            </button>

            {/* Expanded: operating hours config */}
            {availabilityMode === 'hours' && (
              <div className="mt-5 ml-7 space-y-4">
                {/* 24/7 toggle */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIs24_7(true)}
                    className={`px-4 py-1.5 text-sm rounded-l border transition-colors ${is24_7 ? 'bg-[#141414] text-white border-[#141414] font-medium' : 'bg-background text-text-primary border-[#8a8a8a] font-light'}`}
                  >
                    24/7 availability
                  </button>
                  <button
                    onClick={() => setIs24_7(false)}
                    className={`px-4 py-1.5 text-sm rounded-r border -ml-3 transition-colors ${!is24_7 ? 'bg-[#141414] text-white border-[#141414] font-medium' : 'bg-background text-text-primary border-[#8a8a8a] font-light'}`}
                  >
                    Set custom hours
                  </button>
                </div>

                {/* Custom hours rows */}
                {!is24_7 && (
                  <div className="space-y-3">
                    {customHours.map((entry) => (
                      <div key={entry.id} className="flex items-center gap-3">
                        {/* Day selector */}
                        <div className="relative">
                          <select
                            value={entry.day}
                            onChange={(e) => updateCustomHour(entry.id, 'day', e.target.value)}
                            className={`${selectClasses} w-[120px]`}
                          >
                            {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                          <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                        </div>

                        <span className="text-sm text-text-secondary font-light">from</span>

                        {/* Start time */}
                        <div className="relative">
                          <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                          <select
                            value={entry.start}
                            onChange={(e) => updateCustomHour(entry.id, 'start', e.target.value)}
                            className={`${selectClasses} w-[130px] pl-8`}
                          >
                            {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                          <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                        </div>

                        <span className="text-sm text-text-secondary font-light">to</span>

                        {/* End time */}
                        <div className="relative">
                          <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                          <select
                            value={entry.end}
                            onChange={(e) => updateCustomHour(entry.id, 'end', e.target.value)}
                            className={`${selectClasses} w-[130px] pl-8`}
                          >
                            {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                          <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                        </div>

                        {/* Delete */}
                        <button
                          onClick={() => removeCustomHour(entry.id)}
                          className="p-1.5 text-text-muted hover:text-text-primary transition-colors shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    {/* Add hours link */}
                    <button
                      onClick={addCustomHour}
                      className="text-sm font-medium text-[#0091ae] hover:underline"
                    >
                      + Add hours
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section 2: Availability Behavior */}
      <div className="mb-10">
        <h3 className="text-lg font-bold text-text-primary mb-1">Availability Behavior</h3>
        <p className="text-sm font-light text-text-secondary mb-5">Configure how the chat widget behaves in different scenarios.</p>

        <div className="space-y-5">
          {/* 1. When available */}
          <div className={cardClasses('available')}>
            <div className="flex items-center justify-between">
              <button onClick={() => toggleSection('available')} className="flex items-center gap-3 flex-1">
                {expandedSections.available ? <ChevronDown className="w-4 h-4 text-text-primary" /> : <ChevronRight className="w-4 h-4 text-text-primary" />}
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-text-primary">When available</h4>
                    <span className="w-2 h-2 rounded-full bg-[#00823a]" />
                  </div>
                  <p className="text-xs font-light text-text-secondary mt-0.5">Configure reply time visibility</p>
                </div>
              </button>
              <button onClick={() => onPreviewStateChange?.('available')} className={previewButtonClasses('available')}>
                {previewState === 'available' ? 'Previewing' : 'Preview'}
              </button>
            </div>

            {expandedSections.available && (
              <div className="space-y-3 ml-7 mt-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <div className={radioClasses(replyTimeOption === 'show')}>
                    {replyTimeOption === 'show' && <div className="w-2 h-2 rounded-full bg-[#141414]" />}
                  </div>
                  <div className="flex-1" onClick={() => setReplyTimeOption('show')}>
                    <p className="text-sm font-light text-text-primary">Show typical reply time</p>
                    {replyTimeOption === 'show' && (
                      <div className="mt-2 space-y-3">
                        <div className="relative w-[280px]">
                          <select
                            value={replyTime}
                            onChange={(e) => setReplyTime(e.target.value)}
                            className="w-full border border-[#8a8a8a] rounded px-3 py-1.5 text-sm font-light text-text-primary bg-background appearance-none pr-8"
                          >
                            <option>Typically replies in a few minutes</option>
                            <option>Typically replies in a few hours</option>
                            <option>Typically replies within 24 hours</option>
                            <option>Custom response</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                        </div>
                        {replyTime === 'Custom response' && (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={customReplyValue}
                              onChange={(e) => setCustomReplyValue(e.target.value)}
                              min="1"
                              className="w-[70px] border border-[#8a8a8a] rounded px-3 py-1.5 text-sm font-light text-text-primary bg-background text-center"
                            />
                            <div className="relative">
                              <select
                                value={customReplyUnit}
                                onChange={(e) => setCustomReplyUnit(e.target.value)}
                                className="border border-[#8a8a8a] rounded px-3 py-1.5 text-sm font-light text-text-primary bg-background appearance-none pr-8"
                              >
                                <option value="minutes">minutes</option>
                                <option value="hours">hours</option>
                                <option value="days">days</option>
                              </select>
                              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer" onClick={() => setReplyTimeOption('none')}>
                  <div className={radioClasses(replyTimeOption === 'none')}>
                    {replyTimeOption === 'none' && <div className="w-2 h-2 rounded-full bg-[#141414]" />}
                  </div>
                  <p className="text-sm font-light text-text-primary">Don't show a reply time</p>
                </label>
              </div>
            )}
          </div>

          {/* 2. When away */}
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild disabled={!(availabilityMode === 'hours' && is24_7)}>
                <div className={`${cardClasses('away')}${availabilityMode === 'hours' && is24_7 ? ' opacity-50 cursor-not-allowed' : ''}`}>
                  <div className={`flex items-center justify-between${availabilityMode === 'hours' && is24_7 ? ' pointer-events-none' : ''}`}>
                    <button onClick={() => toggleSection('away')} className="flex items-center gap-3 flex-1">
                      {expandedSections.away ? <ChevronDown className="w-4 h-4 text-text-primary" /> : <ChevronRight className="w-4 h-4 text-text-primary" />}
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-text-primary">When away</h4>
                          <span className="w-2 h-2 rounded-full bg-[#fccb57]" />
                        </div>
                        <p className="text-xs font-light text-text-secondary mt-0.5">Set behavior when team is away</p>
                      </div>
                    </button>
                    <button onClick={() => onPreviewStateChange?.('away')} className={previewButtonClasses('away')}>
                      {previewState === 'away' ? 'Previewing' : 'Preview'}
                    </button>
                  </div>

                  {expandedSections.away && !(availabilityMode === 'hours' && is24_7) && (
                    <div className="space-y-3 ml-7 mt-4">
                      <div>
                        <label className="flex items-start gap-3 cursor-pointer" onClick={() => setAwayBehavior('message')}>
                          <div className={radioClasses(awayBehavior === 'message')}>
                            {awayBehavior === 'message' && <div className="w-2 h-2 rounded-full bg-[#141414]" />}
                          </div>
                          <p className="text-sm font-light text-text-primary">Show an away message</p>
                        </label>
                        {awayBehavior === 'message' && (
                          <textarea
                            value={awayMessage}
                            onChange={(e) => setAwayMessage(e.target.value)}
                            className="mt-2 ml-7 w-[calc(100%-28px)] border border-[#8a8a8a] rounded px-3 py-2 text-sm font-light text-text-primary resize-none"
                            rows={2}
                          />
                        )}
                      </div>

                      <label className="flex items-center gap-3 cursor-pointer" onClick={() => setAwayBehavior('hide')}>
                        <div className={radioClasses(awayBehavior === 'hide')}>
                          {awayBehavior === 'hide' && <div className="w-2 h-2 rounded-full bg-[#141414]" />}
                        </div>
                        <div>
                          <p className="text-sm font-light text-text-primary">Hide the chat launcher</p>
                          <p className="text-xs font-light text-text-secondary mt-0.5">Visitors won't be able to send messages.</p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer" onClick={() => setAwayBehavior('nothing')}>
                        <div className={radioClasses(awayBehavior === 'nothing')}>
                          {awayBehavior === 'nothing' && <div className="w-2 h-2 rounded-full bg-[#141414]" />}
                        </div>
                        <p className="text-sm font-light text-text-primary">Do nothing</p>
                      </label>
                    </div>
                  )}
                </div>
              </TooltipTrigger>
              {availabilityMode === 'hours' && is24_7 && (
                <TooltipContent
                  className="bg-[#425b76] text-white text-sm font-light px-3 py-2 max-w-[260px] border-none shadow-lg"
                  side="top"
                  hasArrow
                  arrowClassName="fill-[#425b76]"
                >
                  You set chat to be available 24/7, so this choice doesn't apply
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>

          {/* 3. At max capacity */}
          <div className={cardClasses('capacity')}>
            <div className="flex items-center justify-between">
              <button onClick={() => toggleSection('capacity')} className="flex items-center gap-3 flex-1">
                {expandedSections.capacity ? <ChevronDown className="w-4 h-4 text-text-primary" /> : <ChevronRight className="w-4 h-4 text-text-primary" />}
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-text-primary">At max capacity</h4>
                    <span className="w-2 h-2 rounded-full bg-[#d94c53]" />
                  </div>
                  <p className="text-xs font-light text-text-secondary mt-0.5">Set behavior when at capacity limit</p>
                </div>
              </button>
              <button onClick={() => onPreviewStateChange?.('capacity')} className={previewButtonClasses('capacity')}>
                {previewState === 'capacity' ? 'Previewing' : 'Preview'}
              </button>
            </div>

            {expandedSections.capacity && (
              <div className="space-y-3 ml-7 mt-4">
                <div>
                  <label className="flex items-start gap-3 cursor-pointer" onClick={() => setCapacityBehavior('message')}>
                    <div className={radioClasses(capacityBehavior === 'message')}>
                      {capacityBehavior === 'message' && <div className="w-2 h-2 rounded-full bg-[#141414]" />}
                    </div>
                    <p className="text-sm font-light text-text-primary">Show an away message</p>
                  </label>
                  {capacityBehavior === 'message' && (
                    <textarea
                      value={capacityMessage}
                      onChange={(e) => setCapacityMessage(e.target.value)}
                      className="mt-2 ml-7 w-[calc(100%-28px)] border border-[#8a8a8a] rounded px-3 py-2 text-sm font-light text-text-primary resize-none"
                      rows={2}
                    />
                  )}
                </div>

                <label className="flex items-center gap-3 cursor-pointer" onClick={() => setCapacityBehavior('hide')}>
                  <div className={radioClasses(capacityBehavior === 'hide')}>
                    {capacityBehavior === 'hide' && <div className="w-2 h-2 rounded-full bg-[#141414]" />}
                  </div>
                  <div>
                    <p className="text-sm font-light text-text-primary">Hide the chat launcher</p>
                    <p className="text-xs font-light text-text-secondary mt-0.5">Visitors won't be able to send messages.</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer" onClick={() => setCapacityBehavior('nothing')}>
                  <div className={radioClasses(capacityBehavior === 'nothing')}>
                    {capacityBehavior === 'nothing' && <div className="w-2 h-2 rounded-full bg-[#141414]" />}
                  </div>
                  <p className="text-sm font-light text-text-primary">Do nothing</p>
                </label>
              </div>
            )}
          </div>

          {/* 4. Outside working hours */}
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild disabled={!(availabilityMode === 'hours' && is24_7)}>
                <div className={`${cardClasses('outside')}${availabilityMode === 'hours' && is24_7 ? ' opacity-50 cursor-not-allowed' : ''}`}>
                  <div className={`flex items-center justify-between${availabilityMode === 'hours' && is24_7 ? ' pointer-events-none' : ''}`}>
                    <button onClick={() => toggleSection('outside')} className="flex items-center gap-3 flex-1">
                      {expandedSections.outside ? <ChevronDown className="w-4 h-4 text-text-primary" /> : <ChevronRight className="w-4 h-4 text-text-primary" />}
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-text-primary">Outside working hours</h4>
                          <span className="w-2 h-2 rounded-full bg-[#8a8a8a]" />
                        </div>
                        <p className="text-xs font-light text-text-secondary mt-0.5">Set behavior outside operating hours</p>
                      </div>
                    </button>
                    <button onClick={() => onPreviewStateChange?.('outside')} className={previewButtonClasses('outside')}>
                      {previewState === 'outside' ? 'Previewing' : 'Preview'}
                    </button>
                  </div>

                  {expandedSections.outside && !(availabilityMode === 'hours' && is24_7) && (
                    <div className="space-y-3 ml-7 mt-4">
                      <label className="flex items-center gap-3 cursor-pointer" onClick={() => setOutsideBehavior('return')}>
                        <div className={radioClasses(outsideBehavior === 'return')}>
                          {outsideBehavior === 'return' && <div className="w-2 h-2 rounded-full bg-[#141414]" />}
                        </div>
                        <p className="text-sm font-light text-text-primary">Show return time</p>
                      </label>

                      <div>
                        <label className="flex items-start gap-3 cursor-pointer" onClick={() => setOutsideBehavior('message')}>
                          <div className={radioClasses(outsideBehavior === 'message')}>
                            {outsideBehavior === 'message' && <div className="w-2 h-2 rounded-full bg-[#141414]" />}
                          </div>
                          <p className="text-sm font-light text-text-primary">Show an away message</p>
                        </label>
                        {outsideBehavior === 'message' && (
                          <textarea
                            value={outsideMessage}
                            onChange={(e) => setOutsideMessage(e.target.value)}
                            className="mt-2 ml-7 w-[calc(100%-28px)] border border-[#8a8a8a] rounded px-3 py-2 text-sm font-light text-text-primary resize-none"
                            rows={2}
                          />
                        )}
                      </div>

                      <label className="flex items-center gap-3 cursor-pointer" onClick={() => setOutsideBehavior('hide')}>
                        <div className={radioClasses(outsideBehavior === 'hide')}>
                          {outsideBehavior === 'hide' && <div className="w-2 h-2 rounded-full bg-[#141414]" />}
                        </div>
                        <div>
                          <p className="text-sm font-light text-text-primary">Hide the chat launcher</p>
                          <p className="text-xs font-light text-text-secondary mt-0.5">Visitors won't be able to send messages.</p>
                        </div>
                      </label>

                      {/* Offline messaging toggle */}
                      {outsideBehavior !== 'hide' && (
                        <div className="mt-4 pt-4 border-t border-border-primary">
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => setAllowOfflineMessaging(!allowOfflineMessaging)}
                              className={`relative w-[52px] h-[26px] rounded-full transition-colors duration-250 ease-in-out shrink-0 mt-0.5 ${allowOfflineMessaging ? 'bg-[#141414]' : 'bg-[#cbd6d8]'}`}
                              role="switch"
                              aria-checked={allowOfflineMessaging}
                            >
                              {allowOfflineMessaging && (
                                <span className="absolute left-[7px] top-1/2 -translate-y-1/2 text-[9px] font-bold text-white uppercase tracking-wide">on</span>
                              )}
                              <div className={`absolute top-[3px] w-[20px] h-[20px] rounded-full bg-white shadow-sm transition-transform duration-250 ease-in-out ${allowOfflineMessaging ? 'translate-x-[28px]' : 'translate-x-[3px]'}`} />
                            </button>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-text-primary">Allow offline messaging</p>
                              <p className="text-xs font-light text-text-secondary mt-0.5">
                                Let visitors send messages outside of business hours. An auto-reply will be sent immediately.
                              </p>
                              {allowOfflineMessaging && (
                                <div className="mt-3">
                                  <p className="text-xs font-medium text-text-secondary mb-1.5">Auto-reply message</p>
                                  <textarea
                                    value={offlineAutoReply}
                                    onChange={(e) => setOfflineAutoReply(e.target.value)}
                                    className="w-full border border-[#8a8a8a] rounded px-3 py-2 text-sm font-light text-text-primary resize-none"
                                    rows={2}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TooltipTrigger>
              {availabilityMode === 'hours' && is24_7 && (
                <TooltipContent
                  className="bg-[#425b76] text-white text-sm font-light px-3 py-2 max-w-[260px] border-none shadow-lg"
                  side="top"
                  hasArrow
                  arrowClassName="fill-[#425b76]"
                >
                  You set chat to be available 24/7, so this choice doesn't apply
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default AvailabilitySettings;
