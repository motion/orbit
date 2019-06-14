/* eslint-disable react/prop-types */
import React from 'react'
import { ThemeProvide } from 'gloss'
import { toColor } from '@o/color'

export default props => (
  <ThemeProvide themes={{ light: { background: toColor('red') } }} activeTheme="light">
    {props.children}
  </ThemeProvide>
)
