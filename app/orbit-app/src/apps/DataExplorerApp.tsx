import {
  App,
  AppProps,
  createApp,
  List,
  Table,
  Templates,
  useActiveSyncAppsWithDefinition,
  useAppState,
  useAppWithDefinition,
} from '@o/kit'
import {
  Button,
  Divider,
  Form,
  FormField,
  Section,
  SubTitle,
  Tab,
  Tabs,
  TextArea,
  Title,
  View,
} from '@o/ui'
import { remove } from 'lodash'
import React from 'react'
import { getAppListItem } from './apps/getAppListItem'

function DataExplorerIndex() {
  const syncApps = useActiveSyncAppsWithDefinition()
  return (
    <>
      <List
        titleBorder
        title="Data Explorer"
        subTitle="Explore installed data apps"
        items={syncApps.map(x => ({ ...getAppListItem(x), group: 'Data Apsp' }))}
      />
    </>
  )
}

function DataExplorerMain({ subId }: AppProps) {
  const [app] = useAppWithDefinition((subId && +subId) || false)
  const [queries, setQueries] = useAppState(`queries-${subId}`, [{ id: 0, name: 'My Query' }])

  // TODO suspense
  if (!app) {
    return <Title>no app, subid {typeof subId}</Title>
  }

  return (
    <Section
      title={app.appName}
      subTitle={app.name}
      titleBorder
      icon={app.icon}
      afterTitle={
        <Button
          alt="confirm"
          onClick={() => setQueries([{ id: Math.random(), name: 'My Query' }, ...queries])}
        >
          Add query
        </Button>
      }
    >
      {queries.map(query => (
        <Section
          key={query.id}
          bordered
          title={query.name}
          afterTitle={
            <>
              <Button
                icon="simremove"
                onClick={() => setQueries(remove(queries, x => x.id !== query.id))}
              />
            </>
          }
        >
          <Templates.MasterDetail
            placeholder=""
            items={[{ title: 'getMessages' }, { title: 'getThreads' }]}
          >
            {selected => (
              <>
                <View padding={20}>
                  <SubTitle>{selected.title}</SubTitle>
                  <Divider />
                  <Form>
                    <FormField label="inboxId" value="" />
                    <FormField label="search" value="" />
                  </Form>
                </View>

                <Tabs>
                  <Tab id="0" label="JSON">
                    <TextArea minHeight={200} />
                  </Tab>
                  <Tab id="1" label="Table">
                    <Table rows={[{ title: 'example', something: 'else' }]} />
                  </Tab>
                </Tabs>
              </>
            )}
          </Templates.MasterDetail>
        </Section>
      ))}
    </Section>
  )
}

export default createApp({
  id: 'data-explorer',
  name: 'Data Explorer',
  icon: '',
  app: props => (
    <App index={<DataExplorerIndex />}>
      <DataExplorerMain {...props} />
    </App>
  ),
})
