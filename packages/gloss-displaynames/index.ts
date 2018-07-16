import handleGlossReferences from './handleGlossReferences'

export default function(babel) {
  // const { types: t } = babel
  const references = new Set()
  return {
    name: '@mcro/gloss-displaynames',
    visitor: {
      ImportDeclaration(path) {
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
        const { referencePaths } = path.scope.getBinding(name)
        referencePaths.forEach(reference => {
          references.add(reference)
        })
      },
      Program: {
        exit(_, { file }) {
          // console.log('Array.from(references)', Array.from(references))
          handleGlossReferences(Array.from(references), file, babel)
        },
      },
    },
  }
}
