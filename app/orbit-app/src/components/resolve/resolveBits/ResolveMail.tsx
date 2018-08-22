import keywordExtract from '@mcro/keyword-extract'
import { GmailBitData } from '@mcro/models'
import { getHeader } from '../../../helpers'
import { BitItemResolverProps } from '../ResolveBit'

const options = {
  remove_digits: true,
  return_changed_case: true,
  remove_duplicates: false,
}

export const ResolveMail = ({ bit, children }: BitItemResolverProps) => {
  // for now do location as the person name
  let location = ''
  const { messages } = bit.data as GmailBitData
  if (messages) {
    const lastParticipant = getHeader(messages[0], 'from')
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
