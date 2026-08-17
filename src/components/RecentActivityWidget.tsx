import React from 'react';
import { Clock } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: string;
  status: string;
  title: string;
  editedAgo: string;
}

const mockActivity: ActivityItem[] = [
  { id: '1', type: 'Task', status: 'Not started', title: 'Update CRM records', editedAgo: 'You edited 2 days ago' },
  { id: '2', type: 'Task', status: 'Not started', title: 'Draft email campaign', editedAgo: 'You edited 3 days ago' },
  { id: '3', type: 'Task', status: 'Not started', title: 'Review lead scoring', editedAgo: 'You edited 5 days ago' },
  { id: '4', type: 'Task', status: 'Not started', title: 'Schedule demo calls', editedAgo: 'You edited 6 days ago' },
];

export const RecentActivityWidget: React.FC = () => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-text-secondary" />
        <span className="text-sm font-medium text-text-primary">Recent activity</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {mockActivity.map((item) => (
          <div key={item.id} className="border border-border rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-text-secondary font-light">{item.type}</span>
              <span className="font-medium text-white rounded-full px-2.5 py-0.5" style={{ fontSize: '10px', backgroundColor: 'hsl(231, 72%, 56%)' }}>
                {item.status}
              </span>
            </div>
            <p className="text-sm font-semibold text-text-primary mb-1">{item.title}</p>
            <p className="text-xs text-text-secondary font-light">{item.editedAgo}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
