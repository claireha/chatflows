import React, { useState } from 'react';
import { Calendar, Plus, ChevronLeft, ChevronRight, Video } from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';

interface Meeting {
  id: string;
  startTime: string;
  endTime: string;
  title: string;
}

const mockMeetings: Record<string, Meeting[]> = {
  '2026-02-10': [
    { id: '1', startTime: '9:00 AM', endTime: '9:30 AM', title: 'Daily Standup' },
    { id: '2', startTime: '11:00 AM', endTime: '11:45 AM', title: 'Q1 Marketing Strategy Review' },
    { id: '3', startTime: '1:00 PM', endTime: '1:30 PM', title: '1:1 with Sarah' },
    { id: '4', startTime: '3:00 PM', endTime: '4:00 PM', title: 'Product Roadmap Planning' },
  ],
};

export const MeetingsWidget: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const dateKey = format(selectedDate, 'yyyy-MM-dd');
  const meetings = mockMeetings[dateKey] || [];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-text-secondary" />
          <span className="text-sm font-medium text-text-primary underline underline-offset-2">Meetings</span>
          <span className="text-sm text-text-secondary font-light">• {meetings.length}</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-text-secondary hover:text-text-primary transition-colors">
            <Plus className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSelectedDate(prev => subDays(prev, 1))}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-text-primary min-w-[52px] text-center">
              {format(selectedDate, 'MMM d')}
            </span>
            <button
              onClick={() => setSelectedDate(prev => addDays(prev, 1))}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Meeting list */}
      <div className="border border-border rounded-lg divide-y divide-border">
        {meetings.length > 0 ? (
          meetings.map((meeting) => (
            <div key={meeting.id} className="flex items-center gap-4 px-4 py-4 hover:bg-muted transition-colors">
              <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Video className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm text-text-secondary font-extralight min-w-[140px]">
                {meeting.startTime} - {meeting.endTime}
              </span>
              <span className="text-sm text-text-primary font-light">
                {meeting.title}
              </span>
            </div>
          ))
        ) : (
          <div className="px-4 py-8 text-center text-sm text-text-secondary">
            No meetings scheduled
          </div>
        )}
      </div>
    </div>
  );
};
