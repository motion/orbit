import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import Overdrive from '@mcro/overdrive'

@view
class Text {
  render(props) {
    return <UI.Text size={1.1} css={{ marginBottom: 10 }} {...props} />
  }
}

class OrbitCardStore {
  get isSelected() {
    return this.props.appStore.selectedIndex === this.props.index
  }

  @react({ delayValue: true })
  wasSelected = [() => this.isSelected, _ => _]
}

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
    result,
    totalHeight,
    total,
    index,
    parentElement,
    getHoverProps,
    store,
  }) {
    store.isSelected
    if (!parentElement) {
      return null
    }
    return (
      <Overdrive parentElement={parentElement}>
        {({ AnimateElement }) => {
          const { isSelected, wasSelected } = store
          const tallHeight = 400
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
          const willTransition = false
          return (
            <AnimateElement id={`${result.id}`}>
              <cardWrap
                css={{ height }}
                {...getHoverProps({ result, id: index })}
              >
                <card
                  $cardHovered={this.hovered && willTransition}
                  onMouseEnter={this.setHovered}
                  onMouseLeave={this.setUnhovered}
                >
                  <AnimateElement id={`${result.id}-title`}>
                    <Text
                      size={isSelected ? 1.35 : 1.2}
                      ellipse={isSelected ? 2 : 1}
                      fontWeight={400}
                      css={{ marginBottom: 0 }}
                    >
                      {result.title}
                    </Text>
                  </AnimateElement>
                  <content
                    css={{
                      flex: 1,
                      opacity: 0.8,
                      overflow: 'hidden',
                    }}
                  >
                    <AnimateElement id={`${result.id}-text`}>
                      <Text {...textProps} css={{ maxHeight: '100%' }}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Ratione modi optio at neque ducimus ab aperiam dolores
                        nemo? Quod quos nisi molestias velit reprehenderit
                        veniam dicta, voluptatum vel voluptas a? Lorem ipsum
                        dolor sit amet consectetur adipisicing elit. Ratione
                        modi optio at neque ducimus ab aperiam dolores nemo?
                        Quod quos nisi molestias velit reprehenderit veniam
                        dicta, voluptatum vel voluptas a? Lorem ipsum dolor sit
                        amet consectetur adipisicing elit. Ratione modi optio at
                        neque ducimus ab aperiam dolores nemo? Quod quos nisi
                        molestias velit reprehenderit veniam dicta, voluptatum
                        vel voluptas a?
                      </Text>
                    </AnimateElement>
                  </content>
                  <AnimateElement id={`${result.id}-bottom`}>
                    <Text
                      opacity={0.5}
                      size={0.9}
                      css={{ marginBottom: 3, paddingTop: 10 }}
                    >
                      via{' '}
                      <UI.Icon
                        name="mail"
                        size={10}
                        css={{ display: 'inline-block' }}
                      />
                      &nbsp;
                      <UI.Date>{result.bitUpdatedAt}</UI.Date>
                    </Text>
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
    cardWrap: {
      padding: [0, 6, 6],
      position: 'relative',
    },
    card: {
      flex: 1,
      borderRadius: 7,
      padding: 12,
      overflow: 'hidden',
    },
    cardHovered: {},
  }

  static theme = ({ store }, theme) => {
    const hoveredStyle = {
      background: store.isSelected
        ? theme.activeHover.background
        : theme.hover.background,
    }
    return {
      card: {
        background: store.isSelected ? theme.active.background : 'transparent',
        '&:hover': hoveredStyle,
      },
      cardHovered: hoveredStyle,
    }
  }
}
