import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import SearchableTable from '@mcro/sonar/_/ui/components/searchable/SearchableTable'
import { hot } from 'react-hot-loader'

console.log('SearchableTable', SearchableTable)

const columnSizes = {
  time: '15%',
  module: '20%',
  name: 'flex',
}

const columns = {
  time: {
    value: 'Column1',
  },
  module: {
    value: 'Column22',
  },
  name: {
    value: 'Column3',
  },
}

const rows = [
  {
    key: 0,
    columns: {
      time: {
        value: 10,
      },
      module: {
        value: 'Ok',
      },
      name: {
        value: 'Hello world',
      },
    },
  },
  {
    key: 1,
    columns: {
      time: {
        value: 10,
      },
      module: {
        value: 'Ok',
      },
      name: {
        value: 'Hello world',
      },
    },
  },
]

export default class Root extends React.Component {
  render() {
    return (
      <root css={{ pointerEvents: 'all' }}>
        <SearchableTable
          rowLineHeight={28}
          floating={false}
          autoHeight
          multiline
          columnSizes={columnSizes}
          columns={columns}
          onRowHighlighted={this.onRowHighlighted}
          multiHighlight
          rows={rows}
          stickyBottom
          actions={<button onClick={this.clear}>Clear Table</button>}
        />
      </root>
    )
  }
}

// export default hot(module)(Root)
