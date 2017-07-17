// @flow
import React from 'react'
import SizedSurface from '../sizedSurface'
import { view, inject, observable } from '@mcro/black'
import Icon from '../icon'

@view
class Checkbox {
  @observable isChecked = this.props.defaultValue || false

  onChange = (e: Event) => {
    this.isChecked = e.target.checked
    return this.isChecked
  }

  render({ onChange, ...props }) {
    const { isChecked } = this
    return (
      <SizedSurface
        margin={[0, 3]}
        background={isChecked ? 'rgb(92, 107, 123)' : '#f2f2f2'}
        color={isChecked ? '#fff' : '#ddd'}
        hoverColor={isChecked ? '#fff' : '#ddd'}
        borderRadius={6}
        icon="check-simple"
        iconSize={12}
        glow={false}
        padding={2}
        height={17}
        alignItems="center"
        justifyContent="center"
        flex={false}
        iconProps={{
          css: {
            transform: {
              y: 1,
              scale: isChecked ? 1 : 1,
            },
          },
        }}
        {...props}
      >
        <input type="checkbox" onChange={this.onChange} />
      </SizedSurface>
    )
  }

  static style = {
    input: {
      position: 'absolute',
      opacity: 0.0001,
      transform: {
        scale: 2,
        x: '-33%',
        y: '-60%',
      },
    },
  }
}

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
      this.props.uiContext.formValues[this.props.name] = () => this.node.value
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
      return <Checkbox type="checkbox" {...props} />
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
