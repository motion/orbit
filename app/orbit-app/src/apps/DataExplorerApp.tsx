import {
  App,
  // AppProps,
  createApp,
  // Templates,
  // useActiveSyncAppsWithDefinition,
  // useAppState,
  // useAppWithDefinition,
} from '@o/kit'
// import {
//   Button,
//   Divider,
//   Form,
//   FormField,
//   List,
//   Section,
//   SubTitle,
//   Tab,
//   Table,
//   Tabs,
//   TextArea,
//   Title,
//   View,
//   useScale,
// } from '@o/ui'
// import { remove } from 'lodash'
import React, { useEffect, useState, useRef } from 'react'
import ShadowDOM from 'react-shadow'
import { getIntrospectionQuery, buildClientSchema } from 'graphql'
import GraphiQLExplorer from 'graphiql-explorer'
import GraphiQL from '@o/graphiql'
import { useNode } from '@o/ui'

import graphqlStyle from '!raw-loader!@o/graphiql/graphiql.css'

function fetcher(params: Object) {
  return fetch('http://localhost:3001/graphql', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })
    .then(function(response) {
      return response.text()
    })
    .then(function(responseBody) {
      try {
        return JSON.parse(responseBody)
      } catch (e) {
        return responseBody
      }
    })
}

function DataExplorerApp() {
  const graphiql = useRef(null)
  const [state, setState] = useState({ schema: null, query: null })
  const { schema, query } = state
  const shadowRoot = useRef(null)
  const parentRoot = useNode({ map: x => x.parentNode })
  const explorerLeft =
    (shadowRoot.current && shadowRoot.current.querySelector('.graphiql-container').offsetLeft) || 0
  const codeMirrorTop =
    (shadowRoot.current && shadowRoot.current.querySelector('.query-editor').offsetTop) || 0
  const explorerTop =
    codeMirrorTop + ((parentRoot.current && parentRoot.current.getBoundingClientRect().y) || 0)

  useEffect(() => {
    fetcher({
      query: getIntrospectionQuery(),
    }).then(result => {
      setState({ schema: buildClientSchema(result.data), query })
    })
  }, [])

  return (
    <App>
      <style
        ref={parentRoot.ref}
        dangerouslySetInnerHTML={{
          __html: `.resolved { flex: 1; overflow: hidden; }`,
        }}
      />
      <ShadowDOM>
        <div>
          <div
            style={{ display: 'flex', flexFlow: 'row', flex: 1, overflow: 'hidden' }}
            ref={shadowRoot}
          >
            <GraphiQLExplorer
              schema={schema}
              query={query}
              onEdit={query => setState({ ...state, query })}
              explorerIsOpen
              // explorerIsOpen={this.state.explorerIsOpen}
              // onToggleExplorer={this._handleToggleExplorer}
            />
            <GraphiQL
              ref={graphiql}
              fetcher={fetcher}
              schema={schema}
              query={query}
              onEditQuery={query => setState({ ...state, query })}
            >
              <GraphiQL.Toolbar>
                <GraphiQL.Button
                  onClick={() => graphiql.current.handlePrettifyQuery()}
                  label="Prettify"
                  title="Prettify Query (Shift-Ctrl-P)"
                />
                <GraphiQL.Button
                  onClick={() => graphiql.current.handleToggleHistory()}
                  label="History"
                  title="Show History"
                />
                <GraphiQL.Button
                  // onClick={this._handleToggleExplorer}
                  label="Explorer"
                  title="Toggle Explorer"
                />
              </GraphiQL.Toolbar>
            </GraphiQL>
          </div>
          <style
            dangerouslySetInnerHTML={{
              __html: graphqlStyle,
            }}
          />
          <style
            dangerouslySetInnerHTML={{
              __html: `
                :host > span {
                  width: 100%;
                  height: 100%;
                  max-width: 100%;
                  max-height: 100%;
                  overflow: hidden;
                  display: flex;
                  flex-direction: row;
                }

                .graphiql-container {
                  height: auto;
                }

                .editorWrap {
                  height: 100%;
                }

                .history-contents {
                  overflow-y: auto;
                  flex: 1;
                  display: flex;
                  height: 100%;
                }

                .historyPaneWrap {
                  flex: 1;
                }

                .CodeMirror-hints {
                  transform: translate3d(${-explorerLeft}px,-${explorerTop}px,0);
                }

                .graphiql-explorer-root {
                  min-width: 200px;
                }
              `,
            }}
          />
        </div>
      </ShadowDOM>
    </App>
  )
}

export default createApp({
  id: 'data-explorer',
  name: 'Data Explorer',
  icon: '',
  app: DataExplorerApp,
  // props => (
  //   <App index={<DataExplorerIndex />}>
  //     <DataExplorerMain {...props} />
  //   </App>
  // ),
})

// function DataExplorerIndex() {
//   const syncApps = useActiveSyncAppsWithDefinition()
//   return (
//     <>
//       <List
//         titleBorder
//         title="Data Explorer"
//         subTitle="Explore installed data apps"
//         items={[...syncApps.map(x => ({ ...getAppListItem(x), group: 'Data Apps' }))]}
//       />
//     </>
//   )
// }

// function DataExplorerMain({ subId }: AppProps) {
//   const [app] = useAppWithDefinition((subId && +subId) || false)
//   const [queries, setQueries] = useAppState(`queries-${subId}`, [{ id: 0, name: 'My Query' }])

//   // TODO suspense
//   if (!app) {
//     return <Title>no app, subid {typeof subId}</Title>
//   }

//   return (
//     <Section
//       pad
//       backgrounded
//       title={app.appName}
//       subTitle={app.name}
//       titleBorder
//       icon={app.icon}
//       afterTitle={
//         <Button
//           alt="confirm"
//           onClick={() => setQueries([{ id: Math.random(), name: 'My Query' }, ...queries])}
//         >
//           Add query
//         </Button>
//       }
//     >
//       {queries.map(query => (
//         <Section
//           key={query.id}
//           bordered
//           title={query.name}
//           afterTitle={
//             <>
//               <Button
//                 icon="cross"
//                 onClick={() => setQueries(remove(queries, x => x.id !== query.id))}
//               />
//             </>
//           }
//           minHeight={200}
//         >
//           <Templates.MasterDetail
//             placeholder=""
//             items={[{ title: 'getMessages' }, { title: 'getThreads' }]}
//           >
//             {selected => (
//               <>
//                 <View padding={20}>
//                   <SubTitle>{selected.title}</SubTitle>
//                   <Divider />
//                   <Form>
//                     <FormField label="inboxId" value="" />
//                     <FormField label="search" value="" />
//                   </Form>
//                 </View>

//                 <Tabs>
//                   <Tab id="0" label="JSON">
//                     <TextArea minHeight={200} />
//                   </Tab>
//                   <Tab id="1" label="Table">
//                     <Table rows={[{ title: 'example', something: 'else' }]} />
//                   </Tab>
//                 </Tabs>
//               </>
//             )}
//           </Templates.MasterDetail>
//         </Section>
//       ))}
//     </Section>
//   )
// }
