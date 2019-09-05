import { Absolute, ListItem, ListShortcuts, Popover, Portal, RoundButton, Row, SurfacePassProps } from '@o/ui'
import React, { memo } from 'react'

import { fontProps } from '../constants'
import { FadeChild } from '../views/FadeInView'
import { Key } from '../views/Key'
import { ListSubTitle } from '../views/ListSubTitle'
import { SearchInput } from '../views/SearchInput'
import { DocsStoreContext } from './DocsStore'
import { useScreenVal } from './HomePage/SpacedPageContent'

export const DocsPageHeader = memo(
  ({ isSmall, inputRef, setTheme, theme, setShowSidebar, showSidebar }: any) => {
    const docsStore = DocsStoreContext.useStore()
    return (
      <Portal prepend style={{ position: 'sticky', top: 10, zIndex: 10000000 }}>
        <ListShortcuts>
          <FadeChild style={{ flex: 1 }}>
            <Row
              position="relative"
              margin={[0, 'auto', 0, 'auto']}
              pointerEvents="auto"
              padding={['sm', 0]}
              width={useScreenVal('100%', '90%', '90%')}
              maxWidth={980}
              alignItems="center"
              justifyContent="center"
            >
              <SearchInput
                nodeRef={inputRef}
                onChange={e => docsStore.setSearch(e.target.value)}
                maxWidth="calc(55% - 20px)"
                flex={1}
                size="xl"
                placeholder={isSmall ? 'Search...' : 'Search the docs...'}
                after={!isSmall && <Key tooltip="Shortcut: t">t</Key>}
                {...fontProps.SystemFont}
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
                  zIndex={1000000000000000}
                  target={<RoundButton icon="filter">{isSmall ? '' : 'Filter'}</RoundButton>}
                >
                  <>
                    <ListItem selectable={false}>
                      <ListSubTitle marginTop={6}>Sections</ListSubTitle>
                    </ListItem>
                    <ListItem
                      index={2}
                      title="Docs"
                      alt={docsStore.section === 'docs' ? 'selected' : null}
                      onClick={() => docsStore.toggleSection('docs')}
                    />
                    <ListItem
                      index={2}
                      title="APIs"
                      alt={docsStore.section === 'apis' ? 'selected' : null}
                      onClick={() => docsStore.toggleSection('apis')}
                    />
                    <ListItem
                      index={2}
                      title="Kit"
                      alt={docsStore.section === 'kit' ? 'selected' : null}
                      onClick={() => docsStore.toggleSection('kit')}
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
                flexDirection="row"
              >
                <SurfacePassProps size={1} iconSize={12}>
                  <Row group>
                    <RoundButton
                      icon="moon"
                      tooltip="Toggle dark mode"
                      onClick={() => setTheme(theme === 'home' ? 'light' : 'home')}
                    />
                    {/* <RoundButton
                      icon="code"
                      iconSize={16}
                      tooltip="Toggle all code collapsed"
                      onClick={siteStore.toggleCodeCollapsed}
                    /> */}
                    {isSmall && (
                      <RoundButton
                        icon={showSidebar ? 'arrowleft' : 'arrowright'}
                        tooltip="Toggle menu"
                        onClick={() => setShowSidebar(!showSidebar)}
                      />
                    )}
                  </Row>
                </SurfacePassProps>
              </Absolute>
            </Row>
          </FadeChild>
        </ListShortcuts>
      </Portal>
    )
  },
)
