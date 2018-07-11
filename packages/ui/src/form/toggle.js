import * as React from 'react'
import { view } from '@mcro/black'
import { UIContext } from '../helpers/contexts'

const BAR_HEIGHT = 8
const BAR_WIDTH = 30
const BAR_INVISIBLE_PAD = 5

@view.ui
class TogglePlain extends React.Component {
  static defaultProps = {
    dotSize: 14,
    onChange: _ => _,
    defaultValue: false,
  }

  state = {
    on: false,
  }

  componentDidUpdate(props) {
    this.updateValue(props)
  }

  updateValue(props) {
    const on = props.value || props.defaultValue
    if (on !== this.state.on) {
      this.setState({ on })
    }
  }

  componentDidMount() {
    this.updateValue(this.props)
    this.syncToForm()
  }

  get value() {
    return (this.props.sync && this.props.sync.get()) || this.state.on
  }

  setOn = (on, triggerOnChange) => {
    console.log('toggling', on)
    if (typeof on !== 'undefined') {
      this.setState({ on })
      if (triggerOnChange) {
        this.props.onChange(on)
        if (this.props.sync) {
          this.props.sync.set(on)
        }
      }
    }
  }

  toggleClick = () => {
    this.setOn(!this.value, true)
  }

  get shouldSyncToForm() {
    const { uiContext, sync } = this.props
    return uiContext && uiContext.inForm && !sync
  }

  syncToForm = () => {
    if (this.shouldSyncToForm) {
      this.props.uiContext.formValues[this.props.name] = () => this.state.on
    }
  }

  render() {
    const {
      on: dontUse,
      dotSize,
      defaultValue,
      value,
      onChange,
      color,
      dark,
      barColor,
      sync,
      uiContext,
      form,
      theme,
      placeholderColor,
      borderRadius,
      chromeless,
      ...props
    } = this.props

    let on
    if (sync) {
      on = sync.get()
    } else {
      on = this.state.on
    }

    return (
      <bar onClick={this.toggleClick} {...props}>
        <dot $dotOn={on} />
      </bar>
    )
  }

  static style = {
    bar: {
      width: BAR_WIDTH,
      height: BAR_HEIGHT,
      borderRadius: 10,
      border: [BAR_INVISIBLE_PAD, 'transparent'],
      margin: [-BAR_INVISIBLE_PAD, 0],
      position: 'relative',
    },
    dot: {
      borderRadius: 100,
      background: '#000',
      boxShadow: [0, 0, 10, [0, 0, 0, 0.2]],
      border: [1, [255, 255, 255, 0.1]],
      position: 'absolute',
      top: 0,
      left: 0,
      transform: { x: -BAR_INVISIBLE_PAD },
      transition: 'all ease-in 80ms',
    },
    dotOn: {
      background: '#000',
      transform: {
        x: BAR_WIDTH - 10 - 5,
      },
    },
  }

  static theme = ({ dotSize, color, barColor, theme }) => ({
    bar: {
      background: barColor || theme.hover.background,
    },
    dot: {
      background: color || theme.base.color,
      width: dotSize,
      height: dotSize,
      marginTop: -((dotSize - BAR_HEIGHT) / 2) - BAR_INVISIBLE_PAD + 1,
    },
  })
}

export const Toggle = props => (
  <UIContext.Consumer>
    {uiContext => <TogglePlain uiContext={uiContext} {...props} />}
  </UIContext.Consumer>
)
