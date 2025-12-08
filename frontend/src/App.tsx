import './App.css'
import { useMemo } from 'react'
import { SectionHeader } from './components/SectionHeader'
import { FeatureCard } from './components/FeatureCard'
import { PlanCard } from './components/PlanCard'
import { WordCard } from './components/WordCard'
import { StatCard } from './components/StatCard'
import { learningPlans, reviewStats } from './constants/mockData'
import { useWordStore } from './store/useWordStore'

function App() {
  const { words, favorites, toggleFavorite } = useWordStore()

  const heroStats = useMemo(
    () => [
      { label: '高频词库', value: '6k+', desc: '覆盖雅思 / 托福 / 考研' },
      { label: 'AI 例句', value: '3k+', desc: '上下文化表达示例' },
      { label: '日活学习', value: '92%', desc: '保持连续打卡' }
    ],
    []
  )

  const features = useMemo(
    () => [
      { icon: '🧠', title: '间隔复习', description: '结合熟练度自动生成复习列表，强化长期记忆。' },
      { icon: '🗣️', title: '口语跟读', description: '示例句子可直接跟读录音，练习发音与语调。' },
      { icon: '📈', title: '掌握进度', description: '实时掌握已学、待学、遗忘单词，方便冲刺考试。' },
      { icon: '🔐', title: '微信登录', description: '支持微信 OAuth，一键同步云端进度与收藏。' }
    ],
    []
  )

  return (
    <div className="app-shell">
      <header className="px-6 sm:px-10 py-8 sm:py-12 flex flex-col gap-6">
        <div className="glass-panel p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 text-sm text-primary bg-primary/10 px-3 py-1 rounded-full font-semibold">
                VocabVerse · 英语单词记忆
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-ink leading-tight">
                更聪明的单词记忆方式
              </h1>
              <p className="text-slate-600 text-base sm:text-lg max-w-2xl">
                结合微信登录、间隔复习与 AI 例句，帮助你在移动端与 Web 端同步掌握英语高频词汇。
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="rounded-lg bg-primary text-white px-4 py-2 font-semibold shadow-sm hover:bg-primary/90">
                  微信授权登录
                </button>
                <button className="rounded-lg border border-slate-200 px-4 py-2 text-slate-700 font-semibold hover:border-primary hover:text-primary">
                  体验 Demo
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 w-full sm:w-auto sm:min-w-[280px]">
              {heroStats.map((stat) => (
                <div key={stat.label} className="glass-panel p-3 text-center">
                  <p className="text-xs text-slate-500">{stat.label}</p>
                  <p className="text-2xl font-semibold text-ink">{stat.value}</p>
                  <p className="text-xs text-slate-400">{stat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="px-6 sm:px-10 pb-10 space-y-10">
        <section className="space-y-4">
          <SectionHeader title="学习概览" subtitle="一次浏览今日任务与掌握度" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {reviewStats.map((stat) => (
              <StatCard key={stat.label} stat={stat} />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeader title="核心功能" subtitle="覆盖学习、复习、口语练习与进度跟踪" />
          <div className="section-grid">
            {features.map((item) => (
              <FeatureCard key={item.title} {...item} />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeader
            title="学习计划"
            subtitle="根据考试目标与每日时长选择合适的路径"
            action={<button className="text-primary text-sm font-semibold">查看全部</button>}
          />
          <div className="section-grid">
            {learningPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeader
            title="例词体验"
            subtitle="精选示例演示「单词卡 + 例句 + 标签」结构"
            action={<button className="text-primary text-sm font-semibold">进入全部词书</button>}
          />
          <div className="section-grid">
            {words.map((word) => (
              <WordCard key={word.id} word={word} onToggleFavorite={toggleFavorite} isFavorite={favorites.has(word.id)} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
