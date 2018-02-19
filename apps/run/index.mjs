import puppeteer from 'puppeteer'

const APPS = ['@mcro/app', '@mcro/electron', '@mcro/desktop']
const URLS = [
  'chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=127.0.0.1:9000',
  'chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=127.0.0.1:9001',
]

async function start() {
  const browser = await puppeteer.launch({ headless: false })
  // one less because it starts with a tab already open
  await Promise.all(URLS.slice(1).map(() => browser.newPage()))
  const pages = await browser.pages()
  pages.forEach((page, index) => page.goto(URLS[index]))
}

start()
