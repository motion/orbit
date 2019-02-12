import { Absolute, FullScreen, gloss, useTheme } from '@mcro/gloss'
import { App } from '@mcro/stores'
import { Button, ButtonProps, Popover, Row, SegmentedRow, View } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { DateRangePicker } from 'react-date-range'
import { useActions } from '../../actions/Actions'
import { AppType } from '../../apps/AppTypes'
import OrbitFilterIntegrationButton from '../../components/OrbitFilterIntegrationButton'
import { getIsTorn } from '../../helpers/getAppHelpers'
import { useActiveApps } from '../../hooks/useActiveApps'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { HorizontalSpace } from '../../views'
import { BorderBottom } from '../../views/Border'
import { FloatingBarButton } from '../../views/FloatingBar/FloatingBarButton'
import { Icon } from '../../views/Icon'
import { WindowControls } from '../../views/WindowControls'
import OrbitHeaderInput from './OrbitHeaderInput'

export default observer(function OrbitHeader() {
  const { queryStore, newAppStore, orbitStore, paneManagerStore } = useStoresSafe()
  const activePaneType = paneManagerStore.activePane.type
  const isTorn = getIsTorn()
  const { isEditing } = orbitStore
  const icon = activePaneType === 'createApp' ? newAppStore.app.type : activePaneType
  const { queryFilters } = queryStore
  const theme = useTheme()

  return (
    <>
      <HeaderTop padding={isTorn ? [3, 10] : [7, 10]}>
        <OrbitClose dontDim={isTorn}>
          <WindowControls
            itemProps={{ size: 10 }}
            onClose={() => {
              if (isTorn) {
                console.log('close me...app')
              } else {
                App.setOrbitState({ docked: !App.orbitState.docked })
              }
            }}
            onMin={isTorn ? () => console.log('min') : null}
            onMax={isTorn ? () => console.log('min') : null}
          />
        </OrbitClose>

        {/* header input area */}
        <Row flex={1} alignItems="center">
          <View flex={1} />

          {/* {isTorn && toolbars && (
            <>
              {toolbars.before}
              <View flex={1} />
            </>
          )} */}
          <HeaderContain>
            <View width={24} alignItems="center" justifyContent="center">
              <Icon color={theme.color} name={`orbit-${icon}`} size={20} opacity={0.12} />
            </View>

            <OrbitHeaderInput />

            {/* {isTorn && toolbars && (
              <>
                <View flex={1} />
                {toolbars.after}
              </>
            )} */}

            <SegmentedRow>
              <Popover
                openOnClick
                closeOnClickAway
                group="filters"
                target={<FloatingBarButton icon="ui-1_calendar-57" />}
                background
                borderRadius={10}
                elevation={4}
                themeName="light"
                width={420}
                height={310}
              >
                <View flex={1} className="calendar-dom theme-light" padding={10}>
                  <DateRangePicker
                    onChange={queryFilters.onChangeDate}
                    ranges={[queryFilters.dateState]}
                  />
                </View>
              </Popover>

              <OrbitFilterIntegrationButton />
            </SegmentedRow>
          </HeaderContain>

          <View flex={1} />
        </Row>

        <OrbitEditAppButton />

        {isEditing && (
          <Absolute top={0} right={32} bottom={0} alignItems="center" justifyContent="center">
            <Row>
              <HeaderButton icon="edit" tooltip="Open in VSCode" />
              <HorizontalSpace small />
              <HeaderButton tooltip="Deploy to space">Publish</HeaderButton>
            </Row>
          </Absolute>
        )}

        {isTorn && (
          <Absolute top={0} right={3} bottom={0} alignItems="center" justifyContent="center">
            <Button
              chromeless
              opacity={0.3}
              hoverStyle={{
                opacity: 8,
              }}
              icon="gear"
              onClick={() => {
                if (paneManagerStore.activePane.type === 'settings') {
                  paneManagerStore.back()
                } else {
                  paneManagerStore.setActivePaneByType('settings')
                }
              }}
            />
          </Absolute>
        )}

        {isTorn && <BorderBottom opacity={0.35} />}
      </HeaderTop>
      <HeaderFade />
    </>
  )
})

function HeaderButton(props: ButtonProps) {
  return <Button size={0.9} sizeHeight={0.9} {...props} />
}

function OrbitEditAppButton() {
  const { orbitStore, paneManagerStore } = useStoresSafe()
  const activePaneId = paneManagerStore.activePane.id
  const activeApps = useActiveApps()
  const activeApp = activeApps.find(app => activePaneId === `${app.id}`)
  const show = activeApp && activeApp.type === AppType.custom && !orbitStore.isEditing
  const Actions = useActions()

  if (!show) {
    return null
  }

  return (
    <Absolute top={0} right={12} bottom={0} alignItems="center" justifyContent="center">
      <HeaderButton
        icon="tool"
        tooltip="Edit app"
        onClick={async () => {
          Actions.tearApp()
          orbitStore.setEditing()
        }}
      >
        Edit
      </HeaderButton>
    </Absolute>
  )
}

const HeaderContain = gloss({
  margin: 'auto',
  alignItems: 'center',
  flex: 10,
  flexFlow: 'row',
  width: '75%',
  minWidth: 400,
  maxWidth: 680,
})

const HeaderFade = gloss(FullScreen, {
  zIndex: -1,
}).theme((_, theme) => {
  if (theme.headerFadeBackground) {
    return {
      background: theme.headerFadeBackground,
    }
  }
})

const HeaderTop = gloss(View, {
  flexFlow: 'row',
  position: 'relative',
})

const OrbitClose = gloss({
  position: 'absolute',
  top: 2,
  left: 3,
  padding: 4,
  opacity: 0.1,
  '&:hover': {
    opacity: 1,
  },
  dontDim: {
    opacity: 1,
  },
})
