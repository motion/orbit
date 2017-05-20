import { view, node } from '~/helpers'

@node
@view
export default class Input {
  render(props) {
    console.log('input', props)
    return (
      <root>
        <label contentEditable suppressContentEditableWarning />
        <text
          contentEditable
          suppressContentEditableWarning
          {...props.attributes}
        >
          {props.children}
        </text>
      </root>
    )
  }

  static style = {
    root: {
      borderBottom: [2, 'blue'],
      color: '#777',
      padding: [6, 10],
      fontSize: 16,
    },
    label: {
      width: 100,
      textAlign: 'right',
    },
    text: {},
  }
}
