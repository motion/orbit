import { view } from '@mcro/black'
import { range } from 'lodash'

@view.ui
export default class FakeText {
  static defaultProps = {
    minWidth: 40,
    maxWidth: 100,
    lineHeight: 16,
  }

  lines = []

  getLineWidth = key => {
    if (this.lines[key]) return this.lines[key]
    const { minWidth, maxWidth } = this.props
    this.lines[key] = ((Math.random() * (maxWidth - minWidth) + minWidth) ^
      0).toString()
    return this.lines[key]
  }

  render() {
    const { lines, fontSize, lineHeight, ...props } = this.props

    return (
      <root {...props}>
        {range(lines).map(i =>
          <fakeline
            key={i}
            style={{
              marginBottom: lineHeight,
              height: fontSize,
              width: `${this.getLineWidth(i)}%`,
            }}
          />
        )}
      </root>
    )
  }
  static style = {
    root: {
      flex: 1,
      flexFlow: 'row',
    },
    fakeline: {
      backgroundColor: 'rgba(200, 200, 200, 0.15)',
    },
  }
}
