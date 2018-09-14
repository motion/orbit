import { getCovariance } from './getCovariance'
import { toCosal } from './toCosal'

async function main() {
  const covar = getCovariance([])
  const cosal = await toCosal(
    'We choose to go to the moon. We choose to go to the moon in this decade and do the other things, not because they are easy, but because they are hard, because that goal will serve to organize and measure the best of our energies and skills, because that challenge is one that we are willing to accept, one we are unwilling to postpone, and one which we intend to win, and the others, too. It is for these reasons that I regard the decision last year to shift our efforts in space from low to high gear as among the most important decisions that will be made during my incumbency in the office of the Presidency.',
    covar,
  )
  console.log('cosal', cosal)
}

main()
