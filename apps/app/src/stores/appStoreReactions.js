import { react } from '@mcro/black'
import { App } from '@mcro/stores'
import { Bit, Person } from '@mcro/models'

export const selectedBitReaction = react(
  () => App.peekState.bit,
  async bit => {
    if (!bit) {
      return null
    }
    console.log('selectedBit', bit.type)
    if (bit.type === 'person') {
      return await Person.findOne({ id: bit.id })
    }
    if (bit.type === 'setting') {
      return bit
    }
    if (bit.type === 'team') {
      return bit
    }
    const res = await Bit.findOne({
      where: {
        id: bit.id,
      },
      relations: ['people'],
    })
    return res
  },
  { log: false, delay: 32 },
)
