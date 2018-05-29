import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitIcon } from './orbitIcon'
import bitContents from '~/components/bitContents'
import { App } from '@mcro/all'

let loggers = []
let nextLog = null
const debounceLog = (...args) => {
  loggers.push([...args])
  clearTimeout(nextLog)
  nextLog = setTimeout(() => {
    log('**', loggers.length, loggers.join(' -- '))
    loggers = []
    nextLog = null
  }, 16)
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
    return this.props.appStore.selectedPane === this.props.pane
  }

  handleClick = () => {
    this.props.appStore.toggleSelected(this.props.index)
  }

  setRef = ref => {
    if (!ref) return
    this.ref = ref
    if (this.props.getRef) {
      this.props.getRef(ref)
    }
  }

  setPeekTargetOnNextIndex = react(
    () => this.props.appStore.nextIndex === this.props.index,
    shouldSelect => {
      if (!this.isPaneSelected || !shouldSelect) {
        throw react.cancel
      }
      this.props.appStore.setTarget(this.props.bit, this.ref)
    },
  )

  updateIsSelected = react(
    () => [
      this.isPaneSelected,
      this.props.appStore.activeIndex,
      App.state.peekState.target,
    ],
    ([paneSelected, index]) => {
      if (!paneSelected) {
        throw react.cancel
      }
      const isSelected = index === this.props.index
      if (isSelected !== this._isSelected) {
        this._isSelected = isSelected
      }
    },
    { immediate: true, log: false },
  )
}

const tinyProps = {
  titleProps: {
    size: 1,
  },
  iconProps: {
    size: 14,
    style: {
      marginTop: 1,
      marginLeft: 15,
    },
  },
}

@view.attach('appStore')
@view({
  store: OrbitCardStore,
})
export class OrbitCard extends React.Component {
  static defaultProps = {
    borderRadius: 4,
  }

  constructor(...args) {
    super(...args)
    this.getOrbitCard = this.getOrbitCard.bind(this)
    const { appStore, hoverToSelect } = this.props
    if (hoverToSelect) {
      this.hoverSettler = appStore.getHoverSettler()
      this.hoverSettler.setItem({
        index: this.props.index,
      })
    }
  }

  get isExpanded() {
    this.props.store.isSelected
    const expanded = this.props.expanded
    if (typeof expanded === 'boolean') {
      return expanded
    }
    return (
      (this.props.store.isSelected && !this.props.tiny) ||
      (this.props.listItem && this.props.store.isSelected)
    )
  }

  getOrbitCard({
    bottom,
    bottomAfter,
    title,
    via,
    icon,
    preview,
    location,
    subtitle,
    permalink,
    date,
  }) {
    const { store, tiny, listItem, style, hoverToSelect, bit } = this.props
    const isExpanded = this.isExpanded
    const hasSubtitle = !tiny && (subtitle || location)
    const orbitIcon = (
      <OrbitIcon
        if={icon}
        icon={icon}
        size={hasSubtitle ? 14 : 18}
        $orbitIcon
        {...tiny && tinyProps.iconProps}
      />
    )
    return (
      <UI.Theme
        theme={store.isSelected ? { color: 'blue', background: '#fff' } : null}
      >
        <cardWrap
          css={{
            zIndex: isExpanded ? 5 : 4,
          }}
          ref={store.setRef}
          onClick={store.handleClick}
          {...hoverToSelect && this.hoverSettler.props}
          style={style}
        >
          <card
            css={{
              padding: listItem ? 15 : tiny ? [6, 8] : [12, 14],
            }}
          >
            <title>
              <UI.Text
                size={1.4}
                sizeLineHeight={0.9}
                ellipse={2}
                fontWeight={400}
                css={{
                  maxWidth: 'calc(100% - 30px)',
                  marginBottom: 3,
                }}
                {...tiny && tinyProps.titleProps}
              >
                {title}
              </UI.Text>
              {!hasSubtitle && orbitIcon}
            </title>
            <preview if={preview}>
              {typeof preview !== 'string' && preview}
              <UI.Text
                if={typeof preview === 'string'}
                alpha={0.7}
                ellipse={5}
                size={listItem ? 1.1 : 1.4}
              >
                {preview}
              </UI.Text>
            </preview>
            <subtitle if={hasSubtitle}>
              {orbitIcon}
              <UI.Text if={typeof location === 'string'} opacity={0.7}>
                {location}&nbsp;&nbsp;
              </UI.Text>
              {typeof location !== 'string' && location}
              <UI.Text
                if={typeof subtitle === 'string'}
                color="#333"
                ellipse={1}
                css={{ maxWidth: 'calc(100% - 115px)', opacity: 0.8 }}
              >
                {subtitle}
              </UI.Text>
              {typeof subtitle !== 'string' && subtitle}
              <space $$flex />
              <UI.Text alpha={0.5} size={0.95}>
                {Math.floor(Math.random() * 5) + 1}m&nbsp;ago
              </UI.Text>
            </subtitle>
            <bottom if={false && !tiny && (bottom || permalink || via)}>
              <permalink if={isExpanded}>{permalink}</permalink>
              <space if={permalink} />
              {bottom}
              <UI.Date>{bit.bitUpdatedAt}</UI.Date>
              <Text if={via} opacity={0.5} size={0.9}>
                {via}
              </Text>
              <div $$flex />
              {bottomAfter}
            </bottom>
          </card>
        </cardWrap>
      </UI.Theme>
    )
  }

  render({ pane, appStore, bit, store, itemProps }) {
    debounceLog(`${bit.id}.${pane} ${store.isSelected}`)
    const BitContent = bitContents(bit)
    store.isSelected
    if (typeof BitContent !== 'function') {
      console.error('got a weird one', BitContent)
      return null
    }
    return (
      <BitContent
        appStore={appStore}
        bit={bit}
        isExpanded={this.isExpanded}
        {...itemProps}
      >
        {this.getOrbitCard}
      </BitContent>
    )
  }

  static style = {
    cardWrap: {
      position: 'relative',
      width: '100%',
      transform: {
        z: 0,
      },
    },
    card: {
      overflow: 'hidden',
      position: 'relative',
      maxHeight: '100%',
      transition: 'all ease-in 160ms',
    },
    title: {
      maxWidth: '100%',
      overflow: 'hidden',
      flexFlow: 'row',
      justifyContent: 'space-between',
    },
    cardHovered: {},
    preview: {
      flex: 1,
    },
    orbitIcon: {
      margin: [0, 6, 0, 0],
    },
    bottom: {
      opacity: 0.5,
      marginTop: 5,
      flexFlow: 'row',
      alignItems: 'center',
      userSelect: 'none',
      // justifyContent: 'center',
      // flex: 1,
    },
    subtitle: {
      margin: [8, 0, 0],
      height: 20,
      flexFlow: 'row',
      alignItems: 'center',
    },
    location: {
      flexFlow: 'row',
      opacity: 0.5,
    },
    space: {
      width: 6,
    },
  }

  static theme = ({ store, tiny, listItem, borderRadius }, theme) => {
    const { isSelected } = store
    const radius = isSelected
      ? borderRadius * 1.333
      : listItem && tiny
        ? 4
        : listItem
          ? 0
          : borderRadius
    let hoveredStyle
    let card
    if (listItem || tiny) {
      hoveredStyle = {
        background: theme.activeHover.background,
      }
      card = isSelected
        ? {
            background: theme.active.background,
            '&:hover': hoveredStyle,
          }
        : {
            background: 'transparent',
            '&:hover': {
              background: theme.hover.background,
            },
          }
    } else {
      hoveredStyle = {
        background: isSelected
          ? theme.selected.background
          : theme.hover.background,
      }
      card = {
        background: 'transparent',
        '&:hover': hoveredStyle,
      }
      if (isSelected) {
        card = {
          background: '#fff',
          boxShadow: [[0, 3, 12, [0, 0, 0, 0.05]]],
        }
      }
    }
    return {
      card: {
        borderRadius: radius,
        ...card,
        border: [
          listItem ? 0 : 1,
          isSelected ? 'transparent' : theme.hover.background,
        ],
      },
      bottom: {
        opacity: isSelected ? 1 : 0.5,
      },
    }
  }
}
