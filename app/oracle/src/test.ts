import { Oracle } from './Oracle'

async function main() {
  const oracle = new Oracle({
    port: 5000,
    onMessage({ message, value }) {
      console.log('message', message, value)
    },
  })
  await oracle.start()
}

main()
