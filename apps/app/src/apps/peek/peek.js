// @flow
import * as React from 'react'
import { debounce } from 'lodash'
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Desktop, Electron } from '@mcro/all'
import PeekContent from './peekContent'
import PaulGraham from '~/stores/language/pg.json'
import Search from '@mcro/search'
import PeekHeader from './peekHeader'

const docs = [
  {
    title: 'Graduate Programs in the humanities',
    text: `Graduate programs today, especially in the humanities, are turning out far more Ph.D.s than the academic market can absorb. Now would be a good time to ask ourselves why we organize graduate training the way we do and how we can change it so that we don’t replicate and reinforce the same sort of power structures that so many of us do not hesitate to criticize in our scholarship.`,
  },
  {
    title: 'Understanding Machine Learning',
    text: `The machine learning community has primarily focused on developing powerful methods, such as feature visualization, attribution, and dimensionality reduction, for reasoning about neural networks. However, these techniques have been studied as isolated threads of research, and the corresponding work of reifying them has been neglected. On the other hand, the human-computer interaction community has begun to explore rich user interfaces for neural networks, but they have not yet engaged deeply with these abstractions.`,
  },
  {
    title: 'Basics of Law',
    text: `Law is a system of rules that are created and enforced through social or governmental institutions to regulate behavior. Law is a system that regulates and ensures that individuals or a community adhere to the will of the state. State-enforced laws can be made by a collective legislature or by a single legislator, resulting in statutes, by the executive through decrees and regulations, or established by judges through precedent, normally in common law jurisdictions. Private individuals can create legally binding contracts, including arbitration agreements that may elect to accept alternative arbitration to the normal court process. The formation of laws themselves may be influenced by a constitution, written or tacit, and the rights encoded therein. The law shapes politics, economics, history and society in various ways and serves as a mediator of relations between people.`,
  },
  {
    title: 'Basics of Chemistry and atoms',
    text: `Chemistry is the scientific discipline involved with compounds composed of atoms, i.e. elements, and molecules, i.e. combinations of atoms: their composition, structure, properties, behavior and the changes they undergo during a reaction with other compounds. Chemistry addresses topics such as how atoms and molecules interact via chemical bonds to form new chemical compounds. There are four types of chemical bonds: covalent bonds, in which compounds share one or more electron(s); ionic bonds, in which a compound donates one or more electrons to another compound to produce ions: cations and anions; hydrogen bonds; and Van der Waals force bonds. See glossary of chemistry.`,
  },
]

const keyParam = (window.location.search || '').match(/key=(.*)/)
const KEY = keyParam && keyParam[1]
const SHADOW_PAD = 15
const BORDER_RADIUS = 12
// const BORDER_COLOR = `rgba(255,255,255,0.25)`
const background = 'rgba(0,0,0,0.9)'
const peekShadow = [[0, 3, SHADOW_PAD, [0, 0, 0, 0.05]]]
const log = debug('peek')

@view({
  store: class PeekStore {
    isTorn = false
    isPinned = false
    query = ''
    results = []

    onChangeQuery = e => {
      this.query = e.target.value
    }

    search = debounce(async () => {
      const { results } = await this.searchStore.search.search(this.query)
      this.results = results
    }, 150)

    willMount() {
      this.searchStore = new Search()
      this.searchStore.onDocuments(PaulGraham.slice(0, 30))
      // react to do searches
      this.react(() => this.query, this.search)
      // react to hovered words
      let hoverShow
      this.react(
        () => App.hoveredWordName,
        word => {
          if (Desktop.isHoldingOption) {
            return
          }
          clearTimeout(hoverShow)
          const peekHidden = !word
          hoverShow = setTimeout(() => {
            console.log('sethidden based on word', peekHidden)
            App.setState({ peekHidden })
          }, peekHidden ? 50 : 500)
        },
      )
      // this.react(
      //   () => [Electron.state.peekFocused, Desktop.isHoldingOption],
      //   ([peekFocused, isHoldingOption]) => {
      //     if (!peekFocused && !isHoldingOption) {
      //       log(`hidePeek after let go`)
      //       App.setState({ peekHidden: true })
      //     }
      //   },
      // )
      // react to close peek
      this.react(
        () => Desktop.state.keyboard.esc,
        () => {
          if (!App.state.peekHidden) {
            log(`hidePeek on esc`)
            App.setState({ peekHidden: true })
          }
        },
      )
    }

    @watch
    watchTear = () => {
      if (this.isTorn) return
      const { peekWindow } = Electron
      if (peekWindow && peekWindow.isTorn) {
        console.log('tearing!', peekWindow)
        this.isTorn = true
      }
    }

    closePeek = () => {
      App.setState({ closePeek: KEY })
    }
  },
})
export default class PeekPage {
  render({ store }) {
    const { peekWindow } = Electron
    const arrowTowards = (peekWindow && peekWindow.arrowTowards) || 'right'
    const arrowSize = 28
    let arrowStyle
    let peekStyle
    switch (arrowTowards) {
      case 'right':
        peekStyle = {
          // marginRight: -4,
        }
        arrowStyle = {
          top: 53,
          right: SHADOW_PAD - arrowSize,
        }
        break
      case 'left':
        peekStyle = {
          // marginLeft: -2,
        }
        arrowStyle = {
          top: 53,
          left: -3,
        }
        break
    }
    return (
      <UI.Theme name="dark">
        <peek css={peekStyle} $peekVisible={!App.state.peekHidden}>
          {/* first is arrow (above), second is arrow shadow (below) */}
          {[1, 2].map(key => (
            <UI.Arrow
              if={!store.isTorn}
              key={key}
              size={arrowSize}
              towards={arrowTowards}
              background={background}
              css={{
                position: 'absolute',
                ...arrowStyle,
                ...[
                  {
                    boxShadow: peekShadow,
                    zIndex: -1,
                  },
                  {
                    zIndex: 100,
                  },
                ][key],
              }}
            />
          ))}
          <content>
            <PeekHeader store={store} />
            <contentInner>
              <PeekContent store={store} />
            </contentInner>
          </content>
        </peek>
      </UI.Theme>
    )
  }

  static style = {
    peek: {
      alignSelf: 'flex-end',
      width: '100%',
      height: '100%',
      padding: SHADOW_PAD,
      pointerEvents: 'none !important',
      transition: 'all ease-in 100ms',
      opacity: 0,
      position: 'relative',
    },
    peekVisible: {
      pointerEvents: 'all !important',
      opacity: 1,
      transition: 'all ease-out 100ms',
    },
    peekTorn: {
      pointerEvents: 'all !important',
      opacity: 1,
      transform: {
        y: 0,
      },
    },
    content: {
      flex: 1,
      // border: [1, 'transparent'],
      background,
      borderRadius: BORDER_RADIUS,
      overflow: 'hidden',
      opacity: 1,
      transition: 'background ease-in 200ms',
      // boxShadow: [peekShadow, `0 0 0 0.5px ${BORDER_COLOR}`],
    },
  }
}
