import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import OrbitIcon from './orbitIcon'
import { App } from '@mcro/all'

@view.attach('appStore')
@UI.injectTheme
@view
export default class Card {
  render({ id, icon, title, index, subtitle, isActive, appStore, oauth }) {
    const isSelected =
      appStore.selectedIndex === index && !!App.peekState.target
    return (
      <card
        key={index}
        $isSelected={isSelected}
        onClick={async () => {
          if (!isActive) {
            if (oauth === false) {
              const setting = appStore.settings[id]
              setting.token = 'good'
              await setting.save()
              appStore.getSettings()
            } else {
              appStore.startOauth(id)
            }
            return
          }
          appStore.toggleSelected(index)
        }}
      >
        <OrbitIcon $icon $iconActive={isActive} icon={icon} />
        <titles>
          <UI.Text $title fontWeight={300} size={1.4} textAlign="center">
            {title}
          </UI.Text>
          <UI.Text if={subtitle} $subtitle size={0.9} textAlign="center">
            {subtitle}
          </UI.Text>
        </titles>
      </card>
    )
  }

  static style = {
    card: {
      flexFlow: 'row',
      flex: 1,
      alignItems: 'center',
      position: 'relative',
      padding: [10, 20],
      '&:hover': {
        background: [255, 255, 255, 0.1],
      },
      '&:active': {
        background: [255, 255, 255, 0.15],
      },
    },
    isSelected: {},
    lastRow: {
      borderBottom: 'none',
    },
    icon: {
      marginBottom: 10,
      marginRight: 20,
      opacity: 0.5,
    },
    iconActive: {
      filter: 'none',
      opacity: 1,
    },
  }

  static theme = ({ isActive }, theme) => {
    return {
      card: {
        background: 'transparent',
        '&:hover': {
          background: theme.hover.background,
        },
      },
      isSelected: {
        background: theme.active.background,
        '&:hover': {
          background: theme.activeHover.background,
        },
      },
    }
  }
}
