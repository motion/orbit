import { view } from '@mcro/black'
import * as React from 'react'
import { BitSlackMessage } from './slackMessage'
import * as UI from '@mcro/ui'
import { RoundButton } from '~/views/roundButton'
import keywordExtract from 'keyword-extractor'
import arrford from 'arrford'

const options = {
  language: 'english',
  remove_digits: true,
  return_changed_case: true,
  remove_duplicates: false,
}

// const isntAttachment = x => !x.text || !x.text.match(/\<([a-z]+:\/\/[^>]+)\>/g)
const exampleContent = [
  {
    title: 'Steel, Jacob, Nick & 3 more',
    preview: 'a16z venture Formidable coffee',
  },
  {
    title: 'Nate and Nick',
    preview: 'cosal sketchy hardcode spectrum fit scaling overkill',
  },
  {
    title: 'Kevin, Mehak & 4 more',
    preview: 'ml nlp formidable client',
  },
  {
    title: 'Julie and Cam',
    preview: '10% 60-80k rallyinteractive.com re-sign loan',
  },
  {
    title: 'James, Jungwon and Evan',
    preview: 'jitter searches peek design',
  },
  {
    title: 'Stephanie, Drew & 10 more',
    preview: 'broke docked arrows aligning',
  },
  {
    title: 'Ben',
    preview: 'related conversations glitches',
  },
]
const uids = {}
let curId = 0

@view
export class BitSlackConversation extends React.Component {
  static defaultProps = {
    shownLimit: 5,
  }

  render({ children, bit, appStore, shownLimit, contentStyle }) {
    const uid = uids[bit.id] || curId++ % (exampleContent.length - 1)
    uids[bit.id] = uid
    const content = (bit.data.messages || [])
      .slice(0, shownLimit)
      .map((message, index) => (
        <BitSlackMessage
          key={index}
          message={message}
          previousMessage={bit.data.messages[index - 1]}
          bit={bit}
          appStore={appStore}
          contentStyle={contentStyle}
        />
      ))
    return children({
      title: keywordExtract
        .extract(bit.body, options)
        .slice(0, 4)
        .join(' '),
      preview: <preview css={{ margin: [3, 0, 5] }}>{content}</preview>,
      icon: 'slack',
      location: (
        <RoundButton
          style={{ marginLeft: -3 }}
          onClick={e => {
            e.stopPropagation()
            appStore.open(bit, 'channel')
          }}
        >
          {bit.title.slice(1)}
        </RoundButton>
      ),
      permalink: (
        <UI.Button
          circular
          icon="link69"
          size={0.8}
          alpha={0.6}
          onClick={e => {
            e.stopPropagation()
            appStore.open(bit)
          }}
        />
      ),
      bottom: (
        <UI.Text size={0.85} if={bit.data.messages.length > 3}>
          + {bit.data.messages.length - 3}&nbsp;more&nbsp;
        </UI.Text>
      ),
      bottomAfter: (
        <row if={bit.people && bit.people.length > 1} $meta>
          {bit.people.length}
          &nbsp;
          <UI.Icon
            color="inherit"
            size={10}
            opacity={0.35}
            name="users_single-01"
          />
        </row>
      ),
      content,
    })
  }

  static style = {
    meta: {
      flexFlow: 'row',
      alignItems: 'center',
      opacity: 0.5,
    },
    space: {
      width: 6,
    },
  }
}
