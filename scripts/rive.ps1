param([ValidateSet('verify','preview','capture')][string]$Mode = 'preview')
$ErrorActionPreference = 'Stop'
$riveCommand = Get-Command rive -ErrorAction SilentlyContinue
$riveExecutable = if ($riveCommand) { $riveCommand.Source } else { Join-Path $env:USERPROFILE '.rive\bin\rive.exe' }
if (!(Test-Path -LiteralPath $riveExecutable)) { throw 'Rive CLI not found. Install it from https://rive.app/docs/cli/overview' }
$projectDirectory = Join-Path $PSScriptRoot '..\haunted-terminal'
if ($Mode -eq 'verify') {
  & $riveExecutable $projectDirectory --verify
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
  & $riveExecutable inspect $projectDirectory --summary
} elseif ($Mode -eq 'capture') {
  & $riveExecutable $projectDirectory --screenshot --advance=1s
} else {
  & $riveExecutable $projectDirectory
}
exit $LASTEXITCODE
