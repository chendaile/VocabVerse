import type { Word } from '../types'

interface WordCardProps {
  word: Word
  onToggleFavorite?: (id: string) => void
  onGenerateImage?: (word: Word) => void
  generatedImageUrl?: string
  isFavorite?: boolean
}

export function WordCard({ word, onToggleFavorite, isFavorite, onGenerateImage, generatedImageUrl }: WordCardProps) {
  return (
    <div className="word-card">
      <div className="word-card__head">
        <div>
          <p className="word-card__eyebrow">核心词</p>
          <h3 className="word-card__term">{word.term}</h3>
          {word.pronunciation ? <p className="word-card__pron">/{word.pronunciation}/</p> : null}
        </div>
        {onToggleFavorite ? (
          <button
            className={`word-card__fav ${isFavorite ? 'is-active' : ''}`}
            aria-label="收藏单词"
            onClick={() => onToggleFavorite?.(word.id)}
            type="button"
          >
            ★
          </button>
        ) : null}
      </div>
      <p className="word-card__definition">{word.definition}</p>
      {word.example ? (
        <div className="word-card__example">
          <span className="word-card__example-label">例句：</span>
          {word.example}
        </div>
      ) : null}
      {word.tags?.length ? (
        <div className="word-card__tags">
          {word.tags.map((tag) => (
            <span key={tag} className="word-card__tag">
              #{tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="word-card__actions">
        {onGenerateImage ? (
          <button className="word-card__image-btn" type="button" onClick={() => onGenerateImage(word)}>
            生成助记图
          </button>
        ) : null}
        {generatedImageUrl ? (
          <a className="word-card__image-link" href={generatedImageUrl} target="_blank" rel="noreferrer">
            查看生成图片
          </a>
        ) : null}
      </div>

      {generatedImageUrl ? (
        <div className="word-card__image-preview">
          <img src={generatedImageUrl} alt={`${word.term} 助记图`} />
          <p className="word-card__image-caption">AI 助记图</p>
        </div>
      ) : null}
    </div>
  )
}
