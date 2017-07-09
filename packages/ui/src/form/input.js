// @flow
import React from 'react'
import SizedSurface from '../sizedSurface'
import { view, inject } from '@mcro/black'

@inject(context => ({ uiContext: context.uiContext }))
@view.ui
export default class Input {
  node = null

  updateVal = val => {
    this.props.uiContext.formValues[this.props.name] = val || ''
  }

  get shouldSyncToForm() {
    const { uiContext, sync } = this.props
    return uiContext && uiContext.inForm && !sync
  }

  onNode = node => {
    this.node = node
    if (node && node.value) {
      this.updateVal(node.value) // picks up autocomplete
    }
  }

  onChange = (e: Event) => {
    if (this.shouldSyncToForm) {
      this.updateVal(e.target.value)
    }
    this.props.onChange && this.props.onChange(e)
  }

  render({ sync, type, name, uiContext, form, ...props }) {
    if (sync) {
      props.value = sync.get()
      props.onChange = e => sync.set(e.target.value)
    }

    if (type === 'checkbox') {
      return <input type="checkbox" onChange={this.onChange} {...props} />
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
        getRef={this.onNode}
        tagName="input"
        name={name}
        type={type}
        elementProps={{
          onChange: this.onChange,
          css: {
            width: '100%',
            padding: [0, 10],
          },
        }}
        {...props}
      />
    )
  }
}
