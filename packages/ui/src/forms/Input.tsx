import * as React from 'react'
import { UIContext, UIContextType } from '../helpers/contexts'
import { SizedSurface, SizedSurfaceProps } from '../SizedSurface'

export type InputProps = React.HTMLAttributes<HTMLInputElement> &
  SizedSurfaceProps & {
    value?: string
    sync?: { get: () => any; set: (a: any) => void }
    onEnter?: Function
    type?: 'input' | 'checkbox' | 'submit' | 'textarea' | 'password' | 'email'
    name?: string
    form?: Object
    elementProps?: Object
    onClick?: Function
    forwardRef?: any
  }

type InputDecoratedProps = InputProps & {
  uiContext: UIContextType
}

class InputPlain extends React.PureComponent<InputDecoratedProps> {
  static defaultProps = {
    size: 1,
    type: 'input',
    tagName: 'input',
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
      const inForm = this.props.uiContext.inForm
      const { name } = this.props
      if (name && inForm) {
        inForm.formValues[name] = () => this.inputNode && this.inputNode.value
      }
    }
  }

  onClick = e => {
    e.preventDefault()
    if (this.shouldSyncToForm && this.props.uiContext.inForm) {
      this.props.uiContext.inForm.submit()
    }
    if (this.props.onClick) {
      this.props.onClick(e)
    }
  }

  onKeyDown = e => {
    if (e.keyCode === 13) {
      if (this.props.onEnter) {
        this.props.onEnter(e)
      }
    }
    if (this.props.onKeyDown) {
      this.props.onKeyDown(e)
    }
  }

  syncSet = e => {
    if (this.props.sync) {
      this.props.sync.set(e.target.value)
    }
  }

  render() {
    const { sync, onChange, value, forwardRef, uiContext, className, ...props } = this.props
    const finalProps = {} as InputProps
    if (sync) {
      finalProps.value = sync.get()
      finalProps.onChange = this.syncSet
    }
    return (
      <SizedSurface
        className={`ui-input ${className || ''}`}
        maxWidth="100%"
        alignItems="center"
        flexFlow="row"
        themeSelect="input"
        sizePadding
        sizeHeight
        sizeLineHeight
        sizeRadius={0.75}
        noInnerElement
        glint={false}
        borderWidth={1}
        onKeyDown={this.onKeyDown}
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

export const Input = React.forwardRef(function Input(props: InputProps, ref) {
  const uiContext = React.useContext(UIContext)
  // @ts-ignore
  return <InputPlain uiContext={uiContext} forwardRef={ref} {...props} />
})
