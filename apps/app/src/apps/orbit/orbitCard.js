import * as React from 'react'
import { view, react } from '@mcro/black'
import { Electron } from '@mcro/all'
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
  get isSelected() {
    return this.props.appStore.activeIndex === this.props.index
  }

  @react({ delayValue: true })
  wasSelected = [() => this.isSelected, _ => _]
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

  setHovered = () => {
    this.hovered = true
  }

  setUnhovered = () => {
    this.hovered = false
  }

  render({
    appStore,
    result,
    totalHeight,
    total,
    index,
    parentElement,
    store,
    getRef,
    tiny,
    listItem,
    borderRadius: borderRadius_,
    style,
    hoverToSelect,
  }) {
    const BitContent = bitContents(result)
    const borderRadius = listItem && tiny ? 4 : listItem ? 0 : borderRadius_
    store.isSelected
    const { isSelected } = store
    const isExpanded = isSelected && !tiny
    return (
      <UI.Theme name={isExpanded && !listItem ? 'light' : 'tan'}>
        <BitContent appStore={appStore} result={result} isExpanded={isExpanded}>
          {({
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
          }) => (
            <cardWrap
              css={{
                padding: listItem ? 0 : [0, 5, 3],
                zIndex: isExpanded ? 5 : 4,
              }}
              ref={getRef}
              onClick={() => appStore.toggleSelected(index)}
              {...hoverToSelect &&
                appStore.getHoverProps({ result, id: index })}
              style={style}
            >
              <UI.HoverGlow
                if={false && !listItem && isExpanded}
                hide={!isExpanded || !Electron.orbitState.mouseOver}
                behind
                resist={85}
                scale={0.85}
                width={300 - 30}
                blur={25}
                inverse
                offsetTop={4}
                color={[0, 0, 0]}
                opacity={0.06}
                borderRadius={5}
                duration={450}
              />
              <card
                $cardHovered={this.hovered}
                css={{
                  padding: tiny ? [6, 8] : 12,
                  borderRadius,
                }}
                onMouseEnter={this.setHovered}
                onMouseLeave={this.setUnhovered}
              >
                <title>
                  <Text
                    size={1.2}
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
                  <OrbitIcon
                    if={icon}
                    icon={icon}
                    size={16}
                    $icon
                    css={{
                      filter: isExpanded ? 'none' : 'grayscale(100%)',
                      opacity: isExpanded ? 1 : 0.25,
                    }}
                    {...tiny && tinyProps.iconProps}
                  />
                </title>
                <SubTitle $subtitle if={!tiny && typeof subtitle === 'string'}>
                  {subtitle}
                </SubTitle>
                <subtitle if={!tiny && typeof subtitle === 'object'}>
                  {subtitle}
                </subtitle>
                <content>
                  <UI.Text
                    if={!tiny && !isSelected}
                    $preview
                    opacity={0.75}
                    ellipse={2}
                  >
                    {location} {preview}
                  </UI.Text>
                  <subtitle
                    if={!tiny && isSelected}
                    css={{ flexFlow: 'row', opacity: 0.5 }}
                  >
                    {location}
                  </subtitle>
                  <full if={!tiny && isSelected}>{content}</full>
                </content>
                <bottom if={!tiny}>
                  {permalink}
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
          )}
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
    preview: {
      margin: [3, 0],
    },
    content: {
      flex: 1,
      // overflow: 'hidden',
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
