import { Templates } from '@o/kit'
import '@o/nucleo'
import {
  Button,
  Divider,
  gloss,
  Section,
  SegmentedRow,
  SpaceGroup,
  SubTitle,
  SurfacePassProps,
  Theme,
  Toolbar,
  useMedia,
  View,
} from '@o/ui'
import React, { createElement, memo, useEffect, useState } from 'react'
import { HeaderSlim } from '../views/HeaderSlim'
//
// can remove this and just use import(), but hmr fails
import Buttons from './DocsButtons.mdx'
import Cards from './DocsCards.mdx'

const views = {
  buttons: () => Buttons,
  cards: () => Cards,
  // forms: () => Forms,
  // tables: () => Tables,
}

const itemsByIndex = {
  all: () => [
    ...docsItems,
    {
      selectable: false,
      children: <Divider />,
    },
    ...uiItems,
  ],
  ui: () => uiItems,
  docs: () => docsItems,
  kit: () => uiItems,
}

export function DocsPage() {
  const [selected, setSelected] = useState(null)
  const [view, setView] = useState(null)
  const [theme, setTheme] = useState('light')
  const [showSidebar, setShowSidebar] = useState(true)
  const [section, setSection] = useState('all')
  const getView = views[selected && selected.id]

  useEffect(() => {
    if (!selected) return
    if (!getView) return
    let cancelled = false
    const resolved = getView()
    if (resolved instanceof Promise) {
      getView().then(next => {
        if (!cancelled) {
          setView(createElement(next.default))
        }
      })
    } else {
      setView(createElement(resolved))
    }
    return () => {
      cancelled = true
    }
  }, [getView])

  return (
    <Theme name={theme}>
      <View height="100vh" background={x => x.background}>
        <Background>
          <HeaderSlim />

          <View flex={1} position="relative">
            <Templates.MasterDetail
              items={itemsByIndex[section]()}
              showSidebar={showSidebar}
              detailProps={{ flex: 3 }}
              searchable
              onSelect={setSelected}
              belowSearchBar={<DocsToolbar section={section} setSection={setSection} />}
            >
              {view && (
                <SelectedSection
                  onToggleSidebar={() => setShowSidebar(!showSidebar)}
                  setTheme={setTheme}
                  theme={theme}
                  title={selected.title}
                  viewElement={view}
                />
              )}
            </Templates.MasterDetail>
          </View>
        </Background>
      </View>
    </Theme>
  )
}

DocsPage.path = 'docs'
DocsPage.navigationOptions = {
  title: 'Orbit Docs',
  linkName: 'Orbit Docs',
}

const DocsToolbar = memo(({ section, setSection }: any) => {
  return (
    <Toolbar pad="xs" justifyContent="center" border={false}>
      <SegmentedRow sizePadding={2} sizeRadius={2}>
        <Button active={section === 'all'} onClick={() => setSection('all')}>
          All
        </Button>
        <Button active={section === 'docs'} onClick={() => setSection('docs')}>
          Docs
        </Button>
        <Button active={section === 'ui'} onClick={() => setSection('ui')}>
          UI
        </Button>
        <Button active={section === 'kit'} onClick={() => setSection('kit')}>
          Kit
        </Button>
      </SegmentedRow>
    </Toolbar>
  )
})

const SelectedSection = memo(({ setTheme, theme, title, viewElement, onToggleSidebar }: any) => {
  const isSmall = useMedia({ maxWidth: 700 })
  return (
    <Section
      pad
      titleBorder
      space
      flex={1}
      scrollable="y"
      title={title}
      afterTitle={
        <SurfacePassProps iconSize={12}>
          <SpaceGroup space="xs">
            <Button
              icon="moon"
              tooltip="Toggle dark mode"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            />
            {isSmall && (
              <Button icon="panel-stats" tooltip="Toggle menu" onClick={onToggleSidebar} />
            )}
          </SpaceGroup>
        </SurfacePassProps>
      }
    >
      {viewElement}
    </Section>
  )
})

const Background = gloss({
  flex: 1,
}).theme((_, theme) => ({
  background: theme.sidebarBackground || theme.background,
}))

const docsItems = [
  {
    selectable: false,
    children: <SubTitle>Docs</SubTitle>,
  },
  {
    id: 'surfaces',
    icon: 'layer',
    title: 'Getting started',
    subTitle: 'Lorem ipsum dolor sit amet.',
  },
]

const uiItems = [
  {
    selectable: false,
    children: (
      <SubTitle>
        User Interface &nbsp;&nbsp;<small>@o/ui</small>
      </SubTitle>
    ),
  },
  {
    id: 'surfaces',
    icon: 'layer',
    title: 'Surfaces',
    subTitle: 'Building block of many views',
  },
  { id: 'icons', icon: 'star', title: 'Icons', indent: 1 },
  { id: 'buttons', icon: 'button', title: 'Buttons', indent: 1 },
  { id: 'cards', title: 'Cards', icon: 'credit-card', indent: 1 },
  { title: 'Sections', icon: 'application' },
  { title: 'Popovers', icon: 'direction-right' },
  { title: 'Decorations', icon: 'clean' },
  { title: 'Progress', icon: 'circle' },
  { title: 'Floating Views', icon: 'square' },

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

  { title: 'StatusBar', icon: 'bar', group: 'Toolbars' },
  { title: 'Toolbar', icon: 'bottom' },

  { title: 'Form', icon: 'form', group: 'Forms' },
  { title: 'Flow + Form', icon: 'dot', indent: 1 },
  { title: 'Form Elements', icon: 'widget' },
  { title: 'Select', icon: 'dot', indent: 1 },
  { title: 'Input', icon: 'dot', indent: 1 },

  { title: 'Basics', icon: '', group: 'Text' },
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
