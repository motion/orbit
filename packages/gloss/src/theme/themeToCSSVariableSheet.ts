import { CompiledTheme, ThemeValue } from './createTheme'

export function themeToCSSVariableSheet(theme: CompiledTheme): string {
  let res = ''
  for (const key in theme) {
    if (theme[key] instanceof ThemeValue) {
      res += `--${key}: ${theme[key].get()}`
    }
  }
  return res
}
