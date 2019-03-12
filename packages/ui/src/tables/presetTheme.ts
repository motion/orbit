import { colors } from '../helpers/colors'

export const presetTheme = {
  red: {
    color: colors.red,
    background: colors.redTint,
  },
  yellow: {
    color: colors.yellow,
    background: colors.yellowTint,
  },
  cyan: {
    color: colors.cyan,
    background: colors.cyanTint,
  },
  purple: {
    color: colors.purple,
    background: colors.purpleTint,
  },
  green: {
    color: colors.green,
    background: colors.greenTint,
  },
  orange: {
    color: colors.orange,
    background: colors.orangeTint15,
  },
  blue: {
    color: colors.blue,
    background: colors.blueTint15,
  },
  grey: {
    color: colors.grey,
    background: 'transparent',
  },
}

export const guessTheme = {
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
