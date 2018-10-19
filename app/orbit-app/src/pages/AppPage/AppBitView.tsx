import * as React from 'react'
import { ItemResolverDecorationContext } from '../../helpers/contexts/ItemResolverDecorationContext'

export class AppBitView extends React.Component {
  render() {
    return (
      <ItemResolverDecorationContext.Provider
        value={{
          text: null,
          item: {
            padding: [1, 6],
            '&:hover': {
              background: [0, 0, 0, 0.02],
            },
          },
        }}
      >
        {this.props.children}
      </ItemResolverDecorationContext.Provider>
    )
  }
}
