import { AppBit, AppDefinition, AppModel, save, selectDefined, useActiveSpace, useAppBit } from '@o/kit'
import { Form, FormProps } from '@o/ui'
import React from 'react'

export function createNewApp(def: AppDefinition): AppBit {
  return {
    target: 'app',
    identifier: def.id,
    itemType: def.itemType,
    data: {},
  }
}

export function AppSetupForm({
  def,
  id,
  ...rest
}: FormProps<any> & { id?: number; def: AppDefinition }) {
  const [activeSpace] = useActiveSpace()
  const [existingApp] = useAppBit(selectDefined(id, false))
  const app: AppBit = existingApp || createNewApp(def)

  return (
    <Form
      {...rest}
      submitButton
      fields={def.setup}
      onSubmit={async values => {
        app.data.setup = values

        // pass back for validation
        if (def.setupValidate) {
          try {
            def.setupValidate(app)
          } catch (err) {
            return err
              ? err.message || err
              : `Error in validating form ${app.name || app.identifier}`
          }
        }

        // add to space if not added
        app.spaces = app.spaces || []
        if (!app.spaces.find(space => space.id === activeSpace.id)) {
          app.spaces.push(activeSpace)
        }
        app.spaceId = activeSpace.id

        // attempt save
        try {
          await save(AppModel, app)
          return true
        } catch (err) {
          return err.message
        }
      }}
    />
  )
}
