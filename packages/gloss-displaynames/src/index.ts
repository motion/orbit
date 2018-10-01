import handleGlossReferences from './handleGlossReferences'

export default function glossViewDisplayNames(babel) {
  console.log('START')
  // const { types: t } = babel
  const references = new Set()
  const referencePaths = {}
  return {
    name: '@mcro/gloss-displaynames',
    visitor: {
      ImportDeclaration(path) {
        const fileName = path.hub.file.opts.filename
        // why does babel try and process every file so many times?
        if (references.has(fileName)) {
          return
        }
        references.add(fileName)

        const importSpecifier = path.get('specifiers')[0]
        if (path.node.source.value !== '@mcro/black') {
          return
        }
        const {
          node: {
            local: { name },
          },
        } = importSpecifier
        if (name != 'view') {
          return
        }

        referencePaths[fileName] = path.scope.getBinding(name).referencePaths
      },
      Program: {
        exit({ node }, { file }) {
          if (referencePaths[file.opts.filename]) {
            handleGlossReferences(node, referencePaths[file.opts.filename], file, babel)
          }
        },
      },
    },
  }
}
