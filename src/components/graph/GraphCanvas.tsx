import { useCallback, useEffect, useState } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  type Connection,
  type NodeTypes,
  type Node,
  type Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { useStoryStore } from '@/lib/store'
import { entitiesToNodes, relationshipsToEdges } from '@/lib/graphUtils'
import { EntityNode } from './EntityNode'
import { ContextMenu, type ContextMenuItem } from './ContextMenu'
import type { Entity, EntityType, RelationType } from '@/types'

const nodeTypes: NodeTypes = { entityNode: EntityNode as NodeTypes[string] }

const REL_TYPES: { type: RelationType; label: string }[] = [
  { type: 'ALLY', label: '仲間' },
  { type: 'ENEMY', label: '対立' },
  { type: 'FAMILY', label: '家族' },
  { type: 'CONTROLS', label: '支配' },
  { type: 'BELONGS', label: '所属' },
  { type: 'PAST', label: '過去' },
  { type: 'NEUTRAL', label: '中立' },
]

interface MenuState {
  x: number
  y: number
  items: ContextMenuItem[]
}

export function GraphCanvas() {
  const {
    currentTale,
    currentScene,
    addRelationship,
    removeRelationship,
    addEntity,
    removeEntity,
    selectEntity,
    selectRelationship,
  } = useStoryStore()

  const tale = currentTale()
  const scene = currentScene()

  const visibleEntities = tale
    ? scene
      ? tale.entities.filter((e) => scene.entityIds.includes(e.id))
      : tale.entities
    : []

  const visibleRelationships = tale
    ? scene
      ? tale.relationships.filter(
        (r) =>
          scene.entityIds.includes(r.fromId) &&
          scene.entityIds.includes(r.toId)
      )
      : tale.relationships
    : []

  const [nodes, setNodes, onNodesChange] = useNodesState(
    entitiesToNodes(visibleEntities)
  )
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    relationshipsToEdges(visibleRelationships)
  )
  const [menu, setMenu] = useState<MenuState | null>(null)

  useEffect(() => {
    setNodes(entitiesToNodes(visibleEntities))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tale?.entities, scene?.entityIds])

  useEffect(() => {
    setEdges(relationshipsToEdges(visibleRelationships))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tale?.relationships, scene?.entityIds])

  const onConnect = useCallback(
    (params: Connection) => {
      const newRel = {
        id: `rel-${Date.now()}`,
        fromId: params.source,
        toId: params.target,
        type: 'NEUTRAL' as const,
        label: '関係',
        sceneId: scene?.id,
      }
      addRelationship(newRel)
      setEdges((eds) => addEdge(params, eds))
    },
    [addRelationship, setEdges, scene]
  )

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      selectEntity(node.id)
      selectRelationship(null)
    },
    [selectEntity, selectRelationship]
  )

  const onPaneClick = useCallback(() => {
    selectEntity(null)
    selectRelationship(null)
    setMenu(null)
  }, [selectEntity, selectRelationship])

  // ノード右クリック
  const onNodeContextMenu = useCallback(
    (e: React.MouseEvent, node: Node) => {
      e.preventDefault()
      const entity = tale?.entities.find((en) => en.id === node.id)
      if (!entity) return

      setMenu({
        x: e.clientX,
        y: e.clientY,
        items: [
          { label: entity.name, icon: '◎' },
          { divider: true },
          {
            label: '詳細を表示',
            icon: '→',
            onClick: () => {
              selectEntity(entity.id)
              selectRelationship(null)
            },
          },
          {
            label: '削除',
            icon: '×',
            danger: true,
            onClick: () => {
              removeEntity(entity.id)
              selectEntity(null)
            },
          },
        ],
      })
    },
    [tale, selectEntity, selectRelationship, removeEntity]
  )

  // エッジ右クリック
  const onEdgeContextMenu = useCallback(
    (e: React.MouseEvent, edge: Edge) => {
      e.preventDefault()
      const rel = tale?.relationships.find((r) => r.id === edge.id)
      if (!rel) return

      const fromEntity = tale?.entities.find((en) => en.id === rel.fromId)
      const toEntity = tale?.entities.find((en) => en.id === rel.toId)
      const label = `${fromEntity?.name ?? '?'} → ${toEntity?.name ?? '?'}`

      setMenu({
        x: e.clientX,
        y: e.clientY,
        items: [
          { label, icon: '─' },
          { divider: true },
          // 関係種別の変更
          ...REL_TYPES.map((rt) => ({
            label: `${rt.label}に変更`,
            icon: rel.type === rt.type ? '✓' : ' ',
            onClick: () => {
              // storeのupdateRelationshipを使って変更
              // 現状はremove→addで対応
              removeRelationship(rel.id)
              addRelationship({ ...rel, type: rt.type, label: rt.label })
              selectRelationship(rel.id)
            },
          })),
          { divider: true },
          {
            label: '詳細を表示',
            icon: '→',
            onClick: () => {
              selectRelationship(rel.id)
              selectEntity(null)
            },
          },
          {
            label: '削除',
            icon: '×',
            danger: true,
            onClick: () => {
              removeRelationship(rel.id)
              selectRelationship(null)
            },
          },
        ],
      })
    },
    [tale, addRelationship, removeRelationship, selectEntity, selectRelationship]
  )

  // 背景右クリック
  const onPaneContextMenu = useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      e.preventDefault()

      const createEntity = (type: EntityType) => {
        const name = prompt(`${TYPE_LABEL[type]}の名前を入力してください:`)
        if (!name?.trim()) return
        const entity: Entity = {
          id: `entity-${Date.now()}`,
          name: name.trim(),
          type,
          role: '',
          personality: '',
          tags: [],
          alive: type === 'CHARACTER' ? true : undefined,
        }
        addEntity(entity)
      }

      setMenu({
        x: e.clientX,
        y: e.clientY,
        items: [
          { label: 'キャラクターを追加', icon: '人', onClick: () => createEntity('CHARACTER') },
          { label: '場所を追加', icon: '◇', onClick: () => createEntity('PLACE') },
          { label: '組織を追加', icon: '◈', onClick: () => createEntity('ORGANIZATION') },
          { label: 'アイテムを追加', icon: '◆', onClick: () => createEntity('ITEM') },
        ],
      })
    },
    [addEntity]
  )

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onNodeContextMenu={onNodeContextMenu}
        onEdgeContextMenu={onEdgeContextMenu}
        onPaneContextMenu={onPaneContextMenu}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={2}
        defaultEdgeOptions={{
          animated: false,
          style: { stroke: '#B4B2A9', strokeWidth: 1.5 },
        }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#D3D1C7" />
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor={(node) => {
            const entity = (node.data as { entity?: Entity })?.entity
            const colors: Record<string, string> = {
              CHARACTER: '#1D9E75',
              PLACE: '#7F77DD',
              ORGANIZATION: '#378ADD',
              ITEM: '#FAC775',
              EVENT: '#D85A30',
            }
            return colors[entity?.type ?? ''] ?? '#B4B2A9'
          }}
          maskColor="rgba(241,239,232,0.6)"
          style={{ background: '#F1EFE8', border: '0.5px solid #D3D1C7' }}
        />
      </ReactFlow>

      {menu && (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          items={menu.items}
          onClose={() => setMenu(null)}
        />
      )}
    </>
  )
}

const TYPE_LABEL: Record<EntityType, string> = {
  CHARACTER: 'キャラクター',
  PLACE: '場所',
  ORGANIZATION: '組織',
  ITEM: 'アイテム',
  EVENT: '出来事',
}
