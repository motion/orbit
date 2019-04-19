import { Templates } from '@o/kit'
import {
  Button,
  Col,
  gloss,
  RoundButton,
  Section,
  SpaceGroup,
  SubTitle,
  SurfacePassProps,
  Toolbar,
  useMedia,
  useOnUnmount,
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
  install: () => import('./DocsPage/DocsInstall.mdx'),
  buttons: () => import('./DocsPage/DocsButtons.mdx'),
  cards: () => import('./DocsPage/DocsCards.mdx'),
  progress: () => import('./DocsPage/DocsProgress.mdx'),
}

export default compose(
  withView(req => {
    const id = req.path.slice(1)
    return (
      <DocsPage id={id}>
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
      if (!views[id]) {
        return {
          view: () => <div>not found</div>,
        }
      }
      let ChildView = (await views[id]()).default || (() => <div>nada {id}</div>)
      return {
        view: <ChildView />,
      }
    }),
  }),
)

function DocsPage(props: { id?: string; children?: any }) {
  const itemIndex = categories.all.findIndex(x => x['id'] === props.id)
  const item = categories.all[itemIndex]
  const siteStore = useSiteStore()
  const [showSidebar, setShowSidebar] = useState(true)
  const [section, setSection] = useState('all')
  const toggleSection = val => setSection(section === val ? 'all' : val)
  const nav = useNavigation()

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
        items={categories[section]}
        alwaysSelected
        showSidebar={showSidebar}
        defaultSelected={itemIndex || 1}
        detailProps={{
          flex: 3,
        }}
        masterProps={{
          background: 'transparent',
        }}
        searchable
        onSelect={next => {
          nav.navigate(`/docs/${next.id}`, { replace: true })
        }}
        belowSearchBar={<DocsToolbar section={section} toggleSection={toggleSection} />}
      >
        <WidthLimit>
          <Content>
            <SelectedSection
              onToggleSidebar={() => setShowSidebar(!showSidebar)}
              setTheme={siteStore.setTheme}
              theme={siteStore.theme}
              title={item ? item.title : undefined}
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

const DocsToolbar = memo(({ section, toggleSection }: any) => {
  return (
    <Toolbar background="transparent" pad="xs" justifyContent="center" border={false}>
      <RoundButton
        alt={section === 'docs' ? 'selected' : 'flat'}
        onClick={() => toggleSection('docs')}
      >
        Docs
      </RoundButton>
      <RoundButton alt={section === 'ui' ? 'selected' : 'flat'} onClick={() => toggleSection('ui')}>
        UI
      </RoundButton>
      <RoundButton
        alt={section === 'kit' ? 'selected' : 'flat'}
        onClick={() => toggleSection('kit')}
      >
        Kit
      </RoundButton>
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

const titleItem = { titleProps: { fontWeight: 600, size: 1.1 } }

const docsItems = [
  {
    selectable: false,
    children: <SubTitle>Start</SubTitle>,
  },
  {
    id: 'install',
    title: 'Getting started',
    ...titleItem,
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
  { id: 'install', title: 'Sections', icon: 'application' },
  { id: 'install', title: 'Popovers', icon: 'direction-right' },
  { id: 'install', title: 'Decorations', icon: 'clean' },
  { id: 'progress', title: 'Progress', icon: 'circle' },
  { id: 'install', title: 'Floating Views', icon: 'square' },

  { id: 'install', title: 'Lists', icon: 'list', group: 'Collections' },
  { id: 'install', title: 'Tables', icon: 'table' },
  { id: 'install', title: 'Tree', icon: 'tree' },
  { id: 'install', title: 'TreeList', icon: 'chevron-right' },
  { id: 'install', title: 'DefinitionList', icon: 'dict' },

  { id: 'install', title: 'MasterDetail', icon: 'two-columns', group: 'Templates' },
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

const categories = {
  all: [...docsItems, ...uiItems],
  ui: uiItems,
  docs: docsItems,
  kit: uiItems,
}
