import JSS from 'jss'
import aphrodite from 'aphrodite-jss'
import defaultPreset from 'jss-preset-default'

console.log(defaultPreset())
JSS.use(defaultPreset())

export const jss = JSS

export const { css, StyleSheet } = aphrodite(jss)
