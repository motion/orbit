import * as React from 'react'
import { StoreContext } from '@mcro/black'
import * as UI from '@mcro/ui'
import { PeopleRow } from '../../components/PeopleRow'
import { CSSPropertySet, gloss } from '@mcro/gloss'
import { RoundButtonSmall } from '../RoundButtonSmall'
import { DateFormat } from '../DateFormat'
import { differenceInCalendarDays } from 'date-fns/esm/fp'
import { OrbitItemProps } from './OrbitItemProps'
import { OrbitItemStore } from './OrbitItemStore'
import { HighlightText } from '../HighlightText'
import { Row, Text, View } from '@mcro/ui'
import { HorizontalSpace } from '..'
import { Separator } from '../Separator'
import { observer } from 'mobx-react-lite'
import { useStore } from '@mcro/use-store'
import { Icon } from '../Icon'

export const OrbitListItem = observer((props: OrbitItemProps<any>) => {
  const stores = React.useContext(StoreContext)
  const store = useStore(OrbitItemStore, { ...props, ...stores })
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
    hoverToSelect,
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
    extraProps,
    isExpanded,
    before,
    hide,
    ...restProps
  } = props
  const { isSelected } = store
  const showChildren = !(hide && hide.body)
  const showSubtitle = (!!subtitle || !!location) && !(hide && hide.subtitle)
  const showDate = !!createdAt && !(hide && hide.date)
  const showIcon = !!icon && !(hide && hide.icon)
  const showTitle = !(hide && hide.title)
  const showPeople = !!(
    !(hide && hide.people) &&
    people &&
    people.length &&
    people[0].data['profile']
  )
  const showPreview = !!preview && !children && !(hide && hide.body)
  const oneLine = extraProps && extraProps.oneLine
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
      <ListFrame
        isExpanded={isExpanded}
        {...hoverToSelect && store.hoverSettler && store.hoverSettler.props}
        forwardRef={store.setCardWrapRef}
        {...restProps}
      >
        <ListItem
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
                  <HighlightText
                    fontSize={15}
                    sizeLineHeight={0.85}
                    ellipse
                    fontWeight={700}
                    {...titleProps}
                  >
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
        </ListItem>
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
  background: theme.color.alpha(0.017),
}))

const ListItem = gloss({
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
