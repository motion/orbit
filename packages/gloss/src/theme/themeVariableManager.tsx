import { cssValue, stringHash, validCSSAttr } from '@o/css'

import { makeStyleTag } from '../stylesheet/makeStyleTag'
import { CompiledTheme } from './createTheme'
import { preProcessTheme, processThemeSubset } from './preProcessTheme'
import { pseudoProps } from './pseudos'
import { CurrentTheme } from './Theme'
import { unwrapTheme } from './useTheme'

class ThemeVariableManager {
  tag = makeStyleTag()
  mounted = new Map<CompiledTheme, number>()
  mountedSubThemes = new Set<CurrentTheme>()

  get sheet() {
    return this.tag!.sheet! as CSSStyleSheet
  }

  getThemeVariables(theme: CompiledTheme, rules = '') {
    for (const key in theme) {
      const val = theme[key]
      if (pseudoProps[key]) {
        rules += this.getThemeVariables(val)
        continue
      }
      if (val && val.cssVariable) {
        if (val.getCSSColorVariables) {
          // allows for nicer handling of alpha changes
          const { rgb, rgba } = val.getCSSColorVariables()
          rules += `--${val.cssVariable}: ${rgba};`
          rules += `--${val.cssVariable}-rgb: ${rgb};`
        } else if (val.getCSSValue) {
          let next = val.getCSSValue()
          // parse using same gloss cssValue if valid
          if (validCSSAttr[val] && typeof next !== 'string') {
            next = cssValue(key, next, true, {
              ignoreCSSVariables: true,
            })
          }
          if (next) {
            rules += `--${val.cssVariable}: ${next};`
          }
        }
      }
    }
    return rules
  }

  mount(themeContext: CurrentTheme) {
    const theme = unwrapTheme(themeContext.current)

    if (this.mounted.has(theme)) {
      this.mounted.set(theme, this.mounted.get(theme)! + 1)
    } else {
      this.mounted.set(theme, 1)

      if (theme._isSubTheme) {
        this.mountSubTheme(themeContext)
        // clone for now to avoid mutations
        this.mountedSubThemes.add({
          ...themeContext,
          current: { ...themeContext.current },
        })
        return
      }
      if (theme._isCoat) {
        return
      }

      const classNames = this.getClassNames(themeContext.current)
      const selector = `.${classNames}`
      const rules = this.getThemeVariables(theme)
      if (rules.length) {
        const rule = `${selector} { ${rules} }`
        this.sheet.insertRule(rule)
      }
      if (theme.coats) {
        for (const coatKey in theme.coats) {
          let coat = theme.coats[coatKey]
          if (typeof coat === 'function') {
            coat = preProcessTheme({ coat: coatKey }, theme)
          }
          const coatRules = this.getThemeVariables(coat)
          const rule = `${selector} .coat-${coatKey} { ${coatRules} }`
          this.sheet.insertRule(rule)
        }
      }
      if (this.mountedSubThemes.size) {
        this.mountedSubThemes.forEach(subThemeContext => {
          this.mountSubThemeFromParent(theme, subThemeContext)
        })
      }
    }
  }

  mountSubTheme(subThemeContext: CurrentTheme) {
    for (const [theme] of this.mounted.entries()) {
      // if its a base level theme, add all subtheme rules
      if (!theme.parent) {
        this.mountSubThemeFromParent(theme, subThemeContext)
      }
    }
  }

  mountSubThemeFromParent(parent: CompiledTheme, subThemeContext: CurrentTheme) {
    const baseSelector = `.theme-${parent.name} .${this.getClassNames(subThemeContext.current)}`
    let selectors = baseSelector

    // making sure css selectors bind strongly
    let parentParent = subThemeContext.parentContext
    const parentChain: string[] = []
    let last = parent.name
    while (parentParent) {
      const parentTheme = parentParent.current
      parentParent = parentParent?.parentContext
      if (parentTheme && parentTheme.name !== last) {
        parentChain.unshift(`.theme-${parentTheme.name}`)
        last = parentTheme.name
        selectors += `, ${parentChain.join(' ')} ${baseSelector}`
      }
    }

    let subTheme = subThemeContext.current
    // need to re-run select using new parent theme
    if (subTheme._subTheme) {
      subTheme = processThemeSubset(
        {
          coat: subTheme._coatName,
          subTheme: subTheme._subTheme,
        },
        parent,
      )!
    }

    if (this.mounted.has(subTheme)) {
      return
    }

    const subRules = this.getThemeVariables(subTheme)

    if (subRules.length) {
      const rule = `${selectors} {${subRules}}`
      this.sheet.insertRule(rule)
    }
  }

  unmount(_theme: CurrentTheme) {
    // noop for now, not a big memory use
    // would want to garbage collect too and maybe only remove if lots of others are added
    // this.mounted.set(theme, (this.mounted.get(theme) || 1) - 1)
  }

  getClassNames(theme: CompiledTheme) {
    const isOriginal = !theme._isCoat && !theme._isSubTheme
    if (isOriginal) {
      if (!theme.name) {
        debugger
      }
      return `theme-${theme.name}`
    }
    let res: string[] = []
    if (theme._coatName) {
      res.push(`coat-${theme._coatName}`)
    }
    if (theme._subThemeName) {
      res.push(`sub-${theme._subThemeName}`)
    }
    return res.join('-')
  }

  mountVariables(variables: Object) {
    try {
      const className = `v${stringHash(JSON.stringify(variables))}`
      let rules = ''
      for (const key in variables) {
        rules += `--${key}: ${variables[key]};`
      }
      this.sheet.insertRule(`.${className} {${rules}}`)
      return className
    } catch(err) {
      console.error(`Error mounting variables: ${err.message}, variables:`, variables)
      return ''
    }
  }

  unmountVariables(_variables: Object) {
    // todo, similar gc to gloss
  }
}

// singletone
export const themeVariableManager = new ThemeVariableManager()
