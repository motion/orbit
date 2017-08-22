// @flow
import React from 'react'
import { view } from '@mcro/black'
import { inject } from '@mcro/ui'
import SizedSurface from '../sizedSurface'
import Button from '../button'
import Checkbox from './checkbox'

@inject(context => ({ uiContext: context.uiContext }))
@view.ui
export default class Input {
  node = null

  componentDidMount() {
    this.setValues(this.props)
  }

  componentDidUpdate() {
    this.setValues(this.props)
  }

  get shouldSyncToForm() {
    const { uiContext, sync } = this.props
    return uiContext && uiContext.inForm && !sync
  }

  setValues = () => {
    if (this.shouldSyncToForm && this.node) {
      this.props.uiContext.formValues[this.props.name] = () => this.node.value
    }
  }

  onNode = node => {
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

  render({ sync, type, name, uiContext, form, elementProps, ...props }) {
    if (sync) {
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
          css: {
            width: '100%',
            padding: [0, 10],
          },
          ref: this.onNode,
          ...elementProps,
        }}
        {...props}
      />
    )
  }
}
