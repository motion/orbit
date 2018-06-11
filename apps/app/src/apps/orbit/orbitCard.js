import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitIcon } from './orbitIcon'
import bitContents from '~/components/bitContents'
import { TimeAgo } from '~/views/TimeAgo'
import * as BitActions from '~/actions/BitActions'

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
    const { isExpanded } = this.props
    if (typeof isExpanded === 'boolean') {
      return isExpanded
    }
    return (
      (this.props.store.isSelected && !this.props.tiny) ||
      (this.props.listItem && this.props.store.isSelected)
    )
  }

  handleDoubleClick = () => {
    BitActions.open(this.props.bit)
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
          <card onDoubleClick={this.handleDoubleClick}>
            {orbitIcon}
            <title>
              <UI.Text
                size={1.35}
                sizeLineHeight={0.8}
                ellipse={2}
                alpha={isSelected ? 1 : 0.8}
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
              <UI.Text if={location}>in {location}&nbsp;&nbsp;</UI.Text>
              <UI.Text
                if={typeof subtitle === 'string'}
                ellipse={1}
                css={{ maxWidth: 'calc(100% - 115px)' }}
              >
                {subtitle}
              </UI.Text>
              {typeof subtitle !== 'string' && subtitle}
              <space $$flex />
              <UI.Text if={date} size={0.95}>
                <TimeAgo date={date} />
              </UI.Text>
            </subtitle>
            <preview if={preview && !children}>
              {typeof preview !== 'string' && preview}
              <UI.Text
                if={typeof preview === 'string'}
                alpha={isSelected ? 0.85 : 0.65}
                size={listItem ? 1.1 : 1.6}
                sizeLineHeight={0.9}
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
      padding: [18, 12],
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
      margin: [-1, 0, 0],
      opacity: 0.4,
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

  static theme = ({ store, listItem, borderRadius, inGrid }, theme) => {
    const { isSelected } = store
    let hoveredStyle
    let card
    if (listItem) {
      hoveredStyle = {
        background: theme.selected.background,
      }
      const listCardStyle = {
        margin: [0, -12],
        padding: [18, 20],
        borderTop: [1, theme.hover.background],
      }
      card = isSelected
        ? {
            ...listCardStyle,
            background: theme.selected.background,
            '&:hover': hoveredStyle,
          }
        : {
            ...listCardStyle,
            background: 'transparent',
            '&:hover': {
              background: theme.hover.background,
            },
          }
    } else {
      const borderTop = [1, isSelected ? 'transparent' : theme.hover.background]
      hoveredStyle = {
        background: isSelected
          ? theme.selected.background
          : theme.hover.background,
      }
      card = {
        // background: theme.base.background,
        borderTop,
        '&:hover': hoveredStyle,
      }
      if (isSelected) {
        card = {
          borderTop,
          background: '#fff',
          boxShadow: [[0, 3, 12, [0, 0, 0, 0.08]]],
        }
      }
    }
    return {
      card: {
        borderRadius,
        flex: inGrid ? 1 : 'none',
        ...card,
      },
      bottom: {
        opacity: isSelected ? 1 : 0.5,
      },
      preview: {
        margin: inGrid ? ['auto', 0] : 0,
        padding: [8, 0, 0],
      },
      previewText: {
        margin: inGrid ? ['auto', 0] : 0,
      },
    }
  }
}
