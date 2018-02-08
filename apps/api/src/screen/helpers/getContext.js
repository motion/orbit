import runAppleScript from './runAppleScript'
import escapeAppleScriptString from 'escape-string-applescript'
import getContextInjection from './getContextInjection'

const CONTEXT_JS = `(${getContextInjection.toString()})()`

export async function getChromeContext() {
  return parseContextRes(
    await runAppleScript(`
    global res
    tell application "Google Chrome"
      tell front window's active tab
        set res to execute javascript "${escapeAppleScriptString(CONTEXT_JS)}"
      end tell
    end tell
    return res
  `),
  )
}

export async function getSafariContext() {
  return parseContextRes(
    await runAppleScript(`
    global res
    tell application "Safari"
      set res to do JavaScript "${escapeAppleScriptString(
        CONTEXT_JS,
      )}" in front document
    end tell
    return res
  `),
  )
}

let lastRes

function parseContextRes(res) {
  let thisRes = res.trim()
  setTimeout(() => {
    lastRes = thisRes
  })
  if (thisRes === 'missing value') {
    if (lastRes !== thisRes) {
      console.log('missing value')
    }
    return null
  }
  try {
    const result = JSON.parse(thisRes)
    if (!result) {
      return null
    }
    return result
  } catch (err) {
    console.log('error parsing context', err.message)
    console.log('in response:', thisRes)
  }
  return null
}
