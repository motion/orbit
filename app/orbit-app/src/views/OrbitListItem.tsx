import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitIcon } from './OrbitIcon'
import { ItemResolver, ResolvedItem } from '../components/ItemResolver'
import { PeopleRow } from '../components/PeopleRow'
import { CSSPropertySet } from '@mcro/gloss'
import { EMPTY_ITEM } from '../constants'
import { RoundButtonSmall } from './RoundButtonSmall'
import isEqual from 'react-fast-compare'
import { DateFormat } from './DateFormat'
import { differenceInCalendarDays } from 'date-fns/esm/fp'
import { OrbitItemProps } from './OrbitItemProps'
import { OrbitItemStore } from './OrbitItemStore'

const CardWrap = view(UI.View, {
  position: 'relative',
  width: '100%',
  transform: {
    z: 0,
  },
})

const Divider = view({
  height: 1,
  background: [0, 0, 0, 0.05],
  position: 'absolute',
  bottom: 0,
  left: 10,
  right: 10,
})

const ListItem = view({
  overflow: 'hidden',
  position: 'relative',
  maxHeight: '100%',
  transform: {
    z: 0,
  },
  chromeless: {
    border: [1, 'transparent'],
    background: 'transparent',
    padding: [12, 12, 12, 10],
    '&:hover': {
      background: [0, 0, 0, 0.025],
    },
  },
})

ListItem.theme = ({ inGrid, theme, isSelected, padding, chromeless }) => {
  let card: CSSPropertySet = {
    flex: inGrid ? 1 : 'none',
  }
  if (chromeless) {
    return card
  }
  // LIST ITEM
  let listStyle
  // selected...
  if (isSelected) {
    listStyle = {
      background: theme.base.background.alpha(0.2),
      // border: [1, borderSelected],
      // boxShadow: disabledShadow || [[0, 0, 0, 1, '#90b1e4']],
    }
  } else {
    listStyle = {
      // border: [1, 'transparent'],
      '&:hover': {
        background: theme.hover.background,
      },
    }
  }
  card = {
    ...card,
    ...listStyle,
    borderLeft: 'none',
    borderRight: 'none',
    padding: padding || [12, 16],
    '&:active': {
      opacity: isSelected ? 1 : 0.8,
    },
  }
  return card
}

const Title = view({
  maxWidth: '100%',
  flexFlow: 'row',
  justifyContent: 'space-between',
})

const Preview = view({
  flex: 1,
  zIndex: -1,
})

const CardSubtitle = view(UI.View, {
  height: 20,
  margin: [3, 0, 0],
  padding: [2, 30, 2, 0],
  flexFlow: 'row',
  alignItems: 'center',
  listItem: {
    margin: [6, 0, 0],
  },
})

const orbitIconProps = {
  orbitIconStyle: {
    marginRight: -2,
  },
}

@view.attach('appStore', 'selectionStore', 'paneManagerStore', 'subPaneStore')
@view.attach({
  store: OrbitItemStore,
})
@view
export class OrbitListInner extends React.Component<OrbitItemProps> {
  static defaultProps = {
    item: EMPTY_ITEM,
    hide: {},
  }

  getInner = (contentProps: ResolvedItem) => {
    // TODO weird mutation
    this.props.store.normalizedBit = contentProps
    const {
      createdAt,
      icon,
      location,
      locationLink,
      people,
      preview,
      subtitle,
      title,
      updatedAt,
    } = contentProps
    const {
      afterTitle,
      borderRadius,
      cardProps,
      children,
      disableShadow,
      hide,
      hoverToSelect,
      iconProps,
      inactive,
      inGrid,
      onClick,
      selectionStore,
      store,
      titleProps,
      subtitleProps,
      padding,
      titleFlex,
      subtitleSpaceBetween,
      searchTerm,
      ...props
    } = this.props
    const { isSelected } = store
    const hasSubtitle = !!(location || subtitle) && !(hide && hide.subtitle)
    return (
      <CardWrap
        {...hoverToSelect && !inactive && store.hoverSettler.props}
        forwardRef={store.setCardWrapRef}
        zIndex={isSelected ? 5 : 4}
        {...props}
      >
        <ListItem
          isSelected={isSelected}
          borderRadius={borderRadius}
          inGrid={inGrid}
          onClick={store.handleClick}
          disableShadow={disableShadow}
          padding={padding}
          {...cardProps}
        >
          {!!icon &&
            !(hide && hide.icon) && (
              <OrbitIcon
                icon={icon}
                size={18}
                {...orbitIconProps}
                position="absolute"
                top={16}
                right={16}
                {...iconProps}
              />
            )}
          {!(hide && hide.title) && (
            <Title style={titleFlex && { flex: titleFlex }}>
              <UI.Text
                fontSize={16}
                sizeLineHeight={0.85}
                ellipse={2}
                fontWeight={600}
                maxWidth="calc(100% - 30px)"
                textShadow={'0 0.5px 0 rgba(0,0,0,0.5)'}
                {...titleProps}
              >
                {title}
              </UI.Text>
              {afterTitle}
            </Title>
          )}
          {hasSubtitle && (
            <CardSubtitle>
              {!!location && (
                <RoundButtonSmall marginLeft={-3} onClick={locationLink}>
                  {location}
                </RoundButtonSmall>
              )}
              {typeof subtitle === 'string' ? (
                <UI.Text alpha={0.55} ellipse {...subtitleProps}>
                  {subtitle}
                </UI.Text>
              ) : (
                subtitle
              )}
              {subtitleSpaceBetween}
              {!!createdAt && (
                <UI.Text alpha={0.75} size={0.95}>
                  {!!(subtitle || location) && <div style={{ width: 5 }} />}
                  <DateFormat
                    date={new Date(updatedAt)}
                    nice={differenceInCalendarDays(Date.now, updatedAt) < 7}
                  />
                </UI.Text>
              )}
            </CardSubtitle>
          )}
          {/* vertical space only if needed */}
          {hasSubtitle &&
            (!!children || !!preview) && (
              <div style={{ flex: 1, maxHeight: 4 }} />
            )}
          {!!preview &&
            !children &&
            !hide.body && (
              <Preview>
                {typeof preview !== 'string' && preview}
                {typeof preview === 'string' && (
                  <UI.Text
                    alpha={0.7}
                    size={1.1}
                    sizeLineHeight={0.9}
                    margin={inGrid ? ['auto', 0] : 0}
                  >
                    {preview}
                  </UI.Text>
                )}
              </Preview>
            )}
          {typeof children === 'function'
            ? children(contentProps, props.bit, props.index)
            : children}
          {!(hide && hide.people) &&
          this.props.bit.integration !== 'slack' &&
          people &&
          people.length &&
          people[0].data.profile ? (
            <div>
              <PeopleRow people={people} />
            </div>
          ) : null}
        </ListItem>
        <Divider />
      </CardWrap>
    )
  }

  render() {
    const {
      selectionStore,
      store,
      pane,
      bit,
      itemProps,
      inGrid,
      item,
      searchTerm,
      isExpanded,
      hide,
      ...props
    } = this.props
    console.log(
      `${props.index} ${(bit && bit.id) || props.title}.${pane} ${
        store.isSelected
      }`,
    )
    if (!bit) {
      return this.getInner(props)
    }
    store.isSelected
    return (
      <ItemResolver
        bit={bit}
        item={item}
        isExpanded={isExpanded}
        searchTerm={searchTerm}
        hide={hide}
        {...itemProps}
      >
        {this.getInner}
      </ItemResolver>
    )
  }
}

// wrap the outside so we can do much faster shallow renders when need be
export class OrbitListItem extends React.Component<OrbitItemProps> {
  shouldComponentUpdate(nextProps) {
    if (!isEqual(this.props, nextProps)) {
      console.log('not equal re-render', this.props, nextProps)
    }
    return !isEqual(this.props, nextProps)
  }

  render() {
    return <OrbitListInner {...this.props} />
  }
}
