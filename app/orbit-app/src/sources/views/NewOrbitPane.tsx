import * as UI from '@mcro/ui'
import * as React from 'react'
import { Title, VerticalSpace, Table, InputRow, FormRow } from '../../views'
import { SubTitle } from '../../views/SubTitle'
import { Grid } from '../../views/Grid'
import { Message } from '../../views/Message'
import { OrbitOrb } from '../../views/OrbitOrb'
import { useStore } from '@mcro/use-store'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { observer } from 'mobx-react-lite'

type Props = {
  type: string
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

export const NewOrbitPane = observer(() => {
  const stores = useStoresSafe()
  const store = useStore(CreateSpaceStore, stores)
  const { values, status, error } = store
  const addIntegration = async () => {}
  const handleChange = (prop: string) => (val: any) => {
    store.values = {
      ...store.values,
      [prop]: val,
    }
  }
  return (
    <UI.Col tagName="form" onSubmit={addIntegration} padding={20}>
      <Title>New Orbit</Title>
      <VerticalSpace />
      <UI.Col margin="auto" width={370}>
        <UI.Col padding={[0, 10]}>
          <Table>
            <InputRow label="Name" value={values.domain} onChange={handleChange('name')} />

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
              {stores.sourcesStore.sources.map((app, index) => (
                <OrbitAppItem
                  key={app.integration}
                  model={app}
                  pane="docked"
                  total={stores.sourcesStore.sources.length}
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
              <UI.Button type="submit" onClick={addIntegration}>
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
})
