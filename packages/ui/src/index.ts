import { Color } from '@o/color'
import { CreateThemeType } from 'gloss'

import { Size } from './Space'

// until next hotkeys patches types
module.hot && module.hot.accept()

if (typeof window !== 'undefined') {
  if (typeof CSS['px'] === 'undefined') {
    require('css-typed-om').default(window)
  }

  // TODO...
  window['__DEV__'] = window['__DEV__'] || process.env.NODE_ENV === 'development'
}

export * from './helpers/configureHotKeys'
export { allIcons } from './icons'

export * from '@o/color'
export * from '@o/utils'
export * from 'framer-motion'

export { AnimatePresence } from 'framer-motion'
export { animation } from './helpers/animation'
export { pluralize } from './helpers/pluralize'

// this is what your themes should extend
export type UITheme = {
  background: Color
  backgroundHover?: Color
  backgroundHighlight: Color
  backgroundHighlightHover?: Color
  backgroundStrong: Color
  backgroundStronger: Color
  backgroundStrongest: Color
  backgroundZebra: Color
  color: Color
  colorHover?: Color
  colorHighlight: Color
  colorLight: Color
  colorLighter: Color
  colorLightest: Color
  borderColor: Color
  borderColorLight: Color
  borderColorLighter: Color
  borderColorActive: Color
  overlayBackground: Color
  glintColor?: Color
  glintColorTop?: Color
  glintColorBottom?: Color
  backgroundSelection?: Color
  tableHeadBackground?: Color
  iconColor?: Color

  // sizing props
  size?: Size
  sizeRadius?: Size
  sizePadding?: Size
  sizeHeight?: Size
  sizeFont?: Size
  sizeLineHeight?: Size

  // values
  disableGlint?: boolean
}

declare module 'gloss' {
  interface ThemeType extends CreateThemeType<UITheme> {}
}

export * from './themes'

export {
  Absolute,
  Box,
  AbsoluteProps,
  Block,
  BlockProps,
  Contents,
  ContentsProps,
  FullScreen,
  FullScreenProps,
  gloss,
  GlossProps,
  Theme,
  useTheme,
  Inline,
  InlineBlock,
} from 'gloss'
export { arrayMove } from './helpers/arrayMove'
export { GlobalHotKeys, HotKeys, KeySequence } from './helpers/reactHotkeys'

export { configureUI, ConfigureUIProps, Config as UIConfig } from './helpers/configureUI'
export { Direction, SelectableStore } from './lists/SelectableStore'
export { SortOrder, TableFilter } from './tables/types'
export { View } from './View/View'

export { ViewProps } from './View/types'

export * from './Arrow'
export * from './Avatar'
export * from './Badge'
export * from './Banner'
export * from './Border'
export * from './Breadcrumbs'
export * from './buttons/Button'
export * from './buttons/ButtonPerson'
export * from './buttons/MenuButton'
export * from './buttons/RoundButton'
export * from './buttons/RoundButtonSmall'
export * from './Calendar'
export * from './Card'
export * from './CardSimple'
export * from './CardStack'
export * from './Center'
export * from './chrome/SearchableTopBar'
export * from './chrome/TopBar'
export * from './Circle'
export * from './Code'
export * from './Collapsable'
export * from './ContextMenu'
export * from './ContextMenuProvider'
export * from './data/DataInspector'
export * from './data/DataInspectorControlled'
export * from './DataValue'
export * from './DefinitionList'
export * from './Divider'
export * from './Dock'
export * from './DockStore'
export * from './Draggable'
export * from './effects/Glint'
export * from './effects/HoverGlow'
export * from './ErrorBoundary'
export * from './ErrorMessage'
export * from './FloatingCard'
export * from './FloatingView'
export * from './Flow'
export * from './Focus'
export * from './forms/CheckBox'
export * from './forms/Fieldset'
export * from './forms/Fieldsets'
export * from './forms/Form'
export * from './forms/FormField'
export * from './forms/guessColumns'
export * from './forms/Input'
export * from './forms/InputField'
export * from './forms/Label'
export * from './forms/normalizeRow'
export * from './forms/SearchInput'
export * from './forms/Select'
export * from './forms/TextArea'
export * from './forms/Toggle'
export * from './forms/ToggleField'
export * from './helpers/composeRefs'
export * from './helpers/createContextualProps'
export * from './helpers/debug'
export * from './helpers/Fetch'
export * from './helpers/filterCleanObject'
export * from './helpers/forwardRef'
export * from './helpers/fuzzyFilter'
export * from './helpers/getDataType'
export * from './helpers/getTarget'
export * from './helpers/isRightClick'
export * from './helpers/keycode'
export * from './helpers/memoHelpers'
export * from './helpers/memoizeWeak'
export * from './helpers/MergeContext'
export * from './helpers/normalizeItem'
export * from './helpers/offset'
export * from './helpers/pluralize'
export * from './helpers/portal'
export * from './helpers/preventDefault'
export * from './helpers/ScopeState'
export * from './Highlight'
export * from './hooks/useAsyncFn'
export * from './hooks/useBoundedNumberState'
export * from './hooks/useDebounce'
export * from './hooks/useDeepEqualState'
export * from './hooks/useScrollProgress'
export * from './hooks/useFetch'
export * from './hooks/useFilter'
export * from './hooks/useGet'
export * from './hooks/useIntersectionObserver'
export * from './hooks/useMedia'
export * from './hooks/useMutationObserver'
export * from './hooks/useNode'
export * from './hooks/useNodeSize'
export * from './hooks/useOnMount'
export * from './hooks/useOnUnmount'
export * from './hooks/useParentNodeSize'
export * from './hooks/usePosition'
export * from './hooks/useResizeObserver'
export * from './hooks/useThrottleFn'
export * from './hooks/useToggle'
export * from './hooks/useWindowSize'
export * from './Icon'
export * from './IconPropsContext'
export * from './IconLabeled'
export * from './IconShape'
export * from './Image'
export * from './Interactive'
export * from './Labeled'
export * from './layout/GridLayout'
export * from './layout/Layout'
export * from './layout/Masonry'
export * from './layout/MasonryLayout'
export * from './layout/Pane'
export * from './lists/List'
export * from './lists/ListItem'
export * from './lists/ListItemSimple'
export * from './lists/ListItemViewProps'
export * from './lists/VirtualList'
export * from './lists/VirtualListItem'
export * from './ListSeparator'
export * from './Menu'
export * from './modals/GalleryModal'
export * from './modals/MediaModal'
export * from './modals/Modal'
export * from './Orderable'
export * from './PassProps'
export * from './PersonRow'
export * from './Popover'
export * from './GlobalPopovers'
export * from './progress/Loading'
export * from './progress/Progress'
export * from './ProvideUI'
export * from './Scale'
export * from './Search'
export * from './Section'
export * from './SegmentedRow'
export * from './SelectableGrid'
export * from './SelectableSurface'
export * from './Separators'
export * from './Share'
export * from './Shortcut'
export * from './Sidebar'
export * from './SidebarLabel'
export * from './Slider'
export * from './SliderPane'
export * from './SortableGrid'
export * from './Space'
export * from './SpaceGroup'
export * from './Spinner'
export * from './StatusBar'
export * from './SubSection'
export * from './Surface'
export * from './SurfacePropsContext'
export * from './SuspenseWithBanner'
export * from './SVG'
export * from './Tab'
export * from './tables/createFilter'
export * from './tables/Filterable'
export * from './tables/ManagedTable'
export * from './tables/Table'
export * from './tables/TableHead'
export * from './tables/TableInput'
export * from './tables/TableRow'
export * from './Tabs'
export * from './Tag'
export * from './text/CenteredText'
export * from './text/DateFormat'
export * from './text/Message'
export * from './text/MonoSpaceText'
export * from './text/Paragraph'
export * from './text/SimpleText'
export * from './text/SubTitle'
export * from './text/Text'
export * from './text/TimeAgo'
export * from './text/Title'
export * from './TiltCard'
export * from './TitleRow'
export * from './Toolbar'
export * from './Tooltip'
export * from './Tree'
export * from './TreeList'
export * from './types'
export * from './View/Stack'
export * from './View/Grid'
export * from './Visibility'
export * from './forms/SimpleFormField'
export * from './Parallax'
export * from './ParallaxNS'
export * from './helpers/whenIdle'
export * from './hooks/useLazyRef'
export * from './Geometry'
export * from './lists/ListShortcuts'
export * from './InvertScale'
export * from './hooks/useMemoList'
export * from './lists/ListPropsContext'
export * from './View/ScrollableParentStore'
export { getSize, getTextSize, getSizeRelative } from './Sizes'
export * from './helpers/createUpdateableSpring'
export * from './helpers/elementOffset'
export * from './helpers/scrollTo'
export * from './forms/types'
export * from './forms/FormContext'
