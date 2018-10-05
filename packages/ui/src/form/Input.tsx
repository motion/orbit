import * as React from 'react'
import { view } from '@mcro/black'
import { SizedSurface, SizedSurfaceProps } from '../SizedSurface'
import { UIContext } from '../helpers/contexts'

export type InputProps = SizedSurfaceProps & {
  uiContext: {
    inForm?: boolean
    formValues: Object
    form: { submit: Function }
  }
  sync?: { get: () => any; set: (a: any) => void }
  onEnter?: Function
  type?: 'input' | 'checkbox' | 'submit' | 'textarea' | 'password' | 'email'
  name?: string
  form?: Object
  elementProps?: Object
  onClick?: Function
  forwardRef: any
}

@view.ui
class InputPlain extends React.PureComponent<InputProps> {
  static defaultProps = {
    size: 1,
    type: 'input',
    tagName: 'input',
    elementProps: {},
    forwardRef: React.createRef<HTMLInputElement>(),
  }

  componentDidMount() {
    this.setValues()
  }

  componentDidUpdate() {
    this.setValues()
  }

  get shouldSyncToForm() {
    const { uiContext, sync } = this.props
    return uiContext && uiContext.inForm && !sync
  }

  get inputNode() {
    return this.props.forwardRef.current
  }

  setValues = () => {
    if (this.shouldSyncToForm && this.inputNode) {
      this.props.uiContext.formValues[this.props.name] = () =>
        this.inputNode && this.inputNode.value
    }
  }

  onClick = e => {
    e.preventDefault()
    if (this.shouldSyncToForm) {
      this.props.uiContext.form.submit()
    }
    if (this.props.onClick) {
      this.props.onClick(e)
    }
  }

  syncSet = e => this.props.sync.set(e.target.value)

  render() {
    const { sync, onChange, value, forwardRef, uiContext, ...props } = this.props
    const finalProps = {} as InputProps
    if (sync) {
      finalProps.value = sync.get()
      finalProps.onChange = this.syncSet
    }
    return (
      <SizedSurface
        width="100%"
        sizeFont
        sizePadding
        sizeHeight
        sizeLineHeight
        sizeRadius
        noInnerElement
        borderWidth={1}
        {...{
          value,
          onChange,
          forwardRef,
          ...finalProps,
        }}
        {...props}
      />
    )
  }
}

export const Input = props => {
  return (
    <UIContext.Consumer>
      {uiContext => <InputPlain uiContext={uiContext} {...props} />}
    </UIContext.Consumer>
  )
}
