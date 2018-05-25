import * as React from 'react'
import { view } from '@mcro/black'
import * as Constants from '~/constants'
import * as UI from '@mcro/ui'

export const dockIcons = [
  {
    name: 'Dropbox',
    size: 0.13,
    countProps: { start: 0, end: 22, duration: 15 },
  },
  {
    name: 'Drive',
    size: 0.16,
    countProps: { start: 0, end: 36, duration: 15 },
  },
  {
    name: 'Slack',
    size: 0.18,
    countProps: { start: 0, end: 122, duration: 15 },
  },
  {
    name: 'Mail',
    size: 0.16,
    countProps: { start: 0, end: 195, duration: 15 },
  },
  {
    name: 'Github',
    size: 0.13,
    countProps: { start: 0, end: 27, duration: 15 },
  },
]

const Bubble = view(
  'div',
  {
    color: '#fff',
    background: Constants.colorMain.darken(0.2).desaturate(0.2),
    fontSize: 18,
    borderRadius: 15,
    padding: [10, 12],
    marginBottom: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 0,
    alignSelf: 'flex-start',
    pointerEvents: 'all',
  },
  {
    two: {
      background: Constants.colorMain.darken(0.3).desaturate(0.3),
      color: '#fff',
      alignSelf: 'flex-end',
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 0,
    },
    three: {
      background: UI.color('#869A4A')
        .darken(0.2)
        .desaturate(0.2),
      color: '#fff',
      alignSelf: 'flex-end',
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 0,
    },
    four: {
      background: UI.color('#7ABEA2')
        .darken(0.2)
        .desaturate(0.2),
      color: '#fff',
      alignSelf: 'flex-end',
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 0,
    },
  },
)

export const chats = [
  <Bubble>The #dev chat room</Bubble>,
  <Bubble three>clear as modern art</Bubble>,
  <Bubble two>🙄</Bubble>,
  <Bubble four>and growing every day</Bubble>,
  <Bubble two>Would be nice if I could focus</Bubble>,
  <Bubble two>👆</Bubble>,
  <Bubble>we should get something to sort it all out</Bubble>,
  <Bubble two>you're just not using it right</Bubble>,
  <Bubble>maybe some sort of summary</Bubble>,
  <Bubble two>chat is just the start of it, really</Bubble>,
  <Bubble two>what about email?</Bubble>,
  <Bubble four>
    email, tickets, the wiki, all the different rooms here...
  </Bubble>,
]

export const messages = (
  <>
    <Bubble>this shows good potential</Bubble>
    <Bubble two>the icon isn’t good that you have now</Bubble>
    <Bubble two>
      and i think with some tweaking this could work as a logo concept -
      animation proves some extensibility too
    </Bubble>
    <Bubble three>
      yeah, new idea is really close though to being what I think you would need
      to start shopping the concept around
    </Bubble>
    <Bubble four>we actually have this indicator</Bubble>
    <Bubble two>
      that is prototype stage but meant to signify you have something relevant
    </Bubble>
    <Bubble>
      signifies that its a small thing that sort of hangs around with you
    </Bubble>
    <Bubble two>the little line is nice actually</Bubble>
    <Bubble four>makes the logo 10x more identifiable</Bubble>
    <Bubble two>with some tweak maybe</Bubble>
    <Bubble>Lorem maybe rounded to the O</Bubble>
    <Bubble two>
      I think screens will really help. Going to try and add by tn
    </Bubble>
    <Bubble four>
      but thinking about … that idea …. of, the answer to the ‘so what…’
    </Bubble>
    <Bubble two>
      “The one dashboard that Sauron would’ve made if he was a good guy.”
    </Bubble>
    <Bubble two>I need to get the screenshots in there</Bubble>
    <Bubble three>
      maybe oil slick concept goes more like this for that first problem
      statement part
    </Bubble>
    <Bubble four>
      also think that “unifying force for your team” may be too long
    </Bubble>
    <Bubble three>
      may want to do some simple moire or comic dot-grid effects that sort of
      procedurally space-fill the empty areas with black/white checkers/dots
    </Bubble>
    <Bubble two>
      using ben-day dot pattern for the transition between the different
      sections could be a cool way to carry motif through it as well
    </Bubble>
    <Bubble four>
      mockups for graphite drawings I’m having produced in China
    </Bubble>
    <Bubble four>
      that is prototype stage but meant to signify you have something relevant
    </Bubble>
    <Bubble>
      signifies that its a small thing that sort of hangs around with you
    </Bubble>
    <Bubble two>the little line is nice actually</Bubble>
    <Bubble four>makes the logo 10x more identifiable</Bubble>
    <Bubble two>with some tweak maybe</Bubble>
    <Bubble>Lorem maybe rounded to the O</Bubble>
    <Bubble two>
      I think screens will really help. Going to try and add by tn
    </Bubble>
    <Bubble four>
      but thinking about … that idea …. of, the answer to the ‘so what…’
    </Bubble>
    <Bubble two>
      “The one dashboard that Sauron would’ve made if he was a good guy.”
    </Bubble>
    <Bubble two>I need to get the screenshots in there</Bubble>
    <Bubble three>
      maybe oil slick concept goes more like this for that first problem
      statement part
    </Bubble>
    <Bubble four>
      also think that “unifying force for your team” may be too long
    </Bubble>
    <Bubble three>
      may want to do some simple moire or comic dot-grid effects that sort of
      procedurally space-fill the empty areas with black/white checkers/dots
    </Bubble>
  </>
)
