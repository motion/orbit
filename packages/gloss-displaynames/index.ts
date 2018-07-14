import handleGlossReferences from './handleGlossReferences'

export default function(babel) {
  const { types: t } = babel
  const references = new Set()
  return {
    name: 'babel-plugin-gloss-displayname',
    visitor: {
      ImportDeclaration(path) {
        const defaultSpecifierPath = path.get('specifiers')[0]
        if (
          path.node.source.value !== '@mcro/view' ||
          !t.isImportDefaultSpecifier(defaultSpecifierPath)
        ) {
          return
        }
        const {
          node: {
            local: { name },
          },
        } = defaultSpecifierPath
        const { referencePaths } = path.scope.getBinding(name)
        referencePaths.forEach(reference => {
          references.add(reference)
        })
      },
      Program: {
        exit(path, { file }) {
          console.log('Array.from(references)', Array.from(references))
          handleGlossReferences(Array.from(references), file, babel)
        },
      },
    },
  }
}
