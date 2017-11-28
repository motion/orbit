import runAppleScript from './runAppleScript'
import escapeAppleScriptString from 'escape-string-applescript'
import getFavicon from './getFavicon'

export async function getActiveWindowInfo() {
  try {
    const [application, title] = await runAppleScript(`
    global frontApp, frontAppName, windowTitle
    set windowTitle to ""
    tell application "System Events"
      set frontApp to first application process whose frontmost is true
      set frontAppName to name of frontApp
      tell process frontAppName
        tell (1st window whose value of attribute "AXMain" is true)
          set windowTitle to value of attribute "AXTitle"
        end tell
      end tell
    end tell
    return {frontAppName, windowTitle}
    `)
    // application is like 'Google Chrome'
    // title is like 'Welcome to my Webpage'
    return { application, title }
  } catch (err) {
    if (err.message.indexOf(`Can't get window 1 of`)) {
      // super hacky but if it fails it usually gives an error like:
      //   execution error: System Events got an error: Can’t get window 1 of process "Slack"
      // so we can find it:
      const name = err.message.match(/process "([^"]+)"/)
      if (name && name.length) {
        return { application: name[1], title: name[1] }
      }
    }
    console.log('getContext() error:', err.message)
  }
}

const getFaviconSrc = getFavicon.toString()

const CONTEXT_JS = `
JSON.stringify({
  url: document.location+'',
  title: document.title,
  selection: document.getSelection().toString() ? document.getSelection().toString() : (document.getSelection().anchorNode ? document.getSelection().anchorNode.textContent : ''),
  crawlerInfo: document.__oraCrawlerAnswer,
  favicon: ${getFaviconSrc}(),
})
`

export async function getChromeContext() {
  const res = await runAppleScript(`
    tell application "Google Chrome"
      tell front window's active tab
        set source to execute javascript "${escapeAppleScriptString(
          CONTEXT_JS
        )}"
      end tell
    end tell
  `)
  if (res === 'missing value') {
    console.log('missing value')
    return null
  }
  try {
    const result = JSON.parse(res)
    if (!result) {
      return null
    }
    return result
  } catch (err) {
    console.log('error parsing json')
    console.log('res:', res)
    console.log(err)
    return null
  }
}
