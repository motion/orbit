import React from 'react'

import { fontProps } from '../constants'
import { ListSubTitle } from '../views/ListSubTitle'

const titleItem = {
  titleProps: { size: 1.1, ...fontProps.BodyFont, className: '' },
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
    ...titleItem,
  },
  {
    id: 'customermanager',
    title: 'Customer Manager',
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

  { id: 'ui-layout', title: 'Laying out your interface', ...titleItem },
  { id: 'ui-hooks', title: 'Hooks', ...titleItem },
  // { id: 'ui-themes', title: 'Themes', ...titleItem },
  // { id: 'customSurfaces', title: 'Customizing surfaces', ...titleItem },
  // { id: 'templates', title: 'Templates', ...titleItem },

  { id: 'list', title: 'List', icon: 'th-list', group: 'Collections' },
  { id: 'table', title: 'Table', icon: 'th' },
  { id: 'tree', title: 'Tree', icon: 'diagram-tree' },
  // { id: 'treeList', title: 'TreeList', icon: 'chevron-right' },
  { id: 'definitionList', title: 'DefinitionList', icon: 'list-columns' },

  { id: 'basics', title: 'Basics', icon: 'control', group: 'Layout' },
  { id: 'sidebar', title: 'Sidebar', icon: 'panel-stats' },
  { id: 'slider', title: 'Slider', icon: 'double-caret-horizontal' },
  { id: 'tabs', title: 'Tabs', icon: 'add-row-top' },
  { id: 'layout', title: 'Layout', icon: 'page-layout', subTitle: 'Layouts for placing content' },
  { id: 'gridlayout', title: 'GridLayout', icon: 'grid-view', indent: 1 },
  { id: 'masonrylayout', title: 'MasonryLayout', icon: 'skew-grid', indent: 1 },
  { id: 'flowlayout', title: 'FlowLayout', icon: 'layout-hierarchy', indent: 1 },

  {
    group: 'Views',
    id: 'surface',
    icon: 'layer',
    title: 'Surface',
  },
  { id: 'button', icon: 'button', title: 'Button', indent: 1 },
  { id: 'card', title: 'Card', icon: 'credit-card', indent: 1 },
  { id: 'tag', icon: 'tag', title: 'Tag', indent: 1 },
  { id: 'icon', icon: 'star', title: 'Icons' },
  { id: 'section', title: 'Section', icon: 'application' },
  { id: 'popover', title: 'Popover', icon: 'direction-right', beta: true },
  // { id: 'decorations', title: 'Decorations', icon: 'clean' },
  { id: 'progress', title: 'Progress', icon: 'circle' },

  { id: 'masterdetail', title: 'MasterDetail', icon: 'list-detail-view', group: 'Templates' },
  { id: 'flow', title: 'Flow', icon: 'layout' },
  { id: 'message', title: 'Message', icon: 'chat' },
  { id: 'banner', title: 'Banner', icon: 'chat' },

  { id: 'calendar', title: 'Calendar', icon: 'calendar', group: 'Date & Time' },
  { id: 'date-format', title: 'DateFormat', icon: 'event' },
  { id: 'timeago', title: 'TimeAgo', icon: 'time' },

  { id: 'modal', title: 'Modal', group: 'Modals', icon: 'multi-select', beta: true },
  { id: 'galleryModal', title: 'GalleryModal', icon: 'multi-select', beta: true },
  { id: 'mediaModal', title: 'MediaModal', icon: 'multi-select', beta: true },

  { id: 'statusbar', title: 'StatusBar', icon: 'bar', group: 'Toolbars' },
  { id: 'toolbar', title: 'Toolbar', icon: 'bottom' },

  { id: 'form', title: 'Forms', icon: 'form', group: 'Forms' },
  { id: 'flow', title: 'Flow + Form', icon: 'chevron-right', indent: 1 },
  { id: 'select', title: 'Select', icon: 'multi-select', indent: 1 },
  { id: 'input', title: 'Input', icon: 'text-highlight', indent: 1 },

  { id: 'text', icon: 'citation', title: 'Text', group: 'Text' },
  { id: 'titles', icon: 'header', title: 'Titles' },
  { id: 'message', icon: 'warning-sign', title: 'Message' },
  { id: 'banner', icon: 'label', title: 'Banner' },

  { id: 'chat', icon: 'chat', title: 'Chat', group: 'Media & Content' },
  { id: 'document', icon: 'document', title: 'Document' },
  { id: 'markdown', icon: 'align-left', title: 'Markdown' },
  { id: 'task', icon: 'numbered-list', title: 'Task' },
  { id: 'thread', icon: 'projects', title: 'Thread' },

  { id: 'hoverglow', icon: 'lightbulb', title: 'HoverGlow', group: 'Effects' },
  { id: 'glint', icon: 'flash', title: 'Glint' },

  { id: 'fetch', icon: 'arrow-down', title: 'Fetch', group: 'Utilities' },
  { id: 'orderable', icon: 'sort', title: 'Orderable' },
  { id: 'contextmenu', icon: 'menu-open', title: 'ContextMenu' },
  { id: 'interactive', icon: 'zoom-to-fit', title: 'Interactive' },
  { id: 'collapsable', icon: 'collapse-all', title: 'Collapsable' },
  { id: 'scale', icon: 'fullscreen', title: 'Scale' },
  { id: 'visibility', icon: 'eye-off', title: 'Visibility' },
  { id: 'passprops', icon: 'filter-list', title: 'PassProps' },
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
  'ui-layout': {
    page: () => import('./DocsPage/DocsUILayout.mdx'),
  },
  'ui-hooks': {
    page: () => import('./DocsPage/DocsUIHooks.mdx'),
    examplesSource: () => import('!raw-loader!./DocsPage/DocsUIHooks'),
  },
  'ui-themes': {
    page: () => import('./DocsPage/DocsUIThemes.mdx'),
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
  modal: {
    page: () => import('./DocsPage/DocsModal.mdx'),
    examples: () => import('./DocsPage/DocsModal'),
    examplesSource: () => import('!raw-loader!./DocsPage/DocsModal'),
    source: () => import('!raw-loader!@o/ui/src/modals/Modal'),
    types: () => import('../../tmp/Modal.json'),
  },
  galleryModal: {
    page: () => import('./DocsPage/DocsGalleryModal.mdx'),
    examples: () => import('./DocsPage/DocsGalleryModal'),
    examplesSource: () => import('!raw-loader!./DocsPage/DocsGalleryModal'),
    source: () => import('!raw-loader!@o/ui/src/modals/GalleryModal'),
    types: () => import('../../tmp/GalleryModal.json'),
  },
  tabs: {
    page: () => import('./DocsPage/DocsTabs.mdx'),
    examples: () => import('./DocsPage/DocsTabs'),
    examplesSource: () => import('!raw-loader!./DocsPage/DocsTabs'),
    source: () => import('!raw-loader!@o/ui/src/Tabs'),
    types: () => import('../../tmp/Tabs.json'),
  },
  tag: {
    page: () => import('./DocsPage/DocsTag.mdx'),
    examples: () => import('./DocsPage/DocsTag'),
    examplesSource: () => import('!raw-loader!./DocsPage/DocsTag'),
    source: () => import('!raw-loader!@o/ui/src/Tag'),
    types: () => import('../../tmp/Tag.json'),
  },
  layout: {
    page: () => import('./DocsPage/DocsLayout.mdx'),
    examples: () => import('./DocsPage/DocsLayout'),
    examplesSource: () => import('!raw-loader!./DocsPage/DocsLayout'),
    source: () => import('!raw-loader!@o/ui/src/layout/Layout'),
    types: () => import('../../tmp/Layout.json'),
  },
  'date-format': {
    page: () => import('./DocsPage/DocsDateFormat.mdx'),
    examples: () => import('./DocsPage/DocsDateFormat'),
    examplesSource: () => import('!raw-loader!./DocsPage/DocsDateFormat'),
    source: () => import('!raw-loader!@o/ui/src/text/DateFormat'),
    types: () => import('../../tmp/DateFormat.json'),
  },
  timeago: {
    page: () => import('./DocsPage/DocsTimeAgo.mdx'),
    examples: () => import('./DocsPage/DocsTimeAgo'),
    examplesSource: () => import('!raw-loader!./DocsPage/DocsTimeAgo'),
    source: () => import('!raw-loader!@o/ui/src/text/TimeAgo'),
    types: () => import('../../tmp/TimeAgo.json'),
  },
  sidebar: {
    page: () => import('./DocsPage/DocsSidebar.mdx'),
    examples: () => import('./DocsPage/DocsSidebar'),
    examplesSource: () => import('!raw-loader!./DocsPage/DocsSidebar'),
    source: () => import('!raw-loader!@o/ui/src/Sidebar'),
    types: () => import('../../tmp/Sidebar.json'),
  },
  slider: {
    page: () => import('./DocsPage/DocsSlider.mdx'),
    examples: () => import('./DocsPage/DocsSlider'),
    examplesSource: () => import('!raw-loader!./DocsPage/DocsSlider'),
    source: () => import('!raw-loader!@o/ui/src/Slider'),
    types: () => import('../../tmp/Slider.json'),
  },
  gridlayout: {
    page: () => import('./DocsPage/DocsGridLayout.mdx'),
    examples: () => import('./DocsPage/DocsGridLayout'),
    examplesSource: () => import('!raw-loader!./DocsPage/DocsGridLayout'),
    source: () => import('!raw-loader!@o/ui/src/layout/GridLayout'),
    types: () => import('../../tmp/GridLayout.json'),
  },
  banner: {
    page: () => import('./DocsPage/DocsBanner.mdx'),
    examples: () => import('./DocsPage/DocsBanner'),
    examplesSource: () => import('!raw-loader!./DocsPage/DocsBanner'),
    source: () => import('!raw-loader!@o/ui/src/Banner'),
    types: () => import('../../tmp/Banner.json'),
  },
  form: {
    page: () => import('./DocsPage/DocsForm.mdx'),
    examples: () => import('./DocsPage/DocsForm'),
    examplesSource: () => import('!raw-loader!./DocsPage/DocsForm'),
    source: () => import('!raw-loader!@o/ui/src/forms/Form'),
    types: () => import('../../tmp/Form.json'),
  },
}
