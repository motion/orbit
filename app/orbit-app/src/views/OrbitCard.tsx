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
import { OrbitItemProps } from './OrbitItemProps'
import { OrbitItemStore } from './OrbitItemStore'

const CardWrap = view(UI.View, {
  position: 'relative',
  width: '100%',
  transform: {
    z: 0,
  },
})

const Card = view({
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

const cardShadow = [0, 6, 14, [0, 0, 0, 0.12]]
const cardHoverGlow = [0, 0, 0, 2, [0, 0, 0, 0.05]]
// 90b1e433
// 90b1e4cc
const cardSelectedGlow = [0, 0, 0, 3, '#90b1e433']
const borderSelected = '#90b1e4ee'

Card.theme = ({
  borderRadius,
  inGrid,
  theme,
  isSelected,
  background,
  border,
  padding,
  disableShadow,
  chromeless,
}) => {
  let card: CSSPropertySet = {
    flex: inGrid ? 1 : 'none',
  }
  if (chromeless) {
    return card
  }
  const disabledShadow = disableShadow ? 'none' : null
  card = {
    ...card,
    padding: padding || 13,
    borderRadius: borderRadius || 9,
    background: theme.base.background,
    ...theme.card,
  }
  if (background) {
    card.background = background
  }
  // CARD
  if (!isSelected) {
    card = {
      ...card,
      boxShadow: disabledShadow || [cardShadow],
      border: border || [1, [255, 255, 255, 0.07]],
      '&:hover': {
        boxShadow: disabledShadow || [cardShadow, cardHoverGlow],
        border: [1, [255, 255, 255, 0.2]],
      },
    }
  }
  if (isSelected) {
    card = {
      ...card,
      boxShadow: disabledShadow || [cardShadow, cardSelectedGlow],
      border: [1, borderSelected],
      '&:hover': {
        border: [1, borderSelected],
      },
    }
  }
  card = {
    ...card,
    '&:active': {
      opacity: 0.8,
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
export class OrbitCardInner extends React.Component<OrbitItemProps> {
  static defaultProps = {
    item: EMPTY_ITEM,
    hide: {},
  }

  getOrbitCard = (contentProps: ResolvedItem) => {
    // TODO weird mutation
    this.props.store.normalizedBit = contentProps
    const {
      createdAt,
      icon,
      location,
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
      // ignore so it doesnt add tooltip to div
      title: _ignoreTitle,
      onClickLocation,
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
        <Card
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
                size={22}
                {...orbitIconProps}
                position="absolute"
                top={10}
                right={10}
                {...iconProps}
              />
            )}
          {!(hide && hide.title) && (
            <Title style={titleFlex && { flex: titleFlex }}>
              <UI.Text
                fontSize={15}
                sizeLineHeight={0.85}
                ellipse={2}
                fontWeight={600}
                maxWidth="calc(100% - 30px)"
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
                <RoundButtonSmall marginLeft={-3} onClick={onClickLocation}>
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
                <>
                  {!!(subtitle || location) && <div style={{ width: 5 }} />}
                  <UI.Text alpha={0.75} size={0.95}>
                    <DateFormat date={new Date(updatedAt)} nice />
                  </UI.Text>
                </>
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
                    size={1.3}
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
          {people && people.length && people[0].data.profile ? (
            <div>
              <PeopleRow people={people} />
            </div>
          ) : null}
        </Card>
        {/* Keep this below card because Masonry uses a simple .firstChild to measure */}
        {/* {!listItem &&
          !disableShadow && (
            <UI.HoverGlow
              behind
              color="#000"
              resist={90}
              scale={0.99}
              offsetTop={isSelected ? 6 : 4}
              full
              blur={isSelected ? 8 : 4}
              inverse
              opacity={isSelected ? 0.08 : 0.03}
              borderRadius={20}
              duration={100}
            />
          )} */}
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
      ...props
    } = this.props
    console.log(
      `${props.index} ${(bit && bit.id) || props.title}.${pane} ${
        store.isSelected
      }`,
    )
    if (!bit) {
      return this.getOrbitCard(props)
    }
    store.isSelected
    return (
      <ItemResolver
        bit={bit}
        item={item}
        isExpanded={this.props.isExpanded}
        searchTerm={searchTerm}
        {...itemProps}
      >
        {this.getOrbitCard}
      </ItemResolver>
    )
  }
}

// wrap the outside so we can do much faster shallow renders when need be
export class OrbitCard extends React.Component<OrbitItemProps> {
  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps)
  }

  render() {
    return <OrbitCardInner {...this.props} />
  }
}
