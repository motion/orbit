import { Templates } from '@o/kit'
import {
  Button,
  Col,
  Divider,
  gloss,
  Section,
  SegmentedRow,
  SpaceGroup,
  SubTitle,
  SurfacePassProps,
  Toolbar,
  useMedia,
  useOnUnmount,
  useTheme,
} from '@o/ui'
import { useReaction } from '@o/use-store'
import { compose, mount, route, withView } from 'navi'
import React, { memo, useState } from 'react'
import { useNavigation, View } from 'react-navi'
import { useSiteStore } from '../Layout'
import { Header } from '../views/Header'
import { MDX } from '../views/MDX'
import DocsInstall from './DocsPage/DocsInstall.mdx'

const views = {
  buttons: () => import('./DocsPage/DocsButtons.mdx'),
  cards: () => import('./DocsPage/DocsCards.mdx'),
}

export default compose(
  withView(req => {
    const id = req.path.slice(1)
    return (
      <DocsPage title={id ? uiItems.find(x => x.id === id).title : 'Welcome'}>
        <View />
      </DocsPage>
    )
  }),

  mount({
    '/': route({
      title: 'Docs',
      view: <DocsInstall />,
    }),
    '/:id': route(async req => {
      let id = req.params.id
      let ChildView = (await views[id]()).default || (() => <div>nada {id}</div>)
      return {
        view: <ChildView />,
      }
    }),
  }),
)

const categories = {
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

function DocsPage(props: { title?: string; children?: any }) {
  const siteStore = useSiteStore()
  const [showSidebar, setShowSidebar] = useState(true)
  const [section, setSection] = useState('all')
  const nav = useNavigation()
  const theme = useTheme()

  useReaction(() => {
    siteStore.setMaxHeight(siteStore.sectionHeight)
  })

  useOnUnmount(() => {
    siteStore.setMaxHeight(null)
  })

  return (
    <MDX>
      <Header slim />
      <Templates.MasterDetail
        items={categories[section]()}
        showSidebar={showSidebar}
        detailProps={{
          flex: 3,
        }}
        masterProps={{
          background: theme.sidebarBackground,
        }}
        searchable
        onSelect={item => {
          nav.navigate(`/docs/${item.id}`)
        }}
        belowSearchBar={<DocsToolbar section={section} setSection={setSection} />}
      >
        <WidthLimit>
          <Content>
            <SelectedSection
              onToggleSidebar={() => setShowSidebar(!showSidebar)}
              setTheme={siteStore.setTheme}
              theme={siteStore.theme}
              title={props.title}
            >
              {props.children}
            </SelectedSection>
          </Content>
        </WidthLimit>
      </Templates.MasterDetail>
    </MDX>
  )
}

DocsPage.theme = 'light'

const WidthLimit = gloss({
  flex: 1,
  overflowY: 'auto',
})

const Content = gloss(Col, {
  margin: [0, 'auto'],
  padding: [0, 8],
  width: '100%',
  maxWidth: 860,
  fontSize: 16,
  lineHeight: 28,
})

const DocsToolbar = memo(({ section, setSection }: any) => {
  return (
    <Toolbar background="transparent" pad="xs" justifyContent="center" border={false}>
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

const SelectedSection = memo(({ setTheme, theme, title, onToggleSidebar, children }: any) => {
  const isSmall = useMedia({ maxWidth: 700 })
  return (
    <Section
      pad={['xl', true, true, true]}
      titleBorder
      space
      title={title || 'No title'}
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
      {children}
    </Section>
  )
})

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
    children: <SubTitle>User Interface</SubTitle>,
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
