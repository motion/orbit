import article from "./article"
import { store } from "@mcro/black"
import { uniqBy, sortBy, reverse, includes } from "lodash"

// const entityFinder = require('entity-finder')
const terms = [
  "bitcoin",
  "ethereum",
  "ripple",
  "stellar",
  "monero",
  "litecoin",
  "blockchain",
  "cryptocurrency",
  "cryptocurrencies"
]

const q = `${terms.join(" OR ")}`
const apiKey = `6f7abaf1d01a4ca6bf53fa573e6a3aab`
const pageSize = 5
const urlBase = `https://newsapi.org/v2/everything`

export default class RelevancyStore {
  article = article
  highlight = null
  entities = []
  version = 0

  getEntities = async texts => {
    const url = `${urlBase}?language=en&pageSize=${pageSize}&q=${q}&apiKey=${apiKey}`
    console.log("url is", url)
    // const { articles } = await (await fetch(url)).json()
    // const titles = articles.map(_ => _.title)
    const json = JSON.stringify(texts)
    const python = `http://localhost:5000?news=${json}`
    const values = await (await fetch(python)).json()
    console.log("values are", values)
    return values
  }

  wiki = async text => {
    const url =
      "https://en.wikipedia.org/w/api.php?action=query&format=json&limit=15&callback=?&titles=doge"
    const vals = (await fetch(url)).json()
    console.log("vals are", vals)
  }

  async fetch() {
    window.relevancy = this

    let entities = await this.getEntities([this.article])
    entities = entities[0]
    entities = uniqBy(entities, "text")
    const labels = ["gpe", "person", "org", "person"]
    console.log("raw entities are", entities)
    const names = entities
      .filter(({ label }) => includes(labels, label.toLowerCase()))
      .map(_ => _.text.toLowerCase())
    console.log("names are", names)

    this.entities = reverse(sortBy(names, word => word.split(" ").length))
    this.version += 1
  }

  constructor() {
    this.fetch()
  }
}
