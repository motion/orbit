import { findContiguousPorts } from './findContiguousPorts'

async function main() {
  const ports = await findContiguousPorts(3, 3333)
  console.log('found ports', ports)
}

main()
