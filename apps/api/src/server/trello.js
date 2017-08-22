// import request from 'request-promise'

const apiKey = 'c6b4ba882e6b2afa18ac5367654f4ebb'
const secret =
  '3f58daaec7afe2d46c723d13307394b5e3a41ad451724df2423e9ecaec654ee4'
const nicksToken =
  '8804960f461f8e7090da095b85271623c978901313f587d9ea25e21a33a494c8'
const boardId = 'bz6JJ0Dc'
const base = 'https://api.trello.com/1'
const boardPath = `/boards/${boardId}/cards`
const cardPath = id => `/cards/${id}/actions`
const boardUrl = `${base}${boardPath}?key=${apiKey}&token=${nicksToken}`
const cardUrl = id => `${base}${cardPath(id)}?key=${apiKey}&token=${nicksToken}`

export default new class TrelloHandler {
  async getCard(card) {
    // const val = await request(cardUrl(card.id))
    const val = {}
    return {
      card: { id: card.id, name: card.name },
      comments: JSON.parse(val),
    }
  }

  async getAllCards() {
    const val = {}
    // const val = JSON.parse(await request(boardUrl))

    const cards = await Promise.all(val.map(this.getCard))

    return cards.map(card => {
      return {
        card: card.card,
        comments: card.comments.map(action => ({
          author: action.memberCreator.fullName,
          date: +new Date(action.date),
          content: action.data.text,
        })),
      }
    })
  }
}()
