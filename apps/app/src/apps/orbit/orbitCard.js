import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import Overdrive from '@mcro/overdrive'
import OrbitIcon from './orbitIcon'
import OrbitCardContent from './orbitCardContent'

@view
class Text {
  render(props) {
    return <UI.Text size={1.1} css={{ marginBottom: 10 }} {...props} />
  }
}

class OrbitCardStore {
  get isSelected() {
    return this.props.appStore.activeIndex === this.props.index
  }

  @react({ delayValue: true })
  wasSelected = [() => this.isSelected, _ => _]
}

@view.attach('appStore')
@view({
  store: OrbitCardStore,
})
export default class OrbitCard {
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
    theme,
  }) {
    const { isSelected, wasSelected } = store
    return (
      <Overdrive parentElement={parentElement}>
        {({ AnimateElement }) => {
          // TODO: content height should determing large height
          const tallHeight = Math.min(450, Math.max(300, totalHeight / 2))
          const smallHeight = Math.max(
            100,
            (totalHeight - tallHeight) / Math.max(1, total - 1),
          )
          const height = isSelected ? tallHeight : smallHeight
          const shouldResizeText = wasSelected !== isSelected
          const textProps = {
            ellipse: true,
            measure: shouldResizeText,
            style: {
              flex: 1,
              lineHeight: '1.35rem',
            },
          }
          const PreviewText = props => <Text {...textProps} {...props} />
          const willTransition = false
          return (
            <AnimateElement id={`${result.id}`}>
              <cardWrap
                css={{ height }}
                ref={getRef}
                onClick={() => appStore.pinSelected(index, 'click')}
                {...appStore.getHoverProps({ result, id: index })}
              >
                <card
                  $cardHovered={this.hovered && willTransition}
                  onMouseEnter={this.setHovered}
                  onMouseLeave={this.setUnhovered}
                >
                  <UI.HoverGlow
                    if={false}
                    opacity={0.5}
                    full
                    resist={50}
                    scale={1}
                    blur={45}
                    color={theme.base.background.lighten(0.05)}
                    borderRadius={10}
                    behind
                    durationIn={500}
                    durationOut={100}
                  />
                  <AnimateElement id={`${result.id}-title`}>
                    <title
                      css={{ flexFlow: 'row', justifyContent: 'space-between' }}
                    >
                      <Text
                        size={isSelected ? 1.35 : 1.2}
                        ellipse={isSelected ? 2 : 1}
                        fontWeight={400}
                        css={{
                          marginBottom: 0,
                          maxWidth: `calc(100% - 30px)`,
                        }}
                      >
                        {result.title}
                      </Text>
                      <OrbitIcon
                        if={result.icon || result.integration}
                        size={16}
                        icon={
                          result.icon
                            ? `/icons/${result.icon}`
                            : result.integration
                        }
                        size={18}
                        css={{
                          marginLeft: 0,
                          marginTop: 3,
                        }}
                      />
                    </title>
                  </AnimateElement>
                  <AnimateElement id={`${result.id}-content`}>
                    <content
                      css={{
                        flex: 1,
                        opacity: 0.8,
                        overflow: 'hidden',
                      }}
                    >
                      <OrbitCardContent result={result} Text={PreviewText} />
                    </content>
                  </AnimateElement>
                  <AnimateElement id={`${result.id}-bottom`}>
                    <bottom>
                      <orbital />
                      <Text
                        opacity={0.5}
                        size={0.9}
                        css={{ marginBottom: 3, paddingTop: 10 }}
                      >
                        via{' '}
                        <UI.Icon
                          name={result.integration}
                          size={7}
                          css={{
                            display: 'inline-block',
                            opacity: 0.5,
                            margin: [0, 2],
                          }}
                        />
                        &nbsp;
                        {result.integration}
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
    },
    cardWrap: {
      padding: [0, 5, 3],
      position: 'relative',
    },
    card: {
      flex: 1,
      borderRadius: 7,
      padding: 12,
      overflow: 'hidden',
      position: 'relative',
      transform: {
        z: 0,
      },
    },
    cardHovered: {},
    bottom: {
      flexFlow: 'row',
      alignItems: 'center',
      // justifyContent: 'center',
      // flex: 1,
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
