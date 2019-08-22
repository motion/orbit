import { AppBit, AppDefinition, command, useActiveSpace, useAppBit } from '@o/kit'
import { AppDefinitionSetupVerifyCommand } from '@o/models'
import { Form, FormFieldsObj, FormProps } from '@o/ui'
import produce from 'immer'
import React from 'react'

import { useInstallApp } from '../../helpers/installApp'

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
  const [existingApp] = useAppBit(id ? { id } : false)
  const newApp = createNewApp(def)
  const app: AppBit = existingApp || newApp
  const installApp = useInstallApp()

  return (
    <Form
      {...rest}
      submitButton={existingApp ? 'Update' : 'Add app'}
      fields={fillFields(def.setup, app.data.setup)}
      onSubmit={async (_, values) => {
        app.data.setup = values

        console.log('sending app for validation', app, values)

        const res = await command(AppDefinitionSetupVerifyCommand, {
          identifier: def.id,
          app,
        })

        if (res.type === 'error') {
          return res
        }

        // add to space if not added
        // TODO why does it need two ways to fill in...
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

function fillFields(fields: FormFieldsObj, values: Object) {
  return produce(fields, next => {
    for (const key in fields) {
      if (values && values[key]) {
        next[key].value = values[key]
      }
    }
  })
}
