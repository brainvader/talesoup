import { create } from 'zustand'
import type {
  Tale,
  Scene,
  Entity,
  Relationship,
  StoryEvent,
  ChoiceRecord,
  ChatMessage,
} from '@/types'

interface TaleSoupState {
  // -------------------------------------------------------
  // Tale一覧（ホーム画面用）
  // -------------------------------------------------------
  tales: Tale[]
  addTale: (tale: Tale) => void
  updateTale: (id: string, patch: Partial<Tale>) => void
  removeTale: (id: string) => void

  // -------------------------------------------------------
  // 現在開いているTale
  // -------------------------------------------------------
  currentTaleId: string | null
  openTale: (id: string) => void
  closeTale: () => void
  currentTale: () => Tale | null

  // -------------------------------------------------------
  // 現在開いているScene
  // -------------------------------------------------------
  currentSceneId: string | null
  openScene: (id: string) => void
  closeScene: () => void
  currentScene: () => Scene | null

  // -------------------------------------------------------
  // Entity操作（currentTale内）
  // -------------------------------------------------------
  addEntity: (entity: Entity) => void
  updateEntity: (id: string, patch: Partial<Entity>) => void
  removeEntity: (id: string) => void

  // -------------------------------------------------------
  // Relationship操作（currentTale内）
  // -------------------------------------------------------
  addRelationship: (rel: Relationship) => void
  removeRelationship: (id: string) => void

  // -------------------------------------------------------
  // Scene操作（currentTale内）
  // -------------------------------------------------------
  addScene: (scene: Scene) => void
  updateScene: (id: string, patch: Partial<Scene>) => void
  removeScene: (id: string) => void

  // -------------------------------------------------------
  // StoryEvent操作（currentScene内）
  // -------------------------------------------------------
  addEvent: (event: StoryEvent) => void

  // -------------------------------------------------------
  // ChoiceRecord
  // -------------------------------------------------------
  addChoiceRecord: (record: ChoiceRecord) => void

  // -------------------------------------------------------
  // 選択状態
  // -------------------------------------------------------
  selectedEntityId: string | null
  selectEntity: (id: string | null) => void
  selectedRelationshipId: string | null
  selectRelationship: (id: string | null) => void

  // -------------------------------------------------------
  // チャット
  // -------------------------------------------------------
  messages: ChatMessage[]
  addMessage: (msg: ChatMessage) => void
  clearMessages: () => void

  // -------------------------------------------------------
  // UI状態
  // -------------------------------------------------------
  isProcessing: boolean
  setProcessing: (v: boolean) => void
}

export const useStoryStore = create<TaleSoupState>((set, get) => ({
  // Tale一覧
  tales: [],
  addTale: (tale) => set((s) => ({ tales: [...s.tales, tale] })),
  updateTale: (id, patch) =>
    set((s) => ({
      tales: s.tales.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    })),
  removeTale: (id) =>
    set((s) => ({ tales: s.tales.filter((t) => t.id !== id) })),

  // 現在のTale
  currentTaleId: null,
  openTale: (id) => set({ currentTaleId: id, currentSceneId: null }),
  closeTale: () => set({ currentTaleId: null, currentSceneId: null }),
  currentTale: () => {
    const { tales, currentTaleId } = get()
    return tales.find((t) => t.id === currentTaleId) ?? null
  },

  // 現在のScene
  currentSceneId: null,
  openScene: (id) => set({ currentSceneId: id }),
  closeScene: () => set({ currentSceneId: null }),
  currentScene: () => {
    const { currentSceneId } = get()
    const tale = get().currentTale()
    if (!tale || !currentSceneId) return null
    return tale.scenes.find((s) => s.id === currentSceneId) ?? null
  },

  // Entity操作
  addEntity: (entity) =>
    set((s) => ({
      tales: s.tales.map((t) =>
        t.id === s.currentTaleId
          ? { ...t, entities: [...t.entities, entity] }
          : t
      ),
    })),
  updateEntity: (id, patch) =>
    set((s) => ({
      tales: s.tales.map((t) =>
        t.id === s.currentTaleId
          ? {
            ...t,
            entities: t.entities.map((e) =>
              e.id === id ? { ...e, ...patch } : e
            ),
          }
          : t
      ),
    })),
  removeEntity: (id) =>
    set((s) => ({
      tales: s.tales.map((t) =>
        t.id === s.currentTaleId
          ? {
            ...t,
            entities: t.entities.filter((e) => e.id !== id),
            relationships: t.relationships.filter(
              (r) => r.fromId !== id && r.toId !== id
            ),
          }
          : t
      ),
    })),

  // Relationship操作
  addRelationship: (rel) =>
    set((s) => ({
      tales: s.tales.map((t) =>
        t.id === s.currentTaleId
          ? { ...t, relationships: [...t.relationships, rel] }
          : t
      ),
    })),
  removeRelationship: (id) =>
    set((s) => ({
      tales: s.tales.map((t) =>
        t.id === s.currentTaleId
          ? {
            ...t,
            relationships: t.relationships.filter((r) => r.id !== id),
          }
          : t
      ),
    })),

  // Scene操作
  addScene: (scene) =>
    set((s) => ({
      tales: s.tales.map((t) =>
        t.id === s.currentTaleId
          ? { ...t, scenes: [...t.scenes, scene] }
          : t
      ),
    })),
  updateScene: (id, patch) =>
    set((s) => ({
      tales: s.tales.map((t) =>
        t.id === s.currentTaleId
          ? {
            ...t,
            scenes: t.scenes.map((sc) =>
              sc.id === id ? { ...sc, ...patch } : sc
            ),
          }
          : t
      ),
    })),
  removeScene: (id) =>
    set((s) => ({
      tales: s.tales.map((t) =>
        t.id === s.currentTaleId
          ? { ...t, scenes: t.scenes.filter((sc) => sc.id !== id) }
          : t
      ),
    })),

  // StoryEvent操作
  addEvent: (event) =>
    set((s) => ({
      tales: s.tales.map((t) =>
        t.id === s.currentTaleId
          ? {
            ...t,
            scenes: t.scenes.map((sc) =>
              sc.id === event.sceneId
                ? { ...sc, events: [...sc.events, event] }
                : sc
            ),
          }
          : t
      ),
    })),

  // ChoiceRecord
  addChoiceRecord: (record) =>
    set((s) => ({
      tales: s.tales.map((t) =>
        t.id === s.currentTaleId
          ? { ...t, choiceRecords: [...t.choiceRecords, record] }
          : t
      ),
    })),

  // 選択状態
  selectedEntityId: null,
  selectEntity: (id) => set({ selectedEntityId: id }),
  selectedRelationshipId: null,
  selectRelationship: (id) => set({ selectedRelationshipId: id }),

  // チャット
  messages: [],
  addMessage: (msg) =>
    set((s) => ({ messages: [...s.messages, msg] })),
  clearMessages: () => set({ messages: [] }),

  // UI
  isProcessing: false,
  setProcessing: (v) => set({ isProcessing: v }),
}))
