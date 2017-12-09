import SearchStore from '~/stores/searchStore'

const hasString = (string, word) => string.indexOf(word) > -1
const useWorker = !hasString(window.location + '', '?noWorker')

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
        if (val === false) {
          return false
        }
        this.results = val.results
        this.autocomplete = val.autocomplete
      },
      true
    )
  }

  async getData() {
    const documents = await (await fetch('/dropbox.json')).json()
    this.documents = documents
    this.search.setDocuments(documents)
  }
}
