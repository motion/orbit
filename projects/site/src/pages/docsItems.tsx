import React from 'react'

import { ListSubTitle } from '../views/ListSubTitle'

const titleItem = { titleProps: { size: 1.1 } }

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
    id: 'quickstart',
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
    id: 'examples',
    title: 'Examples',
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
    subTitle: 'Building block of many views',
  },
  { id: 'icons', icon: 'star', title: 'Icons', indent: 1 },
  { id: 'buttons', icon: 'button', title: 'Buttons', indent: 1 },
  { id: 'cards', title: 'Cards', icon: 'credit-card', indent: 1 },
  { id: 'install', title: 'Sections', icon: 'application' },
  { id: 'install', title: 'Popovers', icon: 'direction-right' },
  { id: 'install', title: 'Decorations', icon: 'clean' },
  { id: 'progress', title: 'Progress', icon: 'circle' },
  { id: 'install', title: 'MasterDetail', icon: 'list-detail-view', group: 'Templates' },
  { id: 'install', title: 'Flow', icon: 'layout' },
  { id: 'install', title: 'Message', icon: 'chat' },
  { id: 'install', title: 'Calendar', icon: 'calendar', group: 'Date & Time' },
  { id: 'install', title: 'DateFormat', icon: 'event' },
  { id: 'install', title: 'TimeAgo', icon: 'time' },
  { id: 'install', title: 'Modal', group: 'Modals', icon: 'multi-select' },
  { id: 'install', title: 'GalleryModal', icon: 'multi-select' },
  { id: 'install', title: 'MediaModal', icon: 'multi-select' },
  { id: 'install', title: 'Basics', icon: 'control', group: 'Layout' },
  { id: 'install', title: 'Sidebar', icon: 'panel-stats' },
  { id: 'install', title: 'Slider', icon: 'double-caret-horizontal' },
  { id: 'install', title: 'Tabs', icon: 'add-row-top' },
  { id: 'install', title: 'Layout', icon: 'page-layout', subTitle: 'Layouts for placing content' },
  { id: 'install', title: 'Pane', icon: 'column-layout', indent: 1 },
  { id: 'install', title: 'GridLayout', icon: 'grid-view', indent: 1 },
  { id: 'install', title: 'MasonryLayout', icon: 'skew-grid', indent: 1 },
  { id: 'install', title: 'FlowLayout', icon: 'layout-hierarchy', indent: 1 },
  { id: 'install', title: 'StatusBar', icon: 'bar', group: 'Toolbars' },
  { id: 'install', title: 'Toolbar', icon: 'bottom' },
  { id: 'install', title: 'Form', icon: 'form', group: 'Forms' },
  { id: 'install', title: 'Flow + Form', icon: 'dot', indent: 1 },
  { id: 'install', title: 'Form Elements', icon: 'widget' },
  { id: 'install', title: 'Select', icon: 'dot', indent: 1 },
  { id: 'install', title: 'Input', icon: 'dot', indent: 1 },
  { id: 'install', title: 'Basics', icon: '', group: 'Text' },
  { id: 'install', title: 'Titles' },
  { id: 'install', title: 'Message' },
  { id: 'install', title: 'Banner' },
  { id: 'install', title: 'Chat', group: 'Media & Content' },
  { id: 'install', title: 'Document' },
  { id: 'install', title: 'Markdown' },
  { id: 'install', title: 'Task' },
  { id: 'install', title: 'Thread' },
  { id: 'install', title: 'HoverGlow', group: 'Effects' },
  { id: 'install', title: 'TiltHoverGlow' },
  { id: 'install', title: 'Glint' },
  { id: 'install', title: 'Tilt' },
  { id: 'install', title: 'Fetch', group: 'Utilities' },
  { id: 'install', title: 'Orderable' },
  { id: 'install', title: 'ContextMenu' },
  { id: 'install', title: 'Interactive' },
  { id: 'install', title: 'Collapsable' },
  { id: 'install', title: 'Scale' },
  { id: 'install', title: 'Visibility' },
  { id: 'install', title: 'PassProps' },
]

export const docsItems = {
  all: [...guides, ...uikit],
  ui: uikit,
  docs: guides,
  kit: uikit,
}
