import { alphaColorTheme, gloss, psuedoStyleTheme, selectThemeSubset, ThemeSelect } from 'gloss'
import React from 'react'

import { BorderBottom, BorderTop } from './Border'
import { useScale } from './Scale'
import { scaledTextSizeTheme, SimpleText, SimpleTextProps } from './text/SimpleText'

export type ListSeparatorProps = SimpleTextProps & { themeSelect?: ThemeSelect }

export const ListSeparator = (props: ListSeparatorProps) => {
  return (
    <ListSeparatorChrome>
      <BorderTop />
      <BorderBottom />
      <ListSeparatorText {...props} />
    </ListSeparatorChrome>
  )
}

const ListSeparatorChrome = gloss({
  position: 'relative',
  overflow: 'hidden',
})

const ListSeparatorText = gloss<ListSeparatorProps>(SimpleText, {
  width: '100%',
}).theme(
  (props, themeIn) => {
    const scale = useScale()
    const theme = selectThemeSubset(props.themeSelect, themeIn)
    const themeStyle = psuedoStyleTheme(props, theme)
    return {
      padding: [scale * 5, scale * 8],
      ...themeStyle,
    }
  },
  scaledTextSizeTheme,
  alphaColorTheme,
)

ListSeparator.defaultProps = {
  activeStyle: false,
  hoverStyle: false,
  themeSelect: 'separator',
  fontWeight: 400,
  size: 0.85,
  alpha: 0.6,
}
