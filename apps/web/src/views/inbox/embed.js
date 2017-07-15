import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import { random, sample } from 'lodash'
import DocumentView from '~/views/document'
import { Thread, Document } from '@mcro/models'
import ThreadView from './thread'
import Message from './message'
import gradients from '~/helpers/gradients'

class EmbedStore {}

@view.attach('explorerStore')
@view({
  store: EmbedStore,
})
export default class Embed {
  render({ store, title }) {
    const isHiring = title === 'Hiring'
    const gradient = sample(gradients)
    // const color = `rgba(255,99,153,1)`
    let color2 = `rgba(240,129,125, 1)`
    // const color2 = `rgba(249,129,240,1)`
    let color = `rgba(251,222,136,.8)`
    let author = 'Steel Brain'
    let when = 'two days ago'
    let bold = 'Version 1.2.4: Raging Eagle'
    let content = (
      <span>
        Yesterday we shipped a new fraud launch, using TSNE to segment users and
        capture those who are selling adwords to get free gym memberships using
        referrals. <br />
        You can see the update in the fraud panel on all platforms.
      </span>
    )

    if (isHiring) {
      color2 = 'rgba(120,178,249,1)'
      color = `rgba(197,225,250,1)`
      author = 'Nick Cammarata'
      when = 'one week ago'
      bold = 'John Marbach'
      content = (
        <span>
          sent out initial email, he'll be flying out on July and he should meet
          with Nate while he's here.
        </span>
      )
    }
    const background = `linear-gradient(-150deg, ${color}, ${color2})`

    return (
      <outside>
        <top $$row>
          <front $$row>
            <inboxName>
              {title}
            </inboxName>
            <UI.Button
              $button
              color="rgba(0,0,0,.6)"
              size={0.9}
              iconAfter
              icon="arrow-right"
            />
          </front>
          <end $$row>
            <UI.Button $button color="rgba(0,0,0,.6)" size={0.9} icon="check">
              following
            </UI.Button>
          </end>
        </top>
        <card style={{ background }}>
          <message>
            <info $$row>
              <left $$row>
                <b style={{ opacity: 0.8 }}>
                  {bold}
                </b>
                <time>
                  {when}
                </time>
              </left>
              <bottom $$row>
                <div size={1.2} $author $$row>
                  <avatar />
                  <name>
                    {author}
                  </name>
                </div>
              </bottom>
            </info>
            <content>
              <span style={{ lineHeight: 1.3 }} $$row>
                <space />
                {content}
                <UI.Button
                  style={{ display: 'inline', marginLeft: 5 }}
                  chromeless
                >
                  (more)
                </UI.Button>
              </span>
            </content>
            <after>
              <UI.Button chromeless icon="message">
                {random(2, 5)} replies
              </UI.Button>
            </after>
          </message>
        </card>
      </outside>
    )
  }

  static style = {
    outside: {
      width: '85%',
      alignSelf: 'center',
      marginTop: 15,
    },
    card: {
      borderRadius: 4,
      padding: [2],
      margin: -10,
      marginTop: 5,
      marginBottom: 15,
      boxShadow: '2px 3px 16px #eee',
    },
    after: {
      alignItems: 'flex-start',
    },
    inboxName: {
      color: 'rgba(0,0,0,.8)',
      fontSize: 14,
      fontWeight: 600,
    },
    info: {
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    time: {
      marginLeft: 5,
      opacity: 0.7,
    },
    message: {
      padding: [10, 18],
      //border: '1px solid #efefef',
      background: 'rgba(255,255,255,0.8)',
    },
    content: {
      alignItems: 'center',
    },
    author: {
      alignItems: 'center',
    },
    name: {
      marginLeft: 7,
    },
    avatar: {
      background: 'yellow',
      display: 'none',
      opacity: 0.8,
      border: '1px solid #ccc',
      width: 16,
      height: 16,
      borderRadius: 20,
    },
    space: {
      height: 8,
    },
    following: {
      background: 'rgba(0,0,0,.2)',
    },
    top: {
      justifyContent: 'space-between',
    },
    end: {
      alignItems: 'center',
    },
    front: {
      alignItems: 'center',
    },
    button: {
      marginLeft: 10,
    },
  }
}
