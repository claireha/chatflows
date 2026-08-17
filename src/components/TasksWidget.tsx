import React, { useState } from 'react';
import { ListTodo, Plus, Circle, CheckCircle2 } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

const mockTasks: Task[] = [
  { id: '1', title: 'Follow up with client proposal', dueDate: 'Feb 8', completed: false },
  { id: '2', title: 'Update Q1 sales forecast', dueDate: 'Feb 9', completed: false },
  { id: '3', title: 'Review onboarding docs', dueDate: 'Feb 10', completed: false },
  { id: '4', title: 'Send partnership agreement', dueDate: 'Feb 12', completed: false },
  { id: '5', title: 'Prepare board deck', dueDate: 'Jan 30', completed: true },
  { id: '6', title: 'Submit expense report', dueDate: 'Jan 28', completed: true },
];

export const TasksWidget: React.FC = () => {
  const [filter, setFilter] = useState<'open' | 'completed'>('open');
  const filtered = mockTasks.filter(t => filter === 'completed' ? t.completed : !t.completed);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ListTodo className="w-4 h-4 text-text-secondary" />
          <span className="text-sm font-medium text-text-primary underline underline-offset-2">Tasks</span>
          <span className="text-sm text-text-secondary font-light">• {filtered.length}</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-text-secondary hover:text-text-primary transition-colors">
            <Plus className="w-4 h-4" />
          </button>
          <div className="flex border border-border rounded-md overflow-hidden text-sm">
            <button
              onClick={() => setFilter('open')}
              className={`px-3 py-1 transition-colors ${filter === 'open' ? 'bg-muted text-text-primary font-medium' : 'text-text-secondary hover:bg-muted/50'}`}
            >
              Open
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1 transition-colors ${filter === 'completed' ? 'bg-muted text-text-primary font-medium' : 'text-text-secondary hover:bg-muted/50'}`}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

      {/* Task list */}
      <div className="border border-border rounded-lg divide-y divide-border">
        {filtered.length > 0 ? (
          filtered.map((task) => (
            <div key={task.id} className="flex items-center justify-between px-4 py-4 hover:bg-muted transition-colors">
              <div className="flex items-center gap-3">
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-text-secondary/50" />
                ) : (
                  <Circle className="w-5 h-5 text-text-secondary/40" />
                )}
                <span className={`text-sm ${task.completed ? 'text-text-secondary line-through font-extralight' : 'text-text-primary font-light'}`}>
                  {task.title}
                </span>
              </div>
              <span className={`text-sm font-extralight ${task.completed ? 'text-text-secondary' : 'text-destructive'}`}>
                {task.dueDate}
              </span>
            </div>
          ))
        ) : (
          <div className="px-4 py-8 text-center text-sm text-text-secondary">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
};
