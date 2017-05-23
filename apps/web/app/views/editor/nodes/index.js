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

export const paragraph = props => <p $$fontSize={18}>{props.children}</p>

// ul_list and list_item are names decided by
// https://github.com/GitbookIO/slate-edit-list

export const ol_list = props => (
  <ol $$ol {...props.attributes}>{props.children}</ol>
)

export const ul_list = props => (
  <ul $$ul {...props.attributes}>{props.children}</ul>
)

export const list_item = props => (
  <li $$li {...props.attributes}>{props.children}</li>
)

export const hr = props => <hr />

export const label = props => (
  <label style={{ fontSize: 13 }} {...props.attributes}>
    {props.children}
  </label>
)
