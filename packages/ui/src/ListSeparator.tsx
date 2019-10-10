import { alphaColorTheme, gloss, ThemeSelect } from 'gloss'
import React, { memo } from 'react'

import { BorderBottom, BorderTop } from './Border'
import { useScale } from './Scale'
import { scaledTextSizeTheme } from './text/scaledTextSizeTheme'
import { SimpleText, SimpleTextProps } from './text/SimpleText'

export type ListSeparatorProps = SimpleTextProps & {
  subTheme?: ThemeSelect
  hideBorderTop?: boolean
  hideBorderBottom?: boolean
}

export const ListSeparator = memo((props: ListSeparatorProps) => {
  return (
    <ListSeparatorChrome>
      {!props.hideBorderTop && <BorderTop />}
      {!props.hideBorderBottom && <BorderBottom />}
      <ListSeparatorText {...props} />
    </ListSeparatorChrome>
  )
})

// @ts-ignore
ListSeparator.defaultProps = {
  activeStyle: false,
  hoverStyle: false,
  subTheme: 'separator',
  fontWeight: 400,
  size: 0.85,
  alpha: 0.6,
}

const ListSeparatorChrome = gloss({
  position: 'relative',
  overflow: 'hidden',
})

const ListSeparatorText = gloss<ListSeparatorProps>(SimpleText, {
  width: '100%',
}).theme(
  () => {
    const scale = useScale()
    return {
      padding: [scale * 5, scale * 8],
    }
  },
  scaledTextSizeTheme,
  alphaColorTheme,
)
