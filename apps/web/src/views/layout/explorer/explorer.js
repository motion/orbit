import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import RightArrow from '~/views/kit/rightArrow'
import Router from '~/router'
import ExplorerStore from './explorerStore'
import Children from '~/pages/page/children'

const $arrow = {
  opacity: 0.5,
  margin: [0, 6],
  transform: {
    scale: 1,
    y: -1,
  },
}

@view.attach('rootStore')
@view.provide({
  explorerStore: ExplorerStore,
})
export default class Explorer {
  render({ explorerStore }) {
    explorerStore.version

    return (
      <bar $blurred={!explorerStore.focused} $focused={explorerStore.focused}>
        <UI.Button
          iconSize={18}
          margin={[6, 0, 6, 8]}
          chromeless
          glow={false}
          circular
          color={[0, 0, 0, 0.34]}
          height={24}
          icon="home"
          onClick={() => Router.go('/')}
        />
        <crumbs
          if={Router.path !== '/' && explorerStore.crumbs}
          css={{ flexFlow: 'row', alignItems: 'center' }}
        >
          {explorerStore.crumbs.map((crumb, index) => {
            const isLast = index === explorerStore.crumbs.length - 1
            const crumbTitle =
              crumb.title.length > 30
                ? crumb.title.slice(0, 27) + '...'
                : crumb.title

            const crumbProps = isLast
              ? {}
              : {
                  onClick: () => Router.go(crumb.url()),
                  css: {
                    '&:hover': {
                      background: '#eee',
                    },
                  },
                }
            const crumbItem = (
              <crumb
                {...crumbProps}
                css={{
                  padding: [2, 4],
                  margin: [-2, -4],
                  borderRadius: 5,
                  ...crumbProps.css,
                }}
              >
                {crumbTitle}
              </crumb>
            )
            const crumbWrapped = isLast
              ? crumbItem
              : <UI.Popover
                  openOnHover
                  background
                  borderRadius
                  elevation={3}
                  delay={600}
                  target={crumbItem}
                >
                  {isOpen =>
                    <wrap if={isOpen}>
                      <Children document={crumb} />
                    </wrap>}
                </UI.Popover>

            return (
              <path
                key={crumb.id}
                css={{ fontSize: 20, flexFlow: 'row', alignItems: 'center' }}
              >
                <RightArrow css={$arrow} />
                {crumbWrapped}
              </path>
            )
          })}
        </crumbs>

        <fade
          $$fullscreen
          css={{
            left: 'auto',
            width: 50,
            background: 'linear-gradient(left, transparent, #fff)',
          }}
        />
      </bar>
    )
  }

  static style = {
    bar: {
      overflow: 'hidden',
      position: 'relative',
      height: 38,
      flexFlow: 'row',
      flex: 1,
      alignItems: 'center',
      borderBottom: [1, '#e0e0e0', 'dotted'],
    },
    focused: {
      borderColor: '#ddd',
    },
    blurred: {
      // background: '#f2f2f2',
      // borderBottom: '1px solid #eee',
    },
  }
}
