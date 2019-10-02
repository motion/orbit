import * as React from 'react'

import { CompiledTheme } from './createTheme'

export type AllThemes = { [key: string]: CompiledTheme }
export const AllThemesContext = React.createContext<AllThemes>({})
