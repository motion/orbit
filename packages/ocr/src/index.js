import NLP from 'google-nlp'
import cheerio from 'cheerio'
import { sortBy } from 'lodash'
import { exec } from 'child_process'
import path from 'path'
import promisify from 'sb-promisify'

//	Google Cloud API key
const apiKey = 'AIzaSyDl_JoYndPs9gDWzbldcvx0th0E5d2iQu0'
const nlp = new NLP(apiKey)

const ocrPath = file => path.resolve(__dirname, '..', file)
const clean = async () => {
  return true
  const cmd = `rm ${ocrPath('tmp')}/*`
  await promisify(exec)(cmd)
}

const ocr = async file => {
  const tesseractHocr = ocrPath('tmp/tesseractOutput')
  const tess = `OMP_THREAD_LIMIT=1 ${ocrPath(
    'tesseract'
  )} ${file} ${tesseractHocr} --oem 1 -l eng ${ocrPath('hocr')}`
  let start = +new Date()
  const cmd = `${tess} && cat ${tesseractHocr}.hocr`
  const stdout = await promisify(exec)(cmd)
  console.log('tesseract took', +new Date() - start)

  const $ = cheerio.load(stdout)
  const parseBox = s =>
    s
      .split(';')[0]
      .split(' ')
      .slice(1)
      .map(i => +i / 2)

  const onlyAlpha = s => s.replace(/\W/g, '')
  const texts = []
  $('span.ocrx_word').each(function() {
    const text = onlyAlpha($(this).text())
    if (text.length === 0) return
    texts.push({
      text,
      box: parseBox($(this).attr('title')),
    })
  })

  const text = texts.map(_ => _.text).join(' ')

  start = +new Date()
  const { entities } = await nlp.analyzeEntities(text)
  const formattedEntities = sortBy(
    entities.map(({ name, salience }) => ({ name, weight: salience }))
  )

  const boxes = formattedEntities.map(({ name, weight }) => {
    const fits = texts.filter(({ text }) => name.indexOf(text.trim()) > -1)
    return {
      name,
      weight,
      box: fits.length > 0 ? fits[0].box : null,
    }
  })

  return { text, boxes }
}

const run = async ({ position, size }) => {
  const screenFile = ocrPath(`screenshot.png`)
  try {
    const start = +Date.now()
    const bounds = [...position, ...size].join(',')
    const getScreenshot = `require('screenshot-node').saveScreenshot(${bounds}, '${screenFile}', () => {})`
    await promisify(exec)(`node -e "${getScreenshot}"`)
    console.log('screnshotting took', +Date.now() - start)
    return await ocr(path.resolve(__dirname, screenFile))
  } catch (error) {
    console.log('Screenshot failed', error)
  }
}

export default async params => {
  const val = await run(params)
  await clean()
  return val
}
