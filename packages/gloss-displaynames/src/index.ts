import { handleGlossReferences } from './handleGlossReferences'

export default function glossViewDisplayNames(babel) {
  const references = new Set()
  const referenceState = {}

  return {
    name: '@mcro/gloss-displaynames',
    visitor: {
      ImportDeclaration(path, state) {
        const fileName = path.hub.file.opts.filename
        // why does babel try and process every file so many times?
        if (references.has(fileName)) {
          return
        }

        // options
        const matchNames = state.opts.matchNames || ['gloss']
        const matchImports = state.opts.matchImports || ['@mcro/gloss']

        // check valid
        if (matchImports.indexOf(path.node.source.value) === -1) {
          return
        }

        const importSpecifier = path.get('specifiers')[0]
        const name = importSpecifier.node.local.name
        if (matchNames.indexOf(name) === -1) {
          return
        }

        references.add(fileName)
        referenceState[fileName] = {
          paths: path.scope.getBinding(name).referencePaths,
          name,
        }
      },
      Program: {
        exit({ node }, { file }) {
          if (referenceState[file.opts.filename]) {
            const { name, paths } = referenceState[file.opts.filename]
            handleGlossReferences(node, name, paths, file, babel)
          }
        },
      },
    },
  }
}
