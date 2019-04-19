import GithubIcon from '!raw-loader!../../public/logos/github.svg'
import {
  Absolute,
  BorderRight,
  Button,
  Card,
  Col,
  gloss,
  Icon,
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
  Space,
  SurfacePassProps,
  Table,
} from '@o/ui'
import { compose, mount, route, withView } from 'navi'
import React, { memo, useEffect, useRef, useState } from 'react'
import { useNavigation, View } from 'react-navi'

import { useScreenSize } from '../hooks/useScreenSize'
import { useSiteStore } from '../Layout'
import { CodeBlock } from '../views/CodeBlock'
import { Header } from '../views/Header'
import { ListSubTitle } from '../views/ListSubTitle'
import { MDX } from '../views/MDX'
import { SectionContent } from '../views/SectionContent'
import { BlogFooter } from './BlogPage/BlogLayout'
import { docsItems } from './docsItems'
import DocsInstall from './DocsPage/DocsInstall.mdx'
import { useScreenVal } from './HomePage/SpacedPageContent'

const views = {
  install: {
    page: () => import('./DocsPage/DocsInstall.mdx'),
  },
  buttons: {
    page: () => import('./DocsPage/DocsButtons.mdx'),
    source: () => import('!raw-loader!@o/ui/src/buttons/Button'),
    types: () => import('../../tmp/Button.json'),
  },
  cards: {
    page: () => import('./DocsPage/DocsCards.mdx'),
    source: () => import('!raw-loader!@o/ui/src/Card'),
  },
  progress: {
    page: () => import('./DocsPage/DocsProgress.mdx'),
    source: () => import('!raw-loader!@o/ui/src/progress/Progress'),
  },
  lists: {
    page: () => import('./DocsPage/DocsLists.mdx'),
    source: () => import('!raw-loader!@o/ui/src/lists/List'),
  },
  start: {
    page: () => import('./DocsPage/DocsStart.mdx'),
  },
}

export default compose(
  withView(async req => {
    const id = req.path.slice(1)
    const view = views[id]
    const source = view.source ? (await view.source()).default : null
    const types = view.types ? (await view.types()).default : null
    return (
      <DocsPage key={0} id={id} source={source} types={types}>
        <View />
      </DocsPage>
    )
  }),

  mount({
    '/': route({
      title: 'Orbit Documentation',
      view: <DocsInstall />,
    }),
    '/:id': route(async req => {
      let id = req.params.id
      const view = views[id]
      if (!view) {
        return {
          view: () => <div>not found</div>,
        }
      }
      const ChildView = (await view.page()).default
      return {
        view: <ChildView />,
      }
    }),
  }),
)

function DocsPage(props: { id?: string; source?: string; children?: any; types?: Object }) {
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
          <DocsContents
            title={item ? item['title'] : undefined}
            source={props.source}
            types={props.types}
          >
            {props.children}
          </DocsContents>
          <BlogFooter />
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

const DocsContents = memo(({ title, source, children, types }: any) => {
  return (
    <Section
      maxWidth={760}
      width="100%"
      margin={[0, 'auto']}
      pad={useScreenVal(
        ['xl', 'md', true, 'md'],
        ['xl', 'xl', true, 'xl'],
        ['xxl', 'xxl', true, 'xxl'],
      )}
      titleBorder
      space
      title={title || 'No title'}
      titleSize="xxxl"
      afterTitle={
        <SurfacePassProps size="lg" cursor="pointer">
          <Row space="sm">
            <Button
              tooltip="View Code"
              iconSize={20}
              icon="code"
              onClick={e => e.stopPropagation()}
            />
            <Button
              tooltip="View Prop Types"
              iconSize={20}
              icon="t"
              onClick={e => e.stopPropagation()}
            />
            <Button
              tooltip="Source in Github"
              size="lg"
              tagName="a"
              cursor="pointer"
              {...{ href: 'http://github.com', target: '_blank' }}
              icon={<Icon size={20} svg={GithubIcon} />}
              onClick={e => e.stopPropagation()}
            />
          </Row>
        </SurfacePassProps>
      }
    >
      <MetaSection>
        <Card
          background={theme => theme.background.alpha(0.1)}
          collapsable
          defaultCollapsed
          collapseOnClick
          title={`View ${title} Source`}
          maxHeight={450}
          scrollable="y"
        >
          <CodeBlock className="language-typescript">{source}</CodeBlock>
        </Card>

        <Space size="sm" />

        {!!types && (
          <Card
            background={theme => theme.background.alpha(0.1)}
            collapsable
            defaultCollapsed
            collapseOnClick
            title="Props"
            scrollable="y"
          >
            <PropsTable props={types.props} />
          </Card>
        )}
      </MetaSection>

      {children}
    </Section>
  )
})

const MetaSection = gloss({
  margin: [-30, -30, 0],
})

function PropsTable(props: { props: Object }) {
  const propRows = Object.keys(props.props).reduce((acc, key) => {
    const { type, description, defaultValue, required, ...row } = props.props[key]
    // discard
    description
    acc.push({
      ...row,
      type: type.name,
      'Default Value': defaultValue === null ? '' : defaultValue,
      required,
    })
    return acc
  }, [])
  // overscan all for searchability
  return (
    <Table
      overscanCount={100}
      sortOrder={{ key: 'name', direction: 'down' }}
      height={400}
      rows={propRows}
    />
  )
}
