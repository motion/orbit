import { view, node } from '~/helpers'
import DocList from './docList'

@node
@view
export default class HashTag {
  render(props) {
    return (
      <root>
        <hashtag contentEditable {...props.attributes}>
          {props.children}
        </hashtag>
        <DocList {...props} />
      </root>
    )
  }

  static style = {
    hashtag: {
      fontSize: 32,
      color: 'red',
      fontWeight: 300,
    },
    card: {
      width: 160,
      height: 200,
      background: '#fafafa',
    },
  }
}
