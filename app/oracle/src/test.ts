import { Oracle } from './Oracle'

async function main() {
  const oracle = new Oracle({
    port: 5000,
    onMessage(x, y) {
      console.log('message', x, y)
    },
  })
  await oracle.start()
}

main()
