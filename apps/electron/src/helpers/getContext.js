import runAppleScript from './runAppleScript'
import escapeAppleScriptString from 'escape-string-applescript'
import getContextInjection from './getContextInjection'
import { isEqual } from 'lodash'

let lastContextError = null

export default async function getContext(currentContext) {
  let res
  try {
    res = await getActiveWindowInfo()
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
      focusedApp: application,
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

async function getActiveWindowInfo() {
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

  const [offset, bounds] = await runAppleScript(`
  tell application "System Events"
	  set frontApp to first application process whose frontmost is true
    tell frontApp
      set pos to position of window 1
      set sizeVal to size of window 1
    end tell
  end tell
  return {pos, sizeVal}
  `)

  // application is like 'Google Chrome'
  // title is like 'Welcome to my Webpage'
  return { application, title, offset, bounds }
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

function parseContextRes(res) {
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
    console.log('error parsing context', err.message)
  }
  return null
}
