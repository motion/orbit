import { view, node } from '~/helpers'

@node
@view
export default class HashTag {
  render(props) {
    return <hashtag {...props.attributes}>{props.children}</hashtag>
  }

  static style = {
    hashtag: {
      fontSize: 32,
      color: 'red',
      fontWeight: 300,
    },
  }
}
