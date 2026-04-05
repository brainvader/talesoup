import { useCallback, useEffect } from 'react'
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
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { useStoryStore } from '@/lib/store'
import { entitiesToNodes, relationshipsToEdges } from '@/lib/graphUtils'
import { EntityNode } from './EntityNode'
import type { Entity } from '@/types'

const nodeTypes: NodeTypes = { entityNode: EntityNode as NodeTypes[string] }

export function GraphCanvas() {
  const {
    currentTale,
    currentScene,
    addRelationship,
    selectEntity,
  } = useStoryStore()

  const tale = currentTale()
  const scene = currentScene()

  // Sceneが選択されていればそのEntityのみ、なければTale全体のEntityを表示
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
    },
    [selectEntity]
  )

  const onPaneClick = useCallback(() => {
    selectEntity(null)
  }, [selectEntity])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      onPaneClick={onPaneClick}
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
            CHARACTER:    '#1D9E75',
            PLACE:        '#7F77DD',
            ORGANIZATION: '#378ADD',
            ITEM:         '#FAC775',
            EVENT:        '#D85A30',
          }
          return colors[entity?.type ?? ''] ?? '#B4B2A9'
        }}
        maskColor="rgba(241,239,232,0.6)"
        style={{ background: '#F1EFE8', border: '0.5px solid #D3D1C7' }}
      />
    </ReactFlow>
  )
}
