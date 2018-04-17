import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import Overdrive from '@mcro/overdrive'
import OrbitIcon from './orbitIcon'
import orbitContent from './orbitCardContent'

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
  }) {
    const {
      title,
      postTitle,
      via,
      icon,
      content,
      subtitle,
      preview,
    } = orbitContent({ result, appStore })
    const maxHeight = totalHeight ? totalHeight : 400
    const borderRadius = listItem && tiny ? 4 : listItem ? 0 : borderRadius_
    store.isSelected
    return (
      <Overdrive parentElement={parentElement}>
        {({ AnimateElement }) => {
          const { isSelected } = store
          const isExpanded = isSelected && !tiny
          // TODO: content height should determing large height
          const tallHeight = 'auto'
          const smallHeight = Math.max(
            70,
            (maxHeight - 200) / Math.max(1, total - 1),
          )
          const height = 'auto' //tiny ? 'auto' : isExpanded ? tallHeight : smallHeight
          // const shouldResizeText = wasSelected !== isSelected
          const willTransition = false
          return (
            <AnimateElement id={`${result.id}`}>
              <cardWrap
                css={{
                  maxHeight: height,
                  height,
                  padding: listItem ? 0 : [0, 5, 3],
                }}
                ref={getRef}
                onClick={() => appStore.toggleSelected(index)}
                {...appStore.getHoverProps({ result, id: index })}
              >
                <card
                  $cardHovered={this.hovered && willTransition}
                  css={{
                    padding: tiny ? [6, 8] : 12,
                    borderRadius,
                  }}
                  onMouseEnter={this.setHovered}
                  onMouseLeave={this.setUnhovered}
                >
                  <UI.HoverGlow
                    if={isExpanded}
                    opacity={0.8}
                    full
                    resist={50}
                    scale={1}
                    blur={45}
                    color={'#fff'}
                    borderRadius={borderRadius}
                    behind
                    durationIn={500}
                    durationOut={100}
                  />
                  <AnimateElement id={`${result.id}-title`}>
                    <title>
                      <Text
                        size={isExpanded ? 1.35 : 1.2}
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
                      <posttitle if={postTitle}>{postTitle}</posttitle>
                      <OrbitIcon
                        if={icon}
                        icon={icon}
                        size={16}
                        $icon
                        {...tiny && tinyProps.iconProps}
                      />
                    </title>
                  </AnimateElement>
                  <SubTitle
                    $subtitle
                    if={!tiny && typeof subtitle === 'string'}
                  >
                    {subtitle}
                  </SubTitle>
                  <subtitle if={!tiny && typeof subtitle === 'object'}>
                    {subtitle}
                  </subtitle>
                  <AnimateElement
                    if={!tiny && content}
                    id={`${result.id}-content`}
                  >
                    <content>
                      <UI.Text
                        opacity={0.75}
                        ellipse={2}
                        if={!tiny && !isSelected}
                      >
                        {preview}
                      </UI.Text>
                      {!tiny && isSelected && content}
                    </content>
                  </AnimateElement>
                  <AnimateElement if={!tiny} id={`${result.id}-bottom`}>
                    <bottom>
                      <orbital if={false} />
                      <Text
                        opacity={0.5}
                        size={0.9}
                        css={{ marginBottom: 3, paddingTop: 10 }}
                      >
                        in {via || result.integration}
                        &nbsp;
                        <UI.Date>{result.bitUpdatedAt}</UI.Date>
                      </Text>
                    </bottom>
                  </AnimateElement>
                </card>
              </cardWrap>
            </AnimateElement>
          )
        }}
      </Overdrive>
    )
  }

  static style = {
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
    cardWrap: {
      position: 'relative',
    },
    card: {
      flex: 1,
      overflow: 'hidden',
      position: 'relative',
      transform: {
        z: 0,
      },
    },
    cardHovered: {},
    content: {
      flex: 1,
    },
    icon: {
      marginLeft: 0,
      marginTop: 3,
    },
    bottom: {
      flexFlow: 'row',
      alignItems: 'center',
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
  }

  static theme = ({ store }, theme) => {
    const { isSelected } = store
    const hoveredStyle = {
      background: isSelected
        ? theme.activeHover.background
        : theme.hover.background,
    }
    return {
      card: {
        background: isSelected ? theme.active.background : 'transparent',
        '&:hover': hoveredStyle,
      },
      cardHovered: hoveredStyle,
      bottom: {
        opacity: isSelected ? 1 : 0.5,
      },
      orbital: {
        background: theme.active.background.desaturate(0.1),
        border: [2, theme.active.background.desaturate(0.1).darken(0.1)],
      },
    }
  }
}
