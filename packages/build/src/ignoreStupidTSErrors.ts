const ModuleDependencyWarning = require('webpack/lib/ModuleDependencyWarning')

export class IgnoreNotFoundExportPlugin {
  ignoredSourceFiles: any
  ignoredExportNames: any

  constructor(option?) {
    const op = {
      sourceFiles: [],
      exportNames: [],
      ...option,
    }

    this.ignoredSourceFiles = op.sourceFiles
    this.ignoredExportNames = op.exportNames
  }

  apply(compiler) {
    const reg = /export '(.*)' \((imported|reexported) as '.*'\)? was not found in '(.*)'/

    const doneHook = stats => {
      stats.compilation.warnings = stats.compilation.warnings.filter(warn => {
        if (!(warn instanceof ModuleDependencyWarning) || !warn.message) {
          return true
        }

        console.log('warn.message2', warn.message)

        const matchedResult = warn.message.match(reg)

        if (!matchedResult) {
          return true
        }

        const [, exportName, , sourceFile] = matchedResult

        const customRulesIgnore = {
          exportNames: false,
          sourceFiles: false,
        }

        if (this.ignoredExportNames.length) {
          for (let i = 0; i < this.ignoredExportNames.length; i++) {
            const rule = this.ignoredExportNames[i]
            if (typeof rule === 'string' && rule === exportName) {
              customRulesIgnore.exportNames = true
              break
            } else if (rule instanceof RegExp && rule.test(exportName)) {
              customRulesIgnore.exportNames = true
              break
            }
          }
        } else {
          customRulesIgnore.exportNames = true
        }

        if (this.ignoredSourceFiles.length) {
          for (let i = 0; i < this.ignoredSourceFiles.length; i++) {
            const rule = this.ignoredSourceFiles[i]
            if (typeof rule === 'string' && rule === sourceFile) {
              customRulesIgnore.sourceFiles = true
              break
            } else if (rule instanceof RegExp && rule.test(sourceFile)) {
              customRulesIgnore.sourceFiles = true
              break
            }
          }
        } else {
          customRulesIgnore.sourceFiles = true
        }

        let ret = false
        Object.keys(customRulesIgnore).forEach(key => {
          if (!customRulesIgnore[key]) {
            ret = true
          }
        })

        return ret
      })
    }

    if (compiler.hooks) {
      compiler.hooks.done.tap('IgnoreNotFoundExportPlugin', doneHook)
    } else {
      compiler.plugin('done', doneHook)
    }
  }
}
