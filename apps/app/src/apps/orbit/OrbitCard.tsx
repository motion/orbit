import * as React from 'react'
import { view, react, attachTheme } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitIcon } from './OrbitIcon'
import { BitResolver } from '../../components/BitResolver'
import { SmallLink } from '../../views'
import { TimeAgo } from '../../views/TimeAgo'
import { App, AppStatePeekItem } from '@mcro/stores'
import { PeopleRow } from '../../components/PeopleRow'
import { CSSPropertySet } from '@mcro/gloss'
import { OrbitDockedPaneStore } from './OrbitDockedPaneStore'
import { Bit } from '@mcro/models'
import { SearchStore } from '../../stores/SearchStore'

export type OrbitCardProps = {
  total?: number
  hoverToSelect?: boolean
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
  selectedTheme?: Object
  afterTitle?: React.ReactNode
  theme?: Object
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
  children?: (a: Object, b: Object) => JSX.Element | React.ReactNode
  onClick?: Function
  onSelect?: (a: HTMLElement) => any
  borderRadius?: number
  nextUpStyle?: Object
}

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
  padding: [16, 18],
  transform: {
    z: 0,
  },
})

Card.theme = ({
  listItem,
  borderRadius,
  inGrid,
  theme,
  nextUpStyle,
  isSelected,
  isNextUp,
}) => {
  let card: CSSPropertySet = {
    flex: inGrid ? 1 : 'none',
  }
  if (listItem) {
    // LIST ITEM
    let listStyle
    // selected...
    if (isSelected) {
      listStyle = {
        background: theme.selected.background,
        '&:hover': {
          background: theme.selected.background,
        },
      }
    } else {
      listStyle = {
        background: 'transparent',
        '&:hover': {
          background: theme.hover.background,
        },
        '&:active': {
          background: theme.active.background,
        },
      }
    }
    card = {
      ...card,
      ...listStyle,
      padding: [16, 20],
      borderTop: [1, theme.hover.background],
    }
  } else {
    // CARD
    const borderHover = UI.color('#ddd')
    const borderActive = UI.color('rgb(51.3%, 65.7%, 88.6%)').lighten(0.1)
    card = {
      ...card,
      borderRadius: borderRadius || 7,
      background: theme.selected.background,
      boxShadow: [[0, 1, 3, [0, 0, 0, 0.05]]],
      border: [1, '#fff'],
      '&:hover': {
        border: [1, borderHover],
      },
      '&:active': {
        border: [1, borderActive],
      },
    }
    if (isSelected) {
      card = {
        ...card,
        border: [1, borderHover],
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

const Subtitle = view({
  margin: [-1, 0, 0],
  opacity: 0.4,
  flexFlow: 'row',
  alignItems: 'center',
})

const orbitIconProps = {
  imageStyle: {
    transformOrigin: 'bottom right',
    transform: {
      y: -6 - 3,
      x: 20 + 3,
      scale: 2.7,
      rotate: '-45deg',
    },
  },
  orbitIconStyle: {
    marginRight: 6,
  },
}

class OrbitCardStore {
  _isSelected = false
  ref = null

  get isSelected() {
    return typeof this.props.isSelected === 'boolean'
      ? this.props.isSelected
      : this._isSelected
  }

  get isPaneSelected() {
    if (!this.props.subPane) {
      return false
    }
    const isPaneActive = this.props.searchStore.selectedPane === this.props.pane
    const isSubPaneActive =
      this.props.paneStore.activePane === this.props.subPane
    return isPaneActive && isSubPaneActive
  }

  handleClick = e => {
    if (this.props.onSelect) {
      this.props.onSelect(this.ref)
      return
    }
    if (this.props.inactive) {
      return
    }
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
    return this.props.bit || this.props.result
  }

  isNextUp = react(
    () => [
      this.props.searchStore.nextIndex,
      this.isPaneSelected,
      !!this.props.nextUpStyle,
    ],
    ([nextIndex, isPaneSelected, hasUpNextStyle], { getValue }) => {
      if (!isPaneSelected || !hasUpNextStyle) {
        throw react.cancel
      }
      const isUpNext = nextIndex + 1 === this.props.index
      if (isUpNext === getValue()) {
        throw react.cancel
      }
      return isUpNext
    },
    { immediate: true },
  )

  setPeekTargetOnNextIndex = react(
    () => [this.props.searchStore.nextIndex, this.isPaneSelected],
    async ([nextIndex, isPaneSelected], { sleep }) => {
      if (!isPaneSelected) {
        throw react.cancel
      }
      const shouldSelect = nextIndex === this.props.index
      if (shouldSelect === this._isSelected) {
        throw react.cancel
      }
      this._isSelected = shouldSelect
      if (shouldSelect) {
        // visual smoothness
        await sleep()
        if (!this.target) {
          throw new Error(
            `No target! ${this.props.pane} ${this.props.subPane} ${
              this.props.index
            }`,
          )
        }
        // TODO: implement
        // if (this.props.paneStore) {
        //   this.props.paneStore.scrollIntoView(this.ref)
        // }
        App.actions.selectItem(this.target, this.ref)
      }
    },
    { immediate: true },
  )
}

@attachTheme
@view.attach('searchStore', 'paneStore')
@view.attach({
  store: OrbitCardStore,
})
@view
export class OrbitCard extends React.Component<OrbitCardProps> {
  hoverSettler = null

  static defaultProps = {
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
    this.props.store.isSelected
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

  getOrbitCard(contentProps) {
    const {
      title,
      icon,
      preview,
      location,
      subtitle,
      permalink,
      date,
      people,
      iconProps: contentIconProps,
    } = contentProps
    const {
      store,
      listItem,
      hoverToSelect,
      children,
      selectedTheme,
      afterTitle,
      theme,
      titleProps,
      inactive,
      iconProps,
      hide,
      inGrid,
      borderRadius,
      nextUpStyle,
      onClick,
      searchStore,
      ...props
    } = this.props
    const hasSubtitle = subtitle || location
    const orbitIcon = (
      <OrbitIcon
        if={icon && !hide.icon}
        icon={icon}
        size={hasSubtitle ? 14 : 18}
        {...orbitIconProps}
        {...contentIconProps}
        {...iconProps}
        position="absolute"
        top={0}
        right={0}
        opacity={0.8}
      />
    )
    const { isSelected } = store
    const { background } =
      isSelected && selectedTheme ? selectedTheme : theme.base
    return (
      <CardWrap
        {...hoverToSelect && !inactive && this.hoverSettler.props}
        forwardRef={store.setRef}
        zIndex={isSelected ? 5 : 4}
        {...props}
      >
        <Card
          isSelected={isSelected}
          isNextUp={store.isNextUp}
          listItem={listItem}
          borderRadius={borderRadius}
          inGrid={inGrid}
          nextUpStyle={nextUpStyle}
          onClick={onClick || store.handleClick}
        >
          {orbitIcon}
          <Title>
            <UI.Text
              size={listItem ? 1.15 : 1.25}
              sizeLineHeight={0.85}
              ellipse={2}
              alpha={isSelected ? 1 : 0.8}
              fontWeight={500}
              maxWidth="calc(100% - 30px)"
              {...titleProps}
            >
              {title}
            </UI.Text>
            {afterTitle}
          </Title>
          <Subtitle if={hasSubtitle}>
            <UI.Text
              display="inline-flex"
              alignItems="center"
              flexFlow="row"
              if={location}
            >
              in&nbsp;{location}
            </UI.Text>
            <UI.Text
              if={typeof subtitle === 'string'}
              ellipse
              maxWidth="calc(100% - 40px)"
            >
              {subtitle}
            </UI.Text>
            {typeof subtitle !== 'string' && subtitle}
            <UI.Text if={date} onClick={permalink} size={0.95}>
              <strong> &middot;</strong> <TimeAgo date={date} />
            </UI.Text>
          </Subtitle>
          <Preview if={preview && !children}>
            {typeof preview !== 'string' && preview}
            <UI.Text
              if={typeof preview === 'string'}
              alpha={isSelected ? 0.85 : 0.6}
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
          {typeof children === 'function'
            ? children(contentProps, { background })
            : children}
          {people && people.length && people[0].data.profile ? (
            <div>
              <PeopleRow people={people} />
            </div>
          ) : null}
        </Card>
        {/* Keep this below card because Masonry uses a simple .firstChild to measure */}
        <UI.HoverGlow
          if={!listItem}
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
      ...props
    } = this.props
    // debounceLog(`${(bit && bit.id) || props.title}.${pane} ${store.isSelected}`)
    if (!bit) {
      return this.getOrbitCard(props)
    }
    store.isSelected
    return (
      <BitResolver
        searchStore={searchStore}
        bit={bit}
        isExpanded={this.isExpanded}
        {...itemProps}
      >
        {this.getOrbitCard}
      </BitResolver>
    )
  }
}
