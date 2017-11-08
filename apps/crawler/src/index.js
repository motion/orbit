import pup from 'puppeteer'
import Path from 'path'

const userProfileDir = Path.join(
  process.env.HOME,
  'Library',
  'Application Support',
  'Google',
  'Chrome'
  // 'Default'
)

console.log('profile at', userProfileDir.toString())

async function run() {
  const browser = await pup.launch({
    // executablePath:
    //   '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    userDataDir: userProfileDir.toString(),
    headless: false,
  })
  const page = await browser.newPage()
  await page.goto('https://github.com/motion/orbit')
  // await page.screenshot({ path: 'example.png' })
  // await browser.close()
}

try {
  run()
} catch (err) {
  console.error(err)
}
