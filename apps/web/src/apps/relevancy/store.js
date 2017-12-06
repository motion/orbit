import Search from '~/search'
import { watch } from '@mcro/black'
import { Thing } from '~/app'
import { debounce, flatten, range } from 'lodash'

export default class {
  clearId = null
  allItems = null

  willMount() {
    window.relevancy = this
    this.clearId = setInterval(() => {
      this.sentences = this.context && this.context.sentences
    }, 40)

    this.getData()
  }

  async getData() {
    const text = await (await fetch('/dropbox.json')).json()
    const tens = text => {
      const lines = text.split('\n\n')

      return range(Math.floor(lines.length / 10)).map(i =>
        lines.slice(i * 10, (i + 1) * 10).join('\n')
      )
    }

    this.allItems = flatten(
      text.map(({ body, title }) => {
        return { title, body }
      })
    )
  }

  willUnmount() {
    console.log('clearning')
    clearInterval(this.clearId)
  }

  sentences = []
  search = ''
  textboxVal = ''

  setSearch = debounce(val => {
    this.textboxVal = val
    this.search = val
    if (this.context) {
      this.context.searchText = val
    }
  }, 50)
  // @watch allItems = () => Thing.find()

  @watch
  context = () => this.allItems && new Search({ items: this.allItems || [] })

  crawl = async () => {
    const val = await (await fetch('http://localhost:3000')).json()
    val.forEach(item => {
      Thing.create({
        title: item.title,
        bucket: 'dropbox',
        body: item.content,
        integration: 'manual',
        type: 'manual',
        url: item.url,
      })
    })
    console.log('val is', val)
  }

  get items() {
    this.search
    return !this.context || this.context.loading
      ? []
      : this.context.search(this.search)
  }
}
