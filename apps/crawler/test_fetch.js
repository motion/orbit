require('isomorphic-fetch')

const get = async () => {
  const text = await (await fetch('https://github.com/motion/orbit/issues/88')).text()
  console.log('text is', text)
}

get()

