import { App, AppProps, createApp, Templates, TreeList, useActiveDataApps, useAppState, useAppWithDefinition, useCommand, useTreeList } from '@o/kit'
import { AppMetaCommand } from '@o/models'
import { Button, Col, Divider, Dock, DockButton, Form, FormField, Labeled, Layout, Pane, Paragraph, randomAdjective, randomNoun, Section, SelectableGrid, SubTitle, Tab, Table, Tabs, TextArea, Title, useGet, useOnMount } from '@o/ui'
import { capitalize, remove } from 'lodash'
import * as monaco from 'monaco-editor'
import React, { memo, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useOm } from '../om/om'
import { OrbitAppIcon } from '../views/OrbitAppIcon'
import { NavigatorProps, StackNavigator } from './StackNavigator'

function MonacoEditor() {
  const ref = useRef()
  useOnMount(() => {
    monaco.editor.create(ref.current, {
      value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
      language: 'javascript',
    })
  })
  return <div ref={ref} />
}

export default createApp({
  id: 'query-builder',
  name: 'Query Builder',
  icon: '',
  app: QueryBuilder,
})

function QueryBuilder(props: AppProps) {
  const om = useOm()
  const dataApps = useActiveDataApps()

  if (!dataApps.length) {
    return (
      <Templates.Message
        title="No data apps"
        subTitle="You haven't added any data apps to this workspace."
      >
        <Button alt="action" onClick={() => om.actions.router.showAppPage({ id: 'apps' })}>
          Install apps
        </Button>
      </Templates.Message>
    )
  }

  return (
    <App index={<QueryBuilderIndex />}>
      <QueryBuilderMain key={props.id} {...props} />
    </App>
  )
}

const treeId = 'query-builder'

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
  return (
    <StackNavigator
      key={props.id}
      id={`query-builder-nav=${props.id}`}
      defaultItem={{
        id: 'SelectApp',
        props,
      }}
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
        groupName: 'Installed Apps',
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
  const [mode, setMode] = useState<'api' | 'graph'>('api')
  const [showSidebar, setShowSidebar] = useState(true)

  return (
    <Section
      flex={1}
      titlePad="lg"
      backgrounded
      titleBorder
      title={props.title}
      afterTitle={
        <>
          <Labeled>
            <Labeled.Item group>
              <Button tooltip="API" icon="code" />
              <Button tooltip="Graph" icon="layout" />
            </Labeled.Item>
            <Labeled.Text>Query</Labeled.Text>
          </Labeled>

          <Labeled>
            <Labeled.Item>
              <Button
                defaultActive
                onChangeActive={setShowSidebar}
                tooltip="Toggle Explore API sidebar"
                icon="panel-stats"
              />
            </Labeled.Item>
            <Labeled.Text>API</Labeled.Text>
          </Labeled>
        </>
      }
    >
      <Suspense fallback={null}>
        {mode === 'api' ? (
          <APIQueryBuild id={+props.id} showSidebar={showSidebar} />
        ) : (
          <GraphQueryBuild id={+props.id} />
        )}
      </Suspense>
    </Section>
  )
}

function useAppMeta(identifier: string) {
  return useCommand(AppMetaCommand, { identifier })
}

const APIQueryBuild = memo((props: { id: number; showSidebar?: boolean }) => {
  const [, def] = useAppWithDefinition(+props.id)
  const meta = useAppMeta(def.id)
  const hasApiInfo = !!meta && !!meta.apiInfo
  return (
    <Layout type="row">
      <Pane flex={2} resizable>
        <Layout type="column">
          <Pane flex={2}>
            <MonacoEditor />
          </Pane>
          <Pane>123</Pane>
        </Layout>
      </Pane>
      <Pane title="Explore API" scrollable="y" pad display={props.showSidebar ? undefined : 'none'}>
        {hasApiInfo &&
          Object.keys(meta.apiInfo).map(key => {
            const info = meta.apiInfo[key]
            return (
              <Col key={key} space="xs" borderRadius={8}>
                <SubTitle>{info.name}</SubTitle>
                <Paragraph>{info.typeString}</Paragraph>
                <Paragraph>{info.comment}</Paragraph>
              </Col>
            )
          })}
      </Pane>
    </Layout>
  )
})

const GraphQueryBuild = memo((props: { id: number }) => {
  return (
    <Layout type="row">
      <Pane flex={2} />
      <Pane title="Explore API" scrollable="y" />
    </Layout>
  )
})

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
