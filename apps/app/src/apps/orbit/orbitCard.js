import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitIcon } from './orbitIcon'
import bitContents from '~/components/bitContents'
import { SmallLink } from '~/views'
import { TimeAgo } from '~/views/TimeAgo'
import * as BitActions from '~/actions/BitActions'
import { PeopleRow } from '~/components/PeopleRow'
import { Desktop } from '@mcro/stores'

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
      scale: 2.5,
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
      await sleep()
      if (!this.target) {
        throw new Error(
          `No target! ${this.props.pane} ${this.props.subPane} ${
            this.props.index
          }`,
        )
      }
      this.props.appStore.setTarget(this.target, this.ref)
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
    borderRadius: 8,
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
    } = this.props
    const { isExpanded } = this
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
        >
          <UI.HoverGlow
            behind
            color="#000"
            resist={93}
            scale={0.98}
            offsetTop={18}
            full
            blur={8}
            inverse
            opacity={isSelected ? 0.07 : 0}
            borderRadius={20}
          />
          <card onDoubleClick={this.handleDoubleClick}>
            {orbitIcon}
            <title>
              <UI.Text
                size={1.3}
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
              <UI.Text if={date} onClick={permalink} size={0.95}>
                <TimeAgo date={date} />
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
      padding: 18,
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

  static theme = ({ style, store, listItem, borderRadius, inGrid }, theme) => {
    const { isSelected } = store
    let hoveredStyle
    let card = {
      borderRadius,
      flex: inGrid ? 1 : 'none',
      height: (style && style.height) || 'auto',
    }
    if (listItem) {
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
        }
      }
      card = {
        ...card,
        ...listStateStyle,
        margin: [0, -12],
        padding: [18, 20],
        borderTop: [1, theme.hover.background],
      }
    } else {
      const border = [1, '#fff']
      if (isSelected) {
        card = {
          ...card,
          border,
          // border: [1, '#ddd'],
          background: '#fff',
          boxShadow: [[[0, 2, 3, [0, 0, 0, 0.03]]]],
        }
      } else {
        card = {
          ...card,
          border,
          background: '#fff',
          boxShadow: [[0, 2, 3, [0, 0, 0, 0.03]]],
        }
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
