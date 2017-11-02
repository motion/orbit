import { Thing } from '~/app'
import { watch } from '@mcro/black'
import Mousetrap from 'mousetrap'
import { OS, debounceIdle } from '~/helpers'
import StackStore from '~/stores/stackStore'
import keycode from 'keycode'
import ContextStore from '~/stores/contextStore'
import SHORTCUTS from './shortcuts'

export default class OraStore {
  stack = new StackStore([{ type: 'oramain' }])
  inputRef = null
  osContext = null
  search = ''
  textboxVal = ''
  traps = {}
  lastKey = null
  hidden = false
  focused = false

  @watch items = () => Thing.find()
  @watch context = () => this.items && new ContextStore(this.items)

  async willMount() {
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
    await this.listenForContext()
  }

  addCurrentPage = async () => {
    if (!this.osContext) {
      return
    }
    const token = `e441c83aed447774532894d25d97c528`
    const { url } = this.osContext
    const toFetch = `https://api.diffbot.com/v3/article?token=${token}&url=${url}`
    console.log('to fetch is', toFetch)
    const res = await (await fetch(toFetch)).json()
    const { text, title } = res.objects[0]
    const thing = await Thing.create({
      title,
      integration: 'manual',
      type: 'manual',
      body: text,
    })
    console.log('created', thing)
  }

  listenForContext = async () => {
    // check
    this.setInterval(() => {
      OS.send('get-context')
    }, 500)
    // response
    OS.on('set-context', (event, info) => {
      const context = JSON.parse(info)
      if (!context) {
        this.osContext = null
        if (this.stack.last.result.type === 'context') {
          // if you want it to navigate back home automatically
          // this.stack.pop()
        }
        return
      }
      // check to avoid rerendering
      if (!this.osContext || this.osContext.title !== context.title) {
        console.log('set-context', context)
        const nextStackItem = {
          type: 'context',
          title: context.title,
          icon:
            context.application === 'Google Chrome' ? 'social-google' : null,
        }
        if (this.stack.length > 1) {
          this.stack.replace(nextStackItem)
        } else {
          this.stack.navigate(nextStackItem)
        }
        this.osContext = context
      }
    })
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

  setSearch = debounceIdle(this.setSearchImmediate, 20)

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
