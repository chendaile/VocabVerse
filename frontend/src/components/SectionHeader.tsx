import type { ReactNode } from 'react'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-xl font-semibold text-ink sm:text-2xl">{title}</h2>
        {subtitle ? <p className="text-slate-500 text-sm sm:text-base">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  )
}
