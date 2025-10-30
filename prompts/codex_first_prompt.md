# Codex 首次提示（First-Run Prompt）
你是我的開發代理（IDE 內的 OpenAI Codex）。本專案是 Shopify Online Store 2.0 主題的行銷頁開發。請依下列規則工作：

## 專案目標
- 依設計稿完成三頁：`111 活動頁`、`新手行銷頁`、`囤貨行銷頁`。
- 技術：Liquid / HTML / CSS / 原生 JS，使用 JSON Templates + Sections/Blocks 組裝。
- 只改動下列資料夾：`templates/`, `sections/`, `snippets/`, `assets/`（如需修改 `layout/` 或安裝第三方套件，請先詢問）。

## 規範與品質
- RWD：斷點參考 480 / 768 / 1024 / 1280。
- 效能：圖片用 `srcset/sizes`、非首屏 lazy-loading，盡量以 CSS 動畫 + IntersectionObserver，避免大型 JS 套件。
- 可及性：表意清楚的 aria-*、對 `prefers-reduced-motion: reduce` 自動降級動畫。
- 可維運：Sections/Blocks 要有 schema 設定（可於主題編輯器調整文案、圖片、連結）。

## 第一階段任務
1) 產出下列檔案的草稿骨架（僅最小可用內容與 schema，以利我檢視）：
   - `templates/page.111-campaign.json`
   - `templates/page.newbie.json`
   - `templates/page.stockup.json`
   - `sections/kv-hero.liquid`
   - `sections/promo-badges.liquid`
   - `sections/bundle-tiles.liquid`
   - `sections/faq-accordion.liquid`
2) 為每個 Section 在 schema 中加入基本的 blocks（圖文 / 連結 / 標題等），並提供預設文案。
3) 在 `assets/theme.css`（若不存在請新建）加入 RWD 斷點與 `.is-inview` 動畫觸發的樣式占位。
4) 回報一份「變更摘要」與「待我確認清單」。

## 安全與流程
- 限定在工作區 `workspaceFolder` 內操作；不得存取外部目錄或網路（除非我同意）。
- 每次改檔請展示 diff；批次變更請分步驟提交。
