import { useStoryStore } from '@/lib/store'
import styles from './DetailPanel.module.css'

const TYPE_LABEL: Record<string, string> = {
  CHARACTER: 'キャラクター',
  PLACE: '場所',
  ORGANIZATION: '組織',
  ITEM: 'アイテム',
  EVENT: '出来事',
}

const REL_LABEL: Record<string, string> = {
  ALLY: '仲間',
  ENEMY: '対立',
  NEUTRAL: '中立',
  FAMILY: '家族',
  CONTROLS: '支配',
  BELONGS: '所属',
  PAST: '過去',
}

const REL_COLOR: Record<string, string> = {
  ALLY: '#E1F5EE',
  ENEMY: '#FAECE7',
  FAMILY: '#E6F1FB',
  CONTROLS: '#EEEDFE',
  BELONGS: '#EEEDFE',
  PAST: '#FAEEDA',
  NEUTRAL: '#F1EFE8',
}

const REL_TEXT_COLOR: Record<string, string> = {
  ALLY: '#0F6E56',
  ENEMY: '#993C1D',
  FAMILY: '#185FA5',
  CONTROLS: '#534AB7',
  BELONGS: '#534AB7',
  PAST: '#854F0B',
  NEUTRAL: '#5F5E5A',
}

export function DetailPanel() {
  const {
    selectedEntityId,
    selectedRelationshipId,
    currentTale,
  } = useStoryStore()

  const tale = currentTale()

  // Relationship が選択されている場合
  if (selectedRelationshipId) {
    const rel = tale?.relationships.find((r) => r.id === selectedRelationshipId)
    if (!rel) return <EmptyPanel />

    const fromEntity = tale?.entities.find((e) => e.id === rel.fromId)
    const toEntity = tale?.entities.find((e) => e.id === rel.toId)

    return (
      <div className={styles.panel}>
        <div className={styles.header}>
          <div className={styles.typeLabel}>関係</div>
          <div className={styles.name}>
            {fromEntity?.name ?? '?'} → {toEntity?.name ?? '?'}
          </div>
          <span className={styles.relBadge} style={{
            background: REL_COLOR[rel.type] ?? '#F1EFE8',
            color: REL_TEXT_COLOR[rel.type] ?? '#5F5E5A',
          }}>
            {REL_LABEL[rel.type] ?? rel.type}
          </span>
        </div>
        <div className={styles.body}>
          <Row label="ラベル" value={rel.label} />
          {rel.weight != null && (
            <Row label="強度" value={`${Math.round(rel.weight * 100)}%`} />
          )}
          {rel.sceneId && (
            <Row
              label="Scene"
              value={tale?.scenes.find((s) => s.id === rel.sceneId)?.title ?? rel.sceneId}
            />
          )}
          <div className={styles.row}>
            <div className={styles.label}>接続</div>
            <div className={styles.value}>
              <span className={styles.entityLink}>{fromEntity?.name ?? '?'}</span>
              <span style={{ color: 'var(--ts-muted)', margin: '0 6px' }}>→</span>
              <span className={styles.entityLink}>{toEntity?.name ?? '?'}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Entity が選択されている場合
  const entity = tale?.entities.find((e) => e.id === selectedEntityId)
  if (!entity) return <EmptyPanel />

  const relatedRels = tale?.relationships.filter(
    (r) => r.fromId === entity.id || r.toId === entity.id
  ) ?? []

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
                    <span className={styles.relType}
                      style={{
                        background: REL_COLOR[rel.type] ?? '#F1EFE8',
                        color: REL_TEXT_COLOR[rel.type] ?? '#5F5E5A',
                      }}
                    >
                      {REL_LABEL[rel.type] ?? rel.type}
                    </span>
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
                <div key={sc.id} className={styles.sceneChip}>{sc.title}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyPanel() {
  return (
    <div className={styles.panel}>
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>◎</div>
        <div className={styles.emptyText}>ノードまたは関係線を選択</div>
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
