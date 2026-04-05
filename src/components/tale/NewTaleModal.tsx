import { useState } from 'react'
import { useStoryStore } from '@/lib/store'
import type { Tale, TaleStatus } from '@/types'
import styles from './NewTaleModal.module.css'

interface Props {
  onClose: () => void
}

export function NewTaleModal({ onClose }: Props) {
  const { addTale, openTale } = useStoryStore()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TaleStatus>('DRAFT')

  const handleCreate = () => {
    if (!title.trim()) return

    const now = new Date().toISOString()
    const tale: Tale = {
      id: `tale-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      entities: [],
      relationships: [],
      scenes: [],
      twistPatterns: [],
      choiceRecords: [],
      createdAt: now,
      updatedAt: now,
    }

    addTale(tale)
    openTale(tale.id)
    onClose()
  }

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className={styles.backdrop} onClick={handleBackdrop}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>新しいTale</div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.field}>
            <label className={styles.label}>タイトル *</label>
            <input
              className={styles.input}
              type="text"
              placeholder="物語のタイトル..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>あらすじ（任意）</label>
            <textarea
              className={styles.textarea}
              placeholder="どんな物語ですか？"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>ステータス</label>
            <div className={styles.statusGroup}>
              {(['DRAFT', 'ACTIVE'] as TaleStatus[]).map((s) => (
                <button
                  key={s}
                  className={`${styles.statusBtn} ${status === s ? styles.statusBtnActive : ''}`}
                  onClick={() => setStatus(s)}
                >
                  {s === 'DRAFT' ? '下書き' : '執筆中'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>キャンセル</button>
          <button
            className={styles.createBtn}
            onClick={handleCreate}
            disabled={!title.trim()}
          >
            作成して開く
          </button>
        </div>
      </div>
    </div>
  )
}
