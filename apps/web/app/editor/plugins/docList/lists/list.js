import React from 'react'
import { view, computed } from '@jot/black'
import node from '~/editor/node'
import { Document } from '@jot/models'
import { Button, Glow, Loading, Icon } from '@jot/ui'
import { isEqual } from 'lodash'
import Router from '~/router'

const lightBlue = '#e7f6ff'
const darkBlue = `#0099e5`

@view.attach('layoutStore')
@view
export default class DocLinkList {
  render({ node, layoutStore, listStore, editing, children, ...props }) {
    const hasLoaded = !!listStore.docs
    const hasDocs = hasLoaded && listStore.docs.length > 0
    const showNoDocs = hasLoaded && !hasDocs

    return (
      <docLinkList contentEditable={false}>
        <top $$row>
          <Button icon="simple-add" onClick={() => layoutStore.createDoc()}>
            create document
          </Button>
        </top>
        <list>
          <loading if={!hasLoaded}><Loading $loading /></loading>
          <noDocs if={showNoDocs}>
            <text>no documents</text>
            <Button icon="simple-add" onClick={() => layoutStore.createDoc()}>
              create document
            </Button>
          </noDocs>
          <docs if={hasLoaded && hasDocs}>
            {(listStore.docs || []).map((doc, index) =>
              <item
                key={doc._id}
                onClick={() => Router.go(doc.url())}
                $notFirst={index > 0}
              >
                <Glow full scale={0.7} color={[255, 255, 255]} opacity={0.04} />
                <Icon
                  name="arrows-1_circle-right-37"
                  $icon
                  color={darkBlue}
                  size={20}
                />

                <text>{doc.title}</text>
              </item>
            )}
          </docs>
        </list>
      </docLinkList>
    )
  }

  static style = {
    docLinkList: {
      marginTop: 5,
      marginBottom: 5,
    },
    input: {
      padding: 0,
      marginLeft: '1px !important',
      fontSize: 14,
      borderWidth: 0,
      marginLeft: 2,
      marginTop: 1,
      width: 150,
      '&:focus': {},
      '&:hover': {
        borderBottom: '1px dashed #333',
      },
    },
    top: {
      paddingTop: 3,
      paddingBottom: 3,
      fontSize: 14,
      color: '#555',
    },
    latest: {
      marginTop: 8,
    },
    list: {
      background: '#fafdff',
      borderRadius: 5,
      border: `1px solid ${lightBlue}`,
    },
    loading: {
      padding: 20,
    },
    noDocs: {
      alignItems: 'center',
      padding: 20,
      color: darkBlue,
      fontSize: 24,
      fontWeight: 300,
    },
    item: {
      flexFlow: 'row',
      fontSize: 17,
      cursor: 'pointer',
      color: darkBlue,
      fontWeight: 300,
      paddingLeft: 15,
      alignItems: 'center',
      padding: 5,
      opacity: 0.8,
      transition: 'opacity 100ms ease-in',
    },
    icon: {
      opacity: 0.8,
    },
    text: {
      padding: [16, 0, 14, 10],
    },
    notFirst: {
      borderTop: `1px solid ${lightBlue}`,
    },
  }
}
