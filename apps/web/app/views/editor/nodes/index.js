import node from '../node'

export image from './image'
export link from './link'
export counter from './counter'
export docLinkList from './docLinkList'
export docVoteList from './docVoteList'
export docList from './docList'
export todo from './todo'
export quote from './quote'
export meta from './meta'
export hashtag from './hashtag'
export title from './title'
export input from './input'
export row from './row'
export column from './column'

export const paragraph = node(props => (
  <p {...props.attributes} $$style={{ fontSize: 18 }}>{props.children}</p>
))

export const ol_list = node(props => (
  <ol $$ol {...props.attributes}>{props.children}</ol>
))

export const ul_list = node(props => (
  <ul $$ul {...props.attributes}>{props.children}</ul>
))

export const list_item = props => (
  <li $$li {...props.attributes}>{props.children}</li>
)

export const hr = props => node(<hr {...props.attributes} />)

export const label = props => (
  <label style={{ fontSize: 13 }} {...props.attributes}>
    {props.children}
  </label>
)
