import { useEffect } from 'react'
import { useStoryStore } from '@/lib/store'
import { sampleTales } from '@/lib/sampleData'
import { GraphCanvas } from '@/components/graph/GraphCanvas'
import { DetailPanel } from '@/components/detail/DetailPanel'
import { ChatPanel } from '@/components/chat/ChatPanel'
import { TopBar } from '@/components/layout/TopBar'
import './App.css'

export default function App() {
  const { addTale, openTale, openScene, tales } = useStoryStore()

  useEffect(() => {
    // サンプルデータ投入（初回のみ）
    if (tales.length === 0) {
      sampleTales.forEach(addTale)
      // 最初のTaleとSceneを自動で開く（Sprint 1: 簡易動作確認）
      const first = sampleTales[0]
      openTale(first.id)
      if (first.scenes.length > 0) {
        openScene(first.scenes[0].id)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="app">
      <TopBar />
      <div className="main">
        <div className="canvas-area">
          <GraphCanvas />
        </div>
        <div className="detail-area">
          <DetailPanel />
        </div>
      </div>
      <div className="chat-area">
        <ChatPanel />
      </div>
    </div>
  )
}
