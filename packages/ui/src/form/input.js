import * as React from 'react'
import { view } from '@mcro/black'
import { SizedSurface } from '../sizedSurface'
import { Button } from '../button'
import { Checkbox } from './checkbox'
import { UIContext } from '../contexts'

// type Props = {
//   uiContext: Object,
//   sync?: Object,
//   onEnter?: Function,
//   type?: 'input' | 'checkbox' | 'submit' | 'textarea' | 'password',
//   name?: string,
//   form?: Object,
//   elementProps?: Object,
//   onClick?: Function,
// }

@view.ui
class InputPlain extends React.PureComponent {
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

  render({
    sync,
    type,
    name,
    uiContext,
    form,
    elementProps,
    style,
    onEnter,
    onChange,
    size,
    value,
    forwardRef,
    ...props
  }) {
    const finalProps = { ...elementProps }
    if (sync && elementProps) {
      finalProps.value = sync.get()
      finalProps.onChange = this.syncSet
    }
    if (type === 'checkbox') {
      return <Checkbox {...props} />
    }
    if (type === 'submit') {
      return (
        <Button type="submit" noElement {...props} onClick={this.onClick} />
      )
    }
    return (
      <SizedSurface
        size={size}
        sizeFont
        sizePadding
        sizeHeight
        sizeLineHeight
        borderWidth={1}
        wrapElement
        tagName="input"
        className="input"
        name={name}
        type={type}
        elementProps={{
          value,
          onChange,
          style: {
            width: '100%',
            pointerEvents: 'auto',
            padding: `0 ${10 * size}px`,
            ...style,
          },
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
