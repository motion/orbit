import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import OrbitIcon from './orbitIcon'
import bitContents from '~/components/bitContents'

const SubTitle = props => (
  <UI.Title size={0.9} opacity={0.7} ellipse={1} {...props} />
)

class OrbitCardStore {
  _isSelected = false

  get isSelected() {
    return typeof this.props.isSelected === 'boolean'
      ? this.props.isSelected
      : this._isSelected
  }

  @react({ fireImmediately: true, log: false })
  updateIsSelected = [
    () =>
      this.props.appStore.selectedPane === this.props.pane &&
      this.props.appStore.activeIndex,
    index => {
      // not selected
      if (index === false) {
        return
      }
      const isSelected = index === this.props.index
      if (isSelected !== this._isSelected) {
        console.log('set selected', index, this.props.pane, isSelected)
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
    borderRadius: 8,
  }

  hovered = false

  componentWillMount() {
    this.getOrbitCard = this.getOrbitCard.bind(this)
    const { appStore, index, bit } = this.props
    this.hoverProps = appStore.getHoverProps({ bit, id: index })
  }

  setHovered = () => {
    this.hovered = true
  }

  setUnhovered = () => {
    this.hovered = false
  }

  toggleSelected = () => {
    this.props.appStore.toggleSelected(this.props.index, this.props.item)
  }

  get isExpanded() {
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
    content,
    subtitle,
    location,
    preview,
    permalink,
    date,
  }) {
    const {
      getRef,
      tiny,
      listItem,
      style,
      hoverToSelect,
      bit,
      borderRadius: borderRadius_,
    } = this.props
    const borderRadius = listItem && tiny ? 4 : listItem ? 0 : borderRadius_
    const isExpanded = this.isExpanded
    const showPreview = !tiny && !isExpanded
    return (
      <cardWrap
        css={{
          zIndex: isExpanded ? 5 : 4,
        }}
        ref={getRef}
        onClick={this.toggleSelected}
        {...hoverToSelect && this.hoverProps}
        style={style}
      >
        <card
          $cardHovered={this.hovered}
          css={{
            padding: listItem ? [15, 12] : tiny ? [6, 8] : [9, 10],
            borderRadius,
          }}
          onMouseEnter={this.setHovered}
          onMouseLeave={this.setUnhovered}
        >
          <title>
            <UI.Text
              size={1.25}
              ellipse={isExpanded ? 2 : 1}
              fontWeight={400}
              css={{
                maxWidth: `calc(100% - 30px)`,
                marginBottom: 1,
              }}
              {...tiny && tinyProps.titleProps}
            >
              {title}
            </UI.Text>
          </title>
          <SubTitle $subtitle if={!tiny && typeof subtitle === 'string'}>
            {subtitle}
          </SubTitle>
          <subtitle if={!tiny && typeof subtitle === 'object'}>
            {subtitle}
          </subtitle>
          <preview if={preview}>
            <OrbitIcon
              if={icon}
              icon={icon}
              size={12}
              $icon
              css={{
                filter: isExpanded ? 'none' : 'grayscale(50%)',
                opacity: isExpanded ? 1 : 0.85,
              }}
              {...tiny && tinyProps.iconProps}
            />
            <UI.Text if={location} opacity={0.7}>
              {location}&nbsp;&nbsp;
            </UI.Text>
            <UI.Text
              if={showPreview && typeof preview === 'string'}
              ellipse={1}
              css={{ maxWidth: 'calc(100% - 115px)', opacity: 0.8 }}
            >
              {preview}
            </UI.Text>
            {typeof preview !== 'string' && preview}
            <space if={date} $$flex />
            <date
              if={date}
              css={{ fontWeight: 500, width: 30, textAlign: 'right' }}
            >
              <UI.Text opacity={0.5}>2m</UI.Text>
            </date>
          </preview>
          <content if={location || content}>
            <full if={content && !tiny && isExpanded}>
              {typeof content !== 'string' && content}
              <UI.Text if={typeof content === 'string'} ellipse={5}>
                {content}
              </UI.Text>
            </full>
          </content>
          <bottom if={!tiny && (bottom || permalink || via)}>
            <permalink if={isExpanded}>{permalink}</permalink>
            <space if={permalink} />
            {bottom}
            <orbital if={false} />
            <UI.Date>{bit.bitUpdatedAt}</UI.Date>
            <Text if={via} opacity={0.5} size={0.9}>
              {via || bit.integration}
            </Text>
            <div $$flex />
            {bottomAfter}
          </bottom>
        </card>
      </cardWrap>
    )
  }

  render({ appStore, bit, store, listItem, itemProps }) {
    const BitContent = bitContents(bit)
    store.isSelected
    if (typeof BitContent !== 'function') {
      console.error('got a weird one', BitContent)
      return null
    }
    const contents = (
      <BitContent
        appStore={appStore}
        bit={bit}
        isExpanded={this.isExpanded}
        {...itemProps}
      >
        {this.getOrbitCard}
      </BitContent>
    )
    if (this.isExpanded && store.isSelected && !listItem) {
      return <UI.Theme name="light">{contents}</UI.Theme>
    }
    return contents
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
    subtitle: {
      margin: [2, 0, 0],
    },
    cardHovered: {},
    content: {
      flex: 1,
    },
    icon: {
      margin: [-4, 8, 0, 0],
    },
    full: {
      padding: [2, 0],
    },
    bottom: {
      opacity: 0.5,
      marginTop: 3,
      flexFlow: 'row',
      alignItems: 'center',
      userSelect: 'none',
      // justifyContent: 'center',
      // flex: 1,
    },
    preview: {
      margin: [3, 0, 2],
      height: 22,
      flexFlow: 'row',
      alignItems: 'center',
      // justifyContent: 'center',
    },
    bottomIcon: {
      display: 'inline-block',
      opacity: 0.5,
      margin: [0, 2],
    },
    orbital: {
      width: 10,
      height: 10,
      margin: [0, 7, -4, 0],
      borderRadius: 4,
      position: 'relative',
    },
    location: {
      flexFlow: 'row',
      opacity: 0.5,
    },
    space: {
      width: 6,
    },
  }

  static theme = ({ index, store, tiny, listItem }, theme) => {
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
            border: [1, 'transparent'],
            background: '#fff',
            boxShadow: isSelected
              ? [
                  ['inset', 0, 0, 0, 0.5, theme.active.background.darken(0.2)],
                  // [2, 0, 25, [0, 0, 0, 0.05]],
                ]
              : null,
          }
        : {
            border: [1, theme.active.background],
            background: 'transparent',
            '&:hover': hoveredStyle,
          }
    }
    return {
      card,
      cardHovered: hoveredStyle,
      bottom: {
        opacity: isSelected ? 1 : 0.5,
      },
      orbital: {
        background: theme.selected.background.desaturate(0.1),
        border: [2, theme.selected.background.desaturate(0.1).darken(0.1)],
      },
    }
  }
}
