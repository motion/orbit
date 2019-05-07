import { AppDefinition, AppModel, save, useActiveSpace, useAppBit } from '@o/kit'
import { Form } from '@o/ui'
import React from 'react'

export function AppSetupForm(props: { id: number; def: AppDefinition }) {
  const [activeSpace] = useActiveSpace()
  const [app] = useAppBit(props.id)

  return (
    <Form
      submitButton
      onSubmit={async values => {
        app.data.setup = values

        // pass back for validation
        if (props.def.setupValidate) {
          try {
            props.def.setupValidate(app, values)
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
