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
          integration: this.props.result.integration,
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
  hoverSettler = this.props.appStore.getHoverSettler()

  render({
    isPaneActive,
    store,
    result,
    setting,
    index,
    subtitle,
    isActive,
    appStore,
  }) {
    const { id, icon, title } = result
    const isSelected =
      appStore.selectedIndex === index && !!App.peekState.target
    if (isPaneActive) {
      this.hoverSettler.setItem({ index: this.props.index })
    }
    return (
      <card
        key={index}
        ref={store.cardRef}
        $isSelected={isSelected}
        $isActive={isActive}
        {...isActive && isPaneActive && this.hoverSettler.props}
        onClick={async () => {
          console.log('clicked setting', isActive, result.oauth)
          if (!isActive) {
            if (result.oauth === false) {
              setting.token = 'good'
              await setting.save()
              appStore.getSettings()
            } else {
              appStore.startOauth(id)
            }
            return
          }
          appStore.setTarget(result, this.ref)
        }}
      >
        <OrbitIcon $icon icon={icon} size={18} />
        <titles>
          <UI.Text $title fontWeight={500} size={1.2} textAlign="center">
            {title}
          </UI.Text>
          <UI.Text if={subtitle} $subtitle size={0.9} textAlign="center">
            {subtitle}
          </UI.Text>
        </titles>
        <div $$flex />
        <actions>
          <React.Fragment if={!isActive}>
            <UI.Button>Add</UI.Button>
          </React.Fragment>
        </actions>
      </card>
    )
  }

  static style = {
    card: {
      opacity: 0.7,
      flexFlow: 'row',
      flex: 1,
      alignItems: 'center',
      position: 'relative',
      padding: [12, 22],
      '&:hover': {
        background: [255, 255, 255, 0.1],
      },
      '&:active': {
        background: [255, 255, 255, 0.15],
      },
    },
    isActive: {
      opacity: 1,
    },
    lastRow: {
      borderBottom: 'none',
    },
    icon: {
      margin: ['auto', 10, 'auto', -8],
      transform: {
        y: -1,
      },
    },
  }

  static theme = (_, theme) => {
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
