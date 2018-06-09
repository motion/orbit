import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitIcon } from './orbitIcon'
import bitContents from '~/components/bitContents'
import { TimeAgo } from '~/views/TimeAgo'

let loggers = []
let nextLog = null
const debounceLog = (...args) => {
  loggers.push([...args])
  clearTimeout(nextLog)
  nextLog = setTimeout(() => {
    log('render cards:', loggers.length, loggers.slice(0, 2).join(' -- '))
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
    if (!this.props.subPane) {
      return false
    }
    const isPaneActive = this.props.appStore.selectedPane === this.props.pane
    const isSubPaneActive =
      this.props.paneStore.activePane === this.props.subPane
    return isPaneActive && isSubPaneActive
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
    async (shouldSelect, { sleep }) => {
      if (!shouldSelect || !this.isPaneSelected) {
        this._isSelected = false
        throw react.cancel
      }
      this._isSelected = true
      await sleep(10)
      console.log('selecting', this.props, this)
      this.props.appStore.setTarget(this.props.bit, this.ref)
    },
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

@UI.injectTheme
@view.attach('appStore', 'paneStore')
@view({
  store: OrbitCardStore,
})
export class OrbitCard extends React.Component {
  static defaultProps = {
    borderRadius: 6,
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
    const {
      store,
      tiny,
      listItem,
      style,
      hoverToSelect,
      bit,
      selectedTheme,
      afterTitle,
      children,
      theme,
    } = this.props
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
    const { isSelected } = store
    const childTheme = isSelected && selectedTheme ? selectedTheme : null
    const background =
      (childTheme && childTheme.background) || theme.base.background
    return (
      <UI.Theme theme={childTheme}>
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
              padding: listItem ? 15 : tiny ? [6, 8] : 14,
            }}
          >
            <title>
              <UI.Text
                size={1.2}
                sizeLineHeight={0.75}
                ellipse={2}
                alpha={isSelected ? 1 : 0.8}
                fontWeight={500}
                css={{
                  maxWidth: 'calc(100% - 30px)',
                }}
                {...tiny && tinyProps.titleProps}
              >
                {title}
              </UI.Text>
              {!hasSubtitle && orbitIcon}
              {afterTitle}
            </title>
            <preview if={preview}>
              <previewOverflow
                if={false}
                $$fullscreen
                css={{
                  background: `linear-gradient(transparent 160px, ${background})`,
                  opacity: isSelected ? 1 : 0,
                  transition: isSelected ? 'all ease-in 160ms 160ms' : 'none',
                }}
              />
              {typeof preview !== 'string' && preview}
              <UI.Text
                if={typeof preview === 'string'}
                alpha={isSelected ? 0.75 : 0.5}
                ellipse={5}
                size={listItem ? 1.1 : 1.4}
                sizeLineHeight={0.9}
              >
                {preview}
              </UI.Text>
            </preview>
            <subtitle if={hasSubtitle}>
              {orbitIcon}
              <UI.Text if={location} opacity={0.7} alpha={0.8}>
                {location}&nbsp;&nbsp;
              </UI.Text>
              <UI.Text
                if={typeof subtitle === 'string'}
                ellipse={1}
                alpha={0.7}
                css={{ maxWidth: 'calc(100% - 115px)', opacity: 0.8 }}
              >
                {subtitle}
              </UI.Text>
              {typeof subtitle !== 'string' && subtitle}
              <space $$flex />
              <UI.Text if={date} alpha={0.5} size={0.95}>
                <TimeAgo date={date} />
              </UI.Text>
            </subtitle>
            {children}
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

  render({ pane, appStore, bit, store, itemProps, ...props }) {
    debounceLog(`${bit && bit.id}.${pane} ${store.isSelected}`)
    if (!bit) {
      return this.getOrbitCard(props)
    }
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
      transition: 'all ease-in 120ms',
    },
    title: {
      maxWidth: '100%',
      overflow: 'hidden',
      flexFlow: 'row',
      justifyContent: 'space-between',
    },
    preview: {
      flex: 1,
      maxHeight: 180,
      margin: [7, 0],
      overflow: 'hidden',
    },
    previewOverflow: {
      zIndex: 10,
      bottom: 40,
    },
    orbitIcon: {
      margin: [0, 6, 0, 0],
      filter: 'grayscale(90%)',
      opacity: 0.8,
    },
    bottom: {
      opacity: 0.5,
      flexFlow: 'row',
      alignItems: 'center',
      userSelect: 'none',
      // justifyContent: 'center',
      // flex: 1,
    },
    subtitle: {
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
        boxShadow: [0, 0, 0, [0, 0, 0, 0]],
        background: 'transparent',
        '&:hover': hoveredStyle,
      }
      if (isSelected) {
        card = {
          background: '#fff',
          boxShadow: [[0, 3, 7, [0, 0, 0, 0.08]]],
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
