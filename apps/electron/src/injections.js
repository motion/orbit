import * as Helpers from '~/helpers'
import * as _ from 'lodash'

export const openAuth = async url => {
  await Helpers.runAppleScript(`
  tell application "Google Chrome"
    make new window
    activate
  end tell
  tell application "System Events"
    set position of first window of application process "Google Chrome" to {15000, 15000}
  end tell
  tell application "Google Chrome"
    open location "${url}"
  end tell
  delay 10
  tell application "Google Chrome"
    tell front window's active tab
      set source to execute javascript "document.getElementById('link').click()"
    end tell
  end tell
  `)
}

export const injectCrawler = _.throttle(async () => {
  const js = await Helpers.getCrawler()
  await Helpers.runAppleScript(`
    tell application "Google Chrome"
      tell front window's active tab
        set source to execute javascript "${Helpers.escapeAppleScriptString(
          js
        )}"
      end tell
    end tell
  `)
}, 500)

export const uninjectCrawler = () => {
  Helpers.runAppleScript(`
    tell application "Google Chrome"
      tell front window's active tab
        set source to execute javascript "document.getElementById('__oraCloseCrawler').click()"
      end tell
    end tell
  `)
}
