import { useStoryStore } from '@/lib/store'
import styles from './TopBar.module.css'

const STATUS_LABEL: Record<string, string> = {
  DRAFT:     '下書き',
  ACTIVE:    '執筆中',
  COMPLETED: '完結',
  ARCHIVED:  'アーカイブ',
}

export function TopBar() {
  const { currentTale, currentScene, tales, openTale, openScene, closeScene } = useStoryStore()
  const tale = currentTale()
  const scene = currentScene()

  return (
    <header className={styles.bar}>
      <div className={styles.left}>
        <div className={styles.dot} />
        <span className={styles.title}>TaleSoup</span>

        {/* パンくず: Tale名 */}
        {tale && (
          <>
            <span className={styles.sep}>/</span>
            <button
              className={styles.breadcrumb}
              onClick={() => closeScene()}
            >
              {tale.title}
            </button>
            <span className={styles.statusBadge}>
              {STATUS_LABEL[tale.status] ?? tale.status}
            </span>
          </>
        )}

        {/* パンくず: Scene名 */}
        {scene && (
          <>
            <span className={styles.sep}>/</span>
            <span className={styles.breadcrumbCurrent}>{scene.title}</span>
          </>
        )}
      </div>

      {/* Scene切替 */}
      {tale && tale.scenes.length > 0 && (
        <div className={styles.sceneTabs}>
          {tale.scenes.map((sc) => (
            <button
              key={sc.id}
              className={`${styles.sceneTab} ${scene?.id === sc.id ? styles.sceneTabActive : ''}`}
              onClick={() => openScene(sc.id)}
            >
              {sc.title}
            </button>
          ))}
        </div>
      )}

      <div className={styles.right}>
        {/* Tale未選択時はTale一覧から選べるセレクタ */}
        {!tale && tales.length > 0 && (
          <select
            className={styles.taleSelect}
            onChange={(e) => openTale(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>Taleを選択...</option>
            {tales.map((t) => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
        )}
        <span className={styles.sprint}>Sprint 1</span>
      </div>
    </header>
  )
}
