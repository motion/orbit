const cardUrl = `http://api.jot.dev/trello/cards`

class Atom {
  async getAll() {
    return await (await fetch(cardUrl)).json()
  }

  async onsubmit() {}
}

export default new Atom()
