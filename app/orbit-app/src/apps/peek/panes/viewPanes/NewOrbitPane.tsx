import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as React from 'react'
import * as Views from '../../../../views'
import { Message } from '../../../../views/Message'
import { OrbitOrb } from '../../../orbit/orbitDocked/orbitSettings/OrbitOrb'
import { AppsStore } from '../../../AppsStore'
import { OrbitAppCard } from '../../../orbit/orbitDocked/views/OrbitAppCard'
import { settingToAppConfig } from '../../../../helpers/toAppConfig/settingToAppConfig'
import { Grid } from '../../../../views/Grid'

type Props = {
  type: string
  appsStore?: AppsStore
}

const Statuses = {
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  FAIL: 'FAIL',
}

const buttonThemes = {
  [Statuses.LOADING]: '#999',
  [Statuses.SUCCESS]: 'darkgreen',
  [Statuses.FAIL]: 'darkred',
}

class CreateSpaceStore {
  props: Props
  // setting: Setting

  status: string
  error: string
  values = {
    username: '',
    password: '',
    domain: '',
  }
}

@view.attach('appsStore')
@view.attach({
  store: CreateSpaceStore,
})
@view
export class NewOrbitPane extends React.Component<Props & { store?: CreateSpaceStore }> {
  addIntegration = async e => {}

  handleChange = (prop: string) => (val: any) => {
    this.props.store.values = {
      ...this.props.store.values,
      [prop]: val,
    }
  }

  render() {
    const { appsStore } = this.props
    const { values, status, error } = this.props.store
    return (
      <UI.Col tagName="form" onSubmit={this.addIntegration} padding={20}>
        <Views.Title>New Orbit</Views.Title>
        <Views.VerticalSpace />
        <UI.Col margin="auto" width={370}>
          <UI.Col padding={[0, 10]}>
            <Views.Table>
              <Views.InputRow
                label="Name"
                value={values.domain}
                onChange={this.handleChange('name')}
              />

              <Views.VerticalSpace />

              <Views.FormRow label="Icon">
                <OrbitOrb bg="black" color="red" />
              </Views.FormRow>

              <Views.VerticalSpace />

              <Views.SubTitle>Default Apps</Views.SubTitle>
              <Grid
                gridTemplateColumns="repeat(auto-fill, minmax(120px, 1fr))"
                gridAutoRows={80}
                margin={[5, -4]}
              >
                {appsStore.appsList.map((app, index) => (
                  <OrbitAppCard
                    key={app.id}
                    model={app}
                    pane="docked"
                    subPane="apps"
                    total={appsStore.appsList.length}
                    inGrid
                    result={settingToAppConfig(app)}
                    index={index}
                    isActive
                  />
                ))}
              </Grid>
            </Views.Table>

            <Views.VerticalSpace />

            <UI.Theme
              theme={{
                color: '#fff',
                background: buttonThemes[status] || '#4C36C4',
              }}
            >
              {status === Statuses.LOADING && <UI.Button>Saving...</UI.Button>}
              {status !== Statuses.LOADING && (
                <UI.Button type="submit" onClick={this.addIntegration}>
                  Save
                </UI.Button>
              )}
            </UI.Theme>
            <Views.VerticalSpace />
            {error && <Message>{error}</Message>}
          </UI.Col>
        </UI.Col>
      </UI.Col>
    )
  }
}
