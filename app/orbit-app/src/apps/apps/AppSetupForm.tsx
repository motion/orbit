import { AppBit, AppDefinition, command, selectDefined, useActiveSpace, useAppBit } from '@o/kit'
import { AppDefinitionSetupVerifyCommand } from '@o/models'
import { Form, FormProps } from '@o/ui'
import React from 'react'

import { installApp } from '../../helpers/installApp'

export function createNewApp(def: AppDefinition): AppBit {
  return {
    target: 'app',
    identifier: def.id,
    itemType: def.itemType,
    data: {},
  }
}

type AppSetupFormProps = Omit<FormProps<any>, 'id'> & {
  id?: number | false
  def: AppDefinition
}

export function AppSetupForm({ def, id, ...rest }: AppSetupFormProps) {
  const [activeSpace] = useActiveSpace()
  const [existingApp] = useAppBit(selectDefined(id, false))
  const app: AppBit = existingApp || createNewApp(def)

  return (
    <Form
      {...rest}
      submitButton
      fields={def.setup}
      onSubmit={async (_, values) => {
        app.data.setup = values

        console.log('sending app for validation', app)

        const res = await command(AppDefinitionSetupVerifyCommand, {
          identifier: def.id,
          app,
        })

        if (res.type === 'error') {
          return res
        }

        // TODO show banner here
        console.log('success validating', res)

        // add to space if not added
        app.spaces = app.spaces || []
        if (!app.spaces.find(space => space.id === activeSpace.id)) {
          app.spaces.push(activeSpace)
        }
        app.spaceId = activeSpace.id

        // attempt save
        try {
          const next = await installApp(def, app)
          if (next.type === 'error') {
            return next
          }

          // success!
          return true
        } catch (err) {
          return err.message
        }
      }}
    />
  )
}
