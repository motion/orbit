/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

import { Col, gloss, Row } from '@mcro/gloss'
import { colors } from './helpers/colors'

export const Spacer = gloss(Col, {
  flexGrow: 1,
})

/**
 * A toolbar.
 */
// : React.Component<{
//   /**
//    * Position of the toolbar. Dictates the location of the border.
//    */
//   position?: 'top' | 'bottom'
//   compact?: boolean
// }>

export const Toolbar = gloss(Row, {
  flexShrink: 0,
  lineHeight: '32px',
  alignItems: 'center',
  padding: 6,
  width: '100%',
}).theme(({ height, borderTop, borderBottom, background, position, compact }, theme) => ({
  background: background || theme.backgroundAlternate || theme.background,
  borderBottom:
    borderBottom ||
    (position === 'bottom' ? 'none' : [1, theme.borderColor || colors.sectionHeaderBorder]),
  borderTop:
    borderTop ||
    (position === 'bottom' ? [1, theme.borderColor || colors.sectionHeaderBorder] : 'none'),
  height: height || (compact ? 28 : 42),
}))
