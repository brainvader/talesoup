import { useState } from 'react'
import { useStoryStore } from '@/lib/store'
import { TaleCard } from '@/components/tale/TaleCard'
import { NewTaleModal } from '@/components/tale/NewTaleModal'
import type { Tale } from '@/types'
import styles from './TaleListPage.module.css'

export function TaleListPage() {
  const { tales, openTale } = useStoryStore()
  const [showModal, setShowModal] = useState(false)

  const handleOpen = (tale: Tale) => {
    openTale(tale.id)
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logo}>
            <div className={styles.logoDot} />
            <span className={styles.logoText}>TaleSoup</span>
          </div>
          <p className={styles.tagline}>話しかけるとグラフが育ち、グラフが育つほど面白い物語が生まれる。</p>
        </div>
        <button className={styles.newBtn} onClick={() => setShowModal(true)}>
          + 新しいTale
        </button>
      </div>

      {tales.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>◎</div>
          <div className={styles.emptyTitle}>まだTaleがありません</div>
          <div className={styles.emptyDesc}>「新しいTale」から物語を始めましょう</div>
          <button className={styles.emptyBtn} onClick={() => setShowModal(true)}>
            最初のTaleを作る
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {tales.map((tale) => (
            <TaleCard key={tale.id} tale={tale} onOpen={handleOpen} />
          ))}
        </div>
      )}

      {showModal && (
        <NewTaleModal onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}
