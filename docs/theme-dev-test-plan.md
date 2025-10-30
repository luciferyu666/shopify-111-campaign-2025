# 2025/10/26 Theme dev 測試與驗證紀錄

> 依據「1028 上線｜Shopify 三頁行銷頁切版與上架執行計畫（含報價）」的驗收條件，需在 `theme dev` 預覽環境完成 FAQ/動畫手動測試與 Lighthouse ≥ 60 分（Theme Store 平均）後，才可進行 `theme push`。

## 1. 目前已執行事項
- `shopify theme check`：於專案根目錄執行 `shopify theme check`，11 個檔案皆無違規。
- 嘗試開啟 `theme dev`：執行 `shopify theme dev --store example.myshopify.com`，CLI 要求以裝置代碼登入（例：`XKBC-WBLW`），因尚未取得實際商店授權而中斷，需由商店管理者登入或提供可用的協作者權限後再重試。

## 2. 待完成的 theme dev FAQ／動畫測試
1. **啟動預覽**
   - 指令：`shopify theme dev --store <your-store>.myshopify.com`
   - 依 CLI 提示登入並取得預覽 URL，例如 `https://<dev-theme-id>.preview.shopifyapps.com`.
2. **FAQ 手風琴檢查（`sections/faq-accordion.liquid` × `assets/js/campaign-interactions.js`）**
   - 滑鼠點擊：逐一點擊 FAQ，確認 `aria-expanded`/`aria-hidden` 正確切換，面板高度平滑展開與收合。
   - 鍵盤導覽：聚焦在 FAQ 按鈕後，測試 `↑`、`↓`、`Home`、`End` 是否可在 FAQ 項間移動。
   - 多組 FAQ：切換 `campaign_preset`（111 / newbie / stock）與自訂 blocks，確保初始化流程能設定 / 清除監聽。
3. **進場動畫檢查**
   - 滾動頁面，帶有 `.js-inview-trigger` 的區塊應在進入視窗 25% 後加上 `is-inview`，僅觸發一次。
   - 在瀏覽器中將 `prefers-reduced-motion` 設為 `reduce`，重新整理後 root 元素應擁有 `data-reduced-motion="true"`，FAQ 面板直接切換高度、進場動畫停用。
4. **Edge cases**
   - 於 Theme Editor 中切換 / 新增 sections，確認 `shopify:section:load|select|unload` 事件後仍能重新綁定 FAQ。
   - 視窗縮放後 FAQ 面板高度會透過 `requestAnimationFrame` 重新計算，不會被裁切。

## 3. Lighthouse 測速與評分
1. 取得 `theme dev` 的預覽連結（桌機／行動都需測）。
2. 建議安裝官方 Lighthouse CLI：`npm i -g lighthouse` 或以 VS Code Tasks 呼叫。
3. 執行範例：
   ```bash
   lighthouse https://<preview-url>?view=faq \
     --preset=desktop \
     --throttling-method=provided \
     --output=json \
     --output-path=reports/lighthouse-faq-desktop.json
   ```
4. 目標：Performance/Accessibility/Best Practices/SEO **平均 ≥ 60**。若未達標，依報告調整圖片、阻塞 JS、lazy loading 等設計。
5. 建議建立 `reports/` 目錄儲存 JSON/HTML 與截圖，並在 PR／交付報告附上分數。

## 4. 驗收通關 → theme push
1. 所有 FAQ／動畫測試項目 ✅，Lighthouse 分數達標後：
   ```bash
   shopify theme push --notify=false
   ```
2. 建議加註 `--theme <dev-theme-id>` 以避免誤推到正式主題。
3. 推送前再確認 `.env`、任何 API key 或暫存檔未留在 repo。

## 5. 待商店授權後的下一步
- 由商店管理者執行 `shopify login --store <your-store>` 完成一次驗證。
- 重新執行上述步驟並把實測數據填入本檔案，作為 QA/驗收紀錄。
