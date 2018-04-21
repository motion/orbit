import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import OrbitIcon from './orbitIcon'
import bitContents from '~/components/bitContents'

const SubTitle = props => (
  <UI.Title size={0.9} opacity={0.7} ellipse={1} {...props} />
)

@view
class Text {
  render(props) {
    return <UI.Text size={1.1} {...props} />
  }
}

class OrbitCardStore {
  isSelected = false

  @react({ fireImmediately: true })
  updateIsSelected = [
    () => this.props.appStore.activeIndex,
    index => {
      const isSelected = index === this.props.index
      if (isSelected !== this.isSelected) {
        this.isSelected = isSelected
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
    borderRadius: 7,
  }

  hovered = false

  componentWillMount() {
    this.getOrbitCard = this.getOrbitCard.bind(this)
    const { appStore, index, result } = this.props
    this.hoverProps = appStore.getHoverProps({ result, id: index })
  }

  setHovered = () => {
    this.hovered = true
  }

  setUnhovered = () => {
    this.hovered = false
  }

  toggleSelected = () => {
    this.props.appStore.toggleSelected(this.props.index)
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
  }) {
    const {
      result,
      getRef,
      tiny,
      listItem,
      style,
      hoverToSelect,
      borderRadius: borderRadius_,
    } = this.props
    const borderRadius = listItem && tiny ? 4 : listItem ? 0 : borderRadius_
    const isExpanded = this.isExpanded
    return (
      <cardWrap
        css={{
          padding: listItem ? 0 : [0, 4, 3],
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
            padding: tiny ? [6, 8] : [9, 12],
            borderRadius,
          }}
          onMouseEnter={this.setHovered}
          onMouseLeave={this.setUnhovered}
        >
          <title>
            <Text
              size={1.1}
              ellipse={isExpanded ? 2 : 1}
              fontWeight={400}
              $titleText
              css={{
                marginBottom: isExpanded ? 2 : 0,
              }}
              {...tiny && tinyProps.titleProps}
            >
              {title}
            </Text>
          </title>
          <SubTitle $subtitle if={!tiny && typeof subtitle === 'string'}>
            {subtitle}
          </SubTitle>
          <subtitle if={!tiny && typeof subtitle === 'object'}>
            {subtitle}
          </subtitle>
          <preview
            if={preview && !isExpanded}
            css={{
              margin: [3, 0],
              flexFlow: 'row',
              alignItems: 'center',
            }}
          >
            <OrbitIcon
              if={icon}
              icon={icon}
              size={14}
              $icon
              css={{
                filter: isExpanded ? 'none' : 'grayscale(50%)',
                opacity: isExpanded ? 1 : 0.85,
                margin: [1, 8, -1, 0],
              }}
              {...tiny && tinyProps.iconProps}
            />
            <UI.Text>{location}</UI.Text>
            <UI.Text
              if={!tiny && !isExpanded}
              ellipse={1}
              css={{ maxWidth: 'calc(100% - 70px)', opacity: 0.8 }}
            >
              {preview}
            </UI.Text>
            <space $$flex />
            <date css={{ fontWeight: 700, width: 30, textAlign: 'right' }}>
              <UI.Text>2m</UI.Text>
            </date>
          </preview>
          <content if={content}>
            <subtitle
              if={!tiny && isExpanded}
              css={{ flexFlow: 'row', opacity: 0.5 }}
            >
              {location}
            </subtitle>
            <full if={!tiny && isExpanded}>{content}</full>
          </content>
          <bottom if={!tiny}>
            <permalink if={isExpanded}>{permalink}</permalink>
            <space if={permalink} />
            {bottom}
            <orbital if={false} />
            <UI.Date>{result.bitUpdatedAt}</UI.Date>
            <Text if={via} opacity={0.5} size={0.9}>
              {via || result.integration}
            </Text>
            <div $$flex />
            {bottomAfter}
          </bottom>
        </card>
      </cardWrap>
    )
  }

  render({ appStore, result, store, listItem, itemProps }) {
    const BitContent = bitContents(result)
    store.isSelected
    if (typeof BitContent !== 'function') {
      console.error('got a weird one', BitContent)
      return null
    }
    return (
      <UI.Theme name={this.isExpanded && !listItem ? 'light' : 'tan'}>
        <BitContent
          appStore={appStore}
          result={result}
          isExpanded={this.isExpanded}
          {...itemProps}
        >
          {this.getOrbitCard}
        </BitContent>
      </UI.Theme>
    )
  }

  static style = {
    cardWrap: {
      pointerEvents: 'all',
      position: 'relative',
      width: '100%',
      transform: {
        z: 0,
      },
    },
    card: {
      flex: 1,
      overflow: 'hidden',
      position: 'relative',
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
    titleText: {
      maxWidth: `calc(100% - 30px)`,
    },
    cardHovered: {},
    content: {
      flex: 1,
      overflow: 'hidden',
    },
    icon: {
      marginLeft: 0,
      marginTop: 3,
    },
    full: {
      padding: [2, 0],
    },
    bottom: {
      opacity: 0.5,
      marginTop: 4,
      flexFlow: 'row',
      alignItems: 'center',
      userSelect: 'none',
      // justifyContent: 'center',
      // flex: 1,
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
              ['inset', 0, 0, 0, 0.5, theme.active.background.darken(0.1)],
              [2, 0, 25, [0, 0, 0, 0.05]],
            ],
            margin: [0, -1],
          }
        : {
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
