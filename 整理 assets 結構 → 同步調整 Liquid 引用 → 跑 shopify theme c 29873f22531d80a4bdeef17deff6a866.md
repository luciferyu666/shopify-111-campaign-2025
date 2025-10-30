# 「整理 assets/ 結構 → 同步調整 Liquid 引用 → 跑 shopify theme check」寫成可直接照做的操作單

---

# 1) 整理 `assets/` 結構（命名與歸檔）

**建議結構（僅供範例，可依專案調整）：**

```
assets/
  111/     # 雙11活動頁切片
  newbie/  # 新手頁切片
  stock/   # 囤貨頁切片
  css/     # 主題樣式（選用）
  js/      # 主題腳本（選用）

```

- 切圖檔名保留寬度描述：`hero-left@1920.webp`、`bundle-a@1280.webp` …（之後給 `srcset` 用）。
- `assets/` 是主題的 CSS/JS/圖檔所在，走 Shopify CDN；之後在 Liquid 用過濾器產 CDN URL。([Shopify](https://shopify.dev/docs/storefronts/themes/architecture?utm_source=chatgpt.com))

> 長期維護：若要讓行銷同事在後台換圖，改用 Files / image_picker 搭配 image_url → image_tag（會自動產生寬高與 srcset）。(Shopify)
> 

---

# 2) 同步調整 Liquid 引用（兩種寫法擇一）

## A. 直接吃 `assets/` 檔（最快）

```
{%- comment -%} 雙11 hero 左半 {%- endcomment -%}
<img
  src="{{ '111/111-hero-left@1920.webp' | asset_url }}"
  srcset="
    {{ '111/111-hero-left@480.webp'  | asset_url }} 480w,
    {{ '111/111-hero-left@768.webp'  | asset_url }} 768w,
    {{ '111/111-hero-left@1280.webp' | asset_url }} 1280w,
    {{ '111/111-hero-left@1920.webp' | asset_url }} 1920w"
  sizes="(max-width: 1024px) 100vw, 1280px"
  alt="活動 hero"
  loading="lazy">

```

- `asset_url` 參數**不要帶 `assets/` 前綴**，只寫相對於 `assets/` 的路徑（例如 `111/xxx.webp`）。([Shopify](https://shopify.dev/docs/api/liquid/filters/asset_url?utm_source=chatgpt.com))
- 你使用 `w` 寬度描述的 `srcset` 時，**必須**同時提供 `sizes`，否則瀏覽器會忽略 `srcset`。([developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/srcset?utm_source=chatgpt.com))

## B. 後台可換圖（推薦長期）

```
{%- comment -%} 以 image_picker 綁圖 {%- endcomment -%}
{{ section.settings.hero_image
  | image_url: width: 1920
  | image_tag:
      widths: '480, 768, 1024, 1280, 1920',
      sizes: '(max-width: 1024px) 100vw, 1280px',
      loading: 'lazy',
      alt: section.settings.hero_alt }}

```

- `image_tag` 會自動加 `width/height`（降低 CLS），並用 Shopify 圖片 CDN 產出對應尺寸與格式。([Shopify](https://shopify.dev/docs/api/liquid/filters/image_tag?utm_source=chatgpt.com))
- `image_url` 至少要帶 `width` 或 `height` 其中之一。([Shopify](https://shopify.dev/docs/api/liquid/filters/image_url?utm_source=chatgpt.com))

> 你也可以把我們之前產的 sections（kv-hero.liquid、promo-badges.liquid、bundle-tiles.liquid）裡的圖片欄位改為 image_picker，就能在 Theme Editor 換圖；頁面組裝依然用 Online Store 2.0 的 JSON 模板。(Shopify)
> 

---

# 3) 跑 `shopify theme check` 並修正

## 安裝 / 初始化

```bash
# 一次安裝 CLI 與主題工具（若尚未）
npm i -g @shopify/cli @shopify/theme

# 於主題根目錄初始化設定檔
shopify theme check --init

```

會產生 `.theme-check.yml`，可自訂要忽略的路徑與規則。([Shopify](https://shopify.dev/docs/storefronts/themes/tools/theme-check/commands?utm_source=chatgpt.com))

**建議最小設定（示例）：**

```yaml
# .theme-check.yml
extends: theme-check:recommended
ignore:
  - node_modules/**
  - assets/**/*.map

```

（需要時再逐項調整或暫時停用特定規則）([Shopify](https://shopify.dev/docs/storefronts/themes/tools/theme-check/configuration?utm_source=chatgpt.com))

## 執行與常用旗標

```bash
# 基本檢查
shopify theme check

# 自動修正可修正項
shopify theme check --auto-correct

# 將「錯誤」層級當作失敗（CI 用）
shopify theme check --fail-level error

```

官方文件有完整旗標與用法。([Shopify](https://shopify.dev/docs/storefronts/themes/tools/theme-check/commands?utm_source=chatgpt.com))

## 常見修正點（你很可能會遇到）

- **ImgWidthAndHeight**：請確保 `<img>` 具備寬高；用 `image_tag` 就會自動帶入，或自行填上 `width/height`。([Shopify](https://shopify.dev/docs/storefronts/themes/tools/theme-check/checks?utm_source=chatgpt.com))
- **Alt text**：補上 `alt`；若來源是設定檔的圖片，請從設定值或備援字串填入。([Shopify](https://shopify.dev/docs/storefronts/themes/tools/theme-check/checks?utm_source=chatgpt.com))
- **硬編資產路徑**：請用 `asset_url`（或 `image_url → image_tag`），不要手寫 CDN 連結。([Shopify](https://shopify.dev/docs/api/liquid/filters/asset_url?utm_source=chatgpt.com))

> 如需短暫抑制個別段落的特定檢查（例如第三方片段），可用註解指令：
> 
> 
> `{% # theme-check-disable ImgWidthAndHeight %} ... {% # theme-check-enable ImgWidthAndHeight %}`（僅限必要時）。([Shopify](https://shopify.dev/docs/storefronts/themes/tools/theme-check/configuration?utm_source=chatgpt.com))
> 

---

## 建議的工作順序（一次走完）

1. *搬檔：**把切片整理成 `assets/111|newbie|stock/…`；JS/CSS 放 `assets/js|css/…`。([Shopify](https://shopify.dev/docs/storefronts/themes/architecture?utm_source=chatgpt.com))
2. **改 Liquid：**
    - 短期：以 **A** 方案 (`asset_url` + `srcset/sizes`) 先接上線。([Shopify](https://shopify.dev/docs/api/liquid/filters/asset_url?utm_source=chatgpt.com))
    - 長期：把關鍵圖換成 **B** 方案（`image_picker` + `image_tag`）。([Shopify](https://shopify.dev/docs/api/liquid/filters/image_tag?utm_source=chatgpt.com))
3. *檢查：**跑 `shopify theme check`（必要時加 `-auto-correct`）；按檢查清單修正到無錯。([Shopify](https://shopify.dev/docs/storefronts/themes/tools/theme-check/commands?utm_source=chatgpt.com))
4. *預覽與驗證：**以未發佈主題預覽（`shopify theme dev` 或 Share preview），確認 RWD 與 CLS、載入速度。([Shopify](https://shopify.dev/docs/api/shopify-cli/theme?utm_source=chatgpt.com))

---

# 4) 手動驗證 480 / 768 / 1280 的 `srcset` 載入結果

1. 在專案根目錄執行 `shopify theme dev --store your-store` 開啟預覽（若已透過 VS Code Tasks 建立，直接執行「Shopify: Dev server」即可）。
2. 於預覽頁開啟 Chrome DevTools，啟用裝置工具列（快捷鍵 `Ctrl+Shift+M` / `Cmd+Shift+M`），分別輸入 480、768 與 1280 px 視窗寬度，每個寬度都重新載入一次頁面。
3. 切到 Network 頁籤並輸入 `kv-hero`, `bundle-tiles` 關鍵字或直接查看圖片請求：Responsive `srcset` 會依寬度出現 `_480x`, `_768x`, `_1280x` 的 Shopify CDN 檔案。
4. 若需確認實際節點，回 Elements → 選取對應 `<picture>` / `<img>`，檢查 `sizes` 及 `srcset` 是否跟寬度相符；必要時可於 Sources 頁籤點擊檔案以確認路徑確實不同。
5. 驗證完畢後在終端輸入 `Ctrl+C` 停止 `theme dev`，或保留背景預覽持續調整。
