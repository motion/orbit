import keywordExtract from '@mcro/keyword-extract'
import { ItemResolverProps } from '../../ItemResolver'
import { getHeader } from '../../../helpers'

const options = {
  remove_digits: true,
  return_changed_case: true,
  remove_duplicates: false,
}

export const ResolveMail = ({ bit, children }: ItemResolverProps) => {
  // for now do location as the person name
  let location = ''
  // @ts-ignore TODO
  if (bit.data.messages) {
    // @ts-ignore TODO
    const lastParticipant = getHeader(bit.data.messages[0], 'from')
    if (lastParticipant) {
      location = lastParticipant.name || lastParticipant.email
    }
  }
  return children({
    title: bit.title,
    icon: 'gmail',
    webLink: bit.webLink,
    desktopLink: bit.desktopLink,
    location,
    locationLink: bit.location.webLink,
    content: bit.body,
    preview: keywordExtract
      .extract(bit.body, options)
      .slice(0, 6)
      .join(' '),
  })
}
