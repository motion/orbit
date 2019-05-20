import { handleGlossReferences } from './handleGlossReferences'

export default function glossViewDisplayNames(babel) {
  const references = new Set()
  const referenceState = {}

  return {
    name: 'gloss-babel',
    visitor: {
      ImportDeclaration(path, state) {
        const fileName = path.hub.file.opts.filename

        // why does babel try and process every file so many times?
        if (references.has(fileName)) {
          return
        }

        // options
        const matchNames: string[] = state.opts.matchNames || ['gloss']
        const matchImports: string[] = state.opts.matchImports || ['gloss']

        if (matchImports.indexOf(path.node.source.value) === -1) {
          return
        }

        const importSpecifiers = path.get('specifiers')
        const names: string[] = importSpecifiers.map(x => x.node.local.name)
        const name = matchNames.find(needle => names.indexOf(needle) !== -1)

        if (!name) {
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
