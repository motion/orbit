import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitIcon } from './orbitIcon'
import { App } from '@mcro/all'

class OrbitSettingCardStore {
  cardRef = React.createRef()

  setPeekTargetOnNextIndex = react(
    () => this.props.appStore.nextIndex === this.props.index,
    shouldSelect => {
      if (!shouldSelect || !this.props.isPaneActive) {
        throw react.cancel
      }
      console.log('set target')
      this.props.appStore.setTarget(
        {
          type: 'setting',
          integration: this.props.setting.integration,
        },
        this.cardRef.current,
      )
    },
  )
}

@view.attach('appStore')
@view({
  store: OrbitSettingCardStore,
})
export class OrbitSettingCard extends React.Component {
  state = {
    hoverSettle: false,
  }

  hoverSettler = this.props.appStore.getHoverSettler()

  componentDidUpdate(prevProps) {
    if (!prevProps.isPaneActive && this.props.isPaneActive) {
      this.hoverSettler.setItem({ index: this.props.index })
    }
    const hoverSettle = this.props.isPaneActive
    if (hoverSettle !== this.state.hoverSettle) {
      this.setState({ hoverSettle })
    }
  }

  render(
    { store, setting, index, subtitle, isActive, appStore, oauth },
    { hoverSettle },
  ) {
    const { id, icon, title } = setting
    const isSelected =
      appStore.selectedIndex === index && !!App.peekState.target
    const hoverSettleProps = hoverSettle && this.hoverSettler.props
    return (
      <card
        key={index}
        ref={store.cardRef}
        $isSelected={isSelected}
        {...hoverSettleProps}
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
          appStore.setTarget(setting, this.ref)
        }}
      >
        <OrbitIcon $icon $iconActive={isActive} icon={icon} size={22} />
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
      margin: ['auto', 12, 'auto', 0],
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
