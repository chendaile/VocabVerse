import type { ReviewStat } from '../types'

interface StatCardProps {
  stat: ReviewStat
}

export function StatCard({ stat }: StatCardProps) {
  return (
    <div className="glass-panel p-4 shadow-sm hover:shadow-lg transition-shadow">
      <p className="text-sm text-slate-500">{stat.label}</p>
      <div className="mt-2 flex items-end gap-2">
        <span className="text-3xl font-semibold text-ink">{stat.value}</span>
        <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{stat.trend}</span>
      </div>
    </div>
  )
}
