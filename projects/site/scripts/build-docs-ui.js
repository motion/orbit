const docgen = require('react-docgen-typescript')
const ui = require.resolve('@o/ui')
const path = require('path')
const fs = require('fs-extra')
const _ = require('lodash')

const root = path.join(ui, '..', '..', 'src')
const outDir = './tmp'
fs.ensureDir(outDir)

const parseBaseProps = docgen.withCustomConfig('./tsconfig.json', {}).parse

const basePropsPath = path.join(root, 'View', 'types.ts')
const basePropsDef = parseBaseProps(basePropsPath)
const baseProps = [
  ...new Set([...Object.keys(basePropsDef[0].props), ...Object.keys(basePropsDef[1].props)]),
]

console.log('has', baseProps.length, 'base props')

// let components = getAllFiles(root)

// for (const cpath of components) {

//   break
// }

const { parse } = docgen.withCustomConfig('./tsconfig.json', {
  propFilter: props => {
    if (baseProps.indexOf(props.name) >= 0) {
      return false
    }
    if (props.parent) {
      return false
    }
    return true
  },
})

const out = parse(path.join(root, 'index.ts'))
const outFile = path.join(outDir, `components.json`)
console.log('🔥', outFile)
fs.writeJSON(outFile, out, { spaces: 2 })
