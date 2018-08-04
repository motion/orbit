const Oracle = require('./lib').default
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

const oracle = new Oracle({ debugBuild: false })

async function train() {
  // reset train dir
  if (Fs.existsSync(trainDir)) {
    await execa('rm', ['-r', trainDir])
  }
  await execa('mkdir', [trainDir])

  await oracle.start()

  const fonts = [
    'adobe fangsong std',
    'apple symbols',
    'arial',
    'atlas grotesk',
    'avenir',
    'infinity',
    'legion slab',
    'monotype corsiva',
    'otama.ep',
    'patua one',
    'bernard mt condensed',
    'bitstream vera sans mono',
    'bookman old style',
    'cambria',
    'century gothic',
    'century schoolbook',
    'consolas',
    'eurostile',
    'franklin gothic medium',
    'georgia',
    'helvetica neue',
    'helvetica',
    'league gothic',
    'lucida grande',
    'minion pro',
    'museo',
    'nevis',
    'open sans',
    'pingfang hk',
    'pt sans',
    'pt serif',
    'raleway',
    'roboto slab',
    'rockwell',
    'sathu',
    'simsun',
    'source code pro',
    'trebuchet ms',
    'verdana',
  ]

  // 'adobe caslon pro',
  // 'apple chancery',
  // 'baskerville',
  // 'comic sans',
  // 'roboto',
  // 'satellite',
  // 'sinhala mn',
  // 'springsteel',
  // 'stsong',
  // 'times new roman',
  // 'times',
  // 'lao mn',

  while (fonts.length) {
    const font = fonts.pop()
    await execa(`open`, [`http://localhost:3003/${font}`])
    await sleep(1000)
    await new Promise(resolve => {
      oracle.onWords(async () => {
        oracle.pause()
        await sleep(350) // wait for fs to write all files
        const fontDir = Path.join(trainDir, font)
        await execa('cp', ['-r', tmpDir, trainDir])
        await execa('mv', [Path.join(trainDir, 'tmp'), fontDir])
        resolve()
      })
      oracle.resume()
      oracle.watchBounds({
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
  console.log('stopping oracle')
  await oracle.stop()
  process.exit(0)
})
