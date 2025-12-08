import './App.css'
import { useEffect, useMemo, useState } from 'react'
import { SectionHeader } from './components/SectionHeader'
import { WordCard } from './components/WordCard'
import { useWordStore } from './store/useWordStore'

function App() {
  const {
    levels,
    currentLevelId,
    words,
    favorites,
    generatedImages,
    loading,
    initLevels,
    selectLevel,
    toggleFavorite,
    requestImage,
    markProgress
  } = useWordStore()
  const [onlyFavorite, setOnlyFavorite] = useState(false)

  useEffect(() => {
    void initLevels()
  }, [initLevels])

  const currentLevelName = useMemo(
    () => levels.find((level) => level.id === currentLevelId)?.name ?? '未选择',
    [currentLevelId, levels]
  )

  const stats = useMemo(
    () => [
      { label: '词库等级', value: currentLevelName, hint: '按年级/考试精准推送' },
      { label: '今日词包', value: words.length || '加载中', hint: '动态匹配你的水平' },
      { label: '已收藏', value: favorites.size, hint: '重点单词随时复习' }
    ],
    [currentLevelName, favorites.size, words.length]
  )

  const displayWords = useMemo(
    () => (onlyFavorite ? words.filter((word) => favorites.has(word.id)) : words),
    [favorites, onlyFavorite, words]
  )

  return (
    <div className="app-shell">
      <div className="page-container">
        <header className="hero-panel">
          <div className="hero-content">
            <p className="eyebrow">VocabVerse · AI 词汇记忆</p>
            <h1>选择水平 → 推送词表 → AI 助记图</h1>
            <p className="lede">
              先选定你的学习阶段（四级、六级、高中、少儿等），系统自动推送对应词包，并可一键生成助记图片，所有背诵与生成记录均会保存。
            </p>
            <div className="hero-actions">
              <button className="btn-primary" type="button" onClick={() => setOnlyFavorite(false)}>
                回到完整词包
              </button>
              <button className="btn-ghost" type="button" onClick={() => setOnlyFavorite((prev) => !prev)}>
                {onlyFavorite ? '查看全部词' : '仅看收藏'}
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
            <div className="floating-card">AIGC 助记 · 云端保存记录</div>
          </div>
        </header>

        <main className="content">
          <section className="section">
            <SectionHeader title="选择你的词汇水平" subtitle="按学段/考试分层推荐，自动匹配词包" />
            <div className="level-grid">
              {levels.map((level) => {
                const active = level.id === currentLevelId
                return (
                  <button
                    key={level.id}
                    className={`level-card ${active ? 'is-active' : ''}`}
                    type="button"
                    onClick={() => selectLevel(level.id)}
                  >
                    <div className="level-card__badge">{level.category}</div>
                    <h3>{level.name}</h3>
                    <p>{level.description}</p>
                    <span className="level-card__meta">词量 {level.wordCount}</span>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="section">
            <SectionHeader title="今日词包" subtitle={loading ? '加载中...' : '例句 + 标签 + AI 助记'} />
            <div className="word-grid">
              {displayWords.length ? (
                displayWords.map((word) => (
                  <WordCard
                    key={word.id}
                    word={word}
                    onToggleFavorite={toggleFavorite}
                    isFavorite={favorites.has(word.id)}
                    onGenerateImage={(w) => {
                      void markProgress(w.id, currentLevelId ?? 'unknown', 'view')
                      void requestImage(w, currentLevelId)
                    }}
                    generatedImageUrl={generatedImages[word.id]?.imageUrl}
                  />
                ))
              ) : (
                <div className="empty-state">{loading ? '正在为你准备词包…' : '收藏夹暂时为空，先去浏览词卡吧。'}</div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
