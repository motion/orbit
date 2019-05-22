import { gloss, selectThemeSubset, ThemeSelect, psuedoStyleTheme } from 'gloss'

import { SimpleText, SimpleTextProps } from './text/SimpleText'
import { useScale } from './Scale'

export type SeparatorProps = SimpleTextProps & { themeSelect?: ThemeSelect }

export const Separator = gloss<SeparatorProps>(SimpleText).theme((props, themeIn) => {
  const scale = useScale()
  const theme = selectThemeSubset(props.themeSelect, themeIn)
  const themeStyle = psuedoStyleTheme(props, theme)
  return {
    borderTop: [1, theme.borderColor],
    borderBottom: [1, theme.borderColor],
    padding: [scale * 4, scale * 8],
    ...themeStyle,
  }
})

Separator.defaultProps = {
  activeStyle: false,
  hoverStyle: false,
  themeSelect: 'separator',
  fontWeight: 400,
  size: 0.85,
  alpha: 0.8,
}
