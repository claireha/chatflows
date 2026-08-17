import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { GlobalToolbar } from '@/components/GlobalToolbar';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip, Cell } from 'recharts';
import { ArrowUpDown, ArrowDown, Info } from 'lucide-react';

const chartData = [
  {
    action: 'welcome',
    started: 1546,
    completed: 1546,
    error: 0,
  },
  {
    action: 'code',
    started: 1546,
    completed: 0,
    error: 0,
  },
];

const tableData = [
  { action: 'code', started: 1546, completed: 0, error: 0 },
  { action: 'welcome', started: 1546, completed: 1546, error: 0 },
];

const VariantAnalyze: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const variantName = decodeURIComponent(name || 'Unknown Variant');
  const dateRange = 'From 3/22/2026 to 3/28/2026';

  return (
    <div className="min-h-screen font-['Lexend_Deca']" style={{ backgroundColor: '#f0f0f0' }}>
      <GlobalToolbar />
      <div className="pt-[var(--toolbar-height)]">
        {/* Breadcrumb and header */}
        <div className="px-8 pt-5 pb-5 border-b border-border bg-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground mb-1">
                <Link to="/crm/chat/chatflows" className="text-[#006162] hover:text-[#00494b] hover:underline font-light">Chatflows</Link>
                <span className="text-muted-foreground">›</span>
                <span className="font-light text-muted-foreground">{variantName}</span>
              </div>
              <h1 className="text-[22px] font-semibold text-foreground">{variantName}</h1>
            </div>
            <Link
              to="/crm/chat/chatflows"
              className="px-5 py-2 text-sm font-light bg-foreground text-background rounded hover:opacity-90 transition-opacity"
            >
              Edit
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-8 max-w-[1140px]">
          {/* Filters */}
          <div className="mb-6 space-y-1">
            <div>
              <span className="text-sm text-foreground font-light">Date Range:</span>
              <button className="ml-2 text-sm text-foreground font-semibold px-3 py-1.5">
                Last week ▾
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground font-light">Action:</span>
              <button className="text-sm text-foreground font-semibold px-3 py-1.5">
                2 selected ▾
              </button>
            </div>
          </div>

          {/* Stats Card */}
          <div className="border border-border rounded-lg p-6 mb-6 bg-card">
            <span className="inline-block text-xs font-medium bg-muted text-muted-foreground px-2.5 py-1 rounded mb-5">
              {dateRange}
            </span>
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase mb-2">Started</div>
                <div className="text-[28px] font-bold text-[#006162] hover:text-[#00494b] underline cursor-pointer">1,546</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase mb-2">
                  Completions <Info className="w-3 h-3" />
                </div>
                <div className="text-[28px] font-bold text-[#006162] hover:text-[#00494b] underline cursor-pointer">1,546</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase mb-2">
                  Abandoned <Info className="w-3 h-3" />
                </div>
                <div className="text-[28px] font-bold text-[#006162] hover:text-[#00494b] underline cursor-pointer">0</div>
              </div>
            </div>
          </div>

          {/* Chart Card */}
          <div className="border border-border rounded-lg p-6 mb-6 bg-card">
            <span className="inline-block text-xs font-medium bg-muted text-muted-foreground px-2 py-1 rounded mb-4">
              {dateRange}
            </span>
            <div className="flex items-center gap-5 mb-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f4a87c]" />
                <span className="text-[13px] font-light text-foreground">Started</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#62d4c4]" />
                <span className="text-[13px] font-light text-foreground">Successfully Completed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#c4b5e0]" />
                <span className="text-[13px] font-light text-foreground">Action error</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} layout="vertical" barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="action" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="started" fill="#f4a87c" name="Started" barSize={24} />
                <Bar dataKey="completed" fill="#62d4c4" name="Successfully Completed" barSize={24} />
                <Bar dataKey="error" fill="#c4b5e0" name="Action error" barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table Card */}
          <div className="border border-border rounded-lg bg-card">
            <div className="p-4">
              <span className="inline-block text-xs font-medium bg-muted text-muted-foreground px-2 py-1 rounded">
                {dateRange}
              </span>
            </div>
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-t border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Action</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">
                    <span className="inline-flex items-center gap-1">Started <ArrowDown className="w-3 h-3" /></span>
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">
                    <span className="inline-flex items-center gap-1">Successfully Completed <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">
                    <span className="inline-flex items-center gap-1">Action error <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="px-4 py-3 font-light text-foreground">{row.action}</td>
                    <td className="px-4 py-3 font-light text-foreground">{row.started.toLocaleString()}</td>
                    <td className="px-4 py-3 font-light text-foreground">{row.completed.toLocaleString()}</td>
                    <td className="px-4 py-3 font-light text-foreground">{row.error}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VariantAnalyze;
