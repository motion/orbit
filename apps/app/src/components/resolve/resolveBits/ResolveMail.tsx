import * as Helpers from '../../../helpers'
import keywordExtract from 'keyword-extractor'
import * as _ from 'lodash'

const options = {
  language: 'english',
  remove_digits: true,
  return_changed_case: true,
  remove_duplicates: false,
}

export const ResolveMail = ({ bit, children }) =>
  children({
    title: keywordExtract
      .extract(bit.title, options)
      .slice(0, 4)
      .map(_.capitalize)
      .join(' '),
    icon: 'gmail',
    location: Helpers.getHeaderFromShort(bit),
    date: Date.now(),
    content: bit.body,
    preview: keywordExtract
      .extract(bit.body, options)
      .slice(0, 6)
      .join(' '),
  })
