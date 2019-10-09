import { Absolute, ListItem, ListShortcuts, Popover, RoundButton, Stack } from '@o/ui'
import React, { memo, useMemo } from 'react'

import { fontProps } from '../constants'
import { useSiteStore } from '../SiteStore'
import { FadeInView } from '../views/FadeInView'
import { Key } from '../views/Key'
import { ListSubTitle } from '../views/ListSubTitle'
import { SearchInput } from '../views/SearchInput'
import { DocsStoreContext } from './DocsStore'
import { useScreenVal } from './HomePage/SpacedPageContent'

const HeaderButton = props => (
  // <Theme name="translucent">
  <RoundButton {...props} />
  // </Theme>
)

export const DocsPageHeader = memo(({ isSmall, inputRef, setTheme, theme }: any) => {
  const siteStore = useSiteStore()
  const docsStore = DocsStoreContext.useStore()
  return (
    <ListShortcuts>
      <FadeInView style={{ flex: 1 }}>
        <Stack
          direction="horizontal"
          position="relative"
          margin={[0, 'auto', 0, 'auto']}
          pointerEvents="auto"
          padding={['sm', 0]}
          width={useScreenVal('100%', '90%', '90%')}
          maxWidth={980}
          alignItems="center"
          justifyContent="center"
          opacity={siteStore.showSidebar ? 0 : 1}
        >
          {/* <Theme coat="translucent"> */}
          <SearchInput
            nodeRef={inputRef}
            onChange={e => docsStore.setSearch(e.target.value)}
            maxWidth="calc(55% - 20px)"
            flex={1}
            size="xl"
            placeholder={isSmall ? 'Search...' : 'Search the docs...'}
            after={<Key tooltip="Shortcut: t">t</Key>}
            // borderWidth={0}
            background={theme => {
              return theme.background.setAlpha(0.14)
            }}
            backdropFilter="blur(20px)"
            {...fontProps.SystemFont}
          />
          {/* </Theme> */}

          <Absolute
            top={0}
            width="18%"
            left={0}
            bottom={0}
            alignItems="flex-end"
            justifyContent="center"
          >
            <Popover
              // @ts-ignore
              background
              width={300}
              openOnClick
              closeOnClickAway
              elevation={100}
              zIndex={1000000000000000}
              target={<HeaderButton icon="filter">{isSmall ? '' : 'Filter'}</HeaderButton>}
            >
              <>
                <ListItem selectable={false}>
                  <ListSubTitle marginTop={6}>Sections</ListSubTitle>
                </ListItem>
                <ListItem
                  index={2}
                  title="Docs"
                  coat={docsStore.section === 'docs' ? 'selected' : null}
                  onClick={() => docsStore.toggleSection('docs')}
                />
                <ListItem
                  index={2}
                  title="APIs"
                  coat={docsStore.section === 'apis' ? 'selected' : null}
                  onClick={() => docsStore.toggleSection('apis')}
                />
                <ListItem
                  index={2}
                  title="Kit"
                  coat={docsStore.section === 'kit' ? 'selected' : null}
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
            <Stack direction="horizontal" group>
              <HeaderButton
                icon="moon"
                tooltip="Toggle dark mode"
                onClick={() => setTheme(theme === 'docsPageTheme' ? 'dark' : 'docsPageTheme')}
              />
            </Stack>
          </Absolute>
        </Stack>
      </FadeInView>
    </ListShortcuts>
  )
})
