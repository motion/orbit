import { Editor } from 'slate'

export function FocusPlugin() {
  return {
    onFocus(event: Event, editor: Editor, next: Function) {
      if (editor.props.onFocus) {
        editor.props.onFocus(event)
      }
      return next()
    },
    onBlur(event: Event, editor: Editor, next: Function) {
      if (editor.props.onBlur) {
        editor.props.onBlur(event)
      }
      return next()
    },
  }
}
