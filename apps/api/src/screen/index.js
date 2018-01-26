// @flow
import Path from 'path'
import Fs from 'fs-extra'
import { Server } from 'ws'
import ScreenOCR from '@mcro/screen'
import ocrScreenshot from '@mcro/ocr'
import Swindler from '@mcro/swindler'
import { isEqual, throttle } from 'lodash'
import iohook from 'iohook'
import * as Constants from '~/constants'

JSON.parse(`
[[203,261,65,1,"COM"],[297,262,71,-1,"BLl0"],[401,262,0,0,"L"],[433,262,33,-1,"Vs"],[520,262,54,-1,"vls"],[602,262,83,0,"LNKE"],[223,343,39,0,"lls"],[279,343,39,0,"Ill"],[350,343,0,0,"l"],[373,343,0,0,"I"],[404,343,115,0,"IIIIIII"],[549,343,37,15,"lII"],[609,343,18,0,"lI"],[664,343,0,0,"I"],[694,343,18,0,"II"],[743,343,39,0,"Fll"],[802,343,0,0,"u"],[850,343,157,0,"lllllIllI"],[201,422,95,0,"Jd1bIY"],[337,433,0,0,"l"],[365,427,71,-6,"wjIch"],[464,427,249,-6,"1sdppdrejtIystIII"],[731,427,0,0,"d"],[761,427,48,-6,"nldI"],[830,426,126,1,"mdJdzI1n"],[982,427,38,-6,"d1d"],[1052,426,56,1,"1Otd"],[1137,427,156,0,"Ojejofgd0"],[1324,426,90,1,"mdkI1u"],[215,477,19,-1,"un"],[262,476,162,7,"ofJ1cobInI"],[453,477,347,-1,"summd1ZestheIrdtIcIe"],[832,471,158,5,"i11"],[1102,471,213,6,"G1IltdE"],[1353,472,74,-1,"YouII"],[204,526,206,1,"neverhnd1thn"],[436,522,72,5,"terns"],[544,526,360,13,"prI1cIpdIjdge1tpr0dIeml"],[944,526,188,13,"TntjseeknJI"],[1161,526,19,1,"Or"],[1210,527,100,0,"dII01InQ"],[204,577,135,0,"Inl1tIves"],[372,570,44,6,"fom"],[454,577,107,-5,"soc1dIIss"],[620,571,66,6,"hdts"],[714,572,180,5,"jeIusethey"],[923,576,402,-5,"expedIdeOIOgytOsOIvedII"],[1344,576,119,-5,"prd1IcdI"],[203,627,202,0,"cOjsIderdtonE"],[431,626,17,-6,"of"],[472,627,155,-1,"govemd1ce"],[202,732,70,4,"There"],[301,732,139,4,"hdvebeen"],[467,737,63,-1,"sDme"],[562,736,220,-5,"fdIIyweIMdnd"],[812,736,74,1,"pOo1y"],[919,737,115,-6,"InfIrned"],[1063,737,366,-6,"sOcIdIIstcrItIquesOfpubI"],[203,787,77,-1,"choIce"],[308,782,70,5,"tjeO1"],[417,782,82,17,"IdteIyl"],[520,787,37,-6,"d1J"],[585,782,40,5,"thIs"],[651,787,75,-1,"dtIcIe"],[754,787,155,0,"gejeru1Izes"],[934,780,0,0,"f"],[947,787,31,-1,"nom"],[1016,782,65,4,"tjOse"],[1110,782,11,4,"tO"],[1150,787,0,0,"d"],[1178,787,52,-1,"cIdIm"],[1268,782,48,0,"tjdt"],[1348,782,76,5,"4d1I1b"],[201,837,373,0,"JJEtdontIIkeco1sIderng"],[601,832,111,5,"thehdrQ"],[740,832,256,4,"techn11questOn"],[1023,836,77,1,"ofhOw"],[1134,832,122,4,"tDdes1gn"],[1284,837,0,0,"d"],[1313,837,55,-6,"goOJ"],[204,887,184,12,"gOvernne1tj"],[416,881,252,5,"hIEwoJ1JexpId1n"],[698,887,196,-1,"whYtjeI1Ow1"],[921,887,171,-5,"gOverjme1z"],[1129,887,105,-1,"sOOten"],[1261,880,48,19,"fdIIj"],[1327,882,45,4,"A1Eo"],[1404,887,40,0,"why"],[204,937,256,0,"whe1everexIstI1g"],[490,937,238,-1,"gOvernmentsdre"],[757,931,55,18,"bddl"],[836,932,98,0,"Md11s3"],[970,937,165,0,"1mmeJ1dte1Y"],[1162,937,62,-1,"Jump"],[1251,932,13,4,"tO"],[1292,932,31,4,"tje"],[203,987,141,-1,"cOjcIus1oj"],[370,982,49,0,"tjdt"],[441,982,0,0,"t"],[455,981,35,6,"hey"],[522,986,60,-4,"must"],[606,981,18,5,"be"],[653,987,35,-1,"1u1"],[714,981,17,6,"dy"],[760,986,45,-5,"evII"],[824,986,81,0,"peOpIe"],[934,987,43,-1,"whO"],[1006,987,62,-5,"wdjt"],[1090,982,50,4,"them"],[1177,982,13,5,"tO"],[1219,982,18,4,"je"],[1266,981,36,0,"ddd"],[1331,986,21,0,"on"],[204,1036,102,0,"pu1pOse"],[204,1142,14,4,"I1"],[245,1142,71,5,"t1I1g"],[344,1142,56,-1,"t0th"],[425,1146,125,1,"nkofhOw"],[583,1147,0,0,"d"],[614,1142,80,0,"Yd1Iv"],[736,1146,424,13,"n1ghtzspo1dt0thIsdtckI"],[1181,1142,168,-2,"lthOughtof"],[203,1197,201,-1,"cOmme1te11o"],[443,1191,54,6,"bedr"],[528,1197,16,-1,"so"],[582,1191,238,18,"Iowslm1"],[840,1196,479,-5,"mIlkx1ljwIIIzeIfTIdted"],[1347,1192,12,4,"to"],[1387,1192,32,4,"tje"],[203,1242,483,17,"tIcIllJIIWjI"],[704,1242,20,4,"To"],[756,1246,312,-6,"ndssIveIyOveGImpIIN"],[212,1352,88,4,"41stke"],[328,1352,103,0,"tjeOrIss"],[469,1352,354,17,"tldtpOIItIcsdssc1enceI"],[844,1356,377,13,"engInee11gIormeJ1c1nej"],[1238,1352,130,4,"Thestte"],[1398,1357,7,0,"1s"],[203,1401,133,18,"dIsedsedI"],[358,1402,122,-1,"werdI1"],[497,1401,245,6,"dOjOTlst1dI1g"],[769,1407,87,-6,"dr0u1d"],[885,1407,97,0,"dwuI1g"],[1011,1406,398,-5,"OverthebetdIdg1OsIsd1d"],[203,1457,37,-1,"cuz"],[290,1451,319,0,"sOmeofJshdvegoOd"],[639,1457,169,0,"IdedsIotjeG"],[848,1452,116,-1,"jdveddd"],[994,1457,274,-5,"IdedstjdtwOuId1t"],[1293,1451,63,18,"heIpl"],[1377,1456,19,1,"o1"],[203,1502,297,4,"thdtwOuId1usetoo"],[532,1506,134,0,"md1ysIde"],[695,1506,59,-4,"efeI"],[203,1611,551,6,"confI1tjeOrIsstldtpOIItIcsdswdr"],[788,1612,118,0,"DIfet1t"],[931,1611,131,0,"bIozwIth"],[1091,1611,299,5,"dIfefjt1nterestsdT"],[203,1660,255,6,"fozverhghtI1gto"],[487,1661,661,0,"determInewhetje1tjesQteexIststOe11Ich"],[1175,1662,31,4,"the"],[1236,1662,143,4,"E11teso1tO"],[1409,1661,45,5,"heIp"],[204,1712,30,4,"the"],[264,1712,80,4,"PeDpIe"],[208,1822,308,5,"v1stketjeOrIssvIew"],[549,1821,85,5,"debdte"],[662,1827,179,12,"dsessent1dII"],[864,1822,26,4,"We"],[918,1827,28,-6,"d1I"],[965,1821,59,6,"brng"],[1052,1821,394,5,"dIjere1tfI1nsofexpejIse"],[204,1872,11,4,"tO"],[244,1872,31,4,"the"],[304,1872,74,17,"1b1eI"],[399,1877,37,-6,"d1d"],[466,1876,52,0,"Once"],[546,1877,25,-1,"we"],[599,1877,28,-6,"d1I"],[646,1877,151,-6,"J1deGtdnd"],[826,1872,31,4,"the"],[886,1877,69,-1,"whO1e"],[983,1877,131,12,"sItudtIO1l"],[1138,1877,21,-1,"we"],[1188,1877,36,-1,"I1"],[1252,1877,34,-1,"use"],[1314,1877,88,-1,"w1sdOm"],[203,1926,133,1,"ofcr0wJs"],[361,1922,161,4,"tOcO1veTe"],[551,1926,21,0,"O1"],[598,1922,31,4,"tje"],[657,1922,209,4,"tnldtmejtpId1"],[892,1922,166,0,"thdtbe5tfl"],[1095,1922,31,4,"the"],[1158,1926,51,-5,"1eed"],[1239,1926,197,-5,"Ofou1mJtudI"],[204,1976,248,0,"pdtIe1tItjes1te"],[492,1972,174,4,"whOwI1son"],[694,1977,278,-1,"d1ypdj1cJdrIssJe"],[1001,1977,7,0,"Is"],[1035,1972,41,5,"Iess"],[1103,1977,309,-1,"ImpotntcredtI1gIn"],[204,2026,362,-4,"1ltwjJItj"],[592,2027,120,-1,"lJ11"],[769,2021,57,5,"Iuw"],[899,2021,0,0,"I"],[917,2026,183,1,"OvertheIO1g"],[1127,2022,47,4,"term"]]
`)

const sleep = ms => new Promise(res => setTimeout(res, ms))
const APP_ID = 'screen'
const APP_SCREEN_PATH = Path.join(Constants.TMP_DIR, `${APP_ID}.png`)
const DEBOUNCE_OCR = 1000
const TOP_BAR_HEIGHT = 23

type TContext = {
  appName: string,
  offset: [Number, Number],
  bounds: [Number, Number],
}

type Word = {
  word: string,
  weight: Number,
  top: Number,
  left: Number,
  width: Number,
  height: Number,
}

type TScreenState = {
  context?: TContext,
  ocr?: Array<Word>,
  lastOCR: Number,
  lastScreenChange: Number,
  mousePosition: [Number, Number],
  keyboard: Object,
}

export default class ScreenState {
  stopped = false
  invalidRunningOCR = Date.now()
  hasNewOCR = false
  runningOCR = false
  screenDestination = Constants.TMP_DIR
  screenOCR = new ScreenOCR()
  wss = new Server({ port: 40510 })
  activeSockets = []
  id = 0
  nextOCR = null
  swindler = new Swindler()
  curContext = {}

  state: TScreenState = {
    context: null,
    ocr: null,
    lastOCR: Date.now(),
    lastScreenChange: Date.now(),
    mousePosition: [0, 0],
    keyboard: {},
  }

  constructor() {
    this.wss.on('connection', socket => {
      let uid = this.id++
      console.log('socket connecting', uid)
      // send current state
      this.socketSend(socket, this.state)
      // add to active sockets
      this.activeSockets.push({ uid, socket })
      // listen for incoming
      socket.on('message', str => {
        const { action, value } = JSON.parse(str)
        if (this[action]) {
          console.log('received action:', action)
          this[action].call(this, value)
        }
      })
      // handle events
      socket.on('close', () => {
        this.removeSocket(uid)
      })
      socket.on('error', err => {
        // ignore ECONNRESET throw anything else
        if (err.code !== 'ECONNRESET') {
          throw err
        }
        this.removeSocket(uid)
      })
    })
    this.wss.on('close', () => {
      console.log('WE SHOULD HANDLE THIS CLOSE', ...arguments)
    })
    this.wss.on('error', (...args) => {
      console.log('wss error', args)
    })
  }

  get hasListeners() {
    return !!this.activeSockets.length
  }

  start = () => {
    this.stopped = false
    this.startSwindler()
    this.watchMouse()
    this.watchKeyboard()
    iohook.start()
  }

  startSwindler() {
    console.log('Start swindling...')
    this.swindler.start()

    const update = () => {
      this.cancelCurrentOCR()
      // console.log('UpdateContext:', this.curContext.id)
      // ensure new
      this.updateState({ context: Object.assign({}, this.curContext) })
    }

    this.swindler.onChange(({ event, message }) => {
      // console.log('Swindler: ', event)
      switch (event) {
        case 'FrontmostWindowChangedEvent':
          this.setCurrentContext(message)
          // if (id === 'Chrome' || id === 'Safari') {
          //   console.log('is a browser')
          // }
          break
        case 'WindowSizeChangedEvent':
          this.resetHighlights()
          this.curContext.bounds = message
          break
        case 'WindowPosChangedEvent':
          this.resetHighlights()
          this.curContext.offset = message
      }

      update()
    })
  }

  setCurrentContext = nextContext => {
    // if given id, reset to new context
    if (nextContext.id) {
      this.curContext = {
        id: nextContext.id,
      }
    }
    const { curContext } = this
    const { id } = curContext
    curContext.title = nextContext.title
    curContext.offset = nextContext.offset
    curContext.bounds = nextContext.bounds
    curContext.appName = id ? id.split('.')[2] : curContext.title
    // adjust for more specifc content area found
    if (this.contentArea) {
      const [x, y, width, height] = this.contentArea
      // divide here for retina
      curContext.offset[0] += x / 2
      curContext.offset[1] += y / 2
      curContext.bounds[0] += width / 2
      curContext.bounds[1] += height / 2
      console.log('adjusting for content area', curContext)
    }
  }

  resetHighlights = () => {
    console.log('reset highlights')
    this.updateState({
      lastScreenChange: Date.now(),
    })
  }

  watchKeyboard = () => {
    const optionKey = 56
    iohook.on('keydown', ({ keycode }) => {
      const isOptionKey = keycode === optionKey
      // clear option key if other key pressed during
      if (this.state.keyboard.option && !isOptionKey) {
        this.updateState({ keyboard: { option: false } })
        return
      }
      // option on
      if (isOptionKey) {
        this.updateState({ keyboard: { option: true } })
      }
    })
    iohook.on('keyup', ({ keycode }) => {
      // option off
      if (keycode === optionKey) {
        this.updateState({ keyboard: { option: false } })
      }
    })
  }

  watchMouse = () => {
    iohook.on(
      'mousemove',
      throttle(({ x, y }) => {
        this.updateState({
          mousePosition: [x, y],
        })
      }, 64),
    )
  }

  cancelCurrentOCR = () => {
    // cancel next OCR if we have a new context
    clearTimeout(this.nextOCR)
    this.invalidRunningOCR = Date.now()
  }

  updateState = object => {
    if (this.stopped) {
      console.log('stopped, dont send')
      return
    }
    let hasNewState = false
    for (const key of Object.keys(object)) {
      if (!isEqual(this.state[key], object[key])) {
        hasNewState = true
        break
      }
    }
    if (!hasNewState) {
      return
    }
    const oldState = this.state
    this.state = { ...this.state, ...object }
    // sends over (oldState, changedState, newState)
    this.onChangedState(oldState, object, this.state)
    // only send the changed things to reduce overhead
    this.socketSendAll(object)
  }

  onChangedState = async (oldState, newStateItems) => {
    // no listeners, no need to watch
    // if (!this.hasListeners) {
    //   return
    // }
    // const hasNewOCR = !isEqual(prevState.ocr, this.state.ocr)
    // re-watch on different context
    const firstTimeOCR =
      (!oldState.ocr || !oldState.ocr.length) && newStateItems.ocr
    const newContext = newStateItems.context
    if (newContext || firstTimeOCR) {
      await this.handleNewContext()
    }
  }

  handleNewContext = async () => {
    const { appName, offset, bounds } = this.state.context
    console.log('handleNewContext', appName, { offset, bounds })
    if (!offset || !bounds) {
      console.log('didnt get offset/bounds')
      return
    }

    await this.screenOCR.stopRecording()

    const appBox = {
      id: APP_ID,
      x: offset[0],
      y: offset[1],
      width: bounds[0],
      height: bounds[1],
      screenDir: this.screenDestination,
      initialScreenshot: true,
      findContent: true,
    }

    let settings
    const { ocrWords } = this.state

    // watch settings
    if (!ocrWords) {
      // remove old screen
      try {
        await Fs.remove(APP_SCREEN_PATH)
      } catch (err) {
        console.log(err)
      }
      // we are watching the whole app for words
      settings = {
        fps: ocrWords ? 30 : 2,
        sampleSpacing: 10,
        sensitivity: 2,
        showCursor: false,
        boxes: [appBox],
      }
    } else {
      const boxes = [
        ...ocrWords.map(({ word, top, left, width, height }) => {
          return {
            id: word,
            x: left,
            y: top + TOP_BAR_HEIGHT,
            width,
            height,
            // to test what boxes its capturing
            // screenDir: this.screenDestination,
          }
        }),
      ]
      // watch just the words to see clears
      settings = {
        fps: 20,
        sampleSpacing: 2,
        sensitivity: 1,
        // show cursor for now to test
        showCursor: true,
        boxes,
      }
    }

    try {
      this.screenOCR.startRecording(settings)
    } catch (err) {
      console.log('Error starting recorder:', err.message)
      console.log(err.stack)
    }

    // start watching for diffs too

    this.screenOCR.onWords(words => {
      this.updateState({ ocrWords: words })
    })

    this.screenOCR.onClearWord(word => {
      console.log('clear', word)
    })
  }

  stop = () => {
    this.stopped = true
    this.dispose()
  }

  dispose() {
    console.log('disposing screen...')
    if (this.screenOCR) {
      this.screenOCR.stopRecording()
    }
    if (this.swindler) {
      this.swindler.stop()
    }
    console.log('screen disposed')
  }

  async getOCR() {
    if (!this.state.context) {
      return
    }
    console.log('running ocr', this.state.context)
    const { offset } = this.state.context
    if (!offset) {
      return
    }
    try {
      const res = await ocrScreenshot({
        inputFile: APP_SCREEN_PATH,
      })
      const { boxes } = res
      const [screenX, screenY] = offset
      return boxes.map(({ name, weight, box }) => {
        // box => { x, y, width, height }
        return {
          word: name,
          weight,
          top: Math.round(box.y / 2 + screenY - TOP_BAR_HEIGHT),
          left: Math.round(box.x / 2 + screenX),
          width: Math.round(box.width / 2),
          height: Math.round(box.height / 2),
        }
      })
    } catch (err) {
      console.log('error with ocr', err.message, err.stack)
    }
  }

  socketSend = (socket, data) => {
    try {
      socket.send(JSON.stringify(data))
    } catch (err) {
      console.log('error with scoket', err.message, err.stack)
    }
  }

  socketSendAll = data => {
    const strData = JSON.stringify(data)
    for (const { socket, uid } of this.activeSockets) {
      try {
        socket.send(strData)
      } catch (err) {
        console.log('failed to send to socket, removing', err, uid)
        this.removeSocket(uid)
      }
    }
  }

  removeSocket = uid => {
    this.activeSockets = this.activeSockets.filter(s => s.uid !== uid)
  }
}
