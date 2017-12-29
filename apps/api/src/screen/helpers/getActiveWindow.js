import runAppleScript from './runAppleScript'

export default async function getActiveWindowInfo() {
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
