const Screen = require('./es6').default
const Fs = require('fs')
const Path = require('path')
const execa = require('execa')
const express = require('express')

const tmpDir = Path.join(__dirname, 'tmp')
const trainDir = Path.join(__dirname, 'train')
const sleep = ms => new Promise(res => setTimeout(res, ms))

const server = express()
server.get('/:font', (req, res) => {
  console.log('got req', req.params)
  res.send(getPage(req.params.font))
})

server.listen(3003)

function getPage(fontName) {
  console.log('getting', fontName)
  return `
<html>
  <head>
    <style>
      body {
        padding: 10px 20px;
        font-family: ${fontName};
        font-size: 29px;
        letter-spacing: 3px;
        line-height: 47px;
      }
      small {
        font-size: 20px;
        line-height: 34px;
        letter-spacing: 3px;
      }
      .light { font-weight: 300; font-smooth: antialiased; }
      p { margin: 0; }
    </style>
  </head>
  <body>
    <p>
      123 *',;:.?!#$
    </p>
    <p>
     <b>the quick brown fox jumps over the</b>
    </p>
    <p>
      <b>*a'b,c;d:e.f?g!h#i$j[k]l(m) lazy dog</b>
    </p>
    <p>
      <b>Cwm FJORD BANK GLyphs VEXT</b>
    </p>
    <p>lazy dog pack my box with PACK MY BOX</p>
    <p>
      <b>Quiz Jackdaws love foive dozen liuor</b>
    </p>
    <p>
      JACKDAWS LOVE my big sphinx of quartz
    </p>
    <p>
      1234567890 <i>1234567890</i> <i><b>1234567890</b></i>
    </p>
    <p>
      <i><b>abcdegh#$[k]l(m)opqrstuvwxyz</b></i>
    </p>
    <p class="light"><i>1234567890 abcdefehklmnorstuvwxz</i></p>
    <p class="light"><i>ABCDEFGHIJKLMNOPQRSTUVWXYZ</i></p>
    <p class="light">1234567890 abcdefeghijklmnopqrstuvwxyz</p>
    <p class="light">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
    <small>
    <p>
    <b>*a'b,c;d:e.f?g!h#i$j[k]l(m)opqrstuvwxyz</b>
  </p>
  <p>
   <b><i>the quck brown fox umps over the lazy dog</i></b>
  </p>
  <p>
    <b>Cwm FJORD BANK GLyphs VEXT Quiz</b>
  </p>
  <p>
    foive dozen liuor usxcs PACK MY BOX WITH
  </p>
  <p>
    <b>Jackdaws love</b> JACKDAWS LOVE my big sphinx of quartz
  </p>
  <p>
    1234567890 <b>1234567890</b>
  </p>
    </small>
  </body>
</html>
  `
}

const screen = new Screen({ debugBuild: false })

async function train() {
  // reset train dir
  if (Fs.existsSync(trainDir)) {
    await execa('rm', ['-r', trainDir])
  }
  await execa('mkdir', [trainDir])

  await screen.start()

  const fonts = [
    'arial',
    'georgia',
    'verdana',
    'helvetica',
    'rockwell',
    'avenir',
    'century gothic',
    'century schoolbook',
    'eurostile',
    'helvetica neue',
    'atlas grotesk',
    'bernard mt condensed',
    'bookman old style',
    'cambria',
    'consolas',
    'franklin gothic medium',
    'open sans',
    'roboto',
    'roboto slab',
    'baskerville',
    'comic sans',
    'infinity',
    'league gothic',
    'legion slab',
    'lucida grande',
    'minion pro',
    'museo',
    'nevis',
    'otama.ep',
    'patua one',
    'pingfang hk',
    'pt sans',
    'pt serif',
    'raleway',
    'satellite',
    'sathu',
    'simsun',
    'sinhala mn',
    'source code pro',
    'springsteel',
    'stsong',
    'times',
    'times new roman',
    'trebuchet ms',
    'adobe caslon pro',
    'apple chancery',
    'apple symbols',
    'bitstream vera sans mono',
    'monotype corsiva',
    'adobe fangsong std',
    // 'lao mn',
  ]

  while (fonts.length) {
    const font = fonts.pop()
    await execa(`open`, [`http://localhost:3003/${font}`])
    await sleep(1000)
    await new Promise(resolve => {
      screen.onWords(async data => {
        screen.pause()
        await sleep(350) // wait for fs to write all files
        const fontDir = Path.join(trainDir, font)
        await execa('cp', ['-r', tmpDir, trainDir])
        await execa('mv', [Path.join(trainDir, 'tmp'), fontDir])
        resolve()
      })
      screen.resume()
      screen.watchBounds({
        fps: 1,
        sampleSpacing: 1,
        sensitivity: 1,
        showCursor: false,
        debug: true,
        boxes: [
          {
            id: 0,
            x: 0,
            y: 24,
            width: 850,
            height: 1400,
            initialScreenshot: true,
            findContent: true,
            screenDir: tmpDir,
            ocr: false,
          },
        ],
      })
    })
  }
}

try {
  train()
} catch (err) {
  console.log('error', err)
}

process.on('SIGINT', async () => {
  console.log('stopping screen')
  await screen.stop()
  console.log('stoped')
  process.exit(0)
})
