import { gloss, Theme, ThemeContext } from '@o/gloss'
import { useReaction } from '@o/use-store'
import { selectDefined } from '@o/utils'
import { differenceInCalendarDays } from 'date-fns'
import React from 'react'

import { BorderBottom } from '../Border'
import { RoundButtonSmall } from '../buttons/RoundButtonSmall'
import { memoIsEqualDeep } from '../helpers/memoHelpers'
import { Icon, IconProps } from '../Icon'
import { Separator, SeparatorProps } from '../Separator'
import { SizedSurface, SizedSurfaceProps } from '../SizedSurface'
import { Space } from '../Space'
import { DateFormat } from '../text/DateFormat'
import { HighlightText } from '../text/HighlightText'
import { SimpleText } from '../text/SimpleText'
import { Text, TextProps } from '../text/Text'
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

  /** Attach a subId for index view selection, see AppProps */
  subId?: string | number

  /** Adds a button before the subtitle */
  location?: React.ReactNode

  /** Adds multi-line text below the Title and Subtitle */
  preview?: React.ReactNode

  /** Adds a title element */
  title?: React.ReactNode

  /** Override the opacity of the text elements below title */
  subTextOpacity?: number

  /** Display a more condensed list item */
  small?: boolean

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

  separatorProps?: Partial<SeparatorProps>

  /** Add className */
  className?: string

  /** Custom function to parse text */
  renderText?: ItemRenderText

  /** Add custom children below list item */
  children?: React.ReactNode

  /** Disable selection */
  disableSelect?: boolean

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
    small,
    iconBefore: iconBeforeProp,
    subTextOpacity = 0.6,
    after,
    indent = 0,
    alignItems,
    selectable,
    hideBorder,
    ...surfaceProps
  } = props
  const isSelected = useIsSelected(props)
  const showChildren = !props.hideBody
  const showSubtitle = !!subTitle && !props.hideSubtitle
  const showDate = !!date && !props.hideDate
  const showIcon = !!icon && !props.hideIcon
  const showTitle = !!title && !props.hideTitle
  const showPreview = !!preview && !children && !props.hideBody
  const showPreviewInSubtitle = !showTitle && oneLine
  const sizeLineHeight = small ? 0.8 : 1
  let defaultPad = small ? 'xs' : 'sm'
  const iconBefore = iconBeforeProp || !showTitle
  const hasMouseDownEvent = !!surfaceProps.onMouseDown
  const disablePsuedoProps = selectable === false && {
    hoverStyle: null,
    activeStyle: null,
  }

  // add a little vertical height for full height icons
  if (small && iconBefore) {
    defaultPad = 'sm'
  }

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
      <Space size="sm" />
    </>
  )

  const iconElement = showIcon && getIcon(props)

  return (
    <Theme alt={isSelected ? 'selected' : null}>
      {above}
      {!!separator && (
        <Theme name={activeThemeName}>
          <Separator paddingTop={16} {...separatorProps}>
            {separator}
          </Separator>
        </Theme>
      )}
      <SizedSurface
        flexFlow="row"
        alignItems="center"
        themeSelect="listItem"
        borderRadius={borderRadius}
        onClick={(!hasMouseDownEvent && onClick) || undefined}
        padding={padding}
        pad={selectDefined(surfaceProps.pad, defaultPad)}
        paddingLeft={indent ? indent * 22 : undefined}
        width="100%"
        before={before}
        icon={iconBefore && iconElement}
        noInnerElement={!iconElement}
        after={!hideBorder && <BorderBottom right={5} left={5} opacity={0.2} />}
        {...disablePsuedoProps}
        {...surfaceProps}
      >
        <ListItemMainContent oneLine={oneLine}>
          {showTitle && (
            <ListItemTitleBar alignItems={alignItems}>
              {showIcon && !iconBefore && (
                <>
                  {iconElement}
                  <Space size="sm" />
                </>
              )}
              <HighlightText flex={1} ellipse fontWeight={400} {...titleProps}>
                {title}
              </HighlightText>
              <Space />
              {props.afterTitle}
              {afterHeaderElement}
            </ListItemTitleBar>
          )}
          {showSubtitle && (
            <ListItemSubtitle>
              {!!location && locationElement}
              {!!subTitle &&
                (typeof subTitle === 'string' ? (
                  <HighlightText
                    alpha={subTextOpacity}
                    size={0.9}
                    sizeLineHeight={sizeLineHeight}
                    ellipse
                    {...subTitleProps}
                  >
                    {subTitle}
                  </HighlightText>
                ) : (
                  subTitle
                ))}
              {!subTitle && (
                <>
                  <div style={{ flex: showPreviewInSubtitle ? 0 : 1 }} />
                </>
              )}
              {!showTitle && (
                <>
                  <Space />
                  {afterHeaderElement}
                </>
              )}
            </ListItemSubtitle>
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
          {showSubtitle && !!(children || showPreview) && <div style={{ flex: 1, maxHeight: 4 }} />}
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
        </ListItemMainContent>
        {after}
      </SizedSurface>
    </Theme>
  )
})

const ListItemTitleBar = gloss(View, {
  width: '100%',
  flex: 1,
  flexFlow: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
})

const Preview = gloss({
  flex: 1,
  zIndex: -1,
})

const ListItemSubtitle = gloss(View, {
  flexFlow: 'row',
  alignItems: 'center',
  flex: 1,
  overflowX: 'hidden',
})

const AfterHeader = gloss({
  alignItems: 'flex-end',
  // why? for some reason this is really hard to align the text with the title,
  // check the visual date in list items to see if this helps align it in the row
  marginBottom: -4,
})

const ListItemMainContent = gloss({
  flex: 1,
  maxWidth: '100%',
  margin: ['auto', 0],
  oneLine: {
    flexFlow: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
})

function getIcon({
  icon,
  iconBefore,
  small,
  subTitle,
  iconProps,
  iconSize,
  children,
}: ListItemSimpleProps) {
  let size =
    iconSize ||
    (iconProps && iconProps.size) ||
    (iconBefore ? (small || !(subTitle || children) ? 20 : 26) : small ? 12 : 14)
  const iconPropsFinal = {
    size: size,
    ...iconProps,
  }
  if (!iconBefore) {
    iconPropsFinal['style'] = { transform: `translateY(${small ? 4 : 3}px)` }
  }
  let element = icon
  if (React.isValidElement(icon)) {
    if (icon.type['acceptsIconProps']) {
      element = React.cloneElement(icon, iconPropsFinal)
    }
  } else {
    element = <Icon name={icon} {...iconPropsFinal} />
  }
  return element
}

export function useIsSelected(props: Pick<ListItemSimpleProps, 'isSelected' | 'index'>) {
  return useReaction(() => {
    if (typeof props.isSelected === 'function') {
      return props.isSelected(props.index)
    }
    return !!props.isSelected
  }, [props.isSelected])
}
