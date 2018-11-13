import { view, attach } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as React from 'react'
import { Title, VerticalSpace, Table, InputRow, FormRow } from '../../views'
import { SubTitle } from '../../views/SubTitle'
import { Grid } from '../../views/Grid'
import { Message } from '../../views/Message'
import { SourcesStore } from '../../stores/SourcesStore'
import { OrbitOrb } from '../../views/OrbitOrb'
import { OrbitAppCard } from '../../components/OrbitAppCard'

type Props = {
  type: string
  sourcesStore?: SourcesStore
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

@attach('sourcesStore')
@attach({
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
    const { sourcesStore } = this.props
    const { values, status, error } = this.props.store
    return (
      <UI.Col tagName="form" onSubmit={this.addIntegration} padding={20}>
        <Title>New Orbit</Title>
        <VerticalSpace />
        <UI.Col margin="auto" width={370}>
          <UI.Col padding={[0, 10]}>
            <Table>
              <InputRow label="Name" value={values.domain} onChange={this.handleChange('name')} />

              <VerticalSpace />

              <FormRow label="Icon">
                <OrbitOrb background="black" color="red" />
              </FormRow>

              <VerticalSpace />

              <SubTitle>Default Apps</SubTitle>
              <Grid
                gridTemplateColumns="repeat(auto-fill, minmax(120px, 1fr))"
                gridAutoRows={80}
                margin={[5, -4]}
              >
                {sourcesStore.sources.map((app, index) => (
                  <OrbitAppCard
                    key={app.integration}
                    model={app}
                    pane="docked"
                    total={sourcesStore.sources.length}
                    index={index}
                  />
                ))}
              </Grid>
            </Table>

            <VerticalSpace />

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
            <VerticalSpace />
            {error && <Message>{error}</Message>}
          </UI.Col>
        </UI.Col>
      </UI.Col>
    )
  }
}
