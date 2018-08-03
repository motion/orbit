import runAppleScript from './runAppleScript'

export const closeChromeTabWithUrlStarting = async url => {
  await runAppleScript(`
  -- Closes google tab that matches checkUrl
  set checkUrl to "${url}"
  tell application "Google Chrome"
    set window_list to every window
    repeat with the_window in window_list
      set tab_list to every tab in the_window
      repeat with the_tab in tab_list
        set the_title to the URL of the_tab
        if the_title contains checkUrl then
          close the_tab
        end if
      end repeat
    end repeat
  end tell
  `)
}
