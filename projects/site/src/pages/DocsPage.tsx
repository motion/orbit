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
    group: 'Views',
  },
  { id: 'icons', icon: 'star', title: 'Icons', indent: 1 },
  { id: 'buttons', icon: 'button', title: 'Buttons', indent: 1 },
  { title: 'Cards', icon: 'credit-card', indent: 1 },
  { title: 'Sections' },
  { title: 'Popovers' },
  { title: 'Decorations' },
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
]
