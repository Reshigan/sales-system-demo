import { useState } from 'react';
import { GripVertical, DollarSign, User, Building2 } from 'lucide-react';
import { Deal, initialDeals } from '../data/sampleData';

const STAGES: Deal['stage'][] = [
  'Prospect',
  'Proposal',
  'Negotiation',
  'Closed Won',
  'Closed Lost',
];

const STAGE_COLORS: Record<Deal['stage'], { bg: string; border: string; header: string; dot: string }> = {
  Prospect: { bg: 'bg-indigo-500/5', border: 'border-indigo-500/20', header: 'text-indigo-400', dot: 'bg-indigo-400' },
  Proposal: { bg: 'bg-violet-500/5', border: 'border-violet-500/20', header: 'text-violet-400', dot: 'bg-violet-400' },
  Negotiation: { bg: 'bg-amber-500/5', border: 'border-amber-500/20', header: 'text-amber-400', dot: 'bg-amber-400' },
  'Closed Won': { bg: 'bg-emerald-500/5', border: 'border-emerald-500/20', header: 'text-emerald-400', dot: 'bg-emerald-400' },
  'Closed Lost': { bg: 'bg-red-500/5', border: 'border-red-500/20', header: 'text-red-400', dot: 'bg-red-400' },
};

export default function Pipeline() {
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [draggedDeal, setDraggedDeal] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<Deal['stage'] | null>(null);

  const handleDragStart = (dealId: string) => {
    setDraggedDeal(dealId);
  };

  const handleDragOver = (e: React.DragEvent, stage: Deal['stage']) => {
    e.preventDefault();
    setDragOverStage(stage);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = (stage: Deal['stage']) => {
    if (!draggedDeal) return;
    setDeals((prev) =>
      prev.map((d) =>
        d.id === draggedDeal
          ? {
              ...d,
              stage,
              probability:
                stage === 'Closed Won'
                  ? 100
                  : stage === 'Closed Lost'
                  ? 0
                  : d.probability,
            }
          : d
      )
    );
    setDraggedDeal(null);
    setDragOverStage(null);
  };

  const totalPipeline = deals
    .filter((d) => !['Closed Won', 'Closed Lost'].includes(d.stage))
    .reduce((sum, d) => sum + d.value, 0);

  const weightedPipeline = deals
    .filter((d) => !['Closed Won', 'Closed Lost'].includes(d.stage))
    .reduce((sum, d) => sum + d.value * (d.probability / 100), 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Pipeline</h1>
          <p className="text-sm text-gray-400 mt-1">
            ${(totalPipeline / 1000).toFixed(0)}K total · $
            {(weightedPipeline / 1000).toFixed(0)}K weighted · Drag deals
            between stages
          </p>
        </div>
      </div>

      {/* Pipeline Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageDeals = deals.filter((d) => d.stage === stage);
          const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
          const colors = STAGE_COLORS[stage];
          const isOver = dragOverStage === stage;

          return (
            <div
              key={stage}
              className={`flex-shrink-0 w-72 rounded-xl border ${colors.border} ${
                isOver ? 'ring-2 ring-indigo-500/50' : ''
              } ${colors.bg} flex flex-col max-h-[calc(100vh-220px)]`}
              onDragOver={(e) => handleDragOver(e, stage)}
              onDragLeave={handleDragLeave}
              onDrop={() => handleDrop(stage)}
            >
              {/* Column Header */}
              <div className="p-4 border-b border-gray-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                    <h3 className={`text-sm font-semibold ${colors.header}`}>
                      {stage}
                    </h3>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-800/80 px-2 py-0.5 rounded-full">
                    {stageDeals.length}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  ${(stageValue / 1000).toFixed(0)}K
                </p>
              </div>

              {/* Cards */}
              <div className="p-3 space-y-2.5 overflow-y-auto flex-1">
                {stageDeals.map((deal) => (
                  <div
                    key={deal.id}
                    draggable
                    onDragStart={() => handleDragStart(deal.id)}
                    className={`bg-gray-900/80 rounded-lg border border-gray-800 p-3.5 cursor-grab active:cursor-grabbing hover:border-gray-700 transition-all ${
                      draggedDeal === deal.id ? 'opacity-50 scale-95' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-200 leading-tight">
                        {deal.title}
                      </h4>
                      <GripVertical className="w-3.5 h-3.5 text-gray-600 flex-shrink-0 mt-0.5" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Building2 className="w-3 h-3" />
                        {deal.company}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <User className="w-3 h-3" />
                        {deal.assignee}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-300">
                          <DollarSign className="w-3 h-3" />
                          {deal.value.toLocaleString()}
                        </div>
                        <span className="text-xs text-gray-500">
                          {deal.probability}%
                        </span>
                      </div>
                    </div>
                    {/* Probability bar */}
                    <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          deal.probability >= 75
                            ? 'bg-emerald-500'
                            : deal.probability >= 40
                            ? 'bg-amber-500'
                            : 'bg-indigo-500'
                        }`}
                        style={{ width: `${deal.probability}%` }}
                      />
                    </div>
                  </div>
                ))}
                {stageDeals.length === 0 && (
                  <div className="text-center py-8 text-gray-600 text-xs">
                    Drop deals here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
