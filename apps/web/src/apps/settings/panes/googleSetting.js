// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import App, { CurrentUser } from '~/app'

@view
export default class GoogleSetting {
  componentDidMount() {
    if (App.sync.google) {
      App.sync.google.cal.setupSettings()
    }
  }

  render() {
    const Setting = CurrentUser.setting.google
    if (!Setting) {
      return <null>No google setting</null>
    }
    const { calendars, calendarsActive = {} } = Setting.values
    return (
      <content>
        <UI.Form if={calendars}>
          {calendars.map(cal => {
            const isActive = calendarsActive[cal.id]
            return (
              <field key={cal.id}>
                <UI.Field
                  row
                  size={1.2}
                  label={cal.summary}
                  type="toggle"
                  defaultValue={isActive}
                  onChange={val => {
                    Setting.mergeUpdate({
                      values: {
                        calendarsActive: {
                          [cal.id]: val,
                        },
                      },
                    })
                  }}
                />
              </field>
            )
          })}
        </UI.Form>
        <UI.Button onClick={() => CurrentUser.unlink('google')}>
          Unlink Google
        </UI.Button>
      </content>
    )
  }

  static style = {
    content: {
      flex: 1,
      overflowY: 'scroll',
      margin: [0, -20],
      padding: [0, 20],
    },
    field: {
      padding: [5, 0],
    },
  }
}
