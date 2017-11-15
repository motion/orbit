import * as r2 from '@mcro/r2'
import React from 'react'
import { app, globalShortcut, ipcMain, screen, Menu } from 'electron'
import repl from 'repl'
import applescript from 'node-osascript'
import promisify from 'sb-promisify'
import open from 'opn'
import { measure } from '~/helpers'
import * as Constants from '~/constants'
import WindowsStore from './windowsStore'
import Window from './window'
import mouse from 'osx-mouse'
import { throttle, isEqual, once } from 'lodash'
import MenuItems from './menu'
import getCrawler from './getCrawler'
import escapeStringApplescript from 'escape-string-applescript'

const execute = promisify(applescript.execute)
const sleep = ms => new Promise(res => setTimeout(res, ms))

let onWindows = []
export function onWindow(cb) {
  onWindows.push(cb)
}

console.log('Constants.APP_URL', Constants.APP_URL)

const AppWindows = new WindowsStore()
const ORA_WIDTH = 320

export default class Windows extends React.Component {
  // this is an event bus that should be open
  // whenever ora is open
  sendOra = name => {
    console.log('called this.sendOra before setup', name)
  }

  subscriptions = []
  uid = Math.random()
  state = {
    restart: false,
    showSettings: false,
    closeSettings: false,
    size: [0, 0],
    position: [0, 0],
    trayPosition: [0, 0],
    appWindows: AppWindows.windows,
  }

  componentDidMount() {
    this.measureAndShow()

    this.screenSize = screen.getPrimaryDisplay().workAreaSize
    this.setState({
      trayPosition: [this.screenSize.width - ORA_WIDTH, 20],
    })

    this.next() // preload one app window
    onWindows.forEach(cb => cb(this))
    setTimeout(this.measureAndShow, 500)
    this.repl = repl.start({
      prompt: 'electron > ',
    })
    Object.assign(this.repl.context, {
      Root: this,
      AppWindows: AppWindows,
    })

    this.listenForMouse()
  }

  componentWillUnmount() {
    globalShortcut.unregisterAll()
    for (const [emitter, name, callback] of this.subscriptions) {
      emitter.removeListener(name, callback)
    }
  }

  on(emitter, name, callback) {
    emitter.on(name, callback)
    this.subscriptions.push([emitter, name, callback])
  }

  listenForMouse() {
    this.on(ipcMain, 'mouse-listen', () => {
      const triggerX = this.screenSize.width - 20
      const triggerY = 20
      const mousey = mouse()

      let hasLeftCorner = true

      mousey.on(
        'move',
        throttle((x, y) => {
          if (+x > triggerX && +y < triggerY) {
            if (hasLeftCorner) {
              hasLeftCorner = false
              console.log('IN CORNER')
              this.toggleShown()
            }
          } else {
            hasLeftCorner = true
          }
        }, 60)
      )
    })
  }

  measure = () => {
    const { position, size } = measure()
    this.size = size
    this.position = position
    this.initialSize = this.initialSize || this.size
  }

  onOra = ref => {
    if (ref) {
      this.oraRef = ref
      this.startOra()
    }
  }

  startOra = once(() => {
    // console.log('clear storage data!!!!!!!')
    // this.oraRef.webContents.session.clearStorageData()
    this.listenToApps()
    this.registerShortcuts()
  })

  onAppWindow = win => electron => {
    if (win && electron && !win.ref) {
      win.ref = electron
    }
  }

  listenToApps = () => {
    this.on(ipcMain, 'start-ora', event => {
      // setup our event bus
      this.sendOra = (...args) => event.sender.send(...args)
    })

    this.on(ipcMain, 'inject-crawler', event => {
      this.injectCrawler(info => {
        event.sender.send('crawler-selection', info)
      })
    })

    this.on(ipcMain, 'navigate', (event, url) => {
      open(url)
    })

    this.on(ipcMain, 'where-to', (event, key) => {
      console.log('where-to from', key)
      const win = AppWindows.findBy(key)
      if (win) {
        win.onHasPath(() => {
          console.log('where-to:', key, win.path)
          event.sender.send('app-goto', win.path)
        })
      } else {
        console.log('no window found for where-to event')
      }
    })

    this.on(ipcMain, 'get-context', this.getContext)

    this.on(ipcMain, 'bar-goto', (event, path) => {
      this.openApp(path)
    })

    this.on(ipcMain, 'close', (event, key) => {
      AppWindows.removeByKey(+key)
      this.updateWindows()
    })

    this.on(ipcMain, 'app-bar-toggle', (event, key) => {
      AppWindows.findBy(key).toggleBar()
      this.updateWindows()
      event.sender.send('app-bar-toggle', 'success')
    })

    this.on(ipcMain, 'open-settings', (event, service) => {
      open(`${Constants.APP_URL}/authorize?service=` + service)
    })
  }

  shown = true

  toggleShown = throttle(() => {
    this.sendOra('ora-toggle')
    this.shown = !this.shown // hacky
    if (this.shown) {
      if (this.appRef) {
        this.appRef.show()
        this.appRef.focus()
      }
      // Menu.sendActionToFirstResponder('show:')
      this.oraRef.focus()
    } else {
      setTimeout(() => {
        if (this.appRef) {
          this.appRef.hide()
        }
      }, 300)
    }
  }, 500)

  injectCrawler = async sendToOra => {
    const js = await getCrawler()
    await execute(`
      tell application "Google Chrome"
        tell front window's active tab
          set source to execute javascript "${escapeStringApplescript(js)}"
        end tell
      end tell
    `)

    this.continueChecking = true
    let lastRes = null
    this.checkCrawlerLoop(res => {
      if (!isEqual(lastRes, res)) {
        sendToOra(res)
        lastRes = res
      }
    })
  }

  checkCrawlerLoop = async cb => {
    try {
      cb(await this.checkCrawler())
    } catch (err) {
      this.continueChecking = false
      console.log('error with crawl loop', err)
    }
    await sleep(500)
    if (this.continueChecking) {
      this.checkCrawlerLoop(cb)
    }
  }

  checkCrawler = async () => {
    const res = await execute(`
      tell application "Google Chrome"
        tell front window's active tab
          set source to execute javascript "JSON.stringify(window.__oraCrawlerAnswer || {})"
        end tell
      end tell
    `)
    try {
      const result = JSON.parse(res)
      return result
    } catch (err) {
      console.log('error parsing result', err)
      return null
    }
  }

  getContext = throttle(async event => {
    const [application, title] = await execute(`
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

    if (application === 'Google Chrome') {
      const res = await execute(`
        tell application "Google Chrome"
          tell front window's active tab
            set source to execute javascript "JSON.stringify({ url: document.location+'', title: document.title, body: document.body.innerText, selection: document.getSelection().toString() })"
          end tell
        end tell
      `)

      try {
        const result = JSON.parse(res)
        event.sender.send(
          'set-context',
          JSON.stringify({
            title: result.title,
            body: result.body,
            url: result.url,
            selection: result.selection,
            application,
          })
        )
      } catch (err) {
        console.log('error parsing json', err, res)
      }
    } else {
      event.sender.send('set-context', null)
    }
  }, 200)

  updateWindows = () => {
    return new Promise(resolve => {
      this.setState(
        {
          appWindows: AppWindows.windows,
        },
        resolve
      )
    })
  }

  next = path => {
    const next = AppWindows.next(path)
    this.updateWindows()
    return next
  }

  openApp = path => {
    const next = this.next(path)
    if (next) {
      setTimeout(() => next.ref && next.ref.focus(), 100)
    }
  }

  registerShortcuts = () => {
    globalShortcut.unregisterAll()
    const SHORTCUTS = {
      'Option+Space': () => {
        console.log('command option+space')
        this.toggleShown()
      },
    }
    for (const shortcut of Object.keys(SHORTCUTS)) {
      const ret = globalShortcut.register(shortcut, SHORTCUTS[shortcut])
      if (!ret) {
        console.log('couldnt register shortcut')
      }
    }
  }

  measureAndShow = async () => {
    this.measure()
    this.setState({ show: true, position: this.position, size: this.size })
  }

  componentDidCatch(error) {
    console.error(error)
    this.setState({ error })
  }

  onOraBlur() {
    this.sendOra('ora-blur')
  }

  onOraFocus() {
    this.sendOra('ora-focus')
  }

  render() {
    const { appWindows, error, restart } = this.state

    if (restart) {
      console.log('\n\n\n\n\n\nRESTARTING\n\n\n\n\n\n')
      this.repl.close()
      onWindows = []
      return (
        <app>
          <window />
        </app>
      )
    }

    const webPreferences = {
      nativeWindowOpen: true,
      experimentalFeatures: true,
      transparentVisuals: true,
    }

    const appWindow = {
      frame: false,
      defaultSize: [700, 500],
      backgroundColor: '#00000000',
      webPreferences,
    }

    if (error) {
      console.log('recover render from error')
      return null
    }

    return (
      <app
        onBeforeQuit={() => console.log('hi')}
        ref={ref => {
          this.appRef = ref
        }}
      >
        <MenuItems
          onPreferences={() => {
            this.setState({ showSettings: true })
          }}
          getRef={ref => {
            this.menuRef = ref
          }}
        />

        {!this.state.closeSettings && (
          <window
            {...appWindow}
            show={this.state.showSettings}
            vibrancy="dark"
            transparent
            hasShadow
            showDevTools={this.state.showSettings}
            defaultSize={this.initialSize || this.state.size}
            size={this.state.size}
            file={`${Constants.APP_URL}/settings`}
            titleBarStyle="customButtonsOnHover"
            position={this.state.position}
            onResize={size => this.setState({ size })}
            onMoved={position => this.setState({ position })}
            onMove={position => this.setState({ position })}
            onFocus={() => {
              this.activeWindow = this.oraRef
            }}
            onClose={() => {
              this.setState({ closeSettings: true })
              setTimeout(() => {
                // reopen invisible so its quick to open again
                this.setState({ closeSettings: false, showSettings: false })
              }, 500)
            }}
          />
        )}

        <window
          {...appWindow}
          ref={this.onOra}
          titleBarStyle="customButtonsOnHover"
          transparent
          show
          alwaysOnTop
          showDevTools
          size={[ORA_WIDTH, 1000]}
          file={`${Constants.APP_URL}/ora`}
          position={this.state.trayPosition}
          onMoved={trayPosition => this.setState({ trayPosition })}
          onMove={trayPosition => this.setState({ trayPosition })}
          onBlur={() => this.onOraBlur()}
          onFocus={() => this.onOraFocus()}
        />

        {appWindows.map(win => {
          return (
            <Window
              key={win.key}
              file={`${Constants.APP_URL}?key=${win.key}`}
              show={win.active}
              {...appWindow}
              defaultSize={win.size}
              size={win.size}
              position={win.position}
              onMoved={x => {
                win.setPosition(x)
                this.updateWindows()
              }}
              onResize={x => {
                win.setSize(x)
                this.updateWindows()
              }}
              onClose={() => {
                AppWindows.removeByKey(win.key)
                this.updateWindows()
              }}
              onFocus={() => {
                win.showDevTools = true
                win.focused = true
                this.activeWindow = win
                this.updateWindows()
              }}
              onBlur={() => {
                if (!win) {
                  console.log('no window weird')
                  return
                }
                win.focused = false
                if (this.activeWindow.key === win.key) {
                  this.activeWindow = null
                }
                this.updateWindows()
              }}
              showDevTools={win.showDevTools}
              titleBarStyle={
                win.showBar ? 'hidden-inset' : 'customButtonsOnHover'
              }
            />
          )
        })}
      </app>
    )
  }
}
