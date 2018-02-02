import runAppleScript from './runAppleScript'
import escapeAppleScriptString from 'escape-string-applescript'
import getContextInjection from './getContextInjection'
import getActiveWindow from './getActiveWindow'
import { isEqual } from 'lodash'

let lastContextError = null

export default async function getContext(currentContext) {
  let res
  try {
    res = await getActiveWindow()
  } catch (err) {
    if (err.message.indexOf(`Can't get window 1 of`)) {
      // super hacky but if it fails it usually gives an error like:
      //   execution error: System Events got an error: Can’t get window 1 of process "Slack"
      // so we can find it:
      const name = err.message.match(/process "([^"]+)"/)
      if (name && name.length) {
        res = { application: name[1], title: name[1] }
      }
    }
    if (!res) {
      if (lastContextError !== err.message) {
        console.log('error watching context', err.message)
        lastContextError = err.message
      }
    }
  }

  if (res) {
    const { application, offset, bounds } = res

    let context = {
      name: application,
      offset,
      bounds,
    }

    switch (application) {
      case 'Google Chrome':
        context = {
          ...context,
          ...(await getChromeContext()),
        }
        break
      case 'Safari':
        context = {
          ...context,
          ...(await getSafariContext()),
        }
        break
    }

    if (!isEqual(currentContext, context)) {
      return context
    }
  }
}

const CONTEXT_JS = `(${getContextInjection.toString()})()`

async function getChromeContext() {
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

async function getSafariContext() {
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
