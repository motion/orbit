import { makeStyleTag } from '../stylesheet/makeStyleTag'
import { CompiledTheme } from './createTheme'
import { preProcessTheme } from './preProcessTheme'
import { CurrentTheme } from './Theme'

class ThemeVariableManager {
  tag = makeStyleTag()
  mounted = new Map<CompiledTheme, number>()
  mountedSubThemes = new Set<CurrentTheme>()

  get sheet() {
    return this.tag!.sheet! as CSSStyleSheet
  }

  getThemeVariables(theme: CompiledTheme) {
    let rules = ``
    for (const key in theme) {
      const val = theme[key]
      if (val && val.cssVariable) {
        if (val.getCSSColorVariables) {
          // allows for nicer handling of alpha changes
          const { rgb, rgba } = val.getCSSColorVariables()
          rules += `--${val.cssVariable}: ${rgba};`
          rules += `--${val.cssVariable}-rgb: ${rgb};`
        } else if (val.getCSSValue) {
          const next = val.getCSSValue()
          if (typeof next === 'string') {
            rules += `--${val.cssVariable}: ${next};`
          }
        }
      }
    }
    return rules
  }

  mount(themeContext: CurrentTheme) {
    const theme = themeContext.current

    if (this.mounted.has(theme)) {
      this.mounted.set(theme, this.mounted.get(theme)! + 1)
    } else {
      this.mounted.set(theme, 1)

      if (theme._isSubTheme) {
        this.mountSubTheme(themeContext)
        this.mountedSubThemes.add(themeContext)
        return
      }
      if (theme._isCoat) {
        return
      }

      const classNames = this.getClassNames(themeContext)
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
        this.mountedSubThemes.forEach(subTheme => {
          this.mountSubThemeFromParent(theme, subTheme)
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
    const selector = `.theme-${parent.name} .${this.getClassNames(subThemeContext)}`
    let subTheme = subThemeContext.current
    // need to re-run select using new parent theme
    if (subTheme._themeSubSelect) {
      subTheme = preProcessTheme(
        {
          coat: subTheme._coatName,
          themeSubSelect: subThemeContext.current._themeSubSelect,
        },
        parent,
      )
    }
    const subRules = this.getThemeVariables(subTheme)
    if (selector === '.theme-docsPageTheme .sub-listItem') {
      console.warn('how many times doing this?', subRules, subTheme, parent)
    }
    if (subRules.length) {
      const rule = `${selector} { ${subRules} }`
      this.sheet.insertRule(rule)
    }
  }

  unmount(_theme: CurrentTheme) {
    // noop for now, not a big memory use
    // would want to garbage collect too and maybe only remove if lots of others are added
    // this.mounted.set(theme, (this.mounted.get(theme) || 1) - 1)
  }

  getClassNames(themeContext: CurrentTheme) {
    const theme = themeContext.current
    const isOriginal = !theme._isCoat && !theme._isSubTheme
    if (isOriginal) {
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
}

// singletone
export const themeVariableManager = new ThemeVariableManager()
