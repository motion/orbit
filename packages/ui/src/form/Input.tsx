import * as React from 'react'
import { view } from '@mcro/black'
import { SizedSurface, SizedSurfaceProps } from '../SizedSurface'
import { UIContext } from '../helpers/contexts'

export type InputProps = SizedSurfaceProps & {
  uiContext: Object
  sync?: Object
  onEnter?: Function
  type?: 'input' | 'checkbox' | 'submit' | 'textarea' | 'password'
  name?: string
  form?: Object
  elementProps?: Object
  onClick?: Function
}

@view.ui
class InputPlain extends React.PureComponent<InputProps> {
  static defaultProps = {
    size: 1,
    type: 'input',
    elementProps: {},
    forwardRef: React.createRef(),
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
    const {
      sync,
      elementProps,
      onChange,
      value,
      forwardRef,
      ...props
    } = this.props
    const finalProps = { ...elementProps }
    if (sync && elementProps) {
      finalProps.value = sync.get()
      finalProps.onChange = this.syncSet
    }
    return (
      <SizedSurface
        sizeFont
        sizePadding
        sizeHeight
        sizeLineHeight
        sizeRadius
        borderWidth={1}
        tagName="input"
        elementProps={{
          value,
          onChange,
          ref: forwardRef,
          ...finalProps,
        }}
        {...props}
      />
    )
  }
}

export const Input = React.forwardRef((props, ref) => {
  return (
    <UIContext.Consumer>
      {uiContext => (
        <InputPlain uiContext={uiContext} forwardRef={ref} {...props} />
      )}
    </UIContext.Consumer>
  )
})
