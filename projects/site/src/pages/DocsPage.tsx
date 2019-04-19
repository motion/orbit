import {
  BorderRight,
  Button,
  Col,
  gloss,
  Input,
  List,
  Portal,
  RoundButton,
  Row,
  Section,
  Sidebar,
  SpaceGroup,
  SubTitle,
  SurfacePassProps,
  Toolbar,
  useMedia,
} from '@o/ui'
import { compose, mount, route, withView } from 'navi'
import React, { memo, useEffect, useRef, useState } from 'react'
import { useNavigation, View } from 'react-navi'
import { useScreenSize } from '../hooks/useScreenSize'
import { useSiteStore } from '../Layout'
import { Header } from '../views/Header'
import { MDX } from '../views/MDX'
import { SectionContent } from '../views/SectionContent'
import DocsInstall from './DocsPage/DocsInstall.mdx'

const views = {
  install: () => import('./DocsPage/DocsInstall.mdx'),
  buttons: () => import('./DocsPage/DocsButtons.mdx'),
  cards: () => import('./DocsPage/DocsCards.mdx'),
  progress: () => import('./DocsPage/DocsProgress.mdx'),
  lists: () => import('./DocsPage/DocsLists.mdx'),
  start: () => import('./DocsPage/DocsStart.mdx'),
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
  const screen = useScreenSize()
  const itemIndex = categories.all.findIndex(x => x['id'] === props.id)
  const item = categories.all[itemIndex]
  const siteStore = useSiteStore()
  const [showSidebar, setShowSidebar] = useState(true)
  const [section, setSection] = useState('all')
  const toggleSection = val => setSection(section === val ? 'all' : val)
  const nav = useNavigation()
  const [search, setSearch] = useState('')
  const inputRef = useRef(null)

  const content = (
    <React.Fragment key="content">
      <DocsToolbar section={section} toggleSection={toggleSection} />
      <List
        search={search}
        selectable
        alwaysSelected
        defaultSelected={itemIndex || 1}
        items={categories[section]}
        onSelect={rows => {
          nav.navigate(`/docs/${rows[0].id}`, { replace: true })
        }}
      />
    </React.Fragment>
  )

  const isSmall = screen === 'small'

  useEffect(() => {
    const keyPress = e => {
      // console.log('e', e.keyCode)
      switch (e.keyCode) {
        case 84: // t
          inputRef.current.focus()
          break
      }
    }
    window.addEventListener('keydown', keyPress)
    return () => {
      window.removeEventListener('keydown', keyPress)
    }
  }, [])

  useEffect(() => {
    inputRef.current && inputRef.current.focus()
  }, [inputRef.current])

  return (
    <MDX>
      <Portal>
        <FixedLayout>
          <Header slim />
          <Row
            margin={[0, 'auto']}
            pointerEvents="auto"
            pad={['sm', 100]}
            width="90%"
            maxWidth={800}
          >
            <Input
              ref={inputRef}
              onChange={e => setSearch(e.target.value)}
              flex={1}
              sizeRadius={10}
              size="xl"
              iconSize={16}
              icon="search"
              placeholder="Search the docs..."
              after={
                <Button tooltip="Shortcut: t" size="sm" alt="flat" fontWeight={600}>
                  t
                </Button>
              }
            />
          </Row>

          {isSmall ? (
            <Sidebar
              hidden={!showSidebar}
              zIndex={10000000}
              elevation={5}
              pointerEvents="auto"
              // @ts-ignore
              background={theme => theme.background}
            >
              {content}
            </Sidebar>
          ) : (
            <SectionContent pointerEvents="none" flex={1}>
              <Col position="relative" flex={1} width={300} pointerEvents="auto">
                {content}
                <BorderRight opacity={0.5} />
              </Col>
            </SectionContent>
          )}
        </FixedLayout>
      </Portal>

      <SectionContent fontSize={16} lineHeight={28}>
        <ContentPosition isSmall={isSmall}>
          <SelectedSection
            onToggleSidebar={() => setShowSidebar(!showSidebar)}
            setTheme={siteStore.setTheme}
            theme={siteStore.theme}
            title={item ? item['title'] : undefined}
          >
            {props.children}
          </SelectedSection>
        </ContentPosition>
      </SectionContent>
    </MDX>
  )
}

DocsPage.theme = 'light'

const ContentPosition = gloss<{ isSmall?: boolean }>({
  width: '100%',
  padding: [100, 0, 0, 300],
  isSmall: {
    padding: [100, 0, 0, 0],
  },
})

const FixedLayout = gloss({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 100000,
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
      pad={['xl', 'xl', true, 'xl']}
      titleBorder
      space
      title={title || 'No title'}
      titleSize="xl"
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

const titleItem = { titleProps: { size: 1.1 } }

const ListSubTitle = gloss(SubTitle, {
  margin: [20, 0, -2],
  fontWeight: 300,
  fontSize: 18,
})

const docsItems = [
  {
    selectable: false,
    hideBorder: true,
    children: <ListSubTitle>Start</ListSubTitle>,
  },
  {
    id: 'start',
    title: 'Getting started',
    ...titleItem,
  },
]

const uiItems = [
  {
    selectable: false,
    hideBorder: true,
    children: <ListSubTitle>User Interface</ListSubTitle>,
  },

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

const categories = {
  all: [...docsItems, ...uiItems],
  ui: uiItems,
  docs: docsItems,
  kit: uiItems,
}
