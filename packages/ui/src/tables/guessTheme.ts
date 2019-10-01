import { CompiledTheme } from 'gloss/src'

import { colors } from '../helpers/colors'

export const presetTheme = {
  red: theme => ({
    color: theme.colorsRed || colors.red,
    background: theme.redTint || colors.redTint,
  }),
  yellow: theme => ({
    color: theme.yellow || colors.yellow,
    background: theme.yellowTint || colors.yellowTint,
  }),
  cyan: theme => ({
    color: theme.cyan || colors.cyan,
    background: theme.cyanTint || colors.cyanTint,
  }),
  purple: theme => ({
    color: theme.purple || colors.purple,
    background: theme.purpleTint || colors.purpleTint,
  }),
  green: theme => ({
    color: theme.green || colors.green,
    background: theme.greenTint || colors.greenTint,
  }),
  orange: theme => ({
    color: theme.orange || colors.orange,
    background: theme.orangeTint || colors.orangeTint15,
  }),
  blue: theme => ({
    color: theme.blue || colors.blue,
    background: theme.blueTint || colors.blueTint15,
  }),
  grey: theme => ({
    color: theme.grey || colors.grey,
    background: 'transparent',
  }),
}

export const guesses = {
  fail: presetTheme.red,
  failure: presetTheme.red,
  fatal: presetTheme.red,
  error: presetTheme.red,
  warn: presetTheme.yellow,
  warning: presetTheme.yellow,
  alert: presetTheme.yellow,
  success: presetTheme.green,
  pass: presetTheme.green,
  valid: presetTheme.cyan,
  ok: presetTheme.cyan,
  debug: presetTheme.grey,
  verbose: presetTheme.grey,
}

export function guessTheme(name: string, theme: CompiledTheme) {
  return guesses[name] ? guesses[name](theme) : null
}
