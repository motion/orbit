import { Templates } from '@o/kit'
import '@o/nucleo'
import { Theme } from '@o/ui'
import React, { createElement } from 'react'
import { HeaderSlim } from '../views/HeaderSlim'
import { DocsButtons } from './DocsPage/DocsButtons'
import { DocsSections } from './DocsPage/DocsSections'

const views = {
  sections: DocsSections,
  buttons: DocsButtons,
}

export function DocsPage() {
  return (
    <Theme name="light">
      <HeaderSlim />
      <Templates.MasterDetail
        searchable
        items={[
          {
            id: 'surfaces',
            title: 'Surfaces',
            subTitle: 'Building block of many views',
            group: 'Views',
          },
          { id: 'buttons', title: 'Buttons', indent: 1 },
          { title: 'Card', indent: 1 },
          { title: 'Sections' },
          { title: 'Popovers' },
          { title: 'Decorations' },
          { title: 'Icon' },
          { title: 'Progress' },
          { title: 'Floating Views' },

          { title: 'Lists', group: 'Collections' },
          { title: 'Tables' },
          { title: 'Tree' },
          { title: 'TreeList' },
          { title: 'DefinitionList' },

          { title: 'MasterDetail', group: 'Templates' },
          { title: 'Flow' },
          { title: 'Message' },

          { title: 'Calendar', group: 'Date & Time' },
          { title: 'DateFormat' },
          { title: 'TimeAgo' },

          { title: 'Modal', group: 'Modals' },
          { title: 'GalleryModal' },
          { title: 'MediaModal' },

          { title: 'Basics', group: 'Layout' },
          { title: 'Sidebar' },
          { title: 'Slider' },
          { title: 'Tabs' },
          { title: 'Layout' },
          { title: 'Pane', indent: 1 },
          { title: 'GridLayout', indent: 1 },
          { title: 'MasonryLayout', indent: 1 },
          { title: 'FlowLayout', indent: 1 },

          { title: 'StatusBar', group: 'Toolbars' },
          { title: 'Toolbar' },

          { title: 'Forms', group: 'Forms' },
          { title: 'Flow', indent: 1 },
          { title: 'Flow', indent: 1 },
          { title: 'Flow', indent: 1 },
          { title: 'Flow', indent: 1 },
          { title: 'Flow', indent: 1 },

          { title: 'Basics', group: 'Text' },
          { title: 'Titles' },
          { title: 'Message' },
          { title: 'Banner' },

          { title: 'Chat', group: 'Media & Content' },
          { title: 'Document' },
          { title: 'Markdown' },
          { title: 'Task' },
          { title: 'Thread' },

          { title: 'HoverGlow', group: 'Effects' },
          { title: 'TiltHoverGlow' },
          { title: 'Glint' },
          { title: 'Tilt' },

          { title: 'Fetch', group: 'Utilities' },
          { title: 'Orderable' },
          { title: 'ContextMenu' },
          { title: 'Interactive' },
          { title: 'Collapsable' },
          { title: 'Scale' },
          { title: 'Visibility' },
          { title: 'PassProps' },
        ]}
      >
        {selected => (views[selected.id] ? createElement(views[selected.id]) : null)}
      </Templates.MasterDetail>
    </Theme>
  )
}

DocsPage.path = 'docs'
DocsPage.navigationOptions = {
  title: 'Orbit Docs',
  linkName: 'Orbit Docs',
}
