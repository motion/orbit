const os = require('os')
const path = require('path')
const execa = require('execa')
const macosVersion = require('macos-version')
const electronUtil = require('electron-util/node')

const sleep = ms => new Promise(res => setTimeout(res, ms))

const supportsHevcHardwareEncoding = (() => {
  if (!macosVersion.isGreaterThanOrEqualTo('10.13')) {
    return false
  }
  // Get the Intel Core generation, the `4` in `Intel(R) Core(TM) i7-4850HQ CPU @ 2.30GHz`
  // More info: https://www.intel.com/content/www/us/en/processors/processor-numbers.html
  const result = /Intel.*Core.*i(?:7|5)-(\d)/.exec(os.cpus()[0].model)
  // Intel Core generation 6 or higher supports HEVC hardware encoding
  return result && Number(result[1]) >= 6
})()

class Screen {
  constructor() {
    this.onLinesCB = _ => _
    this.onWordsCB = _ => _
    this.onClearWordCB = _ => _
    macosVersion.assertGreaterThanOrEqualTo('10.12')

    // handle exits to ensure killing swift sub-process
    // const stopRecording = () => this.stopRecording()
    // process.on('exit', stopRecording)
    // process.on('SIGINT', stopRecording)
    // process.on('SIGUSR1', stopRecording)
    // process.on('SIGUSR2', stopRecording)
  }

  startRecording(
    {
      debug = false,
      fps = 25,
      showCursor = true,
      displayId = 'main',
      audioDeviceId = undefined,
      videoCodec = undefined,
      // how far between pixels to check
      sampleSpacing = 10,
      // how many pixels to detect before triggering change
      sensitivity = 2,
      boxes,
    } = {},
  ) {
    if (this.recorder !== undefined) {
      throw new Error('Call `.stopRecording()` first')
    }

    // default box options
    const finalBoxes = boxes.map(box => ({
      initialScreenshot: false,
      findContent: false,
      screenDir: null,
      ...box,
    }))

    const recorderOpts = {
      debug,
      fps,
      showCursor,
      displayId,
      audioDeviceId,
      sampleSpacing,
      sensitivity,
      boxes: finalBoxes,
    }

    if (videoCodec) {
      const codecMap = new Map([
        ['h264', 'avc1'],
        ['hevc', 'hvc1'],
        ['proRes422', 'apcn'],
        ['proRes4444', 'ap4h'],
      ])

      if (!supportsHevcHardwareEncoding) {
        codecMap.delete('hevc')
      }

      if (!codecMap.has(videoCodec)) {
        throw new Error(`Unsupported video codec specified: ${videoCodec}`)
      }

      recorderOpts.videoCodec = codecMap.get(videoCodec)
      console.log('recorderOpts.videoCodec', recorderOpts.videoCodec)
    }

    const args = JSON.stringify(recorderOpts)
    console.log(args)

    const BIN = path.join(
      electronUtil.fixPathForAsarUnpack(__dirname),
      'swift',
      'Build',
      'Products',
      debug ? 'Debug' : 'Release',
      'aperture',
    )

    this.recorder = execa(BIN, [args], {
      reject: false,
    })

    this.recorder.catch((err, ...rest) => {
      console.log('screen err:', ...rest)
      console.log(err)
      console.log(err.stack)
      throw err
    })

    this.recorder.stderr.setEncoding('utf8')
    this.recorder.stderr.on('data', data => {
      console.log('screen stderr:', data)
    })

    this.recorder.stdout.setEncoding('utf8')

    this.recorder.stdout.on('data', data => {
      const out = data.trim()
      const isMessage = out[0] === '!'
      if (!isMessage) {
        console.log(out)
        return
      }
      let [title, ...value] = out.split(' ')
      value = value.join(' ').trim()
      try {
        // clear is fast
        if (title === '!') {
          this.onClearWordCB(value)
        }
        if (title === '!words') {
          console.log(
            'before words',
            JSON.parse(
              `[[203,261,65,1,"COM"],[297,262,71,-1,"BLl0"],[401,262,0,0,"L"],[433,262,33,-1,"Vs"],[520,262,54,-1,"vls"],[602,262,83,0,"LNKE"],[223,343,39,0,"lls"],[279,343,39,0,"Ill"],[350,343,0,0,"l"],[373,343,0,0,"I"],[404,343,115,0,"IIIIIII"],[549,343,37,15,"lII"],[609,343,18,0,"lI"],[664,343,0,0,"I"],[694,343,18,0,"II"],[743,343,39,0,"Fll"],[802,343,0,0,"u"],[850,343,157,0,"lllllIllI"],[201,422,103,4,"Jd1bIe"],[365,427,71,-6,"wjIch"],[464,427,249,-6,"1sdppdrejtIystIII"],[731,427,0,0,"d"],[764,426,45,-5,"ldI"],[830,426,189,-5,"mdgdzI1ed1d"],[1052,426,56,1,"1Otd"],[1137,426,37,0,"oje"],[1205,426,89,1,"ofgdg"],[1324,426,90,1,"mdkI1g"],[215,477,19,-1,"un"],[262,476,162,7,"ofJ1cobInI"],[453,477,347,-1,"summd1ZestheIrdtIcIe"],[832,471,158,5,"i11"],[1102,471,213,6,"G1IltdE"],[1353,472,74,-1,"YouII"],[204,526,204,0,"neverhed1the"],[436,522,72,5,"terns"],[544,526,360,13,"prI1cIpdIjdge1tprOdIeml"],[944,526,188,13,"TntjseekngI"],[1161,526,19,1,"Or"],[1210,527,100,0,"dIIgnIng"],[204,577,135,0,"Inl1tIves"],[372,570,44,6,"fom"],[454,577,107,-5,"soc1dIIss"],[620,571,66,6,"hdts"],[714,572,180,5,"jeIusethey"],[923,576,402,-5,"expedIdeOIOgytOsOIvedII"],[1344,576,119,-5,"prd1IcdI"],[203,627,424,-1,"cOjsIderdtonsofgovemd1ce"],[202,732,70,4,"There"],[301,732,139,4,"hdvebeen"],[467,737,63,-1,"sDme"],[562,736,220,-5,"fdIIyweIMdnd"],[812,736,74,1,"pOo1y"],[919,737,115,-6,"InfIrned"],[1063,737,366,-6,"sOcIdIIstcrItIquesOfpubI"],[203,787,175,0,"choIcetjeO1"],[417,782,561,4,"IdteIyldnJthIsdtIcIegejerd1Izesfom"],[1016,782,134,5,"tjOset0d"],[1178,787,52,-1,"cIdIm"],[1268,782,48,0,"tjdt"],[1344,782,78,0,"vd1I3"],[201,837,373,0,"JJstdontIIkeco1sIderng"],[601,832,231,5,"thehdrdtechn1"],[884,837,112,-1,"questOn"],[1023,836,233,0,"ofhOwtOdes1gn"],[1284,837,0,0,"d"],[1313,837,55,-6,"goOJ"],[204,887,184,12,"gOvernne1tj"],[416,881,252,5,"hIEwoJ1JexpId1n"],[698,887,196,-1,"whYtjeI1Ow1"],[921,887,171,-5,"gOverjme1z"],[1129,887,105,-1,"sOOten"],[1261,880,48,19,"fdIIj"],[1327,882,45,4,"A1Eo"],[1404,887,40,0,"why"],[204,937,256,0,"whe1everexIstI1g"],[490,937,238,-1,"gOvernmentsdre"],[757,932,55,17,"jddl"],[836,932,98,0,"Md11sz"],[970,937,353,-1,"1mmeJ1dte1YJumptOtje"],[203,987,287,0,"cOjcIus1ojtjdtthey"],[522,986,102,0,"mustbe"],[653,987,32,-1,"1un"],[714,981,91,0,"dyevII"],[824,986,316,0,"peOpIewhOwdjtthem"],[1177,982,13,4,"tO"],[1219,982,83,-1,"jeddd"],[1331,986,21,0,"on"],[204,1036,102,0,"pu1pOse"],[204,1142,14,4,"I1"],[245,1142,71,5,"t1I1g"],[344,1142,56,-1,"t0th"],[425,1146,125,1,"nkofhOw"],[583,1147,0,0,"d"],[614,1142,80,0,"Yd1Iv"],[736,1146,424,13,"n1ghtzspo1dt0thIsdTckI"],[1181,1142,168,-2,"lthOughtof"],[620,251,0,0,"W"]]`,
            ),
          )
          this.onWordsCB(JSON.parse(value))
        }
        if (title === '!lines') {
          this.onLinesCB(JSON.parse(value))
        }
      } catch (err) {
        console.log('error sending reply', title, 'value', value)
        console.log(err)
      }
    })

    return this.recorder
  }

  onClearWord(cb) {
    this.onClearWordCB = cb
  }

  onWords(cb) {
    this.onWordsCB = cb
  }

  onLines(cb) {
    this.onLinesCB = cb
  }

  async stopRecording() {
    if (this.recorder === undefined) {
      // null if not recording
      return
    }
    this.recorder.stdout.removeAllListeners()
    this.recorder.stderr.removeAllListeners()
    this.recorder.kill()
    this.recorder.kill('SIGKILL')
    await this.recorder
    // sleep to avoid issues
    await sleep(80)
    delete this.recorder
  }
}

module.exports = Screen
