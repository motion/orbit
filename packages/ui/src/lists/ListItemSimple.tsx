import { useReaction } from '@o/use-store'
import { isDefined, selectDefined } from '@o/utils'
import { differenceInCalendarDays } from 'date-fns'
import { Box, gloss, Theme, ThemeContext, useTheme } from 'gloss'
import React, { isValidElement } from 'react'

import { BorderBottom } from '../Border'
import { RoundButtonSmall } from '../buttons/RoundButtonSmall'
import { useFocus } from '../Focus'
import { memoIsEqualDeep } from '../helpers/memoHelpers'
import { Icon, IconProps } from '../Icon'
import { ListSeparator, ListSeparatorProps } from '../ListSeparator'
import { useScale } from '../Scale'
import { SizedSurface, SizedSurfaceProps } from '../SizedSurface'
import { Space } from '../Space'
import { DateFormat } from '../text/DateFormat'
import { HighlightText } from '../text/HighlightText'
import { SimpleText } from '../text/SimpleText'
import { Text, TextProps } from '../text/Text'
import { Col } from '../View/Col'
import { getPadding } from '../View/pad'
import { Row } from '../View/Row'
import { View } from '../View/View'

export type ItemRenderText = (text: string) => JSX.Element
export type HandleSelection = (index: number, event?: any) => any

export type ListItemHide = {
  hideTitle?: boolean
  hideIcon?: boolean
  hideSubtitle?: boolean
  hideBody?: boolean
  hideItemDate?: boolean
  hideDate?: boolean
  hideMeta?: boolean
  hideBorder?: boolean
}

export type ListItemSpecificProps = ListItemHide & {
  /** Condensed view for list items */
  oneLine?: boolean

  /** Disable/enable selection */
  selectable?: boolean

  /** Padding */
  padding?: number | number[]

  /** Adds extra indentation for tree-style view */
  indent?: number

  /** Attach a subId for index view selection, see AppViewProps */
  subId?: string | number

  /** Adds a button before the subtitle */
  location?: React.ReactNode

  /** Adds multi-line text below the Title and Subtitle */
  preview?: React.ReactNode

  /** Adds a title element */
  title?: React.ReactNode

  /** Override the opacity of the text elements below title */
  subTextOpacity?: number

  /** Adds an element vertically above list item */
  above?: React.ReactNode

  /** Adds an element horizontally before list item */
  before?: React.ReactNode

  /** Adds a SubTitle to item */
  subTitle?: React.ReactNode

  /** Adds a date with formatting after list item */
  date?: Date

  /** String or ReactNode to show icon on list item */
  icon?: any

  /** Internal: used for selection */
  index?: number

  /** Adds an element horizontally after title */
  afterTitle?: React.ReactNode

  /** Adds an element horizontally after list item */
  after?: React.ReactNode

  titleProps?: Partial<TextProps>

  /** Icons default to showing inline with the title, this forces them to show before the list item */
  iconBefore?: boolean

  /** Adds extra IconProps to icon elements */
  iconProps?: Partial<IconProps>

  separatorProps?: Partial<ListSeparatorProps>

  /** Add className */
  className?: string

  /** Custom function to parse text */
  renderText?: ItemRenderText

  /** Add custom children below list item */
  children?: React.ReactNode

  /** Disable selection */
  disableSelect?: boolean

  /** Disable filtering this item */
  disableFilter?: boolean

  /** Event used on selection */
  onSelect?: HandleSelection

  /** Event used on double-click or keyboard enter */
  onOpen?: HandleSelection

  /** Add border radius */
  borderRadius?: number

  /** Override selection conditional logic */
  isSelected?: boolean | ((index: number) => boolean)

  /** Whether to make the title push after elements */
  titleFlex?: number

  /** Add extra SubTitle props */
  subTitleProps?: Partial<TextProps>

  /** Event on clicking location element */
  onClickLocation?: (index: number, e?: Event) => any

  /** Text to show in prefixed separator */
  separator?: React.ReactNode

  /** For use with automatic separator generation, when using `<List />` */
  groupName?: string

  /** Allows double click on title to edit, calls onEdit when user hits "enter" or clicks away */
  editable?: boolean

  /** Called when `editable` and after editing a title */
  onEdit?: (nextTitle: string) => any

  /** Called when `editable` and cancelled editing a title */
  onCancelEdit?: (nextTitle: string) => any

  /** Called when `editable` and start editing a title */
  onStartEdit?: () => any
}

export type ListItemSimpleProps = SizedSurfaceProps & ListItemSpecificProps

// this wrapper required for virtualization to measure/style */}
// prevents hard re-renders on resize by taking out the style prop
export const ListItemSimple = React.forwardRef(
  ({ style, forwardRef, ...listProps }: ListItemSimpleProps, ref) => {
    return (
      <div style={style} ref={(forwardRef || ref) as any}>
        <ListItemInner {...listProps} />
      </div>
    )
  },
)

const ListItemInner = memoIsEqualDeep((props: ListItemSimpleProps) => {
  const {
    date,
    location,
    preview,
    icon,
    subTitle,
    title,
    borderRadius,
    children,
    onClick,
    titleProps,
    subTitleProps,
    padding,
    onClickLocation,
    separator,
    oneLine,
    before,
    separatorProps,
    above,
    iconBefore: iconBeforeProp,
    subTextOpacity = 0.6,
    after,
    indent = 0,
    alignItems,
    selectable,
    hideBorder,
    editable,
    onEdit,
    onStartEdit,
    onCancelEdit,
    ...surfaceProps
  } = props
  const theme = useTheme()
  const isFocused = useFocus()
  const isSelected = useIsSelected(props)
  const showChildren = !props.hideBody
  const showSubtitle = !!subTitle && !props.hideSubtitle
  const showDate = !!date && !props.hideDate
  const showIcon = !!icon && !props.hideIcon
  const showTitle = !!title && !props.hideTitle
  const showPreview = !!preview && !children && !props.hideBody
  const showPreviewInSubtitle = !showTitle && oneLine
  // 13 instead of 12px here fixed a very odd clipping bug
  const iconBefore = iconBeforeProp || !showTitle
  const hasMouseDownEvent = !!surfaceProps.onMouseDown
  const disablePsuedoProps = selectable === false && {
    hoverStyle: null,
    activeStyle: null,
  }

  const iconElement = showIcon && getIcon(props)
  const scale = useScale()
  const listItemAdjustedPadding = getListItemPadding({
    ...props,
    pad: selectDefined(surfaceProps.pad, 13),
  }).map(x => x * scale)
  const spaceSize = listItemAdjustedPadding[1]

  const hasChildren = showChildren && !!children
  const childrenElement = hasChildren && (
    <SimpleText margin={['auto', 0]} flex={1} size={0.9} alpha={subTextOpacity}>
      {children}
    </SimpleText>
  )

  const { activeThemeName } = React.useContext(ThemeContext)

  // TODO could let a prop control content
  const afterHeaderElement = showDate && (
    <AfterHeader>
      <Row>
        <Text alpha={0.6} size={0.9} fontWeight={400}>
          <DateFormat date={date} nice={differenceInCalendarDays(Date.now(), date) < 7} />
        </Text>
      </Row>
    </AfterHeader>
  )

  const locationElement = !!location && (
    <>
      <RoundButtonSmall
        margin={[2, 0]}
        maxWidth={120}
        alpha={subTextOpacity}
        onClick={onClickLocation || undefined}
        ellipse
      >
        {`${location}`}
      </RoundButtonSmall>
      <Space size={spaceSize} />
    </>
  )

  const hasAfterTitle = isDefined(props.afterTitle, afterHeaderElement)

  return (
    <Theme alt={isSelected ? (isFocused ? 'selected' : 'selectedInactive') : null}>
      {above}
      {/* unset the theme for the separator */}
      {!!separator && (
        <Theme name={activeThemeName}>
          <ListSeparator {...separatorProps}>{separator}</ListSeparator>
        </Theme>
      )}
      <SizedSurface
        flexDirection="row"
        alignItems="center"
        themeSelect="listItem"
        borderRadius={borderRadius}
        onClick={(!hasMouseDownEvent && onClick) || undefined}
        padding={listItemAdjustedPadding}
        paddingLeft={indent ? indent * 22 : undefined}
        width="100%"
        before={
          <>
            {before}
            {!!before && <Space size={spaceSize} />}
            {!hideBorder && <BorderBottom right={5} left={5} opacity={0.2} />}
          </>
        }
        spaceSize={spaceSize}
        icon={iconBefore && iconElement}
        noInnerElement={!iconElement}
        {...disablePsuedoProps}
        {...surfaceProps}
      >
        <ListItemMainContent oneLine={oneLine}>
          <Col flex={1}>
            {showTitle && (
              <ListItemTitleBar space={spaceSize} alignItems={alignItems}>
                {showIcon && !iconBefore && iconElement}
                {isValidElement(title) ? (
                  title
                ) : (
                  <HighlightText
                    autoselect
                    editable={editable}
                    onFinishEdit={onEdit}
                    onCancelEdit={onCancelEdit}
                    onStartEdit={onStartEdit}
                    flex={1}
                    ellipse
                    fontWeight={theme.fontWeight || 400}
                    {...titleProps}
                  >
                    {title}
                  </HighlightText>
                )}
              </ListItemTitleBar>
            )}
            {showSubtitle && (
              <>
                <Space size={spaceSize / 2} />
                <ListItemSubtitle>
                  {!!location && locationElement}
                  {!!subTitle &&
                    (typeof subTitle === 'string' ? (
                      <HighlightText alpha={subTextOpacity} size={0.9} ellipse {...subTitleProps}>
                        {subTitle}
                      </HighlightText>
                    ) : (
                      subTitle
                    ))}
                  {!subTitle && (
                    <>
                      <div style={{ display: 'flex', flex: showPreviewInSubtitle ? 0 : 1 }} />
                    </>
                  )}
                  {!showTitle && (
                    <>
                      <Space />
                      {afterHeaderElement}
                    </>
                  )}
                </ListItemSubtitle>
              </>
            )}
            {!showSubtitle && !showTitle && (
              <View
                position="absolute"
                right={Array.isArray(padding) ? padding[0] : padding}
                top={Array.isArray(padding) ? padding[1] : padding}
              >
                {afterHeaderElement}
              </View>
            )}
            {/* vertical space only if needed */}
            {showSubtitle && !!(children || showPreview) && (
              <div style={{ flex: 1, maxHeight: 4 }} />
            )}
            {showPreview && (
              <>
                {locationElement}
                <Preview>
                  {typeof preview !== 'string' && preview}
                  {typeof preview === 'string' && (
                    <HighlightText alpha={subTextOpacity} size={1} sizeLineHeight={0.9} ellipse={3}>
                      {preview}
                    </HighlightText>
                  )}
                </Preview>
              </>
            )}
            {childrenElement}
          </Col>
          {hasAfterTitle && (
            <>
              <Space size={spaceSize} />
              <Col space={spaceSize}>
                {props.afterTitle}
                {afterHeaderElement}
              </Col>
            </>
          )}
        </ListItemMainContent>
        {!!after && (
          <>
            <Space />
            {after}
          </>
        )}
      </SizedSurface>
    </Theme>
  )
})

// we scale padX more than padY, depending on height of list item
const getListItemPadding = (props: ListItemSimpleProps) => {
  const padding = getPadding(props)
  if (!padding) {
    return []
  }
  return [padding.paddingTop, padding.paddingRight, padding.paddingBottom, padding.paddingLeft]
}

const ListItemTitleBar = gloss(Row, {
  width: '100%',
  flex: 1,
  flexFlow: 'row',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  textAlign: 'left',
})

const Preview = gloss({
  flex: 1,
  zIndex: -1,
})

const ListItemSubtitle = gloss(View, {
  flexFlow: 'row',
  alignItems: 'center',
  flex: 1,
  overflow: 'hidden',
})

const AfterHeader = gloss(Box, {
  alignItems: 'flex-end',
  // why? for some reason this is really hard to align the text with the title,
  // check the visual date in list items to see if this helps align it in the row
  marginBottom: -4,
})

const ListItemMainContent = gloss<{ oneLine?: boolean }>(Box, {
  flex: 1,
  margin: ['auto', 0],
  flexFlow: 'row',
})

const getIconSize = props =>
  props.iconSize ||
  (props.iconProps && props.iconProps.size) ||
  (props.iconBefore ? (!(props.subTitle || props.children) ? 20 : 24) : 14)

function getIcon(props: ListItemSimpleProps) {
  const size = getIconSize(props)
  const iconPropsFinal = {
    size,
    ...props.iconProps,
  }
  if (!props.iconBefore) {
    iconPropsFinal['style'] = { transform: `translateY(${1}px)` }
  }
  let element = props.icon
  if (React.isValidElement(props.icon)) {
    const type = props.icon.type
    // @ts-ignore
    if (type.acceptsProps && type.acceptsProps.icon) {
      element = React.cloneElement(props.icon, iconPropsFinal)
    }
  } else {
    element = <Icon name={props.icon} {...iconPropsFinal} />
  }
  return element
}

export function useIsSelected(props: Pick<ListItemSimpleProps, 'isSelected' | 'index'>) {
  return useReaction(
    () => {
      if (typeof props.isSelected === 'function') {
        return props.isSelected(props.index)
      }
      return !!props.isSelected
    },
    opts,
    [props.isSelected],
  )
}

const opts = {
  name: 'useIsSelected',
}
