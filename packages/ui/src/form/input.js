// @flow
import React from 'react'
import SizedSurface from '../sizedSurface'
import { view, inject } from '@mcro/black'

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
    if (this.shouldSyncToForm) {
      this.props.uiContext.formValues[this.props.name] = () => {
        if (!this.node) {
          debugger
        }
        return this.node.value
      }
    }
  }

  onNode = node => {
    this.node = node
    this.props.getRef && this.props.getRef(node)
  }

  render({ sync, type, name, uiContext, form, elementProps, ...props }) {
    if (sync) {
      props.value = sync.get()
      props.onChange = e => sync.set(e.target.value)
    }

    if (type === 'checkbox') {
      return <input type="checkbox" {...props} />
    }

    return (
      <SizedSurface
        $input
        sizeFont
        sizeRadius
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
