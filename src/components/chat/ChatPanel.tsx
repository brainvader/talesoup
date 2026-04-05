import { useState, useRef, useEffect } from 'react'
import { useStoryStore } from '@/lib/store'
import styles from './ChatPanel.module.css'

// Sprint 2でClaude APIに繋げる予定のスタブ
async function processIntent(
  text: string
): Promise<{ message: string; actions: { description: string }[] }> {
  // TODO: POST /api/chat に送信してTool Use結果を受け取る
  await new Promise((r) => setTimeout(r, 600))
  return {
    message: `Intent判定: "${text}" → (Sprint 2でClaude APIが処理します)`,
    actions: [],
  }
}

const SUGGESTIONS = [
  '桃太郎と鬼大将は昔の仲間だった',
  '犬を仲間に加えた',
  'このシーンに転換を入れたい',
  '伏線を提案して',
  'グラフを見せて',
]

export function ChatPanel() {
  const [input, setInput] = useState('')
  const { messages, addMessage, isProcessing, setProcessing } = useStoryStore()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || isProcessing) return
    setInput('')

    addMessage({
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    })

    setProcessing(true)
    try {
      const result = await processIntent(text)
      addMessage({
        id: `msg-${Date.now()}-res`,
        role: 'assistant',
        content: result.message,
        timestamp: new Date().toISOString(),
        actions: result.actions as never,
      })
    } finally {
      setProcessing(false)
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSend()
  }

  return (
    <div className={styles.panel}>
      {/* メッセージ履歴 */}
      {messages.length > 0 && (
        <div className={styles.history}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.msg} ${msg.role === 'user' ? styles.msgUser : styles.msgAssistant}`}
            >
              {msg.content}
            </div>
          ))}
          {isProcessing && (
            <div className={`${styles.msg} ${styles.msgAssistant} ${styles.thinking}`}>
              考え中...
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {/* サジェスチョン */}
      <div className={styles.suggestions}>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            className={styles.chip}
            onClick={() => setInput(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {/* 入力エリア */}
      <div className={styles.inputRow}>
        <div className={styles.inputWrap}>
          <textarea
            className={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="話しかけるとグラフが育ちます...  ⌘↵ で送信"
            rows={1}
          />
        </div>
        <button
          className={styles.sendBtn}
          onClick={handleSend}
          disabled={!input.trim() || isProcessing}
        >
          送信
        </button>
      </div>
    </div>
  )
}
