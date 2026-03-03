import { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Award,
  Settings,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { salesReps, initialDeals } from '../data/sampleData';

export default function Commissions() {
  const [baseRate, setBaseRate] = useState(8);
  const [bonusThreshold, setBonusThreshold] = useState(100000);
  const [bonusRate, setBonusRate] = useState(12);

  const repData = salesReps.map((rep) => {
    const repDeals = initialDeals.filter(
      (d) => d.assignee === rep.name && d.stage === 'Closed Won'
    );
    const closedRevenue = repDeals.reduce((sum, d) => sum + d.value, 0);
    const activePipeline = initialDeals
      .filter(
        (d) =>
          d.assignee === rep.name &&
          !['Closed Won', 'Closed Lost'].includes(d.stage)
      )
      .reduce((sum, d) => sum + d.value, 0);

    const baseCommission = closedRevenue * (baseRate / 100);
    const bonusCommission =
      closedRevenue > bonusThreshold
        ? (closedRevenue - bonusThreshold) * ((bonusRate - baseRate) / 100)
        : 0;
    const totalCommission = baseCommission + bonusCommission;

    return {
      ...rep,
      closedRevenue,
      activePipeline,
      closedDeals: repDeals.length,
      baseCommission,
      bonusCommission,
      totalCommission,
    };
  });

  const totalCommissions = repData.reduce(
    (sum, r) => sum + r.totalCommission,
    0
  );
  const totalRevenue = repData.reduce((sum, r) => sum + r.closedRevenue, 0);

  const chartData = repData.map((r) => ({
    name: r.name.split(' ')[0],
    base: Math.round(r.baseCommission),
    bonus: Math.round(r.bonusCommission),
    revenue: r.closedRevenue,
  }));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Commissions</h1>
          <p className="text-sm text-gray-400 mt-1">
            ${(totalCommissions / 1000).toFixed(1)}K total commissions on $
            {(totalRevenue / 1000).toFixed(0)}K revenue
          </p>
        </div>
      </div>

      {/* Commission Rate Settings */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-4 h-4 text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-300">
            Commission Rates
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">
              Base Rate (%)
            </label>
            <input
              type="number"
              value={baseRate}
              onChange={(e) => setBaseRate(Number(e.target.value))}
              min={0}
              max={100}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">
              Bonus Threshold ($)
            </label>
            <input
              type="number"
              value={bonusThreshold}
              onChange={(e) => setBonusThreshold(Number(e.target.value))}
              min={0}
              step={10000}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">
              Bonus Rate (%)
            </label>
            <input
              type="number"
              value={bonusRate}
              onChange={(e) => setBonusRate(Number(e.target.value))}
              min={0}
              max={100}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Base rate applies to all revenue. Bonus rate applies to revenue above
          the threshold.
        </p>
      </div>

      {/* Rep Cards + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Commission Breakdown Chart */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">
            Commission Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
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
                formatter={(value: number, name: string) => [
                  `$${value.toLocaleString()}`,
                  name === 'base' ? 'Base Commission' : 'Bonus Commission',
                ]}
              />
              <Bar
                dataKey="base"
                stackId="comm"
                fill="#6366f1"
                radius={[0, 0, 0, 0]}
                name="base"
              />
              <Bar
                dataKey="bonus"
                stackId="comm"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                name="bonus"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Cards */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-indigo-400" />
                <span className="text-xs text-gray-400">
                  Total Commissions
                </span>
              </div>
              <p className="text-xl font-bold text-white">
                ${totalCommissions.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-gray-400">Commission Rate</span>
              </div>
              <p className="text-xl font-bold text-white">
                {totalRevenue > 0
                  ? ((totalCommissions / totalRevenue) * 100).toFixed(1)
                  : '0'}
                %
              </p>
            </div>
          </div>

          {/* Per-Rep Details */}
          {repData.map((rep) => (
            <div
              key={rep.id}
              className="bg-gray-900 rounded-xl border border-gray-800 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-600/30 flex items-center justify-center text-xs font-bold text-indigo-300">
                    {rep.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-200">
                      {rep.name}
                    </p>
                    <p className="text-xs text-gray-500">{rep.role}</p>
                  </div>
                </div>
                {rep.bonusCommission > 0 && (
                  <div className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                    <Award className="w-3 h-3" />
                    Bonus
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Revenue</p>
                  <p className="text-sm font-medium text-gray-200">
                    ${(rep.closedRevenue / 1000).toFixed(0)}K
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Deals Won</p>
                  <p className="text-sm font-medium text-gray-200">
                    {rep.closedDeals}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Commission</p>
                  <p className="text-sm font-bold text-indigo-400">
                    ${rep.totalCommission.toLocaleString()}
                  </p>
                </div>
              </div>
              {/* Commission breakdown bar */}
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden flex">
                  {rep.totalCommission > 0 && (
                    <>
                      <div
                        className="h-full bg-indigo-500"
                        style={{
                          width: `${
                            (rep.baseCommission / rep.totalCommission) * 100
                          }%`,
                        }}
                      />
                      <div
                        className="h-full bg-emerald-500"
                        style={{
                          width: `${
                            (rep.bonusCommission / rep.totalCommission) * 100
                          }%`,
                        }}
                      />
                    </>
                  )}
                </div>
                <span className="text-xs text-gray-500 w-16 text-right">
                  ${rep.totalCommission.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
