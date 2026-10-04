import React from 'react';
import { ShieldCheck, Award } from 'lucide-react';

interface ConditionScoreMeterProps {
  score: number; // 0 - 100
  timesWorn?: number;
  conditionGrade: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ConditionScoreMeter: React.FC<ConditionScoreMeterProps> = ({
  score,
  timesWorn,
  conditionGrade,
  size = 'md'
}) => {
  // Score interpretation
  let statusText = 'Pristine Condition';
  let badgeColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  let barColor = 'bg-emerald-600';

  if (score >= 95) {
    statusText = 'Like New / Flawless';
    badgeColor = 'text-emerald-800 bg-emerald-50 border-emerald-200';
    barColor = 'bg-emerald-600';
  } else if (score >= 90) {
    statusText = 'Superb Condition';
    badgeColor = 'text-teal-800 bg-teal-50 border-teal-200';
    barColor = 'bg-teal-600';
  } else if (score >= 80) {
    statusText = 'Very Good (Minor Wear)';
    badgeColor = 'text-amber-800 bg-amber-50 border-amber-200';
    barColor = 'bg-amber-500';
  } else {
    statusText = 'Good Vintage';
    badgeColor = 'text-stone-700 bg-stone-100 border-stone-200';
    barColor = 'bg-stone-500';
  }

  if (size === 'sm') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-xs font-medium ${badgeColor}`}>
        <Award className="w-3.5 h-3.5" />
        <span>Revogue Score: <strong>{score}/100</strong></span>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-stone-900 text-amber-300 rounded-lg">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Revogue Condition Score
            </div>
            <div className="text-sm font-bold text-stone-900">
              {statusText}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-stone-900 tracking-tight">
            {score}<span className="text-stone-400 text-sm font-semibold">/100</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${score}%` }}
        />
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-xs border-t border-stone-200 pt-2.5">
        <div>
          <span className="text-stone-400 block">Grade</span>
          <strong className="text-stone-800 font-semibold">{conditionGrade}</strong>
        </div>
        <div className="border-x border-stone-200">
          <span className="text-stone-400 block">Usage</span>
          <strong className="text-stone-800 font-semibold">{timesWorn ? `${timesWorn} Times` : 'Minimal'}</strong>
        </div>
        <div>
          <span className="text-stone-400 block">Verification</span>
          <strong className="text-emerald-700 font-semibold">100% Passed</strong>
        </div>
      </div>
    </div>
  );
};
