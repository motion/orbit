import { view, observable } from '~/helpers'
import { range, result } from 'lodash'
import ReactGridLayout, { WidthProvider } from 'react-grid-layout'

const Layout = WidthProvider(ReactGridLayout)

@view
export default class Grid {
  static defaultProps = {
    rowHeight: 120,
    layout: [],
    onLayoutChange: () => {},
  }

  @observable.ref layout = []
  gridLayout = null

  componentDidMount() {
    if (this.props.layout) {
      setTimeout(() => {
        this.layout = this.props.layout
        console.log('set')
      }, 150)
    }
  }

  onLayoutChange = layout => {
    this.props.onLayoutChange(layout)
  }

  render({ items, ...props }) {
    console.log('setted')
    return (
      <Layout
        {...props}
        key={Math.random()}
        ref={ref => this.gridLayout = ref}
        onLayoutChange={this.onLayoutChange}
        layout={this.layout}
      >
        {items.map((item, i) => <gridItem key={i}>{item}</gridItem>)}
      </Layout>
    )
  }

  static style = {
    gridItem: {
      position: 'relative',
    },
  }
}
