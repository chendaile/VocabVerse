interface FeatureCardProps {
  title: string
  description: string
  icon: string
}

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="glass-panel p-5 flex gap-3 items-start hover:-translate-y-1 transition-transform">
      <div className="text-primary text-2xl">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold text-ink">{title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
