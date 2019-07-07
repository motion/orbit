import { AppBit, AppDefinition } from '@o/models'
import { Select, SelectProps } from '@o/ui'
import React from 'react'

import { useActiveDataApps } from '../hooks/useActiveDataApps'

export type SelectAppProps = Omit<SelectProps, 'onChange' | 'type'> & {
  appType?: AppDefinition
  onSelect: (app: AppBit) => any
}

export function SelectApp({ type, appType, onSelect, ...selectProps }: SelectAppProps) {
  let apps = useActiveDataApps(type)
  if (appType) {
    apps = apps.filter(x => x.identifier === appType.id)
  }
  return (
    <Select
      options={apps.map(app => ({
        label: app.name,
        value: app,
      }))}
      placeholder={appType ? `Select ${appType.name} app...` : 'Select app...'}
      onChange={next => onSelect(next ? next.value : null)}
      {...selectProps}
    />
  )
}
