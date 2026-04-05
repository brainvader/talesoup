# TaleSoup

**Story Engineering Platform**  
人間とAIが対話しながら物語の構造をグラフとして設計・蓄積・改善していくプラットフォーム。

---

## クイックスタート

```bash
npm install
npm run dev  # ブラウザのみ
    npm run tauri:dev  # Tauriデスクトップ
```

ブラウザで http://localhost:5173 を開く。

---

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| フロントエンド | React 18 + TypeScript + Vite |
| グラフ編集 | @xyflow/react (React Flow) |
| 状態管理 | Zustand |
| バックエンド (Sprint 2〜) | Rust / Axum |
| DB (Sprint 2〜) | PostgreSQL + pgvector |
| AI (Sprint 2〜) | Claude API (Tool Use) |

---

## プロジェクト構成

```
src/
├── components/
│   ├── graph/        # React Flow グラフキャンバス・カスタムノード
│   ├── detail/       # 右パネル（エンティティ詳細）
│   ├── chat/         # 下パネル（チャット入力）
│   └── layout/       # TopBar 等
├── lib/
│   ├── store.ts      # Zustand グローバルステート
│   ├── graphUtils.ts # エンティティ→React Flow変換
│   └── sampleData.ts # Project Momotaro サンプルデータ
└── types/
    └── index.ts      # コアデータ型定義
```

---

## スプリント計画

### Sprint 1（現在）
- [x] React Flow グラフキャンバス
- [x] カスタムノード（EntityNode）
- [x] 右パネル（詳細表示）
- [x] チャット入力UI（スタブ）
- [x] サンプルデータ（Project Momotaro）
- [ ] ノード手動追加・編集

### Sprint 2
- [ ] バックエンド（Axum + PostgreSQL）
- [ ] Claude API Tool Use 接続
- [ ] テキスト入力 → グラフ反映

### Sprint 3
- [ ] AI提案（転換・伏線）
- [ ] 矛盾検出

### Sprint 4
- [ ] パターン蓄積・分析
- [ ] Neo4j 連携（実験）
