import { colorTheme, gloss, psuedoStyleTheme, selectThemeSubset, ThemeSelect } from 'gloss'
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

const ListSeparatorChrome = gloss({
  position: 'relative',
  overflow: 'hidden',
})

const ListSeparatorText = gloss<ListSeparatorProps>(SimpleText, {
  width: '100%',
}).theme(
  (props, themeIn) => {
    const scale = useScale()
    const theme = selectThemeSubset(props.subTheme, themeIn)
    const themeStyle = psuedoStyleTheme(props, theme)
    return {
      padding: [scale * 5, scale * 8],
      ...themeStyle,
    }
  },
  scaledTextSizeTheme,
  colorTheme,
)

ListSeparator['defaultProps'] = {
  activeStyle: false,
  hoverStyle: false,
  subTheme: 'separator',
  fontWeight: 400,
  size: 0.85,
  alpha: 0.6,
}
