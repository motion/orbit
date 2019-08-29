import { Oracle } from './Oracle'

async function main() {
  const oracle = new Oracle({
    port: 5000,
    onMessage({ action, value }) {
      console.log('message', action, value)
    },
  })
  await oracle.start()
}

main()
