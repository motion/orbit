import { App, AppViewProps, command, createApp, createStoreContext, getAppDefinition, react, save, Templates, TreeList, TreeListStore, useActiveDataApps, useApp, useAppState, useAppWithDefinition, useCommand, useHooks, useModels, useStoreSimple, useTreeList } from '@o/kit'
import { ApiArgType, AppMetaCommand, Bit, BitModel, CallAppBitApiMethodCommand } from '@o/models'
import { Button, Card, CardSimple, Center, CenteredText, Code, Col, DataInspector, Dock, DockButton, FormField, Labeled, Layout, Loading, MonoSpaceText, Pane, PaneButton, randomAdjective, randomNoun, Row, Scale, Section, Select, SelectableGrid, SeparatorHorizontal, SeparatorVertical, SimpleFormField, Space, SubTitle, Tab, Table, Tabs, Tag, TitleRow, Toggle, useGet } from '@o/ui'
import { capitalize } from 'lodash'
import React, { memo, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FindOptions } from 'typeorm'

import { useOm } from '../om/om'
import { MonacoEditor } from '../views/MonacoEditor'
import { OrbitAppIcon } from '../views/OrbitAppIcon'
import { NavigatorProps, StackNavigator, StackNavigatorStore, useCreateStackNavigator } from './StackNavigator'

export default createApp({
  id: 'query-builder',
  name: 'Query Builder',
  icon: 'code-block',
  app: QueryBuilderApp,
})

const treeId = 'query-builder4'

// TODO

class AppBitsStore {
  create(bit: Partial<Bit> & Pick<Bit, 'id'>) {
    return save(BitModel, bit)
  }
  update(bit: Partial<Bit>) {
    return save(BitModel, bit)
  }
  createOrUpdate(bit: Partial<Bit> & Pick<Bit, 'id'>) {
    return save(BitModel, bit)
  }
}

function useAppBits(args?: FindOptions<Bit>) {
  const app = useApp()
  const [bits] = useModels(BitModel, {
    ...args,
    where: {
      ...((args && args.where) || null),
      appId: app.id,
    },
  })
  const store = useStoreSimple(AppBitsStore)
  return [bits, store] as const
}

function QueryBuilderApp() {
  const om = useOm()
  const dataApps = useActiveDataApps()
  const [items, setItems] = useState<any[]>([])
  const hasItems = !!items.length
  const curItem = items[0]
  const id = (curItem && curItem.id) || -1
  const navigator = useCreateStackNavigator({
    id: `query-builder-nav-${id}-2`,
    items: {
      Null: () => null,
      SelectApp: QueryBuilderSelectApp,
      QueryEdit: QueryBuilderQueryEdit,
    },
    defaultItem: {
      id: 'Null',
      props: {},
    },
  })
  const treeList = useTreeList(treeId)
  const [bits, actions] = useAppBits()

  useEffect(() => {
    for (const id of Object.keys(treeList.state!.items!)) {
      const item = treeList.state!.items![id]
      actions.createOrUpdate({})
    }
  }, [treeList.state.items])

  useEffect(() => {
    if (!navigator.currentItem) return
    if (curItem && navigator.currentItem.id === 'Null') {
      navigator.navigateTo(
        {
          id: 'SelectApp',
          props: curItem,
        },
        {
          replaceAll: true,
        },
      )
    }
  }, [curItem, navigator.currentItem])

  if (!dataApps.length) {
    return (
      <Scale size={0.8}>
        <Templates.Message
          title="No data apps"
          subTitle="You haven't added any data apps to this workspace."
        >
          <Button alt="action" onClick={() => om.actions.router.showAppPage({ id: 'apps' })}>
            Install apps
          </Button>
        </Templates.Message>
      </Scale>
    )
  }

  return (
    <App
      index={<QueryBuilderIndex treeList={treeList} navigator={navigator} setItems={setItems} />}
    >
      {!hasItems && <CenteredText>Add a query</CenteredText>}
      <Suspense fallback={<Loading />}>
        {hasItems && <QueryBuilderMain key={id} treeList={treeList} navigator={navigator} />}
      </Suspense>
    </App>
  )
}

function QueryBuilderIndex({
  treeList,
  setItems,
}: {
  treeList: TreeListStore
  navigator: StackNavigatorStore
  setItems: any
}) {
  return (
    <>
      <TreeList
        alwaysSelected
        use={treeList}
        onSelect={items => {
          setItems(items)
        }}
        sortable
        shareable={false}
        itemProps={{
          editable: true,
          deletable: true,
          iconBefore: true,
          iconSize: 28,
        }}
        getItemProps={useCallback(item => {
          const treeItem = treeList.state.currentItemChildren.find(x => x.id === +item.id)
          if (treeItem) {
            const definition = getAppDefinition(`${treeItem.data!.identifier}`)
            if (definition) {
              return {
                icon: definition.icon,
              }
            }
          }
          return null
        }, [])}
      />
      <Dock>
        <DockButton
          id="add"
          icon="plus"
          onClick={() => {
            const name = `${capitalize(randomAdjective())} ${capitalize(randomNoun())}`
            treeList.actions.addItem({
              name,
              data: {
                identifier: '',
              },
            })
          }}
        />
      </Dock>
    </>
  )
}

function QueryBuilderMain({
  navigator,
  treeList,
}: AppViewProps & { navigator: StackNavigatorStore; treeList: TreeListStore }) {
  return (
    <StackNavigator
      useNavigator={navigator}
      onNavigate={item => {
        console.log('navigating to', item, treeList)
        if (!item) return
        // const icon = getAppDefinition(item.id)
        treeList.actions.updateSelectedItem({
          data: {
            identifier: item.props!.subType || '',
          },
        })
      }}
    />
  )
}

function QueryBuilderSelectApp(props: AppViewProps & NavigatorProps) {
  const dataApps = useActiveDataApps()
  const getActiveApps = useGet(dataApps)
  const [selected, setSelected] = useState<any[] | null>(null)
  return (
    <Section
      padding
      titlePadding
      backgrounded
      title={props.title || 'No title'}
      subTitle="Select data app."
      scrollable="y"
      afterTitle={
        <>
          <Button
            onClick={() => {
              if (!selected) {
                window.alert('Please select an item first')
                return
              }
              const item = selected[0]
              if (!item) {
                window.alert(`No item selected`)
                return
              }
              const app = dataApps.find(x => x.id === item.id!)
              if (!app) {
                window.alert(`No app!`)
                return
              }
              // navigate to app definition:
              props.navigation.navigateTo({
                id: 'QueryEdit',
                props: {
                  title: app.name,
                  id: `${app.id}`,
                  subType: app.identifier,
                  subTitle: app.name,
                },
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
        itemMinWidth={180}
        itemMaxWidth={220}
        items={useMemo(
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
        )}
        onSelect={useCallback(i => setSelected(i), [])}
        getItem={useCallback(({ onClick, onDoubleClick, ...item }, { isSelected, select }) => {
          return (
            <OrbitAppIcon
              app={getActiveApps().find(x => x.id === item.id)!}
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
  // @ts-ignore
  props: {
    id: number
    appId: number
    appIdentifier: string
  }

  private hooks = useHooks(() => {
    const [query, setQuery] = useAppState(`query-${this.props.id}`, '')
    return {
      query,
      setQuery,
    }
  }, this)

  method = ''
  placeholders: PlaceHolder[] = []
  arguments: any[] = []
  result = null
  argumentsVersion = 0
  query = ''

  setQuery = (next: string) => {
    this.query = next
  }

  syncQueryState = react(() => this.hooks.query, this.setQuery)

  saveQuery = () => {
    this.hooks.setQuery(() => this.query)
  }

  setMethod(next: string) {
    this.method = next
    this.arguments = []
    this.argumentsVersion++
    this.placeholders = []
  }

  updateQuery = react(
    () => this.argumentsVersion,
    async (_, { sleep }) => {
      await sleep(500)
      console.log('set query', this.resolvedArguments())
      // this.setQuery(
      //   `${this.props.method}(${this.resolvedArguments()
      //     .map(argToVal)
      //     .join(', ')})`,
      // )
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
      method: this.method,
      args: this.resolvedArguments(),
    })
  }
}

const QueryBuilder = createStoreContext(QueryBuilderStore)

const QueryBuilderQueryEdit = memo((props: AppViewProps & NavigatorProps) => {
  const id = +props.id! || -1
  const [app, def] = useAppWithDefinition(id)
  const [mode] = useState<'api' | 'graph'>('api')
  const [showSidebar, setShowSidebar] = useState(true)
  const queryBuilder = QueryBuilder.useCreateStore({
    id,
    appId: app!.id!,
    appIdentifier: def!.id!,
  })

  if (!def) {
    return null
  }

  return (
    <QueryBuilder.SimpleProvider value={queryBuilder}>
      <Section
        flex={1}
        titlePadding
        backgrounded
        titleBorder
        title={props.title}
        beforeTitle={<Button chromeless icon="chevron-left" onClick={props.navigation.back} />}
        titleProps={{
          editable: true,
          autoselect: true,
          onFinishEdit: (val: string) => {
            console.log('should persist new title', val)
          },
        }}
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

            <Button alt="action" onClick={queryBuilder.saveQuery}>
              Save
            </Button>
          </>
        }
      >
        <Suspense fallback={null}>
          {mode === 'api' ? (
            <APIQueryBuild id={+props.id!} showSidebar={showSidebar} />
          ) : (
            <GraphQueryBuild id={+props.id!} />
          )}
        </Suspense>
      </Section>
    </QueryBuilder.SimpleProvider>
  )
})

function useAppMeta(identifier: string) {
  return (
    useCommand(AppMetaCommand, { identifier }) || {
      packageId: '',
      directory: '',
      packageJson: {},
      apiInfo: {},
    }
  )
}

const APIQueryBuild = memo((props: { id: number; showSidebar?: boolean }) => {
  const queryBuilder = QueryBuilder.useStore()!
  const [, def] = useAppWithDefinition(+props.id)
  const meta = useAppMeta(def!.id)
  const apiInfo = meta.apiInfo || {}
  const allMethods = Object.keys(apiInfo)
  const [method, setMethod] = useState(apiInfo[allMethods[0]])
  const hasApiInfo = !!meta && !!apiInfo

  useEffect(() => {
    console.log('setting method', method)
    queryBuilder.setMethod(method.name)
  }, [method.name])

  if (!hasApiInfo) {
    return <Templates.Message title="This app doesn't have an API" />
  }

  if (!method) {
    return (
      <Col flex={1}>
        <Center>
          <SubTitle>No API methods found</SubTitle>
        </Center>
      </Col>
    )
  }

  return (
    <Layout type="row">
      <Pane flex={2} resizable>
        <Layout type="column">
          <Pane flex={2} resizable>
            <Col padding space>
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
                  <ArgumentField key={index} arg={arg} queryBuilder={queryBuilder} index={index} />
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

              <Card elevation={3} height={24 * 3 + 16 * 2}>
                <MonacoEditor
                  onChange={queryBuilder.setQuery}
                  padding
                  noGutter
                  readOnly
                  value={queryBuilder.query}
                />
              </Card>
            </Col>
          </Pane>
          <Pane resizable title="Output" collapsable padding>
            <Tabs defaultActive="0">
              <Tab padding key="0" label="Inspect">
                <DataInspector data={{ data: queryBuilder.result }} />
              </Tab>
              <Tab padding key="1" label="JSON">
                <Code minHeight={200}>{JSON.stringify(queryBuilder.result)}</Code>
              </Tab>
              <Tab padding key="2" label="Table">
                <Table items={[].concat(queryBuilder.result || [])} />
              </Tab>
            </Tabs>
          </Pane>
        </Layout>
      </Pane>
      <Pane display={props.showSidebar ? undefined : 'none'}>
        <Layout type="column">
          <Pane
            title="Placeholders"
            afterTitle={<PaneButton circular icon="plus" tooltip="Create new placeholder" />}
            scrollable="y"
            padding
            resizable
            collapsable
            debug
          >
            <SimpleFormField label="Name">
              <Tag alt="lightBlue">$0</Tag>
            </SimpleFormField>
            <FormField label="Type">
              <Select options={['String']} />
            </FormField>
            <FormField label="Value" name="pname" defaultValue="" />
          </Pane>

          <Pane title="Explore API" scrollable="y" padding flex={2} space collapsable>
            {allMethods.map(key => {
              const info = meta.apiInfo[key]
              return (
                <CardSimple
                  space
                  key={key}
                  title={info.name}
                  onClick={() => {
                    if (
                      window.confirm(
                        `Change current method? This will clear your current query data.`,
                      )
                    ) {
                      setMethod(info)
                    }
                  }}
                >
                  <MonoSpaceText alpha={0.6} fontWeight={500} size={0.8}>
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

const ArgumentField = memo(
  ({
    arg,
    queryBuilder,
    index,
  }: {
    queryBuilder: QueryBuilderStore
    index: number
    arg: ApiArgType
  }) => {
    const [numLines, setNumLines] = useState(1)
    const [isActive, setIsActive] = useAppState(
      `arg-${index}${arg.name}${arg.type}`,
      arg.isOptional ? false : true,
    )

    return (
      <Col space>
        <Row space alignItems="center">
          <Row opacity={isActive ? 1 : 0.35} space alignItems="center">
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
          <Space flex={1} />
          {arg.isOptional && (
            <Toggle
              checked={isActive}
              tooltip="Toggle active"
              onChange={x => {
                setIsActive(x)
              }}
            />
          )}
        </Row>
        <Card
          transition="all ease 300ms"
          opacity={isActive ? 1 : 0.35}
          elevation={1}
          height={24 * numLines + /* padding */ 16 * 2}
        >
          <MonacoEditor
            padding
            // not controlled
            noGutter
            value={queryBuilder.arguments[index]}
            onChange={val => {
              setIsActive(() => true)
              setNumLines(val.split('\n').length)
              queryBuilder.setArg(index, val)
            }}
          />
        </Card>
      </Col>
    )
  },
)

const GraphQueryBuild = memo((_: { id: number }) => {
  return (
    <Layout type="row">
      <Pane flex={2} />
      <Pane title="Explore API" scrollable="y" />
    </Layout>
  )
})

function argToVal(arg: any): string {
  try {
    if (typeof arg === 'string') {
      return `"${arg}"`
    }
    if (typeof arg === 'number' || typeof arg === 'boolean') {
      return `${arg}`
    }
    if (arg === null) {
      return `null`
    }
    if (arg === undefined) {
      return `undefined`
    }
    return JSON.stringify(arg)
      .slice(1)
      .slice(0, arg.length - 2)
  } catch (err) {
    console.warn('error', err)
    return ``
  }
}
