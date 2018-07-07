import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitIcon } from './orbitIcon'
import { BitResolver } from '~/components/BitResolver'
import { SmallLink } from '~/views'
import { TimeAgo } from '~/views/TimeAgo'
import * as BitActions from '~/actions/BitActions'
import { App } from '@mcro/stores'
import { PeopleRow } from '~/components/PeopleRow'

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
  orbitIconStyle: { marginRight: 6 },
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
    if (this.props.onSelect) {
      this.props.onSelect(e.currentTarget)
      return
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

  get target() {
    return this.props.bit || this.props.result
  }

  setPeekTargetOnNextIndex = react(
    () => [this.props.appStore.nextIndex, this.isPaneSelected],
    async ([nextIndex, isPaneSelected], { sleep }) => {
      if (!isPaneSelected) {
        throw react.cancel
      }
      const shouldSelect = nextIndex === this.props.index
      if (shouldSelect !== this._isSelected) {
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
          App.actions.selectItem(this.target, this.ref)
        }
      }
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
    borderRadius: 7,
    hide: {},
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
      iconProps: contentIconProps,
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
      hide,
      className,
    } = this.props
    const hasSubtitle = !tiny && (subtitle || location)
    const orbitIcon = (
      <OrbitIcon
        if={icon && !hide.icon}
        icon={icon}
        size={hasSubtitle ? 14 : 18}
        $orbitIcon
        {...orbitIconProps}
        {...tiny && tinyProps.iconProps}
        {...contentIconProps}
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
            zIndex: isSelected ? 5 : 4,
          }}
          ref={store.setRef}
          onClick={store.handleClick}
          {...hoverToSelect && !inactive && this.hoverSettler.props}
          style={style}
          className={className}
        >
          <card onDoubleClick={this.handleDoubleClick}>
            {orbitIcon}
            <title>
              <UI.Text
                size={listItem ? 1.15 : 1.25}
                sizeLineHeight={0.85}
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
              <UI.Text if={location}>in&nbsp;{location}</UI.Text>
              <UI.Text
                if={typeof subtitle === 'string'}
                ellipse={1}
                css={{ maxWidth: 'calc(100% - 40px)' }}
              >
                {subtitle}
              </UI.Text>
              {typeof subtitle !== 'string' && subtitle}
              <UI.Text if={date} onClick={permalink} size={0.95}>
                <strong> &middot;</strong> <TimeAgo date={date} />
              </UI.Text>
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
                {preview
                  // .replace('feeling sick /', 'feeling better need actor')
                  // .replace('site remove site', 'site update logo fix')
                  // .replace(
                  //   'day stack generally set',
                  //   'good day setup stack generally familiar',
                  // )
                  // .replace('bit found', 'longer than expected found it')
                  // .replace(
                  //   'happening database',
                  //   'happening twice only database',
                  // )
                  .slice(0, 220)
                  .split(' ')
                  .map((word, i) => (
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
          {/* Keep this below card because Masonry uses a simple .firstChild to measure */}
          <UI.HoverGlow
            if={!listItem}
            behind
            color="#000"
            resist={90}
            scale={0.99}
            offsetTop={18}
            full
            blur={8}
            inverse
            opacity={isSelected ? 0.075 : 0}
            borderRadius={20}
          />
        </cardWrap>
      </UI.Theme>
    )
  }

  render({ pane, appStore, bit, store, itemProps, inGrid, ...props }) {
    debounceLog(`${(bit && bit.id) || props.title}.${pane} ${store.isSelected}`)
    if (!bit) {
      return this.getOrbitCard(props)
    }
    store.isSelected
    return (
      <BitResolver
        appStore={appStore}
        bit={bit}
        isExpanded={this.isExpanded}
        {...itemProps}
      >
        {this.getOrbitCard}
      </BitResolver>
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
      transition: 'all ease-in 80ms',
      padding: [16, 18],
      transform: {
        z: 0,
      },
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

  static theme = (
    { style, store, listItem, borderRadius, inGrid, hoverable },
    theme,
  ) => {
    const { isSelected } = store
    let hoveredStyle
    let card = {
      flex: inGrid ? 1 : 'none',
      height: (style && style.height) || 'auto',
    }
    if (listItem) {
      // LIST ITEM
      hoveredStyle = {
        background: theme.selected.background,
      }
      let listStateStyle
      if (isSelected) {
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
          '&:active': {
            background: theme.active.background,
          },
        }
      }
      card = {
        ...card,
        ...listStateStyle,
        margin: [0, -14],
        padding: [16, 20],
        borderTop: [1, theme.hover.background],
      }
    } else {
      // CARD
      card = {
        ...card,
        border: [1, '#fff'],
        borderRadius,
        background: theme.selected.background,
        boxShadow: [[0, 1, 1, [0, 0, 0, 0.03]]],
        '&:hover': {
          border: [1, 'rgb(51.3%, 65.7%, 88.6%)'],
        },
      }
      if (isSelected) {
        // can add selected styles...
      }
    }
    if (hoverable) {
      card.opacity = 0.7
      card.transition = card.transition || 'opacity ease-in 300ms'
      card['&:hover'] = {
        ...card['&:hover'],
        opacity: 1,
      }
    }
    return {
      card,
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
