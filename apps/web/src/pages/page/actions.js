// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import Gemstone from '~/views/kit/gemstone'
import Router from '~/router'
import { User } from '~/app'
import timeAgo from 'time-ago'

const { ago } = timeAgo()

@view.attach('rootStore')
@view
export default class DocPageActions {
  render({ rootStore: { document }, ...props }) {
    if (!document || document === null) {
      return null
    }

    const popoverProps = {
      elevation: 2,
      borderRadius: 8,
      background: 'transparent',
      distance: 10,
      forgiveness: 16,
      towards: 'left',
      adjust: [0, 70],
      delay: 290,
      openOnHover: true,
    }

    return (
      <actions
        $$draggable
        css={{
          flexFlow: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: [18, 0, 0],
          marginRight: 13,
          pointerEvents: 'auto',
        }}
        {...props}
      >
        <UI.Button
          size={1.2}
          margin={[0, -9, 0]}
          circular
          borderWidth={0}
          overflow="visible"
          badge={Math.floor(Math.random() * 100)}
          badgeProps={{
            css: {
              background: document.hasStar()
                ? 'linear-gradient(left, #333, #000)'
                : 'linear-gradient(left, #999, #777)',
              top: '10%',
              right: '15%',
            },
          }}
          icon="_signal"
          tooltip={document.hasStar() ? 'leave' : 'join'}
          tooltipProps={{
            towards: 'left',
          }}
          highlight={document.hasStar()}
          onClick={() => document.toggleStar()}
          iconProps={{
            css: {
              transition: 'transform linear 50ms',
              transform: `scale(${document.hasStar() ? 1.2 : 1})`,
            },
          }}
        />
        <space css={{ paddingTop: 12 }} />
        <UI.Popover
          {...popoverProps}
          target={
            <UI.Button chromeless circular padding={0} size={1.2} glow>
              <Gemstone
                if={document}
                id={document.id}
                size={17}
                css={{
                  margin: 'auto',
                }}
              />
            </UI.Button>
          }
        >
          <UI.Surface width={200} padding={10}>
            <UI.List.Item if={false} icon="back" primary="Revisions" />

            <UI.Form onSubmit={User.org && User.org.inviteMember}>
              <UI.Title>Invite</UI.Title>
              <UI.Row>
                <UI.Input
                  name="email"
                  type="email"
                  placeholder="my@friend.com"
                />
                <UI.Input type="submit" icon="3send" />
              </UI.Row>
            </UI.Form>

            <space css={{ height: 8 }} />

            <UI.Title>Share link</UI.Title>
            <UI.Input value={Router.path} readOnly />

            <space css={{ height: 8 }} />

            <section $$row>
              <left css={{ flex: 1 }}>
                <UI.Text size={0.9}>
                  <strong>Created</strong> {ago(document.createdAt)}
                </UI.Text>
                <UI.Text size={0.9}>
                  <strong>Updated</strong> {ago(document.updatedAt)}
                </UI.Text>
              </left>
            </section>
          </UI.Surface>
        </UI.Popover>
        <space css={{ paddingTop: 12 }} />
      </actions>
    )
  }
}
