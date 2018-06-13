import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import SearchableTable from '@mcro/sonar/_/ui/components/searchable/SearchableTable'

console.log('Table', Table)

export class Root extends React.Component {
  render() {
    return (
      <root>
        <SearchableTable
          key={props.id}
          rowLineHeight={28}
          floating={false}
          multiline={true}
          columnSizes={columnSizes}
          columns={columns}
          onRowHighlighted={this.onRowHighlighted}
          multiHighlight={true}
          rows={rows}
          stickyBottom={true}
          actions={<Button onClick={this.clear}>Clear Table</Button>}
        />
      </root>
    )
  }
}
