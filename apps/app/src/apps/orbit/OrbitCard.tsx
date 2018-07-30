import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitIcon } from './OrbitIcon'
import { ItemResolver, ResolvedItem } from '../../components/ItemResolver'
import { SmallLink, RoundButton } from '../../views'
import { TimeAgo } from '../../views/TimeAgo'
import { App, AppStatePeekItem } from '@mcro/stores'
import { PeopleRow } from '../../components/PeopleRow'
import { CSSPropertySet } from '@mcro/gloss'
import { OrbitDockedPaneStore } from './OrbitDockedPaneStore'
import { Bit } from '@mcro/models'
import { SearchStore } from '../../stores/SearchStore'
import { AppStore } from '../../stores/AppStore'
import { getTargetPosition } from '../../helpers/getTargetPosition'
import { EMPTY_ITEM } from '../../constants'

export type OrbitCardProps = {
  total?: number
  hoverToSelect?: boolean
  appStore?: AppStore
  searchStore?: SearchStore
  paneStore?: OrbitDockedPaneStore
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
  hide?: { icon?: boolean }
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
})

const cardShadow = [0, 1, 2, [0, 0, 0, 0.05]]
const cardHoverGlow = [0, 0, 0, 2, [0, 0, 0, 0.05]]
const cardSelectedGlow = [0, 0, 0, 3, '#90b1e452']
const borderSelected = UI.color('#90b1e4')

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
}) => {
  const disabledShadow = disableShadow ? 'none' : null
  let card: CSSPropertySet = {
    flex: inGrid ? 1 : 'none',
    '&:active': {
      opacity: 0.75,
    },
  }
  if (listItem) {
    // LIST ITEM
    let listStyle
    // selected...
    if (isSelected) {
      listStyle = {
        border: [1, borderSelected],
        boxShadow: disabledShadow || [cardShadow, cardSelectedGlow],
      }
    } else {
      listStyle = {
        border: [1, 'transparent'],
      }
    }
    card = {
      ...card,
      ...listStyle,
      borderLeft: 'none',
      borderRight: 'none',
      padding: padding || [20, 18],
    }
  } else {
    // CARD
    const cardBackground = background || theme.selected.background
    card = {
      ...card,
      padding: padding || 16,
      borderRadius: borderRadius || 9,
      background: cardBackground,
    }
    if (!isSelected) {
      const borderHover = UI.color('#c9c9c9')
      card = {
        ...card,
        boxShadow: disabledShadow || [cardShadow],
        border: border || [1, cardBackground.darken(0.08)],
        '&:hover': {
          boxShadow: disabledShadow || [cardShadow, cardHoverGlow],
          border: [1, borderHover],
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

const Subtitle = view(UI.View, {
  height: 20,
  margin: [2, 0, 0],
  opacity: 0.45,
  flexFlow: 'row',
  alignItems: 'center',
})

const orbitIconProps = {
  orbitIconStyle: {
    marginRight: 6,
  },
}

class OrbitCardStore {
  props: OrbitCardProps

  normalizedBit = null
  isSelected = false
  ref = null

  get isPaneSelected() {
    if (!this.props.subPane) {
      return false
    }
    const isPaneActive = this.props.appStore.selectedPane === this.props.pane
    const isSubPaneActive =
      this.props.paneStore.activePane === this.props.subPane
    return isPaneActive && isSubPaneActive
  }

  handleClick = e => {
    if (this.props.onClick) {
      this.props.onClick(e, this.ref)
      return
    }
    if (this.props.onSelect) {
      this.props.onSelect(this.ref)
      return
    }
    if (this.props.inactive) {
      return
    }
    this.props.searchStore.setSelectEvent('click')
    this.props.searchStore.toggleSelected(this.props.index)
  }

  setRef = ref => {
    if (!ref) return
    this.ref = ref
    if (this.props.getRef) {
      this.props.getRef(ref)
    }
  }

  get target() {
    return this.props.result || this.normalizedBit
  }

  get sleepBeforePeek() {
    if (this.props.searchStore) {
      const { selectEvent } = this.props.searchStore
      return selectEvent === 'key' ? 150 : 0
    }
    return 0
  }

  // this cancels to prevent renders very aggressively
  updateIsSelected = react(
    () => [
      this.props.searchStore && this.props.searchStore.nextIndex,
      this.isPaneSelected,
      typeof this.props.isSelected === 'function'
        ? this.props.isSelected()
        : this.props.isSelected,
    ],
    async ([nextIndex, isPaneSelected, isSelected], { sleep }) => {
      if (!isPaneSelected) {
        throw react.cancel
      }
      let nextIsSelected
      if (typeof isSelected === 'boolean') {
        nextIsSelected = isSelected
      } else {
        nextIsSelected = nextIndex === this.props.index
      }
      if (nextIsSelected === this.isSelected) {
        throw react.cancel
      }
      this.isSelected = nextIsSelected
      if (nextIsSelected && !this.props.preventAutoSelect) {
        // if (this.props.subPaneStore) {
        //   this.props.subPaneStore.scrollIntoView(this.ref)
        // }
        // reduce jitter, work, visual delay looks a bit nicer
        await sleep(this.sleepBeforePeek)
        if (!this.target) {
          throw new Error(`No target!`)
        }
        const position = getTargetPosition(this.ref)
        // list items are closer to edge, adjust...
        if (this.props.listItem === true) {
          position.left += 8
        }
        App.actions.selectItem(this.target, position)
      }
    },
    { immediate: true },
  )
}

@view.attach('appStore', 'searchStore', 'paneStore')
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
    const { searchStore, hoverToSelect } = this.props
    if (hoverToSelect) {
      this.hoverSettler = searchStore.getHoverSettler()
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

  clickAt = 0

  handleDoubleClick = e => {
    // so we can control the speed of double clicks
    if (Date.now() - this.clickAt < 150) {
      this.open()
      e.stopPropagation()
    }
    this.clickAt = Date.now()
  }

  open = () => {
    if (!this.props.bit) {
      return
    }
    App.actions.open(this.props.bit)
  }

  id = Math.random()

  getOrbitCard(contentProps: ResolvedItem) {
    // TODO weird mutation
    this.props.store.normalizedBit = contentProps
    const {
      title,
      icon,
      preview,
      location,
      date,
      people,
      subtitle,
      locationLink,
    } = contentProps
    const {
      store,
      listItem,
      hoverToSelect,
      children,
      afterTitle,
      titleProps,
      inactive,
      iconProps,
      hide,
      inGrid,
      borderRadius,
      nextUpStyle,
      onClick,
      searchStore,
      cardProps,
      disableShadow,
      ...props
    } = this.props
    const { isSelected } = store
    const hasSubtitle = !!(location || subtitle)
    return (
      <CardWrap
        {...hoverToSelect && !inactive && this.hoverSettler.props}
        forwardRef={store.setRef}
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
          {...cardProps}
        >
          {!!icon &&
            !hide.icon && (
              <OrbitIcon
                icon={icon}
                size={24}
                {...orbitIconProps}
                {...iconProps}
                position="absolute"
                top={listItem ? 25 : 10}
                right={listItem ? 8 : 0}
                opacity={0.8}
              />
            )}
          <Title>
            <UI.Text
              size={1.2}
              sizeLineHeight={0.85}
              ellipse={2}
              alpha={isSelected || listItem ? 1 : 0.8}
              fontWeight={500}
              maxWidth="calc(100% - 30px)"
              {...titleProps}
            >
              {title}
            </UI.Text>
            {afterTitle}
          </Title>
          {hasSubtitle && (
            <Subtitle opacity={listItem ? 0.55 : 0.4}>
              {!!location && (
                <UI.Text
                  display="inline-flex"
                  alignItems="center"
                  flexFlow="row"
                >
                  <RoundButton marginLeft={-3} onClick={locationLink}>
                    {location}
                  </RoundButton>
                </UI.Text>
              )}
              {typeof subtitle === 'string' ? (
                <UI.Text ellipse maxWidth="calc(100% - 40px)">
                  {subtitle}
                </UI.Text>
              ) : (
                subtitle
              )}
              {!!date && (
                <UI.Text size={0.95}>
                  <strong> &middot;</strong> <TimeAgo date={date} />
                </UI.Text>
              )}
            </Subtitle>
          )}
          {/* vertical space only if needed */}
          {hasSubtitle &&
            (!!children || !!preview) && <div style={{ height: 4 }} />}
          <Preview if={preview && !children}>
            {typeof preview !== 'string' && preview}
            <UI.Text
              if={typeof preview === 'string'}
              className="preview-text"
              alpha={isSelected ? 1 : 0.6}
              size={listItem ? 1.1 : 1.3}
              sizeLineHeight={0.9}
              margin={inGrid ? ['auto', 0] : 0}
            >
              {preview
                .slice(0, 220)
                .split(' ')
                .map((word, i) => (
                  <React.Fragment key={i}>
                    <SmallLink searchStore={searchStore}>{word}</SmallLink>{' '}
                  </React.Fragment>
                ))}
            </UI.Text>
          </Preview>
          {typeof children === 'function' ? children(contentProps) : children}
          {people && people.length && people[0].data.profile ? (
            <div>
              <PeopleRow people={people} />
            </div>
          ) : null}
        </Card>
        {/* Keep this below card because Masonry uses a simple .firstChild to measure */}
        {!listItem &&
          !disableShadow && (
            <UI.HoverGlow
              behind
              color="#000"
              resist={90}
              scale={0.99}
              offsetTop={isSelected ? 8 : 4}
              full
              blur={isSelected ? 8 : 4}
              inverse
              opacity={isSelected ? 0.08 : 0.03}
              borderRadius={20}
            />
          )}
        {listItem && <Divider />}
      </CardWrap>
    )
  }

  render() {
    const {
      searchStore,
      store,
      pane,
      bit,
      itemProps,
      inGrid,
      item,
      ...props
    } = this.props
    // debounceLog(`${(bit && bit.id) || props.title}.${pane} ${store.isSelected}`)
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
