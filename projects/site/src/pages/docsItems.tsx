import React from 'react'

import { ListSubTitle } from '../views/ListSubTitle'

const titleItem = { titleProps: { size: 1.1, fontWeight: 500 } }

const guides = [
  {
    selectable: false,
    hideBorder: true,
    children: <ListSubTitle marginTop={-4}>Start</ListSubTitle>,
  },
  {
    id: '',
    title: 'Introduction',
    ...titleItem,
  },
  {
    id: 'quickStart',
    title: 'Quick start',
    ...titleItem,
  },
  {
    id: 'buildapp',
    title: 'Building an app',
    ...titleItem,
  },
  {
    id: 'appstore',
    title: 'App Store',
    ...titleItem,
  },

  {
    selectable: false,
    hideBorder: true,
    children: <ListSubTitle marginTop={40}>Examples</ListSubTitle>,
  },
  {
    id: 'databaseviewer',
    title: 'Database Viewer',
    subTitle: 'Apps, custom queries, mutations.',
    ...titleItem,
  },
  {
    id: 'customermanager',
    title: 'Customer Manager',
    subTitle: 'Postgres, multiple views.',
    ...titleItem,
  },
]

const uikit = [
  {
    selectable: false,
    hideBorder: true,
    children: (
      <ListSubTitle marginTop={40} marginBottom={0}>
        User Interface
      </ListSubTitle>
    ),
  },
  { id: 'ui-intro', title: 'User Interface Introduction', ...titleItem },

  { id: 'lists', title: 'Lists', icon: 'th-list', group: 'Collections' },
  { id: 'tables', title: 'Tables', icon: 'th' },
  { id: 'tree', title: 'Tree', icon: 'diagram-tree' },
  { id: 'treeList', title: 'TreeList', icon: 'chevron-right' },
  { id: 'definitionList', title: 'DefinitionList', icon: 'list-columns' },
  {
    group: 'Views',
    id: 'surfaces',
    icon: 'layer',
    title: 'Surface',
  },
  { id: 'buttons', icon: 'button', title: 'Buttons', indent: 1 },
  { id: 'cards', title: 'Cards', icon: 'credit-card', indent: 1 },
  { id: 'icons', icon: 'star', title: 'Icons' },
  { id: 'install', title: 'Sections', icon: 'application' },
  { id: 'popovers', title: 'Popovers', icon: 'direction-right' },
  { id: 'decorations', title: 'Decorations', icon: 'clean' },
  { id: 'progress', title: 'Progress', icon: 'circle' },
  { id: 'masterdetail', title: 'MasterDetail', icon: 'list-detail-view', group: 'Templates' },
  { id: 'flow', title: 'Flow', icon: 'layout' },
  { id: 'message', title: 'Message', icon: 'chat' },
  { id: 'calendar', title: 'Calendar', icon: 'calendar', group: 'Date & Time' },
  { id: 'dateformat', title: 'DateFormat', icon: 'event' },
  { id: 'timeago', title: 'TimeAgo', icon: 'time' },
  { id: 'modal', title: 'Modal', group: 'Modals', icon: 'multi-select' },
  { id: 'gallerymodal', title: 'GalleryModal', icon: 'multi-select' },
  { id: 'mediamodal', title: 'MediaModal', icon: 'multi-select' },
  { id: 'basics', title: 'Basics', icon: 'control', group: 'Layout' },
  { id: 'sidebar', title: 'Sidebar', icon: 'panel-stats' },
  { id: 'slider', title: 'Slider', icon: 'double-caret-horizontal' },
  { id: 'tabs', title: 'Tabs', icon: 'add-row-top' },
  { id: 'layout', title: 'Layout', icon: 'page-layout', subTitle: 'Layouts for placing content' },
  { id: 'pane', title: 'Pane', icon: 'column-layout', indent: 1 },
  { id: 'gridlayout', title: 'GridLayout', icon: 'grid-view', indent: 1 },
  { id: 'masonrylayout', title: 'MasonryLayout', icon: 'skew-grid', indent: 1 },
  { id: 'flowlayout', title: 'FlowLayout', icon: 'layout-hierarchy', indent: 1 },
  { id: 'statusbar', title: 'StatusBar', icon: 'bar', group: 'Toolbars' },
  { id: 'toolbar', title: 'Toolbar', icon: 'bottom' },
  { id: 'form', title: 'Form', icon: 'form', group: 'Forms' },
  { id: 'flow', title: 'Flow + Form', icon: 'dot', indent: 1 },
  { id: 'form', title: 'Form Elements', icon: 'widget' },
  { id: 'select', title: 'Select', icon: 'dot', indent: 1 },
  { id: 'input', title: 'Input', icon: 'dot', indent: 1 },
  { id: 'basics', title: 'Basics', icon: '', group: 'Text' },
  { id: 'titles', title: 'Titles' },
  { id: 'message', title: 'Message' },
  { id: 'banner', title: 'Banner' },
  { id: 'chat', title: 'Chat', group: 'Media & Content' },
  { id: 'document', title: 'Document' },
  { id: 'markdown', title: 'Markdown' },
  { id: 'task', title: 'Task' },
  { id: 'thread', title: 'Thread' },
  { id: 'hoverglow', title: 'HoverGlow', group: 'Effects' },
  { id: 'tilthoverglow', title: 'TiltHoverGlow' },
  { id: 'glint', title: 'Glint' },
  { id: 'tilt', title: 'Tilt' },
  { id: 'fetch', title: 'Fetch', group: 'Utilities' },
  { id: 'orderable', title: 'Orderable' },
  { id: 'contextmenu', title: 'ContextMenu' },
  { id: 'interactive', title: 'Interactive' },
  { id: 'collapsable', title: 'Collapsable' },
  { id: 'scale', title: 'Scale' },
  { id: 'visibility', title: 'Visibility' },
  { id: 'passprops', title: 'PassProps' },
]

export const docsItems = {
  all: [...guides, ...uikit],
  ui: uikit,
  docs: guides,
  kit: uikit,
}

export const docsViews = {
  install: {
    page: () => import('./DocsPage/DocsInstall.mdx'),
  },
  start: {
    page: () => import('./DocsPage/DocsStart.mdx'),
  },
  quickStart: {
    page: () => import('./DocsPage/DocsQuickStart.mdx'),
  },
  buildapp: {
    page: () => import('./DocsPage/DocsBuildingAnApp.mdx'),
  },
  icons: {
    page: () => import('./DocsPage/DocsIcons.mdx'),
    examples: () => import('./DocsPage/DocsIcons'),
    examplesSource: () => import('!raw-loader!./DocsPage/DocsIcons'),
    source: () => import('!raw-loader!@o/ui/src/Icon'),
    types: () => import('../../tmp/Icon.json'),
  },
  popovers: {
    page: () => import('./DocsPage/DocsPopovers.mdx'),
    examples: () => import('./DocsPage/DocsPopovers'),
    examplesSource: () => import('!raw-loader!./DocsPage/DocsPopovers'),
    source: () => import('!raw-loader!@o/ui/src/Popover'),
    types: () => import('../../tmp/Popover.json'),
  },
  tree: {
    page: () => import('./DocsPage/DocsTree.mdx'),
    examples: () => import('./DocsPage/DocsTree'),
    examplesSource: () => import('!raw-loader!./DocsPage/DocsTree'),
    source: () => import('!raw-loader!@o/ui/src/Tree'),
    types: () => import('../../tmp/Tree.json'),
  },
  definitionList: {
    page: () => import('./DocsPage/DocsDefinitionList.mdx'),
    examples: () => import('./DocsPage/DocsDefinitionList'),
    examplesSource: () => import('!raw-loader!./DocsPage/DocsDefinitionList'),
    source: () => import('!raw-loader!@o/ui/src/DefinitionList'),
    types: () => import('../../tmp/DefinitionList.json'),
  },
  buttons: {
    page: () => import('./DocsPage/DocsButtons.mdx'),
    examples: () => import('./DocsPage/DocsButtons'),
    examplesSource: () => import('!raw-loader!./DocsPage/DocsButtons'),
    source: () => import('!raw-loader!@o/ui/src/buttons/Button'),
    types: () => import('../../tmp/Button.json'),
  },
  surfaces: {
    page: () => import('./DocsPage/DocsSurfaces.mdx'),
    source: () => import('!raw-loader!@o/ui/src/Surface'),
    types: () => import('../../tmp/Surface.json'),
  },
  cards: {
    page: () => import('./DocsPage/DocsCards.mdx'),
    examples: () => import('./DocsPage/DocsCards'),
    examplesSource: () => import('!raw-loader!./DocsPage/DocsCards'),
    source: () => import('!raw-loader!@o/ui/src/Card'),
    types: () => import('../../tmp/Card.json'),
  },
  progress: {
    page: () => import('./DocsPage/DocsProgress.mdx'),
    examples: () => import('./DocsPage/DocsProgress'),
    examplesSource: () => import('!raw-loader!./DocsPage/DocsProgress'),
    source: () => import('!raw-loader!@o/ui/src/progress/Progress'),
    types: () => import('../../tmp/Progress.json'),
  },
  lists: {
    page: () => import('./DocsPage/DocsLists.mdx'),
    examples: () => import('./DocsPage/DocsLists'),
    examplesSource: () => import('!raw-loader!./DocsPage/DocsLists'),
    source: () => import('!raw-loader!@o/ui/src/lists/List'),
    types: () => import('../../tmp/List.json'),
  },
  tables: {
    page: () => import('./DocsPage/DocsTables.mdx'),
    examples: () => import('./DocsPage/DocsTables'),
    examplesSource: () => import('!raw-loader!./DocsPage/DocsTables'),
    source: () => import('!raw-loader!@o/ui/src/tables/Table'),
    types: () => import('../../tmp/Table.json'),
  },
}
