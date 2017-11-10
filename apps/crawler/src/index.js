import pup from 'puppeteer'
// import Path from 'path'

// const userProfileDir = Path.join(
//   process.env.HOME,
//   'Library',
//   'Application Support',
//   'Google',
//   'Chrome'
//   // 'Default'
// )
// console.log('profile at', userProfileDir.toString())

export default async function run(options = { entry: 'https://google.com' }) {
  const browser = await pup.launch({
    // executablePath:
    //   '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    // userDataDir: userProfileDir.toString(),
    headless: false,
  })
  const page = await browser.newPage()
  await page.goto(options.entry)
  // await page.screenshot({ path: 'example.png' })
  // await browser.close()
}
