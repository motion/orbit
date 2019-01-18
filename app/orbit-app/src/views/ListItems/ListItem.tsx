import { CSSPropertySetStrict } from '@mcro/css'
import { CSSPropertySet, gloss, ThemeObject } from '@mcro/gloss'
import * as UI from '@mcro/ui'
import { Row, Text, View } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import { differenceInCalendarDays } from 'date-fns/esm/fp'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { HorizontalSpace } from '..'
import PeopleRow from '../../components/PeopleRow'
import { NormalItem } from '../../helpers/normalizeItem'
import { DateFormat } from '../DateFormat'
import { HighlightText } from '../HighlightText'
import { Icon } from '../Icon'
import { RoundButtonSmall } from '../RoundButtonSmall'
import { Separator } from '../Separator'
import { ListItemStore } from './ListItemStore'

export type ItemRenderText = ((text: string) => JSX.Element)
export type HandleSelection = ((
  index: number,
  eventType: 'click' | 'key',
  element?: HTMLElement,
) => any)

export type ListItemHide = {
  hidePeople?: boolean
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

export type ListItemProps = CSSPropertySetStrict &
  Partial<NormalItem> &
  ListItemHide &
  ListItemDisplayProps & {
    activeStyle?: Object
    before?: React.ReactNode
    chromeless?: boolean
    theme?: Partial<ThemeObject>
    listItem?: boolean
    subtitle?: React.ReactNode
    date?: React.ReactNode
    icon?: React.ReactNode
    index?: number
    isExpanded?: boolean
    style?: any
    afterTitle?: React.ReactNode
    after?: React.ReactNode
    titleProps?: Object
    iconProps?: Object
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
    getIndex?: (id: T) => number
    subtitleSpaceBetween?: React.ReactNode
    searchTerm?: string
    onClickLocation?: (index: number, e?: Event) => any
    separator?: React.ReactNode
    group?: string
  }

export default observer(function ListItem(props: ListItemProps) {
  const store = useStore(ListItemStore, props)
  const {
    createdAt,
    icon,
    location,
    people,
    preview,
    subtitle,
    title,
    integration,
    updatedAt,
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
    ...restProps
  } = props
  const { isSelected } = store
  const showChildren = !props.hideBody
  const showSubtitle = (!!subtitle || !!location) && !props.hideSubtitle
  const showDate = !!createdAt && !props.hideDate
  const showIcon = !!icon && !props.hideIcon
  const showTitle = !props.hideTitle
  const showPeople = !!(!props.hidePeople && people && people.length && people[0].data['profile'])
  const showPreview = !!preview && !children && !props.hideBody
  const showPreviewInSubtitle = !showTitle && oneLine
  const renderedChildren = showChildren && children
  const { activeThemeName } = React.useContext(UI.ThemeContext)

  const afterHeader = (
    <AfterHeader>
      <Row>
        {showDate && (
          <UI.Text alpha={0.6} size={0.9} fontWeight={600}>
            <DateFormat
              date={new Date(updatedAt)}
              nice={differenceInCalendarDays(Date.now, updatedAt) < 7}
            />
          </UI.Text>
        )}
      </Row>
    </AfterHeader>
  )

  const peopleNode = !!people && (
    <>
      <HorizontalSpace />
      <PeopleRow people={people} />
    </>
  )

  return (
    <UI.Theme name={isSelected ? 'selected' : null}>
      <>
        {!!separator && (
          <UI.Theme name={activeThemeName}>
            <Separator>
              <Text size={0.9} fontWeight={500}>
                {separator}
              </Text>
            </Separator>
          </UI.Theme>
        )}
      </>
      <ListFrame isExpanded={isExpanded} forwardRef={store.setCardWrapRef} {...restProps}>
        <ListItemChrome
          isSelected={isSelected}
          borderRadius={borderRadius}
          onClick={store.handleClick}
          disableShadow={disableShadow}
          padding={padding || [9, 11]}
          {...cardProps}
        >
          <div style={{ flexDirection: 'row', width: '100%' }}>
            {before}
            <ListItemMainContent oneLine={oneLine}>
              {showTitle && (
                <Title>
                  {showIcon && (
                    <>
                      <Icon name={icon} size={16} style={{ marginTop: 1 }} {...iconProps} />
                      <TitleSpace />
                    </>
                  )}
                  <HighlightText sizeLineHeight={0.85} ellipse fontWeight={600} {...titleProps}>
                    {title}
                  </HighlightText>
                  <TitleSpace />
                  {props.afterTitle}
                  {afterHeader}
                </Title>
              )}
              {showSubtitle && (
                <ListItemSubtitle margin={showTitle ? [3, 0, 0] : 0}>
                  {showIcon && !showTitle && (
                    <>
                      <Icon icon={icon} size={14} {...iconProps} />
                      <TitleSpace />
                    </>
                  )}
                  {!!location && (
                    <>
                      <RoundButtonSmall
                        margin={-3}
                        maxWidth={120}
                        fontWeight={400}
                        fontSize={13}
                        alpha={0.8}
                        onClick={store.handleClickLocation}
                      >
                        {location}
                      </RoundButtonSmall>
                      <TitleSpace />
                    </>
                  )}
                  {showPreviewInSubtitle ? (
                    <div style={{ flex: 1, overflow: 'hidden' }}>{renderedChildren}</div>
                  ) : null}
                  {!!subtitle &&
                    (typeof subtitle === 'string' ? (
                      <UI.Text alpha={0.8} ellipse {...subtitleProps}>
                        {subtitle}
                      </UI.Text>
                    ) : (
                      subtitle
                    ))}
                  {!subtitle && (
                    <>
                      <div style={{ flex: showPreviewInSubtitle ? 0 : 1 }} />
                      {peopleNode}
                    </>
                  )}
                  {!showTitle && (
                    <>
                      {!!subtitle && peopleNode}
                      <HorizontalSpace />
                      {afterHeader}
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
                  {afterHeader}
                </View>
              )}
              {/* vertical space only if needed */}
              {showSubtitle && (!!children || !!preview) && (
                <div style={{ flex: 1, maxHeight: 4 }} />
              )}
              {showPreview && (
                <Preview>
                  {typeof preview !== 'string' && preview}
                  {typeof preview === 'string' && (
                    <HighlightText alpha={0.8} size={1.1} sizeLineHeight={0.9} ellipse={5}>
                      {preview}
                    </HighlightText>
                  )}
                </Preview>
              )}
              {showPreviewInSubtitle ? null : renderedChildren}
              {showPeople && !showSubtitle && (
                <Bottom>
                  <PeopleRow people={people} />
                </Bottom>
              )}
            </ListItemMainContent>
            {props.after}
          </div>
        </ListItemChrome>
        <Divider />
      </ListFrame>
    </UI.Theme>
  )
})

const ListFrame = gloss(UI.View, {
  position: 'relative',
  userSelect: 'none',
  isExpanded: {
    userSelect: 'auto',
  },
  transform: {
    z: 0,
  },
}).theme(({ borderRadius }, theme) => {
  return {
    color: theme.color,
    background: theme.listItemBackground || theme.background.alpha(0.5),
    borderRadius: borderRadius || 0,
  }
})

const Divider = gloss({
  height: 1,
  position: 'absolute',
  bottom: 0,
  left: 10,
  right: 10,
}).theme((_, theme) => ({
  background: theme.borderColor.alpha(0.1),
}))

const ListItemChrome = gloss({
  overflow: 'hidden',
  position: 'relative',
  maxHeight: '100%',
  flex: 1,
  transform: {
    z: 0,
  },
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
      background: theme.listItemBackgroundSelected || theme.background.alpha(0.25),
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
    '&:active': {
      opacity: isSelected ? 1 : 0.8,
    },
  }
  return style
})

const Title = gloss({
  width: '100%',
  flexFlow: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
})

const Preview = gloss({
  flex: 1,
  zIndex: -1,
})

const ListItemSubtitle = gloss(UI.View, {
  minHeight: 20,
  margin: [0, 0, 4],
  flexFlow: 'row',
  alignItems: 'center',
  flex: 1,
  overflow: 'hidden',
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
})

const Bottom = gloss({
  flexFlow: 'row',
  alignItems: 'center',
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
