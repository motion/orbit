import React from 'react'
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import Router from '~/router'

class BreadcrumbStore {
  last = null
  crumbs = watch(async () => {
    const { currentDocument } = this.props.commanderStore
    console.log(currentDocument)
    if (!currentDocument) {
      return []
    }
    if (this.crumbs && this.crumbs._id === currentDocument._id) {
      return this.crumbs
    }
    this.last = await currentDocument.getCrumbs()
    return this.last
  })
}

@view.attach('commanderStore')
@view({
  store: BreadcrumbStore,
})
export default class Breadcrumbs {
  render({ store }) {
    const crumbs = [
      {
        text: <UI.Icon size={12} name="home" color="#ccc" hoverColor="red" />,
        url: '/',
      },
    ]

    if (store.crumbs) {
      console.log('curmbs are', store.crumbs, typeof store.crumbs)
      crumbs.push(
        store.crumbs.map(doc => ({
          text: doc.title,
          url: doc.url(),
        }))
      )
    }

    return (
      <breadcrumbs>
        <items $$row>
          {crumbs.map((item, index) =>
            <item key={item.url || index} $$row>
              <UI.Text onClick={() => Router.go(item.url)}>
                {item.text}
              </UI.Text>
              <slash if={index !== crumbs.length - 1}>/</slash>
            </item>
          )}
        </items>
      </breadcrumbs>
    )
  }

  static style = {
    breadcrumbs: {
      userSelect: 'none',
      height: 38,
      fontSize: 22,
      padding: [0, 20],
      margin: [-5, 0, 0],
      flexFlow: 'row',
      // borderLeft: [4, '#ddd'],
    },
    items: {
      alignItems: 'center',
    },
    slash: {
      opacity: 0.025,
      margin: [0, 2],
      fontWeight: 200,
      fontSize: 12,
      pointerEvents: 'none',
    },
    nav: {
      margin: [0, 8, 0, 0],
      flexFlow: 'row',
      alignItems: 'center',
    },
    inactive: {
      opacity: 0.5,
      pointerEvents: 'none',
    },
  }
}
