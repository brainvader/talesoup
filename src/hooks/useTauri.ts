import { useEffect, useState } from 'react'

// Tauri環境かブラウザかを判定
export function isTauriEnv(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window
}

// アプリ情報（Tauri環境では Rust から取得）
export function useAppInfo() {
  const [info, setInfo] = useState({ name: 'TaleSoup', version: '0.1.0', sprint: 'Sprint 1' })

  useEffect(() => {
    if (!isTauriEnv()) return
    import('@tauri-apps/api/core').then(({ invoke }) => {
      invoke<typeof info>('get_app_info').then(setInfo).catch(console.error)
    })
  }, [])

  return info
}

// Sprint 2以降: ストーリーのファイル保存/読み込み
// export async function saveStory(story: Story): Promise<void> { ... }
// export async function loadStory(path: string): Promise<Story> { ... }
