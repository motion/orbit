import React from 'react'
import { view } from '@mcro/black'
import { Input } from '@mcro/ui'
import { Editor } from 'slate'

@view.attach('commanderStore')
@view
export default class CommanderInput {
  renderBlurred() {
    const { commanderStore: store } = this.props
    const items = store.value.split(store.PATH_SEPARATOR)

    const highlight = text => {
      return text === 'inbox'
    }

    return (
      <items $$row>
        {items.map(item =>
          <item $$row $highlight={highlight(item)}>
            <sep>
              {store.PATH_SEPARATOR}
            </sep>
            <text>
              {item}
            </text>
          </item>
        )}
      </items>
    )
  }

  render({ commanderStore: store }) {
    store.renderIndex

    return (
      <bar
        $$align="center"
        $blurred={!store.focused}
        $focused={store.focused}
        $$row
        $$flex
      >
        <Editor
          if={store.active}
          placeholder={'search or create docs'}
          state={store.editorState}
          ref={input => (store.input = input)}
          onKeyDown={store.onKeyDown}
          onFocus={store.onFocus}
          onBlur={store.onBlur}
          onChange={store.onChange}
        />

        <blurredContent onClick={store.onActivate} if={!store.active}>
          {this.renderBlurred()}
        </blurredContent>
      </bar>
    )
  }

  static style = {
    bar: {
      padding: 5,
    },
    focused: {
      border: '1px solid rgba(82, 139, 211, 1)',
      borderRadius: 5,
    },
    blurred: {
      borderBottom: `1px solid #eee`,
    },
    blurredContent: {
      width: '100%',
    },
    input: {
      width: '100%',
      marginTop: 0,
    },
    highlight: {
      fontWeight: 'bold',
    },
  }
}
