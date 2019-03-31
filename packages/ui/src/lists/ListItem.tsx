import {
  CSSPropertySet,
  gloss,
  Row,
  SimpleText,
  Theme,
  ThemeContext,
  ThemeObject,
  View,
  ViewProps,
} from '@o/gloss'
import { useReaction } from '@o/use-store'
import { differenceInCalendarDays } from 'date-fns'
import React from 'react'
import { BorderBottom } from '../Border'
import { RoundButtonSmall } from '../buttons/RoundButtonSmall'
import { memoIsEqualDeep } from '../helpers/memoHelpers'
import { Icon, IconProps } from '../Icon'
import { Space } from '../layout/Space'
import { Separator } from '../Separator'
import { DateFormat } from '../text/DateFormat'
import { HighlightText } from '../text/HighlightText'
import { Text } from '../text/Text'

export type ItemRenderText = (text: string) => JSX.Element
export type HandleSelection = (index: number, eventType: 'click' | 'key', event?: any) => any

export type ListItemHide = {
  hideTitle?: boolean
  hideIcon?: boolean
  hideSubtitle?: boolean
  hideBody?: boolean
  hideItemDate?: boolean
  hideDate?: boolean
  hideMeta?: boolean
}

export type ListItemDisplayProps = {
  oneLine?: boolean
  condensed?: boolean
}

export type ListItemProps = ViewProps &
  ListItemHide &
  ListItemDisplayProps & {
    subId?: string | number
    location?: React.ReactNode
    preview?: React.ReactNode
    title?: React.ReactNode
    subTextOpacity?: number
    small?: boolean
    above?: React.ReactNode
    activeStyle?: Record<string, any>
    before?: React.ReactNode
    chromeless?: boolean
    theme?: Partial<ThemeObject>
    listItem?: boolean
    subtitle?: React.ReactNode
    date?: Date
    icon?: any
    index?: number
    isExpanded?: boolean
    style?: any
    afterTitle?: React.ReactNode
    after?: React.ReactNode
    titleProps?: Record<string, any>
    iconBefore?: boolean
    iconProps?: Partial<IconProps>
    separatorProps?: Record<string, any>
    className?: string
    inGrid?: boolean
    pane?: string
    subPane?: string
    renderText?: ItemRenderText
    children?: React.ReactNode
    onClick?: Function
    // its helpful to have a separate disableSelect for various JS-object/intuitiveness reasons
    disableSelect?: boolean
    // single click / keyboard select
    onSelect?: HandleSelection
    // double click / keyboard enter
    onOpen?: HandleSelection
    borderRadius?: number
    nextUpStyle?: Record<string, any>
    isSelected?: boolean | ((index: number) => boolean)
    cardProps?: Record<string, any>
    disableShadow?: boolean
    padding?: number | number[]
    titleFlex?: number
    subtitleProps?: Record<string, any>
    getIndex?: (id: number) => number
    subspaceBetween?: React.ReactNode
    searchTerm?: string
    onClickLocation?: (index: number, e?: Event) => any
    separator?: React.ReactNode
    group?: string
  }

export const ListItem = memoIsEqualDeep(function ListItem(props: ListItemProps) {
  const {
    date,
    location,
    preview,
    icon,
    subtitle,
    title,
    borderRadius,
    cardProps,
    children,
    disableShadow,
    iconProps,
    onClick,
    titleProps,
    subtitleProps,
    padding,
    subspaceBetween,
    searchTerm,
    onClickLocation,
    renderText,
    separator,
    oneLine,
    isExpanded,
    before,
    separatorProps,
    above,
    small,
    iconBefore: iconBeforeProp,
    subTextOpacity = 0.6,
    after,
    width,
    height,
    ...restProps
  } = props
  const isSelected = useIsSelected(props)
  const showChildren = !props.hideBody
  const showSubtitle = !!subtitle && !props.hideSubtitle
  const showDate = !!date && !props.hideDate
  const showIcon = !!icon && !props.hideIcon
  const showTitle = !!title && !props.hideTitle
  const showPreview = !!preview && !children && !props.hideBody
  const showPreviewInSubtitle = !showTitle && oneLine
  const sizeLineHeight = small ? 0.8 : 1
  const defaultPadding = small ? [7, 9] : [8, 10]
  const iconBefore = iconBeforeProp || !showTitle
  const hasMouseDownEvent = !!restProps.onMouseDown

  // add a little vertical height for full height icons
  if (small && iconBefore) {
    defaultPadding[0] += 2
  }

  const iconElement = showIcon && getIcon(props)

  const childrenElement = showChildren && (
    <SimpleText size={0.9} alpha={subTextOpacity}>
      {children}
    </SimpleText>
  )
  const { activeThemeName } = React.useContext(ThemeContext)

  const afterHeaderElement = (
    <AfterHeader>
      <Row>
        {showDate && (
          <Text alpha={0.6} size={0.9} fontWeight={400}>
            <DateFormat date={date} nice={differenceInCalendarDays(Date.now(), date) < 7} />
          </Text>
        )}
      </Row>
    </AfterHeader>
  )

  const locationElement = !!location && (
    <>
      <RoundButtonSmall
        margin={[2, -1]}
        maxWidth={120}
        fontWeight={400}
        fontSize={13}
        alpha={subTextOpacity}
        onClick={onClickLocation || undefined}
        ellipse
      >
        {`${location}`}
      </RoundButtonSmall>
      <Space small={small} />
    </>
  )

  return (
    <Theme alternate={isSelected ? 'selected' : null}>
      {/* we keep chrome here because virtualizings wants to set an absolute width/height */}
      {/* but without a wrapper, we'd have two children nodes, only one receiving dimensions */}
      <ListItemChrome isMeasured={!!width} width={width} height={height}>
        {above}
        {!!separator && (
          <Theme name={activeThemeName}>
            <Separator paddingTop={props.index === 0 ? 8 : 16} {...separatorProps}>
              {separator}
            </Separator>
          </Theme>
        )}
        <ListItemContain isExpanded={isExpanded} {...restProps}>
          <ListItemContent
            isSelected={isSelected}
            borderRadius={borderRadius}
            onClick={(!hasMouseDownEvent && onClick) || undefined}
            disableShadow={disableShadow}
            padding={padding || defaultPadding}
            {...cardProps}
          >
            {before}
            {iconBefore && showIcon && iconElement}
            <ListItemMainContent oneLine={oneLine}>
              {showTitle && (
                <ListItemTitleBar flex={1}>
                  {showIcon && !iconBefore && iconElement}
                  <HighlightText
                    flex={1}
                    sizeLineHeight={0.85}
                    ellipse
                    fontWeight={400}
                    {...titleProps}
                  >
                    {title}
                  </HighlightText>
                  <Space small={small} />
                  {props.afterTitle}
                  {afterHeaderElement}
                </ListItemTitleBar>
              )}
              {showSubtitle && (
                <ListItemSubtitle>
                  {showIcon && !showTitle && (
                    <>
                      {iconElement}
                      <Space small={small} />
                    </>
                  )}
                  {!!location && locationElement}
                  {showPreviewInSubtitle ? (
                    <div style={{ flex: 1, overflow: 'hidden' }}>{childrenElement}</div>
                  ) : null}
                  {!!subtitle &&
                    (typeof subtitle === 'string' ? (
                      <HighlightText
                        alpha={subTextOpacity}
                        size={0.9}
                        sizeLineHeight={sizeLineHeight}
                        ellipse
                        {...subtitleProps}
                      >
                        {subtitle}
                      </HighlightText>
                    ) : (
                      subtitle
                    ))}
                  {!subtitle && (
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
              {showSubtitle && (!!children || !!preview) && (
                <div style={{ flex: 1, maxHeight: 4 }} />
              )}
              {showPreview && (
                <>
                  {locationElement}
                  <Preview>
                    {typeof preview !== 'string' && preview}
                    {typeof preview === 'string' && (
                      <HighlightText
                        alpha={subTextOpacity}
                        size={1}
                        sizeLineHeight={0.9}
                        ellipse={3}
                      >
                        {preview}
                      </HighlightText>
                    )}
                  </Preview>
                </>
              )}
              {!showPreviewInSubtitle && (
                <Row>
                  {locationElement}
                  {childrenElement}
                </Row>
              )}
            </ListItemMainContent>
            {after}
          </ListItemContent>
          <BorderBottom opacity={0.15} />
        </ListItemContain>
      </ListItemChrome>
    </Theme>
  )
})

const ListItemChrome = gloss({
  minHeight: 'min-contents',
  minWidth: 'min-contents',
  isMeasured: {
    minHeight: 'auto',
    minWidth: 'auto',
  },
}).theme(p => p)

const ListItemContain = gloss(View, {
  position: 'relative',
  userSelect: 'none',
  overflow: 'hidden',
  isExpanded: {
    userSelect: 'auto',
  },
}).theme(({ borderRadius }, theme) => {
  return {
    color: theme.color,
    background: theme.listItemBackground || theme.background,
    borderRadius: borderRadius || 0,
  }
})

const ListItemContent = gloss({
  flexFlow: 'row',
  position: 'relative',
  flex: 1,
  alignItems: 'center',
  chromeless: {
    background: 'transparent',
    padding: 8,
  },
}).theme(({ isSelected, padding, chromeless }, theme) => {
  let style: CSSPropertySet = {}
  if (chromeless) {
    return style
  }
  // LIST ITEM
  let listStyle
  // selected...
  if (isSelected) {
    listStyle = {
      background: theme.listItemBackground || theme.background.alpha(0.15),
    }
  } else {
    listStyle = {
      '&:hover': {
        background: theme.listItemBackgroundHover || theme.backgroundHover,
      },
    }
  }
  style = {
    ...style,
    ...listStyle,
    padding,
  }
  return style
})

const ListItemTitleBar = gloss({
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

function getIcon({ icon, iconBefore, small, iconProps }: ListItemProps) {
  let iconSize = (iconProps && iconProps.size) || (iconBefore ? (small ? 20 : 28) : small ? 12 : 14)
  const iconPropsFinal = {
    size: iconSize,
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
  return (
    // use a view to ensure consistent width
    // and add the space
    <View width={iconSize + (small ? 8 : 10)}>{element}</View>
  )
}

export function useIsSelected(props: Pick<ListItemProps, 'isSelected' | 'index'>) {
  return useReaction(() => {
    if (typeof props.isSelected === 'function') {
      return props.isSelected(props.index)
    }
    return !!props.isSelected
  }, [props.isSelected])
}
