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
    `josh: today I'm working on the final fixes to the new iPhone X screen updates. Should be good to go by this afternoon.`,
    `josh: sounds good! Hope it didn't cause too much stress!`,
    `nickc: actually Apple made it pretty easy :)`,
  ],
})

const conv2 = convo({
  type: 'slack',
  messages: [
    `samantha: a few customers have mentioned that we don't support iPhone X screen size`,
    `josh: yeah, the app team discussed this yesterday. Going to put it in the next sprint.`,
    `tom: does React native make this fairly automatic or do we need to roll it ourselves?`,
    `josh: I'm not sure. I'll do more research this week`,
  ],
})

/*
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
*/

export default [conv1, conv2]
