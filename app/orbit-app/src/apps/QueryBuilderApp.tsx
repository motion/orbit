import { App, AppViewProps, command, createApp, react, Templates, TreeList, useActiveDataApps, useAppWithDefinition, useCommand, useStore, useTreeList } from '@o/kit'
import { AppMetaCommand, CallAppBitApiMethodCommand } from '@o/models'
import { Button, Card, CardSimple, Col, DataInspector, Dock, DockButton, FormField, Labeled, Layout, MonoSpaceText, Pane, PaneButton, randomAdjective, randomNoun, Row, Section, Select, SelectableGrid, SeparatorHorizontal, SeparatorVertical, SimpleFormField, Space, SubTitle, Tab, Table, Tabs, Tag, TextArea, Title, TitleRow, useGet } from '@o/ui'
import { capitalize } from 'lodash'
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
  string: '',
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
  result = null
  preview = ''
  argumentsVersion = 0

  updateMethod = react(
    () => this.props.method,
    () => {
      this.arguments = []
      this.argumentsVersion++
      this.placeholders = []
    },
  )

  updatePreview = react(
    () => this.argumentsVersion,
    async (_, { sleep }) => {
      await sleep(500)
      this.preview = `${this.props.method}(${this.resolvedArguments()
        .map(argToVal)
        .join(', ')})`
    },
  )

  setArg = (index: number, val: any) => {
    this.arguments[index] = val
    this.argumentsVersion++
  }

  resolvedArguments() {
    return this.arguments.map(x => {
      let y = x
      if (this.placeholders.length) {
        for (const [index, placeholder] of this.placeholders.entries()) {
          y = y.replace(`$${index}`, placeholder)
        }
      }
      return y
    })
  }

  run = async () => {
    this.result = await command(CallAppBitApiMethodCommand, {
      appId: this.props.appId,
      appIdentifier: this.props.appIdentifier,
      method: this.props.method,
      args: this.resolvedArguments(),
    })
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
            if (typeof queryBuilder.arguments[index] === 'undefined') {
              queryBuilder.arguments[index] = defaultValues[arg.type] || ''
            }

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
                    // not controlled
                    noGutter
                    value={queryBuilder.arguments[index]}
                    onChange={val => {
                      setNumLines(val.split('\n').length)
                      queryBuilder.setArg(index, val)
                    }}
                  />
                </Card>
              </React.Fragment>
            )
          })}

          <Space size="xl" />
          <SeparatorHorizontal />
          <Space size="xl" />

          <TitleRow
            title="Preview"
            size="xs"
            after={
              <Button
                alt="approve"
                margin={[0, 'auto']}
                size="lg"
                iconAfter
                icon="play"
                onClick={queryBuilder.run}
              >
                Run
              </Button>
            }
          />

          <Card pad elevation={3} height={24 * 3 + 16 * 2}>
            <MonacoEditor noGutter readOnly value={queryBuilder.preview} />
          </Card>

          <Title size="xs">Output</Title>
          <Tabs pad defaultActive="0">
            <Tab key="0" label="Inspect">
              <DataInspector data={{ data: queryBuilder.result }} />
            </Tab>
            <Tab key="1" label="JSON">
              <TextArea minHeight={200} value={JSON.stringify(queryBuilder.result)} />
            </Tab>
            <Tab key="2" label="Table">
              <Table items={[].concat(queryBuilder.result)} />
            </Tab>
          </Tabs>
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
                <CardSimple key={key} title={info.name}>
                  <MonoSpaceText alpha={0.6} fontWeight={700} size={0.85}>
                    {info.typeString}
                  </MonoSpaceText>
                  {info.comment}
                </CardSimple>
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

function argToVal(arg: any): string {
  if (typeof arg === 'string') {
    return `"${arg}"`
  }
  if (typeof arg === 'number' || typeof arg === 'boolean') {
    return `${arg}`
  }
  return JSON.stringify(arg)
}
