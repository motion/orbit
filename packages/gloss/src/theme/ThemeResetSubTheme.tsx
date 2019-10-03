import { useContext, useLayoutEffect, useRef } from 'react'
import React from 'react'

import { CurrentThemeContext } from './Theme'
import { themeVariableManager } from './themeVariableManager'

export function ThemeResetSubTheme({ children }: { children: any }) {
  const themeContext = useContext(CurrentThemeContext)
  const nodeRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (themeContext.parentContext) {
      const getClassName = () =>
        themeVariableManager.getClassNames(themeContext.parentContext!.current).join(' ')
      nodeRef.current!.className = getClassName()
      themeContext.parentContext.subscribe(() => {
        nodeRef.current!.className = getClassName()
      })
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
