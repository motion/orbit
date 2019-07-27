// import { getGlobalConfig } from '@o/config'
// import { Cosal } from '@o/cosal'
// import { Logger } from '@o/logger'
// // import { Screen } from '@o/screen'
// import { Desktop } from '@o/stores'
// import { decorate } from '@o/use-store'
// import { on } from '@o/utils'
// import { debounce } from 'lodash'
// import macosVersion from 'macos-version'
// import { screenBinPath } from '../constants'

// const log = new Logger('OCRManager')
// const Config = getGlobalConfig()
// // const ORBIT_APP_ID = Config.isProd ? 'com.o.orbit' : 'com.github.electron'
// // const APP_ID = -1

// // prevent apps from clearing highlights
// const PREVENT_CLEAR = {
//   electron: true,
//   Chromium: true,
//   iterm2: true,
//   VSCode: true,
// }
// // prevent apps from triggering appState updates
// // const PREVENT_APP_STATE = {
// //   iterm2: true,
// //   electron: true,
// //   VSCode: true,
// //   Chromium: true,
// // }
// // // prevent apps from OCR
// // const PREVENT_SCANNING = {
// //   iterm2: true,
// //   VSCode: true,
// //   Xcode: true,
// //   finder: true,
// //   electron: true,
// //   Chromium: true,
// //   ActivityMonitor: true,
// // }

// @decorate
// export class OCRManager {
//   cosal: Cosal
//   hasResolvedOCR = false
//   clearOCRTm: any
//   isWatching = ''
//   curAppID = ''
//   curAppName = ''
//   watchSettings = { name: '', settings: {} }
//   started = false
//   screen = new Screen({
//     binPath: screenBinPath,
//     socketPort: Config.ports.ocrBridge,
//     // disable for now
//     // ocr: true,
//     onClose: () => {
//       console.log('ocr closed')
//     },
//   })

//   constructor({ cosal }: { cosal: Cosal }) {
//     this.cosal = cosal
//   }

//   start = async () => {
//     // for now just enable until re enable screen
//     if (macosVersion.is('<10.11')) {
//       console.log('older mac, avoiding screen')
//       return false
//     }
//     await this.screen.start()
//     this.setupScreenListeners()
//     this.started = true

//     // listen for start toggle
//     // commented because message sent code is commented
//     // Desktop.onMessage(Desktop.messages.TOGGLE_OCR, () => {
//     //   this.toggleOCR()
//     // })

//     // poll for now for updated transparency setting...
//     const listener2 = setInterval(this.screen.getInfo, 1000 * 5)
//     this.screen.getInfo()
//     on(this, listener2)

//     return true
//   }

//   async dispose() {
//     await this.screen.stop()
//   }

//   async toggleOCR() {
//     if (Desktop.ocrState.paused) {
//       // TODO almost but not working yet
//       // await this.screen.requestAccessibility()
//       if (Desktop.state.operatingSystem.accessibilityPermission) {
//         this.screen.startWatchingWindows()
//         Desktop.setOcrState({ paused: false })
//       } else {
//         console.log('No permisisons to read screen... need to show message')
//       }
//     } else {
//       this.screen.stopWatchingWindows()
//       // this.screen.pause()
//       Desktop.setOcrState({ paused: true })
//     }
//   }

//   // returns true if no permission
//   pauseIfNoPermission() {
//     if (Desktop.state.operatingSystem.accessibilityPermission === false) {
//       if (Desktop.ocrState.paused === false) {
//         Desktop.setOcrState({ paused: true })
//       }
//       return true
//     }
//     return false
//   }

//   // rescanOnNewAppState = react(
//   //   () => Desktop.state.appState,
//   //   () => {
//   //     this.ocrCurrentApp()
//   //   },
//   // )

//   setupScreenListeners() {
//     // operating info
//     this.screen.onInfo(info => {
//       Desktop.setState({
//         operatingSystem: {
//           accessibilityPermission: info.accessibilityPermission,
//           supportsTransparency: info.supportsTransparency,
//         },
//       })
//     })

//     // OCR words
//     // this.screen.onWords(async wordBounds => {
//     //   // [x, y, width, height, 'word']
//     //   const words = wordBounds.map(x => x[4]) as string[]

//     //   const wordsString = words.join(' ')
//     //   const salientWords = await this.cosal.getTopWords(wordsString, { max: 5 })

//     //   this.hasResolvedOCR = true
//     //   Desktop.setOcrState({
//     //     salientWords,
//     //     wordsString,
//     //     words: wordBounds,
//     //     updatedAt: Date.now(),
//     //   })
//     // })

//     // OCR lines
//     // this.screen.onLines(lines => {
//     //   Desktop.setOcrState({
//     //     lines,
//     //   })
//     // })

//     // window movements
//     // this.screen.onWindowChange((event, value) => {
//     //   // pause if no permission
//     //   if (this.pauseIfNoPermission()) {
//     //     return
//     //   }
//     //   if (event === 'ScrollEvent') {
//     //     // always clear if not paused, you can pause it to prevent clear if you want
//     //     if (!Desktop.ocrState.paused) {
//     //       this.setScreenChanged()
//     //     }
//     //     this.ocrCurrentApp()
//     //     return
//     //   }
//     //   console.log('got window change', event, value)
//     //   // console.log(`got event ${event} ${JSON.stringify(value)}`)
//     //   const lastState = toJS(Desktop.appState)
//     //   let appState: any = {}
//     //   let id = this.curAppID
//     //   const wasFocusedOnOrbit = this.curAppID === ORBIT_APP_ID
//     //   switch (event) {
//     //     case 'FrontmostWindowChangedEvent':
//     //       id = value.id
//     //       appState = {
//     //         id,
//     //         name: id ? last(id.split('.')) : value.title,
//     //         title: value.title,
//     //         offset: value.position,
//     //         bounds: value.size,
//     //       }
//     //       // update these now so we can use to track
//     //       this.curAppID = id
//     //       this.curAppName = appState.name
//     //       break
//     //     case 'WindowPosChangedEvent':
//     //       appState.bounds = value.size
//     //       appState.offset = value.position
//     //   }
//     //   // no change
//     //   if (isEqual(appState, lastState)) {
//     //     log.info('Same app state, ignoring scan')
//     //     return
//     //   }
//     //   const focusedOnOrbit = this.curAppID === ORBIT_APP_ID
//     //   Desktop.setState({ focusedOnOrbit })
//     //   // when were moving into focus prevent app, store its appName, pause then return
//     //   if (PREVENT_APP_STATE[this.curAppName]) {
//     //     log.info('Prevent app state', this.curAppName)
//     //     this.screen.pause()
//     //     return
//     //   }
//     //   if (!wasFocusedOnOrbit && !PREVENT_CLEAR[this.curAppName] && !PREVENT_CLEAR[appState.name]) {
//     //     const { appState } = Desktop.state
//     //     if (
//     //       !isEqual(appState.bounds, appState.bounds) ||
//     //       !isEqual(appState.offset, appState.offset)
//     //     ) {
//     //       console.log('ocr clearing...')
//     //       // immediate clear for moving
//     //       Desktop.sendMessage(Electron, Electron.messages.CLEAR)
//     //     }
//     //   }
//     //   if (!Desktop.ocrState.paused) {
//     //     this.screen.resume()
//     //   }
//     //   console.log('setting app state!', appState)
//     //   Desktop.setState({ appState })
//     // })

//     // OCR work clear
//     // this.screen.onBoxChanged(count => {
//     //   if (!Desktop.ocrState.words) {
//     //     log.info('RESET screen boxChanged (App)')
//     //     this.setScreenChanged()
//     //     if (this.isWatching === 'OCR') {
//     //       log.info('reset is watching ocr to set back to app')
//     //       this.ocrCurrentApp()
//     //     }
//     //   } else {
//     //     // for not many clears, try it
//     //     if (count < 20) {
//     //       // Desktop.setState({
//     //       //   clearWord: this.screen.changedIds,
//     //       // })
//     //     } else {
//     //       // else just clear it all
//     //       log.info('RESET screen boxChanged (NOTTTTTTT App)')
//     //       this.setScreenChanged()
//     //       this.ocrCurrentApp()
//     //     }
//     //   }
//     // })
//   }

//   async restartScreen() {
//     log.info('restartScreen')
//     this.setScreenChanged()
//     // await this.screen.stop()
//     // this.watchBounds(this.watchSettings.name, this.watchSettings.settings)
//     // await this.screen.start()
//   }

//   setScreenChanged = () => {
//     if (PREVENT_CLEAR[Desktop.state.appState.name]) {
//       return
//     }
//     // after fast clear, empty data
//     Desktop.setLastScreenChange(Date.now())
//     this.clearOCRState()
//   }

//   clearOCRState = debounce(() => {
//     Desktop.setOcrState({
//       words: null,
//       lines: null,
//     })
//   }, 32)

//   // async ocrCurrentApp() {
//   //   if (!this.started) {
//   //     return
//   //   }
//   //   clearTimeout(this.clearOCRTm)
//   //   if (!Desktop.appState.id || Desktop.ocrState.paused) {
//   //     return
//   //   }
//   //   const { name, offset, bounds } = Desktop.appState
//   //   if (PREVENT_SCANNING[name] || PREVENT_APP_STATE[name]) {
//   //     log.info('Prevent scanning app', name)
//   //     return
//   //   }
//   //   if (!offset || !bounds) {
//   //     log.info('No offset or no bounds')
//   //     return
//   //   }
//   //   console.log('scanning new app')
//   //   this.setScreenChanged()
//   //   // we are watching the whole app for words
//   //   await this.watchBounds('App', {
//   //     fps: 10,
//   //     sampleSpacing: 100,
//   //     sensitivity: 1,
//   //     showCursor: false,
//   //     boxes: [
//   //       {
//   //         id: APP_ID,
//   //         x: offset[0],
//   //         y: offset[1],
//   //         width: bounds[0],
//   //         height: bounds[1],
//   //         // screenDir: Constants.TMP_DIR,
//   //         initialScreenshot: true,
//   //         findContent: true,
//   //         ocr: true,
//   //       },
//   //     ],
//   //   })
//   //   this.hasResolvedOCR = false
//   //   if (Desktop.ocrState.paused) {
//   //     return
//   //   }
//   //   log.info('ocrCurrentApp.resume', name)
//   //   await this.screen.resume()
//   //   this.clearOCRTm = setTimeout(async () => {
//   //     if (!this.hasResolvedOCR) {
//   //       log.info('seems like ocr has stopped working, restarting...')
//   //       this.restartScreen()
//   //     }
//   //   }, 15000)
//   // }

//   // watchBounds = async (name, settings) => {
//   //   console.log('watchBounds', name, settings)
//   //   this.isWatching = name
//   //   this.watchSettings = { name, settings }
//   //   await this.screen.pause()
//   //   // this.screen.watchBounds(settings)
//   // }
// }
