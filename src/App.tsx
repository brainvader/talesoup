import { useEffect } from 'react'
import { useStoryStore } from '@/lib/store'
import { sampleTales } from '@/lib/sampleData'
import { TaleListPage } from '@/pages/TaleListPage'
import { GraphCanvas } from '@/components/graph/GraphCanvas'
import { DetailPanel } from '@/components/detail/DetailPanel'
import { ChatPanel } from '@/components/chat/ChatPanel'
import { TopBar } from '@/components/layout/TopBar'
import './App.css'

export default function App() {
  const { addTale, tales, currentTaleId } = useStoryStore()

  // サンプルデータ投入（初回のみ）
  useEffect(() => {
    if (tales.length === 0) {
      sampleTales.forEach(addTale)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // currentTaleId がなければホーム画面（Tale一覧）を表示
  if (!currentTaleId) {
    return <TaleListPage />
  }

  // Tale が開かれていればエディタ画面を表示
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
