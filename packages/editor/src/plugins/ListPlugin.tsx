import * as UI from '@o/ui'
import { every } from 'lodash'
import React from 'react'
import AutoReplace from 'slate-auto-replace'

import { BLOCKS } from '../constants'
import { node } from '../node'
import { EditListPlugin } from './EditListPlugin'
import { createButton } from './helpers'
import { Paragraph } from './ParagraphPlugin'

// import moment from 'moment'
const { UL_LIST, OL_LIST, LIST_ITEM } = BLOCKS
const editList = EditListPlugin()

editList.utils.isInListOfType = (state, type) => {
  const list = editList.utils.getCurrentList(state)
  return list && list.type === type
}

const ol_list = node(props => {
  return <ol {...props.attributes}>{props.children}</ol>
})

@node
// @view.ui
class ListNode {
  render({ isRoot, ...props }) {
    let done = false
    if (isRoot) {
      done = every(props.children.map(i => i.props.node.data.get('archive') || false))
    }
    return (
      <tasks $done={done} $isRoot={isRoot}>
        <toolbar if={false && isRoot} contentEditable={false} />
        <ul {...props.attributes}>{props.children}</ul>
      </tasks>
    )
  }
  static style = {
    ul: {
      transition: 'background 150ms ease-in',
    },
    isRoot: {
      margin: [8, 0, 18, 10],
    },
    done: {
      background: 'rgba(255, 255, 255, 1)',
    },
  }
}

@node
@view.ui
class ListItemNode {
  render({ toggleData, ...props }) {
    const { minimize = false, due, archive = false } = props.node.data.toJS()
    const text = props.children[0].props.node.text
    const hasChildren = props.children.length > 1

    const className = 'strikethrough ' + (archive ? 'active' : '')

    return (
      <listItem $$row>
        <UI.Icon
          $hide={!hasChildren}
          $min={minimize}
          contentEditable={false}
          name={minimize ? 'smalltriright' : 'smalltrdown'}
          color={[0, 0, 0, 0.2]}
          size={14}
          onClick={() => toggleData('minimize')}
          css={{
            transform: { y: 3 },
            width: 20,
            marginLeft: -20,
          }}
        />
        <UI.Input
          type="checkbox"
          contentEditable={false}
          onChange={e => toggleData('archive')}
          checked={archive}
          css={{
            transform: { y: 2, x: -3 },
          }}
          marginRight={6}
        />
        <contents>
          <li $archive={archive} className={className} {...props.attributes}>
            {minimize ? <Paragraph>{text}</Paragraph> : props.children}
          </li>
          <metaText if={due} $$row contentEditable={false}>
            {/* due {moment(due).fromNow()} */}
          </metaText>
        </contents>
      </listItem>
    )
  }

  // BE CAREFUL NOT TO CHANGE HEIGHT
  static style = {
    contents: {
      flex: 1,
    },
    listItem: {
      margin: [8, 0, 0],
    },
    archive: {
      opacity: 0.9,
    },
    li: {
      listStyleType: 'none',
      transition: 'opacity 100ms ease-in',
      minWidth: 5,
    },
    check: {
      margin: [5, 8, 'auto', 0],
      fontSize: 30,
      cursor: 'pointer',
    },
    metaText: {
      opacity: 0.8,
      fontSize: 13,
    },
    minMax: {
      // WARNING: dont set height to px it changes line height
      height: '100%',
      width: 30,
      // marginLeft: -30,
      userSelect: 'none',
      cursor: 'pointer',
      fontSize: 16,
    },
    hide: {
      opacity: 0,
      pointerEvents: 'none',
    },
    min: {
      paddingRight: 0,
    },
  }
}

export default class List {
  name = 'list'
  category = 'blocks'

  utils = editList.utils
  transforms = editList.transforms

  nodes = {
    [OL_LIST]: ol_list,
    [UL_LIST]: ListNode,
    [LIST_ITEM]: ListItemNode,
  }

  barButtons = [
    createButton({
      icon: 'list-bullet',
      type: UL_LIST,
      tooltip: 'Bulleted List',
      wrap: t => editList.transforms.wrapInList(t, UL_LIST),
      unwrap: editList.transforms.unwrapList,
      isActive: state => editList.utils.isInListOfType(state, UL_LIST),
    }),
    createButton({
      icon: 'list-number',
      type: OL_LIST,
      tooltip: 'Numbered List',
      wrap: t => editList.transforms.wrapInList(t, OL_LIST),
      unwrap: editList.transforms.unwrapList,
      isActive: state => editList.utils.isInListOfType(state, OL_LIST),
    }),
  ]

  plugins = [
    // list functions
    editList,
    // markdown
    AutoReplace({
      trigger: 'space',
      before: /^(-)$/,
      transform: transform => transform.call(editList.transforms.wrapInList),
    }),
  ]
}