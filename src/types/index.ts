// ============================================================
// TaleSoup コアデータ型
// ARCHITECTURE.md準拠: Tale / Scene / Character /
//   Relationship / Event / TwistPattern / ChoiceRecord
// ============================================================

// ------------------------------------------------------------
// 共通
// ------------------------------------------------------------

export type ID = string

// ------------------------------------------------------------
// Entity（登場人物・場所・組織・アイテム）
// ------------------------------------------------------------

export type EntityType =
  | 'CHARACTER'     // 登場人物
  | 'PLACE'         // 場所
  | 'ORGANIZATION'  // 組織・勢力
  | 'ITEM'          // アイテム・道具
  | 'EVENT'         // 出来事（ノードとして表現する場合）

export type RelationType =
  | 'ALLY'      // 仲間
  | 'ENEMY'     // 対立
  | 'NEUTRAL'   // 中立
  | 'FAMILY'    // 家族
  | 'CONTROLS'  // 支配
  | 'BELONGS'   // 所属
  | 'PAST'      // 過去の関係

export interface Entity {
  id: ID
  name: string
  type: EntityType
  role: string
  personality: string
  tags: string[]
  alive?: boolean
  metadata?: Record<string, unknown>
}

export interface Relationship {
  id: ID
  fromId: ID
  toId: ID
  type: RelationType
  label: string
  sceneId?: ID
  weight?: number
}

// ------------------------------------------------------------
// StoryEvent（出来事・伏線）
// ------------------------------------------------------------

export type EventType =
  | 'ACTION'
  | 'DIALOGUE'
  | 'REVELATION'
  | 'FORESHADOW'
  | 'PAYOFF'
  | 'TWIST'
  | 'OTHER'

export interface StoryEvent {
  id: ID
  sceneId: ID
  order: number
  type: EventType
  actorId?: ID
  targetId?: ID
  locationId?: ID
  description: string
  foreshadowPayoffId?: ID
  createdAt: string
}

// ------------------------------------------------------------
// Scene（場面）
// ------------------------------------------------------------

export interface Scene {
  id: ID
  taleId: ID
  title: string
  synopsis?: string
  order: number
  entityIds: ID[]
  events: StoryEvent[]
  createdAt: string
  updatedAt: string
}

// ------------------------------------------------------------
// TwistPattern（転換パターン）
// ------------------------------------------------------------

export type TwistCategory =
  | 'BETRAYAL'
  | 'REVELATION'
  | 'ROLE_REVERSAL'
  | 'SACRIFICE'
  | 'UNEXPECTED_ALLY'
  | 'TRAGIC_MISTAKE'
  | 'OTHER'

export interface TwistPattern {
  id: ID
  category: TwistCategory
  name: string
  description: string
  appliedSceneIds: ID[]
  template?: string
  createdAt: string
}

// ------------------------------------------------------------
// ChoiceRecord（人間の選択履歴）
// ------------------------------------------------------------

export type ChoiceActionType =
  | 'CREATE_ENTITY'
  | 'UPDATE_ENTITY'
  | 'DELETE_ENTITY'
  | 'CREATE_RELATIONSHIP'
  | 'DELETE_RELATIONSHIP'
  | 'CREATE_EVENT'
  | 'CREATE_SCENE'
  | 'APPLY_TWIST'
  | 'ACCEPT_AI_SUGGESTION'
  | 'REJECT_AI_SUGGESTION'

export interface ChoiceRecord {
  id: ID
  taleId: ID
  sceneId?: ID
  actionType: ChoiceActionType
  inputText?: string
  selectedOption?: string
  rejectedOptions?: string[]
  reason?: string
  payload: unknown
  createdAt: string
}

// ------------------------------------------------------------
// Tale（物語全体）旧Story→Tale に統一
// ------------------------------------------------------------

export type TaleStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'

export interface Tale {
  id: ID
  title: string
  description?: string
  status: TaleStatus
  entities: Entity[]
  relationships: Relationship[]
  scenes: Scene[]
  twistPatterns: TwistPattern[]
  choiceRecords: ChoiceRecord[]
  createdAt: string
  updatedAt: string
}

// ------------------------------------------------------------
// React Flow ノード/エッジ用データ型
// ------------------------------------------------------------

export interface EntityNodeData extends Record<string, unknown> {
  entity: Entity
}

export interface RelationshipEdgeData extends Record<string, unknown> {
  relationship: Relationship
}

// ------------------------------------------------------------
// チャット・Tool Use
// ------------------------------------------------------------

export type MessageRole = 'user' | 'assistant' | 'system'

export interface ChatMessage {
  id: ID
  role: MessageRole
  content: string
  timestamp: string
  actions?: GraphAction[]
}

export type GraphActionType =
  | 'CREATE_ENTITY'
  | 'UPDATE_ENTITY'
  | 'DELETE_ENTITY'
  | 'CREATE_RELATIONSHIP'
  | 'DELETE_RELATIONSHIP'
  | 'CREATE_EVENT'
  | 'CREATE_SCENE'
  | 'APPLY_TWIST'

export interface GraphAction {
  type: GraphActionType
  payload: unknown
  description: string
}
