import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import OrbitIcon from './orbitIcon'
import bitContents from '~/components/bitContents'
import { App } from '@mcro/all'
import * as OrbitHelpers from '~/apps/orbit/orbitHelpers'

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

  @react
  setPeekTargetOnNextIndex = [
    () => this.props.appStore.nextIndex === this.props.index,
    shouldSelect => {
      if (!this.isPaneSelected || !shouldSelect) {
        throw react.cancel
      }
      OrbitHelpers.setPeekTarget(this.props.bit, this.ref)
      this.props.appStore.finishSettingIndex()
    },
  ]

  @react({ immediate: true, log: false })
  updateIsSelected = [
    () => [this.props.appStore.activeIndex, App.state.peekState.target],
    ([index, target]) => {
      if (!this.isPaneSelected) {
        throw react.cancel
      }
      const isSelected = !target ? false : index === this.props.index
      if (isSelected !== this._isSelected) {
        this._isSelected = isSelected
      }
    },
  ]
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
export default class OrbitCard {
  static defaultProps = {
    borderRadius: 0,
  }

  componentWillMount() {
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
      borderRadius: borderRadius_,
    } = this.props
    const borderRadius = listItem && tiny ? 4 : listItem ? 0 : borderRadius_
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
            borderRadius,
          }}
        >
          <title>
            <UI.Text
              size={1.2}
              lineHeight="1.4rem"
              ellipse={2}
              fontWeight={400}
              css={{
                maxWidth: `calc(100% - 30px)`,
                marginBottom: 1,
              }}
              {...tiny && tinyProps.titleProps}
            >
              {title}
            </UI.Text>
            {!hasSubtitle && orbitIcon}
          </title>
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
            <space if={date} $$flex />
            <date
              if={date}
              css={{ fontWeight: 500, width: 30, textAlign: 'right' }}
            >
              <UI.Text opacity={0.5}>2m</UI.Text>
            </date>
          </subtitle>
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
    )
  }

  render({ pane, appStore, bit, store, itemProps }) {
    log(`render card ${bit.id} ${pane}`)
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
      // transition: 'all ease-in 2500ms',
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
      margin: [4, 0, 3],
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

  static theme = ({ store, tiny, listItem }, theme) => {
    const { isSelected } = store
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
      card = isSelected
        ? {
            background: '#fff',
            boxShadow: [
              ['inset', 0, 0, 0, 0.5, theme.active.background.darken(0.2)],
            ],
          }
        : {
            background: 'transparent',
            '&:hover': hoveredStyle,
          }
    }
    return {
      card: {
        ...card,
        borderTop: [listItem ? 1 : 1, theme.active.background],
      },
      bottom: {
        opacity: isSelected ? 1 : 0.5,
      },
    }
  }
}
