import type { LearningPlan } from '../types'

interface PlanCardProps {
  plan: LearningPlan
}

export function PlanCard({ plan }: PlanCardProps) {
  return (
    <div className="glass-panel p-5 space-y-3">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
          {plan.dailyTarget}
        </span>
        <div>
          <h3 className="text-lg font-semibold text-ink">{plan.title}</h3>
          <p className="text-xs text-slate-500">每日目标（词）</p>
        </div>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed">{plan.description}</p>
      <div className="flex flex-wrap gap-2">
        {plan.focusTags.map((tag) => (
          <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
            #{tag}
          </span>
        ))}
      </div>
      <button className="w-full rounded-lg bg-primary text-white py-2 text-sm font-medium shadow-sm hover:bg-primary/90">
        选用该计划
      </button>
    </div>
  )
}
