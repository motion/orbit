import { gloss } from 'gloss'
import React from 'react'

import { Button } from './Button'

export const RoundButton = gloss(Button, {
  glint: false,
  sizeRadius: 3,
  sizePadding: 1.2,
  display: 'inline-flex',
})
