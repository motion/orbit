import {
  CSSPropertySet,
  gloss,
  Row,
  SimpleText,
  Theme,
  ThemeContext,
  ThemeObject,
  View,
  ViewPropsStrict,
} from '@o/gloss'
import { useStore } from '@o/use-store'
import { differenceInCalendarDays } from 'date-fns/esm/fp'
import React from 'react'
import { BorderBottom } from '../Border'
import { RoundButtonSmall } from '../buttons/RoundButtonSmall'
import { memoIsEqualDeep } from '../helpers/memoHelpers'
import { ConfiguredIcon } from '../Icon'
import { Space } from '../layout/Space'
import { Separator } from '../Separator'
import { DateFormat } from '../text/DateFormat'
import { HighlightText } from '../text/HighlightText'
import { Text } from '../text/Text'
import { ListItemStore } from './ListItemStore'

export type ItemRenderText = ((text: string) => JSX.Element)
export type HandleSelection = ((
  index: number,
  eventType: 'click' | 'key',
  element?: HTMLElement,
) => any)

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

export type ListItemProps = ViewPropsStrict &
  ListItemHide &
  ListItemDisplayProps & {
    subId?: string | number
    location?: React.ReactNode
    preview?: React.ReactNode
    title?: React.ReactNode
    subTextOpacity?: number
    slim?: boolean
    above?: React.ReactNode
    activeStyle?: Object
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
    titleProps?: Object
    iconBefore?: boolean
    iconProps?: Object
    separatorProps?: Object
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
    nextUpStyle?: Object
    isSelected?: boolean | ((index: number) => boolean)
    cardProps?: Object
    disableShadow?: boolean
    padding?: number | number[]
    titleFlex?: number
    subtitleProps?: Object
    getIndex?: ((id: number) => number)
    subtitleSpaceBetween?: React.ReactNode
    searchTerm?: string
    onClickLocation?: (index: number, e?: Event) => any
    separator?: React.ReactNode
    group?: string
  }

function getIcon({ icon, iconBefore, slim, iconProps }: ListItemProps) {
  let iconSize = iconBefore ? (slim ? 20 : 28) : slim ? 12 : 14
  const iconPropsFinal = {
    size: iconSize,
    ...iconProps,
  }
  if (!iconBefore) {
    iconPropsFinal['style'] = { transform: `translateY(${slim ? 4 : 3}px)` }
  }
  let element = icon
  if (React.isValidElement(icon)) {
    if (icon.type['acceptsIconProps']) {
      element = React.cloneElement(icon, iconPropsFinal)
    }
  } else {
    element = <ConfiguredIcon name={icon} {...iconPropsFinal} />
  }
  return (
    // use a view to ensure consistent width
    // and add the titlespace
    <View width={iconSize + (slim ? 8 : 10)}>{element}</View>
  )
}

export const ListItem = memoIsEqualDeep(function ListItem(props: ListItemProps) {
  const store = useStore(ListItemStore, props)
  const { isSelected } = store
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
    subtitleSpaceBetween,
    searchTerm,
    onClickLocation,
    renderText,
    separator,
    oneLine,
    isExpanded,
    before,
    separatorProps,
    above,
    slim,
    iconBefore: iconBeforeProp,
    subTextOpacity = 0.6,
    after,
    ...restProps
  } = props
  const showChildren = !props.hideBody
  const showSubtitle = !!subtitle && !props.hideSubtitle
  const showDate = !!date && !props.hideDate
  const showIcon = !!icon && !props.hideIcon
  const showTitle = !!title && !props.hideTitle
  const showPreview = !!preview && !children && !props.hideBody
  const showPreviewInSubtitle = !showTitle && oneLine
  const sizeLineHeight = slim ? 0.8 : 1
  const defaultPadding = slim ? [7, 9] : [8, 10]
  const iconBefore = iconBeforeProp || !showTitle

  // add a little vertical height for full height icons
  if (slim && iconBefore) {
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
            <DateFormat date={date} nice={differenceInCalendarDays(Date.now, date) < 7} />
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
        onClick={store.handleClickLocation}
        ellipse
      >
        {`${location}`}
      </RoundButtonSmall>
      <TitleSpace slim={slim} />
    </>
  )

  return (
    <Theme select={isSelected ? theme => theme.selected : null}>
      <>
        {above}
        {!!separator && (
          <Theme name={activeThemeName}>
            <Separator {...separatorProps}>
              <Text size={0.9} fontWeight={400}>
                {separator}
              </Text>
            </Separator>
          </Theme>
        )}
      </>
      <ListFrame isExpanded={isExpanded} ref={store.setCardWrapRef} {...restProps}>
        <ListItemChrome
          isSelected={isSelected}
          borderRadius={borderRadius}
          onClick={store.handleClick}
          disableShadow={disableShadow}
          padding={padding || defaultPadding}
          {...cardProps}
        >
          {before}
          {iconBefore && showIcon && iconElement}
          <ListItemMainContent oneLine={oneLine}>
            {showTitle && (
              <Title>
                {showIcon && !iconBefore && iconElement}
                <HighlightText sizeLineHeight={0.85} ellipse fontWeight={400} {...titleProps}>
                  {title}
                </HighlightText>
                <TitleSpace slim={slim} />
                {props.afterTitle}
                {afterHeaderElement}
              </Title>
            )}
            {showSubtitle && (
              <ListItemSubtitle>
                {showIcon && !showTitle && (
                  <>
                    {iconElement}
                    <TitleSpace slim={slim} />
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
            {showSubtitle && (!!children || !!preview) && <div style={{ flex: 1, maxHeight: 4 }} />}
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
            {!showPreviewInSubtitle && (
              <Row>
                {locationElement}
                {childrenElement}
              </Row>
            )}
          </ListItemMainContent>
          {after}
        </ListItemChrome>
        <BorderBottom opacity={0.15} />
      </ListFrame>
    </Theme>
  )
})

const ListFrame = gloss(View, {
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

const ListItemChrome = gloss({
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

const Title = gloss({
  width: '100%',
  flexFlow: 'row',
  // justifyContent: 'space-between',
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

const TitleSpace = gloss({
  minWidth: 10,
  shouldFlex: {
    flex: 1,
  },
  slim: {
    minWidth: 8,
  },
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
