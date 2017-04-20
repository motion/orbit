import { view, observable } from 'helpers'
import { range, result } from 'lodash'
import ReactGridLayout, { WidthProvider } from 'react-grid-layout'

const Layout = WidthProvider(ReactGridLayout)

@view
export default class Grid {
  static defaultProps = {
    rowHeight: 120,
    cols: 2,
    onLayoutChange: () => {},
  }

  @observable.ref layout = null

  componentWillMount() {
    this.layout = this.generateLayout()
  }

  generateLayout = () => {
    const { items } = this.props
    return items.map((_, i) => {
      const y = result(this.props, 'y') || Math.ceil(Math.random() * 4) + 1
      return {
        x: i * 2 % 12,
        y: Math.floor(i / 6) * y,
        w: 2,
        h: y,
        i: `${i}`,
      }
    })
  }

  onLayoutChange = layout => this.props.onLayoutChange(layout)

  render({ items, ...props }) {
    return (
      <Layout
        layout={this.layout}
        onLayoutChange={this.onLayoutChange}
        {...props}
      >
        {items.map((item, i) => <div key={i}>{item}</div>)}
      </Layout>
    )
  }
}
