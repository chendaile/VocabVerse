import './App.css'
import { useMemo, useState } from 'react'
import { SectionHeader } from './components/SectionHeader'
import { WordCard } from './components/WordCard'
import { useWordStore } from './store/useWordStore'

function App() {
  const { words, favorites, toggleFavorite } = useWordStore()
  const [showFavorites, setShowFavorites] = useState(false)

  const stats = useMemo(
    () => [
      { label: '今日词包', value: words.length, hint: '精挑细选的高频词' },
      { label: '已收藏', value: favorites.size, hint: '随时复习你的重点' },
      { label: '专注模式', value: '开启', hint: '仅保留背词核心路径' }
    ],
    [favorites.size, words.length]
  )

  const displayWords = useMemo(
    () => (showFavorites ? words.filter((word) => favorites.has(word.id)) : words),
    [favorites, showFavorites, words]
  )

  return (
    <div className="app-shell">
      <div className="page-container">
        <header className="hero-panel">
          <div className="hero-content">
            <p className="eyebrow">VocabVerse · 背词专注模式</p>
            <h1>轻量卡片流，专注记忆单词</h1>
            <p className="lede">
              只保留背单词这一件事，用简洁的卡片节奏与收藏列表，帮助你快速开始今天的词包。
            </p>
            <div className="hero-actions">
              <button className="btn-primary" type="button">
                开始今日背词
              </button>
              <button className="btn-ghost" type="button" onClick={() => setShowFavorites((prev) => !prev)}>
                {showFavorites ? '查看全部词' : '仅看收藏'}
              </button>
            </div>
            <div className="hero-stats">
              {stats.map((item) => (
                <div key={item.label} className="stat-card">
                  <p className="stat-label">{item.label}</p>
                  <p className="stat-value">{item.value}</p>
                  <p className="stat-hint">{item.hint}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-visual" aria-hidden>
            <div className="orbit">
              <div className="orbit-dot" />
              <div className="orbit-dot" />
              <div className="orbit-dot" />
            </div>
            <div className="floating-card">每日仅一屏，沉浸背词</div>
          </div>
        </header>

        <main className="content">
          <section className="section">
            <SectionHeader title="今日词包" subtitle="例句 + 标签 + 发音，一屏搞定" />
            <div className="word-grid">
              {displayWords.length ? (
                displayWords.map((word) => (
                  <WordCard
                    key={word.id}
                    word={word}
                    onToggleFavorite={toggleFavorite}
                    isFavorite={favorites.has(word.id)}
                  />
                ))
              ) : (
                <div className="empty-state">收藏夹暂时为空，先去浏览词卡吧。</div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
