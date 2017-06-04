import { view } from '~/helpers'
import node from '~/editor/node'
import EditList from './editList'
import { Button } from '~/ui'
import { BLOCKS } from '~/editor/constants'
import { replacer } from '~/editor/helpers'
import AutoReplace from 'slate-auto-replace'
import { createButton } from './helpers'
import { every } from 'lodash'

const { UL_LIST, OL_LIST, LIST_ITEM } = BLOCKS
const editList = EditList()

editList.utils.isInListOfType = (state, type) => {
  const list = editList.utils.getCurrentList(state)
  return list && list.type === type
}

const ol_list = node(
  view(props => {
    return <ol $$ol {...props.attributes}>{props.children}</ol>
  })
)

const ul_list = @node
@view
class Ul {
  render({ isRoot, ...props }) {
    let done = false

    if (isRoot) {
      done = every(
        props.children.map(i => i.props.node.data.get('archive') || false)
      )
    }

    return (
      <ul $isRoot={isRoot} $done={done} {...props.attributes}>
        {props.children}
      </ul>
    )
  }

  static style = {
    ul: {
      transition: 'background 150ms ease-in',
    },
    isRoot: {
      width: '150%',
      background: `rgba(250, 250, 250, 1)`,
      marginLeft: -50,
      paddingLeft: 50,
      padding: 20,
      paddingLeft: 100,
      marginTop: 10,
      marginBottom: 10,
      borderTop: '1px solid #ddd',
      borderBottom: '1px solid #ddd',
    },
    done: {
      background: 'rgba(255, 255, 255, 1)',
    },
  }
}

const list_item = @node
@view
class Li {
  toggleMinimize = () => {
    const { node: { data }, setData } = this.props

    setData(data.set('minimize', !(data.get('minimize') || false)))
  }

  render(props) {
    const archive = props.node.data.get('archive') || false
    const minimize = props.node.data.get('minimize') || false
    const text = props.children[0].props.node.text

    const className = 'strikethrough ' + (archive ? 'active' : '')

    return (
      <wrap $$row>
        <minMax
          $min={minimize}
          contentEditable={false}
          onClick={this.toggleMinimize}
        >
          {minimize ? '+' : '-'}
        </minMax>
        <li $archive={archive} className={className} {...props.attributes}>
          {minimize ? <p $$text>{text}</p> : props.children}
        </li>
      </wrap>
    )
  }

  static style = {
    archive: {
      opacity: 0.9,
    },
    minMax: {
      height: 30,
      padding: 3,
      cursor: 'pointer',
      marginLeft: -30,
      fontSize: 16,
    },
    min: {
      marginLeft: -33,
      paddingRight: 0,
    },
    li: {
      marginLeft: 30,
      transition: 'opacity 100ms ease-in',
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
    [UL_LIST]: ul_list,
    [LIST_ITEM]: list_item,
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
