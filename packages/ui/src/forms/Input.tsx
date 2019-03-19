import * as React from 'react'
import { UIContext, UIContextType } from '../helpers/contexts'
import { SizedSurface, SizedSurfaceProps } from '../SizedSurface'
import { GetSurfaceTheme } from '../Surface'
import { DataType } from '../types'

export type InputProps = React.HTMLAttributes<HTMLInputElement> &
  SizedSurfaceProps & {
    value?: string
    sync?: { get: () => any; set: (a: any) => void }
    onEnter?: Function
    type?: 'input' | 'checkbox' | 'submit' | 'textarea' | 'password' | 'email' | DataType
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
      <SimpleInput
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

function SimpleInput(props: SizedSurfaceProps) {
  return (
    <SizedSurface
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
      {...props}
      className={`ui-input ${props.className || ''}`}
      getTheme={inputSurfaceTheme}
    />
  )
}

const inputSurfaceTheme: GetSurfaceTheme = (props, theme) => ({
  ...(!props.chromeless && {
    border: [1, theme.borderColor.desaturate(0.1)],
    '&:focus-within': {
      boxShadow: [[0, 0, 0, 2, theme.borderColor.alpha(a => a * 0.5)]],
    },
  }),
  '&::selection': {
    color: theme.color.lighten(0.1),
    background: theme.backgroundSelection || theme.background.darken(0.2),
  },
})

export const Input = React.forwardRef(function Input(props: InputProps, ref) {
  const uiContext = React.useContext(UIContext)
  return <InputPlain uiContext={uiContext} forwardRef={ref} {...props} />
})
