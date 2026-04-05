import type { Tale } from '@/types'
import styles from './TaleCard.module.css'

interface Props {
  tale: Tale
  onOpen: (tale: Tale) => void
}

const STATUS_LABEL: Record<string, string> = {
  DRAFT:     '下書き',
  ACTIVE:    '執筆中',
  COMPLETED: '完結',
  ARCHIVED:  'アーカイブ',
}

const STATUS_COLOR: Record<string, string> = {
  DRAFT:     styles.statusDraft,
  ACTIVE:    styles.statusActive,
  COMPLETED: styles.statusCompleted,
  ARCHIVED:  styles.statusArchived,
}

export function TaleCard({ tale, onOpen }: Props) {
  const charCount = tale.entities.filter((e) => e.type === 'CHARACTER').length
  const sceneCount = tale.scenes.length
  const relCount = tale.relationships.length

  const updatedAt = new Date(tale.updatedAt).toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'short', day: 'numeric',
  })

  return (
    <div className={styles.card} onClick={() => onOpen(tale)}>
      <div className={styles.cardHeader}>
        <span className={`${styles.status} ${STATUS_COLOR[tale.status] ?? ''}`}>
          {STATUS_LABEL[tale.status] ?? tale.status}
        </span>
        <span className={styles.date}>{updatedAt}</span>
      </div>

      <div className={styles.title}>{tale.title}</div>

      {tale.description && (
        <div className={styles.desc}>{tale.description}</div>
      )}

      <div className={styles.stats}>
        <Stat value={sceneCount} label="Scene" />
        <Stat value={charCount} label="キャラ" />
        <Stat value={relCount} label="関係" />
      </div>

      {/* Sceneプレビュー */}
      {tale.scenes.length > 0 && (
        <div className={styles.scenes}>
          {tale.scenes.slice(0, 3).map((sc) => (
            <div key={sc.id} className={styles.sceneChip}>
              {sc.title}
            </div>
          ))}
          {tale.scenes.length > 3 && (
            <div className={styles.sceneMore}>+{tale.scenes.length - 3}</div>
          )}
        </div>
      )}
    </div>
  )
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className={styles.stat}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  )
}
