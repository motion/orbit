import { AppBit } from '@o/models'
import { Select, SelectProps } from '@o/ui'
import React from 'react'
import { useActiveSyncApps } from '../hooks/useActiveSyncApps'
import { Omit } from '../types'

export type SelectAppProps = Omit<SelectProps, 'onChange'> & {
  type?: string
  onSelect: (app: AppBit) => any
}

export function SelectApp({ type, onSelect, ...selectProps }: SelectAppProps) {
  const apps = useActiveSyncApps(type)
  return (
    <Select
      options={apps.map(app => ({
        label: app.name,
        value: app,
      }))}
      onChange={next => onSelect(next ? next.value : null)}
      {...selectProps}
    />
  )
}
