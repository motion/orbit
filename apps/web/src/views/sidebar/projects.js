// @flow
import React from 'react'
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Document } from '@mcro/models'
import Router from '~/router'
import { flatMap } from 'lodash'
import Arrow from '~/explorer/arrow'

@view({
  store: class SidebarProjectStore {
    docs = Document.stars()
    crumbs = watch(
      () => this.docs && Promise.all(this.docs.map(doc => doc.getCrumbs()))
    )
  },
})
export default class Projects {
  render({ store }: { store: SidebarProjectStore }) {
    const docs = store.docs || []
    const hasDocs = docs.length !== 0
    const percentComplete = tasks =>
      100 * tasks.filter(i => i.archive).length / tasks.length

    return (
      <content $$scrollable $$flex={6}>
        <UI.Placeholder if={!hasDocs} size={2}>
          No Stars
        </UI.Placeholder>

        <tasks if={hasDocs}>
          {docs.map((doc, index) => {
            const tasks = doc.tasks()
            return (
              <section key={index}>
                <title $$row $$spaceBetween>
                  <start $$row $$centered>
                    <UI.Progress.Circle
                      style={{ marginRight: 4 }}
                      lineColor="rgba(130, 248, 198, 0.6)"
                      backgroundColor={[0, 0, 0, 0.15]}
                      lineWidth={4}
                      size={18}
                      percent={percentComplete(tasks)}
                    />
                    <path onClick={() => Router.go(doc.url())} $$row $$centered>
                      {flatMap(
                        store.crumbs &&
                          store.crumbs[index] &&
                          store.crumbs[index].map(doc => [
                            <Arrow $arrow />,
                            <UI.Button
                              glow={true}
                              glint={false}
                              theme="blank"
                              size={0.9}
                              chromeless
                              onClick={() => Router.go(doc.url())}
                            >
                              {doc.getTitle()}
                            </UI.Button>,
                          ])
                      ).slice(1)}
                    </path>
                  </start>
                  <end>
                    <UI.Button
                      glow={false}
                      glint={false}
                      theme="blank"
                      size={1.2}
                      margin={-5}
                      icon="pin-remove"
                      color="rgba(255, 255, 255, 0.015)"
                      hoverColor="yellow"
                      onClick={doc.toggleStar}
                      tooltip="remove"
                      tooltipProps={{
                        towards: 'left',
                      }}
                    />
                  </end>
                </title>
                <tasks if={tasks && tasks.length}>
                  {tasks.map(({ archive, text, key }, index) =>
                    <task key={key} $$row>
                      <UI.Input
                        $check
                        onChange={() => doc.toggleTask(text)}
                        type="checkbox"
                        checked={archive}
                      />{' '}
                      <UI.Text ellipse>{text}</UI.Text>
                    </task>
                  )}
                </tasks>
              </section>
            )
          })}
        </tasks>

        <empty if={hasDocs} $$draggable />
      </content>
    )
  }

  static style = {
    arrow: {
      color: [255, 255, 255, 0.2],
    },
    btn: {
      padding: [2, 6],
    },
    tasks: {
      padding: [10, 10],
    },
    empty: {
      flex: 1,
    },
    section: {
      margin: [6, 0],
      padding: [0, 5],
    },
    noStars: {
      fontWeight: 200,
      fontSize: 16,
      flex: 1,
      textAlign: 'center',
      justifyContent: 'center',
      color: '#888',
    },
    title: {
      padding: [0, 5],
      marginLeft: -5,
    },
    path: {
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 4,
      fontSize: 17,
      lineHeight: 1,
      cursor: 'default',
      '&:hover icon': {
        color: [255, 255, 255, 0.4],
      },
    },
    task: {
      padding: [3, 0, 2],
      pointerEvents: 'auto',
      overflow: 'hidden',
    },
    check: {
      margin: [0, 8, 0, 0],
    },
    sep: {
      margin: [0, 2],
      fontWeight: 100,
      color: [255, 255, 255, 0.2],
    },
  }
}
