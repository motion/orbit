import { flatten } from 'lodash'
import Twit from 'twit'

const T = new Twit({
  consumer_key: 'EdQBcYMBKCk6so7WcqGk0I4U9',
  consumer_secret: 'M8RjbYyhs5X07HYSKsvYg66uYoOdmIec1aj28gMhjjLrSjm8Ov',
  access_token: '24761783-z9bUgT1wXfIyDAqC9Tp98ZiPEeab8fkERd0ihRT5W',
  access_token_secret: '4kWCptsQnHhiC67c41wF3dgwaFD1IgbAGr86dETiICEwH',
})

const getTweets = async user =>
  new Promise(res => {
    const options = {
      screen_name: user,
      count: 250,
    }

    T.get('statuses/user_timeline', options, (err, data) => {
      const vals = data.map(item => {
        const isRetweet = !!item['retweeted_status']
        const retweetInfo = isRetweet && item['retweeted_status']
        const id = isRetweet ? retweetInfo.id : item.id
        const originalHandle = isRetweet
          ? retweetInfo['user']['screen_name']
          : null

        return {
          createdAt: item['created_at'],
          handle: item['user']['screen_name'],
          originalHandle,
          text: item['text'],
          id,
        }
      })
      res(vals)
    })
  })

const getResults = async users => {
  return await Promise.all(users.map(getTweets))
}

export default async (users = []) => {
  const tweets = flatten(await getResults(users))

  return tweets
}
