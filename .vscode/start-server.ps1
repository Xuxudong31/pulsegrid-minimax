Write-Output "脉冲音格预览任务正在启动"

$listener = Get-NetTCPConnection -State Listen -LocalPort 4173 -ErrorAction SilentlyContinue | Select-Object -First 1
if ($listener) {
    $processInfo = Get-CimInstance Win32_Process -Filter "ProcessId = $($listener.OwningProcess)" -ErrorAction SilentlyContinue
    if ($processInfo.CommandLine -match "server\.mjs") {
        Write-Output "预览服务已启动：http://127.0.0.1:4173（使用现有服务）"
        while ($true) {
            Start-Sleep -Seconds 60
        }
    }
    if ($processInfo.CommandLine -match "python.*http\.server\s+4173") {
        Write-Output "正在停止旧的静态预览服务"
        Stop-Process -Id $listener.OwningProcess -Force
        Start-Sleep -Milliseconds 400
    } else {
        throw "端口 4173 已被其他程序占用，请关闭它后再按 F5。"
    }
}

node "$PSScriptRoot\..\server.mjs"
