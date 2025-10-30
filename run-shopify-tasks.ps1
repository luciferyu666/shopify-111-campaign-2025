param(
  [string]$Store = $env:SHOPIFY_FLAG_STORE,            # 例：triforce666.myshopify.com
  [string]$ThemeToken,                                 # Theme Access 密碼（可省略改讀環境變數）
  [string]$StorePassword,                              # 商店前台密碼頁（可省略）
  [string]$ThemeId,                                    # 推版時指定 dev theme ID（可省略→CLI互動選擇）
  [ValidateSet('dev','check','check-init','push','all')]
  [string]$Task = 'dev',
  [switch]$Notify = $true                              # theme push 時是否通知（預設通知；-Notify:$false 取消）
)

$ErrorActionPreference = 'Stop'

function Assert-Cli {
  if (-not (Get-Command shopify -ErrorAction SilentlyContinue)) {
    throw "找不到 Shopify CLI。請先安裝 @shopify/cli 並確保在 PATH 中。"
  }
}

function Assert-ThemeRoot {
  # 簡單檢查是否在主題根（至少要有 layout/theme.liquid）
  if (-not (Test-Path -LiteralPath ".\layout\theme.liquid")) {
    Write-Warning "看起來你不在主題根目錄（缺少 layout/theme.liquid）。"
    Write-Host "建議先執行：`n  shopify theme pull --store $Store --password <ThemeToken> --theme <THEME_ID> --path `"$PWD`""
  }
}

function Set-EnvIfNeeded {
  if ($Store) { $env:SHOPIFY_FLAG_STORE = $Store }
  if ($ThemeToken) { $env:SHOPIFY_CLI_THEME_TOKEN = $ThemeToken }
}

function Invoke-ThemeDev {
  Assert-Cli; Set-EnvIfNeeded; Assert-ThemeRoot
  if (-not $env:SHOPIFY_FLAG_STORE) { throw "缺少商店網域，請用 -Store 或設 SHOPIFY_FLAG_STORE。" }

  $args = @('theme','dev','--store',$env:SHOPIFY_FLAG_STORE)
  if ($env:SHOPIFY_CLI_THEME_TOKEN) { $args += @('--password', $env:SHOPIFY_CLI_THEME_TOKEN) }
  if ($StorePassword) { $args += @('--store-password', $StorePassword) }

  Write-Host "`n▶ 執行：shopify $($args -join ' ')`n" -ForegroundColor Cyan
  & shopify @args
}

function Invoke-ThemeCheck {
  Assert-Cli; Set-EnvIfNeeded
  Write-Host "`n▶ 執行：shopify theme check`n" -ForegroundColor Cyan
  & shopify theme check
}

function Invoke-ThemeCheckInit {
  Assert-Cli; Set-EnvIfNeeded
  Write-Host "`n▶ 執行：shopify theme check --init`n" -ForegroundColor Cyan
  & shopify theme check --init
}

function Invoke-ThemePush {
  Assert-Cli; Set-EnvIfNeeded; Assert-ThemeRoot
  if (-not $env:SHOPIFY_FLAG_STORE) { throw "缺少商店網域，請用 -Store 或設 SHOPIFY_FLAG_STORE。" }
  $args = @('theme','push','--store',$env:SHOPIFY_FLAG_STORE)
  if ($env:SHOPIFY_CLI_THEME_TOKEN) { $args += @('--password', $env:SHOPIFY_CLI_THEME_TOKEN) }
  if ($ThemeId) { $args += @('--theme', $ThemeId) }
  $args += @("--notify=$($Notify.IsPresent)")

  Write-Host "`n▶ 執行：shopify $($args -join ' ')`n" -ForegroundColor Cyan
  & shopify @args
}

switch ($Task) {
  'dev'        { Invoke-ThemeDev }
  'check'      { Invoke-ThemeCheck }
  'check-init' { Invoke-ThemeCheckInit }
  'push'       { Invoke-ThemePush }
  'all'        {
     Invoke-ThemeCheckInit
     Invoke-ThemeCheck
     Invoke-ThemeDev
     Write-Host "`n（驗證通過後請再以 -Task push 推到未發佈主題）" -ForegroundColor Yellow
  }
}
