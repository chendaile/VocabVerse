import './App.css'

function App() {
  return (
    <div className="page">
      <section className="hero">
        <div className="hero-content">
          <div>
            <span className="eyebrow">VocabVerse · AI 词汇记忆</span>
            <h1>同款体验，直接装进你的 Android</h1>
            <p className="lede">
              选择水平 → 推送词表 → AI 助记图，现已打包为 Android 客户端。支持微信登录，同步学习进度与收藏。
            </p>
            <div className="actions">
              <a className="btn btn-primary" href="#" download>
                下载 APK
              </a>
              <a className="btn btn-ghost" href="#" target="_blank" rel="noreferrer">
                Google Play / 应用商店
              </a>
            </div>
            <p className="muted" style={{ marginTop: '10px' }}>
              发布渠道确认后替换下载链接
            </p>
          </div>
          <div className="card">
            <h3 className="section-title" style={{ marginBottom: '6px' }}>
              更新日志
            </h3>
            <p className="muted" style={{ margin: '0 0 12px' }}>
              最近更新 · v0.1.0
            </p>
            <div className="dl-list">
              <div className="dl-item">
                <span>新增微信登录流程</span>
                <span className="pill">登录</span>
              </div>
              <div className="dl-item">
                <span>词表按学段/考试分级</span>
                <span className="pill">词库</span>
              </div>
              <div className="dl-item">
                <span>AI 助记图生成入口</span>
                <span className="pill">AIGC</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="card">
        <h3 className="section-title">核心体验</h3>
        <p className="section-sub">移动端与 Web 同步，账号/收藏/学习进度一体化</p>
        <div className="feature-grid">
          <div className="feature">
            <strong>按水平推词</strong>
            <span className="muted">四/六级、K12、考试专项自动匹配词包。</span>
          </div>
          <div className="feature">
            <strong>AI 助记图</strong>
            <span className="muted">一键生成助记图片，帮助快速记忆单词。</span>
          </div>
          <div className="feature">
            <strong>微信登录</strong>
            <span className="muted">授权即用，学习数据云端同步。</span>
          </div>
          <div className="feature">
            <strong>离线可看</strong>
            <span className="muted">下载后核心词书可在离线模式浏览。</span>
          </div>
        </div>
      </section>

      <section className="card download-card">
        <div>
          <h3 className="section-title">下载与安装</h3>
          <p className="section-sub">
            直接下载 APK 或从应用商店获取。安装前请允许“未知来源”，安装后首次启动需联网完成授权。
          </p>
          <div className="actions">
            <a className="btn btn-primary" href="#" download>
              立即下载 APK
            </a>
            <a className="btn btn-ghost" href="#" target="_blank" rel="noreferrer">
              应用商店
            </a>
          </div>
        </div>
        <div className="dl-list">
          <div className="dl-item">
            <span>APK 签名</span>
            <span>待发布</span>
          </div>
          <div className="dl-item">
            <span>版本号</span>
            <span>0.1.0</span>
          </div>
          <div className="dl-item">
            <span>更新日期</span>
            <span>2025-12-08</span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default App
