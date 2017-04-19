import App, { Place, Doc } from 'models'
import { view } from 'helpers'
import Router from 'router'
import { Page } from 'views'

@view
export default class Docs {
  render({ docs }) {
    const { onSelect, onDestroy } = this.props
    console.log('docs are', docs)

    return (
      <docs>
        {docs.map(doc => (
          <doc onClick={() => onSelect(doc)} key={doc._id}>
            <title>{doc.title}</title>
            <author>by {doc.author_id}</author>
          </doc>
        ))}
      </docs>
    )
  }

  static style = {
    docs: {
      flexFlow: 'row',
      flexWrap: 'wrap',
    },
    doc: {
      transition: [
        `transform .2s cubic-bezier(.55,0,.1,1)`,
        `box-shadow .2s cubic-bezier(.55,0,.1,1)`,
      ].join(', '),
      borderRadius: 6,
      border: `1px solid rgba(0,0,0,.1)`,
      boxShadow: `0 10px 20px rgba(0,0,0,.05)`,
      padding: 20,
      margin: 15,
      color: '#333',
      '&:hover': {
        boxShadow: `0 10px 30px rgba(0,0,0,.08)`,
        transform: `translateY(-10px)`,
      },
    },
    author: {
      alignSelf: 'right',
      width: '100%',
    },
    title: {
      fontSize: 16,
    },
  }
}
