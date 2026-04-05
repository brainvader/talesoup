import { useStoryStore } from '@/lib/store'
import styles from './DetailPanel.module.css'

const TYPE_LABEL: Record<string, string> = {
  CHARACTER:    'キャラクター',
  PLACE:        '場所',
  ORGANIZATION: '組織',
  ITEM:         'アイテム',
  EVENT:        '出来事',
}

const REL_LABEL: Record<string, string> = {
  ALLY:     '仲間',
  ENEMY:    '対立',
  NEUTRAL:  '中立',
  FAMILY:   '家族',
  CONTROLS: '支配',
  BELONGS:  '所属',
  PAST:     '過去',
}

export function DetailPanel() {
  const { selectedEntityId, currentTale } = useStoryStore()
  const tale = currentTale()
  const entity = tale?.entities.find((e) => e.id === selectedEntityId)

  if (!entity) {
    return (
      <div className={styles.panel}>
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>◎</div>
          <div className={styles.emptyText}>ノードを選択</div>
        </div>
      </div>
    )
  }

  const relatedRels = tale?.relationships.filter(
    (r) => r.fromId === entity.id || r.toId === entity.id
  ) ?? []

  // このEntityが登場するScene
  const appearsIn = tale?.scenes.filter((sc) =>
    sc.entityIds.includes(entity.id)
  ) ?? []

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.typeLabel}>{TYPE_LABEL[entity.type] ?? entity.type}</div>
        <div className={styles.name}>{entity.name}</div>
        {entity.alive === false && (
          <span className={styles.deadBadge}>死亡</span>
        )}
      </div>

      <div className={styles.body}>
        <Row label="役割" value={entity.role} />
        {entity.personality && (
          <Row label="性格・特徴" value={entity.personality} />
        )}

        {entity.tags.length > 0 && (
          <div className={styles.row}>
            <div className={styles.label}>タグ</div>
            <div className={styles.tags}>
              {entity.tags.map((t) => (
                <span key={t} className={styles.tag}>{t}</span>
              ))}
            </div>
          </div>
        )}

        {relatedRels.length > 0 && (
          <div className={styles.row}>
            <div className={styles.label}>関係</div>
            <div className={styles.rels}>
              {relatedRels.map((rel) => {
                const otherId = rel.fromId === entity.id ? rel.toId : rel.fromId
                const other = tale?.entities.find((e) => e.id === otherId)
                const dir = rel.fromId === entity.id ? '→' : '←'
                return (
                  <div key={rel.id} className={styles.relRow}>
                    <span className={styles.relType}>{REL_LABEL[rel.type] ?? rel.type}</span>
                    <span className={styles.relDir}>{dir}</span>
                    <span className={styles.relName}>{other?.name ?? otherId}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {appearsIn.length > 0 && (
          <div className={styles.row}>
            <div className={styles.label}>登場シーン</div>
            <div className={styles.scenes}>
              {appearsIn.map((sc) => (
                <div key={sc.id} className={styles.sceneChip}>
                  {sc.title}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.row}>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{value}</div>
    </div>
  )
}
