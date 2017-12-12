import SearchStore from '~/stores/searchStore'
import ContentStore from '~/stores/contentStore'

const hasString = (string, word) => string.indexOf(word) > -1
const useWorker = !hasString(window.location + '', '?noWorker')
const useDemo = true

const content = new ContentStore()

export default class RelevancyStore {
  query = ''
  textboxVal = ''
  results = []
  search = new SearchStore({ useWorker })
  autocomplete = []

  async willMount() {
    window.relevancy = this

    await this.getData()
    this.react(
      () => this.query,
      async () => {
        const val = await this.search.getResults(this.query)
        console.log('got val', val)
        if (val === false) {
          return false
        }
        this.results = val.results
        this.autocomplete = val.autocomplete
      },
      true
    )
  }

  async getDropboxData() {
    return await (await fetch('/dropbox.json')).json()
  }

  async getData() {
    const documents = useDemo ? content.data : await this.getDropboxData()
    this.documents = documents
    this.search.setDocuments(documents)
  }
}
