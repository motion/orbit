import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitIcon } from './orbitIcon'
import bitContents from '~/components/bitContents'
import { SmallLink } from '~/views'
import { TimeAgo } from '~/views/TimeAgo'
import * as BitActions from '~/actions/BitActions'
import { PeopleRow } from '~/components/PeopleRow'
import { Desktop } from '@mcro/all'

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

  handleClick = e => {
    if (this.props.onClick) {
      this.props.onClick(e)
    }
    if (this.props.inactive) {
      return
    }
    this.props.appStore.toggleSelected(this.props.index)
  }

  setRef = ref => {
    if (!ref) return
    this.ref = ref
    if (this.props.getRef) {
      this.props.getRef(ref)
    }
  }

  get isOnDeck() {
    return (
      this.props.index === 0 &&
      this.isPaneSelected &&
      this.props.appStore.activeIndex === -1
    )
  }

  setPeekTargetOnNextIndex = react(
    () => [
      this.props.appStore.nextIndex === this.props.index,
      this.isPaneSelected,
    ],
    async ([shouldSelect, isPaneSelected], { sleep }) => {
      if (!Desktop.hoverState.orbitHovered) {
        throw react.cancel
      }
      if (
        !shouldSelect ||
        !isPaneSelected ||
        typeof this.props.index === 'undefined'
      ) {
        if (this._isSelected) {
          this._isSelected = false
        }
        throw react.cancel
      }
      this._isSelected = true
      await sleep(10)
      this.props.appStore.setTarget(
        this.props.bit || this.props.result,
        this.ref,
      )
    },
    { immediate: true },
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
    if (!this.props.bit) {
      return
    }
    BitActions.open(this.props.bit)
  }

  getOrbitCard(contentProps) {
    const {
      title,
      via,
      icon,
      preview,
      location,
      subtitle,
      permalink,
      date,
      people,
    } = contentProps
    const {
      store,
      tiny,
      listItem,
      style,
      hoverToSelect,
      selectedTheme,
      afterTitle,
      children,
      theme,
      titleProps,
      orbitStore,
      inactive,
      iconProps,
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
        {...iconProps}
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
          {...hoverToSelect && !inactive && this.hoverSettler.props}
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
              <permalink if={permalink}>{permalink}</permalink>
            </subtitle>
            <preview if={preview && !children}>
              {typeof preview !== 'string' && preview}
              <UI.Text
                if={typeof preview === 'string'}
                alpha={isSelected ? 0.85 : 0.6}
                size={listItem ? 1.1 : 1.3}
                sizeLineHeight={0.9}
                $previewText
              >
                {preview.split(' ').map((word, i) => (
                  <React.Fragment key={i}>
                    <SmallLink orbitStore={orbitStore}>{word}</SmallLink>{' '}
                  </React.Fragment>
                ))}
              </UI.Text>
            </preview>
            {typeof children === 'function'
              ? children(contentProps, { background })
              : children}
            <bottom if={people && people.length && people[0].data.profile}>
              <PeopleRow people={people} />
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
    store.isOnDeck
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
      flexFlow: 'row',
      justifyContent: 'space-between',
    },
    preview: {
      flex: 1,
    },
    permalink: {
      margin: [-2, -2, 0, 8],
    },
    orbitIcon: {
      position: 'absolute',
      top: 0,
      right: 0,
      margin: [0, 6, 0, 0],
      // filter: 'grayscale(100%)',
      opacity: 0.8,
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
    const { isSelected, isOnDeck } = store
    let hoveredStyle
    let card
    if (listItem) {
      hoveredStyle = {
        background: theme.selected.background,
      }
      let listStateStyle
      if (isOnDeck) {
        listStateStyle = {
          background: theme.base.background.darken(0.01),
          '&:hover': hoveredStyle,
        }
      } else if (isSelected) {
        listStateStyle = {
          background: theme.selected.background,
          '&:hover': hoveredStyle,
        }
      } else {
        listStateStyle = {
          background: 'transparent',
          '&:hover': {
            background: theme.hover.background,
          },
        }
      }
      card = {
        ...listStateStyle,
        margin: [0, -12],
        padding: [18, 20],
        borderTop: [1, theme.hover.background],
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
