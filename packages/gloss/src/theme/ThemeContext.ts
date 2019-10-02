import * as React from 'react'

import { CompiledTheme } from './createTheme'

export type ThemeContextType = { [key: string]: CompiledTheme }
const themeContext: ThemeContextType = {}
export const ThemeContext = React.createContext(themeContext)
