import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import type { NodeProps, Node } from '@xyflow/react'
import type { Entity } from '@/types'
import styles from './EntityNode.module.css'

export type EntityNodeType = Node<{ entity: Entity }>

const TYPE_LABEL: Record<string, string> = {
  CHARACTER:    'キャラ',
  PLACE:        '場所',
  ORGANIZATION: '組織',
  ITEM:         'アイテム',
  EVENT:        '出来事',
}

const KIND_CLASS: Record<string, string> = {
  CHARACTER: styles.character,
  PLACE:     styles.place,
  ORGANIZATION: styles.org,
  ITEM:      styles.item,
  EVENT:     styles.event,
}

export const EntityNode = memo(({ data, selected }: NodeProps<EntityNodeType>) => {
  const entity = data.entity
  return (
    <div className={`${styles.node} ${KIND_CLASS[entity.type] ?? ''} ${selected ? styles.selected : ''}`}>
      <Handle type="target" position={Position.Top} className={styles.handle} />
      <div className={styles.typeLabel}>{TYPE_LABEL[entity.type] ?? entity.type}</div>
      <div className={styles.name}>{entity.name}</div>
      <div className={styles.role}>{entity.role}</div>
      {entity.alive === false && <div className={styles.dead}>†</div>}
      <Handle type="source" position={Position.Bottom} className={styles.handle} />
    </div>
  )
})

EntityNode.displayName = 'EntityNode'
