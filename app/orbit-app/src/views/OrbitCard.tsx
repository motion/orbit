import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitIcon } from './OrbitIcon'
import { ItemResolver, ResolvedItem } from '../components/ItemResolver'
import { TimeAgo } from './TimeAgo'
import { App, AppStatePeekItem } from '@mcro/stores'
import { PeopleRow } from '../components/PeopleRow'
import { CSSPropertySet } from '@mcro/gloss'
import { PaneManagerStore } from '../apps/orbit/PaneManagerStore'
import { Bit } from '@mcro/models'
import { SelectionStore } from '../stores/SelectionStore'
import { AppStore } from '../stores/AppStore'
import { getTargetPosition } from '../helpers/getTargetPosition'
import { EMPTY_ITEM } from '../constants'
import { SubPaneStore } from '../apps/orbit/SubPaneStore'
import { RoundButtonSmall } from './RoundButtonSmall'

export type OrbitCardProps = {
  total?: number
  hoverToSelect?: boolean
  appStore?: AppStore
  selectionStore?: SelectionStore
  paneManagerStore?: PaneManagerStore
  subPaneStore?: SubPaneStore
  title?: React.ReactNode
  subtitle?: React.ReactNode
  date?: React.ReactNode
  icon?: React.ReactNode
  result?: AppStatePeekItem & { auth: boolean }
  index?: number
  store?: OrbitCardStore
  isExpanded?: boolean
  listItem?: boolean
  style?: Object
  afterTitle?: React.ReactNode
  titleProps?: Object
  inactive?: boolean
  iconProps?: Object
  hide?: { icon?: boolean; subtitle?: boolean; body?: boolean }
  className?: string
  inGrid?: boolean
  pane?: string
  subPane?: string
  bit?: Bit
  itemProps?: Object
  children?: ((a: Object) => JSX.Element) | React.ReactNode
  onClick?: Function
  onSelect?: (a: HTMLElement) => any
  borderRadius?: number
  nextUpStyle?: Object
  isSelected?: boolean | Function
  getRef?: Function
  cardProps?: Object
  item?: AppStatePeekItem
  disableShadow?: boolean
  preventAutoSelect?: boolean
  padding?: number | number[]
  titleFlex?: number
  subtitleProps?: Object
  getIndex?: (id: number) => number
}

class OrbitCardStore {
  props: OrbitCardProps

  normalizedBit = null
  isSelected = false
  cardWrapRef = null

  clickAt = 0

  handleClick = e => {
    // so we can control the speed of double clicks
    if (Date.now() - this.clickAt < 220) {
      this.open()
      e.stopPropagation()
    }
    this.clickAt = Date.now()
    if (this.props.onClick) {
      this.props.onClick(e, this.cardWrapRef)
      return
    }
    if (this.props.onSelect) {
      this.props.onSelect(this.cardWrapRef)
      return
    }
    if (this.props.inactive) {
      return
    }
    this.props.selectionStore.setSelectEvent('click')
    App.actions.toggleSelectItem(this.target, this.position)
  }

  open = () => {
    if (!this.props.bit) {
      return
    }
    App.actions.openItem(this.props.bit)
  }

  setCardWrapRef = cardWrapRef => {
    if (!cardWrapRef) return
    this.cardWrapRef = cardWrapRef
    if (this.props.getRef) {
      this.props.getRef(cardWrapRef)
    }
  }

  get target() {
    return this.props.result || this.normalizedBit
  }

  get sleepBeforePeek() {
    // first time, go fast
    if (!App.peekState.target) {
      return 16
    }
    // depending on type of move, adjust speed
    if (this.props.selectionStore) {
      const { selectEvent } = this.props.selectionStore
      return selectEvent === 'key' ? 130 : 0
    }
    return 16
  }

  get position() {
    const position = getTargetPosition(this.cardWrapRef)
    // list items are closer to edge, adjust...
    if (this.props.listItem === true) {
      position.left += 5
    }
    return position
  }

  // this cancels to prevent renders very aggressively
  updateIsSelected = react(
    () => [
      this.props.selectionStore && this.props.selectionStore.nextIndex,
      this.props.subPaneStore && this.props.subPaneStore.isActive,
      typeof this.props.isSelected === 'function'
        ? this.props.isSelected()
        : this.props.isSelected,
    ],
    async ([nextIndex, isPaneActive, isSelected], { sleep }) => {
      if (!isPaneActive) {
        throw react.cancel
      }
      const {
        bit,
        getIndex,
        index,
        preventAutoSelect,
        subPaneStore,
      } = this.props
      let nextIsSelected
      if (typeof isSelected === 'boolean') {
        nextIsSelected = isSelected
      } else {
        const resolvedIndex = getIndex ? getIndex(bit.id) : index
        nextIsSelected = nextIndex === resolvedIndex
      }
      if (nextIsSelected === this.isSelected) {
        throw react.cancel
      }
      console.log('update is selected', this.props)
      this.isSelected = nextIsSelected
      if (nextIsSelected && !preventAutoSelect) {
        if (subPaneStore) {
          subPaneStore.scrollIntoView(this.cardWrapRef)
        }
        if (!this.target) {
          throw new Error(`No target!`)
        }
        // fluidity
        await sleep(32)
        App.actions.selectItem(this.target, this.position)
      }
    },
  )
}

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
const cardSelectedGlow = [0, 0, 0, 2, [0, 0, 0, 0.1]]
const borderSelected = '#666'

Card.theme = ({
  listItem,
  borderRadius,
  inGrid,
  theme,
  nextUpStyle,
  isSelected,
  isNextUp,
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
  if (listItem) {
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
      padding: padding || [20, 18],
      '&:active': {
        opacity: isSelected ? 1 : 0.8,
      },
    }
  } else {
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
  }
  if (isNextUp && nextUpStyle) {
    card = {
      ...card,
      ...nextUpStyle,
    }
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
})

const CardSubtitle = view(UI.View, {
  height: 20,
  margin: [3, 0, 0],
  padding: [2, 0, 2],
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
  store: OrbitCardStore,
})
@view
export class OrbitCard extends React.Component<OrbitCardProps> {
  hoverSettler = null

  static defaultProps = {
    item: EMPTY_ITEM,
    hide: {},
  }

  constructor(a, b) {
    super(a, b)
    this.getOrbitCard = this.getOrbitCard.bind(this)
    const { selectionStore, hoverToSelect } = this.props
    if (hoverToSelect) {
      this.hoverSettler = selectionStore.getHoverSettler()
      this.hoverSettler.setItem({
        index: this.props.index,
      })
    }
  }

  get isExpanded() {
    const { isExpanded } = this.props
    if (typeof isExpanded === 'boolean') {
      return isExpanded
    }
    return (
      this.props.store.isSelected ||
      (this.props.listItem && this.props.store.isSelected)
    )
  }

  id = Math.random()

  getOrbitCard(contentProps: ResolvedItem) {
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
      listItem,
      nextUpStyle,
      onClick,
      selectionStore,
      store,
      titleProps,
      subtitleProps,
      padding,
      titleFlex,
      ...props
    } = this.props
    const { isSelected } = store
    const hasSubtitle = !!(location || subtitle) && !hide.subtitle
    return (
      <CardWrap
        {...hoverToSelect && !inactive && this.hoverSettler.props}
        forwardRef={store.setCardWrapRef}
        zIndex={isSelected ? 5 : 4}
        {...props}
      >
        <Card
          isSelected={isSelected}
          // isNextUp={store.isNextUp}
          listItem={listItem}
          borderRadius={borderRadius}
          inGrid={inGrid}
          nextUpStyle={nextUpStyle}
          onClick={store.handleClick}
          disableShadow={disableShadow}
          padding={padding}
          {...cardProps}
        >
          {!!icon &&
            !hide.icon && (
              <OrbitIcon
                icon={icon}
                size={24}
                {...orbitIconProps}
                position="absolute"
                top={listItem ? 25 : 10}
                right={listItem ? 8 : 10}
                {...iconProps}
              />
            )}
          <Title style={titleFlex && { flex: titleFlex }}>
            <UI.Text
              fontSize={listItem ? 16 : 15}
              sizeLineHeight={0.7}
              ellipse={2}
              fontWeight={600}
              maxWidth="calc(100% - 30px)"
              textShadow={listItem ? '0 0.5px 0 rgba(0,0,0,0.5)' : null}
              {...titleProps}
            >
              {title}
            </UI.Text>
            {afterTitle}
          </Title>
          {hasSubtitle && (
            <CardSubtitle listItem={listItem}>
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
              {!!createdAt && (
                <UI.Text alpha={0.55} size={0.95}>
                  <strong> &middot;</strong>{' '}
                  <TimeAgo date={updatedAt || createdAt} />
                </UI.Text>
              )}
            </CardSubtitle>
          )}
          {/* vertical space only if needed */}
          {hasSubtitle &&
            (!!children || !!preview) && <div style={{ height: 4 }} />}
          {!!preview &&
            !children &&
            !hide.body && (
              <Preview>
                {typeof preview !== 'string' && preview}
                {typeof preview === 'string' && (
                  <UI.Text
                    className="preview-text"
                    alpha={isSelected ? 1 : 0.7}
                    size={listItem ? 1.1 : 1.3}
                    sizeLineHeight={0.9}
                    margin={inGrid ? ['auto', 0] : 0}
                  >
                    {preview}
                    {/* .slice(0, 220)
                      .split(' ')
                      .map((word, i) => (
                        <React.Fragment key={i}>
                          <SmallLink searchStore={searchStore}>
                            {word}
                          </SmallLink>{' '}
                        </React.Fragment>
                      )) */}
                  </UI.Text>
                )}
              </Preview>
            )}
          {typeof children === 'function' ? children(contentProps) : children}
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
        {listItem && <Divider />}
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
      ...props
    } = this.props
    console.log(`${(bit && bit.id) || props.title}.${pane} ${store.isSelected}`)
    if (!bit) {
      return this.getOrbitCard(props)
    }
    store.isSelected
    return (
      <ItemResolver
        bit={bit}
        item={item}
        isExpanded={this.isExpanded}
        {...itemProps}
      >
        {this.getOrbitCard}
      </ItemResolver>
    )
  }
}
