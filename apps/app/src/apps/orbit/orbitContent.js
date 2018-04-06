import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Desktop } from '@mcro/all'
import OrbitItem from './orbitItem'
import OrbitDivider from './orbitDivider'
import Overdrive from 'react-overdrive'
import DotDotDot from 'react-dotdotdot'
import * as Constants from '~/constants'

const Text = props => (
  <UI.Text size={1.1} css={{ marginBottom: 10 }} {...props} />
)

@view({
  store: class OrbitCardStore {
    get isSelected() {
      return this.props.appStore.selectedIndex === this.props.index
    }

    @react({ delayValue: true })
    wasSelected = [() => this.isSelected, _ => _]
  },
})
class OrbitCard {
  render({ result, index, theme, getHoverProps, store }) {
    const { isSelected, wasSelected } = store
    const shouldResizeText = wasSelected !== isSelected
    if (shouldResizeText) {
      log(`RES ${index}`)
    }
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
      ellipse: isSelected ? false : true,
      measure: shouldResizeText,
    }
    return (
      <Overdrive key={result.id} id={`${result.id}`}>
        <cardWrap css={cardWrapStyle} {...getHoverProps({ result, id: index })}>
          <card
            css={{
              background: isSelected ? theme.highlight.color : 'transparent',
            }}
          >
            <Text
              size={1.35}
              ellipse={2}
              fontWeight={200}
              css={{ marginBottom: 8 }}
            >
              {result.title}
            </Text>
            <content css={{ flex: 1, opacity: 0.8, overflow: 'hidden' }}>
              <Text {...textProps} css={{ maxHeight: '100%' }}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione
                modi optio at neque ducimus ab aperiam dolores nemo? Quod quos
                nisi molestias velit reprehenderit veniam dicta, voluptatum vel
                voluptas a? Lorem ipsum dolor sit amet consectetur adipisicing
                elit. Ratione modi optio at neque ducimus ab aperiam dolores
                nemo? Quod quos nisi molestias velit reprehenderit veniam dicta,
                voluptatum vel voluptas a?
              </Text>
            </content>
            <Text opacity={0.5} size={0.9} css={{ marginBottom: 3 }}>
              via{' '}
              <UI.Icon
                name="mail"
                size={10}
                css={{ display: 'inline-block' }}
              />
              &nbsp;
              <UI.Date>{result.bitUpdatedAt}</UI.Date>
            </Text>
          </card>
        </cardWrap>
      </Overdrive>
    )
  }

  static style = {
    cardWrap: {
      padding: [10, 8, 0],
      position: 'relative',
    },
    card: {
      flex: 1,
      borderRadius: 8,
      padding: 12,
      overflow: 'hidden',
    },
  }
}

@UI.injectTheme
@view
class OrbitContext {
  render({ appStore, theme, getHoverProps }) {
    const isSelectedInContext = appStore.selectedIndex >= 5
    return (
      <orbitContext
        css={{
          background: theme.base.background,
          transform: { y: isSelectedInContext ? -100 : 0 },
        }}
      >
        <OrbitDivider if={!App.state.query} />
        <results>
          {appStore.results
            .slice(5)
            .map((result, i) => (
              <OrbitCard
                key={result.id}
                appStore={appStore}
                theme={theme}
                getHoverProps={getHoverProps}
                result={result}
                index={i + 5}
              />
            ))}
        </results>
      </orbitContext>
    )
  }
  static style = {
    orbitContext: {
      borderRadius: Constants.BORDER_RADIUS,
      position: 'relative',
      height: 'calc(100% - 35px)',
    },
    results: {
      flex: 1,
      overflowY: 'scroll',
    },
  }
}

const getKey = result => result.index || result.id || result.title

@view.attach('appStore')
@view
export default class OrbitContent {
  render({ appStore, getHoverProps }) {
    log(`render content`)
    const { query } = App.state
    const tinyProps = {
      hidePreview: true,
      titleProps: {
        ellipse: true,
        fontWeight: 200,
        size: 1,
      },
      iconProps: {
        size: 14,
        style: {
          marginTop: 1,
          marginLeft: 15,
        },
      },
      padding: [3, 15],
    }
    return (
      <orbitContent>
        {appStore.results.slice(0, query ? 12 : 5).map((result, index) => (
          <OrbitItem
            {...!query && tinyProps}
            key={getKey(result) || index}
            type="gmail"
            index={index}
            results={appStore.results}
            result={{
              ...result,
              title: result.title.slice(0, 18),
            }}
            total={appStore.results.length}
            {...getHoverProps({
              result,
              id: index,
            })}
          />
        ))}
        <OrbitContext
          if={!query}
          appStore={appStore}
          getHoverProps={getHoverProps}
        />
        <space css={{ height: 20 }} />
      </orbitContent>
    )
  }

  static style = {
    orbitContent: {
      flex: 1,
    },
  }
}
