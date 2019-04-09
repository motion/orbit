import { Templates } from '@o/kit'
import '@o/nucleo'
import { Section, Theme } from '@o/ui'
import React, { createElement, useEffect, useState } from 'react'
import { HeaderSlim } from '../views/HeaderSlim'
//
// can remove this and just use import(), but hmr fails
import Buttons from './DocsButtons.mdx'

const views = {
  buttons: () => Buttons,
}

export function DocsPage() {
  const [selected, setSelected] = useState(null)
  const [viewElement, setView] = useState(null)

  useEffect(() => {
    if (!selected) return
    if (!views[selected.id]) return
    const resolved = views[selected.id]()
    if (resolved instanceof Promise) {
      views[selected.id]().then(view => {
        setView(createElement(view.default))
      })
    } else {
      setView(createElement(resolved))
    }
  }, [selected])

  return (
    <Theme name="light">
      <HeaderSlim />
      <Templates.MasterDetail searchable onSelect={setSelected} items={items}>
        {!!selected && (
          <Section flex={1} scrollable="y" title={selected.title} pad={[0, true]} titleBorder space>
            {viewElement}
          </Section>
        )}
      </Templates.MasterDetail>
    </Theme>
  )
}

DocsPage.path = 'docs'
DocsPage.navigationOptions = {
  title: 'Orbit Docs',
  linkName: 'Orbit Docs',
}

const items = [
  {
    id: 'surfaces',
    icon: 'layer',
    title: 'Surfaces',
    subTitle: 'Building block of many views',
    group: 'Base Views',
  },
  { id: 'icons', icon: 'star', title: 'Icons', indent: 1 },
  { id: 'buttons', icon: 'button', title: 'Buttons', indent: 1 },
  { title: 'Cards', icon: 'credit-card', indent: 1 },
  { title: 'Sections', icon: 'application' },
  { title: 'Popovers', icon: 'direction-right' },
  { title: 'Decorations', icon: 'clean' },
  { title: 'Progress', icon: 'circle' },
  { title: 'Floating Views', icon: 'applications' },

  { title: 'Lists', icon: 'list', group: 'Collections' },
  { title: 'Tables', icon: 'table' },
  { title: 'Tree', icon: 'tree' },
  { title: 'TreeList', icon: 'chevron-right' },
  { title: 'DefinitionList', icon: 'dict' },

  { title: 'MasterDetail', icon: 'two-columns', group: 'Templates' },
  { title: 'Flow', icon: 'layout' },
  { title: 'Message', icon: 'chat' },

  { title: 'Calendar', icon: 'calendar', group: 'Date & Time' },
  { title: 'DateFormat', icon: 'event' },
  { title: 'TimeAgo', icon: 'time' },

  { title: 'Modal', group: 'Modals', icon: 'multi-select' },
  { title: 'GalleryModal', icon: 'multi-select' },
  { title: 'MediaModal', icon: 'multi-select' },

  { title: 'Basics', icon: 'control', group: 'Layout' },
  { title: 'Sidebar', icon: 'panel-stats' },
  { title: 'Slider', icon: 'double-caret-horizontal' },
  { title: 'Tabs', icon: 'add-row-top' },
  { title: 'Layout', icon: 'page-layout', subTitle: 'Layouts for placing content' },
  { title: 'Pane', icon: 'column-layout', indent: 1 },
  { title: 'GridLayout', icon: 'grid-view', indent: 1 },
  { title: 'MasonryLayout', icon: 'skew-grid', indent: 1 },
  { title: 'FlowLayout', icon: 'layout-hierarchy', indent: 1 },

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
]
