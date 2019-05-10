import { App, AppProps, createApp, hasGraph, Templates, useActiveDataAppsWithDefinition, useAppState, useAppWithDefinition } from '@o/kit'
import { Button, Divider, Form, FormField, List, Section, SubTitle, Tab, Table, Tabs, TextArea, Title, useSetShare, View } from '@o/ui'
import { remove } from 'lodash'
import React from 'react'

import { GraphExplorer } from '../views/GraphExplorer'
import { getAppListItem } from './apps/getAppListItem'

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

function DataExplorerIndex() {
  const dataApps = useActiveDataAppsWithDefinition()
  return (
    <List
      titleBorder
      title="Data Explorer"
      subTitle="Explore installed data apps"
      items={[
        dataApps.some(x => hasGraph(x.definition)) && {
          subId: 'explorer-graph',
          title: 'Graph',
          icon: 'Graph',
          subTitle: 'Explore all GraphQL app APIs',
        },
        ...dataApps.map(x => ({ ...getAppListItem(x), group: 'Data Apps' })),
      ].filter(Boolean)}
    />
  )
}

function DataExplorerMain({ subId }: AppProps) {
  const [app, definition] = useAppWithDefinition((subId && +subId) || false)
  const [queries, updateQueries] = useAppState(`queries-${subId}`, [{ id: 0, name: 'My Query' }])
  const setShare = useSetShare()

  if (subId === 'explorer-graph') {
    return <GraphExplorer />
  }

  // TODO suspense
  if (!app) {
    return <Title>no app, subid {typeof subId}</Title>
  }

  return (
    <Section
      pad
      backgrounded
      title={app.name}
      subTitle={definition.name}
      titleBorder
      icon={definition.icon}
      afterTitle={
        <Button
          alt="confirm"
          onClick={() => updateQueries(cur => [{ id: Math.random(), name: 'My Query' }, ...cur])}
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
                icon="cross"
                onClick={() => updateQueries(cur => remove(cur, x => x.id !== query.id))}
              />
            </>
          }
          minHeight={200}
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
                    <Table items={[{ title: 'example', something: 'else' }]} />
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
