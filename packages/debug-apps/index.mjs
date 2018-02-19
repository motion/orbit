#!/usr/bin/env node
const r2 = require('@mcro/r2')
const puppeteer = require('puppeteer')

const sleep = ms => new Promise(res => setTimeout(res, ms))

const PORTS = ['9000', '9001']
const DEV_URL =
  'chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws='

async function getDevUrl(port) {
  try {
    const [firstAnswer] = await r2.get(`http://127.0.0.1:${port}/json`).json
    const { webSocketDebuggerUrl } = firstAnswer
    return `${DEV_URL}/${webSocketDebuggerUrl.replace(`ws://`, '')}`
  } catch (err) {
    return null
  }
}

async function getDevUrls() {
  const info = await Promise.all(PORTS.map(getDevUrl))
  console.log('got info', info)
  return info
}

async function start() {
  await sleep(1000)
  const browser = await puppeteer.launch({ headless: false })
  // one less because it starts with a tab already open
  await Promise.all(PORTS.slice(1).map(() => browser.newPage()))
  const pages = await browser.pages()
  const urls = await getDevUrls()
  pages.forEach((page, index) => page.goto(urls[index]))
}

start()
