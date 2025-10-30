# .shopifyignore 調整紀錄

- 更新 `.shopify/**`、`node_modules/**`、`vendor/**`、`dist/**`、`build/**`、`tmp/**`、`coverage/**` 為遞迴忽略，避免 Shopify CLI 警告。
- 更新 `.vscode/**` 與 `.idea/**`，確保整個編輯器設定資料夾都被排除。
- 保留 `design/**` 與其他素材、暫存及大型檔案規則，確保來源檔不會被同步。
