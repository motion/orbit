import React, { useEffect, useRef } from 'react'

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
      if (rules.length) {
        const rule = `.${className} { ${rules} }`
        this.sheet.insertRule(rule)
      }
    }
  }

  unmount(_theme: CompiledTheme) {
    // noop for now, not a big memory use
    // would want to garbage collect too and maybe only remove if lots of others are added
    // this.mounted.set(theme, (this.mounted.get(theme) || 1) - 1)
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

  const ref = useRef(null)
  console.log('ref', ref, className, theme)

  if (!theme) {
    return children
  }

  return (
    <div ref={ref} style={{ display: 'contents' }} className={className}>
      {children}
    </div>
  )
}
