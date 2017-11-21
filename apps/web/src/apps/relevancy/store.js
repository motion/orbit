import Context from '~/context'
import { watch } from '@mcro/black'
import { Thing } from '~/app'
import { debounce } from 'lodash'

export default class {
  clearId = null
  willMount() {
    window.relevancy = this
    this.clearId = setInterval(() => {
      this.sentences = this.context && this.context.sentences
    }, 40)
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
  }, 50)
  @watch allItems = () => Thing.find()

  @watch context = () => this.allItems && new Context(this.allItems || [])

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
  }

  get items() {
    this.search
    return !this.context || this.context.loading
      ? []
      : this.context.search(this.search)
  }
}
