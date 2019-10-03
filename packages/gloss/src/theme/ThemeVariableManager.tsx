import React, { useEffect, useLayoutEffect, useRef } from 'react'

import { makeStyleTag } from '../stylesheet/makeStyleTag'
import { CompiledTheme } from './createTheme'

class ThemeVariableManager {
  tag = makeStyleTag()
  mounted = new Map<CompiledTheme, number>()

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

  mount(theme: CompiledTheme) {
    if (this.mounted.has(theme)) {
      this.mounted.set(theme, this.mounted.get(theme) + 1)
    } else {
      this.mounted.set(theme, 1)

      if (theme._isSubTheme) {
        this.mountSubSelect(theme)
        return
      }

      const classNames = this.getClassNames(theme)
      const selector = `.${classNames.join(' .')}`
      const rules = this.getThemeVariables(theme)
      if (rules.length) {
        const rule = `${selector} { ${rules} }`
        this.sheet.insertRule(rule)
      }

      if (theme.coats) {
        for (const coatKey in theme.coats) {
          const coat = theme.coats[coatKey]
          const coatRules = this.getThemeVariables(coat)
          const rule = `${selector} .coat-${coatKey} { ${coatRules} }`
          this.sheet.insertRule(rule)
        }
      }
    }
  }

  mountSubSelect(subTheme: CompiledTheme) {
    for (const [theme] of this.mounted.entries()) {
      // if its a base level theme, add all subtheme rules
      if (!theme.parent) {
        const selector = `.theme-${theme.name} .sub-${subTheme.name}`
        const subRules = this.getThemeVariables(subTheme)
        if (subRules.length) {
          const rule = `${selector} { ${subRules} }`
          this.sheet.insertRule(rule)
        }
      }
    }
  }

  unmount(_theme: CompiledTheme) {
    // noop for now, not a big memory use
    // would want to garbage collect too and maybe only remove if lots of others are added
    // this.mounted.set(theme, (this.mounted.get(theme) || 1) - 1)
  }

  getClassNames(theme: CompiledTheme) {
    let res: string[] = []
    // ensure coat before subTheme, thats the more logical priority
    if (theme._coatName) {
      res.push(`coat-${theme._coatName}`)
    }
    if (theme._subThemeName) {
      res.push(`sub-${theme._subThemeName}`)
    }
    if (!theme._isCoat && !theme._isSubTheme) {
      res.push(`theme-${theme.name}`)
    }
    return res
  }
}

// singletone
const themeVariableManager = new ThemeVariableManager()

export function ThemeVariableContext({ theme, children }: { theme: CompiledTheme; children: any }) {
  const classNames = themeVariableManager.getClassNames(theme)

  useLayoutEffect(() => {
    themeVariableManager.mount(theme)
    return () => {
      themeVariableManager.unmount(theme)
    }
  }, [theme])

  if (!theme) {
    return children
  }

  let childrenFinal = children
  for (const className of classNames) {
    childrenFinal = (
      <div style={{ display: 'contents' }} className={className}>
        {childrenFinal}
      </div>
    )
  }
  return childrenFinal
}
