import Mousetrap from 'mousetrap'
import { OS } from '~/helpers'
import Context from '~/context'
import StackStore from '../home/stackStore'
import { summarize, summarizeWithQuestion } from './summarize'
import keycode from 'keycode'

export const SHORTCUTS = {
  left: 'left',
  right: 'right',
  down: 'down',
  up: 'up',
  j: 'j', // down
  k: 'k', // up
  d: 'd', // doc
  enter: 'enter',
  esc: 'esc',
  explorer: ['command+t'],
  cmdA: 'command+a',
  cmdL: 'command+l',
  cmdEnter: 'command+enter',
  cmdUp: 'command+up',
  cmdR: 'command+r',
  delete: ['delete', 'backspace'],
  togglePane: 'shift+tab',
  fullscreen: ['command+b', 'command+\\'],
}

const debounce = (fn, timeout) => {
  let clearId = null
  return (...args) => {
    if (clearId) cancelIdleCallback(clearId)

    clearId = requestIdleCallback(() => fn(...args), { timeout })
  }
}

export default class OraStore {
  stack = new StackStore([{ type: 'oramain' }])
  inputRef = null
  context = null
  search = ''
  textboxVal = ''
  traps = {}
  lastKey = null
  hidden = false
  focused = false
  activeThing = null

  osContext = null

  async willMount() {
    window.homeStore = this
    this.attachTrap('window', window)
    this._watchFocusBar()
    this._watchInput()
    this._watchToggleHide()
    this._watchMouse()

    this.watch(() => {
      if (this.hidden) {
        // timeout based on animation
        this.setTimeout(this.blurBar, 100)
      }
    })

    await this.fetchData()
  }

  addToCorpus = text => {
    this.corpus = [...this.corpus, { title: text }]
    localStorage.setItem('corpus', JSON.stringify(this.corpus))
  }

  addCurrentPage = async () => {
    const token = `e441c83aed447774532894d25d97c528`
    const { url } = this.osContext
    const toFetch = `https://api.diffbot.com/v3/article?token=${token}&url=${url}`
    console.log('to fetch is', toFetch)
    const res = await (await fetch(toFetch)).json()
    const { text, title } = res.objects[0]
    this.addToCorpus(title + '\n' + text)
  }

  fetchData = async () => {
    const corpus = JSON.parse(localStorage.getItem('corpus') || '[]')

    this.context = new Context(corpus)
    this.corpus = corpus

    OS.on('set-context', (event, info) => {
      const json = JSON.parse(info)
      if (!json) {
        this.osContext = null
        if (this.stack.last.result.type === 'context') {
          this.stack.pop()
        }
        return
      }
      // check to avoid rerendering
      if (!this.osContext || this.osContext.title !== json.title) {
        console.log('got context', json)
        const nextStackItem = { type: 'context', title: json.title }
        if (this.stack.length > 1) {
          this.stack.replace(nextStackItem)
        } else {
          this.stack.navigate(nextStackItem)
        }
        this.osContext = json
      }
    })
    this.getOSContext()
  }

  _watchMouse() {
    OS.send('mouse-listen')
    OS.on('mouse-in-corner', () => {
      if (this.hidden) {
        this.hidden = false
        this.setTimeout(this.focusBar)
      }
    })
  }

  _watchToggleHide() {
    OS.send('start-ora')

    OS.on('show-ora', () => {
      this.hidden = !this.hidden

      if (!this.hidden) {
        this.setTimeout(this.focusBar)
      }
    })
  }

  hide = () => {
    this.hidden = true
  }

  getOSContext = () => {
    OS.send('get-context')
    this.setTimeout(this.getOSContext, 500)
  }

  get contextResults() {
    const title = this.osContext ? this.osContext.title : ''
    const addBold = line => {
      const r = new RegExp('(' + this.search.split(' ').join('|') + ')', 'ig')
      return line.replace(
        r,
        '<b style="font-weight: 400; color: #aed6ff;">$1</b>'
      )
    }

    return !this.context || this.context.loading // || this.osContext === null
      ? []
      : this.context
          .closestItems(this.search.length > 0 ? this.search : title, 5)
          .map(({ item }) => {
            const { title, lines } =
              this.search.length === 0
                ? summarize(item.title)
                : summarizeWithQuestion(item.title, this.search)

            return {
              category: 'Context',
              height: 200,
              children: (
                <paras style={{ width: '100%' }}>
                  <p css={{ opacity: 1, fontSize: 13 }}>{title}</p>
                  {lines.map(line => (
                    <p
                      css={{
                        marginTop: 4,
                        opacity: 0.8,
                        fontSize: 13,
                      }}
                      dangerouslySetInnerHTML={{ __html: addBold(line) }}
                    />
                  ))}
                </paras>
              ),
            }
          })
  }

  _watchInput() {
    let lastChar = null
    this.watch(() => {
      const char = this.search[this.search.length - 1]
      if (lastChar && this.search.length === 0) {
        this.emit('clearSearch')
      }
      if (!lastChar && this.search.length) {
        this.emit('startSearch')
      }
      lastChar = char
    })
  }

  _watchFocusBar() {
    let lastCol = null
    this.watch(() => {
      const { col } = this.stack
      if (col === 0 && lastCol !== 0) {
        this.focusBar()
      }
      if (col !== 0 && lastCol === 0) {
        this.blurBar()
      }
      lastCol = col
    })
  }

  onInputRef = el => {
    if (!el) {
      return
    }
    this.inputRef = el
    this.attachTrap('bar', el)
    this._watchKeyEvents()
  }

  _watchKeyEvents() {
    this.on(this.inputRef, 'keydown', e => {
      const key = (this.lastKey = keycode(e.keyCode))
      if (key === 'up' || key === 'down' || key === 'left' || key === 'right') {
        return
      }
      this.shouldFocus = true
      this.setTimeout(() => {
        if (this.shouldFocus) {
          this.stack.focus(0)
          this.shouldFocus = false
        }
      }, 150)
    })
  }

  focusBar = () => {
    if (this.inputRef) {
      this.inputRef.focus()
      this.inputRef.select()
      this.focused = true
    }
  }

  blurBar = () => {
    this.inputRef && this.inputRef.blur()
    this.focused = false
  }

  onSearchChange = e => {
    this.setTextboxVal(e.target.value)
  }

  setTextboxVal = value => {
    this.textboxVal = value
    this.setSearch(value)
  }

  setSearchImmediate = text => {
    this.search = text
    if (this.shouldFocus) {
      this.stack.focus(0)
      this.shouldFocus = false
    }
  }

  setSearch = debounce(this.setSearchImmediate, 20)

  attachTrap(attachName, el) {
    this.traps[attachName] = new Mousetrap(el)
    for (const name of Object.keys(SHORTCUTS)) {
      const chord = SHORTCUTS[name]
      this.traps[attachName].bind(chord, event => {
        this.emit('shortcut', name)
        if (this.actions[name]) {
          this.actions[name](event)
        }
      })
    }
  }

  actions = {
    down: e => {
      if (this.stack.col === 0) {
        e.preventDefault()
      }
      this.stack.down()
    },
    up: e => {
      if (this.stack.col === 0) {
        e.preventDefault()
      }
      this.stack.up()
    },
    esc: e => {
      if (this.inputRef === document.activeElement) {
        if (this.textboxVal !== '') {
          this.setTextboxVal('')
        }
        this.inputRef.blur()
        return
      }
      if (this.search === '') {
        e.preventDefault()
        this.hide()
      }
    },
    cmdA: () => {
      this.inputRef.select()
    },
    enter: e => {
      e.preventDefault()
      if (this.stack.selected && this.stack.selected.static) {
        console.log('static item, no action')
        return
      }
      if (this.stack.selected.onSelect) {
        this.stack.selected.onSelect()
      } else {
        // const schema = JSON.stringify(this.stack.selected)
        // OS.send('bar-goto', `http://jot.dev/master?schema=${schema}`)
      }
    },
    cmdL: () => {
      this.focusBar()
    },
    delete: () => {
      if (this.textboxVal === '') {
        this.stack.left()
      }
    },
    right: e => {
      e.preventDefault()
      this.stack.right()
    },
    left: e => {
      e.preventDefault()
      this.stack.left()
    },
  }
}
