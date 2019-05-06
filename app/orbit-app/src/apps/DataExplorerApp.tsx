import {
  App,
  AppProps,
  createApp,
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
  List,
  Section,
  SubTitle,
  Tab,
  Table,
  Tabs,
  TextArea,
  Title,
  View,
  useScale,
} from '@o/ui'
import { remove } from 'lodash'
import React, { useEffect, useState, useRef } from 'react'
import ShadowDOM from 'react-shadow'

import { getAppListItem } from './apps/getAppListItem'
import { IS_ELECTRON } from '../constants'

const viewProps = {
  style: { height: '100%' },
  src: 'http://localhost:3001/altair',
}

function DataExplorerApp() {
  return <App>{IS_ELECTRON ? <webview {...viewProps} /> : <iframe {...viewProps} />}</App>
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

// <style
//         dangerouslySetInnerHTML={{
//           __html: `.resolved { flex: 1; overflow: hidden; }`,
//         }}
//       />
//       <ShadowDOM>
//         <div>
//           <style
//             dangerouslySetInnerHTML={{
//               __html: graphqlStyle,
//             }}
//           />
//           <style
//             dangerouslySetInnerHTML={{
//               __html: `
//                 :host > span {
//                   width: 100%:
//                   height: 100%;
//                   max-width: 100%;
//                   max-height: 100%;
//                   overflow: hidden;
//                   display: flex;
//                   flex-direction: row;
//                 }
//
//                 .graphiql-container {
//                   height: auto;
//                 }
//
//                 .editorWrap {
//                   height: 100%;
//                 }
//
//                 .history-contents {
//                   overflow-y: auto;
//                   flex: 1;
//                   display: flex;
//                   height: 100%;
//                 }
//
//                 .historyPaneWrap {
//                   flex: 1;
//                 }
//               `,
//             }}
//           />
//
//           <GraphiQLExplorer
//             schema={schema}
//             query={query}
//             onEdit={query => setState({ ...state, query })}
//             explorerIsOpen
//             // explorerIsOpen={this.state.explorerIsOpen}
//             // onToggleExplorer={this._handleToggleExplorer}
//           />
//           <GraphiQL
//             ref={graphiql}
//             fetcher={fetcher}
//             schema={schema}
//             query={query}
//             onEditQuery={query => setState({ ...state, query })}
//           >
//             <GraphiQL.Toolbar>
//               <GraphiQL.Button
//                 onClick={() => graphiql.current.handlePrettifyQuery()}
//                 label="Prettify"
//                 title="Prettify Query (Shift-Ctrl-P)"
//               />
//               <GraphiQL.Button
//                 onClick={() => graphiql.current.handleToggleHistory()}
//                 label="History"
//                 title="Show History"
//               />
//               <GraphiQL.Button
//                 // onClick={this._handleToggleExplorer}
//                 label="Explorer"
//                 title="Toggle Explorer"
//               />
//             </GraphiQL.Toolbar>
//           </GraphiQL>
//         </div>
//       </ShadowDOM>
