import { AppBit, AppIcon, AppModel, save } from '@o/kit'
import { allIcons, FormField, IconShape, Input, Stack, useThrottledFn } from '@o/ui'
import memoize from 'memoize-weak'
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react'

import { useNewAppStore } from '../../om/stores'
import { ColorPicker } from '../../views/ColorPicker'

export function AppsMainNew({
  app,
  customizeColor,
  customizeIcon,
}: {
  // if you dont pass in app it will just update newAppStore
  app?: AppBit
  customizeColor?: boolean
  customizeIcon?: boolean
}) {
  const newAppStore = useNewAppStore()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [activeIcon, setActiveIcon] = useState('')

  // throttle callback to save
  const persist = useThrottledFn(
    () => {
      if (app) {
        save(AppModel, app)
      }
    },
    { amount: 500 },
    [app],
  )

  const updateName = name => {
    if (!name) {
      name = ''
    }
    newAppStore.update({ name })
    if (app) {
      app.name = name
      persist()
    }
  }

  useLayoutEffect(() => {
    if (app) {
      newAppStore.update({
        identifier: app.identifier,
        name: app.name,
        colors: app.colors || ['orange', 'red'],
      })
    }
  }, [app])

  // this steals focus as you search in the apps settings...
  // useEffect(() => {
  //   if (inputRef.current) {
  //     inputRef.current!.focus()
  //     inputRef.current!.select()
  //   }
  // }, [inputRef.current])

  return (
    <Stack space>
      <FormField label="Name">
        <Input
          nodeRef={inputRef}
          size={1.5}
          placeholder={app ? app.name : newAppStore.app.name}
          margin={['auto', 0]}
          defaultValue={app ? app.name : newAppStore.app.name}
          onChange={useCallback(e => updateName(e.target.value), [])}
        />
      </FormField>
      {(customizeColor || customizeIcon) && (
        <FormField label="Icon">
          <Stack direction="horizontal" space alignItems="center" overflow="hidden">
            <AppIcon
              identifier={app ? app.identifier : newAppStore.app.identifier}
              colors={newAppStore.app.colors}
              size={48}
            />
            <Stack flex={1}>
              {customizeColor && (
                <ColorPicker
                  onChangeColor={colors => {
                    newAppStore.update({ colors })
                    if (app) {
                      app.colors = colors
                      persist()
                    }
                  }}
                  activeColor={newAppStore.app!.colors![0]}
                />
              )}
              {customizeIcon && <IconPicker active={activeIcon} onChange={setActiveIcon} />}
            </Stack>
          </Stack>
        </FormField>
      )}
    </Stack>
  )
}

type IconPickerProps = {
  active?: string
  onChange?: (icon: string) => any
}

function IconPicker(props: IconPickerProps) {
  const setupOnClick = memoize(icon => () => {
    props.onChange && props.onChange(icon.iconName)
  })

  return (
    <Stack direction="horizontal" space padding="sm" scrollable="x" hideScrollbars flex={1}>
      {allIcons.slice(20, 100).map(icon => {
        console.log('icon, icon', icon)
        return (
          <IconShape
            key={icon.iconName}
            active={props.active === icon.iconName}
            onClick={setupOnClick(icon)}
            name={icon.iconName}
            // gradient={['#555', '#555']}
            size={32}
          />
        )
      })}
    </Stack>
  )
}
