import { App, AppProps, createApp, Templates, TreeList, useActiveDataApps, useAppState, useAppWithDefinition, useTreeList } from '@o/kit'
import { Button, Divider, Dock, DockButton, Form, FormField, randomAdjective, randomNoun, Section, Select, SelectableGrid, SubTitle, Tab, Table, Tabs, TextArea, Title, useGet } from '@o/ui'
import { capitalize, remove } from 'lodash'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { OrbitAppIcon } from '../views/OrbitAppIcon'
import { NavigatorProps, StackNav, StackNavigator } from './StackNavigator'

export default createApp({
  id: 'data-explorer',
  name: 'Query Builder',
  icon: '',
  app: props => (
    <App index={<QueryBuilderIndex />}>
      <QueryBuilderMain key={props.id} {...props} />
    </App>
  ),
})

const treeId = '12'

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
  console.log('props', props)
  const nav = useRef<StackNav>(null)

  useEffect(() => {
    console.log('stackNav', nav)
    if (!nav.current.stack.length) {
      nav.current.navigate('SelectApp', props)
    }
  }, [nav])

  return (
    <StackNavigator
      ref={nav}
      key={props.id}
      id={`query-builder-nav=${props.id}`}
      items={{
        SelectApp: QueryBuilderSelectApp,
        QueryEdit: QueryBuilderQueryEdit,
      }}
    />
  )
}

function QueryBuilderSelectApp(props: AppProps & NavigatorProps) {
  const dataApps = useActiveDataApps()
  const getActiveApps = useGet(dataApps)
  const [selected, setSelected] = useState(null)
  const selectableApps = useMemo(
    () => [
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
    ],
    [dataApps],
  )

  return (
    <Section
      pad="xl"
      titlePad="lg"
      backgrounded
      title={props.title}
      subTitle="Select data app."
      afterTitle={
        <>
          <Button
            onClick={() => {
              if (!selected.length) {
                alert('Please select an item first')
                return
              }
              const item = selected[0]
              console.log('do ', item, props)
              // navigate to app definition:
              props.navigation.navigate('QueryEdit', { id: item.id, title: item.title })
            }}
          >
            Next
          </Button>
        </>
      }
    >
      <SelectableGrid
        gridGap={20}
        minWidth={180}
        items={selectableApps}
        onSelect={useCallback(i => {
          console.log('selecting', i)
          setSelected(i)
        }, [])}
        getItem={useCallback(({ onClick, onDoubleClick, ...item }, { isSelected, select }) => {
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

function QueryBuilderQueryEdit(props: AppProps & NavigatorProps) {
  return (
    <Section
      pad="xl"
      titlePad="lg"
      backgrounded
      title={props.title}
      afterTitle={
        <>
          <Select options={['API', 'GraphQL']} />
        </>
      }
    >
      {JSON.stringify(props)}
    </Section>
  )
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
