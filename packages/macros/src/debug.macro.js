// import { createMacro } from 'babel-plugin-macros'

// function translate(quasis, translationFile) {
//   const text = quasis.map(element => element.value.raw).join('%s')
//   if (!translations[text]) {
//     return
//   }

//   quasis.forEach((element, index) => {
//     element.value.cooked = translatedTexts[index]
//     element.value.raw = translatedTexts[index]
//   })
// }

// function translatePath(path, options = {}) {
//   const { node } = path
//   const {
//     tagName = DEFAULT_TAGNAME,
//     translationFile = DEFAULT_TRANSLATION_FILE
//   } = options

//   if (node.tag.name !== tagName) {
//     return
//   }

//   translate(node.quasi.quasis, translationFile)
//   path.replaceWith(node.quasi)
// }

// function debugLog({ references, config }) {
//   references.default.forEach(({ parentPath }) => {
//     if (parentPath.type === 'TaggedTemplateExpression') {
//       translatePath(parentPath, config)
//     } else {
//       throw new TypeError(
//         `tagged-translations/macro can only be used in tagged template expression. You tried ${
//           parentPath.type
//         }.`
//       )
//     }
//   })
// }

// export default createMacro(debugLog, {
//   configName: 'debugLog'
// })
