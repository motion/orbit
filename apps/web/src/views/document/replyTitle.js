// import Gemstone from '~/views/kit/gemstone'
import timeAgo from 'time-ago'
import * as UI from '@mcro/ui'
const { ago } = timeAgo()

export default ({ author, date, staticDate, doc, ...props }) =>
  <title $$row css={props}>
    <UI.Title size={0.9} color="#000" marginRight={10}>
      {author || doc.authorId}
    </UI.Title>
    <UI.Title size={0.9} color="#000" opacity={0.2}>
      {staticDate || ago(date || doc.updatedAt)}
    </UI.Title>
  </title>
