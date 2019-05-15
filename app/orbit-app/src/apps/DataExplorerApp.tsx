import { App, AppProps, createApp, Templates, TreeList, useAppState, useAppWithDefinition, useTreeList } from '@o/kit'
import { Button, Divider, Dock, DockButton, Form, FormField, randomAdjective, randomNoun, Section, SubTitle, Tab, Table, Tabs, TextArea, Title, View } from '@o/ui'
import { capitalize, remove } from 'lodash'
import React from 'react'

export default createApp({
  id: 'data-explorer',
  name: 'Query Builder',
  icon: '',
  app: props => (
    <App index={<QueryBuilderIndex />}>
      <DataExplorerMain {...props} />
    </App>
  ),
})

// const dataApps = useActiveDataAppsWithDefinition()
// items={[...dataApps.map(x => ({ ...getAppListItem(x), group: 'Data Apps' }))].filter(Boolean)}

const treeId = 'my-tree-list'

export function QueryBuilderIndex() {
  const treeList = useTreeList(treeId)
  return (
    <>
      <TreeList backgrounded title="Queries" editable deletable use={treeList} sortable />
      <Dock>
        <DockButton
          id="add"
          icon="plus"
          onClick={() => {
            const name = `${capitalize(randomAdjective())} ${capitalize(randomNoun())}`
            console.log('name', name)
            treeList.actions.addItem(name)
          }}
        />
      </Dock>
    </>
  )
}

function DataExplorerMain(props: AppProps) {
  const { id, subId } = props
  const [app, definition] = useAppWithDefinition((subId && +subId) || false)
  const [queries, updateQueries] = useAppState(`queries-${subId}`, [{ id: 0, name: 'My Query' }])
  // const setShare = useSetShare()

  // TODO suspense
  if (!app) {
    return <Title>nothing {JSON.stringify(props)}</Title>
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
