import { gloss, psuedoStyleTheme, selectThemeSubset, ThemeSelect } from 'gloss'

import { useScale } from './Scale'
import { SimpleText, SimpleTextProps } from './text/SimpleText'

export type ListSeparatorProps = SimpleTextProps & { themeSelect?: ThemeSelect }

export const ListSeparator = gloss<ListSeparatorProps>(SimpleText).theme((props, themeIn) => {
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

ListSeparator.defaultProps = {
  activeStyle: false,
  hoverStyle: false,
  themeSelect: 'separator',
  fontWeight: 400,
  size: 0.85,
  alpha: 0.8,
}
