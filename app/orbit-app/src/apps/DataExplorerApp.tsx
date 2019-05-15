import { App, AppProps, createApp, Templates, TreeList, useActiveDataApps, useAppState, useAppWithDefinition, useTreeList } from '@o/kit'
import { Button, Divider, Dock, DockButton, Form, FormField, randomAdjective, randomNoun, Section, SelectableGrid, SubTitle, Tab, Table, Tabs, TextArea, Title, useGet } from '@o/ui'
import { capitalize, remove } from 'lodash'
import React, { useCallback, useEffect, useRef } from 'react'

import { AppIconContainer, LargeIcon, OrbitAppIcon } from '../views/OrbitAppIcon'
import { StackNav, StackNavigator } from './StackNavigator'

export default createApp({
  id: 'data-explorer',
  name: 'Query Builder',
  icon: '',
  app: props => (
    <App index={<QueryBuilderIndex />}>
      <QueryBuilderMain {...props} />
    </App>
  ),
})

//
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
            treeList.actions.addItem(name)
          }}
        />
      </Dock>
    </>
  )
}

function QueryBuilderMain(props: AppProps) {
  const stackNav = useRef<StackNav>(null)

  useEffect(() => {
    console.log('stackNav.current', stackNav.current, props)
    stackNav.current.navigate('SelectApp', {})
  }, [props.id])

  return (
    <StackNavigator
      ref={stackNav}
      key={props.id}
      id={`query-builder-nav=${props.id}`}
      items={{
        SelectApp: QueryBuilderSelectApp,
        EditQuery: QueryBuilderEditQuery,
      }}
    />
  )
}

function QueryBuilderSelectApp(props: AppProps) {
  const dataApps = useActiveDataApps()
  const getActiveApps = useGet(dataApps)
  return (
    <Section padInner="lg" pad backgrounded title={props.title}>
      <SelectableGrid
        minWidth={180}
        items={[
          ...dataApps.map(x => ({
            id: x.id,
            title: x.name,
            type: 'installed',
            group: 'Installed Apps',
            disabled: x.tabDisplay !== 'plain',
            onDoubleClick: () => {
              console.log('Stack navigate!')
            },
          })),
        ]}
        getItem={useCallback(({ onClick, onDoubleClick, ...item }, { isSelected, select }) => {
          if (item.type === 'add') {
            // TODO on click to new app pane
            return (
              <AppIconContainer onClick={onClick} onDoubleClick={onDoubleClick}>
                <LargeIcon {...item} />
              </AppIconContainer>
            )
          }
          return (
            <OrbitAppIcon
              app={getActiveApps().find(x => x.id === item.id)}
              isSelected={isSelected}
              onClick={select}
              onDoubleClick={onDoubleClick}
            />
          )
        }, [])}
      />
    </Section>
  )
}

function QueryBuilderEditQuery(props: AppProps) {
  return <Section title="ok">{JSON.stringify(props)}</Section>
}

// unused
export function CreateQuery(props: AppProps) {
  const { subId } = props
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
