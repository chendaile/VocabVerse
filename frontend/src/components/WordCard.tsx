import type { Word } from '../../../share/types'

interface WordCardProps {
  word: Word
  onToggleFavorite?: (id: string) => void
  isFavorite?: boolean
}

export function WordCard({ word, onToggleFavorite, isFavorite }: WordCardProps) {
  return (
    <div className="glass-panel p-5 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-primary font-semibold">核心词</p>
          <h3 className="text-xl font-semibold text-ink">{word.term}</h3>
          <p className="text-sm text-slate-500">/{word.pronunciation}/</p>
        </div>
        {onToggleFavorite ? (
          <button
            className={`text-lg ${isFavorite ? 'text-amber-500' : 'text-slate-300'} hover:text-amber-500`}
            aria-label="收藏单词"
            onClick={() => onToggleFavorite?.(word.id)}
            type="button"
          >
            ★
          </button>
        ) : null}
      </div>
      <p className="text-slate-700 text-sm leading-relaxed">{word.definition}</p>
      <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-600 border border-slate-100">
        <span className="font-medium text-slate-800">例句：</span>
        {word.example}
      </div>
      <div className="flex flex-wrap gap-2">
        {word.tags?.map((tag) => (
          <span key={tag} className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium">
            #{tag}
          </span>
        ))}
      </div>
    </div>
  )
}
