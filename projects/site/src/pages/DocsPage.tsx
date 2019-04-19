import {
  Absolute,
  BorderRight,
  Button,
  Col,
  gloss,
  Input,
  List,
  ListItem,
  Popover,
  Portal,
  RoundButton,
  Row,
  Section,
  SegmentedRow,
  Sidebar,
  SurfacePassProps,
} from '@o/ui'
import { compose, mount, route, withView } from 'navi'
import React, { memo, useEffect, useRef, useState } from 'react'
import { useNavigation, View } from 'react-navi'

import { useScreenSize } from '../hooks/useScreenSize'
import { useSiteStore } from '../Layout'
import { Header } from '../views/Header'
import { ListSubTitle } from '../views/ListSubTitle'
import { MDX } from '../views/MDX'
import { SectionContent } from '../views/SectionContent'
import { docsItems } from './docsItems'
import DocsInstall from './DocsPage/DocsInstall.mdx'
import { useScreenVal } from './HomePage/SpacedPageContent'

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
  const itemIndex = docsItems.all.findIndex(x => x['id'] === props.id) || 1
  const item = docsItems.all[itemIndex]
  const siteStore = useSiteStore()
  const [showSidebar, setShowSidebar] = useState(true)
  const [section, setSection] = useState('all')
  const toggleSection = val => setSection(section === val ? 'all' : val)
  const nav = useNavigation()
  const [search, setSearch] = useState('')
  const inputRef = useRef(null)

  const content = (
    <React.Fragment key="content">
      <List
        search={search}
        selectable
        alwaysSelected
        defaultSelected={itemIndex}
        items={docsItems[section]}
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
      <Portal prepend style={{ position: 'sticky', top: 10, zIndex: 10000000 }}>
        <Row
          position="relative"
          margin={[0, 'auto']}
          pointerEvents="auto"
          pad={['sm', 0]}
          width="90%"
          maxWidth={980}
          alignItems="center"
          justifyContent="center"
        >
          <Input
            ref={inputRef}
            onChange={e => setSearch(e.target.value)}
            sizeRadius={10}
            size="xl"
            iconSize={16}
            maxWidth="calc(60% - 20px)"
            flex={1}
            icon="search"
            placeholder={isSmall ? 'Search...' : 'Search the docs...'}
            elevation={3}
            after={
              !isSmall && (
                <Button tooltip="Shortcut: t" size="sm" alt="flat" fontWeight={600}>
                  t
                </Button>
              )
            }
          />

          <Absolute
            top={0}
            width="18%"
            left={0}
            bottom={0}
            alignItems="flex-end"
            justifyContent="center"
          >
            <Popover
              background
              width={300}
              openOnClick
              closeOnClickAway
              elevation={100}
              zIndex={100000000000000000}
              target={<RoundButton icon="filter">{isSmall ? '' : 'Filter'}</RoundButton>}
            >
              <>
                <ListItem selectable={false}>
                  <ListSubTitle marginTop={6}>Sections</ListSubTitle>
                </ListItem>
                <ListItem
                  index={2}
                  title="Docs"
                  alt={section === 'docs' ? 'selected' : null}
                  onClick={() => toggleSection('docs')}
                />
                <ListItem
                  index={2}
                  title="APIs"
                  alt={section === 'apis' ? 'selected' : null}
                  onClick={() => toggleSection('apis')}
                />
                <ListItem
                  index={2}
                  title="Kit"
                  alt={section === 'kit' ? 'selected' : null}
                  onClick={() => toggleSection('kit')}
                />
              </>
            </Popover>
          </Absolute>

          <Absolute
            width="18%"
            top={0}
            right={0}
            bottom={0}
            alignItems="center"
            justifyContent="flex-start"
            flexFlow="row"
          >
            <SurfacePassProps circular iconSize={12}>
              <SegmentedRow>
                <RoundButton
                  icon="moon"
                  tooltip="Toggle dark mode"
                  onClick={() => siteStore.setTheme(siteStore.theme === 'home' ? 'light' : 'home')}
                />
                {isSmall && (
                  <RoundButton
                    icon="panel-stats"
                    tooltip="Toggle menu"
                    onClick={() => setShowSidebar(!showSidebar)}
                  />
                )}
              </SegmentedRow>
            </SurfacePassProps>
          </Absolute>
        </Row>
      </Portal>
      <Portal prepend>
        <Header slim />
      </Portal>
      <Portal>
        <FixedLayout>
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
          <DocsContents title={item ? item['title'] : undefined}>{props.children}</DocsContents>
        </ContentPosition>
      </SectionContent>
    </MDX>
  )
}

DocsPage.theme = 'home'

const ContentPosition = gloss<{ isSmall?: boolean }>({
  width: '100%',
  padding: [0, 0, 0, 300],
  isSmall: {
    padding: [0, 0, 0, 0],
  },
})

const FixedLayout = gloss({
  position: 'fixed',
  top: 100,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 100000,
})

const DocsContents = memo(({ title, children }: any) => {
  return (
    <Section
      maxWidth={760}
      width="100%"
      margin={[0, 'auto']}
      pad={useScreenVal(
        ['xl', 'md', true, 'md'],
        ['xl', 'xl', true, 'xl'],
        ['xl', 'xxl', true, 'xxl'],
      )}
      titleBorder
      space
      title={title || 'No title'}
      titleSize="xxl"
    >
      {children}
    </Section>
  )
})
