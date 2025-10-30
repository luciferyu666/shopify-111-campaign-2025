# VS Code × OpenAI Codex × Shopify CLI 快速上手包

本包包含：
- `.vscode/tasks.json`：常用 Shopify 題庫任務（dev / check / push）。
- `prompts/codex_first_prompt.md`：IDE 內給 Codex 的「首次提示」模板。
- 本說明檔。

> 建議將本包放入你的專案根目錄：`F:\From C download\shopify-111-campaign-2025\`

---

## 1) 前置安裝
1. **OpenAI for VS Code / Codex**：在 VS Code 安裝官方擴充，或依 OpenAI 說明用 VSIX 側載（Work with Apps – VS Code）。
   - 參考：OpenAI 說明中心〈Install the Work with Apps VS Code extension〉。
2. **Shopify CLI**：安裝並登入你的商店帳戶（需 Node.js / Git）。
   - 參考：Shopify CLI 與 Theme 指令 `theme dev`、`theme check` 文件。
3. （首次）在專案根目錄建立 `.vscode/tasks.json` 與 `prompts/` 目錄（已隨本包提供）。

## 2) 在 VS Code 執行任務
- **開發預覽**：`Terminal → Run Task… → Shopify: Dev server (theme dev)`，輸入 `myshop.myshopify.com` 後按 Enter。
- **靜態檢查**：`Shopify: Theme Check (lint)`（必要時先跑 `--init` 產生 `.theme-check.yml`）。
- **推送到開發主題**：`Shopify: Theme Push (to dev theme)`。

## 3) 在 IDE 使用 Codex
- 開啟 `prompts/codex_first_prompt.md`，複製內容到 Codex 面板作為首次提示。
- 對話時可 @ 檔名（視擴充功能），請 Codex 只改 `sections/`、`assets/` 等允許的路徑。
- 大任務可先讓 Codex 列「變更計畫」→ 確認後再套用。

## 4) 常見問題
- **`shopify` 指令找不到**：確認已安裝 Shopify CLI 並重新啟動終端。
- **Windows 路徑含空白**：直接以 VS Code「開啟資料夾」方式進入專案，Tasks 會在 `workspaceFolder` 內執行，不需特別轉義。
- **Lighthouse 效能**：優先使用響應式圖片與延遲載入、減少第三方腳本。

---

參考文件：
- OpenAI：Codex VS Code/CLI（developers.openai.com）
- OpenAI Help：Work with Apps VS Code extension
- VS Code：Tasks 與 `tasks.json` schema
- Shopify：CLI（`theme dev`）、Theme Check
