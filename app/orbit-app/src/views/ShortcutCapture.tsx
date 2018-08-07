import { Component, cloneElement } from 'react'
import EventStringifier from 'key-event-to-string'

type Props = {
  defaultValue?: string
  onUpdate?: Function
  onInvalid?: Function
  modifierNeeded?: boolean
  keyNeeded?: boolean
  modifierChars?: Object
  validate?: (a: string) => boolean
  element?: React.ReactElement<any>
}

export class ShortcutCapture extends Component<Props> {
  static defaultProps = {
    onUpdate: _ => _,
    onInvalid: _ => _,
    modifierNeeded: true,
    keyNeeded: true,
    modifierChars: {},
    validate: _ => true,
    element: 'input',
  }

  state = {
    value: '',
  }

  keyDown = e => {
    const eventToString = EventStringifier(this.props.modifierChars)
    const oldValue = e.target.value
    const newValue = eventToString(e)
    const details = EventStringifier.details(e)
    const isValid =
      (!this.props.keyNeeded || details.hasKey) &&
      (!this.props.modifierNeeded || details.hasModifier)

    if (isValid && this.props.validate(newValue)) {
      this.setState({ value: newValue })
      if (newValue !== oldValue) {
        this.props.onUpdate(newValue, oldValue)
      }
    } else {
      this.props.onInvalid(newValue)
    }
  }

  select = e => {
    e.target.select()
  }

  render() {
    const { defaultValue, element, ...props } = this.props
    const { value } = this.state
    return cloneElement(element, {
      value: value || defaultValue,
      onKeyDown: this.keyDown,
      onFocus: this.select,
      ...props,
    })
  }
}
