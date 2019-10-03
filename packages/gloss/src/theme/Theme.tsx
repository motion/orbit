import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'

import { preProcessTheme } from '../helpers/preProcessTheme'
import { CompiledTheme } from './createTheme'
import { CurrentThemeContext, useProvideCurrentTheme } from './CurrentThemeContext'
import { AllThemesContext } from './ThemeContext'
import { ThemeVariableContext } from './ThemeVariableManager'

export type ThemeSelect = ((theme: CompiledTheme) => CompiledTheme) | string | false | undefined

type ThemeProps = {
  theme?: CompiledTheme
  themeSubSelect?: ThemeSelect
  coat?: string | false
  name?: string
  children: any
}

export const Theme = (props: ThemeProps) => {
  const { name, children } = props
  const nextName = (typeof name === 'string' && name) || ''
  const themes = useContext(AllThemesContext)
  const curContext = useContext(CurrentThemeContext)
  if (!name && !props.themeSubSelect && !props.coat && !props.theme) {
    return children
  }
  const next = themes[nextName] || preProcessTheme(props, curContext.current)
  return <ThemeProvideHelper theme={next}>{children}</ThemeProvideHelper>
}

function ThemeProvideHelper(props: { theme: CompiledTheme; children: any }) {
  const themeObservableContext = useProvideCurrentTheme(props)
  return (
    <ThemeVariableContext theme={props.theme}>
      <CurrentThemeContext.Provider value={themeObservableContext}>
        {props.children}
      </CurrentThemeContext.Provider>
    </ThemeVariableContext>
  )
}
