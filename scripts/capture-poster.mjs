// Renders the finished house and saves public/house-poster.webp (loading poster + no-WebGL fallback).
// With the dev server running:  npm run poster   [-- --url http://localhost:5173]
// Drives your installed Chrome over the DevTools protocol (Node 22+ built-in WebSocket, no dependencies).
// Set CHROME_PATH if Chrome is not in a standard location.
import { spawn } from 'node:child_process'
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const urlArg = process.argv.indexOf('--url')
const base = urlArg > -1 ? process.argv[urlArg + 1] : 'http://localhost:5173'
const OUT = 'public/house-poster.webp'
const PORT = 9333
const TIMEOUT_MS = 180_000

const chrome = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find((p) => p && existsSync(p))
if (!chrome) throw new Error('Chrome not found. Set CHROME_PATH.')

const profile = mkdtempSync(join(tmpdir(), 'poster-'))
const proc = spawn(chrome, [
  '--headless=new',
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${profile}`,
  '--enable-unsafe-swiftshader',
  '--use-angle=swiftshader',
  '--ignore-gpu-blocklist',
  '--window-size=1600,1000',
  'about:blank',
])

const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const cleanup = () => {
  proc.kill()
  setTimeout(() => rmSync(profile, { recursive: true, force: true }), 500)
}

try {
  let target
  for (let i = 0; i < 50 && !target; i++) {
    await wait(200)
    target = await fetch(`http://127.0.0.1:${PORT}/json/new?${base}/?poster=1`, { method: 'PUT' }).then((r) => r.json()).catch(() => undefined)
  }
  if (!target) throw new Error('Could not start headless Chrome')

  const ws = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((resolve, reject) => {
    ws.onopen = resolve
    ws.onerror = reject
  })
  let id = 0
  const pending = new Map()
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data)
    pending.get(msg.id)?.(msg)
    pending.delete(msg.id)
  }
  const evaluate = (expression) =>
    new Promise((resolve) => {
      const n = ++id
      pending.set(n, (msg) => resolve(msg.result?.result?.value))
      ws.send(JSON.stringify({ id: n, method: 'Runtime.evaluate', params: { expression } }))
    })

  const started = Date.now()
  let data
  while (!data && Date.now() - started < TIMEOUT_MS) {
    await wait(1000)
    data = await evaluate(`document.getElementById('poster-data')?.textContent ?? ''`)
  }
  if (!data?.startsWith('data:image/webp;base64,')) throw new Error('Timed out waiting for the poster render. Is the dev server running?')
  writeFileSync(OUT, Buffer.from(data.split(',')[1], 'base64'))
  console.log(`wrote ${OUT} in ${Math.round((Date.now() - started) / 1000)}s`)
  ws.close()
} finally {
  cleanup()
}
