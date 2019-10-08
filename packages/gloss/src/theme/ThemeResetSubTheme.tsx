import { useContext, useLayoutEffect, useRef } from 'react'
import React from 'react'

import { CurrentThemeContext } from './Theme'
import { themeVariableManager } from './themeVariableManager'

export function ThemeResetSubTheme({ children }: { children: any }) {
  const themeContext = useContext(CurrentThemeContext)
  const nodeRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (themeContext.parentContext) {
      const getClassName = () => {
        if (themeContext.parentContext?.current) {
          return themeVariableManager.getClassNames(themeContext.parentContext!.current)
        }
        return ''
      }
      nodeRef.current!.className = getClassName()
      const unsub = themeContext.parentContext.subscribe(() => {
        nodeRef.current!.className = getClassName()
      })
      return unsub.unsubscribe
    }
  }, [])

  if (themeContext.parentContext) {
    return (
      <div ref={nodeRef} style={{ display: 'contents' }}>
        {children}
      </div>
    )
  }

  return children
}
