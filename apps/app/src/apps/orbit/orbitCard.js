import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import OrbitIcon from './orbitIcon'
import { App } from '@mcro/all'

@view.attach('appStore')
@UI.injectTheme
@view
export default class Card {
  render({
    id,
    icon,
    title,
    index,
    length,
    theme,
    isActive,
    appStore,
    store,
    oauth,
  }) {
    const isSelected =
      appStore.selectedIndex === index && !!App.state.peekTarget
    const isOdd = index % 2 == 0
    return (
      <card
        key={index}
        $first={index === 0}
        $odd={isOdd}
        $lastRow={index >= length - 2}
        css={{
          background: isSelected ? [255, 255, 255, 0.8] : [255, 255, 255, 0.05],
          borderLeftRadius: isOdd ? 4 : 0,
          borderRightRadius: !isOdd ? 4 : 0,
        }}
        onClick={() => {
          if (!isActive) {
            return
          }
          appStore.setSelectedIndex(index)
          store.showPeek(index)
        }}
        ref={ref => {
          if (!ref) return
          store.refs[index] = ref
        }}
      >
        <inner>
          <OrbitIcon $icon $iconActive={isActive} icon={icon} />
          <subtitle>
            <UI.Text fontWeight={600} fontSize={13} textAlign="center">
              {title}
            </UI.Text>
          </subtitle>
          <UI.Button
            if={!isActive}
            onClick={async () => {
              if (oauth === false) {
                const setting = appStore.settings[id]
                setting.token = 'good'
                await setting.save()
                appStore.getSettings()
              } else {
                appStore.startOauth(id)
              }
            }}
            size={0.9}
            icon="uiadd"
            background="transparent"
            borderColor={theme.base.background.darken(0.05)}
            chromeless
            circular
            hover={{
              background: [255, 255, 255, 0.5],
            }}
            color={theme.base.background.darken(0.2).alpha(0.5)}
            css={{
              position: 'absolute',
              top: 5,
              right: 5,
            }}
          />
        </inner>
      </card>
    )
  }

  static style = {
    card: {
      position: 'relative',
      width: '50%',
      padding: [15, 5],
      // margin: [0, 5, 0],
      alignItems: 'center',
      justifyContent: 'center',
      borderBottom: [1, 'dotted', [0, 0, 0, 0.1]],
      '&:hover': {
        background: [255, 255, 255, 0.1],
      },
      '&:active': {
        background: [255, 255, 255, 0.15],
      },
    },
    inner: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: [10, 0],
    },
    odd: {
      borderRight: [1, 'dotted', [0, 0, 0, 0.1]],
      paddingRight: 7,
    },
    lastRow: {
      borderBottom: 'none',
    },
    subtitle: {
      marginTop: 10,
      flex: 1,
      justifyContent: 'center',
    },
    icon: {
      marginBottom: 10,
      filter: 'grayscale(100%)',
      opacity: 0.5,
    },
    iconActive: {
      filter: 'none',
      opacity: 1,
    },
  }
}
