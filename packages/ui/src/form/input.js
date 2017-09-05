// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import inject from '../helpers/inject'
import SizedSurface from '../sizedSurface'
import Button from '../button'
import Checkbox from './checkbox'

type Props = {
  uiContext: Object,
  sync?: Object,
  onEnter?: Function,
  getRef?: Function,
  type?: 'checkbox' | 'submit',
  name?: string,
  form?: Object,
  elementProps?: Object,
  onClick?: Function,
}

@inject(context => ({ uiContext: context.uiContext }))
@view.ui
export default class Input extends React.Component<Props> {
  node: ?HTMLInputElement = null

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

  onNode = (node: ?HTMLInputElement) => {
    this.node = node
    this.props.getRef && this.props.getRef(node)

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

  render() {
    const {
      sync,
      type,
      name,
      uiContext,
      form,
      elementProps,
      ...props
    } = this.props

    if (sync && elementProps) {
      elementProps.value = sync.get()
      elementProps.onChange = e => sync.set(e.target.value)
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
        sizeFont
        borderRadius
        sizeHeight
        sizePadding
        flex
        borderWidth={1}
        wrapElement
        tagName="input"
        name={name}
        type={type}
        elementProps={{
          style: {
            width: '100%',
            padding: '0 10px',
          },
          ref: this.onNode,
          ...elementProps,
        }}
        {...props}
      />
    )
  }
}
