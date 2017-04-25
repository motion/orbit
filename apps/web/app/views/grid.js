import { view, observable } from '~/helpers'
import { range, result } from 'lodash'
import ReactGridLayout, { WidthProvider } from 'react-grid-layout'

const Layout = WidthProvider(ReactGridLayout)

@view
export default class Grid {
  static defaultProps = {
    rowHeight: 120,
    layout: [],
    onLayoutChange: _ => _,
  }

  @observable.ref layout = null
  gridLayout = null

  componentDidMount() {
    if (this.props.layout) {
      setTimeout(() => {
        this.layout = this.props.layout
      }, 150)
    }
  }

  render({ items, ...props }) {
    console.log('setted')
    return (
      <Layout
        if={this.layout}
        {...props}
        key={Math.random()}
        ref={ref => this.gridLayout = ref}
        onLayoutChange={this.props.onLayoutChange}
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
