// @flow
import React from 'react'
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import { User } from '@mcro/models'
import Router from '~/router'
import { flatMap } from 'lodash'
import RightArrow from '~/views/rightArrow'

@view({
  store: class SidebarProjectStore {
    @watch
    crumbs = () =>
      User.favoriteDocuments &&
      Promise.all(User.favoriteDocuments.map(doc => doc.getCrumbs()))
  },
})
export default class Projects {
  render({ store }: { store: SidebarProjectStore }) {
    const docs = User.favoriteDocuments || []
    const hasDocs = docs.length !== 0
    const percentComplete = tasks =>
      100 * tasks.filter(i => i.archive).length / tasks.length
    const { crumbs } = store
    const hasCrumbs = crumbs && crumbs.length

    return (
      <content $$draggable $$scrollable $$flex={6}>
        <UI.Placeholder if={!hasDocs} size={2}>
          No Stars
        </UI.Placeholder>

        <UI.StableContainer stableDuration={200}>
          <tasks if={hasDocs && hasCrumbs}>
            {docs.map((doc, index) => {
              const tasks = doc.tasks()
              const hasTasks = tasks && tasks.length
              const percentDone = percentComplete(tasks)
              return (
                <section key={doc._id}>
                  <title $$row $$spaceBetween>
                    <start $$row>
                      <UI.Progress.Circle
                        if={hasTasks}
                        key={percentDone}
                        lineColor="rgba(130, 248, 198, 0.6)"
                        backgroundColor={[0, 0, 0, 0.55]}
                        lineWidth={4}
                        size={16}
                        percent={percentDone}
                      />
                      <path $$row $$centered>
                        {flatMap(
                          crumbs &&
                            crumbs[index] &&
                            crumbs[index].map((crumbDoc, crumbIndex) => {
                              const ID = `${crumbDoc._id}${crumbIndex}`
                              return [
                                <RightArrow $arrow key={ID + '-1'} />,
                                <UI.Button
                                  key={ID + '-2'}
                                  $button
                                  size={0.9}
                                  borderRadius={20}
                                  chromeless
                                  onClick={() => Router.go(log(crumbDoc.url()))}
                                >
                                  {crumbDoc.title}
                                </UI.Button>,
                              ]
                            })
                        ).slice(1)}
                      </path>
                    </start>
                    <end>
                      <UI.Button
                        glow={false}
                        glint={false}
                        theme="blank"
                        margin={-5}
                        marginRight={-15}
                        icon="remove"
                        color="rgba(255, 255, 255, 0.1)"
                        hoverColor="red"
                        onClick={doc.toggleStar}
                        tooltip="remove"
                        tooltipProps={{
                          towards: 'left',
                        }}
                      />
                    </end>
                  </title>
                  <tasks if={hasTasks}>
                    {tasks.map(({ archive, text, key }, index) =>
                      <task key={key} $$row $$align="center">
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
        </UI.StableContainer>

        <empty if={hasDocs} $$draggable />
      </content>
    )
  }

  static style = {
    content: {
      flex: 1,
      overflowY: 'scroll',
    },
    arrow: {
      color: [255, 255, 255, 0.2],
    },
    btn: {
      padding: [2, 6],
    },
    tasks: {
      padding: [0, 10],
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
    button: {
      margin: [0, -2],
    },
    task: {
      padding: [3, 0, 2],
      pointerEvents: 'auto',
      overflow: 'hidden',
    },
    check: {
      margin: ['auto', 12, 'auto', 0],
    },
    sep: {
      margin: [0, 2],
      fontWeight: 100,
      color: [255, 255, 255, 0.2],
    },
  }
}
