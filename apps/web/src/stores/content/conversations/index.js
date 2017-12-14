const convo = obj => ({
  ...obj,
  messages: obj.messages.map(line => {
    const [author, message] = line.split(': ')
    return { author, message }
  }),
  body: obj.messages.join('\n'),
})

const conv1 = convo({
  type: 'slack',
  messages: [
    `nickc: there's been an outage this morning in NYC. It was because our EC2 instance for payment processing went down. We'll be comping all deliveries made between 9:15am - 9:40pm EST`,
    `josh: sounds good! Hope it didn't cause too much stress!`,
    'nickc: I definitely would have preferred if it outages would be kind enough to only happen in the afternoon :)',
  ],
})

const conv2 = convo({
  type: 'intercom',
  messages: [
    `kasia: hi! I ordered some dumplings 20 minutes ago but the driver never loaded on my map. I use Android.`,
    `nickc: Hi Kasia. We've had a few similar reports this week of map issues. Let me check where your driver is, one minute.`,
    `nickc: Okay it looks like your driver is coming over from Oakland at the moment. Want me to have him call you when he's nearby?`,
    `kasia: yes, that would be awesome. Thanks Nick!`,
    `nickc: Let me know if I can help with anything else. Enjoy your dumplings!`,
  ],
})

export default [conv1, conv2]
