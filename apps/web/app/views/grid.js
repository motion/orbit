import { view, observable } from '~/helpers'
import { range, result } from 'lodash'
import ReactGridLayout, { WidthProvider } from 'react-grid-layout'

const Layout: HTMLElement = WidthProvider(ReactGridLayout)

@view
export default class Grid {
  static defaultProps = {
    rowHeight: 40,
    layout: [],
    onLayoutChange: _ => _,
  }

  @observable.ref layout = null
  gridLayout = null

  componentDidMount() {
    if (this.props.layout) {
      this.setTimeout(() => {
        this.layout = this.props.layout
      }, 150)
    }
  }

  onDragStart = (e: Event) => {
    e.preventDefault()
    console.log('start')
  }

  render({ items, ...props }) {
    return (
      <Layout
        if={this.layout}
        {...props}
        ref={ref => (this.gridLayout = ref)}
        onLayoutChange={this.props.onLayoutChange}
        layout={this.layout}
      >
        {items.map((item, i) => (
          <gridItem onDragStart={this.onDragStart} key={item._id || item.key}>
            {item}
          </gridItem>
        ))}
      </Layout>
    )
  }

  static style = {
    gridItem: {
      position: 'relative',
    },
  }
}
