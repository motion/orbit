/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

import { view } from '@mcro/black'
import { colors } from './helpers/colors'
import { Row } from './blocks/Row'
import { Col } from './blocks/Col'

export const Spacer = view(Col, {
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

export const Toolbar = view(Row, {
  flexShrink: 0,
  lineHeight: '32px',
  alignItems: 'center',
  padding: 6,
  width: '100%',
})

Toolbar.theme = ({
  height,
  borderTop,
  borderBottom,
  background,
  position,
  compact,
  theme,
}) => ({
  background: background || theme.base.background || colors.light02,
  borderBottom:
    borderBottom ||
    (position === 'bottom'
      ? 'none'
      : [1, theme.base.borderColor || colors.sectionHeaderBorder]),
  borderTop:
    borderTop ||
    (position === 'bottom'
      ? [1, theme.base.borderColor || colors.sectionHeaderBorder]
      : 'none'),
  height: height || (compact ? 28 : 42),
})
