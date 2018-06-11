import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitIcon } from './orbitIcon'
import bitContents from '~/components/bitContents'
import { TimeAgo } from '~/views/TimeAgo'

@view.ui
class Link extends React.Component {
  handleClick = () => {
    this.props.orbitStore.setQuery(this.props.children)
  }

  render({ children }) {
    return <span onClick={this.handleClick}>{children}</span>
  }
  static style = {
    span: {
      borderBottom: [2, 'transparent'],
      '&:hover': {
        borderBottom: [2, 'solid', [0, 0, 0, 0.1]],
      },
    },
  }
}

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

const imageStyle = {
  transformOrigin: 'bottom right',
  transform: {
    y: -6 - 3,
    x: 20 + 3,
    scale: 2.5,
    rotate: '-45deg',
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
@view.attach('appStore', 'paneStore', 'orbitStore')
@view({
  store: OrbitCardStore,
})
export class OrbitCard extends React.Component {
  static defaultProps = {
    borderRadius: 8,
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
    const { isExpanded } = this.props
    if (typeof isExpanded === 'boolean') {
      return isExpanded
    }
    return (
      (this.props.store.isSelected && !this.props.tiny) ||
      (this.props.listItem && this.props.store.isSelected)
    )
  }

  getOrbitCard(contentProps) {
    const {
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
    } = contentProps
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
      titleProps,
      orbitStore,
    } = this.props
    const { isExpanded } = this
    const hasSubtitle = !tiny && (subtitle || location)
    const orbitIcon = (
      <OrbitIcon
        if={icon}
        icon={icon}
        size={hasSubtitle ? 14 : 18}
        $orbitIcon
        imageStyle={imageStyle}
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
              padding: listItem ? 15 : tiny ? [6, 8] : [12, 14, 10],
            }}
          >
            {orbitIcon}
            <title>
              <UI.Text
                size={1.45}
                sizeLineHeight={0.8}
                ellipse={2}
                alpha={isSelected ? 1 : 0.7}
                fontWeight={500}
                css={{
                  maxWidth: 'calc(100% - 30px)',
                }}
                {...tiny && tinyProps.titleProps}
                {...titleProps}
              >
                {title}
              </UI.Text>
              {afterTitle}
            </title>
            <subtitle if={hasSubtitle}>
              <UI.Text if={location} opacity={0.7} alpha={0.8}>
                in {location}&nbsp;&nbsp;
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
            <preview if={preview && !children}>
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
                alpha={isSelected ? 0.75 : 0.55}
                size={listItem ? 1.1 : 1.6}
                sizeLineHeight={0.85}
                $previewText
              >
                {preview.split(' ').map((word, i) => (
                  <React.Fragment key={i}>
                    <Link orbitStore={orbitStore}>{word}</Link>{' '}
                  </React.Fragment>
                ))}
              </UI.Text>
            </preview>
            {typeof children === 'function'
              ? children(contentProps, { background })
              : children}
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

  render({ pane, appStore, bit, store, itemProps, inGrid, ...props }) {
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
    },
    previewOverflow: {
      zIndex: 10,
      bottom: 40,
    },
    orbitIcon: {
      position: 'absolute',
      top: 0,
      right: 0,
      margin: [0, 6, 0, 0],
      // filter: 'grayscale(100%)',
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
      padding: [3, 0, 0],
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

  static theme = ({ store, tiny, listItem, borderRadius, inGrid }, theme) => {
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
        // boxShadow: [[0, 0, 0, 0.5, [0, 0, 0, 1]]],
        // background: theme.base.background.lighten(0.1).alpha(0.5),
        '&:hover': hoveredStyle,
      }
      if (isSelected) {
        card = {
          background: '#fff',
          boxShadow: [[0, 3, 12, [0, 0, 0, 0.08]]],
        }
      }
    }
    return {
      card: {
        borderRadius: radius,
        flex: inGrid ? 1 : 'none',
        ...card,
        border: [
          listItem ? 0 : 1,
          isSelected ? 'transparent' : theme.hover.background.darken(0.01),
        ],
      },
      bottom: {
        opacity: isSelected ? 1 : 0.5,
      },
      preview: {
        margin: inGrid ? ['auto', 0] : 0,
        padding: inGrid ? 0 : [4, 0],
      },
      previewText: {
        margin: inGrid ? ['auto', 0] : 0,
      },
    }
  }
}
