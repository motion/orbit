import { App, AppViewProps, command, createApp, react, Templates, TreeList, useActiveDataApps, useAppState, useAppWithDefinition, useCommand, useStore, useTreeList } from '@o/kit'
import { AppMetaCommand, CallAppBitApiMethodCommand } from '@o/models'
import { Button, Card, CardSimple, Col, DataInspector, Divider, Dock, DockButton, Form, FormField, Labeled, Layout, MonoSpaceText, Pane, PaneButton, randomAdjective, randomNoun, Row, Section, Select, SelectableGrid, SeparatorHorizontal, SeparatorVertical, SimpleFormField, Space, SubTitle, Tab, Table, Tabs, Tag, TextArea, Title, useGet, View } from '@o/ui'
import { capitalize, remove } from 'lodash'
import React, { memo, Suspense, useCallback, useMemo, useState } from 'react'

import { useOm } from '../om/om'
import { MonacoEditor } from '../views/MonacoEditor'
import { OrbitAppIcon } from '../views/OrbitAppIcon'
import { NavigatorProps, StackNavigator } from './StackNavigator'

export default createApp({
  id: 'query-builder',
  name: 'Query Builder',
  icon: '',
  app: QueryBuilder,
})

function QueryBuilder(props: AppViewProps) {
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

function QueryBuilderMain(props: AppViewProps) {
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

function QueryBuilderSelectApp(props: AppViewProps & NavigatorProps) {
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
      pad
      titlePad
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
              // navigate to app definition:
              props.navigation.navigate('QueryEdit', {
                title: props.title,
                id: item.id,
                subType: item.identifier,
                subTitle: item.title,
              })
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

function QueryBuilderQueryEdit(props: AppViewProps & NavigatorProps) {
  const [mode, setMode] = useState<'api' | 'graph'>('api')
  const [showSidebar, setShowSidebar] = useState(true)
  const [app, def] = useAppWithDefinition(+props.id)
  console.log('appDef', app, def)

  return (
    <Section
      flex={1}
      titlePad
      backgrounded
      titleBorder
      title={props.title}
      subTitle={props.subTitle}
      icon={def.icon}
      afterTitle={
        <>
          <Labeled>
            <Labeled.Item>
              <Button
                defaultActive
                onChangeActive={setShowSidebar}
                tooltip="Toggle Explore API sidebar"
                icon="panel-stats"
              />
            </Labeled.Item>
            <Labeled.Text>Sidebar</Labeled.Text>
          </Labeled>

          <SeparatorVertical height={40} />

          <Labeled>
            <Labeled.Item group>
              <Tabs TabComponent={Button} defaultActive="0">
                <Tab key="0" icon="code" />
                <Tab key="1" icon="layout" />
              </Tabs>
              {/* <Button tooltip="API" icon="code" />
              <Button tooltip="Graph" icon="layout" /> */}
            </Labeled.Item>
            <Labeled.Text>Query</Labeled.Text>
          </Labeled>

          <SeparatorVertical height={40} />

          <Button alt="action">Save</Button>
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

const defaultValues = {
  string: '`hello`',
  number: '0',
  Object: '{}',
}

type PlaceHolder = {
  name: string
  type: 'string' | 'date' | 'number'
  value: any
}

class QueryBuilderStore {
  props: {
    appId: number
    appIdentifier: string
    method: string
  }
  placeholders: PlaceHolder[] = []
  arguments: any[] = []

  updateMethod = react(
    () => this.props.method,
    () => {
      this.arguments = []
      this.placeholders = []
    },
  )

  get values() {
    return this.arguments.map(x => {
      let y = x
      for (const [index, placeholder] of this.placeholders.entries()) {
        y = y.replace(`$${index}`, placeholder)
      }
      return y
    })
  }

  async test() {
    console.log(
      await command(CallAppBitApiMethodCommand, {
        appId: this.props.appId,
        appIdentifier: this.props.appIdentifier,
        method: this.props.method,
        args: this.values,
      }),
    )
  }
}

const APIQueryBuild = memo((props: { id: number; showSidebar?: boolean }) => {
  const [app, def] = useAppWithDefinition(+props.id)
  const meta = useAppMeta(def.id)
  const allMethods = Object.keys(meta.apiInfo)
  const [method, setMethod] = useState(meta.apiInfo[allMethods[0]])
  const queryBuilder = useStore(QueryBuilderStore, {
    method: method.name,
    appId: app.id,
    appIdentifier: def.id,
  })
  const hasApiInfo = !!meta && !!meta.apiInfo
  const [numLines, setNumLines] = useState(1)

  console.log('queryBuilder', queryBuilder)

  const onChangeSource = useCallback(source => {
    setNumLines(source.split('\n').length)
  }, [])

  if (!hasApiInfo) {
    return <Templates.Message title="This app doesn't have an API" />
  }

  return (
    <Layout type="row">
      <Pane flex={2} resizable background={theme => theme.backgroundStrong}>
        <Col pad space>
          <Row justifyContent="space-between">
            <Tag size={1.2} alt="lightGray">
              {method.name}
            </Tag>
            <Button alt="flat" sizeIcon={1.4} tooltip="Show help" icon="help" />
          </Row>

          {(method.args || []).map((arg, index) => {
            console.log('arg', arg)
            return (
              <React.Fragment key={index}>
                <Row space alignItems="center">
                  <SubTitle>{arg.name}</SubTitle>
                  <Tag alt="lightGreen" size={0.75} fontWeight={200}>
                    {arg.type}
                  </Tag>
                  {arg.isOptional && (
                    <Tag alt="lightBlue" size={0.75} fontWeight={200}>
                      Optional
                    </Tag>
                  )}
                </Row>
                <Card pad elevation={3} height={24 * numLines + /* padding */ 16 * 2}>
                  <MonacoEditor
                    value={`${defaultValues[arg.type] || ''}`}
                    onChange={onChangeSource}
                    lineNumbers="off"
                    glyphMargin={false}
                    folding={false}
                    lineDecorationsWidth={0}
                    lineNumbersMinChars={0}
                  />
                </Card>
              </React.Fragment>
            )
          })}

          <Space size="xl" />
          <SeparatorHorizontal />
          <Space size="xl" />

          <Card title="Preview" pad />

          <Button margin={[0, 'auto']} size={1.3} iconAfter icon="play">
            Run
          </Button>

          <Space size="xl" />
          <SeparatorHorizontal />
          <Space size="xl" />

          <Card title="Output" pad>
            <DataInspector data={{ hello: 'world' }} />
          </Card>
        </Col>
      </Pane>
      <Pane display={props.showSidebar ? undefined : 'none'}>
        <Layout type="column">
          <Pane
            title="Placeholders"
            afterTitle={<PaneButton circular icon="plus" tooltip="Create new placeholder" />}
            scrollable="y"
            pad
          >
            <SimpleFormField label="Name">
              <Tag alt="lightBlue">$0</Tag>
            </SimpleFormField>
            <FormField label="Type">
              <Select options={['String']} />
            </FormField>
            <FormField label="Value" name="pname" defaultValue="" />
          </Pane>

          <Pane title="Explore API" scrollable="y" pad flex={2}>
            {allMethods.map(key => {
              const info = meta.apiInfo[key]
              return (
                <>
                  <CardSimple title={info.name}>
                    <MonoSpaceText alpha={0.6} fontWeight={700} size={0.85}>
                      {info.typeString}
                    </MonoSpaceText>
                    {info.comment}
                  </CardSimple>
                  {/* <Col key={key} space="xs" borderRadius={8}>
                    <Tag alt="lightGray">{info.name}</Tag>
                    <MonoSpaceText alpha={0.6} fontWeight={700} size={0.85}>
                      {info.typeString}
                    </MonoSpaceText>
                    <Paragraph>{info.comment}</Paragraph>
                  </Col> */}
                </>
              )
            })}
          </Pane>
        </Layout>
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
export function CreateQuery(props: AppViewProps) {
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
