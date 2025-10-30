# Cleanup Summary

- assets 未檢測到子資料夾、非 ASCII 檔名或超過 20MB 的檔案，本次未移動或重新命名任何檔案；`reports/rename_map.csv` 僅含表頭供後續追蹤。
- `.shopifyignore` 已改為使用 `/**` 形式忽略 `.shopify`、`node_modules`、`vendor` 等資料夾；詳見 `reports/ignore_review.md`。
- 首頁模板 `templates/index.json` 原已配置 section `kv-hero`，狀態記錄於 `reports/index_template.md`。
- `shopify theme check` 已執行且無違規；摘要收錄在 `reports/theme_check_summary.md`。
- `shopify theme dev` 因缺少環境變數 `SHOPIFY_CLI_THEME_TOKEN`（`shopify.theme.toml` 仍為範例）未能啟動，故無法取得預覽、編輯器與分享連結；請補齊憑證後重試。
- 後續建議：1) 於本機設定必要環境變數或更新 `shopify.theme.toml` 為實際店鋪資訊；2) 重新執行 `shopify theme dev --environment default --ignore "design/**"` 取得預覽連結。
