import React from 'react'

import { fontProps } from '../constants'
import { ListSubTitle } from '../views/ListSubTitle'

const titleItem = {
  pad: 'md',
  titleProps: { size: 1.2, fontWeight: 300, ...fontProps.GTEesti, className: '' },
}

const guides = [
  {
    selectable: false,
    hideBorder: true,
    children: <ListSubTitle>Start</ListSubTitle>,
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
    selectable: false,
    hideBorder: true,
    children: <ListSubTitle paddingTop={30}>Examples</ListSubTitle>,
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
      <ListSubTitle paddingTop={30} marginBottom={0}>
        User Interface
      </ListSubTitle>
    ),
  },

  { id: 'layout', title: 'Laying out your interface', ...titleItem },
  { id: 'customSurfaces', title: 'Customizing surfaces', ...titleItem },
  { id: 'templates', title: 'Templates', ...titleItem },

  { id: 'list', title: 'List', icon: 'th-list', group: 'Collections' },
  { id: 'table', title: 'Table', icon: 'th' },
  { id: 'tree', title: 'Tree', icon: 'diagram-tree' },
  // { id: 'treeList', title: 'TreeList', icon: 'chevron-right' },
  { id: 'definitionList', title: 'DefinitionList', icon: 'list-columns' },
  {
    group: 'Views',
    id: 'surface',
    icon: 'layer',
    title: 'Surface',
  },
  { id: 'button', icon: 'button', title: 'Button', indent: 1 },
  { id: 'card', title: 'Cards', icon: 'credit-card', indent: 1 },
  { id: 'icon', icon: 'star', title: 'Icons' },
  { id: 'section', title: 'Section', icon: 'application' },
  { id: 'popover', title: 'Popover', icon: 'direction-right' },
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

  { id: 'text', title: 'Text', icon: '', group: 'Text' },
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
  start: {
    page: () => import('./DocsPage/DocsStart.mdx'),
  },
  quickStart: {
    page: () => import('./DocsPage/DocsQuickStart.mdx'),
  },
  buildapp: {
    page: () => import('./DocsPage/DocsBuildingAnApp.mdx'),
  },
  layout: {
    page: () => import('./DocsPage/DocsLayout.mdx'),
  },
  icon: {
    page: () => import('./DocsPage/DocsIcon.mdx'),
    examples: () => import('./DocsPage/DocsIcon'),
    examplesSource: () => import('!raw-loader!./DocsPage/DocsIcon'),
    source: () => import('!raw-loader!@o/ui/src/Icon'),
    types: () => import('../../tmp/Icon.json'),
  },
  popover: {
    page: () => import('./DocsPage/DocsPopover.mdx'),
    examples: () => import('./DocsPage/DocsPopover'),
    examplesSource: () => import('!raw-loader!./DocsPage/DocsPopover'),
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
  button: {
    page: () => import('./DocsPage/DocsButton.mdx'),
    examples: () => import('./DocsPage/DocsButton'),
    examplesSource: () => import('!raw-loader!./DocsPage/DocsButton'),
    source: () => import('!raw-loader!@o/ui/src/buttons/Button'),
    types: () => import('../../tmp/Button.json'),
  },
  surface: {
    page: () => import('./DocsPage/DocsSurface.mdx'),
    source: () => import('!raw-loader!@o/ui/src/Surface'),
    types: () => import('../../tmp/Surface.json'),
  },
  card: {
    page: () => import('./DocsPage/DocsCard.mdx'),
    examples: () => import('./DocsPage/DocsCard'),
    examplesSource: () => import('!raw-loader!./DocsPage/DocsCard'),
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
  list: {
    page: () => import('./DocsPage/DocsList.mdx'),
    examples: () => import('./DocsPage/DocsList'),
    examplesSource: () => import('!raw-loader!./DocsPage/DocsList'),
    source: () => import('!raw-loader!@o/ui/src/lists/List'),
    types: () => import('../../tmp/List.json'),
  },
  table: {
    page: () => import('./DocsPage/DocsTable.mdx'),
    examples: () => import('./DocsPage/DocsTable'),
    examplesSource: () => import('!raw-loader!./DocsPage/DocsTable'),
    source: () => import('!raw-loader!@o/ui/src/tables/Table'),
    types: () => import('../../tmp/Table.json'),
  },
  section: {
    page: () => import('./DocsPage/DocsSection.mdx'),
    examples: () => import('./DocsPage/DocsSection'),
    examplesSource: () => import('!raw-loader!./DocsPage/DocsSection'),
    source: () => import('!raw-loader!@o/ui/src/Section'),
    types: () => import('../../tmp/Section.json'),
  },
  calendar: {
    page: () => import('./DocsPage/DocsCalendar.mdx'),
    examples: () => import('./DocsPage/DocsCalendar'),
    examplesSource: () => import('!raw-loader!./DocsPage/DocsCalendar'),
    source: () => import('!raw-loader!@o/ui/src/Calendar'),
    types: () => import('../../tmp/Calendar.json'),
  },
  input: {
    page: () => import('./DocsPage/DocsInput.mdx'),
    examples: () => import('./DocsPage/DocsInput'),
    examplesSource: () => import('!raw-loader!./DocsPage/DocsInput'),
    source: () => import('!raw-loader!@o/ui/src/forms/Input'),
    types: () => import('../../tmp/Input.json'),
  },
}
