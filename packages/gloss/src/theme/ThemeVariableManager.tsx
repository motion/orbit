import React, { useEffect } from 'react'

import { makeStyleTag } from '../stylesheet/makeStyleTag'
import { CompiledTheme } from './createTheme'

class ThemeVariableManager {
  tag = makeStyleTag()
  mounted = new Map()

  get sheet() {
    return this.tag!.sheet! as CSSStyleSheet
  }

  mount(theme: CompiledTheme) {
    if (this.mounted.has(theme)) {
      this.mounted.set(theme, this.mounted.get(theme) + 1)
    } else {
      this.mounted.set(theme, 1)
      const className = this.getClassName(theme)
      let rules = ``
      for (const key in theme) {
        const val = theme[key]
        if (val && val.cssVariable && val.getCSSValue) {
          const next = val.getCSSValue()
          if (typeof next === 'string') {
            rules += `--${val.cssVariable}: ${next};`
          }
        }
      }
      if (rules.length) {
        const rule = `.${className} { ${rules} }`
        this.sheet.insertRule(rule)
      }
    }
  }

  unmount(theme: CompiledTheme) {
    this.mounted.set(theme, (this.mounted.get(theme) || 1) - 1)
    // noop for now, not a big memory use
  }

  getClassName(theme: CompiledTheme) {
    return `theme-context-${theme.name}`
  }
}

// singletone
const themeVariableManager = new ThemeVariableManager()

export function ThemeVariableContext({ theme, children }: { theme: CompiledTheme; children: any }) {
  const className = themeVariableManager.getClassName(theme)

  useEffect(() => {
    themeVariableManager.mount(theme)
    return () => {
      themeVariableManager.unmount(theme)
    }
  }, [theme])

  if (!theme) {
    return children
  }

  return (
    <div style={{ display: 'contents' }} className={className}>
      {children}
    </div>
  )
}
