import type { Edge } from '@xyflow/react'
import type { Entity, Relationship } from '@/types'
import type { EntityNodeType } from '@/components/graph/EntityNode'

const LAYOUT_POSITIONS: Record<string, { x: number; y: number }> = {}
let layoutIndex = 0

function getAutoPosition(id: string) {
  if (!LAYOUT_POSITIONS[id]) {
    const col = layoutIndex % 4
    const row = Math.floor(layoutIndex / 4)
    LAYOUT_POSITIONS[id] = { x: 80 + col * 200, y: 80 + row * 160 }
    layoutIndex++
  }
  return LAYOUT_POSITIONS[id]
}

export function resetLayout() {
  Object.keys(LAYOUT_POSITIONS).forEach((k) => delete LAYOUT_POSITIONS[k])
  layoutIndex = 0
}

export function entitiesToNodes(entities: Entity[]): EntityNodeType[] {
  return entities.map((entity) => ({
    id: entity.id,
    type: 'entityNode',
    position: getAutoPosition(entity.id),
    data: { entity },
  }))
}

export function relationshipsToEdges(relationships: Relationship[]): Edge[] {
  return relationships.map((rel) => ({
    id: rel.id,
    source: rel.fromId,
    target: rel.toId,
    type: 'default',
    label: rel.label,
    data: { relationship: rel },
    animated: rel.type === 'PAST',
    style: edgeStyle(rel.type),
  }))
}

function edgeStyle(type: Relationship['type']) {
  const colors: Record<Relationship['type'], string> = {
    ALLY:     '#1D9E75',
    ENEMY:    '#D85A30',
    NEUTRAL:  '#888780',
    FAMILY:   '#378ADD',
    CONTROLS: '#7F77DD',
    BELONGS:  '#7F77DD',
    PAST:     '#FAC775',
  }
  return { stroke: colors[type] ?? '#888780', strokeWidth: 1.5 }
}
