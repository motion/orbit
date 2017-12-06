function main() {
  setInterval(() => {
    postMessage('hello! ' + Math.random())
  }, 1000)
  console.log('in main')
}

main()
