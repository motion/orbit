import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import Overdrive from '@mcro/overdrive'

@view
class Text {
  render(props) {
    return <UI.Text size={1.1} css={{ marginBottom: 10 }} {...props} />
  }
}

@view({
  store: class OrbitCardStore {
    get isSelected() {
      return this.props.appStore.selectedIndex === this.props.index
    }

    @react({ delayValue: true })
    wasSelected = [() => this.isSelected, _ => _]
  },
})
export default class OrbitCard {
  hovered = false

  setHovered = () => {
    this.hovered = true
  }

  setUnhovered = () => {
    this.hovered = false
  }

  render({ result, index, parentElement, getHoverProps, store }) {
    store.isSelected
    store.wasSelected
    if (!parentElement) {
      return null
    }
    log(`render card`, index)
    return (
      <Overdrive parentElement={parentElement}>
        {({ AnimateElement }) => {
          const { isSelected, wasSelected } = store
          const shouldResizeText = wasSelected !== isSelected
          let cardWrapStyle = {
            height: 200,
          }
          if (isSelected) {
            cardWrapStyle = {
              ...cardWrapStyle,
              height: 400,
            }
          }
          const textProps = {
            // ellipse: true,
            // measure: shouldResizeText,
            style: {
              flex: 1,
              lineHeight: '1.35rem',
            },
          }
          return (
            <AnimateElement id={`${result.id}`}>
              <cardWrap
                css={cardWrapStyle}
                {...getHoverProps({ result, id: index })}
              >
                <card
                  $cardHovered={this.hovered}
                  onMouseEnter={this.setHovered}
                  onMouseLeave={this.setUnhovered}
                >
                  <AnimateElement id="HAHA">
                    <div>
                      dont show me on animate now mo? Quod quos nisi molestias
                      velit reprehenderit veniam dicta, voluptatum vel voluptas
                      a? Lorem ipsum dolor sit amet consectetur adipisicing
                      elit. Ratione modi optio at neque ducimus ab aperiam
                      dolores nemo? Quod quos nisi molestias velit reprehenderit
                      veniam dicta, voluptatum vel voluptas a? Lob aperiam
                      dolores nemo? Quod quos nisi molestias velit reprehenderit
                      veniam dicta, voluptatum vel voluptas a? Lo
                    </div>
                  </AnimateElement>
                  {/* <AnimateElement id={`${result.id}-title`}>
                    <text
                      // size={1.35}
                      // ellipse={2}
                      // fontWeight={400}
                      css={{ marginBottom: 5 }}
                    >
                      {result.title}
                    </text>
                  </AnimateElement>
                  <content
                    css={{
                      flex: 1,
                      opacity: 0.8,
                      overflow: 'hidden',
                    }}
                  >
                    <AnimateElement id={`${result.id}-text`}>
                      <text {...textProps} css={{ maxHeight: '100%' }}>
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
                      </text>
                    </AnimateElement>
                  </content>
                  <AnimateElement id={`${result.id}-bottom`}>
                    <text
                      // opacity={0.5}
                      // size={0.9}
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
                    </text>
                  </AnimateElement> */}
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
      padding: [0, 6, 8],
      position: 'relative',
    },
    card: {
      flex: 1,
      borderRadius: 8,
      padding: 12,
      overflow: 'hidden',
    },
    cardHovered: {},
  }

  static theme = ({ store }, theme) => {
    const hlColor = theme.highlight.color
    const hoveredStyle = {
      background: store.isSelected ? hlColor.darken(0.1) : hlColor.darken(0.05),
    }
    return {
      card: {
        background: store.isSelected ? hlColor : 'transparent',
        '&:hover': hoveredStyle,
      },
      cardHovered: hoveredStyle,
    }
  }
}
