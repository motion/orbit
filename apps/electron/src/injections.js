import * as Helpers from '~/helpers'
import * as _ from 'lodash'

export const closeChromeTabWithUrl = async url => {
  await Helpers.runAppleScript(`
  -- Closes google tab that matches checkUrl
  set checkUrl to "${url}"
  tell application "Google Chrome"
    set window_list to every window
    repeat with the_window in window_list
      set tab_list to every tab in the_window
      repeat with the_tab in tab_list
        set the_title to the URL of the_tab
        if the_title is equal to checkUrl then
          close the_tab
        end if
      end repeat
    end repeat
  end tell
  `)
}

export const openAuth = async url => {
  await Helpers.runAppleScript(`
  -- Store current window
  global frontAppName, chromePos
  tell application "System Events"
    set frontApp to first application process whose frontmost is true
    set frontAppName to name of frontApp
  end tell
  -- Open new Chrome window
  tell application "Google Chrome"
    make new window
    activate
  end tell
  -- Move window all the way to bottom right corner
  tell application "System Events"
    set position of first window of application process "Google Chrome" to {15000, 15000}
  end tell
  -- Re focus original window
  tell application frontAppName
    activate
  end tell
  -- Chrome go to auth url
  tell application "Google Chrome"
    open location "${url}"
    delay 1
    -- Wait for it to eb ready
    set readyState to false
    repeat while readyState is false
      set readyState to (execute active tab of window 1 javascript "document.readyState")
    end repeat
    -- This doesnt work, gets blocked :(
    -- set source to execute javascript "document.getElementById('link').click()"
  end tell
  -- Get position of chrome
  tell application "System Events"
    set chromePos to (get position of first window of application process "Google Chrome")
  end tell
  -- We'll click 100,100 offset from there
  set x to (item 1 of chromePos) + 100
  set y to (item 2 of chromePos) + 100
  -- Make sure its active
  tell application "Google Chrome"
    activate
  end tell
  -- Run python script to click, its slow
  do shell script "/usr/bin/python <<END
import time, sys
from Quartz.CoreGraphics import CGEventCreateMouseEvent
from Quartz.CoreGraphics import CGEventCreate
from Quartz.CoreGraphics import CGEventPost
from Quartz.CoreGraphics import CGEventGetLocation
from Quartz.CoreGraphics import kCGEventMouseMoved
from Quartz.CoreGraphics import kCGEventLeftMouseDown
from Quartz.CoreGraphics import kCGEventLeftMouseUp
from Quartz.CoreGraphics import kCGMouseButtonLeft
from Quartz.CoreGraphics import kCGHIDEventTap
def m_event(type_, x, y): e = CGEventCreateMouseEvent(None, type_, (x, y), kCGMouseButtonLeft); CGEventPost(kCGHIDEventTap, e);
def m_move(x, y): m_event(kCGEventMouseMoved, x, y);
def m_click(x, y): m_event(kCGEventLeftMouseDown, x, y); m_event(kCGEventLeftMouseUp, x, y);
x, y = int(" & x & "), int(" & y & ");
e = CGEventCreate(None); cur_pos=CGEventGetLocation(e);
m_click(x, y);
time.sleep(0.2);
m_click(x, y);
m_move(cur_pos.x, cur_pos.y)
END"
`)
}
;`
set x to 200
set y to 200
set l to 1 -- click same location 50 times

do shell script "
/usr/bin/python <<END
import sys
import time
from Quartz.CoreGraphics import *
def mouseEvent(type, posx, posy):
          theEvent = CGEventCreateMouseEvent(None, type, (posx,posy), kCGMouseButtonLeft)
          CGEventPost(kCGHIDEventTap, theEvent)
def mousemove(posx,posy):
          mouseEvent(kCGEventMouseMoved, posx,posy);
def mouseclick(posx,posy):
          mouseEvent(kCGEventLeftMouseDown, posx,posy);
          mouseEvent(kCGEventLeftMouseUp, posx,posy);
ourEvent = CGEventCreate(None);
currentpos=CGEventGetLocation(ourEvent);             # Save current mouse position
for x in range(0, " & l & "):
          mouseclick(" & x & "," & y & ");
mousemove(int(currentpos.x),int(currentpos.y));      # Restore mouse position
END"
`

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
