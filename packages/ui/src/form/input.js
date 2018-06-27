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
//   getRef?: Function,
//   type?: 'input' | 'checkbox' | 'submit' | 'textarea' | 'password',
//   name?: string,
//   form?: Object,
//   elementProps?: Object,
//   onClick?: Function,
// }

const TAG_MAP = {
  password: 'input',
}

@view.ui
class InputPlain extends React.PureComponent {
  static defaultProps = {
    size: 1,
    type: 'input',
    elementProps: {},
  }

  node = null

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

  setValues = () => {
    if (this.shouldSyncToForm && this.node) {
      this.props.uiContext.formValues[this.props.name] = () =>
        this.node && this.node.value
    }
  }

  onNode = node => {
    this.node = node
    if (this.props.getRef) {
      this.props.getRef(node)
    }

    if (node) {
      this.on(node, 'keydown', e => {
        const isEnter = e.keyCode === 13
        if (isEnter) {
          if (this.props.onEnter) {
            if (isEnter) {
              this.props.onEnter(e)
            }
          }
        }
      })
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
        tagName={TAG_MAP[type] || type}
        className="input"
        tagName="input"
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
          ref: this.onNode,
          ...finalProps,
        }}
        {...props}
      />
    )
  }
}

export const Input = props => (
  <UIContext.Consumer>
    {uiContext => <InputPlain uiContext={uiContext} {...props} />}
  </UIContext.Consumer>
)
