import { createApp } from '@o/kit'

export default createApp({
  id: 'demo-app-layout',
  name: 'App Demo: Layout',
  icon: 'layout',
  iconColors: ['rgb(177, 13, 201)', 'rgb(157, 13, 191)'],
  app: () => '123123 123 123 123 123123',
})

// const treeData = {
//   0: {
//     id: 0,
//     name: 'Root Item',
//     expanded: true,
//     children: [1, 2, 5, 6, 7, 8, 9, 10],
//   },
//   1: {
//     id: 1,
//     name: 'test one',
//     expanded: false,
//     children: [3, 4],
//   },
//   2: {
//     id: 2,
//     name: 'lorem ipsum dolor',
//     expanded: false,
//     children: [],
//   },
//   3: {
//     id: 3,
//     name: 'sit amet',
//     expanded: false,
//     children: [],
//   },
//   4: {
//     id: 4,
//     name: 'test two',
//     expanded: false,
//     children: [],
//   },
//   5: {
//     id: 5,
//     name: 'lorem ipsum dolor',
//     expanded: false,
//     children: [],
//   },
//   6: {
//     id: 6,
//     name: 'ipsum dolor',
//     expanded: false,
//     children: [],
//   },
//   7: {
//     id: 7,
//     name: 'lorem ',
//     expanded: false,
//     children: [],
//   },
//   8: {
//     id: 8,
//     name: ' ipsum ',
//     expanded: false,
//     children: [],
//   },
//   9: {
//     id: 9,
//     name: 'loremdolor',
//     expanded: false,
//     children: [],
//   },
//   10: {
//     id: 10,
//     name: 'ipsu dolor',
//     expanded: false,
//     children: [],
//   },
// }

// // const rowTypes = ['error', 'debug', 'warn', 'fatal', 'verbose', 'info']
// const len = employees.length
// const items = [...new Array(10000)].map((_, index) => employees[index % (len - 1)])

// function DemoLayoutApp() {
//   const [treeState, setTreeState] = useState(treeData)
//   const [selected, setSelected] = useState(0)
//   return null
//   return (
//     <Scale size={1}>
//       <Layout type="row">
//         <Pane title="Select Items 123" resizable>
//           <Tree
//             root={0}
//             selected={selected}
//             onTreeItemSelected={id => {
//               console.log('select2', id)
//               setSelected(id)
//             }}
//             onTreeItemExpanded={id => {
//               setTreeState(
//                 produce(treeState, next => {
//                   next[id].expanded = !next[id].expanded
//                 }),
//               )
//             }}
//             elements={treeState}
//           />
//         </Pane>
//         <Pane flex={3} collapsable title="Inspect" resizable>
//           <Table
//             columnSizes={{ username: 120 }}
//             searchable
//             query={useActiveSearchQuery()}
//             selectable="multi"
//             shareable
//             items={items}
//           />
//         </Pane>
//         <Pane>
//           <Layout type="column">
//             <Pane title="Elements" resizable padding collapsable>
//               <DataInspector
//                 data={{
//                   test: 'this',
//                   thing: 0,
//                   is: 'hi',
//                   who: 'are',
//                   you: new Date(),
//                   color: 'yellow',
//                   another: {
//                     one: 'color',
//                     two: 'green',
//                   },
//                 }}
//               />
//             </Pane>
//             <Pane title="Elements" flex={2} resizable padding collapsable space>
//               <SubTitle>Sub title</SubTitle>
//               <Paragraph>lorem ipsum dolor sit amet.</Paragraph>
//             </Pane>
//           </Layout>
//         </Pane>
//       </Layout>
//     </Scale>
//   )
// }
