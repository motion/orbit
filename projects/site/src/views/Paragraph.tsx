import { gloss } from '@o/gloss'
import { TextFitProps } from '@o/react-textfit'
import { Text, TextProps } from '@o/ui'
import * as React from 'react'
import { ViewPortText } from './ViewPortText'

export const Paragraph = gloss(Text, {
  fontFamily: 'Eesti Pro',
})

Paragraph.defaultProps = {
  tagName: 'p',
}

export const ViewportParagraph = ({
  min = 16,
  max,
  mode = 'multi',
  forceSingleModeWidth,
  throttle,
  onReady,
  autoResize,
  resizable,
  ...props
}: Partial<TextFitProps> & Partial<TextProps>) => (
  <ViewPortText
    min={min}
    max={max}
    mode={mode}
    forceSingleModeWidth={forceSingleModeWidth}
    throttle={throttle}
    onReady={onReady}
    autoResize={autoResize}
    resizable={resizable}
  >
    <Paragraph {...props} />
  </ViewPortText>
)
