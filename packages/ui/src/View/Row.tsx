import { Base } from 'gloss'
import React, { forwardRef } from 'react'

import { Col, ColProps } from './Col'

export type RowProps = ColProps

export const Row = forwardRef((props: RowProps, ref) => (
  <Col data-is="Row" ref={ref} flexDirection="row" {...props} />
))

// for gloss parents
// @ts-ignore
Row.ignoreAttrs = Base.ignoreAttrs

// @ts-ignore
Row.acceptsSpacing = true
