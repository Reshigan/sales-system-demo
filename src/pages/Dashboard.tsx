import {
  DollarSign,
  Handshake,
  TrendingUp,
  UserPlus,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { initialDeals, monthlyRevenue, initialLeads } from '../data/sampleData';

const STAGE_COLORS: Record<string, string> = {
  Prospect: '#6366f1',
  Proposal: '#8b5cf6',
  Negotiation: '#f59e0b',
  'Closed Won': '#10b981',
  'Closed Lost': '#ef4444',
};

export default function Dashboard() {
  const totalRevenue = initialDeals
    .filter((d) => d.stage === 'Closed Won')
    .reduce((sum, d) => sum + d.value, 0);

  const activeDeals = initialDeals.filter(
    (d) => !['Closed Won', 'Closed Lost'].includes(d.stage)
  ).length;

  const wonDeals = initialDeals.filter((d) => d.stage === 'Closed Won').length;
  const lostDeals = initialDeals.filter((d) => d.stage === 'Closed Lost').length;
  const conversionRate = Math.round(
    (wonDeals / (wonDeals + lostDeals)) * 100
  );

  const newLeads = initialLeads.filter((l) => l.status === 'New').length;

  const pipelineValue = initialDeals
    .filter((d) => !['Closed Won', 'Closed Lost'].includes(d.stage))
    .reduce((sum, d) => sum + d.value, 0);

  const pipelineData = Object.entries(
    initialDeals.reduce<Record<string, number>>((acc, deal) => {
      acc[deal.stage] = (acc[deal.stage] || 0) + deal.value;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const kpis = [
    {
      label: 'Total Revenue',
      value: `$${(totalRevenue / 1000).toFixed(0)}K`,
      change: '+12.5%',
      trending: 'up' as const,
      icon: DollarSign,
      color: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30',
      iconColor: 'text-emerald-400',
    },
    {
      label: 'Active Deals',
      value: activeDeals.toString(),
      change: '+3',
      trending: 'up' as const,
      icon: Handshake,
      color: 'from-indigo-500/20 to-indigo-500/5 border-indigo-500/30',
      iconColor: 'text-indigo-400',
    },
    {
      label: 'Conversion Rate',
      value: `${conversionRate}%`,
      change: '+5.2%',
      trending: 'up' as const,
      icon: TrendingUp,
      color: 'from-amber-500/20 to-amber-500/5 border-amber-500/30',
      iconColor: 'text-amber-400',
    },
    {
      label: 'New Leads',
      value: newLeads.toString(),
      change: '-2',
      trending: 'down' as const,
      icon: UserPlus,
      color: 'from-violet-500/20 to-violet-500/5 border-violet-500/30',
      iconColor: 'text-violet-400',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">
            Pipeline value: ${(pipelineValue / 1000).toFixed(0)}K across{' '}
            {activeDeals} active deals
          </p>
        </div>
        <div className="text-sm text-gray-400">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className={`rounded-xl bg-gradient-to-br ${kpi.color} border p-5`}
          >
            <div className="flex items-center justify-between mb-3">
              <kpi.icon className={`w-5 h-5 ${kpi.iconColor}`} />
              <span
                className={`flex items-center gap-1 text-xs font-medium ${
                  kpi.trending === 'up' ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {kpi.trending === 'up' ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {kpi.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{kpi.value}</p>
            <p className="text-xs text-gray-400 mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <div className="lg:col-span-2 bg-gray-900 rounded-xl border border-gray-800 p-5">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">
            Revenue Trend
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyRevenue}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={(v: number) => `$${v / 1000}K`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#e5e7eb',
                }}
                formatter={(value: number) => [`$${(value / 1000).toFixed(0)}K`, 'Revenue']}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#revenueGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pipeline Distribution */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">
            Pipeline Distribution
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pipelineData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                dataKey="value"
                paddingAngle={3}
              >
                {pipelineData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={STAGE_COLORS[entry.name] || '#6b7280'}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#e5e7eb',
                }}
                formatter={(value: number) => [`$${(value / 1000).toFixed(0)}K`]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {pipelineData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: STAGE_COLORS[item.name] || '#6b7280' }}
                  />
                  <span className="text-gray-400">{item.name}</span>
                </div>
                <span className="text-gray-300 font-medium">
                  ${(item.value / 1000).toFixed(0)}K
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Performance Bar Chart */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">
          Monthly Performance — Deals & Leads
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#e5e7eb',
              }}
            />
            <Bar dataKey="deals" fill="#6366f1" radius={[4, 4, 0, 0]} name="Deals Closed" />
            <Bar dataKey="leads" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="New Leads" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
