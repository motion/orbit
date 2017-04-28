export default {
  bold: props => <strong>{props.children}</strong>,
  code: props => <code style={{ display: 'inline' }}>{props.children}</code>,
  italic: props => <em style={{ display: 'inline' }}>{props.children}</em>,
  underlined: props => <u style={{ display: 'inline' }}>{props.children}</u>,
}
