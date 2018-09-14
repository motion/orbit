import { getCovariance } from './getCovariance'
import { toCosal } from './toCosal'

async function main() {
  const covar = getCovariance([])
  const cosal = await toCosal(
    'ok github.com/motion/macro/issues/253 First one is I started a roadmap ticket to organize post-launch stuff Starting announcements so we can put big things here for people to see, especially for stuff where we all need to run commands or look at something. We should avoid talking about anything here (maybe I\'ll lock it in some way if possible)',
    covar,
  )
  console.log('cosal', cosal)
}

main()
